// Build testimoni.html from alumni.json, reusing the homepage header, footer and modals.
const fs = require('fs');
const path = require("path");
const root = path.resolve(__dirname, "..");
const A = JSON.parse(fs.readFileSync(`${root}/content/alumni-2018.json`, "utf8"));
const idx = fs.readFileSync(`${root}/index.html`, 'utf8');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Face framing for a 4:5 crop, by list order (from the contact sheet).
const POS = ['45% 30%', '50% 62%', '50% 30%', '50% 22%', '50% 22%', '58% 62%', '50% 20%',
  '50% 18%', '72% 40%', '78% 38%', '50% 20%', '50% 20%', '52% 20%', '50% 18%', '50% 20%',
  '72% 32%', '50% 25%', '76% 32%', '72% 32%', '50% 60%', '40% 52%', '50% 22%',
  '35% 62%', '45% 62%', '42% 58%', '70% 52%', '47% 52%', '72% 56%', '38% 58%', '45% 56%',
  '43% 56%', '62% 56%', '52% 56%', '68% 56%', '68% 56%', '70% 56%', '50% 54%', '45% 58%'];
A.forEach((p, i) => { p.pos = POS[i]; });
const by = (n) => { const p = A.find((a) => a.name.startsWith(n)); if (!p) throw new Error('no ' + n); return p; };

// The same sentence appears under Amanda, Ba'diyah and Ira; show it once (Amanda) to avoid looking copied.
for (const n of ["Ba'diyah", 'Ira Safiratul']) by(n).quote = '';

const cities = ['Depok', 'Jember', 'Lombok', 'Sukabumi'];
const count = (c) => A.filter((p) => p.city === c).length;
const majors = new Set(A.map((p) => p.major));
const withQuote = A.filter((p) => p.quote).length;

const img = (p, cls = '', lazy = true) =>
  `<img${cls ? ` class="${cls}"` : ''} src="./${p.img}" alt="" width="400" height="500"${lazy ? ' loading="lazy" decoding="async"' : ''} style="object-position:${p.pos}" />`;
const meta = (p) => `${esc(p.major)} · ${esc(p.school)}`;

// ---------- hero mosaic ----------
const mosaic = ['Salsabila', 'Imer', 'Novita', 'Muhammad Baihaqi', 'Amanda', 'Jundan']
  .map((n, i) => `<li class="tm-${i + 1}">${img(by(n), '', false)}</li>`).join('\n            ');

// ---------- featured ----------
const F = by('Maridean');
const featuredQuote = 'Yg paling berkesan buat aku adalah sesi hipnoterapinya. … Aku merasa banyak bgt dapet motivasi dari sesi itu.';

const picks = [
  ['Nafira', 'Tentor yang friendly dan asik diajak sharing membuat Saya mengerti materi terutama bahasa inggris yang sebelumnya saya sama sekali tidak bisa. Terimakasih INFINITY, sekarang saya bisa masuk dijurusan yang saya inginkan.'],
  ['Dennis', 'Mendapatkan kesempatan beasiswa les di Bimbel Infinity Sukabumi sangat membantu saya untuk menggapai cita - cita saya untuk masuk di PKN STAN.'],
  ['Muhammad Yoga', 'Banyak trik cepat yang diajarkan para tentor sehingga mempermudah kita dalam mengerjakan soal-soal yang sering keluar dalam SPMB PKN STAN.'],
  ['Delyuzar', 'Sebelum saya Les, saya Gak tau apa-apa tentang sistem Dan trik buat masuk STAN. Tapi setelah gabung, Infinity sudah sangat membantu saya.'],
  ['Arin', 'Tentornya juga sabar, tekun, telaten sekali, meskipun saya bertanya pertanyaan berulang-ulang, hehe.'],
  ['Praditya', 'Saya yang awal sama sekali tidak paham pengerjaan TBI. Setelah bimbel di Infinity saya tahu trik dalam mengerjakan soal SPMB STAN terutama TBI.'],
  ['Ghanifrizal', 'Kuliah di STAN adalah impian besar yang paling saya harapkan dan infinity sangat membantu dalam hal materi dan pemberian motivasinya.'],
  ['Farah', 'Belajar di infinity seru banget dan membantu untuk lulus USM STAN. Guru gurunya asyik dan siap selalu untuk ditanya soal kapan aja.'],
  ['Novita', 'Dengan tentornya yang hebat dan seru. Serta buku rumus cepat dari Infinity, Yang menjadi favorite saya.'],
];
const quoteCards = picks.map(([n, q]) => {
  const p = by(n);
  return `          <figure class="tq">
            <blockquote><p>“${esc(q)}”</p></blockquote>
            <figcaption>
              ${img(p, 'tq-face')}
              <span><b>${esc(p.name)}</b><span>${esc(p.major)} · Infinity ${p.city}</span></span>
            </figcaption>
          </figure>`;
}).join('\n');

