/* Themes: content/themes/<name>.json hold every colour role; content/theme.json names the active one.
   tools/build-site.js writes the active theme into styles.css (THEME block), swaps logo, share image and
   theme-color, and refuses to build when a text/background pair fails WCAG AA. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');

const REQUIRED = ['primary', 'primary-deep', 'primary-wash', 'on-primary', 'on-primary-2', 'rule-on-primary', 'accent', 'accent-display',
  'accent-text', 'on-accent', 'on-accent-display', 'highlight', 'highlight-deep', 'curve-a', 'curve-b', 'curve-c', 'paper', 'soft',
  'white', 'ink', 'ink-2', 'ink-3', 'line', 'line-2', 'shade', 'ph-text'];

const list = () => fs.readdirSync(path.join(root, 'content/themes')).filter((x) => x.endsWith('.json')).map((x) => x.replace(/\.json$/, ''));
const load = (name) => {
  const file = path.join(root, 'content/themes', `${name}.json`);
  if (!fs.existsSync(file)) throw new Error(`Tema "${name}" tidak ada. Pilihan: ${list().join(', ')}.`);
  const t = JSON.parse(fs.readFileSync(file, 'utf8'));
  const missing = REQUIRED.filter((k) => !t.colors[k]);
  if (missing.length) throw new Error(`Tema ${name} kurang warna: ${missing.join(', ')}`);
  return t;
};
const active = () => JSON.parse(fs.readFileSync(path.join(root, 'content/theme.json'), 'utf8')).active;

/* ---------- WCAG contrast ---------- */
function rgba(c) {
  let m = /^#([0-9a-f]{6})$/i.exec(c);
  if (m) return [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).concat(1);
  m = /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)$/i.exec(c);
  if (m) return [+m[1], +m[2], +m[3], m[4] === undefined ? 1 : +m[4]];
  throw new Error(`Warna tidak dikenali: ${c}`);
}
const over = (fg, bg) => { const [r, g, b, a] = rgba(fg), [R, G, B] = rgba(bg); return [r * a + R * (1 - a), g * a + G * (1 - a), b * a + B * (1 - a)]; };
const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); })
  .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (fg, bg) => { const a = lum(over(fg, bg)), b = lum(rgba(bg).slice(0, 3)); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };

/* text pairs the design actually uses: [foreground, background, minimum, where] */
const PAIRS = [
  ['ink', 'paper', 4.5, 'teks utama'], ['ink-2', 'paper', 4.5, 'teks kedua'], ['ink-3', 'paper', 4.5, 'teks keterangan'],
  ['ink-2', 'soft', 4.5, 'teks di section lembut'], ['ink-3', 'soft', 4.5, 'keterangan di section lembut'], ['ink', 'white', 4.5, 'teks di kartu'],
  ['primary', 'paper', 4.5, 'link dan label berwarna'], ['primary', 'white', 4.5, 'label di kartu putih'], ['primary', 'primary-wash', 4.5, 'kotak jawaban singkat'],
  ['on-primary', 'primary', 4.5, 'tombol utama dan section berwarna'], ['on-primary-2', 'primary', 4.5, 'paragraf di section berwarna'],
  ['on-primary', 'primary-deep', 4.5, 'tombol utama saat hover'], ['highlight', 'primary', 3, 'aksen di section berwarna'],
  ['ink', 'highlight', 4.5, 'tombol dan tag aksen'], ['on-accent', 'accent', 4.5, 'teks kartu penutup'], ['on-accent-display', 'accent', 3, 'judul besar kartu penutup'],
  ['accent-display', 'paper', 3, 'kata berwarna di judul besar'], ['accent-text', 'paper', 4.5, 'teks kecil berwarna'], ['ph-text', 'paper', 4.5, 'penanda data belum lengkap'],
];
function contrastReport(t) {
  return PAIRS.map(([fg, bg, min, where]) => {
    const r = ratio(t.colors[fg], t.colors[bg]);
    return { pasangan: `${fg} di atas ${bg}`, untuk: where, rasio: Math.round(r * 100) / 100, minimal: min, lolos: r >= min };
  });
}

/* the :root block written between THEME markers */
const rootCss = (t) => `/* THEME:START */
/* Tema aktif: ${t.name} (${t.label}). Dibuat dari content/themes/${t.name}.json oleh tools/build-site.js; jangan edit di sini. */
:root {
${Object.entries(t.colors).map(([k, v]) => `  --${k}: ${v};`).join('\n')}
}
/* THEME:END */`;

module.exports = { list, load, active, contrastReport, rootCss, ratio };
