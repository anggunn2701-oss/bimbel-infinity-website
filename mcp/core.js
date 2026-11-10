/* Core of the MCP server "Infinity Konten": tools + JSON-RPC dispatch, shared by
   mcp/server.js (stdio, for Claude Code / Claude Desktop) and mcp/http.js (remote HTTP, for Grok and other bots).
   Works on the site folder in INFINITY_SITE_ROOT (default: this repository). */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { markdownToHtml } = require('./markdown');

const ROOT = process.env.INFINITY_SITE_ROOT ? path.resolve(process.env.INFINITY_SITE_ROOT) : path.resolve(__dirname, '..');
const SITE = 'https://bimbelinfinity.com';
const FILES = {
  posts: 'content/blog-posts.json',
  home: 'content/home.json',
  videos: 'content/testimonial-videos.json',
  alumni: 'content/alumni-2018.json',
};
const load = (k) => JSON.parse(fs.readFileSync(path.join(ROOT, FILES[k]), 'utf8'));
const save = (k, data) => fs.writeFileSync(path.join(ROOT, FILES[k]), JSON.stringify(data, null, 2) + '\n');
const strip = (h) => String(h).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const today = () => new Date().toISOString().slice(0, 10);
const git = (...args) => execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

class UserError extends Error {}
const need = (cond, msg) => { if (!cond) throw new UserError(msg); };

/* ---------- validation shared by tools ---------- */
function postWarnings(p) {
  const w = [];
  if (p.title.length > 70) w.push(`Judul ${p.title.length} karakter; di Google sering terpotong setelah ~60–70.`);
  if (p.description.length < 70 || p.description.length > 160) w.push(`Deskripsi ${p.description.length} karakter; idealnya 70–160 untuk hasil pencarian.`);
  if (strip(p.summary).length > 420) w.push('Jawaban singkat terlalu panjang; 2–3 kalimat lebih mudah dikutip mesin jawaban.');
  if (!p.faq.length) w.push('Belum ada FAQ; 2–4 pertanyaan membantu AEO dan rich result.');
  if (!/<h2>/.test(p.body)) w.push('Isi belum punya subjudul (##); tulis subjudul sebagai pertanyaan.');
  return w;
}

