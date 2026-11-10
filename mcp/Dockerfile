# Remote MCP "Infinity Konten" (Railway service). Build context: repository root.
FROM node:22-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends git ca-certificates \
 && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY mcp/ ./mcp/
ENV NODE_ENV=production
EXPOSE 8787
CMD ["node", "mcp/http.js"]
