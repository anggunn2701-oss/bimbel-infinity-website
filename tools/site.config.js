/* Data situs bersama untuk SEO, schema.org, sitemap, dan llms.txt.
   PENTING: ganti SITE kalau domain resminya berbeda, lalu jalankan ulang: node tools/build-site.js */
const SITE = 'https://bimbelinfinity.com';

const ORG = {
  name: 'Bimbel Infinity',
  legalName: 'PT Infinity Global Inspiratif',
  alternateName: ['Infinity', 'Bimbel STAN Infinity'],
  description: 'Bimbel persiapan seleksi PKN STAN di Bintaro, Tangerang Selatan. Didirikan mahasiswa PKN STAN pada 17 April 2013; tentor mahasiswa dan alumni PKN STAN; gedung kelas tepat di depan kampus PKN STAN.',
  foundingDate: '2013-04-17',
  founder: 'Riandi Ahmad',
  telephone: '+62-21-22733744',
  email: 'bimbelinfinityid@gmail.com',
  instagram: 'https://www.instagram.com/bimbelinfinity/',
  address: {
    streetAddress: 'Jl. Porselin No. 11 Blok E6, Perumahan Pondok Jaya, Bintaro Sektor 3A',
    addressLocality: 'Tangerang Selatan',
    addressRegion: 'Banten',
    addressCountry: 'ID',
  },
  classrooms: [
    'Jl. Pisok I Blok EA 15 No. 1, tepat di depan kampus PKN STAN, Tangerang Selatan',
    'Jl. Sejahtera A 15/16 PJMI, Pondok Aren, Tangerang Selatan',
  ],
};

const OG_IMAGE = `${SITE}/assets/og/og-default.jpg`;
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const orgNode = () => ({
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
  areaServed: { '@type': 'Country', name: 'Indonesia' },
  knowsAbout: ['Seleksi PKN STAN', 'SKD (Seleksi Kompetensi Dasar)', 'TWK', 'TIU', 'TKP', 'Sekolah kedinasan'],
  sameAs: [ORG.instagram],
});
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
