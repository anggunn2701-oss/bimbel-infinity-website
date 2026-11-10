/* Halaman testimoni: saring lulusan per cabang, buka testimoni lengkap di dialog.
   Memakai openDialog() dari app.js. */
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("alumni-grid");
  const count = document.getElementById("alumni-count");
  const chips = [...document.querySelectorAll("[data-city-filter]")];
  if (!grid) return;
  const cards = [...grid.querySelectorAll(".al")];

  const apply = (city) => {
    let n = 0;
    cards.forEach((c) => {
      const show = city === "all" || c.dataset.city === city;
      c.hidden = !show;
      if (show) n++;
    });
    chips.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.cityFilter === city)));
    count.textContent = city === "all" ? "" : `Menampilkan ${n} lulusan dari Infinity ${city}.`;
  };
  chips.forEach((b) => b.addEventListener("click", () => apply(b.dataset.cityFilter)));

  const modalImg = document.getElementById("alumni-modal-img");
  document.querySelectorAll("[data-alumni]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const slug = btn.dataset.alumni;
      const tpl = document.getElementById("q-" + slug);
      const card = grid.querySelector(`[data-alumni="${slug}"]`)?.closest(".al");
      if (!tpl || !card) return;
      const photo = card.querySelector(".al-photo img");
      modalImg.src = photo.getAttribute("src");
      modalImg.style.objectPosition = photo.style.objectPosition;
      document.getElementById("alumni-modal-name").textContent = card.querySelector(".al-name").textContent;
      document.getElementById("alumni-modal-meta").textContent =
        card.querySelector(".al-major").textContent + " · " + card.querySelector(".al-meta").textContent;
      document.getElementById("alumni-modal-quote").textContent = "“" + tpl.content.textContent.trim() + "”";
      openDialog("alumni-modal");
    });
  });
});
