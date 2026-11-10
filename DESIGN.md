# Design — Bimbel Infinity (v3, product-launch style)

Source of truth for colour: the brand board (`assets/brand/brand-board.webp`). Tokens live in `styles.css` `:root`. The previous brand restyle is kept in `_backup-original/*.v2-brand.*`.

## Colour: two main colours, one accent

| Token | Value | Role |
|---|---|---|
| `--green` | #0B6B53 | Main colour 1: primary buttons, the 90% tile, featured plan, testimoni band, accents in type |
| `--orange` | #FF5A00 | Main colour 2: garansi tile, closing card, the S-curve, wordmark |
| `--lime` | #E7FF4F | **Accent only** for UI: buttons and tags on green, progress bar, play icons, selection, focus on green. **Never inside the S-curve pattern.** |
| `--paper` / `--soft` / `--white` | #FFFDF8 / #F6F1E4 / #FFFFFF | Page ground, alternate section ground, tiles and cards |
| `--ink` / `--ink-2` / `--ink-3` | #0F2A22 / #3D554C / #5F726B | Text, green-tinted |
| `--orange-display` / `--orange-text` | #E14E00 / #B83F00 | Orange used as type on light grounds (large / small) |

The S-curve pattern uses only green, orange and cream.

## Type

Two families, the ui-ux-pro-max pairing "Corporate Trust" (accessible, readable, professional), chosen by the client over Schibsted Grotesk:

- **Lexend** for headings, figures, buttons and wordmarks. Designed by Bonnie Shaver-Troup with Thomas Jockin and others to reduce visual stress and improve reading performance; variable wght 100–900 (loaded 400–800).
- **Source Sans 3** for body text. Paul D. Hunt for Adobe; variable wght 200–900 (loaded 400–700).

| Role | Token | Family | Size at 1440 | Weight | Leading / tracking |
|---|---|---|---|---|---|
| Hero h1 | `--fs-display` | Lexend | 60px | 700 | 1.0 / -0.035em |
| Section head | `--fs-h2` | Lexend | 52px | 700 | 1.04 / -0.028em |
| Card and item title | `--fs-h3` | Lexend | 20px | 700 | 1.3 |
| Buttons | | Lexend | 15px | 600 | -0.01em |
| Body | `--fs-body` | Source Sans 3 | 18px | 400 | 1.6 |
| Meta, captions | `--fs-small` | Source Sans 3 | 16px | 400–600 | 1.5 |

Figures (90%, 100%, 14) are Lexend 800 with tabular numerals. The footer wordmark is Lexend 700, sized from the content width (BIMBELINFINITY measures 8.78em). Body text is never tracked tighter than the default; headings use `text-wrap: balance`, paragraphs `pretty`. No eyebrow labels above headings.

## Layout & components

