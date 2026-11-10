#!/usr/bin/env node
/* MCP server "Infinity Konten", stdio transport (Claude Code via .mcp.json, Claude Desktop).
   For bots that connect over the internet (Grok and others): repo anggunn2701-oss/infinity-konten-mcp. */
const { handleMessage } = require('./core');

const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n');
let buf = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => {
  buf += chunk;
  let nl;
  while ((nl = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, nl).trim();
    buf = buf.slice(nl + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { send({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }); continue; }
    const res = handleMessage(msg);
    if (res) send(res);
  }
});
process.stdin.on('end', () => process.exit(0));
