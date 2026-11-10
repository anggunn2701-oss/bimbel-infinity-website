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
