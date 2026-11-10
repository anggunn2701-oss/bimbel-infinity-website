# Deploy ke Railway

Website ini statis dan dilayani oleh `server.js` (Node, tanpa dependency). Railway membaca `package.json` (`npm start`) dan `railway.json` (start command, health check `/healthz`, restart otomatis).

## Sebelum deploy

1. Kalau ada perubahan artikel, data alumni, atau domain, jalankan build:
   ```bash
   node tools/build-site.js
   ```
2. Cek lokal: `npm start`, lalu buka http://localhost:3000.

## Cara deploy

**A. Dari GitHub (disarankan, deploy otomatis setiap push)**
1. Push folder ini ke repository GitHub (file besar dan cadangan sudah dikecualikan lewat `.gitignore`).
2. Di Railway: New Project → Deploy from GitHub repo → pilih repository-nya.
3. Railway mendeteksi Node dan menjalankan `node server.js`. Tidak ada environment variable yang wajib; `PORT` diisi Railway.

**B. Dari komputer ini dengan Railway CLI**
```bash
railway init
```
```bash
railway up
```
File yang di-upload mengikuti `.railwayignore` (sekitar 8 MB; video mentah 525 MB tidak ikut).

## Domain

1. Railway → Settings → Networking → Custom Domain: tambahkan `www.bimbelinfinity.com` dan `bimbelinfinity.com`.
2. Isi DNS di registrar domain sesuai CNAME/record yang diberikan Railway.
3. `server.js` mengarahkan `bimbelinfinity.com` dan `http://` ke `https://www.bimbelinfinity.com` (301), sesuai canonical di semua halaman.

## Setelah online

- Google Search Console dan Bing Webmaster Tools: verifikasi domain, kirim `https://www.bimbelinfinity.com/sitemap.xml`.
- Cek `https://www.bimbelinfinity.com/healthz` (harus `ok`), `/robots.txt`, `/llms.txt`.

## Yang dilakukan server

- Kompresi Brotli/gzip untuk HTML, CSS, JS, XML, TXT, SVG.
- Cache: halaman selalu divalidasi ulang; CSS/JS 1 jam; gambar 7 hari; ETag + 304.
- Header keamanan (nosniff, referrer policy, frame, permissions; HSTS di https).
- Tidak pernah melayani: `tools/`, `content/`, `concept/`, `_backup-original/`, `Untuk Website Infinity/`, folder bertitik, `*.md`, `server.js`, `package.json`, `railway.json`.
- URL rapi: `/blog` → `/blog/`, `/testimoni` → `testimoni.html`, `/index.html` → `/`; halaman 404 bermerek.