// ---------- wall ----------
const wall = A.map((p) => `          <li class="al" data-city="${p.city}">
            <div class="al-photo">${img(p)}${p.scholarship ? '<span class="al-tag">Beasiswa</span>' : ''}</div>
            <div class="al-body">
              <b class="al-name">${esc(p.name)}</b>
              <span class="al-major">${esc(p.major)}</span>
              <span class="al-meta">${esc(p.school)} · Infinity ${p.city}</span>
              ${p.quote ? `<button type="button" class="al-read" data-alumni="${p.slug}">Baca testimoni</button>
              <template id="q-${p.slug}">${esc(p.quote)}</template>` : ''}
            </div>
          </li>`).join('\n');

const chips = [`<button type="button" class="chip" data-city-filter="all" aria-pressed="true">Semua <span>${A.length}</span></button>`]
  .concat(cities.map((c) => `<button type="button" class="chip" data-city-filter="${c}" aria-pressed="false">${c} <span>${count(c)}</span></button>`))
  .join('\n            ');

// ---------- shell from index.html ----------
const cut = (a, b) => { const i = idx.indexOf(a), j = idx.indexOf(b, i); if (i < 0 || j < 0) throw new Error('marker ' + a); return idx.slice(i, j); };
const SEO = require('./site.config');
const SEOP = JSON.parse(fs.readFileSync(`${root}/content/seo.json`, 'utf8')).pages.testimoni;
const pageUrl = `${SEO.SITE}/testimoni.html`;
let head = idx.slice(0, idx.indexOf('<body>'));
head = head
  .replace(/\s*<script>document\.documentElement\.classList\.add\("mo-js"\)[^\n]*\n/, '\n')
  .replace(/\s*<link rel="modulepreload"[^\n]*\n/, '\n');
head = SEO.replaceSeo(head, SEO.seoHead({
  title: SEOP.title,
  description: SEOP.description.replace('{count}', A.length),
  url: pageUrl,
  graph: [
    SEO.orgNode(), SEO.websiteNode(),
    { '@type': 'CollectionPage', '@id': pageUrl, url: pageUrl, name: 'Testimoni alumni Bimbel Infinity 2018', inLanguage: 'id-ID',
      isPartOf: { '@id': `${SEO.SITE}/#website` }, about: { '@id': `${SEO.SITE}/#organization` },
      description: `${A.length} siswa Bimbel Infinity lulus PKN STAN 2018: Depok ${A.filter((p) => p.city === 'Depok').length}, Jember ${A.filter((p) => p.city === 'Jember').length}, Lombok ${A.filter((p) => p.city === 'Lombok').length}, Sukabumi ${A.filter((p) => p.city === 'Sukabumi').length}.` },
    SEO.breadcrumb([['Beranda', `${SEO.SITE}/`], ['Testimoni alumni', pageUrl]]),
  ],
}));

let header = cut('  <!-- ================= FLOATING HEADER', '  <main id="main">');
header = header
  .replace(/href="#top"/g, 'href="./index.html"')
  .replace(/aria-label="Bimbel Infinity, ke atas"/, 'aria-label="Bimbel Infinity, ke beranda"')
  .replace(/<a href="#(keunggulan|program|faq|perjalanan|jaringan|kampus)">/g, '<a href="./index.html#$1">')
  .replace('<a href="#testimoni">', '<a href="./testimoni.html" aria-current="page">');

const closingFooter = cut('    <!-- ================= CLOSING', '  <!-- ================= MODALS');
const consult = cut('  <dialog class="modal modal-form" id="consult-modal"', '  <script src="./app.js"');

