import { DEFAULT_PLANTS } from './plantsData.js';
import { readRegionalPreferences } from './regionalPreferences.js';
import { getLocalDateString } from './regionalClimate.js';
import { isWeatherUsable, weatherCoordinates, getWeatherAdvice } from './weather.js';

export const MASCOT_STORAGE_KEY = 'hortaviva_mascot_v1';
export const MASCOT_CHANGE_EVENT = 'hortaviva_mascot_changed';
export const WATERED_STORAGE_KEY = 'hortaviva_plantings_watered';
export const MASCOT_SPECIES = ['sprout', 'fox', 'bunny'];
export const MASCOT_ACCESSORIES = ['none', 'leaf', 'flower', 'hat', 'bow'];
export const HUNGER_PER_DAY = 20;
export const HYDRATION_REWARD_XP = 40;
const PLANTINGS_KEY = 'hortaviva_plantings';
const MAX_QUANTITY = 1000000;
const WATER_INTERVALS = { Abundante: 1, Moderada: 2, Pouca: 3 };
const EVOLUTION_LEVELS = [5, 10, 15, 20, 30, 40, 50, 70, 90, 110, 160, 210];
const DEFAULT_SETTINGS = { enabled: true, species: 'sprout', name: 'Viva', accessory: 'none', updatedAt: '' };
const clamp = (n, min = 0, max = 100) => Math.min(max, Math.max(min, Number(n) || 0));
const validDate = value => typeof value === 'string' && Number.isFinite(Date.parse(value));
const validDay = value => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && validDate(value + 'T00:00:00Z') && new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;
const positiveInt = value => value !== '' && value !== null && Number.isSafeInteger(Number(value)) && Number(value) > 0 && Number(value) <= MAX_QUANTITY;
const text = (value, max = 100) => typeof value === 'string' ? value.trim().slice(0, max) : '';
const normalized = value => text(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const stable = value => JSON.stringify(value);
const eventOrder = (a, b) => Date.parse(a.at) - Date.parse(b.at) || String(a.id).localeCompare(String(b.id));
const error = (code, message) => Object.assign(new Error(message), { code });
const iso = value => new Date(value ?? Date.now()).toISOString();
const localDay = (value, timeZone) => getLocalDateString(new Date(value), { timeZone });
const dayDistance = (a, b) => Math.max(0, Math.round((Date.parse(b + 'T00:00:00Z') - Date.parse(a + 'T00:00:00Z')) / 86400000) || 0);
const eventId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

export function sanitizeMascotSettings(value = {}) {
  return { enabled: value.enabled !== false, species: MASCOT_SPECIES.includes(value.species) ? value.species : 'sprout',
    name: text(value.name, 40) || 'Viva', accessory: MASCOT_ACCESSORIES.includes(value.accessory) ? value.accessory : 'none',
    updatedAt: validDate(value.updatedAt) ? value.updatedAt : '' };
}

export function getFoodInfo(plantName, emoji = '🌱') {
  const name = text(plantName) || 'Cultura';
  const norm = normalized(name);
  const key = norm.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'cultura';
  // Game points only: these are not nutritional or animal-feeding advice.
  const nutrition = /fava/.test(norm) ? 3 : /feijao/.test(norm) ? 5 : /abobora/.test(norm) ? 8
    : /milho|batata/.test(norm) ? 6 : /tomat|cenoura|couve|piment/.test(norm) ? 4
    : /ervilha|morango|maca|pera/.test(norm) ? 3 : 2;
  return { key, plantName: name, emoji: text(emoji, 16) || '🌱', nutrition };
}

export function createMascotState({ now = new Date() } = {}) {
  return { version: 1, createdAt: iso(now), settings: { ...DEFAULT_SETTINGS }, harvests: {}, feedings: {}, rewards: {} };
}

export function sanitizeMascotState(raw, { now = new Date() } = {}) {
  const base = createMascotState({ now });
  if (!raw || typeof raw !== 'object') return base;
  const harvests = {}, feedings = {}, rewards = {};
  for (const item of Object.values(raw.harvests || {})) {
    if (!item || !text(item.plantingId) || !positiveInt(item.quantity) || !validDate(item.at)) continue;
    const id = `harvest:${text(item.plantingId, 200)}`;
    const food = getFoodInfo(item.plantName, item.emoji);
    harvests[id] = { id, plantingId: text(item.plantingId, 200), foodKey: food.key, plantName: food.plantName,
      emoji: food.emoji, nutrition: food.nutrition, quantity: Number(item.quantity), at: iso(item.at),
      localDate: validDay(item.localDate) ? item.localDate : localDay(item.at, item.timeZone || 'UTC'),
      timeZone: text(item.timeZone, 80) || 'UTC', quantityData: sanitizeQuantity(item.quantityData || { plant_count: Number(item.quantity) }) };
  }
  for (const item of Object.values(raw.feedings || {})) {
    if (!item || !text(item.id, 200) || !validDate(item.at) || !text(item.harvestId, 220) || !Number.isSafeInteger(item.unitIndex) || item.unitIndex < 0 || item.unitIndex >= MAX_QUANTITY) continue;
    const id = text(item.id, 200);
    feedings[id] = { id, at: iso(item.at), harvestId: text(item.harvestId, 220), unitIndex: item.unitIndex };
  }
  for (const item of Object.values(raw.rewards || {})) {
    if (!item || !validDate(item.at) || !validDay(item.localDate)) continue;
    const id = `hydration:${item.localDate}`;
    rewards[id] = { id, localDate: item.localDate, at: iso(item.at), timeZone: text(item.timeZone, 80) || 'UTC',
      source: item.source === 'rain' ? 'rain' : 'care', plantingIds: [...new Set((Array.isArray(item.plantingIds) ? item.plantingIds : []).map(id => text(id, 200)).filter(Boolean))].sort() };
  }
  return { version: 1, createdAt: validDate(raw.createdAt) ? iso(raw.createdAt) : base.createdAt,
    settings: sanitizeMascotSettings(raw.settings), harvests, feedings, rewards };
}

function unionEvents(a, b) {
  const result = { ...a };
  for (const [id, item] of Object.entries(b)) {
    const existing = result[id];
    if (!existing || eventOrder(item, existing) < 0 || (eventOrder(item, existing) === 0 && stable(item) < stable(existing))) result[id] = item;
  }
  return Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)));
}

