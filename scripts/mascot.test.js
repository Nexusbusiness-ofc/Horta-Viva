import test from 'node:test';
import assert from 'node:assert/strict';
import { MASCOT_STORAGE_KEY, WATERED_STORAGE_KEY, createMascotState, readMascotState, writeMascotSettings,
  getMascotView, getMascotProgression, getFoodInfo, harvestPlanting, hasHarvest, feedMascot, mergeMascotStates,
  getMascotHydration, claimHydrationReward, mergeWateredMaps } from '../src/lib/mascot.js';
import { localEntities, localAuth, exportFarmData, importFarmData, mergeFarmData } from '../src/lib/localStorageStore.js';

const day1 = new Date('2026-10-01T12:00:00Z'), day2 = new Date('2026-10-02T12:00:00Z');
const options = now => ({ now, timeZone: 'UTC' });
const preferences = { onboarded: true, countryCode: 'PT', region: 'Lisboa', language: 'pt-PT', latitude: 38.72,
  longitude: -9.14, timeZone: 'UTC', weatherEnabled: true, growingEnvironment: 'outdoor' };
const crop = (id = 'favas', extra = {}) => ({ id, plant_name: 'Fava', plant_emoji: '🌱', planted_date: '2026-09-01',
  status: 'Pronta a colher', quantity_method: 'grid', rows: 2, columns: 3, plant_count: 6, ...extra });
const store = key => JSON.parse(localStorage.getItem(key) || 'null');
const put = (key, value) => localStorage.setItem(key, JSON.stringify(value));
function reset(plantings = []) {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key), key: i => [...values.keys()][i], get length() { return values.size; } };
  globalThis.window = new EventTarget(); window.localStorage = globalThis.localStorage;
  globalThis.CustomEvent ||= class extends Event { constructor(type, options = {}) { super(type); this.detail = options.detail; } };
  put('hortaviva_plantings', plantings); put(MASCOT_STORAGE_KEY, createMascotState({ now: day1 }));
  return values;
}
function wetWeather(extra = {}) {
  return { location: { latitude: preferences.latitude, longitude: preferences.longitude }, adviceAllowed: true, isStale: false, offline: false,
    expiresAt: '2026-10-02T13:00:00Z', days: [1,2,3].map(n => ({ date: `2026-10-0${n}`, isPartial: false })),
    currentRain: { start: '2026-10-02T12:00:00Z', end: '2026-10-02T13:00:00Z', precipitationMm: 0.3, estimated: true, symbol: 'lightrain' }, ...extra };
}

test('fullness starts at100, loses20 each civil day, stays bounded and never kills the pet', () => {
  const state = createMascotState({ now: day1 });
  assert.equal(getMascotView(state, options(day1)).fullness, 100);
  assert.equal(getMascotView(state, options(day2)).fullness, 80);
  assert.equal(getMascotView(state, options('2026-10-06T12:00:00Z')).fullness, 0);
  assert.equal(getMascotView(state, options('2036-10-06T12:00:00Z')).fullness, 0);
  assert.equal(getMascotView(state, options('2025-10-06T12:00:00Z')).fullness, 100);
  assert.equal(getMascotView(state, options(day2)).settings.species, 'sprout');
});

test('daily decay uses selected time zone and civil dates through DST', () => {
  const state = createMascotState({ now: '2026-10-01T23:30:00Z' });
  const now = '2026-10-02T00:30:00Z';
  assert.equal(getMascotView(state, { now, timeZone: 'America/Sao_Paulo' }).fullness, 100);
  assert.equal(getMascotView(state, { now, timeZone: 'UTC' }).fullness, 80);
  const dst = createMascotState({ now: '2026-10-24T12:00:00Z' });
  assert.equal(getMascotView(dst, { now: '2026-10-26T12:00:00Z', timeZone: 'Europe/Lisbon' }).fullness, 60);
});

test('fava and bean game points are3 and5, independently of real nutrition', () => {
  assert.equal(getFoodInfo('Fava').nutrition, 3);
  assert.equal(getFoodInfo('Feijão').nutrition, 5);
  assert.equal(getFoodInfo('Feijão-verde').nutrition, 5);
  assert.equal(getFoodInfo('Cultura personalizada').nutrition, 2);
});

