// Blocks blue and purple hues (190-320 degrees)
export function okColor(h) {
  if (!/^#[0-9a-f]{6}$/i.test(h)) return false;
  const [r, g, b] = [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (mx - mn < 0.08) return true;
  let H = mx === r ? ((g - b) / (mx - mn)) % 6 : mx === g ? (b - r) / (mx - mn) + 2 : (r - g) / (mx - mn) + 4;
  H = (H * 60 + 360) % 360;
  return H < 190 || H > 320;
}
