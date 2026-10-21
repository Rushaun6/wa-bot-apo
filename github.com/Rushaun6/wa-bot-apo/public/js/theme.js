export const PRESETS = {
  ember: { bg: '#1c1410', panel: '#2a1d16', text: '#f5e6da', accent: '#f97316' },
  forest: { bg: '#101a14', panel: '#18271e', text: '#e3f2e7', accent: '#22c55e' },
  rose: { bg: '#1d1216', panel: '#2b1b21', text: '#f8e4ea', accent: '#f43f5e' },
  mono: { bg: '#111111', panel: '#1d1d1d', text: '#eeeeee', accent: '#facc15' },
  sand: { bg: '#f6efe4', panel: '#fffaf1', text: '#2b2118', accent: '#ea580c' }
};
export const SWATCHES = ['#f97316', '#ef4444', '#f43f5e', '#ec4899', '#facc15', '#22c55e', '#84cc16', '#a16207'];
export const FONTS = { system: 'system-ui,sans-serif', serif: 'Georgia,serif', mono: 'ui-monospace,monospace', round: '"Trebuchet MS",sans-serif' };
export const BUBBLES = { round: '18px', sharp: '4px', pill: '28px' };
export const WALLS = ['none', 'dots', 'stripes'];
export function applyTheme(t = {}) {
  const p = PRESETS[t.preset] || PRESETS.ember, s = document.documentElement.style;
  s.setProperty('--bg', p.bg); s.setProperty('--panel', p.panel); s.setProperty('--text', p.text);
  s.setProperty('--accent', t.accent || p.accent);
  s.setProperty('--font', FONTS[t.font] || FONTS.system); s.setProperty('--r', BUBBLES[t.bubble] || BUBBLES.round);
  document.body.dataset.wall = t.wall || 'none';
}
