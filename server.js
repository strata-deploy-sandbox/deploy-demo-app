"use strict";
// Minimal zero-dependency web app — the deploy target for the Strata Deploy track.
// Cloud Run contract: honour the injected PORT, bind 0.0.0.0, handle SIGTERM.
const http = require("node:http");

const PORT = Number(process.env.PORT) || 8080;
const STARTED = new Date().toISOString();
// K_REVISION is injected by Cloud Run; absent locally.
const REVISION = process.env.K_REVISION || "local";

function page() {
  return [
    '<!doctype html>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    '<title>deploy-demo-app</title>',
    '<style>',
    '  :root { color-scheme: light dark; }',
    '  body { font: 16px/1.6 ui-sans-serif, system-ui, sans-serif; max-width: 34rem;',
    '         margin: 12vh auto; padding: 0 1.5rem; }',
    '  h1 { font-size: 1.5rem; margin-bottom: .25rem; }',
    '  dt { font-weight: 600; margin-top: .75rem; }',
    '  dd { margin: 0; font-family: ui-monospace, monospace; opacity: .8; }',
    '  code { font-family: ui-monospace, monospace; }',
    '</style>',
    '<h1>deploy-demo-app</h1>',
    '<p>Deploy-target fixture for the Strata Deploy track. If you are reading this',
    '   over HTTPS at a custom domain, M5 worked.</p>',
    '<dl>',
    '  <dt>revision</dt><dd>' + REVISION + '</dd>',
    '  <dt>started</dt><dd>' + STARTED + '</dd>',
    '  <dt>port</dt><dd>' + PORT + '</dd>',
    '</dl>',
    '<p>Health probe: <code>/healthz</code></p>',
  ].join("\n");
}

const server = http.createServer((req, res) => {
  const path = (req.url || "/").split("?")[0];

  if (path === "/healthz") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({
      status: "ok",
      revision: REVISION,
      uptimeSeconds: Math.round(process.uptime()),
      started: STARTED,
    }));
    return;
  }

  if (path === "/") {
    res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
    res.end(page());
    return;
  }

  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("not found\n");
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("deploy-demo-app listening on 0.0.0.0:" + PORT);
});

// Cloud Run sends SIGTERM before it stops an instance; exit cleanly so in-flight
// requests finish instead of being cut off.
process.on("SIGTERM", () => {
  console.log("SIGTERM received - closing server");
  server.close(() => process.exit(0));
});
