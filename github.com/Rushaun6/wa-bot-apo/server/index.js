import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { login, who } from './auth.js';
import { clients } from './bus.js';
import { state, send, setGroup, member, profile } from './chat.js';
import { pets } from './pets.js';
const PUB = path.join(path.dirname(fileURLToPath(import.meta.url)), '../public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };
const body = req => new Promise(r => { let d = ''; req.on('data', c => d += c); req.on('end', () => { try { r(JSON.parse(d || '{}')); } catch { r({}); } }); });
const out = (res, code, o) => { res.writeHead(code, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(o)); };
http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (url.pathname.startsWith('/api/')) {
    const route = url.pathname.slice(5);
    try {
      if (route === 'login') { const b = await body(req); return out(res, 200, login(b.number, b.pin)); }
      const u = who(req.headers.authorization || url.searchParams.get('token'));
      if (!u) return out(res, 401, { error: 'Log in again' });
      if (route === 'stream') {
        res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
        res.write(': ok\n\n'); clients.add(res); req.on('close', () => clients.delete(res)); return;
      }
      if (route === 'state') return out(res, 200, state(u));
      if (route === 'pets') return out(res, 200, await pets(u));
      const b = await body(req);
      if (route === 'send') await send(u, b.text);
      else if (route === 'profile') profile(u, b);
      else if (route === 'group') setGroup(u, b);
      else if (route === 'member') member(u, b);
      else return out(res, 404, { error: 'Not found' });
      return out(res, 200, { ok: true });
    } catch (e) { return out(res, 400, { error: typeof e === 'string' ? e : 'Something went wrong' }); }
  }
  const f = path.join(PUB, url.pathname === '/' ? 'index.html' : path.normalize(url.pathname).replace(/^(\.\.[/\\])+/, ''));
  if (!f.startsWith(PUB) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end('Not found'); }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
}).listen(process.env.PORT || 3000);
