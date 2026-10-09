import test from 'node:test';
import assert from 'node:assert/strict';
import { precipitationIntervals, sumPrecipitation, normalizeForecast, getWeatherAdvice, weatherCoordinates, localDateKey, loadWeather, WEATHER_CACHE_MS } from '../src/lib/weather.js';

const start = Date.parse('2026-10-08T00:00:00Z');
const prefs = { latitude: 38.725, longitude: -9.144, weatherEnabled: true, timeZone: 'Europe/Lisbon', growingEnvironment: 'outdoor' };
function fixture({ temperature = 23, rain = 1, wind = 2 } = {}) {
  return { properties: { meta: { updated_at: new Date(start).toISOString() }, timeseries: Array.from({ length: 145 }, (_, index) => ({
    time: new Date(start + index * WEATHER_CACHE_MS).toISOString(),
    data: { instant: { details: { air_temperature: temperature, wind_speed: wind } }, next_1_hours: { details: { precipitation_amount: rain }, summary: { symbol_code: 'rain' } }, next_6_hours: { details: { precipitation_amount: rain * 6 }, summary: { symbol_code: 'rain' } } },
  })) } };
}
function forecast(options = {}) { return normalizeForecast(fixture(options), { preferences: prefs, now: start }); }

test('current pet rain uses only the hour containing now, never a future six-hour forecast', () => {
  const weather = normalizeForecast(fixture(), { preferences: prefs, now: start + WEATHER_CACHE_MS / 2 });
  assert.equal(weather.currentRain.start, new Date(start).toISOString());
  assert.equal(weather.currentRain.precipitationMm, 1);
  assert.equal(weather.currentRain.estimated, true);
  const payload = fixture();
  payload.properties.timeseries = payload.properties.timeseries.slice(1);
  assert.equal(normalizeForecast(payload, { preferences: prefs, now: start }).currentRain, null);
  const onlySixHours = fixture();
  delete onlySixHours.properties.timeseries[0].data.next_1_hours;
  assert.equal(normalizeForecast(onlySixHours, { preferences: prefs, now: start }).currentRain, null);
});

test('hourly rain and its overlapping six-hour aggregates are never counted twice', () => {
  const intervals = precipitationIntervals(fixture().properties.timeseries);
  assert.equal(sumPrecipitation(intervals, start, 6).precipitationMm, 6);
  assert.equal(sumPrecipitation(intervals, start, 24).precipitationMm, 24);
});

test('six-hour accumulations fill only their own intervals; gaps remain unknown', () => {
  const intervals = [0, 6, 12, 18].map(hour => ({ start: start + hour * WEATHER_CACHE_MS, end: start + (hour + 6) * WEATHER_CACHE_MS, hours: 6, amount: 3 }));
  assert.deepEqual(sumPrecipitation(intervals, start, 24).precipitationMm, 12);
  const gap = sumPrecipitation(intervals.slice(1), start, 24);
  assert.equal(gap.coverageHours, 18);
  assert.equal(gap.complete, false);
  assert.equal(sumPrecipitation([], start, 6).precipitationMm, null);
});

test('forecasts group by the saved local timezone and require three covered days', () => {
  const weather = normalizeForecast(fixture(), { preferences: { ...prefs, timeZone: 'America/Los_Angeles' }, now: start });
  assert.equal(weather.days[0].date, '2026-10-07');
  assert.ok(weather.days.filter(day => !day.isPartial).length >= 3);
  assert.throws(() => normalizeForecast({ properties: { ...fixture().properties, timeseries: fixture().properties.timeseries.slice(0, 20) } }, { preferences: prefs, now: start }), /incomplete_forecast/);
  assert.equal(localDateKey(new Date('2026-10-08T01:00:00Z'), 'America/Los_Angeles'), '2026-10-07');
});

test('rain may prompt a soil check outdoors, but never postpones watering in a greenhouse or container', () => {
  const weather = forecast();
  assert.ok(getWeatherAdvice(weather, prefs, { now: start }).some(item => item.kind === 'rain'));
  for (const growingEnvironment of ['greenhouse', 'container']) {
    const advice = getWeatherAdvice(weather, { ...prefs, growingEnvironment }, { now: start });
    assert.equal(advice.some(item => item.kind === 'rain'), false);
    assert.ok(advice.some(item => item.kind === 'shelteredRain'));
  }
  assert.equal(getWeatherAdvice(forecast({ rain: 0.1 }), prefs, { now: start }).some(item => item.kind === 'rain'), false);
});

test('heat changes checks at 30/35°C; completed watering and stale/offline data produce no advice', () => {
  assert.equal(getWeatherAdvice(forecast({ temperature: 29 }), prefs, { now: start }).some(item => item.kind === 'heat'), false);
  assert.equal(getWeatherAdvice(forecast({ temperature: 30 }), prefs, { now: start }).find(item => item.kind === 'heat').severity, 'info');
  assert.equal(getWeatherAdvice(forecast({ temperature: 35 }), prefs, { now: start }).find(item => item.kind === 'heat').severity, 'warning');
  assert.deepEqual(getWeatherAdvice(forecast(), prefs, { now: start, wateredToday: true }), []);
  assert.deepEqual(getWeatherAdvice(forecast(), prefs, { now: start + WEATHER_CACHE_MS }), []);
  assert.deepEqual(getWeatherAdvice({ ...forecast(), offline: true }, prefs, { now: start }), []);
  assert.deepEqual(getWeatherAdvice({ ...forecast(), isStale: true }, prefs, { now: start }), []);
});

test('frost and wind are explicit prudential advice, not precipitation probabilities', () => {
  const weather = forecast({ temperature: 0, wind: 13 });
  const advice = getWeatherAdvice(weather, prefs, { now: start });
  assert.ok(advice.some(item => item.kind === 'frost'));
  assert.ok(advice.some(item => item.kind === 'wind'));
  assert.equal('precipitationProbability' in weather.next6h, false);
});

test('coordinates are validated and rounded before requests', () => {
  assert.deepEqual(weatherCoordinates(prefs), { latitude: 38.73, longitude: -9.14 });
  assert.equal(weatherCoordinates({ latitude: null, longitude: 1 }), null);
  assert.equal(weatherCoordinates({ latitude: 91, longitude: 1 }), null);
});

test('concurrent requests are deduplicated and respect a later Expires header', async () => {
  let calls = 0;
  let seenUrl;
  let seenOptions;
  const fetchImpl = async (url, options) => {
    calls++; seenUrl = url; seenOptions = options;
    await new Promise(resolve => setTimeout(resolve, 5));
    return { ok: true, headers: { get: () => new Date(start + 2 * WEATHER_CACHE_MS).toUTCString() }, json: async () => fixture() };
  };
  const [first, second] = await Promise.all([loadWeather(prefs, { now: start, fetchImpl }), loadWeather(prefs, { now: start, fetchImpl })]);
  assert.equal(calls, 1);
  assert.deepEqual(first, second);
  assert.ok(seenUrl.endsWith('?lat=38.73&lon=-9.14'));
  assert.deepEqual(Object.keys(seenOptions), ['signal']);
  await loadWeather(prefs, { now: start + 1.5 * WEATHER_CACHE_MS, fetchImpl });
  assert.equal(calls, 1);
  const fallback = await loadWeather(prefs, { now: start + 3 * WEATHER_CACHE_MS, fetchImpl: async () => { throw new Error('network'); } });
  assert.equal(fallback.isStale, true);
  assert.equal(fallback.adviceAllowed, false);
});
