import { COUNTRIES } from './countriesData.js';

export const REGIONAL_STORAGE_KEY = 'hortaviva_regional_preferences_v1';
export const REGIONAL_CHANGE_EVENT = 'hortaviva_regional_preferences_changed';
export const LANGUAGES = [
  { code: 'pt-PT', label: 'Português (Portugal)' },
  { code: 'pt-BR', label: 'Português (Brasil)' },
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
];
const countryCodes = new Set(COUNTRIES.map(country => country.code));
const climateValues = new Set(['auto', 'mediterranean', 'temperate', 'continental', 'tropical', 'arid']);
const environments = new Set(['outdoor', 'greenhouse', 'container']);

export function validTimeZone(value) {
  try { new Intl.DateTimeFormat('en', { timeZone: value }).format(); return typeof value === 'string' && value.length > 0; }
  catch { return false; }
}

export function defaultRegionalPreferences() {
  const browserLanguage = typeof navigator !== 'undefined' ? navigator.language || 'pt-PT' : 'pt-PT';
  const language = browserLanguage.startsWith('pt-BR') ? 'pt-BR' : browserLanguage.startsWith('pt') ? 'pt-PT' : browserLanguage.startsWith('es') ? 'es' : 'en';
  const suggestedCountry = browserLanguage.split('-').at(-1)?.toUpperCase();
  return { version: 1, onboarded: false, countryCode: countryCodes.has(suggestedCountry) ? suggestedCountry : 'PT', region: '', locality: '', latitude: null, longitude: null, timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC', language, climate: 'auto', growingEnvironment: 'outdoor', weatherEnabled: false, wetSeasonMonths: [] };
}

const coordinate = (value, max) => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= max ? Math.round(value * 100) / 100 : null;
const safeText = value => typeof value === 'string' ? value.trim().slice(0, 150) : '';

export function sanitizeRegionalPreferences(raw = {}) {
  const defaults = defaultRegionalPreferences();
  const countryCode = typeof raw.countryCode === 'string' ? raw.countryCode.toUpperCase() : '';
  const language = LANGUAGES.some(item => item.code === raw.language) ? raw.language : defaults.language;
  const latitude = coordinate(raw.latitude, 90);
  const longitude = coordinate(raw.longitude, 180);
  return {
    ...defaults,
    countryCode: countryCodes.has(countryCode) ? countryCode : defaults.countryCode,
    language,
    region: safeText(raw.region), locality: safeText(raw.locality),
    latitude: latitude !== null && longitude !== null ? latitude : null,
    longitude: latitude !== null && longitude !== null ? longitude : null,
    timeZone: validTimeZone(raw.timeZone) ? raw.timeZone : defaults.timeZone,
    climate: climateValues.has(raw.climate) ? raw.climate : 'auto',
    growingEnvironment: environments.has(raw.growingEnvironment) ? raw.growingEnvironment : 'outdoor',
    weatherEnabled: raw.weatherEnabled === true && latitude !== null && longitude !== null,
    wetSeasonMonths: Array.isArray(raw.wetSeasonMonths) ? [...new Set(raw.wetSeasonMonths.filter(month => Number.isInteger(month) && month >= 1 && month <= 12))].sort((a,b) => a-b) : [],
    updatedAt: typeof raw.updatedAt === 'string' && Number.isFinite(Date.parse(raw.updatedAt)) ? raw.updatedAt : '',
    onboarded: raw.onboarded === true && countryCodes.has(countryCode) && LANGUAGES.some(item => item.code === raw.language) && !!safeText(raw.region),
  };
}

export function readRegionalPreferences() {
  try {
    const raw = globalThis.localStorage?.getItem(REGIONAL_STORAGE_KEY);
    return raw ? sanitizeRegionalPreferences(JSON.parse(raw)) : defaultRegionalPreferences();
  } catch { return defaultRegionalPreferences(); }
}

export function writeRegionalPreferences(preferences, { restored = false } = {}) {
  const next = sanitizeRegionalPreferences({ ...preferences, updatedAt: restored ? preferences.updatedAt : new Date().toISOString() });
  if (!globalThis.localStorage) throw new Error('Local storage unavailable');
  globalThis.localStorage.setItem(REGIONAL_STORAGE_KEY, JSON.stringify(next));
  if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(REGIONAL_CHANGE_EVENT, { detail: next }));
  if (!restored && typeof window !== 'undefined') window.dispatchEvent(new CustomEvent('hortaviva_data_changed'));
  return next;
}

export function getCountryName(code, language = 'pt-PT') {
  try { return new Intl.DisplayNames([language], { type: 'region' }).of(code) || code; }
  catch { return COUNTRIES.find(country => country.code === code)?.name || code; }
}

export function getCountryOptions(language = 'pt-PT') {
  return COUNTRIES.filter(country => !['AN','CS'].includes(country.code)).map(country => ({ ...country, name: getCountryName(country.code, language) })).sort((a,b) => a.name.localeCompare(b.name, language));
}

export function hasCoordinates(preferences) {
  return typeof preferences.latitude === 'number' && Number.isFinite(preferences.latitude) && typeof preferences.longitude === 'number' && Number.isFinite(preferences.longitude);
}