- **Floating two-row header** (`.hdr`): white card fixed 14px from the top, max 940px, a 1.5px lime outline with a soft lime halo, 22px radius. Row 1: symbol, centred wordmark with lime dot and "Persiapan PKN STAN", green pill Daftar. Hairline. Row 2: six equal nav cells, the active one underlined in lime. Scrolling down folds row 2 and narrows the card to 700px; scrolling up, hover or focus opens it. Under 720px row 2 sits behind a "Menu" chevron.
- **Hero** (taste-skill `split`): text on six columns (h1, lead, "Telepon admin" plus "Video testimoni siswa" which jumps to the UGC rail, then a hairline and the alumni-faces link to testimoni.html); on the right a 4:5 portrait video (MVI_4058 from Cloudinary, cropped on the speaker, 20 s muted loop, ±1.9 MB instead of 76 MB) with a pause button, the S-curve in its corner and the "Gedung kelas Jl. Pisok I" card. Data saver or reduced motion: poster only.
- **Proof band** (`.proof`, moment `word-highlight`): one sentence with the verifiable 2018 numbers (147.702 applicants, 7.301 seats, 38 Infinity graduates), then a strip of all 38 graduate faces (`assets/alumni/thumb/`, face-centred 160px crops) linking to testimoni.html, and the sources in small type. Replaces the old statement + four-stat strip.
- **How we teach** (`.how`, #keunggulan): founder story and current management on the left (sticky), plain definition rows on the right (who teaches, SKD explained, try outs, guarantee, results). No cards or icon tiles; unverified figures (90%, guarantee terms) stay small with their placeholders.
- **Testimoni** (`.testi`, UGC): light ground, compact left-aligned head, then an endless slow marquee (70s, paused on hover/focus or while the video modal is open) of seven portrait talking-head videos. Each tile is a muted 16-second Cloudinary loop (crop to 3:4 on the face, contrast/brightness/sharpen graded, no audio, ~1MB) that loads and plays only while on screen; a tap opens the full graded 1280px version with sound (2–9MB instead of 23–73MB). Reduced motion or data saver: posters only, plain scroller.
- **Karier** (`.career-strip`): the eight agency logos in one hairline strip with abbreviation and full name; 4 columns with abbreviations only on phones. Never called partners; the non-affiliation note stays.
- **Program** (`.prog-table`): one comparison table, three rows with the same columns (Tempat, Format, Ciri khas) and one quiet "Tanya biaya" per row. No featured tier, no prices.
- **FAQ** (`#faq`): seven parent questions in hairline `details` rows; open facts stay as placeholders.
- **Press**: a green Republika feature card linking to the article, then three cards with the real clipping screenshots, outlet, date and rubric; the branch list with region chips follows.
- **Campus** (`.campus-band`): the storefront photo full-bleed, four address columns under it. The vision/mission block was removed.
- **Changelog** (`.changelog`): sticky heading left; years oldest first, each a collapsible `details` (2013 open).
- **Contact buttons**: while `WA_NUMBER` is empty, app.js relabels every `.js-wa` "Chat admin" to "Telepon admin" and swaps the WhatsApp icon for a phone icon.

Page order: hero, proof, how we teach, testimoni, karier, program, FAQ, campus, press and branches, changelog, closing.
- **Closing**: orange rounded card with the S-curve; **footer** with a giant wordmark sized to the content width.
- Elevation: hairline borders at rest; one soft shadow on hover and on floating elements.

## Motion

**Page intro** (`.intro`, head script in index.html and testimoni.html): on a cream screen the logo scales in with a green loading line, then a curtain with the brand S-curve edge (cream, orange, green) sweeps up (0.9s; 0.7s on phones). Shown at least 0.6s (0.45s on phones), at most 1.2s (0.9s), with a 2.5s fail-safe; arriving from another page of the site skips the logo. Page animations wait behind it (`animation-play-state: paused`). No JS = no overlay; reduced motion = a 0.3s fade only.

Hero then enters in order (headline, lead, buttons, alumni row; 0.1s apart), the video opens as a circle from the S-curve corner, the class-location card arrives last. Hover: tiles and cards lift 2px, photos zoom 1.03, buttons lift 1px. Everything rests under reduced motion.

## Assets

- `assets/brand/logo-symbol.png`: cut from the brand board. **Replace with the original vector logo when available.**
- All photos are the client's own; the sample photo on the brand board is not used.

## Testimoni page (`testimoni.html`)

Built from the four "Siswa Infinity Lulus 2018" documents (Depok 6, Jember 13, Lombok 16, Sukabumi 3). Photos live in `assets/alumni/` as 4:5-cropped JPEGs with per-photo `object-position` inline. Sections: split hero with a six-photo mosaic and three facts; one featured quote on green; a masonry of nine quote excerpts (verbatim, "…" marks cuts, spelling untouched); the full wall with branch chips, a lime "Beasiswa" tag and "Baca testimoni" opening the full text in a dialog (`testimoni.js`). The same text submitted by three Jember students is shown once (Amanda). Styles sit at the end of `styles.css`.

## Blog and search (SEO, AEO, GEO, LLM)

- **Build**: `node tools/build-site.js` regenerates the SEO `<head>` (between `<!-- SEO:START -->` and `<!-- SEO:END -->`) on every page, `testimoni.html`, the blog, the homepage blog teaser, `sitemap.xml`, `robots.txt`, `llms.txt` and `llms-full.txt`. Content lives in JSON (`content/blog-posts.json`, `content/home.json` for hero/programs/FAQ, `content/testimonial-videos.json`, `content/alumni-2018.json`) and is edited through the MCP server in `mcp/` (see MCP.md); the domain and organisation facts in `tools/site.config.js` (`SITE`, confirm before launch).
- **Blog** (`blog/index.html`, `blog/<slug>.html`): editorial rows (no cards); a post has breadcrumbs, h1, byline with date and reading time, a green "Jawaban singkat" box (the answer first, for answer engines), prose at 760px, an FAQ, a consult CTA and "Baca juga".
- **Schema.org** (JSON-LD `@graph`): `EducationalOrganization`+`LocalBusiness` (address, founder, founding date, sameAs Instagram), `WebSite`, `WebPage`, three `Course` programs and a `FAQPage` on the homepage (FAQ answers that still hold placeholders are left out); `CollectionPage` on testimoni; `Blog` + `BlogPosting` + `BreadcrumbList` + `FAQPage` on the blog.
- **Share image**: `assets/og/og-default.jpg` (1200×630), rendered from `tools/og-image.html`.
- **Crawlers**: robots.txt allows all search engines and AI assistants (GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended and others) and keeps backups, tools, raw videos and drafts out.

## Themes

Two complete colour themes; the MCP can only switch between them (`list_themes`, `set_theme`), never edit single colours.

| Role token | `hijau` (brand 2026, default) | `biru` (Brand Colour Guideline) |
|---|---|---|
| `--primary` / `-deep` / `-wash` | #0B6B53 / #08523F / #E4EFEA | #0A43FF / #0634CC / #E7EEFF |
| `--accent` (CTA, closing card) | #FF5A00 | #FF7A00 |
| `--accent-display` / `--accent-text` (orange as type) | #E14E00 / #B83F00 | #E06200 / #B84A00 |
| `--on-accent` / `--on-accent-display` | #1E0C02 / #FFFFFF | #0F172A / #0F172A (white on #FF7A00 is only 2.6:1) |
| `--highlight` / `-deep` | lime #E7FF4F / #D2EC2A | yellow #FFE200 / #F2C900 |
| `--curve-a` / `-b` / `-c` (S-curve bands) | cream / orange / green | cyan / orange / blue |
| `--paper` / `--soft` / `--line` / `--line-2` | #FFFDF8 / #F6F1E4 / #E8E2D3 / #D6CCB6 | #F8FAFC / #F1F4F9 / #E2E8F0 / #CBD5E1 |
| `--ink` / `-2` / `-3` | #0F2A22 / #3D554C / #5F726B | #0F172A / #475569 / #5B6B80 |

- Source: `content/themes/<name>.json`; active theme: `content/theme.json`. `tools/build-site.js` writes the THEME block at the top of `styles.css`, copies the theme's logo (`assets/brand/themes/<name>/logo-symbol.png` → `assets/brand/logo-symbol.png`) and share image (`assets/og/themes/<name>.jpg` → `assets/og/og-default.jpg`), sets `theme-color`, and versions `styles.css`, logo and share image (`?v=`) so a switch shows at once.
- The build refuses a theme when any text/background pair the design uses fails WCAG AA (`tools/themes.js`, 19 pairs).
- CSS uses role tokens only (`--primary`, `--accent`, `--highlight`, `--curve-*`, `--shade` for dark overlays, `--ph-text`); alphas are `color-mix()` on those tokens. No brand hex values outside the THEME block.
- The blue logo was cut from the guideline image (`assets/brand/themes/biru/brand-guideline.webp`); replace it with the original file when available. Share images are rendered from `tools/og-image.html?t=<name>`.

## Contact

One source, `content/contact.json` (WhatsApp, phone, email, WhatsApp greeting, and `social`: Instagram, X, LinkedIn, TikTok, YouTube, Facebook, Threads), edited through the MCP (`get_contact`, `update_contact`). The build writes the `CONTACT` block in `app.js` and rewrites every `tel:` link, displayed phone number, email, Instagram link/handle and the schema.org `telephone` in all generated pages and text files (`tools/contact.js`). With `whatsapp` empty every `.js-wa` button reads "Telepon admin" and dials; with a number it reads "Chat admin" and opens `wa.me` with that button's own message.

- **Footer social row** (`.footer-social`, between SOCIAL markers): one 44px round icon link per filled account (Phosphor brand icons in `assets/icons/social/`), hover fills with `--primary`; empty accounts are not rendered. The same accounts feed schema.org `sameAs` and llms.txt.

## SEO tooling

- Page titles and descriptions: `content/seo.json` (`pages.home|testimoni|blog`, `postTitleSuffix`); articles may carry a shorter `seoTitle` (the H1 keeps `title`). The suffix is added only when the result stays ≤ 65 characters.
- Organisation facts for schema.org: `content/organization.json`; `geo`, `openingHoursSpecification` and `hasMap` are emitted only when filled.
- `tools/seo-audit.js` (MCP `seo_audit`): titles, descriptions, duplicates, H1, alt, image sizes, canonical, JSON-LD, article FAQ/summary/words/internal links, sitemap and llms coverage, robots, local-SEO data. Score 0–100.
- IndexNow: key in `content/seo.json`, key file `<key>.txt` written at the root by the build; `tools/indexnow.js` (MCP `ping_index`) submits sitemap URLs after a deploy.