export function mergeMascotStates(first, second) {
  if (!first && !second) return null;
  if (!first) return sanitizeMascotState(second);
  if (!second) return sanitizeMascotState(first);
  const a = sanitizeMascotState(first), b = sanitizeMascotState(second);
  const ta = Date.parse(a.settings.updatedAt) || 0, tb = Date.parse(b.settings.updatedAt) || 0;
  const settings = tb > ta || (tb === ta && stable(b.settings) < stable(a.settings)) ? b.settings : a.settings;
  return { version: 1, createdAt: a.createdAt < b.createdAt ? a.createdAt : b.createdAt, settings,
    harvests: unionEvents(a.harvests, b.harvests), feedings: unionEvents(a.feedings, b.feedings), rewards: unionEvents(a.rewards, b.rewards) };
}

function saveState(state, { notify = true } = {}) {
  if (!globalThis.localStorage) throw error('storage_unavailable', 'Não foi possível guardar a mascote neste dispositivo.');
  const raw = globalThis.localStorage.getItem(MASCOT_STORAGE_KEY);
  let current = null;
  if (raw) {
    try { current = JSON.parse(raw); if (current?.version !== 1) throw new Error(); }
    catch { throw error('invalid_mascot_state', 'Os dados da mascote não puderam ser lidos. Mantivemos a cópia existente.'); }
  }
  const next = mergeMascotStates(current, state);
  globalThis.localStorage.setItem(MASCOT_STORAGE_KEY, JSON.stringify(next));
  if (notify && typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(MASCOT_CHANGE_EVENT, { detail: { state: next } }));
    window.dispatchEvent(new CustomEvent('hortaviva_data_changed', { detail: { storageKey: MASCOT_STORAGE_KEY } }));
  }
  return next;
}

export function readMascotState({ now = new Date() } = {}) {
  const raw = globalThis.localStorage?.getItem(MASCOT_STORAGE_KEY);
  if (!raw) return saveState(createMascotState({ now }));
  try { const parsed = JSON.parse(raw); if (parsed?.version !== 1) throw new Error(); return sanitizeMascotState(parsed, { now }); }
  catch { throw error('invalid_mascot_state', 'Os dados da mascote não puderam ser lidos. Mantivemos a cópia existente.'); }
}

export function writeMascotSettings(settings, { now = new Date() } = {}) {
  const state = readMascotState({ now });
  const updatedAt = iso(Math.max(Number(new Date(now)), (Date.parse(state.settings.updatedAt) || 0) + 1));
  return saveState({ ...state, settings: sanitizeMascotSettings({ ...state.settings, ...settings, updatedAt }) });
}

