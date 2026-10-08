// MET Norway Locationforecast; no key or non-simple request headers in the browser.
export const WEATHER_SOURCE = {
  name: 'MET Norway',
  url: 'https://www.met.no/en',
  license: 'https://creativecommons.org/licenses/by/4.0/',
};
export const WEATHER_CACHE_MS = 60 * 60 * 1000;
const API_URL = 'https://api.met.no/weatherapi/locationforecast/2.0/compact';
const CACHE_PREFIX = 'hortaviva_weather_v1_';
const pending = new Map();
const memoryCache = new Map();
const attempts = new Map();
const dateFormatters = new Map();

function finite(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

export function weatherCoordinates(preferences = {}) {
  const { latitude, longitude } = preferences;
  if (!finite(latitude) || !finite(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return null;
  return { latitude: Math.round(latitude * 100) / 100, longitude: Math.round(longitude * 100) / 100 };
}

export function localDateKey(date = new Date(), timeZone = 'UTC') {
  let parts;
  try {
    if (!dateFormatters.has(timeZone)) dateFormatters.set(timeZone, new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }));
    parts = dateFormatters.get(timeZone).formatToParts(date);
  } catch {
    parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'UTC', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  }
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)?.value).join('-');
}

export function precipitationIntervals(timeseries = []) {
  const intervals = [];
  for (const item of timeseries) {
    const start = Date.parse(item.time);
    if (!Number.isFinite(start)) continue;
    for (const hours of [1, 6, 12]) {
      const amount = item.data?.[`next_${hours}_hours`]?.details?.precipitation_amount;
      if (finite(amount) && amount >= 0) intervals.push({ start, end: start + hours * WEATHER_CACHE_MS, hours, amount });
    }
  }
  return intervals.sort((a, b) => a.start - b.start || a.hours - b.hours);
}

// Only whole, non-overlapping forecast intervals are summed. Missing hours are
// exposed as coverage, never silently converted into zero rainfall.
export function sumPrecipitation(intervals, start, hours) {
  const from = Number(start);
  const end = from + hours * WEATHER_CACHE_MS;
  let cursor = from;
  let amount = 0;
  let coveredMs = 0;
  while (cursor < end) {
    const candidates = intervals.filter(interval => interval.start >= cursor && interval.end <= end).sort((a, b) => a.start - b.start || a.hours - b.hours);
    if (!candidates.length) break;
    const firstStart = candidates[0].start;
    const interval = candidates.filter(candidate => candidate.start === firstStart).sort((a, b) => a.hours - b.hours)[0];
    amount += interval.amount;
    coveredMs += interval.end - interval.start;
    cursor = interval.end;
  }
  const coverageHours = coveredMs / WEATHER_CACHE_MS;
  return { precipitationMm: coveredMs ? Math.round(amount * 10) / 10 : null, coverageHours, complete: coverageHours >= hours - 0.01, start: new Date(from).toISOString(), hours };
}

function weatherError(code) {
  const error = new Error(code);
  error.code = code;
  return error;
}

