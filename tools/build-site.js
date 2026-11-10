/* Build: SEO <head> + schema.org for every page, the blog (index + posts), a blog teaser on the homepage,
   testimoni.html, sitemap.xml, robots.txt, llms.txt and llms-full.txt.
   Run from anywhere: node tools/build-site.js */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const S = require('./site.config');
const R = require('./render');
const readJson = (f) => JSON.parse(fs.readFileSync(path.join(root, f), 'utf8'));
const POSTS = readJson('content/blog-posts.json');
const HOME = readJson('content/home.json');
const VIDEOS = readJson('content/testimonial-videos.json');
const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
let versionAssets = (h) => h;
const CONTACT = require('./contact');
const CONTACT_APPLY = (f, s) => (/\.(html|txt)$/.test(f) ? CONTACT.apply(s) : s);   // content/contact.json everywhere
const write = (f, s) => { fs.mkdirSync(path.dirname(path.join(root, f)), { recursive: true }); fs.writeFileSync(path.join(root, f), CONTACT_APPLY(f, f.endsWith('.html') ? versionAssets(s) : s)); };
const strip = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/\s+/g, ' ').trim();
const MONTHS = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const idDate = (iso) => { const [y, m, d] = iso.split('-').map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const postUrl = (p) => `${S.SITE}/blog/${p.slug}.html`;
const BLOG_URL = `${S.SITE}/blog/`;
const ARROW = '<svg class="arr" viewBox="0 0 12 12" aria-hidden="true"><path d="M2 6h7.5M6.5 3l3 3-3 3" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let idx = read('index.html');

/* ---------- contact (content/contact.json) ---------- */
{
  const errs = CONTACT.validate(CONTACT.load());
  if (errs.length) throw new Error('content/contact.json tidak valid: ' + errs.join(' '));
  const appJs = read('app.js');
  const a = appJs.indexOf('/* CONTACT:START */'), b = appJs.indexOf('/* CONTACT:END */') + '/* CONTACT:END */'.length;
  if (a < 0 || b < a) throw new Error('CONTACT markers missing in app.js');
  write('app.js', appJs.slice(0, a) + CONTACT.appJsBlock(CONTACT.load()) + appJs.slice(b));
}

/* ---------- theme (content/theme.json -> content/themes/<name>.json) ---------- */
const TH = require('./themes');
const THEME = TH.load(TH.active());
const failedPairs = TH.contrastReport(THEME).filter((x) => !x.lolos);
if (failedPairs.length) throw new Error(`Tema ${THEME.name} gagal cek kontras: ${failedPairs.map((x) => `${x.pasangan} ${x.rasio} (min ${x.minimal})`).join('; ')}`);
{
  let css = read('styles.css');
  const a = css.indexOf('/* THEME:START */'), b = css.indexOf('/* THEME:END */') + '/* THEME:END */'.length;
  if (a < 0 || b < a) throw new Error('THEME markers missing in styles.css');
  write('styles.css', css.slice(0, a) + TH.rootCss(THEME) + css.slice(b));
}
fs.copyFileSync(path.join(root, THEME.logo), path.join(root, 'assets/brand/logo-symbol.png'));
if (fs.existsSync(path.join(root, THEME.og))) fs.copyFileSync(path.join(root, THEME.og), path.join(root, 'assets/og/og-default.jpg'));
const CSS_V = `${THEME.name}-${require('crypto').createHash('md5').update(read('styles.css')).digest('hex').slice(0, 8)}`;
versionAssets = (h) => h   // cache-busting so a theme switch shows at once
  .replace(/(styles\.css)(\?v=[\w-]+)?"/g, `$1?v=${CSS_V}"`)
  .replace(/(logo-symbol\.png)(\?v=[\w-]+)?"/g, `$1?v=${THEME.name}"`)
  .replace(/(og-default\.jpg)(\?v=[\w-]+)?"/g, `$1?v=${THEME.name}"`)
  .replace(/<meta name="theme-color" content="[^"]*" \/>/, `<meta name="theme-color" content="${THEME.themeColor}" />`);
idx = versionAssets(idx);

/* ---------- 0. data-driven homepage parts (content/home.json, content/testimonial-videos.json) ---------- */
idx = R.between(idx, 'HERO', R.hero(HOME.hero));
idx = R.between(idx, 'FAQ', R.faq(HOME.faq));
idx = R.between(idx, 'PROGRAMS', R.programs(HOME.programs));
idx = R.between(idx, 'TESTI_TILES', R.testiTiles(VIDEOS));
write('app.js', R.between(read('app.js'), 'TESTI', R.testiData(VIDEOS), 'js'));

/* ---------- 1. homepage: SEO markers (one-time migration), nav + footer links, blog teaser ---------- */
if (!idx.includes('<!-- SEO:START')) {
  idx = idx
    .replace(/\s*<title>[^<]*<\/title>/, '')
    .replace(/\s*<meta name="description"[^>]*>/, '')
    .replace(/\s*<meta property="og:[^>]*>/g, '')
    .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/, '')
    .replace('<meta name="theme-color" content="#FFFDF8" />', '<meta name="theme-color" content="#FFFDF8" />\n  <!-- SEO:START --><!-- SEO:END -->');
}
if (!idx.includes('<a href="./blog/">Blog</a>')) {
  idx = idx.replace(/(<a href="#jaringan">Cabang<\/a>)/, '$1\n            <a href="./blog/">Blog</a>');
  idx = idx.replace(/(<li><button type="button" data-open-consult="Informasi Program Beasiswa Kedinasan">Beasiswa kedinasan<\/button><\/li>)/,
    '$1\n            <li><a href="./blog/">Blog dan panduan</a></li>');
}
const teaser = `<!-- BLOG-TEASER:START -->
    <section class="section blog-teaser" aria-labelledby="teaser-title">
      <div class="container">
        <div class="teaser-head">
          <h2 class="h2" id="teaser-title">Panduan untuk orang tua dan siswa.</h2>
          <a class="text-link" href="./blog/">Semua artikel</a>
        </div>
        <ol class="post-rows">
${POSTS.slice(0, 3).map((p) => `          <li><a class="post-row" href="./blog/${p.slug}.html"><span class="post-row-meta">${p.category} · ${p.minutes} menit baca</span><b>${S.esc(p.title)}</b><span class="post-row-desc">${S.esc(p.description)}</span></a></li>`).join('\n')}
        </ol>
      </div>
    </section>
    <!-- BLOG-TEASER:END -->`;
if (idx.includes('<!-- BLOG-TEASER:START')) idx = idx.replace(/<!-- BLOG-TEASER:START -->[\s\S]*?<!-- BLOG-TEASER:END -->/, teaser);
else idx = idx.replace('    <!-- ================= CLOSING', `    ${teaser}\n\n    <!-- ================= CLOSING`);

// homepage FAQ -> FAQPage (skip answers that still hold placeholders)
const homeFaq = [...idx.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)]
  .filter((m) => !m[2].includes('class="ph"')).map((m) => [strip(m[1]), strip(m[2])]);
const programs = HOME.programs.map((p) => [p.name, strip(`${p.for} ${p.place}. ${p.format}. ${p.feature.replace(/<span class="ph">[\s\S]*?<\/span>/g, '')}`), 'onsite']);
const home = `${S.SITE}/`;
idx = S.replaceSeo(idx, S.seoHead({
  title: 'Bimbel Infinity · Persiapan PKN STAN di Bintaro sejak 2013',
  description: 'Bimbel persiapan PKN STAN di Bintaro, Tangerang Selatan. Didirikan mahasiswa PKN STAN pada 17 April 2013; tentor mahasiswa dan alumni PKN STAN; kelas reguler, karantina, dan cabang daerah.',
  url: home,
  graph: [
    S.orgNode(), S.websiteNode(),
    { '@type': 'WebPage', '@id': home, url: home, name: 'Bimbel Infinity · Persiapan PKN STAN di Bintaro sejak 2013', inLanguage: 'id-ID',
      isPartOf: { '@id': `${S.SITE}/#website` }, about: { '@id': `${S.SITE}/#organization` }, primaryImageOfPage: S.OG_IMAGE },
    ...programs.map(([name, description, mode]) => ({ '@type': 'Course', name: `${name} · Persiapan SKD PKN STAN`, description, courseMode: mode,
      inLanguage: 'id-ID', teaches: 'TWK, TIU, dan TKP (SKD PKN STAN)', provider: { '@id': `${S.SITE}/#organization` } })),
    S.faqNode(homeFaq, home),
  ],
}));
write('index.html', idx);