/* ---------- build + checks ---------- */
function build() {
  const out = execFileSync(process.execPath, [path.join(ROOT, 'tools/build-site.js')], { cwd: ROOT, encoding: 'utf8' });
  const pages = ['index.html', 'testimoni.html', 'blog/index.html', ...load('posts').map((p) => `blog/${p.slug}.html`)];
  const broken = [];
  for (const f of pages) {
    const h = fs.readFileSync(path.join(ROOT, f), 'utf8');
    const dir = path.dirname(path.join(ROOT, f));
    for (const m of h.matchAll(/(?:href|src)="([^"#:?]+?)(?:[#?][^"]*)?"/g)) {
      const p = m[1];
      if (/^(https?|mailto|tel)/.test(p) || !p) continue;
      let full = path.join(dir, decodeURI(p));
      if (p.endsWith('/')) full = path.join(full, 'index.html');
      if (!fs.existsSync(full)) broken.push(`${f} → ${p}`);
    }
  }
  return { log: out.trim(), broken };
}

/* ---------- tools ---------- */
const TOOLS = {
  site_overview: {
    description: 'Ringkasan website Bimbel Infinity dan apa saja yang bisa diedit lewat MCP ini. Panggil ini dulu.',
    schema: { type: 'object', properties: {} },
    run() {
      const posts = load('posts'), home = load('home'), vids = load('videos'), alumni = load('alumni');
      let status = '';
      try { status = git('status', '--short').trim(); } catch { status = '(git tidak tersedia)'; }
      return {
        situs: SITE,
        artikel_blog: posts.map((p) => ({ slug: p.slug, judul: p.title, tanggal: p.date })),
        beranda: { judul_hero: `${home.hero.title} ${home.hero.highlight}`, program: home.programs.map((p) => p.name), jumlah_faq: home.faq.length },
        video_testimoni: vids.map((v) => `${v.key} (${v.name})`),
        lulusan_2018: alumni.length,
        perubahan_belum_terbit: status || 'tidak ada',
        alur: 'edit (save_post, update_hero, set_homepage_faq, update_program, save_testimonial_video, update_alumni) → build_site → review_changes → publish (confirm: true)',
      };
    },
  },

  list_posts: {
    description: 'Daftar semua artikel blog.',
    schema: { type: 'object', properties: {} },
    run: () => load('posts').map((p) => ({ slug: p.slug, title: p.title, category: p.category, date: p.date, url: `${SITE}/blog/${p.slug}.html` })),
  },

  get_post: {
    description: 'Ambil satu artikel lengkap (isi HTML, jawaban singkat, FAQ).',
    schema: { type: 'object', properties: { slug: { type: 'string' } }, required: ['slug'] },
    run({ slug }) {
      const p = load('posts').find((x) => x.slug === slug);
      need(p, `Artikel "${slug}" tidak ada. Pakai list_posts.`);
      return p;
    },
  },

  save_post: {
    description: 'Buat artikel baru atau ganti artikel yang ada (berdasarkan slug). Tulis isi dalam Markdown (body_markdown: ## subjudul, paragraf, - daftar, 1. daftar, > kutipan, tabel |a|b|, **tebal**, [link](url)). Jangan menulis angka jadwal/kuota/nilai ambang batas yang belum pasti; arahkan ke pengumuman resmi. Setelah ini jalankan build_site.',
    schema: {
      type: 'object',
      properties: {
        slug: { type: 'string', description: 'huruf kecil-dan-strip, mis. "tips-tiu-pkn-stan"' },
        title: { type: 'string' },
        description: { type: 'string', description: 'meta description, 70–160 karakter' },
        category: { type: 'string', description: 'mis. "Seleksi PKN STAN", "Program", "Cerita alumni", "Tentang Infinity"' },
        summary: { type: 'string', description: 'Jawaban singkat 2–3 kalimat, tampil di kotak paling atas' },
        body_markdown: { type: 'string' },
        body_html: { type: 'string', description: 'alternatif body_markdown bila perlu HTML' },
        faq: { type: 'array', items: { type: 'object', properties: { q: { type: 'string' }, a: { type: 'string' } }, required: ['q', 'a'] } },
        date: { type: 'string', description: 'YYYY-MM-DD; default hari ini untuk artikel baru' },
        minutes: { type: 'number', description: 'lama baca; default dihitung otomatis' },
      },
      required: ['slug', 'title', 'description', 'category', 'summary', 'faq'],
    },
    run(a) {
      need(/^[a-z0-9]+(-[a-z0-9]+)*$/.test(a.slug), 'slug hanya boleh huruf kecil, angka, dan strip.');
      need(a.body_markdown || a.body_html, 'Isi artikel wajib: body_markdown atau body_html.');
      need(!a.date || /^\d{4}-\d{2}-\d{2}$/.test(a.date), 'date harus YYYY-MM-DD.');
      const posts = load('posts');
      const old = posts.find((p) => p.slug === a.slug);
      const body = a.body_markdown ? markdownToHtml(a.body_markdown) : a.body_html;
      const words = strip(body).split(' ').length;
      const post = {
        slug: a.slug, title: a.title.trim(), description: a.description.trim(), category: a.category.trim(),
        date: a.date || (old ? old.date : today()), ...(old ? { updated: today() } : {}),
        minutes: a.minutes || Math.max(2, Math.round(words / 200)),
        summary: a.summary.trim(), body, faq: a.faq.map(({ q, a: ans }) => [q.trim(), ans.trim()]),
      };
      if (old) posts[posts.indexOf(old)] = post; else posts.unshift(post);
      save('posts', posts);
      return { status: old ? 'artikel diperbarui' : 'artikel baru dibuat', url: `${SITE}/blog/${post.slug}.html`, peringatan: postWarnings(post), langkah_berikut: 'build_site' };
    },
  },

  delete_post: {
    description: 'Hapus artikel blog. Wajib confirm: true.',
    schema: { type: 'object', properties: { slug: { type: 'string' }, confirm: { type: 'boolean' } }, required: ['slug', 'confirm'] },
    run({ slug, confirm }) {
      need(confirm === true, 'Konfirmasi dulu ke pengguna, lalu kirim confirm: true.');
      const posts = load('posts');
      need(posts.some((p) => p.slug === slug), `Artikel "${slug}" tidak ada.`);
      save('posts', posts.filter((p) => p.slug !== slug));
      const file = path.join(ROOT, 'blog', `${slug}.html`);
      if (fs.existsSync(file)) fs.unlinkSync(file);
      return { status: `artikel ${slug} dihapus`, langkah_berikut: 'build_site' };
    },
  },

  get_homepage: {
    description: 'Lihat konten beranda yang bisa diedit: hero, tiga program, dan FAQ orang tua.',
    schema: { type: 'object', properties: {} },
    run: () => load('home'),
  },

  update_hero: {
    description: 'Ubah judul hero (title + highlight berwarna oranye) dan paragraf di bawahnya.',
    schema: { type: 'object', properties: { title: { type: 'string' }, highlight: { type: 'string' }, lead: { type: 'string' } } },
    run(a) {
      const home = load('home');
      for (const k of ['title', 'highlight', 'lead']) if (a[k] !== undefined) home.hero[k] = a[k].trim();
      const len = `${home.hero.title} ${home.hero.highlight}`.length;
      save('home', home);
      return { hero: home.hero, peringatan: len > 60 ? [`Judul ${len} karakter; di HP lebih dari ~60 karakter jadi 4 baris.`] : [], langkah_berikut: 'build_site' };
    },
  },

  set_homepage_faq: {
    description: 'Ganti seluruh daftar FAQ orang tua di beranda (urutan sesuai array). Jawaban boleh berisi <span class="ph">…</span> untuk data yang belum pasti; FAQ seperti itu tidak dimasukkan ke schema Google.',
    schema: { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { q: { type: 'string' }, a: { type: 'string' } }, required: ['q', 'a'] } } }, required: ['items'] },
    run({ items }) {
      need(items.length >= 1 && items.length <= 12, 'FAQ 1–12 pertanyaan.');
      const home = load('home');
      home.faq = items.map(({ q, a }) => ({ q: q.trim(), a: a.trim() }));
      save('home', home);
      return { jumlah: home.faq.length, langkah_berikut: 'build_site' };
    },
  },

  update_program: {
    description: 'Ubah satu program di tabel program beranda (Reguler Bintaro, Karantina, Cabang daerah). Hanya field yang dikirim yang diubah. Jangan menulis harga.',
    schema: {
      type: 'object',
      properties: { name: { type: 'string' }, new_name: { type: 'string' }, for: { type: 'string' }, place: { type: 'string' }, format: { type: 'string' }, feature: { type: 'string' }, message: { type: 'string', description: 'pesan otomatis saat tombol Tanya biaya ditekan' } },
      required: ['name'],
    },
    run(a) {
      const home = load('home');
      const p = home.programs.find((x) => x.name.toLowerCase() === a.name.toLowerCase());
      need(p, `Program "${a.name}" tidak ada. Pilihan: ${home.programs.map((x) => x.name).join(', ')}.`);
      need(!/rp\s?\d|\d{3}\.\d{3}/i.test(JSON.stringify(a)), 'Harga tidak ditampilkan di website; biaya dijelaskan konsultan.');
      for (const k of ['for', 'place', 'format', 'feature', 'message']) if (a[k] !== undefined) p[k] = a[k].trim();
      if (a.new_name) p.name = a.new_name.trim();
      save('home', home);
      return { program: p, langkah_berikut: 'build_site' };
    },
  },

  list_testimonial_videos: {
    description: 'Daftar video testimoni di barisan video beranda.',
    schema: { type: 'object', properties: {} },
    run: () => load('videos'),
  },

  save_testimonial_video: {
    description: 'Tambah atau ubah video testimoni dari link Cloudinary (res.cloudinary.com/jnye0bk5/video/upload/...). Video landscape 1280×720 di-crop potret otomatis; face_x = posisi kiri crop (0–891, default 445 = tengah). Video asli di Cloudinary tidak diubah.',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string' }, caption: { type: 'string', description: 'baris kecil di bawah nama, mis. "D3 Pajak, lulus 2019"' },
        cloudinary_url: { type: 'string' }, key: { type: 'string', description: 'isi untuk mengubah video yang ada' },
        face_x: { type: 'number' }, position: { type: 'number', description: 'urutan di barisan, mulai 1' },
      },
      required: ['name'],
    },
    run(a) {
      const vids = load('videos');
      let v = a.key ? vids.find((x) => x.key === a.key) : null;
      need(!a.key || v, `Video "${a.key}" tidak ada.`);
      let id = v && v.cloudinaryId;
      if (a.cloudinary_url) {
        const m = a.cloudinary_url.match(/res\.cloudinary\.com\/jnye0bk5\/video\/upload\/(?:.*\/)?(v\d+\/[^?#]+?)\.(mp4|mov|webm|m4v)/i);
        need(m, 'Link harus video Cloudinary akun jnye0bk5, mis. https://res.cloudinary.com/jnye0bk5/video/upload/v123/nama.mp4');
        id = m[1];
      }
      need(id, 'cloudinary_url wajib untuk video baru.');
      const faceX = Math.max(0, Math.min(891, Math.round(a.face_x ?? (v ? v.faceX : 445))));
      if (!v) {
        const key = 't' + a.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 20);
        need(!vids.some((x) => x.key === key), `Sudah ada video dengan key ${key}; kirim key untuk mengubahnya.`);
        v = { key, name: '', caption: 'Siswa Bimbel Infinity', cloudinaryId: id, faceX };
        vids.push(v);
      }
      Object.assign(v, { name: a.name.trim(), caption: (a.caption ?? v.caption).trim(), cloudinaryId: id, faceX });
      if (a.position) { vids.splice(vids.indexOf(v), 1); vids.splice(Math.max(0, a.position - 1), 0, v); }
      save('videos', vids);
      return { video: v, poster_untuk_dicek: `https://res.cloudinary.com/jnye0bk5/video/upload/so_3/c_crop,w_389,h_518,x_${faceX},y_14/w_540/q_auto/${id}.jpg`, catatan: 'Buka poster_untuk_dicek; kalau wajah tidak di tengah, ubah face_x.', langkah_berikut: 'build_site' };
    },
  },

  remove_testimonial_video: {
    description: 'Hapus video dari barisan testimoni beranda (file di Cloudinary tetap). Wajib confirm: true.',
    schema: { type: 'object', properties: { key: { type: 'string' }, confirm: { type: 'boolean' } }, required: ['key', 'confirm'] },
    run({ key, confirm }) {
      need(confirm === true, 'Konfirmasi dulu ke pengguna, lalu kirim confirm: true.');
      const vids = load('videos');
      need(vids.some((v) => v.key === key), `Video "${key}" tidak ada.`);
      need(vids.length > 3, 'Sisakan minimal 3 video supaya barisan tetap penuh.');
      save('videos', vids.filter((v) => v.key !== key));
      return { status: `video ${key} dihapus dari barisan`, langkah_berikut: 'build_site' };
    },
  },

  list_alumni: {
    description: 'Daftar lulusan 2018 di halaman testimoni (bisa disaring per kota).',
    schema: { type: 'object', properties: { city: { type: 'string', description: 'Depok, Jember, Lombok, atau Sukabumi' } } },
    run({ city } = {}) {
      return load('alumni').filter((p) => !city || p.city.toLowerCase() === city.toLowerCase())
        .map(({ slug, name, city: c, major, school, quote }) => ({ slug, name, city: c, major, school, ada_testimoni: !!quote }));
    },
  },

  update_alumni: {
    description: 'Perbaiki data teks satu lulusan (nama, jurusan, sekolah, testimoni). Testimoni ditampilkan apa adanya; jangan mengarang kutipan.',
    schema: { type: 'object', properties: { slug: { type: 'string' }, name: { type: 'string' }, major: { type: 'string' }, school: { type: 'string' }, quote: { type: 'string' } }, required: ['slug'] },
    run(a) {
      const list = load('alumni');
      const p = list.find((x) => x.slug === a.slug);
      need(p, `Lulusan "${a.slug}" tidak ada. Pakai list_alumni.`);
      for (const k of ['name', 'major', 'school', 'quote']) if (a[k] !== undefined) p[k] = a[k].trim();
      save('alumni', list);
      return { lulusan: { slug: p.slug, name: p.name, major: p.major, school: p.school }, langkah_berikut: 'build_site' };
    },
  },

  build_site: {
    description: 'Bangun ulang semua halaman dari konten (beranda, testimoni, blog, sitemap, llms.txt) dan cek link rusak.',
    schema: { type: 'object', properties: {} },
    run() {
      const r = build();
      return { hasil: r.log, link_rusak: r.broken.length ? r.broken : 'tidak ada', langkah_berikut: 'review_changes, lalu publish' };
    },
  },

  review_changes: {
    description: 'Tampilkan file yang berubah dan belum diterbitkan (git).',
    schema: { type: 'object', properties: {} },
    run() {
      const st = git('status', '--short').trim();
      return { berubah: st ? st.split('\n') : [], ringkasan: st ? git('diff', '--stat').trim() : 'tidak ada perubahan' };
    },
  },

  publish: {
    description: 'Terbitkan: build ulang, commit semua perubahan, lalu push ke GitHub (Railway otomatis deploy ulang dalam beberapa menit). Tanyakan pengguna dulu, lalu kirim confirm: true.',
    schema: { type: 'object', properties: { message: { type: 'string', description: 'ringkasan perubahan, mis. "Tambah artikel tips TIU"' }, confirm: { type: 'boolean' } }, required: ['message', 'confirm'] },
    run({ message, confirm }) {
      need(confirm === true, 'Konfirmasi dulu ke pengguna, lalu kirim confirm: true.');
      const r = build();
      need(!r.broken.length, `Ada link rusak, perbaiki dulu: ${r.broken.join('; ')}`);
      git('add', '-A');
      if (!git('status', '--short').trim()) return { status: 'tidak ada perubahan untuk diterbitkan' };
      git('commit', '-m', `${message.trim()}\n\nDiterbitkan lewat MCP Infinity Konten.`);
      const sha = git('rev-parse', '--short', 'HEAD').trim();
      git('push', 'origin', 'HEAD');
      return { status: 'terbit', commit: sha, catatan: 'Railway men-deploy ulang otomatis; cek situs beberapa menit lagi.', situs: SITE };
    },
  },
};

