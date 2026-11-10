/* One-time refactor: colour names (--green, --orange, --lime ...) -> role tokens (--primary, --accent, --highlight ...),
   colour literals -> tokens, and the :root colour block -> THEME markers filled by tools/build-site.js. Idempotent. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const f = (p) => path.join(root, p);

let css = fs.readFileSync(f('styles.css'), 'utf8');
if (!css.includes('/* THEME:START */')) {
  // 1. :root colour block -> markers (non-colour tokens stay in :root)
  const a = css.indexOf(':root {\n  --green: #0B6B53;');
  const b = css.indexOf('  /* Type (ui-ux-pro-max');
  if (a < 0 || b < 0) throw new Error(':root colour block not found');
  css = css.slice(0, a) + '/* THEME:START */\n/* THEME:END */\n\n:root {\n' + css.slice(b);

  // 2. variable names -> roles (longest first)
  const VARS = [
    ['--green-deep', '--primary-deep'], ['--green-wash', '--primary-wash'], ['--on-green-2', '--on-primary-2'],
    ['--rule-on-green', '--rule-on-primary'], ['--on-green', '--on-primary'], ['--green', '--primary'],
    ['--orange-display', '--accent-display'], ['--orange-text', '--accent-text'], ['--ink-on-orange', '--on-accent'], ['--orange', '--accent'],
    ['--lime-deep', '--highlight-deep'], ['--lime', '--highlight'], ['--cream', '--curve-a'],
  ];
  for (const [from, to] of VARS) css = css.split(`var(${from})`).join(`var(${to})`);

  // 3. rgba literals of brand colours -> color-mix on tokens
  const RGBA = {
    '15, 42, 34': 'ink', '11, 107, 83': 'primary', '8, 82, 63': 'primary-deep',
    '8, 40, 31': 'shade', '6, 36, 28': 'shade', '6, 30, 24': 'shade',
    '255, 90, 0': 'accent', '255, 253, 248': 'paper', '252, 247, 235': 'on-primary',
    '231, 255, 79': 'highlight', '210, 236, 42': 'highlight-deep',
  };
  css = css.replace(/rgba\((\d+), (\d+), (\d+), (0?\.?\d+)\)/g, (m, r, g, bl, al) => {
    const tok = RGBA[`${r}, ${g}, ${bl}`];
    if (!tok) return m;
    const pct = Math.round(parseFloat(al) * 1000) / 10;
    return pct === 0 ? `color-mix(in srgb, var(--${tok}) 0%, transparent)` : `color-mix(in srgb, var(--${tok}) ${pct}%, transparent)`;
  });

  // 4. remaining literals with a role
  css = css.replace('  color: #9A3600;\n  font-style: italic;', '  color: var(--ph-text);\n  font-style: italic;');
  css = css.replace('.closing .display { color: var(--white); }', '.closing .display { color: var(--on-accent-display); }');
  css = css.replace(/   Dua warna utama: Deep Green #0B6B53 \+ Vivid Orange #FF5A00\.\n   Satu aksen UI: Lime #E7FF4F \(tidak pernah dipakai di pola lengkung\)\.\n/,
    '   Warna diatur per tema (content/themes/*.json), ditulis ke blok THEME oleh tools/build-site.js.\n');
  fs.writeFileSync(f('styles.css'), css);
}

// 5. SVG curve fills in markup and templates
const CURVE = (s) => s
  .replace(/fill="var\(--cream\)"/g, 'fill="var(--curve-a)"')
  .replace(/fill="var\(--orange\)"/g, 'fill="var(--curve-b)"')
  .replace(/fill="var\(--green\)"/g, 'fill="var(--curve-c)"');
for (const file of ['index.html', 'tools/build-testimoni.js', 'tools/build-site.js']) {
  const s = fs.readFileSync(f(file), 'utf8');
  const t = CURVE(s);
  if (t !== s) fs.writeFileSync(f(file), t);
}
console.log('refactored');
