import { api } from './api.js';
// Pet inventory: big emoji, tap one to see its info. Data comes from /api/pets (filled after the bot update).
export async function initPets() {
  const v = document.querySelector('#v-pets');
  v.innerHTML = '<h2>Pets</h2><div class="pets" id="pgrid"></div><div id="petinfo" hidden></div>';
  const list = await api('pets').catch(() => []);
  const grid = v.querySelector('#pgrid'), info = v.querySelector('#petinfo');
  if (!list.length) { grid.outerHTML = '<p>No pets yet. They show up here after the bot update.</p>'; return; }
  list.forEach(p => {
    const b = document.createElement('button'); b.className = 'pet'; b.textContent = p.emoji;
    b.onclick = () => { info.hidden = false; info.textContent = ''; const h = document.createElement('h3'); h.textContent = `${p.emoji} ${p.name} · Lv ${p.level}`;
      const a = document.createElement('p'); a.textContent = `Earns ${p.income} per hour`; const c = document.createElement('p'); c.textContent = p.info || ''; info.append(h, a, c); };
    grid.append(b);
  });
}