export function hasHarvest(plantingId, state = readMascotState()) {
  return Boolean(state?.harvests?.[`harvest:${plantingId}`]);
}

function acceptedFeedings(state) {
  const claims = new Set(), accepted = [];
  for (const event of Object.values(state.feedings).sort(eventOrder)) {
    const harvest = state.harvests[event.harvestId];
    const unit = `${event.harvestId}:${event.unitIndex}`;
    if (!harvest || event.unitIndex >= harvest.quantity || Date.parse(event.at) < Date.parse(harvest.at) || claims.has(unit)) continue;
    claims.add(unit); accepted.push({ ...event, nutrition: harvest.nutrition, unit });
  }
  return { accepted, claims };
}

export function getMascotProgression(totalXp = 0) {
  const value = Number(totalXp);
  const total = Number.isFinite(value) ? Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, Math.floor(value))) : 0;
  const level = Math.floor(total / 100) + 1;
  const extraStages = level >= 210 ? Math.floor((level - 210) / 100) : 0;
  const evolutionStage = EVOLUTION_LEVELS.filter(value => value <= level).length + extraStages;
  const nextEvolutionLevel = level >= 210 ? 210 + (extraStages + 1) * 100 : EVOLUTION_LEVELS.find(value => value > level);
  return { level, xp: total % 100, totalXp: total, xpToNextLevel: 100 - total % 100,
    progress: (total % 100) / 100, evolutionStage, nextEvolutionLevel };
}

export function getMascotView(input, { now = new Date(), timeZone = readRegionalPreferences().timeZone } = {}) {
  const state = sanitizeMascotState(input, { now });
  const nowMs = Number(new Date(now)), today = localDay(now, timeZone);
  const { accepted, claims } = acceptedFeedings(state);
  let fullness = 100, cursor = state.createdAt, feedingXp = 0;
  const feedingGains = {};
  for (const event of accepted) {
    if (Date.parse(event.at) > nowMs) continue;
    fullness = clamp(fullness - HUNGER_PER_DAY * dayDistance(localDay(cursor, timeZone), localDay(event.at, timeZone)));
    const gained = Math.min(event.nutrition, 100 - fullness);
    fullness = clamp(fullness + gained); feedingXp += gained * 5; feedingGains[event.id] = gained;
    if (event.at > cursor) cursor = event.at;
  }
  fullness = clamp(fullness - HUNGER_PER_DAY * dayDistance(localDay(cursor, timeZone), today));
  const inventoryMap = new Map();
  for (const harvest of Object.values(state.harvests).sort(eventOrder)) {
    let consumed = 0;
    for (const event of accepted) if (event.harvestId === harvest.id) consumed++;
    const quantity = Math.max(0, harvest.quantity - consumed);
    const item = inventoryMap.get(harvest.foodKey) || { key: harvest.foodKey, plantName: harvest.plantName, emoji: harvest.emoji, nutrition: harvest.nutrition, quantity: 0 };
    item.quantity += quantity; inventoryMap.set(item.key, item);
  }
  const rewards = Object.values(state.rewards).filter(event => Date.parse(event.at) <= nowMs);
  const dailyRewardClaimed = rewards.some(event => event.localDate === today);
  return { settings: state.settings, fullness, inventory: [...inventoryMap.values()].filter(item => item.quantity > 0).sort((a, b) => a.key.localeCompare(b.key)),
    ...getMascotProgression(feedingXp + rewards.length * HYDRATION_REWARD_XP), dailyRewardClaimed, dailyReward: dailyRewardClaimed,
    daysWithoutFood: dayDistance(localDay(cursor, timeZone), today), localDate: today,
    feedingGains, consumedUnits: claims.size, harvestCount: Object.keys(state.harvests).length };
}

function sanitizeQuantity(data = {}) {
  const columns = data.columns ?? data.cols;
  if (data.quantity_method === 'grid' || (data.quantity_method !== 'count' && (data.rows !== undefined || columns !== undefined))) {
    if (!positiveInt(data.rows) || !positiveInt(columns) || !positiveInt(Number(data.rows) * Number(columns))) return null;
    return { quantity_method: 'grid', rows: Number(data.rows), columns: Number(columns), plant_count: Number(data.rows) * Number(columns) };
  }
  return positiveInt(data.plant_count) ? { quantity_method: 'count', plant_count: Number(data.plant_count) } : null;
}

