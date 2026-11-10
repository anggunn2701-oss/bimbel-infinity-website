/* Panduan MCP Infinity Konten (PDF). Part A is written for non-IT readers, part B for developers.
   The tool reference is read from mcp/core.js and the theme colours from content/themes, so both stay accurate.

   Three variants; secrets are read from the environment only and never written into this repository:
     node tools/build-mcp-guide.js                       -> docs/Panduan-MCP-Infinity-Konten.pdf (no secrets, in repo)
     GUIDE_VARIANT=ai GUIDE_TOKEN=... GUIDE_OUT=...       -> version for AI assistants (MCP token, no password)
     GUIDE_VARIANT=personal GUIDE_TOKEN=... GUIDE_PASSWORD=... GUIDE_OUT=...  -> personal archive (everything)
   Keep the ai/personal outputs outside the repository. */
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');
const { TOOLS } = require('../mcp/core.js');

const VARIANT = process.env.GUIDE_VARIANT || 'repo';
const TOKEN = VARIANT === 'repo' ? '' : (process.env.GUIDE_TOKEN || '');
const PASSWORD = VARIANT === 'personal' ? (process.env.GUIDE_PASSWORD || '') : '';
if (VARIANT !== 'repo' && !TOKEN) throw new Error('GUIDE_TOKEN wajib untuk varian ' + VARIANT);
if (VARIANT === 'personal' && !PASSWORD) throw new Error('GUIDE_PASSWORD wajib untuk varian personal');
const OUT = process.env.GUIDE_OUT || path.join(root, 'docs', 'Panduan-MCP-Infinity-Konten.pdf');
if (VARIANT !== 'repo' && path.resolve(OUT).startsWith(root)) throw new Error('Varian berisi rahasia harus disimpan di luar folder repo.');

const MASTER_EMAIL = 'anggunn.2701@gmail.com';
const MCP_URL = 'https://mcp-infinity.up.railway.app/mcp';
const TOKEN_SHOW = TOKEN || '&lt;MCP_TOKEN&gt;';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const code = (s) => `<pre><code>${esc(s.trim()).replace(/&amp;lt;MCP_TOKEN&amp;gt;/g, '&lt;MCP_TOKEN&gt;')}</code></pre>`;
const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
const N = Object.keys(TOOLS).length;
const T = (s) => s.replace(/<MCP_TOKEN>/g, TOKEN || '<MCP_TOKEN>');

/* ---------- themes from the real theme files ---------- */
const themeDir = path.join(root, 'content/themes');
const THEMES = fs.readdirSync(themeDir).filter((f) => f.endsWith('.json')).map((f) => JSON.parse(fs.readFileSync(path.join(themeDir, f), 'utf8')));
const ACTIVE = JSON.parse(fs.readFileSync(path.join(root, 'content/theme.json'), 'utf8')).active;
const sw = (hex, label) => `<span class="sw"><i style="background:${hex}"></i>${label}<br><small>${hex}</small></span>`;
const themeCards = THEMES.map((t) => `
  <div class="theme">
    <div class="theme-head"><b>Tema "${t.name}"</b>${t.name === ACTIVE ? '<span class="pill">sedang aktif</span>' : ''}</div>
    <p>${esc(t.description)}</p>
    <div class="sws">${sw(t.colors.primary, 'Warna utama')}${sw(t.colors.accent, 'Warna kedua')}${sw(t.colors.highlight, 'Aksen')}${sw(t.colors.paper, 'Latar')}${sw(t.colors.ink, 'Teks')}</div>
    <div class="mock" style="background:${t.colors.paper};color:${t.colors.ink};border-color:${t.colors.line}">
      <b style="font-family:Lexend">Persiapan PKN STAN, diajar <span style="color:${t.colors['accent-display']}">mahasiswanya.</span></b>
      <span class="mbtn" style="background:${t.colors.primary};color:${t.colors['on-primary']}">Telepon admin</span>
      <span class="mbtn" style="background:${t.colors.highlight};color:${t.colors.ink}">Lihat lulusan</span>
      <span class="mbtn" style="background:${t.colors.accent};color:${t.colors['on-accent']}">Kartu penutup</span>
    </div>
  </div>`).join('');

/* ---------- tool reference (part B) ---------- */
const GROUPS = [
  ['Mulai dan cek', ['site_overview', 'seo_audit', 'review_changes']],
  ['Blog', ['list_posts', 'get_post', 'save_post', 'delete_post']],
  ['Beranda', ['get_homepage', 'update_hero', 'set_homepage_faq', 'update_program']],
  ['Testimoni', ['list_testimonial_videos', 'save_testimonial_video', 'remove_testimonial_video', 'list_alumni', 'update_alumni']],
  ['Kontak dan media sosial', ['get_contact', 'update_contact']],
  ['SEO, AEO, GEO', ['get_page_seo', 'update_page_seo', 'get_organization', 'update_organization', 'ping_index']],
  ['Tema warna', ['list_themes', 'set_theme']],
  ['Terbit', ['build_site', 'publish']],
];
const listed = new Set(GROUPS.flatMap(([, n]) => n));
const extra = Object.keys(TOOLS).filter((n) => !listed.has(n));
if (extra.length) GROUPS.push(['Lainnya', extra]);
const params = (t) => {
  const p = t.schema.properties || {}, req = new Set(t.schema.required || []);
  const names = Object.keys(p);
  if (!names.length) return '<span class="muted">tanpa parameter</span>';
  return names.map((n) => `<code>${n}</code>${req.has(n) ? '<sup class="req">wajib</sup>' : ''}${p[n].description ? `<span class="pdesc"> ${esc(p[n].description)}</span>` : ''}`).join('<br>');
};
const toolTables = GROUPS.map(([g, names]) => `
  <h3>${g}</h3>
  <table class="tools">
    <thead><tr><th style="width:24%">Tool</th><th style="width:44%">Fungsi</th><th>Parameter</th></tr></thead>
    <tbody>${names.filter((n) => TOOLS[n]).map((n) => `<tr><td><code class="tool">${n}</code></td><td>${esc(TOOLS[n].description)}</td><td class="params">${params(TOOLS[n])}</td></tr>`).join('')}</tbody>
  </table>`).join('');