/* ---------- JSON-RPC dispatch (transport-independent) ---------- */
const SUPPORTED = ['2025-06-18', '2025-03-26', '2024-11-05'];
const INSTRUCTIONS = 'Edit konten website Bimbel Infinity. Panggil site_overview dulu. Alur: edit → build_site → review_changes → publish (minta persetujuan pengguna dulu). Jangan mengarang data (angka kelulusan, harga, jadwal, kutipan siswa).';
/* returns a JSON-RPC response object, or null for notifications */
function handleMessage(msg, hooks = {}) {
  const { id, method, params = {} } = msg || {};
  const reply = (body) => (id === undefined ? null : { jsonrpc: '2.0', id, ...body });   // no id = notification, no reply
  if (method === 'initialize') {
    return reply({ result: {
      protocolVersion: SUPPORTED.includes(params.protocolVersion) ? params.protocolVersion : SUPPORTED[0],
      capabilities: { tools: {} },
      serverInfo: { name: 'infinity-konten', title: 'Infinity Konten', version: '1.1.0' },
      instructions: INSTRUCTIONS,
    } });
  }
  if (method === 'ping') return reply({ result: {} });
  if (method === 'tools/list') {
    return reply({ result: { tools: Object.entries(TOOLS).map(([name, t]) => ({ name, description: t.description, inputSchema: t.schema })) } });
  }
  if (method === 'tools/call') {
    const t = TOOLS[params.name];
    if (!t) return reply({ error: { code: -32602, message: `Tool tidak dikenal: ${params.name}` } });
    try {
      if (hooks.beforeCall) hooks.beforeCall(params.name);
      const out = t.run(params.arguments || {});
      return reply({ result: { content: [{ type: 'text', text: typeof out === 'string' ? out : JSON.stringify(out, null, 2) }] } });
    } catch (e) {
      const text = e instanceof UserError ? e.message : `Gagal: ${e.stderr ? String(e.stderr).trim() : e.message}`;
      return reply({ result: { content: [{ type: 'text', text }], isError: true } });
    }
  }
  if (typeof method === 'string' && method.startsWith('notifications/')) return null;
  return reply({ error: { code: -32601, message: `Method tidak didukung: ${method}` } });
}

module.exports = { TOOLS, handleMessage, ROOT, SITE, git };
