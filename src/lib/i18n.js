import { TRANSLATION_ROWS } from './i18nMessages.js';
import { EXTRA_TRANSLATION_ROWS } from './i18nExtraMessages.js';
import { CATALOG_NAME_ROWS } from './i18nCatalogNames.js';
import { HOME_TRANSLATION_ROWS } from './i18nHomeMessages.js';
import { CURIOSITY_FACT_ROWS } from './i18nCuriosityFacts.js';
import { WEATHER_TRANSLATIONS } from './weatherTranslations.js';
import { MASCOT_TRANSLATIONS } from './mascotTranslations.js';
import { PLANTING_QUANTITY_TRANSLATIONS } from './plantingQuantityTranslations.js';
import { HARVEST_TRANSLATIONS } from './harvestTranslations.js';

export const SUPPORTED_LANGUAGES = ['pt-PT', 'pt-BR', 'en', 'es'];

export function normalizeLanguage(language) {
  if (language === 'pt-BR') return 'pt-BR';
  if (language === 'en' || String(language).startsWith('en-')) return 'en';
  if (language === 'es' || String(language).startsWith('es-')) return 'es';
  return 'pt-PT';
}

const messages = { 'pt-PT': {}, 'pt-BR': {}, en: {}, es: {} };
const brazilian = (text) => text
  .replace(/telemóvel/gi, 'celular').replace(/ecrã/gi, 'tela')
  .replace(/Palavra-passe/g, 'Senha').replace(/palavra-passe/g, 'senha')
  .replace(/Guardar/g, 'Salvar').replace(/guardar/g, 'salvar')
  .replace(/A guardar/g, 'Salvando').replace(/Descarregar/g, 'Baixar')
  .replace(/descarregar/g, 'baixar').replace(/ficheiro/g, 'arquivo')
  .replace(/Ficheiro/g, 'Arquivo').replace(/quinta/g, 'fazenda')
  .replace(/Quinta/g, 'Fazenda').replace(/plantações/g, 'plantios')
  .replace(/Plantações/g, 'Plantios').replace(/plantação/g, 'plantio')
  .replace(/Plantação/g, 'Plantio').replace(/registos/g, 'registros')
  .replace(/registados/g, 'registrados').replace(/registar/g, 'registrar')
  .replace(/Regista/g, 'Registre').replace(/regista/g, 'registre')
  .replace(/tua/g, 'sua').replace(/teu/g, 'seu').replace(/tuas/g, 'suas').replace(/teus/g, 'seus');

for (const row of `${TRANSLATION_ROWS}\n${EXTRA_TRANSLATION_ROWS}\n${CATALOG_NAME_ROWS}\n${HOME_TRANSLATION_ROWS}\n${CURIOSITY_FACT_ROWS}`.trim().split('\n')) {
  const [key, en, es, br] = row.split('|').map((part) => part.trim());
  if (!key) continue;
  messages['pt-PT'][key] = key;
  messages['pt-BR'][key] = br || brazilian(key);
  messages.en[key] = en || key;
  messages.es[key] = es || key;
}

for (const row of CATALOG_NAME_ROWS.trim().split('\n')) {
  const [key] = row.split('|');
  for (const language of SUPPORTED_LANGUAGES) {
    const lowered = key.toLocaleLowerCase('pt-PT');
    if (lowered !== key) messages[language][lowered] = messages[language][key].toLocaleLowerCase(language);
  }
}

/** Explicit dictionaries may be supplied by independent feature modules. */
export function registerTranslations(catalog) {
  for (const language of SUPPORTED_LANGUAGES) Object.assign(messages[language], catalog[language] || {});
}

registerTranslations(WEATHER_TRANSLATIONS);
registerTranslations(MASCOT_TRANSLATIONS);
registerTranslations(PLANTING_QUANTITY_TRANSLATIONS);
registerTranslations(HARVEST_TRANSLATIONS);

/** Pure: does not inspect browser language, storage, the DOM or external services. */
export function translate(key, language = 'pt-PT', vars = {}) {
  if (typeof key !== 'string') return key;
  const normalized = normalizeLanguage(language);
  const trimmed = key.trim().replace(/\s+/g, ' ');
  const translated = messages[normalized][trimmed] ?? messages['pt-PT'][trimmed] ?? trimmed;
  const leading = key.match(/^\s*/)?.[0] || '';
  const trailing = key.match(/\s*$/)?.[0] || '';
  return `${leading}${translated}${trailing}`.replace(/\{([\w.]+)\}/g, (match, name) => Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name] ?? '') : match);
}

export function translatedMonth(monthIndex, language = 'pt-PT', style = 'long') {
  const locale = normalizeLanguage(language);
  return new Intl.DateTimeFormat(locale, { month: style, timeZone: 'UTC' }).format(new Date(Date.UTC(2024, monthIndex, 15)));
}