const SYSTEM_PROMPT = `Kamu adalah editor konten website Bimbel Infinity (https://bimbelinfinity.com), bimbel persiapan seleksi PKN STAN di Bintaro sejak 2013. Kamu bekerja lewat MCP "infinity-konten".

Aturan:
1. Mulai setiap sesi dengan site_overview.
2. Jangan pernah mengarang data: angka kelulusan, harga, jadwal, kuota, nilai ambang batas, nomor kontak, akun media sosial, koordinat, jam buka, atau kutipan siswa. Pakai hanya data dari pengguna atau dari situs. Untuk hal yang berubah tiap tahun, arahkan pembaca ke pengumuman resmi PKN STAN.
3. Tulis dalam bahasa Indonesia yang jelas untuk orang tua dan siswa. Kalimat pendek, tanpa jargon pemasaran.
4. Artikel blog: buka dengan "Jawaban singkat" 2-3 kalimat, subjudul berbentuk pertanyaan, minimal 300 kata, 2-4 FAQ, dan link ke artikel lain bila relevan.
5. Setelah mengedit: build_site, lalu seo_audit, lalu tunjukkan review_changes kepada pengguna dalam bahasa sederhana.
6. publish, delete_post, dan remove_testimonial_video hanya setelah pengguna menyetujui secara eksplisit; kirim confirm: true hanya setelah itu.
7. Sekitar 2 menit setelah publish, jalankan ping_index.
8. Kalau tool menolak input, jelaskan alasannya kepada pengguna dengan bahasa sederhana; jangan memaksa dengan data karangan.
9. Jangan pernah menampilkan, mengulang, atau menyimpan token akses di jawaban.`;

const banner = VARIANT === 'personal'
  ? `<div class="secret"><b>RAHASIA · DOKUMEN PRIBADI</b>Berisi password email master dan token MCP. Simpan di perangkat sendiri. Boleh diberikan ke asisten AI pribadi Anda (Muse, Grok, dll.), tapi jangan dikirim ke grup, email, atau orang lain.</div>`
  : VARIANT === 'ai'
    ? `<div class="secret amber"><b>BERISI TOKEN AKSES</b>Dokumen ini berisi token yang bisa mengubah isi website. Berikan hanya ke asisten AI milik Anda sendiri. Tidak berisi password.</div>`
    : '';

