/* Renders the data-driven parts of index.html and app.js from content/*.json.
   Used by tools/build-site.js. Markup matches styles.css; edit both together. */
const CLD = 'https://res.cloudinary.com/jnye0bk5/video/upload';
const FX = 'e_contrast:25/e_saturation:8/e_brightness:5';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const WA_ICON = '<svg class="i" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.2 2.2 2.2 0 0 0 .1-1.3c0-.1-.2-.2-.4-.3Z"/></svg>';
const SOUND_OFF = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4z" fill="currentColor"/><path d="m16 9.5 5 5m0-5-5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';

/* hero.title / highlight / lead may hold inline HTML on purpose (e.g. <strong>); they are written as-is */
const hero = (h) => `<h1 class="hero-h1">${h.title} <span class="hl">${h.highlight}</span></h1>
          <p class="hero-lead">${h.lead}</p>`;

/* FAQ answers may hold inline HTML such as <span class="ph">…</span> placeholders */
const faq = (items) => '\n' + items.map(({ q, a }) => `          <details><summary>${esc(q)}</summary><p>${a}</p></details>`).join('\n') + '\n';

const programs = (list) => '\n' + list.map((p) => `          <article class="prog">
            <div class="prog-name"><h3>${esc(p.name)}</h3><p>${p.for}</p></div>
            <dl class="prog-facts">
              <div><dt>Tempat</dt><dd>${p.place}</dd></div>
              <div><dt>Format</dt><dd>${p.format}</dd></div>
              <div><dt>Ciri khas</dt><dd>${p.feature}</dd></div>
            </dl>
            <a class="btn btn-ghost js-wa" href="tel:02122733744" data-msg="${esc(p.message)}">Tanya biaya</a>
          </article>`).join('\n') + '\n';

const crop = (x) => `c_crop,w_389,h_518,x_${x},y_14/w_540`;
const tile = (v, clone) => `          <button type="button" class="rail-tile ugc" data-video-key="${v.key}"${clone ? ' tabindex="-1" aria-hidden="true"' : ` aria-label="Tonton testimoni ${esc(v.name)} dengan suara"`}>
            <video muted loop playsinline preload="none" aria-hidden="true" poster="${CLD}/so_3/${crop(v.faceX)}/${FX}/e_sharpen:80/q_auto/${v.cloudinaryId}.jpg" data-src="${CLD}/so_2,du_16/${crop(v.faceX)}/${FX}/e_sharpen:80/ac_none,q_auto,vc_auto/${v.cloudinaryId}.mp4"></video>
            <span class="ugc-sound">${SOUND_OFF}<span>Tonton dengan suara</span></span>
            <span class="rail-caption">
              <span class="r-person">${esc(v.name)}</span>
              <span class="r-quote">${esc(v.caption)}</span>
            </span>
          </button>`;
/* the set is printed twice so the marquee loops without an end */
const testiTiles = (vids) => '\n' + vids.map((v) => tile(v, false)).join('\n') + '\n' + vids.map((v) => tile(v, true)).join('\n') + '\n';

const testiData = (vids) => `/* TESTI:START */
/* dibuat dari content/testimonial-videos.json oleh tools/build-site.js */
const TESTI_VIDEOS = ${JSON.stringify(vids.map(({ key, name, cloudinaryId }) => ({ key, name, id: cloudinaryId })), null, 2)};
/* TESTI:END */`;

function between(html, name, inner, style = 'html') {
  const [open, close] = style === 'js' ? [`/* ${name}:START */`, `/* ${name}:END */`] : [`<!-- ${name}:START -->`, `<!-- ${name}:END -->`];
  const a = html.indexOf(open), b = html.indexOf(close);
  if (a < 0 || b < 0) throw new Error(`markers ${name} missing`);
  return style === 'js' ? html.slice(0, a) + inner + html.slice(b + close.length) : html.slice(0, a + open.length) + inner + html.slice(b);
}

module.exports = { hero, faq, programs, testiTiles, testiData, between, CLD, WA_ICON };
