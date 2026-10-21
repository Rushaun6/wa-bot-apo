import { db, save } from './store.js';
import { broadcast } from './bus.js';
import { pub } from './auth.js';
import { okColor } from './colors.js';
import * as eco from './economy.js';
const RANK = { member: 0, admin: 1, owner: 2 };
const BOT = { name: 'Bot', avatar: '🤖', number: 'bot' };
export const can = (u, a) => RANK[u.role] >= RANK[db.group.perms[a]];
const add = (from, text, bot) => {
  const m = { id: Date.now() + Math.random().toString(36).slice(2, 5), from, text, time: Date.now(), bot: !!bot };
  db.messages.push(m); db.messages = db.messages.slice(-500); save(); broadcast({ type: 'msg', m });
};
export const state = u => ({
  me: pub(u), group: db.group, messages: db.messages.slice(-100), members: Object.values(db.users).map(pub),
  can: { send: can(u, 'send'), economy: can(u, 'economy'), rename: can(u, 'rename') }
});
export async function send(u, text) {
  text = String(text || '').trim().slice(0, 1000);
  if (!text) return;
  if (u.muted) throw 'You are muted';
  if (!can(u, 'send')) throw 'Sending is restricted in this group';
  add({ number: u.number, name: u.name, avatar: u.avatar }, text);
  if (text[0] === '.') await command(u, text.slice(1).split(/\s+/));
}
const REELS = ['🍒', '🍋', '🔔', '💎', '7️⃣'];
async function command(u, [c, ...a]) {
  const say = t => add(BOT, t, true);
  if (!['bal', 'balance', 'top', 'slots'].includes(c)) return;
  if (!can(u, 'economy')) return say('Economy commands are off for you in this group.');
  try {
    if (c === 'bal' || c === 'balance') {
      const r = await eco.balance(u.number);
      return say(r ? `💰 ${u.name}: ${r.balance} wallet, ${r.bank} bank` : 'No bot account for this number yet. Use the bot on WhatsApp once first.');
    }
    if (c === 'top') {
      const rows = await eco.top();
      return say('🏆 Leaderboard\n' + rows.map((r, i) => `${i + 1}. ${r.name || r.jid.split('@')[0]} - ${r.balance}`).join('\n'));
    }
    const bet = parseInt(a[0]);
    if (!(bet > 0)) return say('Usage: .slots <bet>');
    const s = [0, 0, 0].map(() => REELS[Math.floor(Math.random() * REELS.length)]);
    const same = new Set(s).size, mult = same === 1 ? 5 : same === 2 ? 2 : 0;
    const delta = mult ? bet * (mult - 1) : -bet;
    const bal = await eco.adjust(u.number, delta, 'app_slots');
    say(`🎰 ${s.join(' ')}\n${mult ? `You won ${bet * (mult - 1)}!` : `You lost ${bet}.`} Balance: ${bal}`);
  } catch (e) { say('⚠️ ' + (e.message || e)); }
}
export function setGroup(u, { name, perms, banner }) {
  if (name !== undefined) { if (!can(u, 'rename')) throw 'No permission'; db.group.name = String(name).trim().slice(0, 40) || db.group.name; }
  if (banner !== undefined) { if (!can(u, 'rename') || !okColor(banner)) throw 'Invalid banner'; db.group.banner = banner; }
  if (perms) {
    if (u.role !== 'owner') throw 'Only the owner can change permissions';
    for (const [k, v] of Object.entries(perms)) if (k in db.group.perms && v in RANK) db.group.perms[k] = v;
  }
  save(); broadcast({ type: 'refresh' });
}
export function member(u, { number, action, role }) {
  const t = db.users[number];
  if (!t || t.number === u.number || RANK[u.role] < 1 || RANK[t.role] >= RANK[u.role]) throw 'No permission';
  if (action === 'mute' || action === 'unmute') t.muted = action === 'mute';
  else if (action === 'kick') { delete db.users[number]; for (const k in db.sessions) if (db.sessions[k] === number) delete db.sessions[k]; }
  else if (action === 'role' && u.role === 'owner' && ['member', 'admin'].includes(role)) t.role = role;
  else throw 'Bad action';
  save(); broadcast({ type: 'refresh' });
}
const LISTS = { preset: ['ember', 'forest', 'rose', 'mono', 'sand'], font: ['system', 'serif', 'mono', 'round'], bubble: ['round', 'sharp', 'pill'], wall: ['none', 'dots', 'stripes'] };
export function profile(u, b) {
  if (b.name !== undefined) u.name = String(b.name).trim().slice(0, 24) || u.name;
  if (b.bio !== undefined) u.bio = String(b.bio).slice(0, 120);
  if (b.avatar !== undefined) u.avatar = String(b.avatar).slice(0, 8) || u.avatar;
  if (b.banner !== undefined) { if (!okColor(b.banner)) throw 'No blue or purple please'; u.banner = b.banner; }
  if (b.theme) {
    const t = {};
    for (const k in LISTS) if (LISTS[k].includes(b.theme[k])) t[k] = b.theme[k];
    if (b.theme.accent) { if (!okColor(b.theme.accent)) throw 'No blue or purple please'; t.accent = b.theme.accent; }
    u.theme = t;
  }
  save(); broadcast({ type: 'refresh' });
}
