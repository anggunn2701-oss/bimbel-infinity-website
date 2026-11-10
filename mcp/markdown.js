/* Small Markdown -> HTML converter for blog bodies written through the MCP.
   Supports: ## / ### headings, paragraphs, - and 1. lists, > quotes (a last line starting with "— " becomes <cite>),
   pipe tables, **bold**, *italic*, [text](url). Raw HTML in the source is escaped. */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const inline = (s) => esc(s)
  .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, '$1<em>$2</em>')
  .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => /^(https?:|mailto:|tel:|\.{0,2}\/|#)/.test(u) ? `<a href="${u}">${t}</a>` : t);

function markdownToHtml(md) {
  const lines = md.replace(/\r\n/g, '\n').split('\n');
  const out = [];
  let i = 0;
  const isTableRow = (l) => /^\s*\|.*\|\s*$/.test(l);
  while (i < lines.length) {
    const l = lines[i];
    if (!l.trim()) { i++; continue; }
    let m;
    if ((m = l.match(/^(#{2,3})\s+(.+)$/))) { out.push(`<h${m[1].length}>${inline(m[2].trim())}</h${m[1].length}>`); i++; continue; }
    if (/^\s*[-*]\s+/.test(l)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*[-*]\s+/, ''));
      out.push(`<ul>\n${items.map((t) => `  <li>${inline(t)}</li>`).join('\n')}\n</ul>`); continue;
    }
    if (/^\s*\d+[.)]\s+/.test(l)) {
      const items = [];
      while (i < lines.length && /^\s*\d+[.)]\s+/.test(lines[i])) items.push(lines[i++].replace(/^\s*\d+[.)]\s+/, ''));
      out.push(`<ol>\n${items.map((t) => `  <li>${inline(t)}</li>`).join('\n')}\n</ol>`); continue;
    }
    if (/^>\s?/.test(l)) {
      const q = [];
      while (i < lines.length && /^>\s?/.test(lines[i])) q.push(lines[i++].replace(/^>\s?/, ''));
      let cite = '';
      if (q.length > 1 && /^(—|--)\s*/.test(q[q.length - 1])) cite = q.pop().replace(/^(—|--)\s*/, '');
      out.push(`<blockquote><p>${inline(q.join(' '))}</p>${cite ? `<cite>${inline(cite)}</cite>` : ''}</blockquote>`); continue;
    }
    if (isTableRow(l) && i + 1 < lines.length && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1])) {
      const cells = (r) => r.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
      const head = cells(l); i += 2;
      const rows = [];
      while (i < lines.length && isTableRow(lines[i])) rows.push(cells(lines[i++]));
      out.push(`<table>\n  <thead><tr>${head.map((c) => `<th>${inline(c)}</th>`).join('')}</tr></thead>\n  <tbody>\n${rows.map((r) => `    <tr>${r.map((c) => `<td>${inline(c)}</td>`).join('')}</tr>`).join('\n')}\n  </tbody>\n</table>`);
      continue;
    }
    const p = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3}\s|>\s?|\s*[-*]\s+|\s*\d+[.)]\s+)/.test(lines[i]) && !isTableRow(lines[i])) p.push(lines[i++].trim());
    out.push(`<p>${inline(p.join(' '))}</p>`);
  }
  return out.join('\n');
}

module.exports = { markdownToHtml };
