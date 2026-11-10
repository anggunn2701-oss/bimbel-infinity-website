/* Bimbel Infinity: static server for local preview and production (Railway).
   No dependencies. PORT comes from the environment (Railway sets it); defaults to 3000 locally. */
const http = require("http");
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const CANONICAL_HOST = "bimbelinfinity.com";        // primary address, no www
const ALIAS_HOST = "www.bimbelinfinity.com";        // redirected to the primary

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm"
};
const COMPRESSIBLE = new Set([".html", ".css", ".js", ".mjs", ".json", ".xml", ".txt", ".svg"]);

/* Never served: tooling, drafts, backups, raw videos, docs and server files. */
const BLOCKED_DIRS = ["_backup-original", "tools", "content", "concept", "mcp", "docs", "Untuk Website Infinity", "node_modules"];
const BLOCKED_FILES = new Set(["server.js", "package.json", "package-lock.json", "railway.json", "nixpacks.toml"]);
function isBlocked(rel) {
  const parts = rel.split("/").filter(Boolean);
  if (parts.some((p) => p.startsWith("."))) return true;            // .git, .impeccable, .taste-skill, .env ...
  if (parts.length && BLOCKED_DIRS.includes(parts[0])) return true;
  if (parts.length === 1 && (BLOCKED_FILES.has(parts[0]) || parts[0].endsWith(".md"))) return true;
  return false;
}

function cacheControl(ext) {
  if ([".html", ".xml", ".txt"].includes(ext)) return "no-cache";                  // always revalidate pages
  if ([".css", ".js", ".mjs", ".json"].includes(ext)) return "public, max-age=3600";  // not fingerprinted
  return "public, max-age=604800";                                                    // images, fonts, video
}

function baseHeaders(req) {
  const h = {
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=(), interest-cohort=()"
  };
  if (req.headers["x-forwarded-proto"] === "https") h["Strict-Transport-Security"] = "max-age=31536000";
  return h;
}

function send(req, res, status, body, type = "text/plain; charset=utf-8", extra = {}) {
  res.writeHead(status, { ...baseHeaders(req), "Content-Type": type, "Cache-Control": "no-cache", ...extra });
  res.end(req.method === "HEAD" ? undefined : body);
}

function notFound(req, res) {
  const page = path.join(ROOT, "404.html");
  fs.readFile(page, (err, html) => {
    if (err) return send(req, res, 404, "404 Not Found");
    send(req, res, 404, html, MIME_TYPES[".html"]);
  });
}

function serveFile(req, res, filePath, stats) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME_TYPES[ext] || "application/octet-stream";
  const etag = `W/"${stats.size.toString(16)}-${Math.floor(stats.mtimeMs).toString(16)}"`;
  const headers = { ...baseHeaders(req), "Content-Type": type, "Cache-Control": cacheControl(ext), ETag: etag, "Last-Modified": stats.mtime.toUTCString() };

  if (req.headers["if-none-match"] === etag) { res.writeHead(304, headers); return res.end(); }

  // Byte ranges (video seeking)
  const range = req.headers.range;
  if (range && !COMPRESSIBLE.has(ext)) {
    const m = /^bytes=(\d*)-(\d*)$/.exec(range);
    let start = m && m[1] !== "" ? parseInt(m[1], 10) : NaN;
    let end = m && m[2] !== "" ? parseInt(m[2], 10) : stats.size - 1;
    if (m && m[1] === "" && m[2] !== "") { start = Math.max(0, stats.size - parseInt(m[2], 10)); end = stats.size - 1; }
    if (!m || isNaN(start) || start > end || start >= stats.size) {
      res.writeHead(416, { ...headers, "Content-Range": `bytes */${stats.size}` });
      return res.end();
    }
    end = Math.min(end, stats.size - 1);
    res.writeHead(206, { ...headers, "Accept-Ranges": "bytes", "Content-Range": `bytes ${start}-${end}/${stats.size}`, "Content-Length": end - start + 1 });
    if (req.method === "HEAD") return res.end();
    return fs.createReadStream(filePath, { start, end }).pipe(res);
  }

  // Compression for text
  const accept = req.headers["accept-encoding"] || "";
  if (COMPRESSIBLE.has(ext) && stats.size > 1024 && /\b(br|gzip)\b/.test(accept)) {
    const br = /\bbr\b/.test(accept);
    res.writeHead(200, { ...headers, "Content-Encoding": br ? "br" : "gzip", Vary: "Accept-Encoding" });
    if (req.method === "HEAD") return res.end();
    const z = br ? zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }) : zlib.createGzip({ level: 6 });
    return fs.createReadStream(filePath).pipe(z).pipe(res);
  }

  res.writeHead(200, { ...headers, "Content-Length": stats.size, "Accept-Ranges": "bytes", Vary: "Accept-Encoding" });
  if (req.method === "HEAD") return res.end();
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") return send(req, res, 405, "Method Not Allowed", undefined, { Allow: "GET, HEAD" });

  // Health check for Railway
  if (req.url === "/healthz") return send(req, res, 200, "ok");

  // One canonical address: www -> bimbelinfinity.com, http -> https (custom domain only)
  const host = (req.headers.host || "").toLowerCase().split(":")[0];
  const proto = req.headers["x-forwarded-proto"];
  if (host === ALIAS_HOST || (host === CANONICAL_HOST && proto === "http")) {
    res.writeHead(301, { Location: `https://${CANONICAL_HOST}${req.url}` });
    return res.end();
  }

  let urlPath;
  try { urlPath = decodeURIComponent(req.url.split("?")[0]); } catch { return send(req, res, 400, "Bad Request"); }
  if (urlPath.includes("\0")) return send(req, res, 400, "Bad Request");
  if (urlPath === "/index.html") { res.writeHead(301, { Location: "/" }); return res.end(); }
  if (isBlocked(urlPath)) return notFound(req, res);

  const filePath = path.join(ROOT, urlPath.endsWith("/") ? urlPath + "index.html" : urlPath);
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) return send(req, res, 403, "Forbidden");

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) return serveFile(req, res, filePath, stats);
    // /blog -> /blog/
    if (!err && stats.isDirectory()) { res.writeHead(301, { Location: urlPath + "/" }); return res.end(); }
    // /testimoni -> testimoni.html
    if (!path.extname(filePath)) {
      return fs.stat(filePath + ".html", (e2, s2) => (!e2 && s2.isFile() ? serveFile(req, res, filePath + ".html", s2) : notFound(req, res)));
    }
    notFound(req, res);
  });
});

server.listen(PORT, () => {
  console.log(`Bimbel Infinity berjalan di port ${PORT}`);
});