/* ---------- 2. testimoni.html (rebuilt from the homepage shell) ---------- */
require('./build-testimoni.js');
write('testimoni.html', read('testimoni.html'));
write('404.html', read('404.html'));

/* ---------- 3. blog ---------- */
idx = read('index.html');
const cut = (a, b) => { const i = idx.indexOf(a), j = idx.indexOf(b, i + 1); if (i < 0 || j < 0) throw new Error('marker ' + a); return idx.slice(i, j); };
const toBlogPaths = (h) => h
  .replace(/(href|src|poster|data-src)="\.\/(?!blog\/)/g, '$1="../')
  .replace(/href="\.\/blog\/"/g, 'href="./"')
  .replace(/href="#(top|keunggulan|testimoni|program|faq|perjalanan|jaringan|kampus)"/g, 'href="../index.html#$1"');
const shellHead = idx.slice(0, idx.indexOf('<body>'))
  .replace(/\s*<script>document\.documentElement\.classList\.add\("mo-js"\)[^\n]*\n/, '\n')
  .replace(/\s*<link rel="modulepreload"[^\n]*\n/, '\n')
  .replace(/(href)="\.\//g, '$1="../');
const intro = toBlogPaths(cut('  <div class="intro"', '  <a class="skip-link"'));
const header = toBlogPaths(cut('  <!-- ================= FLOATING HEADER', '  <main id="main">'))
  .replace('<a href="./">Blog</a>', '<a href="./" aria-current="page">Blog</a>')
  .replace('aria-label="Bimbel Infinity, ke atas"', 'aria-label="Bimbel Infinity, ke beranda"');
const tail = toBlogPaths(cut('    <!-- ================= CLOSING', '  <script src="./app.js"'));
const page = (seo, main) => `${S.replaceSeo(shellHead, seo)}<body>
${intro}  <a class="skip-link" href="#main">Lewati ke konten</a>

${header}  <main id="main">
${main}
${tail}  <script src="../app.js" defer></script>
</body>
</html>
`;
const crumbs = (items) => `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map(([n, h]) => h ? `<li><a href="${h}">${n}</a></li>` : `<li aria-current="page">${n}</li>`).join('')}</ol></nav>`;

const blogPostingNode = (p) => ({
  '@type': 'BlogPosting', '@id': `${postUrl(p)}#article`, headline: p.title, description: p.description,
  datePublished: p.date, dateModified: p.updated || p.date, inLanguage: 'id-ID', articleSection: p.category,
  wordCount: strip(p.body).split(' ').length, image: S.OG_IMAGE, url: postUrl(p), mainEntityOfPage: postUrl(p),
  author: { '@type': 'Organization', name: 'Tim Bimbel Infinity', url: `${S.SITE}/` },
  publisher: { '@id': `${S.SITE}/#organization` }, isPartOf: { '@id': `${BLOG_URL}#blog` },
  abstract: p.summary,
});

for (const p of POSTS) {
  const others = POSTS.filter((o) => o !== p);
  const main = `    <article class="post">
      <div class="container post-wrap">
        ${crumbs([['Beranda', '../'], ['Blog', './'], [p.category]])}
        <header class="post-head">
          <h1>${S.esc(p.title)}</h1>
          <p class="post-meta">Tim Bimbel Infinity · <time datetime="${p.date}">${idDate(p.date)}</time> · ${p.minutes} menit baca · ${p.category}</p>
        </header>
        <aside class="post-summary" aria-label="Jawaban singkat">
          <b>Jawaban singkat</b>
          <p>${S.esc(p.summary)}</p>
        </aside>
        <div class="prose">${p.body.split('<table>').join('<div class="table-scroll"><table>').split('</table>').join('</table></div>')}</div>
        <section class="post-faq" aria-labelledby="faq-${p.slug}">
          <h2 id="faq-${p.slug}">Pertanyaan yang sering muncul</h2>
          <div class="faq-list">
${p.faq.map(([q, a]) => `            <details><summary>${S.esc(q)}</summary><p>${S.esc(a)}</p></details>`).join('\n')}
          </div>
        </section>
        <aside class="post-cta">
          <p><b>Masih ragu?</b> Konsultan Infinity menjawab pertanyaan orang tua dan siswa, gratis.</p>
          <div class="post-cta-actions">
            <a class="btn btn-green js-wa" href="tel:02122733744" data-msg="Halo admin Infinity, saya baru membaca artikel &quot;${S.esc(p.title)}&quot; dan ingin konsultasi.">Telepon admin</a>
            <button type="button" class="btn btn-ghost" data-open-consult>Isi formulir</button>
          </div>
        </aside>
        <nav class="post-more" aria-labelledby="more-${p.slug}">
          <h2 id="more-${p.slug}">Baca juga</h2>
          <ol class="post-rows">
${others.map((o) => `            <li><a class="post-row" href="./${o.slug}.html"><span class="post-row-meta">${o.category} · ${o.minutes} menit baca</span><b>${S.esc(o.title)}</b></a></li>`).join('\n')}
          </ol>
        </nav>
      </div>
    </article>
`;
  write(`blog/${p.slug}.html`, page(S.seoHead({
    title: `${p.title} · Blog Bimbel Infinity`, description: p.description, url: postUrl(p), type: 'article', published: p.date,
    graph: [S.orgNode(), S.websiteNode(), blogPostingNode(p),
      S.breadcrumb([['Beranda', `${S.SITE}/`], ['Blog', BLOG_URL], [p.title, postUrl(p)]]), S.faqNode(p.faq, postUrl(p))],
  }), main));
}

const blogMain = `    <section class="blog-hero">
      <div class="container">
        ${crumbs([['Beranda', '../'], ['Blog']])}
        <h1>Panduan persiapan PKN STAN untuk orang tua dan siswa.</h1>
        <p class="lead">Ditulis tim Bimbel Infinity dari pengalaman mendampingi siswa sejak 2013. Jadwal, kuota, dan nilai ambang batas berubah setiap tahun, jadi selalu cocokkan dengan pengumuman resmi PKN STAN.</p>
      </div>
    </section>
    <section class="blog-list">
      <div class="container">
        <ol class="post-rows post-rows-lg">
${POSTS.map((p) => `          <li><a class="post-row" href="./${p.slug}.html"><span class="post-row-meta">${p.category} · ${p.minutes} menit baca · <time datetime="${p.date}">${idDate(p.date)}</time></span><b>${S.esc(p.title)}</b><span class="post-row-desc">${S.esc(p.description)}</span></a></li>`).join('\n')}
        </ol>
      </div>
    </section>
`;
write('blog/index.html', page(S.seoHead({
  title: 'Blog · Panduan persiapan PKN STAN · Bimbel Infinity',
  description: 'Panduan persiapan seleksi PKN STAN dari Bimbel Infinity: penjelasan SKD (TWK, TIU, TKP), cara memilih program, cerita lulusan, dan perjalanan Infinity sejak 2013.',
  url: BLOG_URL,
  graph: [S.orgNode(), S.websiteNode(),
    { '@type': 'Blog', '@id': `${BLOG_URL}#blog`, url: BLOG_URL, name: 'Blog Bimbel Infinity', inLanguage: 'id-ID', publisher: { '@id': `${S.SITE}/#organization` },
      blogPost: POSTS.map((p) => ({ '@id': `${postUrl(p)}#article` })) },
    ...POSTS.map(blogPostingNode),
    S.breadcrumb([['Beranda', `${S.SITE}/`], ['Blog', BLOG_URL]])],
}), blogMain));

/* ---------- 4. sitemap, robots, llms ---------- */
const today = new Date().toISOString().slice(0, 10);
const urls = [[`${S.SITE}/`, today, '1.0'], [`${S.SITE}/testimoni.html`, today, '0.8'], [BLOG_URL, today, '0.8'],
  ...POSTS.map((p) => [postUrl(p), p.updated || p.date, '0.7'])];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, d, pr]) => `  <url><loc>${u}</loc><lastmod>${d}</lastmod><priority>${pr}</priority></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `# Bimbel Infinity
