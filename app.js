/* ==========================================================================
   BIMBEL INFINITY — website utama
   ========================================================================== */

/* ---------- PENGATURAN (diisi tim) ---------- */

/* Nomor WhatsApp admin, format 62xxxxxxxxxx tanpa + atau spasi.
   Selama kosong, tombol "Chat admin" jatuh ke telepon kantor. */
const WA_NUMBER = "";
const PHONE = "02122733744";
const EMAIL = "bimbelinfinityid@gmail.com";

/* Video. Isi `cloudinaryUrl` dengan link MP4 yang sudah dikompres (idealnya < 15 MB).
   Selama kosong, dipakai file lokal mentah yang sangat besar (90–157 MB). */
const CLOUDINARY_CONFIG = {
  videos: {
    alumni2018: {
      title: "Testimoni alumni angkatan 2018",
      subtitle: "Kumpulan cerita alumni Infinity yang lolos seleksi PKN STAN.",
      cloudinaryUrl: "",
      localFallbackUrl: "./Untuk Website Infinity/Video/Testimoni Alumni Infinity 2018 (Slide 10 PPT).mp4",
      poster: "./assets/images/poster-alumni-2018.jpg"
    },
    sapaanKelas: {
      title: "Suasana kelas Infinity",
      subtitle: "Satu sesi kelas diskusi di Bintaro.",
      cloudinaryUrl: "https://res.cloudinary.com/jnye0bk5/video/upload/w_1280/q_auto,vc_auto/v1794302283/MVI_4058.mp4",
      localFallbackUrl: "./Untuk Website Infinity/MVI_4058.MOV",
      poster: "./assets/images/poster-mvi-4058.jpg"
    },
    adhiBlora: {
      title: "Adhi, dari Blora",
      subtitle: "Pengalaman ikut kelas motivasi dan Try Out Akbar di Infinity.",
      cloudinaryUrl: "",
      localFallbackUrl: "./Untuk Website Infinity/Video/Bimbel STAN Terbaik - Bimbel Infinity -Testimoni Siswa Adhi Blora.mp4",
      poster: "./assets/images/poster-adhi-blora.png"
    }
  }
};

/* Testimoni siswa (Cloudinary). Versi penuh: 1280px, warna diperbaiki (kontras, kecerahan, ketajaman),
   2–9 MB, dari file asli 23–73 MB. Preview tanpa suara di rail ada di index.html. */
const CLD = "https://res.cloudinary.com/jnye0bk5/video/upload";
const CLD_FX = "e_contrast:25/e_saturation:8/e_brightness:5";
/* TESTI:START */
/* dibuat dari content/testimonial-videos.json oleh tools/build-site.js */
const TESTI_VIDEOS = [
  {
    "key": "tElrandi",
    "name": "Elrandi",
    "id": "v1794300326/Bimbel_STAN_Terbaik_-_Bimbel_Infinity_-Testimoni_Siswa_Elrandi"
  },
  {
    "key": "tFairuz",
    "name": "Fairuz",
    "id": "v1794300317/Bimbel_STAN_Terbaik_-_Bimbel_Infinity_-Testimoni_Siswa_Fairuz"
  },
  {
    "key": "tMoses",
    "name": "Moses",
    "id": "v1794300334/Bimbel_STAN_Terbaik_-_Bimbel_Infinity_-Testimoni_Siswa_Moses"
  },
  {
    "key": "tGinus",
    "name": "Ginus",
    "id": "v1794300197/Bimbel_STAN_Terbaik_-_Bimbel_Infinity_-Testimoni_Siswa_Ginus"
  },
  {
    "key": "tMifta",
    "name": "Mifta",
    "id": "v1794300251/Bimbel_STAN_Terbaik_-_Bimbel_Infinity_-Testimoni_Siswa_Mifta"
  },
  {
    "key": "tArdi",
    "name": "Ardi Triantama",
    "id": "v1794300315/Bimbel_STAN_Terbaik_-_Bimbel_Infinity_-Testimoni_Ardi_Triantama"
  },
  {
    "key": "tAde",
    "name": "Ade Souza",
    "id": "v1794300247/Bimbel_STAN_Terbaik_-_Bimbel_Infinity_-Testimoni_Siswa_Ade_Souza"
  }
];
/* TESTI:END */
TESTI_VIDEOS.forEach((t) => {
  CLOUDINARY_CONFIG.videos[t.key] = {
    title: "Testimoni " + t.name,
    subtitle: "Siswa Bimbel Infinity",
    cloudinaryUrl: `${CLD}/w_1280/${CLD_FX}/e_sharpen:60/q_auto,vc_auto/${t.id}.mp4`,
    localFallbackUrl: "",
    poster: `${CLD}/so_3,w_1280/${CLD_FX}/q_auto/${t.id}.jpg`
  };
});

