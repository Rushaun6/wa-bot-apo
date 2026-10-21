// Only touches cb_users (balance/bank) and cb_transactions (log) in Supabase.
const U = process.env.SUPABASE_URL, K = process.env.SUPABASE_SERVICE_KEY;
const h = () => ({ apikey: K, Authorization: 'Bearer ' + K, 'Content-Type': 'application/json', Prefer: 'return=representation' });
const jid = n => n + '@s.whatsapp.net';
const rest = async (p, o = {}) => {
  if (!K || !U) throw new Error('Economy is not connected yet');
  const r = await fetch(`${U}/rest/v1/${p}`, { headers: h(), ...o });
  if (!r.ok) throw new Error('Supabase ' + r.status);
  return r.json();
};
export const balance = async n => (await rest(`cb_users?jid=eq.${jid(n)}&select=balance,bank`))[0] || null;
export const top = () => rest('cb_users?select=name,jid,balance,bank&order=balance.desc&limit=10');
export async function adjust(n, delta, type) {
  for (let i = 0; i < 3; i++) {
    const row = await balance(n);
    if (!row) throw new Error('No bot account for this number yet');
    const next = Number(row.balance) + delta;
    if (next < 0) throw new Error('Not enough money');
    const done = await rest(`cb_users?jid=eq.${jid(n)}&balance=eq.${row.balance}`, { method: 'PATCH', body: JSON.stringify({ balance: next, updated_at: new Date().toISOString() }) });
    if (done.length) {
      await rest('cb_transactions', { method: 'POST', body: JSON.stringify({ user_jid: jid(n), type, amount: delta, meta: { via: 'app' } }) });
      return next;
    }
  }
  throw new Error('Balance changed, try again');
}