# Mesin pencari dan asisten AI dipersilakan membaca seluruh situs publik.
User-agent: *
Allow: /
Disallow: /_backup-original/
Disallow: /concept/
Disallow: /content/
Disallow: /tools/
Disallow: /Untuk%20Website%20Infinity/
Disallow: /404.html
Disallow: /.impeccable/
Disallow: /.taste-skill/

# Asisten dan mesin pencari AI (eksplisit diizinkan)
User-agent: GPTBot
User-agent: OAI-SearchBot
User-agent: ChatGPT-User
User-agent: ClaudeBot
User-agent: Claude-SearchBot
User-agent: Claude-User
User-agent: PerplexityBot
User-agent: Perplexity-User
User-agent: Google-Extended
User-agent: Applebot-Extended
User-agent: Bingbot
Allow: /

Sitemap: ${S.SITE}/sitemap.xml
`);

const progLines = programs.map(([n, d]) => `- **${n}**: ${d}`).join('\n');
const faqLines = homeFaq.map(([q, a]) => `- **${q}** ${a}`).join('\n');
write('llms.txt', `# Bimbel Infinity

> Bimbel persiapan seleksi PKN STAN (Politeknik Keuangan Negara STAN) di Bintaro, Tangerang Selatan, Indonesia. Didirikan oleh mahasiswa PKN STAN pada 17 April 2013. Tentornya mahasiswa dan alumni PKN STAN; gedung kelasnya tepat di depan kampus PKN STAN. Badan hukum: PT Infinity Global Inspiratif.