test('only an actual stored, already planted crop can create stock, using stored rows times columns', () => {
  reset([crop()]);
  const result = harvestPlanting({ ...crop(), plant_name: 'Feijão', rows: 999 }, {}, options(day1));
  assert.equal(result.quantity, 6); assert.equal(result.foodKey, 'fava');
  assert.equal(store('hortaviva_plantings')[0].status, 'Colhida');
  assert.equal(getMascotView(readMascotState(), options(day1)).inventory[0].quantity, 6);
  assert.throws(() => harvestPlanting(crop('catalogue-only'), {}, options(day1)), e => e.code === 'planting_not_found');
  reset([crop('future', { planted_date: '2026-10-03' })]);
  assert.throws(() => harvestPlanting('future', {}, options(day1)), e => e.code === 'planting_not_started');
});

test('count override is explicit; old quantity text, decimals, negative and incomplete grids never infer yield', () => {
  reset([crop('legacy', { quantity_method: undefined, rows: undefined, columns: undefined, plant_count: undefined, quantity: '20 sementes / 3 linhas' })]);
  assert.throws(() => harvestPlanting('legacy', {}, options(day1)), e => e.code === 'quantity_required');
  for (const quantityData of [{ plant_count: -1 }, { plant_count: 2.5 }, { quantity_method: 'grid', rows: 3 }, { quantity_method: 'grid', rows: 0, columns: 3 }]) {
    assert.throws(() => harvestPlanting('legacy', quantityData, options(day1)), e => e.code === 'quantity_required');
  }
  assert.equal(harvestPlanting('legacy', { quantity_method: 'count', plant_count: 8 }, options(day1)).quantity, 8);
});

test('harvesting repeatedly and changing status cannot credit the same planting again', async () => {
  reset([crop()]);
  harvestPlanting('favas', {}, options(day1));
  const fed = feedMascot('fava', options(day2)); assert.equal(fed.gained, 3);
  const repeated = harvestPlanting('favas', { quantity_method: 'count', plant_count: 999 }, options(day2));
  assert.equal(repeated.alreadyHarvested, true); assert.equal(repeated.quantity, 6);
  await localEntities.Planting.update('favas', { status: 'Plantada' });
  assert.equal((await localEntities.Planting.list())[0].status, 'Colhida');
  assert.equal(getMascotView(readMascotState(), options(day2)).inventory[0].quantity, 5);
  assert.equal(hasHarvest('favas'), true);
});

test('automatic status changes and old harvested rows create no stock; explicit legacy registration is allowed', async () => {
  reset([crop()]);
  await localEntities.Planting.update('favas', { status: 'Colhida' });
  assert.equal(hasHarvest('favas'), false);
  assert.deepEqual(getMascotView(readMascotState(), options(day1)).inventory, []);
  assert.equal(harvestPlanting('favas', {}, options(day1)).quantity, 6);
});

test('failed ledger write does not change farm status or inventory', () => {
  reset([crop()]);
  const originalSet = localStorage.setItem;
  localStorage.setItem = (key, value) => { if (key === MASCOT_STORAGE_KEY) throw new Error('QuotaExceeded'); originalSet(key, value); };
  assert.throws(() => harvestPlanting('favas', {}, options(day1)), /QuotaExceeded/);
  assert.equal(store('hortaviva_plantings')[0].status, 'Pronta a colher');
  assert.equal(hasHarvest('favas'), false);
});

test('planting create and update reject quota errors, retain the existing list and never report a saved event', async t => {
  const existing = crop('existing', { status: 'Plantada' });
  reset([existing]);
  t.mock.method(console, 'error', () => {});
  const originalRaw = localStorage.getItem('hortaviva_plantings');
  const originalSet = localStorage.setItem;
  let savedEvents = 0;
  window.addEventListener('hortaviva_data_changed', () => { savedEvents++; });
  localStorage.setItem = (key, value) => {
    if (key === 'hortaviva_plantings') throw new DOMException('Storage quota exhausted', 'QuotaExceededError');
    originalSet(key, value);
  };
  const quotaError = e => e.name === 'QuotaExceededError';
  await assert.rejects(localEntities.Planting.create(crop('new')), quotaError);
  await assert.rejects(localEntities.Planting.update('existing', { plant_name: 'Feijão' }), quotaError);
  await assert.rejects(localEntities.Planting.update('missing', crop('missing')), quotaError);
  assert.equal(localStorage.getItem('hortaviva_plantings'), originalRaw);
  assert.deepEqual(await localEntities.Planting.list(), [existing]);
  assert.equal(savedEvents, 0);
});

