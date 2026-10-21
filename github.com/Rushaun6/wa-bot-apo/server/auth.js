import crypto from 'crypto';
import { db, save } from './store.js';
const hash = (p, s) => crypto.scryptSync(p, s, 32).toString('hex');
export const norm = n => String(n || '').replace(/\D/g, '');
export const pub = u => ({ number: u.number, name: u.name, bio: u.bio, avatar: u.avatar, banner: u.banner, theme: u.theme, role: u.role, muted: u.muted });
export const who = t => db.users[db.sessions[t]];
export function login(number, pin) {
  const n = norm(number);
  if (n.length < 7 || !/^\d{4}$/.test(String(pin))) throw 'Enter your number and a 4-digit PIN';
  let u = db.users[n];
  if (!u) {
    const salt = crypto.randomBytes(8).toString('hex');
    const first = !Object.keys(db.users).length;
    u = db.users[n] = { number: n, salt, pin: hash(pin, salt), name: 'user' + n.slice(-4), bio: '', avatar: '😎', banner: '#f97316', theme: {}, role: (process.env.OWNER_NUMBER === n || (first && !process.env.OWNER_NUMBER)) ? 'owner' : 'member', muted: false };
  } else if (u.pin !== hash(String(pin), u.salt)) throw 'Wrong PIN';
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions[token] = n; save();
  return { token };
}
