import { api, setToken, hasToken } from './api.js';
import { applyTheme } from './theme.js';
import { initChat } from './chat.js';
import { initProfile } from './profile.js';
import { initGroup } from './group.js';
import { initPets } from './pets.js';
const $ = s => document.querySelector(s);
async function load() {
  const S = await api('state'); S.onRefresh = load;
  applyTheme(S.me.theme); $('#gname').textContent = S.group.name; $('#banner').style.background = S.group.banner;
  $('#login').hidden = true; $('#app').hidden = false;
  initChat(S); initProfile(S, load); initGroup(S, load); initPets();
}
$('#loginf').onsubmit = async e => {
  e.preventDefault();
  try { setToken((await api('login', { number: $('#num').value, pin: $('#pin').value })).token); await load(); } catch (x) { $('#err').textContent = x; }
};
document.querySelectorAll('#tabs button').forEach(b => b.onclick = () => document.querySelectorAll('#views>section').forEach(s => s.hidden = s.id !== 'v-' + b.dataset.v));
if (hasToken()) load().catch(() => {});
if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');
