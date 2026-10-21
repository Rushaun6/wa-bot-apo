let token = localStorage.t || '';
export const setToken = t => localStorage.t = token = t;
export const clearToken = () => { localStorage.removeItem('t'); token = ''; };
export const hasToken = () => !!token;
export const tok = () => token;
export const api = async (p, b) => {
  const r = await fetch('/api/' + p, { method: b ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', Authorization: token }, body: b && JSON.stringify(b) });
  const j = await r.json();
  if (!r.ok) throw j.error || 'Error';
  return j;
};
