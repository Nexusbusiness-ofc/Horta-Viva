import test from 'node:test';
import assert from 'node:assert/strict';
import { getClimateProfile, getLocalDateString, getLocalMonth, getReferenceMonth, getRegionalSeason, regionalizeItems, getRegionalAIContext } from '../src/lib/regionalClimate.js';
import { getPlantingProgress, getCareGuide } from '../src/lib/plantingCare.js';
import { generateCuras, groupCuras, seasonOf } from '../src/lib/careSchedule.js';

const pt = { onboarded: true, countryCode: 'PT', region: 'Lisboa', locality: 'Lisboa', latitude: 38.72, longitude: -9.14, timeZone: 'Europe/Lisbon', language: 'pt-PT', climate: 'mediterranean', growingEnvironment: 'outdoor', wetSeasonMonths: [] };
const south = { ...pt, countryCode: 'ZA', region: 'Western Cape', latitude: -33.92, longitude: 18.42, timeZone: 'Africa/Johannesburg' };
const tropical = { ...pt, countryCode: 'BR', region: 'Amazonas', latitude: -3.1, longitude: -60.02, timeZone: 'America/Manaus', climate: 'tropical' };
const cold = { ...pt, countryCode: 'CA', region: 'Manitoba', latitude: 55.7, longitude: -97.86, timeZone: 'America/Winnipeg', climate: 'continental' };
const tomato = Object.freeze({ id: 'tomato', name: 'Tomate', sow_months: Object.freeze([2, 3, 4]), plant_months: Object.freeze([4, 5]), harvest_months: Object.freeze([6, 7, 8, 9]) });

test('Portugal preserves reference windows and the south shifts once without mutating source', () => {
  const local = regionalizeItems('plants', [tomato], pt)[0];
  assert.deepEqual(local.sow_months, [2, 3, 4]);
  assert.equal(local.regional_adaptation.isEstimate, true);
  const shifted = regionalizeItems('plants', [tomato], south)[0];
  assert.deepEqual(shifted.sow_months, [8, 9, 10]);
  assert.deepEqual(shifted.plant_months, [10, 11]);
  assert.deepEqual(shifted.harvest_months, [1, 2, 3, 12]);
  assert.deepEqual(tomato.sow_months, [2, 3, 4]);
  const twice = regionalizeItems('plants', JSON.parse(JSON.stringify([shifted])), south)[0];
  assert.deepEqual(twice.sow_months, shifted.sow_months);
  assert.deepEqual(regionalizeItems('plants', [twice], pt)[0].sow_months, tomato.sow_months);
});

test('civil month is separate from the reference season and handles time zone boundaries', () => {
  const instant = new Date('2026-03-01T00:30:00Z');
  const br = { ...tropical, timeZone: 'America/Sao_Paulo' };
  assert.equal(getLocalDateString(instant, br), '2026-02-28');
  assert.equal(getLocalMonth(instant, br), 2);
  assert.equal(getLocalMonth(new Date('2026-01-15T12:00:00Z'), south), 1);
  assert.equal(getReferenceMonth(1, south), 7);
  assert.equal(getRegionalSeason(new Date('2026-01-15T12:00:00Z'), south), 'verao');
  assert.equal(getRegionalSeason(new Date('2026-01-15T12:00:00Z'), pt), 'inverno');
  assert.equal(seasonOf(1, south), 'verao');
  assert.equal(getReferenceMonth(1, tropical), null);
});

test('onboarding is required and unknown/equatorial climates do not silently become Portugal', () => {
  const fresh = { ...pt, onboarded: false };
  assert.equal(getClimateProfile(fresh).calendarReady, false);
  assert.deepEqual(regionalizeItems('plants', [tomato], fresh)[0].sow_months, []);
  assert.equal(regionalizeItems('plants', [tomato], fresh)[0].regional_adaptation.status, 'needs_configuration');
  assert.match(getRegionalAIContext(fresh), /do not assume Portugal/);
  assert.equal(getClimateProfile({ ...pt, countryCode: 'BR', latitude: null, climate: 'auto' }).calendarReady, false);
  assert.equal(getClimateProfile({ ...tropical, latitude: 0, climate: 'auto' }).climate, 'tropical');
  assert.equal(getClimateProfile({ ...tropical, latitude: -25.43, climate: 'auto' }).climate, 'temperate');
  assert.equal(getClimateProfile({ ...tropical, latitude: 0, climate: 'temperate' }).calendarReady, false);
});

test('tropical warm crops are conditional while cool crops and chilling fruit need local validation', () => {
  const warm = regionalizeItems('plants', [tomato], tropical)[0];
  assert.equal(warm.plant_months.length, 12);
  assert.equal(warm.regional_adaptation.suitability, 'conditional');
  assert.match(warm.regional_adaptation.notes.join(' '), /chuvas/);
  assert.deepEqual(regionalizeItems('plants', [tomato], { ...tropical, wetSeasonMonths: [11, 12, 1, 1] })[0].plant_months, [1, 11, 12]);
  const fava = regionalizeItems('plants', [{ ...tomato, name: 'Fava' }], tropical)[0];
  assert.deepEqual(fava.plant_months, []);
  assert.equal(fava.regional_adaptation.status, 'local_data_required');
  const apple = regionalizeItems('podas', [{ name: 'Macieira', when_months: [1, 2] }], tropical)[0];
  assert.deepEqual(apple.when_months, []);
  assert.equal(apple.regional_adaptation.suitability, 'not_recommended');
  const mushroom = regionalizeItems('mushrooms', [{ name: 'Boletus', season_months: [10, 11] }], tropical)[0];
  assert.deepEqual(mushroom.season_months, []);
  assert.match(mushroom.regional_adaptation.notes.join(' '), /comestibilidade/);
});