test('the ledger remains authoritative if the recoverable farm projection cannot be saved', async () => {
  reset([crop()]);
  const originalSet = localStorage.setItem;
  localStorage.setItem = (key, value) => { if (key === 'hortaviva_plantings') throw new Error('Projection failure'); originalSet(key, value); };
  const result = harvestPlanting('favas', {}, options(day1));
  assert.equal(result.projectionPending, true);
  assert.equal((await localEntities.Planting.list())[0].status, 'Colhida');
  assert.equal(exportFarmData().plantings[0].status, 'Colhida');
  assert.equal(harvestPlanting('favas', {}, options(day1)).alreadyHarvested, true);
  assert.equal(getMascotView(readMascotState(), options(day1)).inventory[0].quantity, 6);
});

test('feeding caps fullness at100, rewards only actual gain and does not consume at100', () => {
  reset([crop('many', { quantity_method: 'count', plant_count: 10 })]);
  harvestPlanting('many', {}, options(day1));
  assert.equal(feedMascot('fava', options(day1)).reason, 'full');
  for (let i = 0; i < 6; i++) assert.equal(feedMascot('fava', options(day2)).gained, 3);
  const capped = feedMascot('fava', options(day2));
  assert.equal(capped.gained, 2); assert.equal(capped.gainedXp, 10);
  assert.equal(capped.fullness, 100); assert.equal(capped.view.totalXp, 100);
  assert.equal(capped.view.level, 2); assert.equal(capped.view.inventory[0].quantity, 3);
  assert.equal(feedMascot('fava', options(day2)).reason, 'full');
  assert.equal(getMascotView(readMascotState(), options(day2)).inventory[0].quantity, 3);
});

test('inventory cannot become negative and settings changes do not reset the pet', () => {
  reset([crop('one', { quantity_method: 'count', plant_count: 1 })]);
  harvestPlanting('one', {}, options(day1)); feedMascot('fava', options(day2));
  assert.equal(feedMascot('fava', options(day2)).reason, 'empty');
  const before = getMascotView(readMascotState(), options(day2));
  writeMascotSettings({ species: 'fox', accessory: 'bow', name: 'Nina' }, { now: day2 });
  const after = getMascotView(readMascotState(), options(day2));
  assert.equal(after.settings.name, 'Nina'); assert.equal(after.fullness, before.fullness); assert.equal(after.totalXp, before.totalXp);
  assert.deepEqual(after.inventory, []);
  writeMascotSettings({ enabled: false }, { now: day2 });
  assert.equal(feedMascot('fava', options(day2)).reason, 'disabled');
});

test('union merge does not resurrect consumed food and resolves concurrent claims of one unit only once', () => {
  reset([crop('one', { quantity_method: 'count', plant_count: 1 })]);
  const before = harvestPlanting('one', {}, options(day1)).state;
  const first = feedMascot('fava', options(day2)).state;
  const second = structuredClone(before);
  second.feedings['feeding:other-device'] = { id: 'feeding:other-device', at: day2.toISOString(), harvestId: 'harvest:one', unitIndex: 0 };
  const merged = mergeMascotStates(first, second);
  const view = getMascotView(merged, options(day2));
  assert.deepEqual(view.inventory, []); assert.equal(view.fullness, 83); assert.equal(view.totalXp, 15); assert.equal(view.consumedUnits, 1);
  assert.deepEqual(mergeMascotStates(first, before), mergeMascotStates(before, first));
  assert.deepEqual(mergeMascotStates(merged, merged), merged);
  assert.deepEqual(mergeMascotStates(mergeMascotStates(first, second), before), mergeMascotStates(first, mergeMascotStates(second, before)));
});

test('XP levels and every evolution boundary are exact, including high and nonfinite inputs', () => {
  const thresholds = [5,10,15,20,30,40,50,70,90,110,160,210,310,410,510];
  assert.equal(getMascotProgression(0).level, 1); assert.equal(getMascotProgression(99).xpToNextLevel, 1);
  for (let i = 0; i < thresholds.length; i++) {
    const level = thresholds[i], boundaryXp = (level - 1) * 100;
    assert.equal(getMascotProgression(boundaryXp).level, level);
    assert.equal(getMascotProgression(boundaryXp).evolutionStage, i + 1);
    assert.equal(getMascotProgression(boundaryXp - 1).evolutionStage, i);
  }
  assert.equal(getMascotProgression(40900).nextEvolutionLevel, 510);
  assert.equal(getMascotProgression(Infinity).level, 1);
  assert.equal(getMascotProgression(NaN).level, 1);
  assert.equal(getMascotProgression(-100).level, 1);
  assert.ok(Number.isFinite(getMascotProgression(1e99).nextEvolutionLevel));
});