function getVideoSource(key) {
  const v = CLOUDINARY_CONFIG.videos[key];
  if (!v) return "";
  return v.cloudinaryUrl && v.cloudinaryUrl.trim() ? v.cloudinaryUrl : encodeURI(v.localFallbackUrl);
}

/* ---------- DATA PERJALANAN & CABANG ---------- */
const PROGRAM_SCRUBBER_DATA = {
  "2013": {
    eraLabel: "FASE 01 • 2013",
    heading: "Inisiasi Mahasiswa PKN STAN & Kelulusan Perdana",
    summary: "Didirikan pada 17 April 2013 oleh Riandi Ahmad bersama Sabrina Hakim, Muhammad Sopyan, Ferdian Jati Permana, Dwi Widiatmoko, dan Fachri Ahmad.",
    image: "./assets/images/gedung-kemenkeu.jpg",
    imageTag: "17 APRIL 2013 • PONDOK AREN, TANGERANG SELATAN",
    imageCaption: "Lahir dari harapan mahasiswa PKN STAN untuk berkontribusi kepada kampus dan Kementerian Keuangan.",
    milestones: [
      {
        date: "April 2013",
        title: "Gedung Pertama di PJMI Pondok Aren",
        desc: "Resmi berdiri pada 17 April 2013 dan menempati gedung baru di Jl. Sejahtera A. 15/16 PJMI, Pondok Aren, Tangerang Selatan."
      },
      {
        date: "Juli 2013",
        title: "Meluluskan Angkatan Pertama (Kelulusan 25%)",
        desc: "Pertama kali meluluskan siswa ke kampus STAN melalui nama Bimbel Infinity dengan tingkat kelulusan awal 25%."
      }
    ]
  },
  "2014": {
    eraLabel: "FASE 02 • 2014",
    heading: "Langkah Pertama Ekspansi Luar Pulau Jawa",
    summary: "Membawa standar bimbingan belajar Bintaro ke luar Pulau Jawa melalui program cabang yang berjalan secara periodik.",
    image: "./assets/images/poster-adhi-blora.png",
    imageTag: "FEBRUARI 2014 • EKSPANSI REGIONAL",
    imageCaption: "Pendampingan siswa lintas daerah dengan Kelas Nyaman, Kelas Motivasi, dan Try Out Akbar.",
    milestones: [
      {
        date: "Februari 2014",
        title: "Pembukaan Cabang Periodik di Medan",
        desc: "Membuka cabang pertama yang berjalan secara periodik di Kota Medan, Sumatera Utara."
      }
    ]
  },
  "2015": {
    eraLabel: "FASE 03 • 2015",
    heading: "Pengesahan Badan Hukum PT Infinity Global Inspiratif",
    summary: "Transformasi kelembagaan menjadi Perseroan Terbatas resmi berdasarkan hukum Republik Indonesia dan ekspansi ke 3 provinsi baru.",
    image: "./assets/images/kantor-bintaro.jpeg",
    imageTag: "AKTA NOTARIS NO. 06 • 19 OKTOBER 2015",
    imageCaption: "Penguatan legalitas PT Infinity Global Inspiratif dan perluasan cabang periodik.",
    milestones: [
      {
        date: "Februari 2015",
        title: "Pembukaan Cabang Palembang & Bandung",
        desc: "Membuka cabang yang berjalan secara periodik di Kota Palembang dan Kota Bandung."
      },
      {
        date: "Juni & Okt 2015",
        title: "Pembentukan PT Infinity Global Inspiratif",
        desc: "Perseroan terbatas didirikan berdasarkan hukum Republik Indonesia dan dicatatkan dalam Akta Notaris Nomor 06 tanggal 19 Oktober 2015."
      },
      {
        date: "Desember 2015",
        title: "Pembukaan Cabang Periodik di Lombok",
        desc: "Membuka cabang yang berjalan secara periodik di Lombok, Nusa Tenggara Barat."
      }
    ]
  },
  "2016": {
    eraLabel: "FASE 04 • 2016",
    heading: "Platform Karantina Mandiri & Gedung Depan Kampus STAN",
    summary: "Peluncuran karantinastan.com bersama mahasiswa berprestasi STAN, perpindahan ke depan gerbang kampus STAN, dan kemitraan 5 kota besar.",
    image: "./assets/images/poster-mvi-4058.jpg",
    imageTag: "MARET – OKTOBER 2016 • KARANTINASTAN.COM",
    imageCaption: "Kolaborasi langsung bersama mahasiswa berprestasi di PKN STAN dan pembukaan gedung Jl. Pisok I.",
    milestones: [
      {
        date: "Februari 2016",
        title: "Pembukaan Cabang Periodik di Yogyakarta",
        desc: "Membuka cabang yang berjalan secara periodik di Yogyakarta."
      },
      {
        date: "Maret 2016",
        title: "Peluncuran Platform karantinastan.com",
        desc: "Meluncurkan program karantina yang berdiri sendiri melalui platform karantinastan.com bekerja sama dengan para mahasiswa berprestasi di STAN."
      },
      {
        date: "September 2016",
        title: "Kemitraan Pengembangan Cabang Utama Bintaro",
        desc: "Menjalin kerja sama dengan Maria Magdalena dalam pengembangan Cabang Utama Bintaro."
      },
      {
        date: "Oktober 2016",
        title: "Pembukaan 4 Cabang Mitra Bisnis Baru",
        desc: "Menyepakati kerja sama pembukaan cabang baru dengan mitra bisnis di Pekanbaru, Makassar, Balikpapan, dan Banjarmasin."
      },
      {
        date: "Oktober 2016",
        title: "Gedung Baru Tepat di Depan Kampus STAN (Jl. Pisok I)",
        desc: "Perpindahan kantor utama dari Jl. Sejahtera A 15/16 PJMI ke Jl. Pisok I Blok EA 15 No. 1, Tangerang Selatan (tepat di depan kampus STAN). Seluruh bangunan sebelumnya digunakan penuh untuk ruang kelas."
      }
    ]
  },
  "2017": {
    eraLabel: "FASE 05 • 2017",
    heading: "Penguatan Jaringan Jawa Tengah & Jawa Timur",
    summary: "Memperluas akses pendidikan kedinasan di koridor selatan dan timur Pulau Jawa melalui pembukaan cabang Jember dan Purwokerto.",
    image: "./assets/images/poster-alumni-2018.jpg",
    imageTag: "AGUSTUS 2017 • JEMBER & PURWOKERTO",
    imageCaption: "Menjangkau lebih banyak calon mahasiswa PKN STAN di Jawa Tengah dan Jawa Timur.",
    milestones: [
      {
        date: "Agustus 2017",
        title: "Pembukaan Cabang Baru di Jember & Purwokerto",
        desc: "Menyepakati pembukaan cabang baru di Jember dan Purwokerto."
      }
    ]
  },
  "2018": {
    eraLabel: "FASE 06 • 2018",
    heading: "Kampus Utama Pondok Jaya Bintaro & Ekspansi 14 Kota",
    summary: "Penempatan gedung baru belajar mengajar dan kantor pusat di Jl. Porselin Blok E6 No. 11 Bintaro Sektor 3A, serta kemitraan cabang Sukabumi & Surabaya.",
    image: "./assets/images/kantor-bintaro.jpeg",
    imageTag: "JL. PORSELIN NO. 11 BLOK E6 • BINTARO SEKTOR 3A",
    imageCaption: "Kantor Cabang Utama Bimbel Infinity di Perumahan Pondok Jaya, Bintaro Sektor 3A, Tangerang Selatan.",
    milestones: [
      {
        date: "Januari 2018",
        title: "Pembukaan Cabang Mitra di Sukabumi",
        desc: "Menyepakati kerja sama pembukaan cabang baru dengan mitra bisnis di Sukabumi."
      },
      {
        date: "Februari 2018",
        title: "Penggunaan Gedung Baru di Jl. Porselin E6/11 Pondok Jaya",
        desc: "Penggunaan gedung baru untuk proses belajar mengajar di Jl. Porselin E6/11, Perum Pondok Jaya, Tangerang Selatan."
      },
      {
        date: "Juli 2018",
        title: "Pembukaan Cabang Mitra di Surabaya",
        desc: "Menyepakati kerja sama pembukaan cabang baru dengan mitra bisnis di Surabaya."
      },
      {
        date: "Agustus 2018",
        title: "Perpindahan Kantor Utama ke Jl. Porselin E6/11 Bintaro",
        desc: "Perpindahan kantor utama dari Jl. Pisok I Blok EA 15 No. 1 ke Jl. Porselin E6/11, Perum Pondok Jaya, Tangerang Selatan. Seluruh ruangan di bangunan lainnya dimanfaatkan penuh untuk ruang kelas."
      }
    ]
  }
};

