/* ==========================================================================
   BIMBEL INFINITY — skrip bersama (semua halaman)
   Yang perlu diisi tim ada di blok PENGATURAN di bawah ini.
   ========================================================================== */

/* ---------- PENGATURAN ---------- */

/* Nomor WhatsApp admin, format 62xxxxxxxxxx tanpa + atau spasi.
   Selama kosong, semua tombol chat jatuh ke telepon kantor. */
const WA_NUMBER = "";
const PHONE = "02122733744";

/* Video testimoni. Isi `url` dengan link MP4 hasil kompres (mis. Cloudinary, ukuran
   ideal di bawah 15 MB). Selama kosong, dipakai file mentah lokal yang sangat besar. */
const VIDEOS = {
  adhiBlora: {
    title: "Adhi, dari Blora",
    url: "",
    local: "../Untuk Website Infinity/Video/Bimbel STAN Terbaik - Bimbel Infinity -Testimoni Siswa Adhi Blora.mp4",
    poster: "img/poster-adhi.jpg"
  },
  alumni2018: {
    title: "Angkatan yang lolos",
    url: "",
    local: "../Untuk Website Infinity/Video/Testimoni Alumni Infinity 2018 (Slide 10 PPT).mp4",
    poster: "img/poster-alumni.jpg"
  },
  sapaanKelas: {
    title: "Suasana kelas",
    url: "",
    local: "../Untuk Website Infinity/MVI_4058.MOV",
    poster: "img/poster-kelas.jpg"
  }
};

/* Soal tryout. Mohon dicek ulang oleh tentor sebelum dipublikasikan. */
const QUESTIONS = [
  { tag: "Deret angka", q: "3, 6, 11, 18, 27, …  Angka berikutnya adalah", opts: ["36", "37", "38", "39", "40"], a: 2,
    why: "Selisihnya naik 2 setiap langkah: +3, +5, +7, +9, lalu <b>+11</b>. Jadi 27 + 11 = <b>38</b>." },
  { tag: "Analogi", q: "PENA : MENULIS = GUNTING : …", opts: ["Kertas", "Memotong", "Tajam", "Menjahit", "Kain"], a: 1,
    why: "Hubungannya <b>alat dan fungsinya</b>. Pena untuk menulis, gunting untuk <b>memotong</b>. Kertas dan kain adalah objeknya, bukan fungsinya." },
  { tag: "Hitungan cepat", q: "15% dari 240 ditambah 25% dari 120 adalah", opts: ["60", "62", "64", "66", "70"], a: 3,
    why: "15% × 240 = 36, dan 25% × 120 = 30. Totalnya <b>66</b>. Trik: 25% sama dengan seperempat, jadi 120 ÷ 4." },
  { tag: "Logika", q: "Semua peserta yang lolos SKD mengikuti tes lanjutan. Rina tidak mengikuti tes lanjutan. Kesimpulannya:", opts: ["Rina lolos SKD", "Rina tidak lolos SKD", "Rina mungkin lolos SKD", "Rina tidak mendaftar", "Tidak dapat disimpulkan"], a: 1,
    why: "Pola <b>modus tollens</b>: jika P maka Q; bukan Q, maka bukan P. Karena Rina tidak ikut tes lanjutan, <b>Rina tidak lolos SKD</b>." },
  { tag: "Perbandingan", q: "Uang Andi dan Budi berbanding 3 : 5. Selisih uang mereka Rp40.000. Jumlah uang keduanya adalah", opts: ["Rp120.000", "Rp140.000", "Rp160.000", "Rp180.000", "Rp200.000"], a: 2,
    why: "Selisih 2 bagian = Rp40.000, jadi 1 bagian = Rp20.000. Jumlahnya 8 bagian = <b>Rp160.000</b>." }
];

/* ---------- WhatsApp ---------- */
const DEFAULT_MSG = "Halo admin Infinity, saya mau tanya program persiapan PKN STAN.";
function waLink(msg) {
  return WA_NUMBER ? `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}` : `tel:${PHONE}`;
}
function wireWa(root = document) {
  root.querySelectorAll(".js-wa").forEach(a => {
    a.href = waLink(a.dataset.msg || DEFAULT_MSG);
    if (WA_NUMBER) { a.target = "_blank"; a.rel = "noopener"; }
  });
}
wireWa();

/* ---------- Mobile menu ---------- */
const menuBtn = document.querySelector(".menu-btn");
const nav = document.getElementById("nav");
if (menuBtn && nav) {
  const setMenu = open => { nav.classList.toggle("open", open); menuBtn.setAttribute("aria-expanded", String(open)); };
  menuBtn.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
  nav.addEventListener("click", e => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) { setMenu(false); menuBtn.focus(); } });
}

/* ---------- Active section in nav ---------- */
const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
if (navLinks.length && "IntersectionObserver" in window) {
  const byId = new Map(navLinks.map(a => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      navLinks.forEach(a => a.removeAttribute("aria-current"));
      byId.get(en.target.id)?.setAttribute("aria-current", "true");
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  byId.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- Hide mobile dock when a closing CTA or the footer is on screen ---------- */
const dock = document.querySelector(".dock");
const dockStops = document.querySelectorAll(".closing, footer");
if (dock && dockStops.length && "IntersectionObserver" in window) {
  const visible = new Set();
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => en.isIntersecting ? visible.add(en.target) : visible.delete(en.target));
    dock.classList.toggle("hide", visible.size > 0);
  });
  dockStops.forEach(el => io.observe(el));
}

