// Serves the Etsy Keyword Generator (index.html).
// No extra packages needed: this uses only what comes built into Node.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

// Looks for index.html next to this file, or inside a "public" folder.
const candidates = [
  path.join(__dirname, 'index.html'),
  path.join(__dirname, 'public', 'index.html'),
];
const pagePath = candidates.find((p) => fs.existsSync(p));

if (!pagePath) {
  console.error('Could not find index.html. Put it in the same folder as server.js (or in a "public" folder).');
  process.exit(1);
}

const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    return res.end('ok');
  }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405, { 'Content-Type': 'text/plain' });
    return res.end('Method not allowed');
  }
  fs.readFile(pagePath, (err, html) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('Something went wrong loading the page.');
    }
    res.writeHead(200, {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-cache',
    });
    res.end(req.method === 'HEAD' ? undefined : html);
  });
});

server.listen(PORT, () => {
  console.log(`Etsy Keyword Generator running on port ${PORT}`);
});