export function applyHarvestLedgerToPlantings(plantings, state) {
  const harvests = state?.harvests || {};
  return (Array.isArray(plantings) ? plantings : []).map(planting => {
    const harvest = harvests[`harvest:${planting?.id}`];
    return harvest ? { ...planting, ...harvest.quantityData, status: 'Colhida', actual_harvest_date: harvest.localDate,
      harvest_event_id: harvest.id, updated_date: harvest.at } : planting;
  });
}

function storedPlantings() {
  let parsed;
  try { parsed = JSON.parse(globalThis.localStorage?.getItem(PLANTINGS_KEY) || '[]'); }
  catch { throw error('invalid_farm_data', 'Não foi possível ler as plantações guardadas.'); }
  if (!Array.isArray(parsed)) throw error('invalid_farm_data', 'Não foi possível ler as plantações guardadas.');
  return parsed;
}

export function harvestPlanting(idOrPlanting, quantityData = {}, { now = new Date(), timeZone = readRegionalPreferences().timeZone } = {}) {
  const id = typeof idOrPlanting === 'string' ? idOrPlanting : idOrPlanting?.id;
  const plantings = storedPlantings();
  const planting = plantings.find(item => item.id === id);
  if (!planting) throw error('planting_not_found', 'A plantação já não existe na tua quinta.');
  const state = readMascotState({ now });
  const existing = state.harvests[`harvest:${id}`];
  if (existing) return { success: true, alreadyHarvested: true, quantity: existing.quantity, foodKey: existing.foodKey,
    planting: applyHarvestLedgerToPlantings([planting], state)[0], state, view: getMascotView(state, { now, timeZone }) };
  if (!text(planting.plant_name) || !validDay(planting.planted_date) || planting.planted_date > localDay(now, timeZone)) {
    throw error('planting_not_started', 'Só podes registar uma colheita de uma cultura já plantada na tua quinta.');
  }
  const quantity = sanitizeQuantity({ ...planting, ...quantityData });
  if (!quantity) throw error('quantity_required', 'Indica o número de plantas, ou linhas e colunas válidas, antes de registar a colheita.');
  const food = getFoodInfo(planting.plant_name, planting.plant_emoji);
  const harvest = { id: `harvest:${id}`, plantingId: id, foodKey: food.key, plantName: food.plantName,
    emoji: food.emoji, nutrition: food.nutrition, quantity: quantity.plant_count, quantityData: quantity,
    at: iso(now), localDate: localDay(now, timeZone), timeZone };
  // One authoritative write commits the stock and harvested status together.
  // The farming list is a recoverable projection of this immutable event.
  const next = saveState({ ...state, harvests: { ...state.harvests, [harvest.id]: harvest } });
  const projected = applyHarvestLedgerToPlantings(plantings, next);
  let projectionPending = false;
  try { globalThis.localStorage.setItem(PLANTINGS_KEY, JSON.stringify(projected)); }
  catch { projectionPending = true; }
  return { success: true, alreadyHarvested: false, quantity: harvest.quantity, foodKey: food.key,
    planting: projected.find(item => item.id === id), state: next, projectionPending, view: getMascotView(next, { now, timeZone }) };
}

export function feedMascot(key, { now = new Date(), timeZone = readRegionalPreferences().timeZone } = {}) {
  const state = readMascotState({ now }), view = getMascotView(state, { now, timeZone });
  const rejected = reason => ({ success: false, gained: 0, gainedXp: 0, reason, fullness: view.fullness, state, view });
  if (!state.settings.enabled) return rejected('disabled');
  if (view.fullness >= 100) return rejected('full');
  const { claims } = acceptedFeedings(state);
  let selected;
  for (const harvest of Object.values(state.harvests).sort(eventOrder)) {
    if (harvest.foodKey !== key || Date.parse(harvest.at) > Number(new Date(now))) continue;
    for (let unitIndex = 0; unitIndex < harvest.quantity; unitIndex++) {
      if (!claims.has(`${harvest.id}:${unitIndex}`)) { selected = { harvestId: harvest.id, unitIndex }; break; }
    }
    if (selected) break;
  }
  if (!selected) return rejected('empty');
  const event = { id: `feeding:${eventId()}`, at: iso(now), ...selected };
  const next = saveState({ ...state, feedings: { ...state.feedings, [event.id]: event } });
  const nextView = getMascotView(next, { now, timeZone });
  const gained = Math.max(0, nextView.fullness - view.fullness);
  return { success: true, gained, gainedXp: gained * 5, fullness: nextView.fullness, state: next, view: nextView };
}

export function sanitizeWateredMap(raw) {
  return Object.fromEntries(Object.entries(raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {}).filter(([id, date]) => text(id, 200) && validDay(date)));
}