const html = `${head}<body>
  <div class="intro" aria-hidden="true">
    <div class="intro-mark">
      <img src="./assets/brand/logo-symbol.png" alt="" width="351" height="230" />
      <span class="intro-line"><i></i></span>
    </div>
    <svg class="intro-edge" viewBox="0 0 1440 200" preserveAspectRatio="none">
      <path d="M0 0H1440V150C1100 240 380 60 0 200Z" fill="var(--curve-c)"/>
      <path d="M0 0H1440V105C1100 195 380 15 0 155Z" fill="var(--curve-b)"/>
      <path d="M0 0H1440V60C1100 150 380 -30 0 110Z" fill="var(--paper)"/>
    </svg>
  </div>
  <a class="skip-link" href="#main">Lewati ke konten</a>

${header}  <main id="main">
    <!-- ================= HERO ================= -->
    <section class="t-hero">
      <div class="container t-hero-grid">
        <div class="t-hero-text">
          <a class="t-back" href="./index.html#testimoni"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3 5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>Beranda</a>
          <h1 class="t-h1">${A.length} siswa Infinity lulus PKN STAN 2018. Ini mereka.</h1>
          <p class="hero-lead">Arsip kelulusan dari empat cabang: Depok, Jember, Lombok, dan Sukabumi. Nama, jurusan, dan asal sekolah dari data kami; testimoni ditulis siswa sendiri dan kami tampilkan apa adanya.</p>
          <dl class="t-facts">
            <div><dt>Lulusan 2018</dt><dd>${A.length}</dd></div>
            <div><dt>Cabang</dt><dd>${cities.length}</dd></div>
            <div><dt>Program studi</dt><dd>${majors.size}</dd></div>
          </dl>
          <div class="hero-actions">
            <a class="btn btn-green" href="#alumni">Lihat semua lulusan</a>
            <button type="button" class="btn btn-ghost" data-open-consult>Konsultasi gratis</button>
          </div>
        </div>
        <div class="t-hero-visual" aria-hidden="true">
          <ul class="t-mosaic">
            ${mosaic}
          </ul>
          <svg class="curve t-curve" viewBox="0 0 600 400" preserveAspectRatio="none"><path d="M600 0C470 60 430 220 250 400H340C480 250 520 120 600 96Z" fill="var(--curve-b)"/><path d="M600 96C520 120 480 250 340 400H600Z" fill="var(--curve-c)"/></svg>
        </div>
      </div>
    </section>

    <!-- ================= FEATURED ================= -->
    <section class="section section-green t-feature" aria-labelledby="feature-name">
      <div class="container t-feature-grid">
        <div class="t-feature-photo">${img(F)}</div>
        <figure class="t-feature-quote">
          <blockquote><p>“${featuredQuote}”</p></blockquote>
          <figcaption>
            <b id="feature-name">${esc(F.name)}</b>
            <span>${meta(F)} · Infinity ${F.city}</span>
          </figcaption>
          <button type="button" class="btn btn-lime" data-alumni="${F.slug}">Baca testimoni lengkap</button>
        </figure>
      </div>
    </section>

    <!-- ================= KATA MEREKA ================= -->
    <section class="section" aria-labelledby="kata-title">
      <div class="container">
        <div class="sec-head sec-head-split">
          <h2 class="h2" id="kata-title">Yang paling sering mereka ceritakan: tentor dan trik cepat.</h2>
          <p class="lead">Kutipan di bawah dipotong dari testimoni tertulis siswa (tanda … menandai bagian yang dilewati). Ejaannya tidak kami ubah. ${withQuote} dari ${A.length} lulusan menulis testimoni.</p>
        </div>
        <div class="tq-grid">
${quoteCards}
        </div>
      </div>
    </section>

    <!-- ================= SEMUA LULUSAN ================= -->
    <section class="section section-soft" id="alumni" aria-labelledby="alumni-title">
      <div class="container">
        <div class="t-wall-head">
          <h2 class="h2" id="alumni-title">Semua lulusan 2018</h2>
          <div class="chips" role="group" aria-label="Saring menurut cabang">
            ${chips}
          </div>
        </div>
        <ul class="al-grid" id="alumni-grid">
${wall}
        </ul>
        <p class="t-note" id="alumni-count" aria-live="polite"></p>
        <p class="t-note">Data dan foto dari arsip Bimbel Infinity. Siswa Lombok tidak menyertakan testimoni tertulis. Lulusan yang ingin datanya diubah atau dihapus dapat menghubungi admin di <a class="text-link" href="mailto:bimbelinfinityid@gmail.com">bimbelinfinityid@gmail.com</a>.</p>
      </div>
    </section>

${closingFooter}  <!-- ================= MODALS ================= -->
  <dialog class="modal modal-narrow" id="alumni-modal" aria-labelledby="alumni-modal-name">
    <div class="modal-head">
      <div class="am-head">
        <img id="alumni-modal-img" src="" alt="" width="400" height="500" />
        <div>
          <h3 id="alumni-modal-name"></h3>
          <p id="alumni-modal-meta" class="muted"></p>
        </div>
      </div>
      <button type="button" class="modal-close" data-close aria-label="Tutup">×</button>
    </div>
    <blockquote class="am-quote"><p id="alumni-modal-quote"></p></blockquote>
  </dialog>

${consult}  <script src="./app.js" defer></script>
  <script src="./testimoni.js" defer></script>
</body>
</html>
`;
fs.writeFileSync(`${root}/testimoni.html`, html);

console.log('ok', A.length, 'majors', majors.size, [...majors].join(', '), 'quotes', withQuote);