Fakta utama:
- Program: Reguler Bintaro, Karantina (bersama karantinastan.com), dan cabang daerah. Biaya dan jadwal dijelaskan konsultan; tidak dipublikasikan.
- Materi: SKD (Seleksi Kompetensi Dasar) berisi TWK, TIU, dan TKP.
- Pernah membuka kelas di 14 kota, antara lain Medan, Palembang, Bandung, Yogyakarta, Lombok, Jember, Surabaya, dan Makassar.
- 38 siswa Infinity dari Depok, Jember, Lombok, dan Sukabumi diterima di PKN STAN pada seleksi 2018 (147.702 pendaftar, 7.301 kursi menurut data Panselnas 2018).
- Kontak: telepon 021-22733744, email ${S.ORG.email}, Instagram @bimbelinfinity.

## Halaman utama
- [Beranda](${S.SITE}/): program, cara mengajar, video testimoni, FAQ orang tua, lokasi, dan sejarah.
- [Testimoni alumni 2018](${S.SITE}/testimoni.html): 38 lulusan dengan jurusan, asal sekolah, dan testimoni.
- [Teks lengkap untuk AI](${S.SITE}/llms-full.txt): seluruh fakta dan artikel dalam teks biasa.

## Blog
${POSTS.map((p) => `- [${p.title}](${postUrl(p)}): ${p.description}`).join('\n')}
`);
write('llms-full.txt', `# Bimbel Infinity: teks lengkap