export function mergeWateredMaps(first, second) {
  const result = sanitizeWateredMap(first);
  for (const [id, date] of Object.entries(sanitizeWateredMap(second))) if (!result[id] || date > result[id]) result[id] = date;
  return result;
}

export function getMascotHydration({ plantings = [], plants = [], preferences = {}, weather = null, lastWatered = {}, now = new Date() } = {}) {
  const active = plantings.filter(item => item?.id && item.status !== 'Colhida');
  const today = localDay(now, preferences.timeZone || 'UTC');
  if (!active.length) return { hydration: 0, activeCount: 0, caredForCount: 0, dueCount: 0, rainApplied: false, rainEstimated: false, source: 'none', reason: 'no_active_crops', complete: false };
  const watered = sanitizeWateredMap(lastWatered);
  const instant = Number(new Date(now));
  const selectedCoordinates = weatherCoordinates(preferences), forecastCoordinates = weatherCoordinates(weather?.location || {});
  const matchingLocation = selectedCoordinates && forecastCoordinates && selectedCoordinates.latitude === forecastCoordinates.latitude && selectedCoordinates.longitude === forecastCoordinates.longitude;
  const usableWeather = preferences.weatherEnabled === true && matchingLocation && isWeatherUsable(weather, instant);
  const caredForCount = active.filter(item => {
    const plant = plants.find(plant => plant.name === item.plant_name);
    const interval = WATER_INTERVALS[plant?.water_requirements] || 2;
    // Planting a crop schedules future care; it is not evidence of watering.
    const last = watered[item.id];
    const environment = item.growing_environment || preferences.growingEnvironment || 'outdoor';
    const heatNeedsCheck = usableWeather && environment !== 'indoor' && last !== today && getWeatherAdvice(weather,
      { ...preferences, growingEnvironment: environment }, { now: instant, wateredToday: false }).some(advice => advice.kind === 'heat');
    return validDay(last) && last <= today && dayDistance(last, today) < interval && !heatNeedsCheck;
  }).length;
  const rain = weather?.currentRain;
  const rainApplied = usableWeather && rain?.estimated === true && Date.parse(rain.start) <= instant && instant < Date.parse(rain.end)
    && Date.parse(rain.end) - Date.parse(rain.start) <= 60 * 60 * 1000
    && Number.isFinite(rain.precipitationMm) && rain.precipitationMm > 0 && /rain/.test(String(rain.symbol || ''));
  const allCaredFor = caredForCount === active.length;
  const hydration = rainApplied || allCaredFor ? 100 : Math.min(99, Math.round(caredForCount * 100 / active.length));
  return { hydration, activeCount: active.length, caredForCount, dueCount: active.length - caredForCount,
    rainApplied: Boolean(rainApplied), rainEstimated: Boolean(rainApplied), source: rainApplied ? 'rain' : 'care',
    reason: rainApplied ? 'current_rain_estimate' : hydration === 100 ? 'all_cared_for' : 'care_needed', complete: hydration === 100 };
}

export function claimHydrationReward(_hydration, { now = new Date(), timeZone, weather = null, preferences = readRegionalPreferences() } = {}) {
  const zone = timeZone || preferences.timeZone;
  const state = readMascotState({ now });
  const view = getMascotView(state, { now, timeZone: zone });
  const reject = reason => ({ success: false, gainedXp: 0, reason, state, view });
  if (!state.settings.enabled) return reject('disabled');
  if (state.rewards[`hydration:${localDay(now, zone)}`]) return reject('already_claimed');
  let watered;
  try { watered = JSON.parse(globalThis.localStorage?.getItem(WATERED_STORAGE_KEY) || '{}'); } catch { watered = {}; }
  const hydration = getMascotHydration({ plantings: applyHarvestLedgerToPlantings(storedPlantings(), state), plants: DEFAULT_PLANTS,
    preferences: { ...preferences, timeZone: zone }, weather, lastWatered: watered, now });
  if (!hydration.complete || !hydration.activeCount) return reject('care_incomplete');
  const localDate = localDay(now, zone);
  const reward = { id: `hydration:${localDate}`, at: iso(now), localDate, timeZone: zone, source: hydration.source,
    plantingIds: storedPlantings().filter(item => item.status !== 'Colhida').map(item => item.id).sort() };
  const next = saveState({ ...state, rewards: { ...state.rewards, [reward.id]: reward } });
  return { success: true, gainedXp: HYDRATION_REWARD_XP, hydration, state: next, view: getMascotView(next, { now, timeZone: zone }) };
}
