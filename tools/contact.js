/* Contact details and social accounts: one source (content/contact.json) for every CTA, footer link and
   social row, form, schema.org, llms.txt and app.js. tools/build-site.js runs apply() on every generated
   page and text file and renders the footer social row from renderSocial(). Empty accounts are not shown. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const FILE = path.join(root, 'content/contact.json');

const load = () => JSON.parse(fs.readFileSync(FILE, 'utf8'));

/* social platforms: stored as handles (LinkedIn as "company/<slug>" or "in/<slug>") */
const SOCIAL = {
  instagram: { label: 'Instagram', re: /^[A-Za-z0-9_.]{1,30}$/, url: (h) => `https://www.instagram.com/${h}/`, show: (h) => `@${h}`,
    from: /instagram\.com\/([A-Za-z0-9_.]+)/ },
  x: { label: 'X', re: /^[A-Za-z0-9_]{1,15}$/, url: (h) => `https://x.com/${h}`, show: (h) => `@${h}`, from: /(?:x|twitter)\.com\/([A-Za-z0-9_]+)/ },
  linkedin: { label: 'LinkedIn', re: /^(company|in|school)\/[A-Za-z0-9-_%]{2,100}$/, url: (h) => `https://www.linkedin.com/${h}/`, show: (h) => h.split('/')[1],
    from: /linkedin\.com\/((?:company|in|school)\/[A-Za-z0-9-_%]+)/ },
  tiktok: { label: 'TikTok', re: /^[A-Za-z0-9_.]{2,24}$/, url: (h) => `https://www.tiktok.com/@${h}`, show: (h) => `@${h}`, from: /tiktok\.com\/@([A-Za-z0-9_.]+)/ },
  youtube: { label: 'YouTube', re: /^[A-Za-z0-9_.-]{3,30}$/, url: (h) => `https://www.youtube.com/@${h}`, show: (h) => `@${h}`, from: /youtube\.com\/@([A-Za-z0-9_.-]+)/ },
  facebook: { label: 'Facebook', re: /^[A-Za-z0-9.]{5,50}$/, url: (h) => `https://www.facebook.com/${h}`, show: (h) => h, from: /facebook\.com\/([A-Za-z0-9.]+)/ },
  threads: { label: 'Threads', re: /^[A-Za-z0-9_.]{1,30}$/, url: (h) => `https://www.threads.net/@${h}`, show: (h) => `@${h}`, from: /threads\.(?:net|com)\/@([A-Za-z0-9_.]+)/ },
};
const ICON = { instagram: 'instagram-logo', x: 'x-logo', linkedin: 'linkedin-logo', tiktok: 'tiktok-logo', youtube: 'youtube-logo', facebook: 'facebook-logo', threads: 'threads-logo' };

/* accepts a handle, "@handle" or a pasted profile URL; returns the stored form ("" clears) */
function normalizeSocial(platform, input) {
  const p = SOCIAL[platform];
  if (!p) throw new Error(`Platform "${platform}" tidak dikenal. Pilihan: ${Object.keys(SOCIAL).join(', ')}.`);
  let v = String(input || '').trim();
  if (!v) return '';
  const m = v.match(p.from);
  if (m) v = m[1];
  v = v.replace(/^@/, '').replace(/\/+$/, '');
  if (platform === 'linkedin' && !v.includes('/')) v = `company/${v}`;
  return v;
}

const links = (c) => Object.entries(c.social || {}).filter(([k, v]) => v && SOCIAL[k])
  .map(([k, v]) => ({ platform: k, label: SOCIAL[k].label, handle: SOCIAL[k].show(v), url: SOCIAL[k].url(v) }));

/* "02122733744" -> "021-22733744"; mobile "081234567890" -> "0812-3456-7890" */
function displayPhone(p) {
  if (/^0(21|22|24|31|61)\d+$/.test(p)) return `${p.slice(0, 3)}-${p.slice(3)}`;
  if (/^08\d{8,11}$/.test(p)) return p.replace(/^(\d{4})(\d{4})(\d+)$/, '$1-$2-$3');
  return p.replace(/^(\d{3,4})(\d+)$/, '$1-$2');
}
const intl = (p) => `+62-${p.replace(/^0/, '').replace(/^(\d{2})(\d+)$/, '$1-$2')}`;

function validate(c) {
  const errors = [];
  if (c.whatsapp && !/^62\d{8,13}$/.test(c.whatsapp)) errors.push('whatsapp harus format internasional tanpa + atau spasi, mis. 6281234567890 (atau kosong).');
  if (!/^0\d{8,12}$/.test(c.phone)) errors.push('phone harus angka saja diawali 0, mis. 02122733744.');
  if (!/^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/.test(c.email)) errors.push('email tidak valid.');
  if (!c.waGreeting || c.waGreeting.length > 300) errors.push('waGreeting wajib, maksimal 300 karakter.');
  for (const [k, v] of Object.entries(c.social || {})) {
    if (!SOCIAL[k]) errors.push(`platform sosmed "${k}" tidak dikenal.`);
    else if (v && !SOCIAL[k].re.test(v)) errors.push(`${SOCIAL[k].label}: "${v}" bukan nama akun yang valid.`);
  }
  return errors;
}

/* replace every contact occurrence in generated HTML / text */
function apply(text, c = load()) {
  const ig = c.social && c.social.instagram;
  let out = text
    .replace(/href="tel:[^"]*"/g, `href="tel:${c.phone}"`)
    .replace(/\b0(?:21|22|24|31|61|8\d{2})-\d{4,9}(?:-\d{3,5})?\b/g, displayPhone(c.phone))
    .replace(/"telephone": "[^"]*"/g, `"telephone": "${intl(c.phone)}"`)
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g, (m) => (/noreply|example\.com|users\./.test(m) ? m : c.email));
  if (ig) {
    out = out.replace(/instagram\.com\/[A-Za-z0-9_.]+\/?/g, `instagram.com/${ig}/`)
      .replace(/(Instagram )@[A-Za-z0-9_](?:[A-Za-z0-9_.]*[A-Za-z0-9_])?/g, `$1@${ig}`);   // keep a sentence-ending dot
  }
  return out;
}

/* footer social row (between SOCIAL markers in index.html) */
function renderSocial(c = load()) {
  const list = links(c);
  if (!list.length) return '';
  const icon = (k) => fs.readFileSync(path.join(root, 'assets/icons/social', `${ICON[k]}.svg`), 'utf8').trim()
    .replace('<svg ', '<svg class="social-ico" aria-hidden="true" focusable="false" ');
  return `
          <ul class="footer-social" aria-label="Media sosial Bimbel Infinity">
${list.map((s) => `            <li><a href="${s.url}" target="_blank" rel="noopener" aria-label="${s.label} ${s.handle}" title="${s.label} ${s.handle}">${icon(s.platform)}</a></li>`).join('\n')}
          </ul>
          `;
}

const appJsBlock = (c) => `/* CONTACT:START */
/* dibuat dari content/contact.json oleh tools/build-site.js; ubah lewat MCP (update_contact), bukan di sini.
   Selama WA_NUMBER kosong, tombol "Chat admin" otomatis menjadi "Telepon admin". */
const WA_NUMBER = ${JSON.stringify(c.whatsapp || '')};
const PHONE = ${JSON.stringify(c.phone)};
const EMAIL = ${JSON.stringify(c.email)};
const DEFAULT_WA_MSG = ${JSON.stringify(c.waGreeting)};
/* CONTACT:END */`;

module.exports = { load, validate, apply, appJsBlock, displayPhone, intl, FILE, SOCIAL, normalizeSocial, links, renderSocial };