test('cold and arid profiles do not reuse the Mediterranean outdoor calendar', () => {
  const hardy = regionalizeItems('plants', [tomato], cold)[0];
  assert.deepEqual(hardy.plant_months, [5, 6]);
  assert.deepEqual(hardy.harvest_months, [7, 8, 9]);
  const cherry = regionalizeItems('podas', [{ name: 'Cerejeira', when_months: [1, 2] }], cold)[0];
  assert.deepEqual(cherry.when_months, [5, 6, 7, 8]);
  const citrus = regionalizeItems('plants', [{ ...tomato, name: 'Laranjeira' }], cold)[0];
  assert.equal(citrus.regional_adaptation.suitability, 'not_recommended');
  assert.deepEqual(citrus.plant_months, []);
  const greenhouse = regionalizeItems('plants', [tomato], { ...cold, growingEnvironment: 'greenhouse' })[0];
  assert.deepEqual(greenhouse.plant_months, [5, 6]);
  assert.match(greenhouse.regional_adaptation.notes.join(' '), /sem climatização/);
  const arid = regionalizeItems('plants', [tomato], { ...pt, climate: 'arid' })[0];
  assert.deepEqual(arid.plant_months, []);
  assert.equal(arid.regional_adaptation.status, 'local_data_required');
});

test('plant progress counts civil days through leap year and daylight saving transitions', () => {
  assert.equal(getPlantingProgress({ planted_date: '2024-02-28' }, pt, new Date('2024-03-01T12:00:00Z')).daysSince, 2);
  assert.equal(getPlantingProgress({ planted_date: '2026-03-28' }, pt, new Date('2026-03-30T12:00:00Z')).daysSince, 2);
  assert.equal(getPlantingProgress({ planted_date: '2026-02-28' }, { ...pt, timeZone: 'America/Sao_Paulo' }, new Date('2026-03-01T00:30:00Z')).daysSince, 0);
  assert.equal(getCareGuide({ planted_date: '2026-03-28' }, [], cold, new Date('2026-03-30T12:00:00Z')).harvestIsEstimate, true);
});

test('automatic product schedules do not export Portuguese product assumptions abroad', () => {
  const planting = { plant_name: 'Tomate', planted_date: '2026-03-01', expected_harvest_date: '2026-07-30', status: 'Plantada' };
  assert.ok(generateCuras(planting, [tomato], pt).length > 0);
  assert.deepEqual(generateCuras(planting, [tomato], south), []);
  assert.deepEqual(generateCuras(planting, [tomato], tropical), []);
  assert.deepEqual(generateCuras({ ...planting, planted_date: 'invalid' }, [tomato], pt), []);
  const grouped = groupCuras([{ date: '2026-02-28' }, { date: '2026-03-01' }], { ...pt, timeZone: 'America/Sao_Paulo' }, new Date('2026-03-01T00:30:00Z'));
  assert.equal(grouped.hoje.tasks[0].date, '2026-02-28');
  assert.equal(grouped.semana.tasks[0].date, '2026-03-01');
});

test('offline cache stores original months, never the regional view', async () => {
  const store = new Map();
  globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value), removeItem: key => store.delete(key), get length() { return store.size; }, key: i => [...store.keys()][i] };
  globalThis.window = { localStorage: globalThis.localStorage };
  const { cachedList } = await import('../src/lib/offlineCatalog.js');
  const shifted = await cachedList('regional-test', async () => [tomato], south);
  assert.deepEqual(shifted[0].sow_months, [8, 9, 10]);
  const cached = JSON.parse(store.get('hv_offline_v9_regional-test')).data[0];
  assert.deepEqual(cached.sow_months, [2, 3, 4]);
  assert.equal(cached.regional_adaptation, undefined);
  const restored = await cachedList('regional-test', null, pt);
  assert.deepEqual(restored[0].sow_months, [2, 3, 4]);
});

test('both Gemini clients inject selected location and language without contacting the network', async () => {
  const store = new Map();
  store.set('hortaviva_gemini_api_key', 'test-only-placeholder');
  store.set('hortaviva_regional_preferences_v1', JSON.stringify({ ...tropical, language: 'en' }));
  globalThis.localStorage = { getItem: key => store.get(key) ?? null, setItem: (key, value) => store.set(key, value), removeItem: key => store.delete(key) };
  globalThis.window = { localStorage: globalThis.localStorage };
  const payloads = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (_url, options) => { payloads.push(JSON.parse(options.body)); return { ok: true, json: async () => ({ candidates: [{ content: { parts: [{ text: 'Test answer' }] } }] }) }; };
  try {
    const { askGeminiAgriculturalAI } = await import('../src/api/geminiClient.js');
    const { callGemini } = await import('../src/lib/aiService.js');
    await askGeminiAgriculturalAI('When can I plant?');
    await callGemini({ prompt: 'When can I plant?' });
    assert.equal(payloads.length, 2);
    for (const payload of payloads) {
      const instructions = payload.systemInstruction.parts.map(part => part.text).join(' ');
      assert.match(instructions, /Respond in English/);
      assert.match(instructions, /"countryCode":"BR"/);
      assert.match(instructions, /"climate":"tropical"/);
      assert.match(instructions, /never invent live weather/);
    }
  } finally { globalThis.fetch = originalFetch; }
});