/* ---------- Dialog: video & press clippings ---------- */
const dlg = document.getElementById("dlg");
if (dlg) {
  const body = document.getElementById("dlg-body");
  const title = document.getElementById("dlg-title");
  const openDlg = (t, html) => { title.textContent = t; body.innerHTML = html; dlg.showModal(); };
  dlg.addEventListener("close", () => { body.innerHTML = ""; });
  dlg.querySelector(".dlg-close").addEventListener("click", () => dlg.close());
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });

  document.querySelectorAll("[data-video]").forEach(b => b.addEventListener("click", () => {
    const v = VIDEOS[b.dataset.video];
    if (!v) return;
    const src = v.url || encodeURI(v.local);
    openDlg(v.title, `<video controls autoplay playsinline preload="metadata" poster="${v.poster}" src="${src}"></video>`);
  }));
  document.querySelectorAll("[data-img]").forEach(b => b.addEventListener("click", () => {
    const name = b.dataset.name || b.textContent.trim();
    openDlg("Kliping " + name, `<img src="${b.dataset.img}" alt="Kliping liputan ${name}" />`);
  }));
}

/* ---------- Tryout ---------- */
const card = document.getElementById("to-card");
if (card) {
  const prog = document.getElementById("to-progress");
  const L = ["A", "B", "C", "D", "E"];
  let idx = 0, correct = 0;

  const drawProgress = () => {
    prog.innerHTML = QUESTIONS.map((_, i) => `<i class="${i < idx ? "done" : i === idx ? "now" : ""}"></i>`).join("");
  };

  const renderQ = (focus = false) => {
    drawProgress();
    const q = QUESTIONS[idx];
    card.innerHTML = `
      <div class="to-meta"><span>Soal ${idx + 1} dari ${QUESTIONS.length}</span><span>${q.tag}</span></div>
      <p class="to-q" id="to-q" tabindex="-1">${q.q}</p>
      <div class="to-opts" role="group" aria-labelledby="to-q">
        ${q.opts.map((o, i) => `<button type="button" class="opt" data-i="${i}" aria-pressed="false"><i class="bub" aria-hidden="true">${L[i]}</i><span><span class="sr-only">${L[i]}. </span>${o}</span></button>`).join("")}
      </div>
      <div class="to-slot" aria-live="polite"></div>
      <div class="to-foot"></div>`;
    card.querySelectorAll(".opt").forEach(b => b.addEventListener("click", () => answer(+b.dataset.i)));
    if (focus) card.querySelector(".to-q").focus({ preventScroll: true });
  };

  const answer = i => {
    const q = QUESTIONS[idx];
    const btns = card.querySelectorAll(".opt");
    btns.forEach(b => b.disabled = true);
    btns[i].classList.add("pick");
    btns[i].setAttribute("aria-pressed", "true");
    btns[q.a].classList.add("right");
    if (i === q.a) correct++; else btns[i].classList.add("wrong");
    card.querySelector(".to-slot").innerHTML =
      `<div class="to-expl"><b>${i === q.a ? "Tepat." : "Belum tepat. Jawabannya " + L[q.a] + "."}</b> ${q.why}</div>`;
    const last = idx === QUESTIONS.length - 1;
    const foot = card.querySelector(".to-foot");
    foot.innerHTML = `<button type="button" class="btn btn-ink">${last ? "Lihat hasil" : "Soal berikutnya"}</button>`;
    const next = foot.querySelector("button");
    next.focus({ preventScroll: true });
    next.addEventListener("click", () => { idx++; last ? renderResult() : renderQ(true); });
  };

  const renderResult = () => {
    idx = QUESTIONS.length; drawProgress();
    const note = correct === 5 ? "Sempurna untuk lima soal ini. Saatnya uji diri dengan tryout lengkap."
      : correct >= 3 ? "Sudah bagus. Tinggal konsisten dan latih kecepatan dengan tryout lengkap."
      : correct >= 1 ? "Dasarnya mulai ada. Yang perlu dilatih adalah pola soal dan kecepatan."
      : "Masih banyak ruang untuk naik. Justru ini titik awal yang bagus untuk mulai terarah.";
    card.innerHTML = `
      <div class="to-result">
        <div class="to-meta"><span>Hasilmu</span><span>TIU</span></div>
        <div class="score" tabindex="-1">${correct}<small> / ${QUESTIONS.length} benar</small></div>
        <p>${note}</p>
        <div class="cta-row">
          <a class="btn btn-wa js-wa" data-msg="Halo admin Infinity, saya baru coba 5 soal TIU di website dan benar ${correct} dari ${QUESTIONS.length}. Saya mau tanya program yang cocok." href="tel:${PHONE}">Kirim hasil ke admin</a>
          <button type="button" class="btn btn-line" id="to-again">Ulangi</button>
        </div>
      </div>`;
    wireWa(card);
    card.querySelector(".score").focus({ preventScroll: true });
    card.querySelector("#to-again").addEventListener("click", () => { idx = 0; correct = 0; renderQ(true); });
  };

  renderQ();
}
