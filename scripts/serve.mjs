// Dependency-free local preview of the lab and archived app, only on loopback.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const legacyRoot = fileURLToPath(new URL('../legacy/', import.meta.url));
const port = Number(process.argv[2] || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.ico': 'image/x-icon', '.jpg': 'image/jpeg' };
const server = createServer(async (req, res) => {
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const archived = pathname === '/legacy' || pathname.startsWith('/legacy/');
    const targetRoot = archived ? legacyRoot : root;
    const targetPath = archived ? pathname.replace(/^\/legacy\/?/, '/') : pathname;
    let file = path.resolve(targetRoot, `.${targetPath}`);
    const relative = path.relative(targetRoot, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Página não encontrada.'); }
});
server.listen(port, '127.0.0.1', () => console.log(`Lab: http://127.0.0.1:${port}/lab/ | Legado: http://127.0.0.1:${port}/legacy/`));
server.on('error', error => { console.error(error.message); process.exitCode = 1; });
