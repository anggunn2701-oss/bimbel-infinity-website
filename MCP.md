# MCP "Infinity Konten": edit isi website lewat Claude

MCP server di `mcp/server.js` (Node, tanpa dependency) memberi Claude alat untuk mengedit konten website, membangun ulang halaman, dan menerbitkannya. Yang diedit hanya file data di `content/`; HTML dibuat ulang otomatis oleh `tools/build-site.js`.

## Memasang

**Claude Code** (di folder proyek ini): sudah terdaftar lewat `.mcp.json`. Buka sesi Claude Code di folder ini dan setujui server `infinity-konten` saat diminta.

**Claude Desktop**: Settings → Developer → Edit Config, tambahkan:
```json
{
  "mcpServers": {
    "infinity-konten": {
      "command": "node",
      "args": ["C:\\Users\\lenovo\\Downloads\\Untuk Website Infinity-20261109T035808Z-1-002\\mcp\\server.js"]
    }
  }
}
```
Lalu restart Claude Desktop. Syarat: Node 20+ dan git terpasang, dan folder ini sudah login ke GitHub (untuk publish).

## Contoh perintah

- "Tulis artikel baru tentang cara membagi waktu saat mengerjakan TIU."
- "Ganti jawaban FAQ soal garansi dengan: …"
- "Tambahkan video testimoni ini: https://res.cloudinary.com/jnye0bk5/video/upload/v…/nama.mp4, namanya Rina, D3 Akuntansi."
- "Ubah judul hero jadi …"
- "Perbaiki jurusan lulusan Arif Rahman jadi D3 Pajak."
- "Terbitkan perubahannya."

## Alur

1. **Edit**: `save_post`, `delete_post`, `update_hero`, `set_homepage_faq`, `update_program`, `save_testimonial_video`, `remove_testimonial_video`, `update_alumni`.
2. **Bangun**: `build_site` (semua halaman, sitemap, llms.txt; cek link rusak).
3. **Cek**: `review_changes` (file yang berubah). Untuk melihat tampilannya, jalankan `npm start` dan buka http://localhost:3000.
4. **Terbit**: `publish` dengan `confirm: true`: commit + push ke GitHub, lalu Railway men-deploy ulang otomatis.

## Pengaman

- Hapus artikel, hapus video, dan publish wajib `confirm: true` (Claude harus bertanya dulu).
- Harga ditolak di program (biaya dijelaskan konsultan).
- Video hanya dari akun Cloudinary `jnye0bk5`; file asli di Cloudinary tidak diubah.
- Artikel diberi peringatan SEO: panjang judul/deskripsi, jawaban singkat, FAQ, subjudul.
- Publish dibatalkan kalau ada link rusak.
- MCP hanya menulis ke `content/` dan file hasil build; `mcp/`, `tools/`, dan `content/` tidak pernah dilayani di website.

## File data

| File | Isi |
|---|---|
| `content/blog-posts.json` | artikel blog (judul, deskripsi, jawaban singkat, isi HTML, FAQ) |
| `content/home.json` | hero, tiga program, FAQ orang tua |
| `content/testimonial-videos.json` | video di barisan testimoni beranda |
| `content/alumni-2018.json` | 38 lulusan 2018 di halaman testimoni |

## MCP remote (Grok, Muse, dan bot AI lain)

Bot yang berjalan di server lain tidak bisa menjalankan `mcp/server.js` di komputer ini. Untuk mereka ada `mcp/http.js`: MCP lewat HTTPS (Streamable HTTP, balasan JSON) yang jalan sebagai **service kedua di Railway**. Ia meng-clone repo GitHub, mengedit `content/*.json`, membangun situs, dan `publish` mem-push ke GitHub; service website lalu deploy ulang sendiri.

### Membuat service di Railway

1. **Token GitHub** (sekali): GitHub → Settings → Developer settings → Personal access tokens → **Fine-grained token**.
   - Repository access: *Only select repositories* → `bimbel-infinity-website`.
   - Permissions → Repository → **Contents: Read and write** (yang lain biarkan).
   - Simpan tokennya; jangan dibagikan.
2. **Token MCP** (sekali): string acak panjang, misalnya hasil `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Ini "kata sandi" untuk bot.
3. **Railway** → project website → **+ New** → **GitHub Repo** → `bimbel-infinity-website` (service kedua dari repo yang sama).
4. Di service baru → **Settings**:
   - **Config-as-code / Railway config file**: `mcp/railway.json` (membangun `mcp/Dockerfile`, start `node mcp/http.js`, health check `/healthz`, hanya deploy ulang saat folder `mcp/` berubah).
   - **Networking → Generate Domain** (atau custom domain `mcp.bimbelinfinity.com` + CNAME di Cloudflare, DNS only).
5. **Variables**: `MCP_TOKEN` = token MCP, `GITHUB_TOKEN` = token GitHub. Opsional: `GITHUB_REPO` (default `anggunn2701-oss/bimbel-infinity-website`), `GIT_BRANCH` (default `main`).
6. Deploy, lalu cek `https://<domain-mcp>/healthz` → `{"ok":true,"mode":"github"}`.

### Menyambungkan bot

- **Server URL**: `https://<domain-mcp>/mcp`
- **Header**: `Authorization: Bearer <MCP_TOKEN>`
- Kalau bot hanya menerima URL tanpa header: pakai `https://<domain-mcp>/mcp/<MCP_TOKEN>` (rahasiakan URL ini seperti kata sandi).
- Transport: **Streamable HTTP**. Tidak perlu SSE.

Contoh tes dari terminal:
```bash
curl -s https://<domain-mcp>/mcp -H "Authorization: Bearer <MCP_TOKEN>" -H "Content-Type: application/json" -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

### Catatan keamanan

- Siapa pun yang memegang `MCP_TOKEN` bisa mengubah dan menerbitkan isi website. Ganti token di Railway kapan saja (bot lama otomatis terputus).
- Token GitHub hanya untuk repo ini dan hanya izin Contents; tidak pernah ditulis ke URL, file, atau log.
- Draf yang belum di-publish tersimpan di container dan hilang kalau service restart; terbitkan atau ulangi.
- Setiap publish adalah commit biasa di GitHub, jadi bisa dibatalkan (revert) dari riwayat commit.
