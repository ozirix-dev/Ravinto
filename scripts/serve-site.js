const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..', '_site');
const basePath = '/Ravinto';
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
};

http.createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  if (pathname !== basePath && !pathname.startsWith(`${basePath}/`)) {
    response.writeHead(404).end('Not found');
    return;
  }

  const relativePath = pathname.slice(basePath.length).replace(/^\/+/, '');
  let filePath = path.resolve(root, relativePath || 'index.html');
  if (!filePath.startsWith(`${root}${path.sep}`) && filePath !== path.join(root, 'index.html')) {
    response.writeHead(403).end('Forbidden');
    return;
  }
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  fs.readFile(filePath, (error, contents) => {
    if (error) {
      response.writeHead(404).end('Not found');
      return;
    }
    response.writeHead(200, { 'Content-Type': contentTypes[path.extname(filePath)] || 'application/octet-stream' });
    response.end(contents);
  });
}).listen(4173, '127.0.0.1');
