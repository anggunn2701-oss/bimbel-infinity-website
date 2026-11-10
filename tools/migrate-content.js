/* One-time migration: pull editable content out of index.html / app.js / blog-posts.js into JSON files
   under content/, and put render markers in index.html and app.js. Safe to run twice (skips what exists). */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const f = (p) => path.join(root, p);
let idx = fs.readFileSync(f('index.html'), 'utf8');
let app = fs.readFileSync(f('app.js'), 'utf8');

// ---- blog posts -> JSON
if (!fs.existsSync(f('content/blog-posts.json'))) {
  const posts = require(f('content/blog-posts.js'));
  fs.writeFileSync(f('content/blog-posts.json'), JSON.stringify(posts.map((p) => ({ ...p, body: p.body.trim() })), null, 2) + '\n');
}

// ---- homepage: hero, programs, FAQ
if (!fs.existsSync(f('content/home.json'))) {
  const h1 = idx.match(/<h1 class="hero-h1">([\s\S]*?)<span class="hl">([\s\S]*?)<\/span><\/h1>/);
  const lead = idx.match(/<p class="hero-lead">([\s\S]*?)<\/p>/);
  const faqBlock = idx.slice(idx.indexOf('<div class="faq-list">'), idx.indexOf('</div>', idx.indexOf('<div class="faq-list">')));
  const faq = [...faqBlock.matchAll(/<details><summary>([\s\S]*?)<\/summary><p>([\s\S]*?)<\/p><\/details>/g)].map((m) => ({ q: m[1], a: m[2] }));
  const progBlock = idx.slice(idx.indexOf('<div class="prog-table">'), idx.indexOf('<p class="program-note">'));
  const programs = [...progBlock.matchAll(/<article class="prog">([\s\S]*?)<\/article>/g)].map((m) => {
    const b = m[1];
    const facts = Object.fromEntries([...b.matchAll(/<dt>([^<]+)<\/dt><dd>([\s\S]*?)<\/dd>/g)].map((x) => [x[1], x[2]]));
    return {
      name: b.match(/<h3>([\s\S]*?)<\/h3>/)[1],
      for: b.match(/<div class="prog-name"><h3>[\s\S]*?<\/h3><p>([\s\S]*?)<\/p>/)[1],
      place: facts.Tempat, format: facts.Format, feature: facts['Ciri khas'],
      message: b.match(/data-msg="([^"]*)"/)[1],
    };
  });
  fs.writeFileSync(f('content/home.json'), JSON.stringify({
    hero: { title: h1[1].trim(), highlight: h1[2].trim(), lead: lead[1].trim() }, programs, faq,
  }, null, 2) + '\n');
}

// ---- testimonial videos
if (!fs.existsSync(f('content/testimonial-videos.json'))) {
  const tiles = [...idx.matchAll(/<button type="button" class="rail-tile ugc" data-video-key="(\w+)" aria-label[^>]*>[\s\S]*?c_crop,w_389,h_518,x_(\d+),y_14[\s\S]*?\/(v\d+\/[^"]+?)\.mp4"[\s\S]*?<span class="r-person">([^<]+)<\/span>\s*<span class="r-quote">([^<]+)<\/span>/g)]
    .map((m) => ({ key: m[1], name: m[4], caption: m[5], cloudinaryId: m[3], faceX: Number(m[2]) }));
  fs.writeFileSync(f('content/testimonial-videos.json'), JSON.stringify(tiles, null, 2) + '\n');
}

// ---- markers
const mark = (html, openTag, name, closeFinder) => {
  if (html.includes(`<!-- ${name}:START -->`)) return html;
  const a = html.indexOf(openTag); if (a < 0) throw new Error('missing ' + openTag);
  const inner = a + openTag.length;
  const b = closeFinder(html, inner);
  return html.slice(0, inner) + `\n<!-- ${name}:START -->` + html.slice(inner, b) + `<!-- ${name}:END -->\n` + html.slice(b);
};
idx = mark(idx, '<div class="faq-list">', 'FAQ', (h, i) => h.indexOf('        </div>', i));
idx = mark(idx, '<div class="prog-table">', 'PROGRAMS', (h, i) => h.indexOf('        </div>\n        <p class="program-note">', i));
idx = mark(idx, '<div class="ugc-track">', 'TESTI_TILES', (h, i) => h.indexOf('        </div>\n      </div>\n    </section>', i));
if (!idx.includes('<!-- HERO:START -->')) {
  idx = idx.replace(/(<h1 class="hero-h1">[\s\S]*?<\/h1>\s*<p class="hero-lead">[\s\S]*?<\/p>)/, '<!-- HERO:START -->$1<!-- HERO:END -->');
}
if (!app.includes('/* TESTI:START */')) {
  app = app.replace(/const TESTI_VIDEOS = \[[\s\S]*?\n\];/, (m) => `/* TESTI:START */\n${m}\n/* TESTI:END */`);
}
fs.writeFileSync(f('index.html'), idx);
fs.writeFileSync(f('app.js'), app);
console.log('migrated');