test('hydration follows all active crops and watering intervals, excludes future care and has no empty-farm reward', () => {
  const plantings = [crop('one'), crop('two', { plant_name: 'Tomate' }), crop('three', { plant_name: 'Alecrim' })];
  const plants = [{ name: 'Fava', water_requirements: 'Moderada' }, { name: 'Tomate', water_requirements: 'Abundante' }, { name: 'Alecrim', water_requirements: 'Pouca' }];
  const result = getMascotHydration({ plantings, plants, preferences, lastWatered: { one: '2026-10-01', two: '2026-10-01', three: '2026-09-30' }, now: day2 });
  assert.equal(result.caredForCount, 2); assert.equal(result.dueCount, 1); assert.equal(result.hydration, 67);
  assert.equal(getMascotHydration({ plantings, plants, preferences, lastWatered: { one: '2026-10-03' }, now: day2 }).caredForCount, 0);
  assert.equal(getMascotHydration({ plantings: [], preferences, weather: wetWeather(), now: day2 }).hydration, 0);
  assert.equal(getMascotHydration({ plantings: [crop('old', { status: 'Colhida' })], preferences, now: day2 }).complete, false);
});

test('rounded hydration cannot grant completion while one crop remains uncared for', () => {
  const plantings = Array.from({ length: 300 }, (_, n) => crop(`p${n}`));
  const lastWatered = Object.fromEntries(plantings.slice(1).map(p => [p.id, '2026-10-02']));
  const result = getMascotHydration({ plantings, preferences, lastWatered, now: day2 });
  assert.equal(result.hydration, 99); assert.equal(result.complete, false);
});

test('planting today is not watering evidence and cannot grant hydration or daily XP', () => {
  const plantings = [crop('new-today', { planted_date: '2026-10-02', status: 'Plantada' })];
  reset(plantings);
  const hydration = getMascotHydration({ plantings, preferences, lastWatered: {}, now: day2 });
  assert.equal(hydration.hydration, 0);
  assert.equal(hydration.caredForCount, 0);
  assert.equal(hydration.complete, false);
  const reward = claimHydrationReward(hydration, { ...options(day2), preferences });
  assert.equal(reward.success, false);
  assert.equal(reward.gainedXp, 0);
  assert.equal(reward.reason, 'care_incomplete');
  assert.equal(getMascotView(readMascotState(), options(day2)).totalXp, 0);
});

test('heat care aligns with daily tasks, while watering today and indoor plants remain covered', () => {
  const weather = wetWeather({ currentRain: null, days: [2,3,4].map(n => ({ date: `2026-10-0${n}`, isPartial: false, maxTemp: 35, minTemp: 20 })) });
  const input = { plantings: [crop('a')], preferences, weather, lastWatered: { a: '2026-10-01' }, now: day2 };
  assert.equal(getMascotHydration(input).hydration, 0);
  assert.equal(getMascotHydration({ ...input, lastWatered: { a: '2026-10-02' } }).hydration, 100);
  assert.equal(getMascotHydration({ ...input, plantings: [crop('a', { growing_environment: 'indoor' })] }).hydration, 100);
  assert.equal(getMascotHydration({ ...input, weather: { ...weather, offline: true } }).hydration, 100);
});

test('current modelled rain fills only the virtual bowl and never changes watering records', () => {
  const plantings = [crop('inside', { growing_environment: 'greenhouse' })], lastWatered = {};
  const result = getMascotHydration({ plantings, preferences, weather: wetWeather(), lastWatered, now: day2 });
  assert.equal(result.hydration, 100); assert.equal(result.source, 'rain'); assert.equal(result.rainEstimated, true);
  assert.equal(result.dueCount, 1); assert.deepEqual(lastWatered, {});
});

test('future rain, forecasts, stale/offline data, other locations and disabled weather give no automatic water', () => {
  const check = (weather, prefs = preferences) => getMascotHydration({ plantings: [crop()], preferences: prefs, weather, now: day2 }).hydration;
  assert.equal(check(wetWeather({ currentRain: { ...wetWeather().currentRain, start: '2026-10-02T13:00:00Z', end: '2026-10-02T14:00:00Z' } })), 0);
  assert.equal(check(wetWeather({ currentRain: null, next6h: { precipitationMm: 100, complete: true } })), 0);
  assert.equal(check(wetWeather({ isStale: true })), 0); assert.equal(check(wetWeather({ offline: true })), 0);
  assert.equal(check(wetWeather({ expiresAt: day2.toISOString() })), 0);
  assert.equal(check(wetWeather({ location: { latitude: -23.55, longitude: -46.63 } })), 0);
  assert.equal(check(wetWeather(), { ...preferences, weatherEnabled: false }), 0);
  assert.equal(check(wetWeather({ currentRain: { ...wetWeather().currentRain, symbol: 'clearsky' } })), 0);
  const br = { ...preferences, latitude: -23.55, longitude: -46.63 };
  assert.equal(check(wetWeather({ location: { latitude: -23.55, longitude: -46.63 } }), br), 100);
});

