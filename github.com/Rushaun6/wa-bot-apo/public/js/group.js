import { api } from './api.js';
const rank = r => ({ member: 0, admin: 1, owner: 2 }[r]);
const btn = (t, f) => { const b = document.createElement('button'); b.textContent = t; b.onclick = f; return b; };
export function initGroup(S, reload) {
  const v = document.querySelector('#v-group'), me = S.me, isO = me.role === 'owner', isA = rank(me.role) > 0;
  const act = async (p, b) => { try { await api(p, b); reload(); } catch (x) { alert(x); } };
  v.innerHTML = '<h2>Group</h2><div id="gset"></div><h3>Members</h3><div id="mlist"></div>';
  const g = v.querySelector('#gset');
  if (S.can.rename) { const i = document.createElement('input'); i.value = S.group.name; g.append(i, btn('Rename', () => act('group', { name: i.value }))); }
  if (isO) {
    g.append(Object.assign(document.createElement('h3'), { textContent: 'Who can…' }));
    for (const [k, l] of [['send', 'Send messages'], ['economy', 'Use economy commands'], ['rename', 'Rename the group']]) {
      const r = document.createElement('label'), s = document.createElement('select');
      r.textContent = l; ['member', 'admin', 'owner'].forEach(o => s.add(new Option(o, o))); s.value = S.group.perms[k];
      s.onchange = () => act('group', { perms: { [k]: s.value } }); r.append(s); g.append(r);
    }
  }
  const ml = v.querySelector('#mlist');
  S.members.forEach(m => {
    const r = document.createElement('div'), t = document.createElement('span'); r.className = 'member';
    t.textContent = `${m.avatar} ${m.name} · ${m.role}${m.muted ? ' · muted' : ''}`; r.append(t);
    if (isA && m.number !== me.number && rank(m.role) < rank(me.role)) {
      r.append(btn(m.muted ? 'Unmute' : 'Mute', () => act('member', { number: m.number, action: m.muted ? 'unmute' : 'mute' })));
      r.append(btn('Kick', () => confirm('Kick ' + m.name + '?') && act('member', { number: m.number, action: 'kick' })));
      if (isO) r.append(btn(m.role === 'admin' ? 'Make member' : 'Make admin', () => act('member', { number: m.number, action: 'role', role: m.role === 'admin' ? 'member' : 'admin' })));
    }
    ml.append(r);
  });
}