export function normalizeForecast(payload, { preferences = {}, now = Date.now(), fetchedAt = now, expiresAt = fetchedAt + WEATHER_CACHE_MS } = {}) {
  const rows = payload?.properties?.timeseries;
  if (!Array.isArray(rows)) throw weatherError('invalid_forecast');
  const timeZone = preferences.timeZone || 'UTC';
  const current = Number(now);
  const usable = rows.filter(row => Number.isFinite(Date.parse(row.time)) && Date.parse(row.time) >= current - WEATHER_CACHE_MS).sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
  const daily = new Map();
  for (const row of usable) {
    const details = row.data?.instant?.details || {};
    if (!finite(details.air_temperature)) continue;
    const time = Date.parse(row.time);
    const date = localDateKey(new Date(time), timeZone);
    const day = daily.get(date) || { date, samples: [], symbol: null, maxWind: null, maxGust: null };
    day.samples.push({ time, temperature: details.air_temperature });
    if (finite(details.wind_speed)) day.maxWind = Math.max(day.maxWind ?? 0, details.wind_speed);
    if (finite(details.wind_speed_of_gust)) day.maxGust = Math.max(day.maxGust ?? 0, details.wind_speed_of_gust);
    day.symbol ||= row.data?.next_6_hours?.summary?.symbol_code || row.data?.next_1_hours?.summary?.symbol_code || null;
    daily.set(date, day);
  }
  const intervals = precipitationIntervals(rows);
  const days = Array.from(daily.values()).map(day => {
    const first = day.samples[0].time;
    const last = day.samples.at(-1).time;
    const coverageHours = (last - first) / WEATHER_CACHE_MS;
    const dayIntervals = intervals.filter(interval => localDateKey(new Date(interval.start), timeZone) === day.date && localDateKey(new Date(interval.end - 1), timeZone) === day.date);
    const rain = sumPrecipitation(dayIntervals, first, coverageHours + 1);
    return {
      date: day.date,
      minTemp: Math.min(...day.samples.map(sample => sample.temperature)),
      maxTemp: Math.max(...day.samples.map(sample => sample.temperature)),
      maxWind: day.maxWind,
      maxGust: day.maxGust,
      symbol: day.symbol,
      coverageHours,
      isPartial: coverageHours < 18,
      precipitationMm: rain.precipitationMm,
      precipitationCoverageHours: rain.coverageHours,
    };
  }).filter(day => day.coverageHours >= 3);
  if (days.filter(day => !day.isPartial).length < 3) throw weatherError('incomplete_forecast');
  // Anchor rainfall to the next available forecast hour, avoiding fractions of
  // an accumulation interval and fabricated prorated rain amounts.
  const windowStart = usable.map(row => Date.parse(row.time)).find(time => time >= current);
  if (!Number.isFinite(windowStart)) throw weatherError('incomplete_forecast');
  const updatedAt = payload.properties.meta?.updated_at;
  const stale = current >= Number(expiresAt) || !Number.isFinite(Date.parse(updatedAt)) || current - Date.parse(updatedAt) > 12 * WEATHER_CACHE_MS;
  return {
    source: WEATHER_SOURCE,
    location: weatherCoordinates(preferences),
    timeZone,
    updatedAt: Number.isFinite(Date.parse(updatedAt)) ? updatedAt : new Date(fetchedAt).toISOString(),
    fetchedAt: new Date(fetchedAt).toISOString(),
    expiresAt: new Date(expiresAt).toISOString(),
    days,
    next6h: sumPrecipitation(intervals, windowStart, 6),
    next24h: sumPrecipitation(intervals, windowStart, 24),
    isStale: stale,
    offline: false,
    adviceAllowed: !stale,
  };
}

export function isWeatherUsable(weather, now = Date.now()) {
  return Boolean(weather && weather.adviceAllowed !== false && !weather.isStale && !weather.offline && Number.isFinite(Date.parse(weather.expiresAt)) && Number(now) < Date.parse(weather.expiresAt) && weather.days?.filter(day => !day.isPartial).length >= 3);
}

export function getWeatherAdvice(weather, preferences = {}, { now = Date.now(), wateredToday = false } = {}) {
  if (wateredToday || !isWeatherUsable(weather, now)) return [];
  const advice = [];
  const today = localDateKey(new Date(now), preferences.timeZone || weather.timeZone);
  const days = weather.days.filter(day => day.date >= today).slice(0, 2);
  const heat = Math.max(...days.map(day => day.maxTemp));
  const cold = Math.min(...days.map(day => day.minTemp));
  const wind = Math.max(...days.map(day => day.maxWind ?? 0));
  const gust = Math.max(...days.map(day => day.maxGust ?? 0));
  const environment = preferences.growingEnvironment || 'outdoor';
  const rain = [weather.next6h, weather.next24h].find(window => window?.complete && window.precipitationMm >= 5);
  if (rain && environment === 'outdoor') advice.push({ kind: 'rain', severity: 'info', titleKey: 'weather.rainTitle', bodyKey: 'weather.rainAdvice', vars: { mm: rain.precipitationMm, hours: rain.hours } });
  if (rain && environment !== 'outdoor') advice.push({ kind: 'shelteredRain', severity: 'info', titleKey: 'weather.shelteredTitle', bodyKey: environment === 'greenhouse' ? 'weather.greenhouseRainAdvice' : 'weather.containerRainAdvice', vars: {} });
  if (heat >= 30) advice.push({ kind: 'heat', severity: heat >= 35 ? 'warning' : 'info', titleKey: heat >= 35 ? 'weather.extremeHeatTitle' : 'weather.heatTitle', bodyKey: environment === 'greenhouse' ? 'weather.greenhouseHeatAdvice' : environment === 'container' ? 'weather.containerHeatAdvice' : 'weather.heatAdvice', vars: { temperature: Math.round(heat) } });
  if (cold <= 2) advice.push({ kind: 'frost', severity: 'warning', titleKey: 'weather.frostTitle', bodyKey: 'weather.frostAdvice', vars: { temperature: Math.round(cold) } });
  if (wind >= 12 || gust >= 17) advice.push({ kind: 'wind', severity: 'warning', titleKey: 'weather.windTitle', bodyKey: 'weather.windAdvice', vars: { speed: Math.round(Math.max(wind, gust) * 3.6) } });
  return advice;
}