const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8">
<title>Panduan MCP Infinity Konten</title>
<link href="https://fonts.googleapis.com/css2?family=Lexend:wght@500;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  @page { size: A4; margin: 18mm 16mm 18mm 16mm; }
  @page :first { margin: 0; }
  :root { --green:#0B6B53; --green-wash:#E4EFEA; --orange:#E14E00; --ink:#0F2A22; --ink2:#3D554C; --ink3:#5F726B; --line:#E2DDD0; --paper:#FFFDF8; --soft:#F6F1E4; }
  * { box-sizing: border-box; }
  html { font-family: "Source Sans 3", sans-serif; font-size: 11pt; line-height: 1.6; color: var(--ink); }
  body { margin: 0; }
  h1, h2, h3, .cover-title { font-family: Lexend, sans-serif; letter-spacing: -0.02em; line-height: 1.2; }
  h2 { font-size: 18pt; margin: 0 0 10px; break-after: avoid; }
  h3 { font-size: 12.5pt; margin: 18px 0 8px; color: var(--green); break-after: avoid; }
  p { margin: 0 0 9px; } ul, ol { margin: 0 0 10px; padding-left: 20px; } li { margin: 3px 0; }
  section { break-before: page; }
  .part { break-before: page; height: 240mm; display: flex; flex-direction: column; justify-content: center; }
  .part small { font: 600 10pt Lexend, sans-serif; color: var(--orange); letter-spacing: .08em; text-transform: uppercase; }
  .part h1 { font-size: 30pt; margin: 6px 0 10px; } .part p { font-size: 13pt; color: var(--ink2); max-width: 48ch; }
  code { font-family: "JetBrains Mono", monospace; font-size: 8.8pt; background: var(--soft); padding: 1px 4px; border-radius: 3px; word-break: break-all; }
  pre { background: #10261F; color: #E8F1EC; border-radius: 6px; padding: 10px 12px; margin: 6px 0 12px; white-space: pre-wrap; word-break: break-word; break-inside: avoid; }
  pre code { background: none; color: inherit; padding: 0; font-size: 8.4pt; line-height: 1.5; word-break: break-word; }
  table { width: 100%; border-collapse: collapse; margin: 6px 0 12px; font-size: 10pt; }
  th, td { text-align: left; vertical-align: top; padding: 7px 9px; border-bottom: 1px solid var(--line); }
  thead th { background: var(--soft); font-family: Lexend, sans-serif; font-weight: 600; font-size: 9.5pt; }
  tr { break-inside: avoid; }
  .tools td { font-size: 8.8pt; } .tools code.tool { font-weight: 500; color: var(--green); background: var(--green-wash); }
  .params { font-size: 8.2pt; } .pdesc { color: var(--ink3); } .req { color: var(--orange); font-size: 6.8pt; margin-left: 3px; text-transform: uppercase; letter-spacing: .04em; }
  .muted { color: var(--ink3); }
  .box { border: 1px solid var(--line); border-radius: 8px; padding: 11px 13px; margin: 8px 0 12px; background: #fff; break-inside: avoid; }
  .box.warn { border-color: #F0C9B0; background: #FFF6F0; } .box.ok { border-color: #BFD9CE; background: var(--green-wash); }
  .box b.t { display: block; font-family: Lexend, sans-serif; font-size: 10pt; margin-bottom: 3px; }
  .secret { border: 2px solid #C62828; background: #FFF1F0; color: #7A1010; border-radius: 8px; padding: 10px 13px; margin: 0 0 12px; font-size: 10pt; break-inside: avoid; }
  .secret.amber { border-color: #E07B00; background: #FFF7EC; color: #6B3A00; }
  .secret b { display: block; font-family: Lexend, sans-serif; letter-spacing: .04em; margin-bottom: 2px; }
  .kv td:first-child { width: 30%; font-weight: 600; }
  .big { font-size: 12pt; } .mono { font-family: "JetBrains Mono", monospace; font-size: 10pt; word-break: break-all; }
  .steps { counter-reset: s; list-style: none; padding: 0; }
  .steps li { counter-increment: s; position: relative; padding: 7px 0 7px 36px; border-bottom: 1px solid var(--line); }
  .steps li::before { content: counter(s); position: absolute; left: 0; top: 7px; width: 24px; height: 24px; border-radius: 50%; background: var(--green); color: #fff; font: 600 9.5pt Lexend, sans-serif; display: grid; place-items: center; }
  .flow { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin: 8px 0 12px; }
  .flow span { background: var(--green-wash); color: var(--green); font: 600 9.5pt Lexend, sans-serif; padding: 5px 10px; border-radius: 999px; }
  .flow i { color: var(--ink3); font-style: normal; }
  .say { border-left: 3px solid var(--green); background: var(--green-wash); padding: 7px 11px; margin: 6px 0; border-radius: 0 6px 6px 0; font-style: italic; break-inside: avoid; }
  .theme { border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; margin: 10px 0; break-inside: avoid; }
  .theme-head { display: flex; align-items: center; gap: 8px; font-family: Lexend, sans-serif; font-size: 12pt; margin-bottom: 4px; }
  .pill { font: 600 8pt Lexend, sans-serif; background: var(--green); color: #fff; padding: 2px 8px; border-radius: 999px; }
  .sws { display: flex; gap: 10px; flex-wrap: wrap; margin: 6px 0 10px; }
  .sw { font-size: 8.5pt; line-height: 1.25; width: 88px; } .sw i { display: block; height: 30px; border-radius: 6px; border: 1px solid rgba(0,0,0,.08); margin-bottom: 4px; } .sw small { color: var(--ink3); font-family: "JetBrains Mono", monospace; font-size: 7.5pt; }
  .mock { border: 1px solid; border-radius: 8px; padding: 12px; display: flex; flex-wrap: wrap; align-items: center; gap: 8px; }
  .mock b { width: 100%; font-size: 13pt; }
  .mbtn { font: 600 9pt Lexend, sans-serif; padding: 6px 12px; border-radius: 999px; }
  .cover { height: 297mm; padding: 28mm 22mm; background: var(--paper); position: relative; overflow: hidden; display: flex; flex-direction: column; }
  .cover svg { position: absolute; right: 0; bottom: 0; width: 60%; height: 40%; }
  .brand { display: flex; align-items: center; gap: 10px; font: 700 12pt Lexend, sans-serif; letter-spacing: .05em; }
  .brand img { height: 30px; } .g { color: #0B6B53; } .o { color: #FF5A00; }
  .cover-title { font-size: 34pt; font-weight: 700; margin-top: 34mm; max-width: 14ch; }
  .cover-title em { font-style: normal; color: var(--orange); }
  .cover p.lead { font-size: 13pt; color: var(--ink2); max-width: 46ch; margin-top: 14px; }
  .cover .meta { margin-top: auto; position: relative; z-index: 1; font-size: 9.5pt; color: var(--ink2); }
  .cover .secret { position: relative; z-index: 1; margin-top: 18px; max-width: 150mm; }
  .toc li { break-inside: avoid; }
</style></head>
<body>

<div class="cover">
  <div class="brand"><img src="../assets/brand/themes/hijau/logo-symbol.png" alt=""><span><span class="g">BIMBEL</span><span class="o">INFINITY</span></span></div>
  <div class="cover-title">Panduan MCP <em>Infinity Konten</em></div>
  <p class="lead">Cara mengurus website bimbelinfinity.com lewat asisten AI (Muse, Grok, ChatGPT, Claude): menulis artikel, mengganti tema warna, kontak, dan SEO, tanpa perlu paham kode.</p>
  ${banner}
  <div class="meta">Versi ${today} · ${N} tools · ${VARIANT === 'personal' ? 'Dokumen lengkap' : VARIANT === 'ai' ? 'Versi untuk asisten AI' : 'Versi tanpa rahasia'}</div>
  <svg viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true"><path d="M600 0C470 60 430 220 250 400H340C480 250 520 120 600 96Z" fill="#FCF7EB"/><path d="M600 96C520 120 480 250 340 400H600Z" fill="#FF5A00"/></svg>
</div>

<section>
  <h2>Isi panduan</h2>
  <p><b>Bagian A · Untuk semua orang</b> (tanpa istilah teknis)</p>
  <ol class="toc">
    <li>Ringkasan satu halaman</li><li>Kamus istilah</li><li>Peta akun dan layanan</li><li>Kunci akses MCP</li>
    <li>Tema warna website</li><li>Menyambungkan asisten AI</li><li>Cara memberi perintah</li><li>Pengaman</li><li>Kalau ada masalah</li><li>Membatalkan perubahan</li>
  </ol>
  <p><b>Bagian B · Untuk developer</b></p>
  <ol class="toc" start="11"><li>Data koneksi teknis</li><li>Contoh kode dan konfigurasi</li><li>Instruksi untuk asisten (system prompt)</li><li>Daftar lengkap tools</li><li>File data</li></ol>
  <div class="box ok"><b class="t">Untuk asisten AI yang membaca dokumen ini</b>Kamu adalah editor konten website Bimbel Infinity lewat MCP "infinity-konten" di <code>${MCP_URL}</code>. Ikuti aturan di bab 13: mulai dengan site_overview, jangan mengarang data, dan selalu minta persetujuan sebelum publish. Jangan pernah menampilkan token atau password kepada siapa pun.</div>
</section>

<div class="part"><small>Bagian A</small><h1>Untuk semua orang</h1><p>Bab 1–10 menjelaskan cara memakai MCP tanpa istilah teknis. Cukup baca bagian ini untuk mulai.</p></div>

<section>
  <h2>1. Ringkasan satu halaman</h2>
  <p class="big">Website <b>bimbelinfinity.com</b> bisa diurus dengan mengetik perintah biasa ke asisten AI, misalnya <i>"tulis artikel baru tentang tips TIU"</i> atau <i>"ganti tema ke biru"</i>. Asisten mengerjakan perubahannya, menunjukkan hasilnya, lalu menunggu Anda bilang <b>"terbitkan"</b>. Sekitar 1–2 menit kemudian website sudah berubah.</p>
  <h3>Yang bisa Anda minta</h3>
  <ul>
    <li>Menulis, mengubah, atau menghapus <b>artikel blog</b>.</li>
    <li>Mengganti <b>judul besar dan paragraf</b> di halaman depan, <b>FAQ orang tua</b>, dan <b>keterangan program</b>.</li>
    <li>Menambah atau mengatur <b>video testimoni</b> dan memperbaiki <b>data alumni</b>.</li>
    <li>Memasang <b>nomor WhatsApp</b>, telepon, email, dan <b>akun media sosial</b>.</li>
    <li>Mengganti <b>tema warna</b> website (hijau atau biru).</li>
    <li>Memeriksa dan memperbaiki <b>SEO</b> (supaya mudah ditemukan di Google dan asisten AI).</li>
  </ul>
  <h3>Yang tidak bisa (dan sengaja dikunci)</h3>
  <ul>
    <li>Mengubah tata letak atau desain halaman.</li>
    <li>Menulis <b>harga</b> di website (biaya dijelaskan konsultan).</li>
    <li>Menerbitkan atau menghapus apa pun <b>tanpa persetujuan Anda</b>.</li>
  </ul>
  <h3>Alurnya selalu sama</h3>
  <div class="flow"><span>1. Minta</span><i>→</i><span>2. Asisten mengerjakan</span><i>→</i><span>3. Anda cek ringkasannya</span><i>→</i><span>4. Bilang "terbitkan"</span><i>→</i><span>5. Tayang 1–2 menit</span></div>
</section>

<section>
  <h2>2. Kamus istilah</h2>
  <table class="kv">
    <tr><td>Asisten AI</td><td>Program yang bisa diajak bicara, misalnya Muse, Grok, ChatGPT, atau Claude.</td></tr>
    <tr><td>MCP</td><td>"Colokan" yang membuat asisten AI bisa mengurus website. Ibarat memberi asisten kunci ruang kerja, tapi hanya untuk isi website.</td></tr>
    <tr><td>Tools</td><td>Kemampuan yang tersedia lewat MCP, misalnya "tulis artikel" atau "ganti tema". Ada ${N} tools.</td></tr>
    <tr><td>Token MCP</td><td>Kata sandi khusus untuk asisten AI. Hanya membuka akses ke isi website, tidak ke email atau akun lain.</td></tr>
    <tr><td>Terbitkan (publish)</td><td>Mengirim perubahan supaya tampil di website untuk semua orang.</td></tr>
    <tr><td>Deploy</td><td>Proses otomatis setelah terbitkan: website dibangun ulang dan tayang dalam 1–2 menit.</td></tr>
    <tr><td>GitHub</td><td>Tempat penyimpanan semua isi dan riwayat perubahan website. Setiap perubahan tercatat dan bisa dibatalkan.</td></tr>
    <tr><td>Railway</td><td>Tempat website dan server MCP "dijalankan" (hosting).</td></tr>
    <tr><td>Cloudinary</td><td>Tempat penyimpanan video (video di halaman depan dan video testimoni).</td></tr>
    <tr><td>Cloudflare</td><td>Pengatur alamat domain, supaya bimbelinfinity.com mengarah ke website yang benar.</td></tr>
    <tr><td>SSO</td><td>"Login dengan Google": masuk ke suatu layanan memakai akun email, tanpa password terpisah.</td></tr>
    <tr><td>Tema</td><td>Set warna website (lihat bab 5).</td></tr>
    <tr><td>SEO</td><td>Usaha supaya website mudah ditemukan di Google. AEO/GEO: supaya mudah dikutip asisten AI seperti ChatGPT.</td></tr>
  </table>
</section>

<section>
  <h2>3. Peta akun dan layanan</h2>
  <p>Semua layanan website memakai <b>satu email master</b> dengan login SSO ("Login dengan Google").</p>
  <table class="kv">
    <tr><td>Email master</td><td class="mono">${MASTER_EMAIL}</td></tr>
    ${VARIANT === 'personal' ? `<tr><td>Password email master</td><td class="mono">${esc(PASSWORD)}</td></tr>` : `<tr><td>Password</td><td class="muted">Tidak dicantumkan di versi ini. Disimpan di arsip pribadi pemilik.</td></tr>`}
  </table>
  <div class="box warn"><b class="t">Email ini kunci semua layanan</b>Karena GitHub, Railway, Cloudinary, dan Cloudflare semuanya login lewat email ini, siapa pun yang tahu password-nya bisa menguasai semuanya. Aktifkan <b>verifikasi 2 langkah (2FA)</b> di akun Google, dan ganti password kalau pernah dibagikan lewat chat.</div>
  <table>
    <thead><tr><th style="width:18%">Layanan</th><th style="width:34%">Untuk apa</th><th style="width:18%">Cara masuk</th><th>Alamat</th></tr></thead>
    <tbody>
      <tr><td><b>GitHub</b></td><td>Menyimpan isi dan riwayat website, serta kode server MCP.</td><td>SSO email master</td><td><code>github.com/anggunn2701-oss</code><br>repo <code>bimbel-infinity-website</code> dan <code>infinity-konten-mcp</code></td></tr>
      <tr><td><b>Railway</b></td><td>Menjalankan website dan server MCP. Tempat token MCP dan token GitHub disimpan (menu Variables).</td><td>SSO email master</td><td><code>railway.com</code></td></tr>
      <tr><td><b>Cloudinary</b></td><td>Video halaman depan dan video testimoni.</td><td>SSO email master</td><td><code>cloudinary.com</code> (akun <code>jnye0bk5</code>)</td></tr>
      <tr><td><b>Cloudflare</b></td><td>Pengaturan domain dan DNS.</td><td>SSO email master</td><td><code>dash.cloudflare.com</code></td></tr>
    </tbody>
  </table>
  <h3>Domain di Cloudflare</h3>
  <table>
    <thead><tr><th style="width:34%">Domain</th><th>Keterangan</th></tr></thead>
    <tbody>
      <tr><td><b>bimbelinfinity.com</b></td><td>Website utama yang diurus lewat MCP. <code>www.bimbelinfinity.com</code> dialihkan ke sini.</td></tr>
      <tr><td><b>jadiabdinegara.com</b></td><td>Ada di Cloudflare yang sama. Tidak diurus oleh MCP ini. Catatan: <code>jadiabdinegara.id</code> terdaftar terpisah di Rumahweb, bukan di Cloudflare.</td></tr>
      <tr><td><b>stanwaypriority.com</b></td><td>Ada di Cloudflare yang sama. Tidak diurus oleh MCP ini.</td></tr>
    </tbody>
  </table>
</section>

<section>
  <h2>4. Kunci akses MCP</h2>
  <table class="kv">
    <tr><td>Alamat server MCP</td><td class="mono">${MCP_URL}</td></tr>
    <tr><td>Token MCP</td><td class="mono">${TOKEN ? esc(TOKEN) : '<span class="muted">Tidak dicantumkan di versi ini. Lihat Railway → service infinity-konten-mcp → Variables → MCP_TOKEN.</span>'}</td></tr>
    <tr><td>Alamat dengan token (untuk aplikasi yang hanya minta satu alamat)</td><td class="mono">${MCP_URL}/${TOKEN_SHOW}</td></tr>
  </table>
  <h3>Aturan menjaga token</h3>
  <ul>
    <li>Berikan hanya ke asisten AI milik Anda sendiri. Jangan dikirim di grup, email, atau media sosial.</li>
    <li>Token ini <b>hanya</b> bisa mengubah isi website bimbelinfinity.com. Tidak bisa membuka email, Cloudflare, atau akun lain.</li>
    <li><b>Kalau bocor:</b> minta developer membuat token baru, ganti di Railway (Variables → <code>MCP_TOKEN</code>), lalu Deploy. Token lama langsung tidak berlaku. Masukkan token baru ke setiap asisten.</li>
    <li><b>Token GitHub</b> (dipakai server MCP, disimpan di Railway sebagai <code>GITHUB_TOKEN</code>) punya tanggal kedaluwarsa. Kalau kedaluwarsa, asisten tidak bisa menerbitkan sampai token itu diperbarui.</li>
  </ul>
</section>

<section>
  <h2>5. Tema warna website</h2>
  <p><b>Tema</b> adalah set warna untuk seluruh website. Ganti tema, maka <b>semua halaman ikut berubah</b> sekaligus: tombol, judul berwarna, latar, garis lengkung, logo, gambar yang muncul saat link dibagikan di WhatsApp, dan warna bar browser di HP. Ada dua tema yang sudah disiapkan:</p>
  ${themeCards}
  <h3>Yang berubah dan yang tidak</h3>
  <table>
    <thead><tr><th style="width:50%">Ikut berubah</th><th>Tidak berubah</th></tr></thead>
    <tbody><tr>
      <td><ul><li>Semua warna (tombol, judul, latar, garis)</li><li>Logo (logo hijau atau logo biru)</li><li>Gambar share di WhatsApp dan media sosial</li><li>Warna bar browser di HP</li></ul></td>
      <td><ul><li>Isi tulisan, foto, dan video</li><li>Tata letak halaman</li><li>Nomor kontak dan media sosial</li><li>Artikel blog</li></ul></td>
    </tr></tbody>
  </table>
  <h3>Cara mengganti tema</h3>
  <div class="say">"Ganti tema website ke biru, lalu terbitkan."</div>
  <div class="say">"Kembalikan tema website ke hijau."</div>
  <p>Asisten menjalankan pergantian, menunjukkan ringkasannya, lalu meminta persetujuan Anda. Setelah disetujui, website berganti warna dalam 1–2 menit. Pengunjung langsung melihat warna baru tanpa perlu menghapus cache.</p>
  <div class="box ok"><b class="t">Aman dari warna yang sulit dibaca</b>Sebelum tema dipakai, sistem otomatis mengecek 19 pasangan warna teks dan latar sesuai standar keterbacaan (WCAG AA). Tema yang tidak lolos ditolak. Karena itu di tema biru, tulisan di atas oranye memakai biru tua (navy), bukan putih. Warna tidak bisa diubah satu per satu lewat asisten; untuk menambah tema baru, hubungi developer.</div>
  <p class="muted">Catatan: logo tema biru dipotong dari gambar brand guideline. Ganti dengan file logo asli (SVG atau PNG transparan) bila tersedia.</p>
</section>

<section>
  <h2>6. Menyambungkan asisten AI</h2>
  <p>Cukup dilakukan sekali untuk setiap asisten. Nama menu bisa sedikit berbeda di tiap aplikasi; yang penting isi <b>alamat server</b> dan <b>token</b>.</p>
  <h3>Muse</h3>
  <ol class="steps">
    <li>Buka <b>Settings</b> → <b>Integrations / Tools / MCP</b> → <b>Add MCP server</b>.</li>
    <li>Nama: <code>infinity-konten</code>. Alamat: <code>${MCP_URL}</code>. Jenis koneksi: <b>HTTP / Streamable HTTP</b>.</li>
    <li>Kalau ada kolom token atau "Bearer": isi token MCP. Kalau tidak ada kolom itu, pakai alamat dengan token (bab 4).</li>
    <li>Unggah dokumen ini ke asisten, atau tempel teks di bab 13 ke instruksi asisten.</li>
    <li>Tes: ketik <i>"Tampilkan daftar artikel blog."</i></li>
  </ol>
  <h3>Grok</h3>
  <ol class="steps">
    <li>Buka pengaturan <b>Connectors / Tools / MCP</b> → tambah server MCP remote.</li>
    <li>Isi alamat <code>${MCP_URL}</code> dan token (atau alamat dengan token).</li>
    <li>Tempel instruksi bab 13 ke custom instructions.</li>
    <li>Tes: <i>"Panggil site_overview dan ringkas isinya."</i></li>
  </ol>
  <h3>ChatGPT</h3>
  <ol class="steps">
    <li>Settings → <b>Connectors</b> (mode developer) → tambah konektor MCP.</li>
    <li>Pakai <b>alamat dengan token</b> (bab 4), autentikasi "None".</li>
  </ol>
  <h3>Claude (claude.ai / aplikasi Claude)</h3>
  <ol class="steps">
    <li>Settings → <b>Connectors</b> → <b>Add custom connector</b>.</li>
    <li>Isi <b>alamat dengan token</b> (bab 4).</li>
  </ol>
  <div class="box"><b class="t">Cek berhasil atau belum</b>Kalau asisten bisa menjawab <i>"Ada berapa artikel di blog?"</i> dengan angka yang benar, berarti sudah tersambung.</div>
</section>

<section>
  <h2>7. Cara memberi perintah</h2>
  <p>Bicara biasa saja, seperti ke asisten manusia. Sebutkan data yang benar; asisten tidak boleh mengarang.</p>
  <table>
    <thead><tr><th style="width:28%">Ingin…</th><th>Contoh kalimat</th></tr></thead>
    <tbody>
      <tr><td>Artikel baru</td><td>"Tulis artikel tentang cara membagi waktu saat mengerjakan TIU. Tunjukkan dulu sebelum diterbitkan."</td></tr>
      <tr><td>Ubah artikel</td><td>"Tambahkan bagian tips latihan di artikel SKD."</td></tr>
      <tr><td>Judul halaman depan</td><td>"Ganti paragraf di bawah judul halaman depan jadi: …"</td></tr>
      <tr><td>FAQ orang tua</td><td>"Isi jawaban FAQ garansi dengan: …"</td></tr>
      <tr><td>Nomor WhatsApp</td><td>"Pasang nomor WhatsApp admin 0812xxxxxxxx." (semua tombol jadi "Chat admin")</td></tr>
      <tr><td>Media sosial</td><td>"Isi akun X @… dan LinkedIn https://www.linkedin.com/company/…"</td></tr>
      <tr><td>Video testimoni</td><td>"Tambahkan video ini: [link Cloudinary], namanya Rina, D3 Akuntansi."</td></tr>
      <tr><td>Data alumni</td><td>"Perbaiki jurusan lulusan Arraz Meidyan jadi D3 Pajak."</td></tr>
      <tr><td>Tema warna</td><td>"Ganti tema ke biru." / "Kembalikan ke hijau."</td></tr>
      <tr><td>Lokasi di Google</td><td>"Isi jam buka Senin–Jumat 08:00–17:00, kode pos …, dan link Google Maps ini: …"</td></tr>
      <tr><td>Cek SEO</td><td>"Periksa SEO website dan perbaiki yang bisa diperbaiki tanpa mengarang data."</td></tr>
      <tr><td>Terbitkan</td><td>"Oke, terbitkan." (asisten akan bertanya sekali lagi sebelum menerbitkan)</td></tr>
    </tbody>
  </table>
  <div class="box"><b class="t">Tips</b>Minta <i>"tunjukkan dulu sebelum diterbitkan"</i> untuk perubahan besar. Periksa setiap angka (kuota, jadwal, nilai) sebelum bilang terbitkan; asisten diminta tidak mengarang, tapi tetap perlu dicek. Perubahan yang belum diterbitkan bisa hilang kalau server MCP dinyalakan ulang.</div>
</section>

<section>
  <h2>8. Pengaman</h2>
  <ul>
    <li><b>Tidak ada yang tayang tanpa izin</b>: menerbitkan, menghapus artikel, dan menghapus video selalu butuh persetujuan.</li>
    <li><b>Tidak bisa menulis harga</b> di keterangan program.</li>
    <li><b>Nomor dan akun dicek formatnya</b>: nomor WhatsApp dirapikan otomatis, email dan nama akun media sosial diperiksa.</li>
    <li><b>Lokasi dicek</b>: koordinat harus di Indonesia, jam buka harus format 08:00, kode pos 5 angka.</li>
    <li><b>Tema hanya bisa dipilih</b>, tidak bisa dicampur warna sembarangan, dan sudah lolos cek keterbacaan.</li>
    <li><b>Video hanya dari akun Cloudinary Infinity</b>; video asli tidak diubah.</li>
    <li><b>Penerbitan dibatalkan otomatis</b> kalau ada link rusak.</li>
    <li><b>Semua tercatat</b> di GitHub dan bisa dibatalkan (bab 10).</li>
  </ul>

  <h2 style="margin-top:20px">9. Kalau ada masalah</h2>
  <table>
    <thead><tr><th style="width:34%">Yang terjadi</th><th>Yang perlu dilakukan</th></tr></thead>
    <tbody>
      <tr><td>Asisten bilang "unauthorized" / tidak bisa masuk</td><td>Token salah atau sudah diganti. Salin ulang token dari Railway (bab 4) ke asisten.</td></tr>
      <tr><td>Asisten bilang server tidak menjawab</td><td>Buka Railway → service <b>infinity-konten-mcp</b>. Kalau statusnya merah, klik <b>Restart</b>. Kalau tetap, hubungi developer.</td></tr>
      <tr><td>Fitur baru belum muncul di asisten</td><td>Railway → infinity-konten-mcp → <b>Deployments</b> → <b>Restart</b>.</td></tr>
      <tr><td>Tidak bisa menerbitkan, ada kata "GitHub"</td><td>Token GitHub kedaluwarsa. Buat token baru di GitHub (developer), simpan di Railway sebagai <code>GITHUB_TOKEN</code>.</td></tr>
      <tr><td>Sudah diterbitkan tapi website belum berubah</td><td>Tunggu 2 menit, lalu muat ulang halaman. Kalau tetap, tanya asisten "apakah ada perubahan yang belum diterbitkan?".</td></tr>
      <tr><td>Asisten menolak perintah</td><td>Biasanya karena data tidak sesuai (format nomor, harga, dll.). Baca alasannya dan perbaiki datanya.</td></tr>
      <tr><td>Website tidak bisa dibuka</td><td>Cek Railway (service website) dan Cloudflare (DNS bimbelinfinity.com). Hubungi developer.</td></tr>
    </tbody>
  </table>

  <h2 style="margin-top:20px">10. Membatalkan perubahan</h2>
  <ul>
    <li><b>Cara termudah:</b> minta asisten mengembalikan isinya. Contoh: <i>"Kembalikan tema ke hijau"</i>, <i>"Kembalikan paragraf halaman depan seperti sebelumnya"</i>.</li>
    <li><b>Cara lengkap:</b> semua perubahan tercatat di GitHub (<code>github.com/anggunn2701-oss/bimbel-infinity-website</code> → Commits). Developer bisa membatalkan satu commit dengan <code>git revert</code>.</li>
  </ul>
</section>

<div class="part"><small>Bagian B</small><h1>Untuk developer</h1><p>Detail teknis koneksi, contoh kode, instruksi asisten, dan referensi lengkap ${N} tools.</p></div>

<section>
  <h2>11. Data koneksi teknis</h2>
  <table class="kv">
    <tr><td>Endpoint</td><td><code>${MCP_URL}</code></td></tr>
    <tr><td>Transport</td><td>MCP Streamable HTTP, JSON-RPC 2.0, balasan <code>application/json</code> (tanpa SSE). Protokol 2025-06-18 / 2025-03-26 / 2024-11-05.</td></tr>
    <tr><td>Autentikasi</td><td><code>Authorization: Bearer ${TOKEN_SHOW}</code>, atau token di path <code>/mcp/${TOKEN_SHOW}</code>. Token dibandingkan secara timing-safe; salah = 401.</td></tr>
    <tr><td>Health check</td><td><code>GET https://mcp-infinity.up.railway.app/healthz</code> → <code>{"ok":true,"mode":"github"}</code></td></tr>
    <tr><td>Cara kerja server</td><td>Repo <code>infinity-konten-mcp</code> (Railway, Dockerfile). Saat start meng-clone <code>bimbel-infinity-website</code> dengan <code>GITHUB_TOKEN</code> dan memuat tools dari <code>mcp/core.js</code>. <code>publish</code> = commit + push; service website deploy ulang sendiri.</td></tr>
    <tr><td>Variabel Railway</td><td><code>MCP_TOKEN</code>, <code>GITHUB_TOKEN</code> (fine-grained, Contents: Read and write, hanya repo website), opsional <code>GITHUB_REPO</code>, <code>GIT_BRANCH</code>.</td></tr>
    <tr><td>MCP lokal</td><td><code>mcp/server.js</code> (stdio), terdaftar di <code>.mcp.json</code> repo website untuk Claude Code.</td></tr>
  </table>
</section>

<section>
  <h2>12. Contoh kode dan konfigurasi</h2>
  <h3>Tes dengan curl</h3>
  ${code(T(`curl -s ${MCP_URL} \\
  -H "Authorization: Bearer <MCP_TOKEN>" \\
  -H "Content-Type: application/json" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'`))}
  <h3>Konfigurasi umum (Muse, Cursor, VS Code, dan klien lain)</h3>
  ${code(T(`{
  "mcpServers": {
    "infinity-konten": {
      "type": "http",
      "url": "${MCP_URL}",
      "headers": { "Authorization": "Bearer <MCP_TOKEN>" }
    }
  }
}`))}
  <h3>xAI API (Grok), bentuk umum; sesuaikan nama field dengan dokumentasi xAI terbaru</h3>
  ${code(T(`{
  "model": "grok-4",
  "input": "Audit SEO website lalu laporkan 3 perbaikan terpenting.",
  "tools": [{ "type": "mcp", "server_label": "infinity-konten",
              "server_url": "${MCP_URL}",
              "headers": { "Authorization": "Bearer <MCP_TOKEN>" } }]
}`))}
  <h3>Claude Code dari komputer lain</h3>
  ${code(T(`claude mcp add --transport http infinity-konten ${MCP_URL} --header "Authorization: Bearer <MCP_TOKEN>"`))}
  <h3>Node.js</h3>
  ${code(`const URL = "${MCP_URL}", TOKEN = process.env.MCP_TOKEN;
async function call(name, args = {}) {
  const r = await fetch(URL, { method: "POST",
    headers: { "Content-Type": "application/json", Authorization: "Bearer " + TOKEN },
    body: JSON.stringify({ jsonrpc: "2.0", id: Date.now(), method: "tools/call", params: { name, arguments: args } }) });
  return (await r.json()).result.content[0].text;
}
console.log(await call("site_overview"));`)}
  <h3>Python</h3>
  ${code(`import os, requests
URL, TOKEN = "${MCP_URL}", os.environ["MCP_TOKEN"]
def call(name, args=None):
    r = requests.post(URL, headers={"Authorization": f"Bearer {TOKEN}"},
        json={"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {"name": name, "arguments": args or {}}})
    return r.json()["result"]["content"][0]["text"]
print(call("list_posts"))`)}
</section>

<section>
  <h2>13. Instruksi untuk asisten (system prompt)</h2>
  <p>Tempel teks ini ke "custom instructions" / "system prompt" asisten.</p>
  ${code(SYSTEM_PROMPT)}
  <h3>Alur standar</h3>
  <div class="flow"><span>site_overview</span><i>→</i><span>edit</span><i>→</i><span>build_site</span><i>→</i><span>seo_audit</span><i>→</i><span>review_changes</span><i>→</i><span>publish (confirm)</span><i>→</i><span>ping_index</span></div>
</section>

<section>
  <h2>14. Daftar lengkap tools</h2>
  <p>Dibuat otomatis dari <code>mcp/core.js</code> (${N} tools). <span class="req" style="font-size:7pt">wajib</span> = parameter yang harus diisi.</p>
  ${toolTables}
</section>

<section>
  <h2>15. File data</h2>
  <table>
    <thead><tr><th style="width:40%">File di repo website</th><th>Isi</th></tr></thead>
    <tbody>
      <tr><td><code>content/blog-posts.json</code></td><td>Artikel: judul, judul Google, deskripsi, jawaban singkat, isi, FAQ.</td></tr>
      <tr><td><code>content/home.json</code></td><td>Hero, tiga program, FAQ orang tua.</td></tr>
      <tr><td><code>content/testimonial-videos.json</code></td><td>Video di barisan testimoni beranda.</td></tr>
      <tr><td><code>content/alumni-2018.json</code></td><td>38 lulusan 2018 di halaman testimoni.</td></tr>
      <tr><td><code>content/contact.json</code></td><td>WhatsApp, telepon, email, pesan WhatsApp, media sosial, ikon "segera hadir".</td></tr>
      <tr><td><code>content/seo.json</code></td><td>Judul dan deskripsi Google per halaman, kunci IndexNow.</td></tr>
      <tr><td><code>content/organization.json</code></td><td>Fakta lembaga: alamat, kode pos, koordinat, jam buka.</td></tr>
      <tr><td><code>content/theme.json</code>, <code>content/themes/*.json</code></td><td>Tema aktif dan isi tiap tema.</td></tr>
    </tbody>
  </table>
  <p class="muted">Dibuat ulang dengan <code>node tools/build-mcp-guide.js</code>. Varian berisi rahasia dibuat dengan GUIDE_VARIANT, GUIDE_TOKEN, GUIDE_PASSWORD, GUIDE_OUT dan selalu disimpan di luar repo.</p>
</section>
</body></html>`;

const work = path.join(os.tmpdir(), `infinity-guide-${process.pid}`);
fs.mkdirSync(work, { recursive: true });
// the HTML references ../assets: build it next to a copy of the logo so a secret-bearing HTML never lands in the repo
fs.mkdirSync(path.join(work, 'assets/brand/themes/hijau'), { recursive: true });
fs.copyFileSync(path.join(root, 'assets/brand/themes/hijau/logo-symbol.png'), path.join(work, 'assets/brand/themes/hijau/logo-symbol.png'));
fs.mkdirSync(path.join(work, 'page'), { recursive: true });
const htmlFile = path.join(work, 'page', 'panduan.html');
fs.writeFileSync(htmlFile, html);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
const url = 'file:///' + htmlFile.replace(/\\/g, '/').replace(/ /g, '%20');
execFileSync('C:/Program Files/Google/Chrome/Application/chrome.exe', ['--headless=new', '--disable-gpu', '--allow-file-access-from-files',
  `--user-data-dir=${os.tmpdir()}/chrome-guide-${process.pid}`, '--no-pdf-header-footer', '--virtual-time-budget=8000', `--print-to-pdf=${OUT}`, url], { stdio: 'ignore' });
if (process.env.GUIDE_KEEP_HTML) console.log('html:', htmlFile); else fs.rmSync(work, { recursive: true, force: true });
console.log(`pdf (${VARIANT}):`, OUT, Math.round(fs.statSync(OUT).size / 1024) + 'KB');