test('hydration XP revalidates persisted care, grants40 once per local date and never mutates on view', () => {
  reset([crop('active')]);
  assert.equal(claimHydrationReward({ hydration: 100 }, { ...options(day2), preferences }).reason, 'care_incomplete');
  assert.equal(getMascotView(readMascotState(), options(day2)).totalXp, 0);
  put(WATERED_STORAGE_KEY, { active: '2026-10-02' });
  const claimed = claimHydrationReward({}, { ...options(day2), preferences });
  assert.equal(claimed.gainedXp, 40); assert.equal(claimed.view.totalXp, 40);
  assert.equal(claimHydrationReward({}, { ...options(day2), preferences }).reason, 'already_claimed');
  assert.equal(getMascotView(readMascotState(), options(day2)).totalXp, 40);
  const nextDay = new Date('2026-10-03T12:00:00Z'); put(WATERED_STORAGE_KEY, { active: '2026-10-03' });
  assert.equal(claimHydrationReward({}, { ...options(nextDay), preferences }).view.totalXp, 80);
});

test('daily rewards deduplicate on union merge and disabled/empty farms cannot claim', () => {
  reset([crop()]);
  const first = claimHydrationReward({}, { ...options(day2), preferences, weather: wetWeather() }).state;
  const other = structuredClone(first); other.rewards['hydration:2026-10-02'].at = '2026-10-02T12:01:00Z';
  assert.equal(getMascotView(mergeMascotStates(first, other), options(day2)).totalXp, 40);
  reset([]); assert.equal(claimHydrationReward({}, { ...options(day2), preferences, weather: wetWeather() }).reason, 'care_incomplete');
  reset([crop()]); writeMascotSettings({ enabled: false }, { now: day2 });
  assert.equal(claimHydrationReward({}, { ...options(day2), preferences, weather: wetWeather() }).reason, 'disabled');
});

test('backup and older restore preserve consumed inventory, harvested status and latest watering', () => {
  reset([crop()]); harvestPlanting('favas', {}, options(day1)); put(WATERED_STORAGE_KEY, { favas: '2026-10-01' });
  const old = exportFarmData(); feedMascot('fava', options(day2)); put(WATERED_STORAGE_KEY, { favas: '2026-10-02' });
  importFarmData(old, false);
  const exported = exportFarmData();
  assert.equal(exported.version, 5); assert.equal(exported.lastWatered.favas, '2026-10-02');
  assert.equal(getMascotView(exported.mascot, options(day2)).inventory[0].quantity, 5);
  const merged = mergeFarmData(exported, old);
  assert.equal(getMascotView(merged.mascot, options(day2)).inventory[0].quantity, 5);
  assert.equal(merged.plantings[0].status, 'Colhida');
  assert.deepEqual(mergeWateredMaps({ a: '2026-10-02' }, { a: '2026-10-01', b: '2026-10-02', c: '2026-02-31' }), { a: '2026-10-02', b: '2026-10-02' });
});

test('Google account switches isolate and restore mascot history and watered map', () => {
  reset([crop()]); localAuth.loginWithGoogleUser({ id: 'account-A', email: 'a@example.test' }, 'fake-A');
  harvestPlanting('favas', {}, options(day1)); feedMascot('fava', options(day2)); put(WATERED_STORAGE_KEY, { favas: '2026-10-02' });
  localAuth.loginWithGoogleUser({ id: 'account-B', email: 'b@example.test' }, 'fake-B');
  assert.equal(localStorage.getItem(MASCOT_STORAGE_KEY), null); assert.equal(localStorage.getItem(WATERED_STORAGE_KEY), null);
  localAuth.loginWithGoogleUser({ id: 'account-A', email: 'a@example.test' }, 'fake-A2');
  assert.equal(getMascotView(readMascotState(), options(day2)).inventory[0].quantity, 5);
  assert.equal(store(WATERED_STORAGE_KEY).favas, '2026-10-02');
});
