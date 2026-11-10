/* Contact details: one source (content/contact.json) for every CTA, footer link, form, schema.org,
   llms.txt and app.js. tools/build-site.js runs apply() on every generated page and text file. */
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const FILE = path.join(root, 'content/contact.json');

const load = () => JSON.parse(fs.readFileSync(FILE, 'utf8'));

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
  if (!/^[A-Za-z0-9_.]{1,30}$/.test(c.instagram)) errors.push('instagram = nama akun tanpa @, mis. bimbelinfinity.');
  if (!c.waGreeting || c.waGreeting.length > 300) errors.push('waGreeting wajib, maksimal 300 karakter.');
  return errors;
}

/* replace every contact occurrence in generated HTML / text */
function apply(text, c = load()) {
  return text
    .replace(/href="tel:[^"]*"/g, `href="tel:${c.phone}"`)
    .replace(/\b0(?:21|22|24|31|61|8\d{2})-\d{4,9}(?:-\d{3,5})?\b/g, displayPhone(c.phone))
    .replace(/"telephone": "[^"]*"/g, `"telephone": "${intl(c.phone)}"`)
    .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+/g, (m) => (/noreply|example\.com|users\./.test(m) ? m : c.email))
    .replace(/instagram\.com\/[A-Za-z0-9_.]+\/?/g, `instagram.com/${c.instagram}/`)
    .replace(/(Instagram )@[A-Za-z0-9_](?:[A-Za-z0-9_.]*[A-Za-z0-9_])?/g, `$1@${c.instagram}`);   // keep a sentence-ending dot
}

const appJsBlock = (c) => `/* CONTACT:START */
/* dibuat dari content/contact.json oleh tools/build-site.js; ubah lewat MCP (update_contact), bukan di sini.
   Selama WA_NUMBER kosong, tombol "Chat admin" otomatis menjadi "Telepon admin". */
const WA_NUMBER = ${JSON.stringify(c.whatsapp || '')};
const PHONE = ${JSON.stringify(c.phone)};
const EMAIL = ${JSON.stringify(c.email)};
const DEFAULT_WA_MSG = ${JSON.stringify(c.waGreeting)};
/* CONTACT:END */`;

module.exports = { load, validate, apply, appJsBlock, displayPhone, intl, FILE };