/* ----------------------------------------------------------------------------
 * 3. DATA JARINGAN 14 KOTA CABANG INFINITY ACADEMY
 * ---------------------------------------------------------------------------- */
const BRANCHES_DATA = [
  { city: "Bintaro, Tangerang Selatan", region: "jawa", meta: "KANTOR UTAMA & GEDUNG KELAS", detail: "Jl. Porselin E6/11 Pondok Jaya • Jl. Pisok I EA 15/1 (Depan STAN) • Jl. Sejahtera PJMI", isHQ: true },
  { city: "Bandung", region: "jawa", meta: "CABANG PERIODIK • FEB 2015", detail: "Layanan pendidikan periodik wilayah Jawa Barat", isHQ: false },
  { city: "Sukabumi", region: "jawa", meta: "CABANG MITRA • JAN 2018", detail: "Kerja sama mitra bisnis wilayah Jawa Barat", isHQ: false },
  { city: "Purwokerto", region: "jawa", meta: "CABANG PERIODIK • AGU 2017", detail: "Layanan pendidikan periodik wilayah Jawa Tengah", isHQ: false },
  { city: "Yogyakarta", region: "jawa", meta: "CABANG PERIODIK • FEB 2016", detail: "Layanan pendidikan periodik wilayah DI Yogyakarta", isHQ: false },
  { city: "Surabaya", region: "jawa", meta: "CABANG PERIODIK & MITRA • JUL 2018", detail: "Layanan pendidikan periodik & mitra Jawa Timur", isHQ: false },
  { city: "Jember", region: "jawa", meta: "CABANG PERIODIK • AGU 2017", detail: "Layanan pendidikan periodik wilayah Jawa Timur", isHQ: false },
  { city: "Medan", region: "sumatera", meta: "CABANG PERIODIK • FEB 2014", detail: "Cabang periodik pertama di luar Pulau Jawa", isHQ: false },
  { city: "Palembang", region: "sumatera", meta: "CABANG PERIODIK • FEB 2015", detail: "Layanan pendidikan periodik Sumatera Selatan", isHQ: false },
  { city: "Pekanbaru", region: "sumatera", meta: "CABANG MITRA • OKT 2016", detail: "Kerja sama mitra bisnis wilayah Riau", isHQ: false },
  { city: "Balikpapan", region: "kalsul", meta: "CABANG MITRA • OKT 2016", detail: "Kerja sama mitra bisnis Kalimantan Timur", isHQ: false },
  { city: "Banjarmasin", region: "kalsul", meta: "CABANG MITRA • OKT 2016", detail: "Kerja sama mitra bisnis Kalimantan Selatan", isHQ: false },
  { city: "Makassar", region: "kalsul", meta: "CABANG MITRA • OKT 2016", detail: "Kerja sama mitra bisnis Sulawesi Selatan", isHQ: false },
  { city: "Lombok", region: "balinusra", meta: "CABANG PERIODIK • DES 2015", detail: "Layanan pendidikan periodik wilayah NTB", isHQ: false }
];

