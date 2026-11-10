/* Data situs bersama untuk SEO, schema.org, sitemap, dan llms.txt.
   PENTING: ganti SITE kalau domain resminya berbeda, lalu jalankan ulang: node tools/build-site.js */
const SITE = 'https://bimbelinfinity.com';
const CONTACT = require('./contact');
const C = CONTACT.load();   // content/contact.json

/* fakta lembaga: content/organization.json (diedit lewat MCP update_organization) */
const O = JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'content', 'organization.json'), 'utf8'));
const ORG = {
  ...O,
  telephone: CONTACT.intl(C.phone),
  email: C.email,
  instagram: C.social && C.social.instagram ? `https://www.instagram.com/${C.social.instagram}/` : '',
  social: CONTACT.links(C),   // [{ platform, label, handle, url }] dari content/contact.json
  address: Object.fromEntries(Object.entries(O.address).filter(([, v]) => v)),
};

const OG_IMAGE = `${SITE}/assets/og/og-default.jpg`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const orgNode = () => {
  const node = {
    '@type': ['EducationalOrganization', 'LocalBusiness'],
    '@id': `${SITE}/#organization`,
    name: ORG.name,
    legalName: ORG.legalName,
    alternateName: ORG.alternateName,
    description: ORG.description,
    url: `${SITE}/`,
    logo: { '@type': 'ImageObject', url: `${SITE}/assets/brand/logo-symbol.png` },
    image: OG_IMAGE,
    foundingDate: ORG.foundingDate,
    founder: { '@type': 'Person', name: ORG.founder },
    telephone: ORG.telephone,
    email: ORG.email,
    address: { '@type': 'PostalAddress', ...ORG.address },
    areaServed: (ORG.areaServed || []).map((n) => (n === 'Indonesia' ? { '@type': 'Country', name: n } : { '@type': 'City', name: n })),
    knowsAbout: ORG.knowsAbout,
    sameAs: ORG.social.map((s) => s.url),
  };
  // only facts that were actually supplied
  if (ORG.geo && ORG.geo.latitude != null && ORG.geo.longitude != null) node.geo = { '@type': 'GeoCoordinates', latitude: ORG.geo.latitude, longitude: ORG.geo.longitude };
  if (ORG.googleMapsUrl) node.hasMap = ORG.googleMapsUrl;
  if (ORG.openingHours && ORG.openingHours.length) node.openingHoursSpecification = ORG.openingHours.map((h) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: h.days, opens: h.opens, closes: h.closes }));
  return node;
};
const websiteNode = () => ({
  '@type': 'WebSite', '@id': `${SITE}/#website`, url: `${SITE}/`, name: ORG.name, inLanguage: 'id-ID',
  publisher: { '@id': `${SITE}/#organization` },
});
const breadcrumb = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: url })),
});
const faqNode = (pairs, url) => ({
  '@type': 'FAQPage', '@id': `${url}#faq`,
  mainEntity: pairs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});

/* <head> block between <!-- SEO:START --> and <!-- SEO:END --> */
function seoHead({ title, description, url, type = 'website', image = OG_IMAGE, published, graph }) {
  const ld = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2).replace(/</g, '\\u003c');
  return `<!-- SEO:START (dibuat oleh tools/build-site.js, jangan edit manual) -->
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
  <meta property="og:type" content="${type}" />
  <meta property="og:locale" content="id_ID" />
  <meta property="og:site_name" content="${ORG.name}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(description)}" />
  <meta name="twitter:image" content="${image}" />${published ? `
  <meta property="article:published_time" content="${published}" />` : ''}
  <link rel="alternate" type="text/plain" title="llms.txt" href="${SITE}/llms.txt" />
  <script type="application/ld+json">
${ld}
  </script>
  <!-- SEO:END -->`;
}
function replaceSeo(html, block) {
  const a = html.indexOf('<!-- SEO:START'), b = html.indexOf('<!-- SEO:END -->');
  if (a < 0 || b < 0) throw new Error('SEO markers missing');
  return html.slice(0, a) + block + html.slice(b + '<!-- SEO:END -->'.length);
}

module.exports = { SITE, ORG, OG_IMAGE, esc, orgNode, websiteNode, breadcrumb, faqNode, seoHead, replaceSeo };