${S.ORG.description}

Nama resmi: ${S.ORG.legalName}. Berdiri: 17 April 2013. Pendiri: Riandi Ahmad bersama Sabrina Hakim, Muhammad Sopyan, Ferdian Jati Permana, Dwi Widiatmoko, dan Fachri Ahmad (mahasiswa PKN STAN).
Kantor utama: ${S.ORG.address.streetAddress}, ${S.ORG.address.addressLocality}, ${S.ORG.address.addressRegion}.
Gedung kelas: ${S.ORG.classrooms.join('; ')}.
Kontak: telepon 021-22733744, email ${S.ORG.email}, Instagram ${S.ORG.instagram}.

## Program
${progLines}
Semua program: tentor mahasiswa dan alumni PKN STAN, modul SKD (TWK, TIU, TKP), Try Out Akbar dengan pembahasan, pendampingan sampai pengumuman.

## FAQ orang tua
${faqLines}

${POSTS.map((p) => `## ${p.title}
URL: ${postUrl(p)}
Diterbitkan: ${idDate(p.date)}

Jawaban singkat: ${p.summary}

${strip(p.body.replace(/<\/(h2|p|li|tr|blockquote)>/g, '\n'))}

Pertanyaan:
${p.faq.map(([q, a]) => `- ${q} ${a}`).join('\n')}
`).join('\n')}`);
console.log('built:', ['index.html', 'testimoni.html', 'blog/index.html', ...POSTS.map((p) => `blog/${p.slug}.html`), 'sitemap.xml', 'robots.txt', 'llms.txt', 'llms-full.txt'].join(', '));
