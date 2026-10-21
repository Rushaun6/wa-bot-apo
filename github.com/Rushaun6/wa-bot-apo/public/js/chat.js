import { api, tok } from './api.js';
const $ = s => document.querySelector(s);
let es;
export function initChat(S) {
  const box = $('#msgs');
  const draw = m => {
    const d = document.createElement('div'); d.className = 'msg' + (m.from.number === S.me.number ? ' mine' : '') + (m.bot ? ' bot' : '');
    const a = document.createElement('span'); a.className = 'av'; a.textContent = m.from.avatar;
    const b = document.createElement('div'); b.className = 'bub';
    const n = document.createElement('b'); n.textContent = m.from.name;
    const t = document.createElement('p'); t.textContent = m.text;
    b.append(n, t); d.append(a, b); box.append(d); box.scrollTop = box.scrollHeight;
  };
  box.innerHTML = ''; S.messages.forEach(draw);
  es?.close(); es = new EventSource('/api/stream?token=' + tok());
  es.onmessage = e => { const d = JSON.parse(e.data); if (d.type === 'msg') draw(d.m); if (d.type === 'refresh') S.onRefresh(); };
  $('#sendf').onsubmit = async e => {
    e.preventDefault(); const i = $('#txt'), v = i.value; i.value = '';
    try { await api('send', { text: v }); } catch (x) { alert(x); }
  };
}