function storageAvailable() {
  try { return typeof localStorage !== 'undefined' ? localStorage : null; } catch { return null; }
}

function cachedEntry(key) {
  if (memoryCache.has(key)) return memoryCache.get(key);
  try {
    const entry = JSON.parse(storageAvailable()?.getItem(CACHE_PREFIX + key) || 'null');
    if (entry?.payload && finite(entry.fetchedAt) && finite(entry.expiresAt)) { memoryCache.set(key, entry); return entry; }
  } catch { /* Private browsing or an old cache must not prevent loading. */ }
  return null;
}

function saveEntry(key, entry) {
  memoryCache.set(key, entry);
  try { storageAvailable()?.setItem(CACHE_PREFIX + key, JSON.stringify(entry)); } catch { /* Memory cache is sufficient for this session. */ }
}

function consumeRequest(request, signal) {
  request.users++;
  return new Promise((resolve, reject) => {
    let done = false;
    const finish = (callback, value) => {
      if (done) return;
      done = true;
      signal?.removeEventListener('abort', abort);
      request.users--;
      callback(value);
    };
    const abort = () => {
      finish(reject, new DOMException('Aborted', 'AbortError'));
      if (!request.users && !request.settled) request.controller.abort();
    };
    if (signal?.aborted) return abort();
    signal?.addEventListener('abort', abort, { once: true });
    request.promise.then(value => finish(resolve, value), error => finish(reject, error));
  });
}

export async function loadWeather(preferences, { signal, now = Date.now(), fetchImpl = globalThis.fetch } = {}) {
  const coordinates = weatherCoordinates(preferences);
  if (!preferences?.weatherEnabled || !coordinates) return null;
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
  const key = `${coordinates.latitude.toFixed(2)},${coordinates.longitude.toFixed(2)}`;
  const entry = cachedEntry(key);
  const normalize = (cache, offline = false, failed = false) => {
    const result = normalizeForecast(cache.payload, { preferences, now, fetchedAt: cache.fetchedAt, expiresAt: cache.expiresAt });
    return { ...result, offline, isStale: result.isStale || offline || failed, adviceAllowed: result.adviceAllowed && !offline && !failed };
  };
  if (pending.get(key)?.controller.signal.aborted) { pending.delete(key); attempts.delete(key); }
  const nextRequestAt = Math.max(entry?.nextRequestAt || 0, (attempts.get(key) || 0) + WEATHER_CACHE_MS);
  if (entry && now < nextRequestAt) return normalize(entry, typeof navigator !== 'undefined' && navigator.onLine === false);
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    if (entry) return normalize(entry, true);
    throw weatherError('offline');
  }
  if (!pending.has(key) && now < nextRequestAt) throw weatherError('retry_later');
  if (!pending.has(key)) {
    const controller = new AbortController();
    const request = { controller, users: 0, settled: false, promise: null };
    attempts.set(key, now);
    const timer = setTimeout(() => controller.abort(), 12000);
    const url = `${API_URL}?lat=${coordinates.latitude.toFixed(2)}&lon=${coordinates.longitude.toFixed(2)}`;
    request.promise = (async () => {
      try {
        const response = await fetchImpl(url, { signal: controller.signal });
        if (!response.ok) throw weatherError(response.status === 429 ? 'rate_limit' : 'unavailable');
        const payload = await response.json();
        const serverExpiry = Date.parse(response.headers.get('Expires'));
        const expiresAt = Number.isFinite(serverExpiry) ? serverExpiry : now + WEATHER_CACHE_MS;
        const updated = { payload, fetchedAt: now, expiresAt, nextRequestAt: Math.max(expiresAt, now + WEATHER_CACHE_MS) };
        normalize(updated);
        saveEntry(key, updated);
        return updated;
      } finally {
        clearTimeout(timer);
        request.settled = true;
        if (pending.get(key) === request) pending.delete(key);
        if (controller.signal.aborted && request.users === 0) attempts.delete(key);
      }
    })();
    pending.set(key, request);
  }
  try {
    const result = await consumeRequest(pending.get(key), signal);
    return normalize(result);
  } catch (error) {
    if (signal?.aborted) throw error;
    if (entry) return normalize(entry, typeof navigator !== 'undefined' && navigator.onLine === false, true);
    throw error.name === 'AbortError' ? weatherError('timeout') : error;
  }
}
