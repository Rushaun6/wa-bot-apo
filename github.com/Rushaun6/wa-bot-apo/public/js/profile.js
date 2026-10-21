import { api, clearToken } from './api.js';
import { PRESETS, SWATCHES, FONTS, BUBBLES, WALLS, applyTheme } from './theme.js';
export function initProfile(S, reload) {
  const v = document.querySelector('#v-me'), m = S.me, t = { ...(m.theme || {}) };
  let banner = m.banner;
  v.innerHTML = `<div class="card"><div id="pb"></div><div id="pa"></div></div>
<label>Name <input id="f-name" maxlength="24"></label><label>Avatar emoji <input id="f-av" maxlength="8"></label>
<label>Bio <textarea id="f-bio" maxlength="120"></textarea></label>
<h3>Banner</h3><div class="sw" id="s-ban"></div><h3>Theme</h3><div class="sw" id="s-pre"></div>
<h3>Accent</h3><div class="sw" id="s-acc"></div><h3>Wallpaper</h3><div class="sw" id="s-wall"></div>
<label>Font <select id="f-font"></select></label><label>Bubbles <select id="f-bub"></select></label>
<button id="save">Save</button> <button id="out">Log out</button>`;
  const $ = s => v.querySelector(s);
  $('#f-name').value = m.name; $('#f-av').value = m.avatar; $('#f-bio').value = m.bio;
  const prev = () => { $('#pb').style.background = banner; $('#pa').textContent = $('#f-av').value; applyTheme(t); };
  const row = (id, items, get, set, color) => {
    const c = $(id); c.innerHTML = '';
    items.forEach(x => { const b = document.createElement('button'); if (color) b.style.background = x; else { b.className = 'txt'; b.textContent = x; }
      if (get() === x) b.classList.add('on'); b.onclick = () => { set(x); row(id, items, get, set, color); prev(); }; c.append(b); });
  };
  row('#s-ban', SWATCHES, () => banner, x => banner = x, true);
  row('#s-pre', Object.keys(PRESETS), () => t.preset || 'ember', x => t.preset = x);
  row('#s-acc', SWATCHES, () => t.accent, x => t.accent = x, true);
  row('#s-wall', WALLS, () => t.wall || 'none', x => t.wall = x);
  for (const k in FONTS) $('#f-font').add(new Option(k, k)); for (const k in BUBBLES) $('#f-bub').add(new Option(k, k));
  $('#f-font').value = t.font || 'system'; $('#f-bub').value = t.bubble || 'round';
  $('#f-font').onchange = e => { t.font = e.target.value; prev(); }; $('#f-bub').onchange = e => { t.bubble = e.target.value; prev(); };
  $('#f-av').oninput = prev; prev();
  $('#save').onclick = async () => { try { await api('profile', { name: $('#f-name').value, avatar: $('#f-av').value, bio: $('#f-bio').value, banner, theme: t }); reload(); } catch (x) { alert(x); } };
  $('#out').onclick = () => { clearToken(); location.reload(); };
}
