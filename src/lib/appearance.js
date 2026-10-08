export const APPEARANCE_STORAGE_KEY = 'hortaviva_appearance_v1';
export const APPEARANCE_CHANGE_EVENT = 'hortaviva_appearance_changed';
export const DEFAULT_APPEARANCE = { version: 1, theme: 'forest', texture: 'none', fontSize: 'normal', reduceMotion: false, highContrast: false, updatedAt: '' };
// Ordered shades 50 through 950, shared by buttons, navigation and surfaces.
export const THEMES = {
  forest: ['ecfdf5','d1fae5','a7f3d0','6ee7b7','34d399','10b981','059669','047857','065f46','064e3b','022c22'],
  ocean: ['eff6ff','dbeafe','bfdbfe','93c5fd','60a5fa','3b82f6','2563eb','1d4ed8','1e40af','1e3a8a','172554'],
  sunset: ['fff7ed','ffedd5','fed7aa','fdba74','fb923c','f97316','ea580c','c2410c','9a3412','7c2d12','431407'],
  earth: ['faf7f2','f0e7d8','e3cfb4','d2b18b','bc9167','a57448','8b5d37','704a30','5d3e2a','4d3526','2a1b12'],
  lavender: ['f5f3ff','ede9fe','ddd6fe','c4b5fd','a78bfa','8b5cf6','7c3aed','6d28d9','5b21b6','4c1d95','2e1065'],
};
export function sanitizeAppearance(raw = {}) {
  return { ...DEFAULT_APPEARANCE, theme: Object.hasOwn(THEMES, raw.theme) ? raw.theme : 'forest', texture: ['none','paper','dots','leaves'].includes(raw.texture) ? raw.texture : 'none', fontSize: raw.fontSize === 'large' ? 'large' : 'normal', reduceMotion: raw.reduceMotion === true, highContrast: raw.highContrast === true, updatedAt: typeof raw.updatedAt === 'string' && Number.isFinite(Date.parse(raw.updatedAt)) ? raw.updatedAt : '' };
}
export function readAppearance() {
  try { return sanitizeAppearance(JSON.parse(globalThis.localStorage?.getItem(APPEARANCE_STORAGE_KEY) || '{}')); } catch { return { ...DEFAULT_APPEARANCE }; }
}
export function writeAppearance(raw, { restored = false } = {}) {
  const next = sanitizeAppearance({ ...raw, updatedAt: restored ? raw.updatedAt : new Date().toISOString() });
  globalThis.localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(next));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(APPEARANCE_CHANGE_EVENT, { detail: next }));
    if (!restored) window.dispatchEvent(new CustomEvent('hortaviva_data_changed'));
  }
  return next;
}