/* ---------- WhatsApp ---------- */
const DEFAULT_WA_MSG = "Halo admin Infinity, saya mau tanya program persiapan PKN STAN.";
function waLink(msg) {
  return WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}` : `tel:${PHONE}`;
}
const PHONE_ICON = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M8.6 3.5H5.4a1.9 1.9 0 0 0-1.9 2.1 16.6 16.6 0 0 0 14.9 14.9 1.9 1.9 0 0 0 2.1-1.9v-3.2l-3.9-1.6-2 2a12.6 12.6 0 0 1-5.4-5.4l2-2Z"/></svg>';
function wireWaLinks(root = document) {
  root.querySelectorAll(".js-wa").forEach((a) => {
    a.href = waLink(a.dataset.msg || DEFAULT_WA_MSG);
    if (WA_NUMBER) { a.target = "_blank"; a.rel = "noopener"; return; }
    // Belum ada nomor WhatsApp: tombol menelepon, jadi label dan ikonnya juga bilang telepon.
    const icon = a.querySelector("svg.i");
    if (icon) icon.outerHTML = PHONE_ICON;
    a.childNodes.forEach((n) => {
      if (n.nodeType === 3) n.textContent = n.textContent.replace(/Chat admin|WhatsApp admin/, "Telepon admin");
    });
  });
}

/* ---------- Perjalanan: tahun terlama di atas, tiap tahun bisa dibuka ---------- */
function renderChangelog() {
  const el = document.getElementById("changelog-list");
  if (!el) return;
  el.innerHTML = Object.keys(PROGRAM_SCRUBBER_DATA)
    .sort((a, b) => a - b)
    .map((year, i) => {
      const d = PROGRAM_SCRUBBER_DATA[year];
      const items = d.milestones
        .map((m) => `<li><time>${m.date}</time><div><strong>${m.title}</strong>${m.desc}</div></li>`)
        .join("");
      return `<li class="cl-year"><b>${year}</b><details${i === 0 ? " open" : ""}><summary><h3>${d.heading}</h3><span class="cl-count">${d.milestones.length} catatan</span></summary><ol>${items}</ol></details></li>`;
    })
    .join("");
}

/* ---------- Cabang ---------- */
const MONTHS = { JAN: "Jan", FEB: "Feb", MAR: "Mar", APR: "Apr", MEI: "Mei", JUN: "Jun", JUL: "Jul", AGU: "Agu", SEP: "Sep", OKT: "Okt", NOV: "Nov", DES: "Des" };
function branchLabel(meta) {
  // "CABANG PERIODIK • FEB 2015" -> "Cabang periodik · Feb 2015"
  const [kind, when = ""] = meta.split("•").map((s) => s.trim());
  const k = kind.charAt(0) + kind.slice(1).toLowerCase();
  const w = when.replace(/[A-Z]{3}/g, (m) => MONTHS[m] || m);
  return w ? `${k} · ${w}` : k;
}
function renderBranches(region = "all") {
  const el = document.getElementById("hairline-branches-grid");
  if (!el) return;
  const list = region === "all" ? BRANCHES_DATA : BRANCHES_DATA.filter((b) => b.region === region);
  el.innerHTML = list
    .map((b) => b.isHQ
      ? `<li class="branch hq"><b>Bintaro</b><span>Kantor utama dan gedung kelas</span></li>`
      : `<li class="branch"><b>${b.city}</b><span>${branchLabel(b.meta)}</span></li>`)
    .join("");
}

/* ---------- Modals (native <dialog>) ---------- */
let lastTrigger = null;
function openDialog(id) {
  const d = document.getElementById(id);
  if (!d) return;
  lastTrigger = document.activeElement;
  if (!d.open) d.showModal();
}
function closeDialog(d) { if (d && d.open) d.close(); }

function openVideoModal(key) {
  const v = CLOUDINARY_CONFIG.videos[key];
  if (!v) return;
  document.getElementById("modal-video-title").textContent = v.title;
  document.getElementById("modal-video-subtitle").textContent = v.subtitle;
  const player = document.getElementById("modal-video-element");
  player.poster = v.poster;
  player.src = getVideoSource(key);
  openDialog("video-modal");
  player.play().catch(() => {});
}

function openMediaProofModal(src, title) {
  document.getElementById("media-proof-title").textContent = "Kliping " + title;
  const img = document.getElementById("media-proof-img");
  img.src = src;
  img.alt = "Kliping liputan " + title;
  openDialog("media-proof-modal");
}

function openConsultModal(program) {
  const select = document.getElementById("form-program");
  if (program && select) select.value = program;
  openDialog("consult-modal");
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  wireWaLinks();

  /* Hero video: loop 20 detik dari Cloudinary (crop potret, tanpa suara, ±1,9 MB, dari file asli 76 MB).
     Mode hemat data atau kurangi gerakan: cukup poster. */
  const heroVideo = document.getElementById("hero-bg-video");
  const saveData = navigator.connection && navigator.connection.saveData;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (heroVideo && heroVideo.dataset.src && !saveData && !reduceMotion) {
    heroVideo.src = heroVideo.dataset.src;
    heroVideo.play().catch(() => {});
    /* Video yang berulang perlu tombol jeda */
    const pause = document.getElementById("hero-pause");
    if (pause) {
      const sync = () => {
        pause.classList.toggle("is-paused", heroVideo.paused);
        pause.setAttribute("aria-label", heroVideo.paused ? "Putar video kelas" : "Jeda video kelas");
      };
      heroVideo.addEventListener("playing", () => { pause.hidden = false; sync(); });
      heroVideo.addEventListener("pause", sync);
      pause.addEventListener("click", () => (heroVideo.paused ? heroVideo.play() : heroVideo.pause()));
    }
  }

  /* Menu HP */
  const menuBtn = document.getElementById("menu-toggle");
  const nav = document.getElementById("site-nav");
  const setMenu = (open) => { nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", String(open)); };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); }
  });

  /* Header: lipat baris menu saat menggulir ke bawah, buka lagi saat menggulir ke atas
     (hover dan fokus keyboard juga membukanya, lewat CSS). */
  const hdr = document.getElementById("hdr");
  if (hdr) {
    let lastY = window.scrollY, ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      if (y < 120) hdr.classList.remove("is-compact");
      else if (y > lastY + 6) hdr.classList.add("is-compact");
      else if (y < lastY - 6) hdr.classList.remove("is-compact");
      if (Math.abs(y - lastY) > 6 || y < 120) lastY = y;
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    onScroll();
  }

  /* Tandai menu sesuai bagian yang sedang dibaca */
  const navLinks = [...nav.querySelectorAll("a[href^='#']")];
  if ("IntersectionObserver" in window) {
    const byId = new Map(navLinks.map((a) => [a.getAttribute("href").slice(1), a]));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        navLinks.forEach((a) => a.removeAttribute("aria-current"));
        byId.get(en.target.id)?.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
  }

  /* Bar bawah HP disembunyikan saat hero, ajakan penutup, atau footer terlihat */
  const dock = document.getElementById("mobile-dock");
  if (dock && "IntersectionObserver" in window) {
    const shown = new Set();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => (en.isIntersecting ? shown.add(en.target) : shown.delete(en.target)));
      dock.classList.toggle("hide", shown.size > 0);
    });
    document.querySelectorAll(".hero, .t-hero, .closing, .site-footer").forEach((el) => io.observe(el));
  }

  /* Tombol-tombol pemicu */
  document.querySelectorAll("[data-open-consult]").forEach((b) =>
    b.addEventListener("click", () => openConsultModal(b.dataset.openConsult)));
  document.querySelectorAll("[data-media-img]").forEach((b) =>
    b.addEventListener("click", () => openMediaProofModal(b.dataset.mediaImg, b.dataset.mediaTitle)));
  document.querySelectorAll(".hero [data-video-key]").forEach((b) =>
    b.addEventListener("click", () => openVideoModal(b.dataset.videoKey)));

  /* Dialog: tombol tutup, klik di luar, bersihkan video, kembalikan fokus */
  document.querySelectorAll("dialog.modal").forEach((d) => {
    d.querySelectorAll("[data-close]").forEach((b) => b.addEventListener("click", () => closeDialog(d)));
    d.addEventListener("click", (e) => { if (e.target === d) closeDialog(d); });
    d.addEventListener("close", () => {
      const v = d.querySelector("video");
      if (v) { v.pause(); v.removeAttribute("src"); v.load(); }
      if (lastTrigger && document.contains(lastTrigger)) lastTrigger.focus();
    });
  });

  /* Perjalanan */
  renderChangelog();

  /* Cabang: filter wilayah */
  renderBranches("all");
  document.querySelectorAll("[data-branch-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("[data-branch-filter]").forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      renderBranches(btn.dataset.branchFilter);
    });
  });

  /* Testimoni UGC: ketuk untuk menonton dengan suara. Video berputar tanpa suara hanya saat terlihat;
     file baru diunduh saat pertama kali terlihat. Mode hemat data atau kurangi gerakan: cukup poster. */
  const rail = document.getElementById("testimoni-rail");
  if (rail) {
    rail.querySelectorAll(".rail-tile[data-video-key]").forEach((tile) =>
      tile.addEventListener("click", () => openVideoModal(tile.dataset.videoKey)));
    const ugc = [...rail.querySelectorAll("video[data-src]")];
    if (ugc.length && !reduceMotion && !saveData && "IntersectionObserver" in window) {
      const vio = new IntersectionObserver((entries) => entries.forEach((en) => {
        const v = en.target;
        if (en.isIntersecting) {
          if (!v.getAttribute("src")) v.src = v.dataset.src;
          v.play().catch(() => {});
        } else if (!v.paused) v.pause();
      }), { threshold: 0.5 });
      ugc.forEach((v) => vio.observe(v));
    }
    /* Berhenti berjalan saat video dibuka */
    const vm = document.getElementById("video-modal");
    if (vm) {
      new MutationObserver(() => rail.classList.toggle("is-paused", vm.open)).observe(vm, { attributes: true, attributeFilter: ["open"] });
    }
  }

  /* Formulir: kirim lewat WhatsApp (atau email selama nomor belum diisi) */
  const form = document.getElementById("infinity-consult-form");
  const emailLink = document.getElementById("form-email-link");
  const buildMessage = () => {
    const f = new FormData(form);
    return [
      "Halo admin Infinity, saya mau daftar / konsultasi persiapan PKN STAN.",
      "",
      `Nama: ${f.get("nama") || "-"}`,
      `Sebagai: ${f.get("peran")}`,
      `Asal kota: ${f.get("kota") || "-"}`,
      `Program: ${f.get("program")}`,
      `Pertanyaan: ${f.get("pesan") || "-"}`
    ].join("\n");
  };
  const mailHref = () => `mailto:${EMAIL}?subject=${encodeURIComponent("Pendaftaran / konsultasi Bimbel Infinity")}&body=${encodeURIComponent(buildMessage())}`;
  form.addEventListener("input", () => { emailLink.href = mailHref(); });
  emailLink.href = mailHref();
  if (!WA_NUMBER) {
    // Selama nomor WhatsApp belum diisi, jangan menjanjikan WhatsApp.
    form.querySelector("button[type='submit']").textContent = "Kirim lewat email";
    document.querySelector("#consult-modal .modal-head p").textContent = "Isi singkat, lalu kirim. Admin akan membalas di jam kerja.";
    form.querySelector(".form-alt").innerHTML = 'Atau telepon langsung <a href="tel:02122733744">021-22733744</a>';
  }
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = buildMessage();
    if (WA_NUMBER) window.open(waLink(msg), "_blank", "noopener");
    else window.location.href = mailHref();
  });
});
