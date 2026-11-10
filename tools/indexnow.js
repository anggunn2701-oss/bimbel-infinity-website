/* IndexNow (https://www.indexnow.org): tell Bing, Yandex, Seznam, Naver and others that pages changed.
   Bing's index also feeds Copilot and several AI assistants. Google does not use IndexNow; it reads sitemap.xml.
   The key file <key>.txt at the site root is written by tools/build-site.js and must be live before pinging.
   CLI: node tools/indexnow.js [url ...]   (no urls = every URL in sitemap.xml) */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const root = path.resolve(__dirname, '..');

function config() {
  const { SITE } = require('./site.config');
  const { indexnowKey } = JSON.parse(fs.readFileSync(path.join(root, 'content/seo.json'), 'utf8'));
  const urls = [...fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  return { SITE, key: indexnowKey, host: new URL(SITE).host, sitemapUrls: urls };
}

async function ping(urls) {
  const c = config();
  const list = (urls && urls.length ? urls : c.sitemapUrls).filter((u) => u.startsWith(c.SITE));
  if (!list.length) return { status: 'tidak ada URL dari situs ini untuk dikirim' };
  const keyLocation = `${c.SITE}/${c.key}.txt`;
  const live = await fetch(keyLocation).then(async (r) => r.ok && (await r.text()).trim() === c.key).catch(() => false);
  if (!live) return { status: 'ditunda', alasan: `file kunci ${keyLocation} belum tayang; publish dulu, tunggu deploy 1–2 menit, lalu ulangi` };
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: c.host, key: c.key, keyLocation, urlList: list }),
  });
  const meaning = { 200: 'diterima', 202: 'diterima (verifikasi kunci menyusul)', 400: 'format salah', 403: 'kunci tidak cocok', 422: 'URL bukan milik host ini', 429: 'terlalu sering, coba lagi nanti' };
  return { status: res.ok ? 'terkirim' : 'gagal', http: res.status, arti: meaning[res.status] || res.statusText, jumlah_url: list.length, url: list };
}

/* synchronous wrapper for the MCP tools (they run synchronously) */
function pingSync(urls = []) {
  const out = execFileSync(process.execPath, [__filename, '--json', ...urls], { cwd: root, encoding: 'utf8', timeout: 30000 });
  return JSON.parse(out);
}

module.exports = { ping, pingSync, config };
if (require.main === module) {
  const args = process.argv.slice(2);
  const json = args[0] === '--json';
  ping(json ? args.slice(1) : args).then((r) => console.log(json ? JSON.stringify(r) : JSON.stringify(r, null, 2)))
    .catch((e) => { console.log(JSON.stringify({ status: 'gagal', alasan: e.message })); process.exitCode = json ? 0 : 1; });
}
