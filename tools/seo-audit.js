/* SEO / AEO / GEO audit of the built site. Pure reads, no network.
   Used by the MCP tool seo_audit and runnable on its own: node tools/seo-audit.js */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const SITE = require('./site.config').SITE;

const read = (f) => fs.readFileSync(path.join(root, f), 'utf8');
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ')
  .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => { const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`)); return m ? m[1] : null; };

function pages() {
  const list = ['index.html', 'testimoni.html', 'blog/index.html'];
  for (const f of fs.readdirSync(path.join(root, 'blog'))) if (f.endsWith('.html') && f !== 'index.html') list.push(`blog/${f}`);
  return list;
}
const urlOf = (f) => `${SITE}/${f === 'index.html' ? '' : f === 'blog/index.html' ? 'blog/' : f}`;

function auditPage(f) {
  const h = read(f), issues = [], info = {};
  const add = (level, msg) => issues.push({ level, msg });
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = attr((h.match(/<meta name="description"[^>]*>/) || [''])[0], 'content') || '';
  const canon = attr((h.match(/<link rel="canonical"[^>]*>/) || [''])[0], 'href') || '';
  const robots = attr((h.match(/<meta name="robots"[^>]*>/) || [''])[0], 'content') || '';
  const og = attr((h.match(/<meta property="og:image"[^>]*>/) || [''])[0], 'content') || '';
  const decoded = (s) => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"');
  info.title = decoded(title); info.description = decoded(desc);

  if (!title) add('error', 'tidak ada <title>');
  else if (decoded(title).length > 65) add('warn', `judul ${decoded(title).length} karakter (Google memotong setelah ~60–65)`);
  else if (decoded(title).length < 25) add('warn', `judul hanya ${decoded(title).length} karakter; tambahkan kata kunci`);
  if (!desc) add('error', 'tidak ada meta description');
  else if (decoded(desc).length > 160 || decoded(desc).length < 70) add('warn', `deskripsi ${decoded(desc).length} karakter (ideal 70–160)`);
  if (!canon) add('error', 'tidak ada canonical');
  else if (canon !== urlOf(f)) add('warn', `canonical ${canon} berbeda dengan alamat halaman ${urlOf(f)}`);
  if (/noindex/i.test(robots)) add('error', 'halaman diberi noindex');
  if (!og) add('warn', 'tidak ada og:image (tampilan share)');

  const h1 = (h.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) add(h1 ? 'warn' : 'error', `${h1} elemen <h1> (seharusnya 1)`);
  const imgs = h.match(/<img\b[^>]*>/g) || [];
  const noAlt = imgs.filter((t) => attr(t, 'alt') === null).length;
  if (noAlt) add('error', `${noAlt} gambar tanpa atribut alt`);
  const noSize = imgs.filter((t) => !attr(t, 'width') || !attr(t, 'height')).length;
  if (noSize) add('warn', `${noSize} gambar tanpa width/height (bisa membuat tata letak bergeser)`);

  // structured data
  const ld = [...h.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const types = [];
  for (const m of ld) {
    try { const j = JSON.parse(m[1]); for (const n of j['@graph'] || [j]) types.push(...[].concat(n['@type'])); }
    catch (e) { add('error', `JSON-LD tidak valid: ${e.message}`); }
  }
  info.schema = [...new Set(types)];
  if (!ld.length) add('error', 'tidak ada data terstruktur (JSON-LD)');
  if (f.startsWith('blog/') && f !== 'blog/index.html') {
    if (!types.includes('BlogPosting')) add('error', 'artikel tanpa schema BlogPosting');
    if (!types.includes('FAQPage')) add('warn', 'artikel tanpa FAQPage (AEO)');
    const body = (h.match(/<div class="prose">([\s\S]*?)<\/div>\s*<section class="post-faq"/) || [])[1] || '';
    const words = strip(body).split(' ').filter(Boolean).length;
    info.words = words;
    if (words < 300) add('warn', `isi artikel ${words} kata; < 300 kata jarang dikutip`);
    if (!/class="post-summary"/.test(h)) add('warn', 'tidak ada kotak Jawaban singkat (AEO)');
    const h2 = (body.match(/<h2>/g) || []).length;
    if (h2 < 2) add('warn', `${h2} subjudul; pecah dengan subjudul berbentuk pertanyaan`);
    const internal = (body.match(/href="(\.\.?\/|\/)[^"]*"/g) || []).length;
    if (!internal) add('warn', 'tidak ada link internal di isi artikel');
  }
  const ph = (h.match(/class="ph"/g) || []).length;
  if (ph) add('info', `${ph} data belum lengkap (kotak oranye) masih tampil`);
  return { page: f, url: urlOf(f), issues, ...info };
}

function audit() {
  const list = pages().map(auditPage);
  const site = [];
  // duplicates across pages
  const dup = (key) => {
    const seen = {};
    for (const p of list) (seen[p[key]] = seen[p[key]] || []).push(p.page);
    return Object.entries(seen).filter(([k, v]) => k && v.length > 1);
  };
  for (const [t, v] of dup('title')) site.push({ level: 'warn', msg: `judul ganda "${t}" di ${v.join(', ')}` });
  for (const [t, v] of dup('description')) site.push({ level: 'warn', msg: `deskripsi ganda di ${v.join(', ')}` });
  // sitemap and llms coverage
  const sm = read('sitemap.xml'), llms = read('llms.txt');
  for (const p of list) {
    if (!sm.includes(`<loc>${p.url}</loc>`)) site.push({ level: 'error', msg: `${p.page} tidak ada di sitemap.xml` });
    if (p.page.startsWith('blog/') && p.page !== 'blog/index.html' && !llms.includes(p.url)) site.push({ level: 'warn', msg: `${p.page} tidak ada di llms.txt` });
  }
  const robots = read('robots.txt');
  if (!/Sitemap:\s*https?:\/\//.test(robots)) site.push({ level: 'error', msg: 'robots.txt tanpa baris Sitemap' });
  for (const bot of ['GPTBot', 'ClaudeBot', 'PerplexityBot', 'Google-Extended']) if (!robots.includes(bot)) site.push({ level: 'info', msg: `robots.txt tidak menyebut ${bot} secara eksplisit` });
  const seo = JSON.parse(read('content/seo.json'));
  if (!fs.existsSync(path.join(root, `${seo.indexnowKey}.txt`))) site.push({ level: 'warn', msg: 'file kunci IndexNow belum ada; jalankan build_site' });
  const org = JSON.parse(read('content/organization.json'));
  if (org.geo.latitude == null) site.push({ level: 'info', msg: 'koordinat lokasi (geo) belum diisi; penting untuk SEO lokal dan Google Maps' });
  if (!org.openingHours.length) site.push({ level: 'info', msg: 'jam buka belum diisi' });
  if (!org.address.postalCode) site.push({ level: 'info', msg: 'kode pos belum diisi' });

  const all = [...list.flatMap((p) => p.issues), ...site];
  const count = (l) => all.filter((i) => i.level === l).length;
  const score = Math.max(0, 100 - count('error') * 10 - count('warn') * 3 - count('info'));
  return {
    skor: score, ringkasan: { error: count('error'), peringatan: count('warn'), info: count('info'), halaman: list.length },
    seluruh_situs: site,
    halaman: list.map((p) => ({ halaman: p.page, judul: p.title, schema: p.schema, ...(p.words ? { kata: p.words } : {}), masalah: p.issues })),
  };
}

module.exports = { audit };
if (require.main === module) console.log(JSON.stringify(audit(), null, 2));
