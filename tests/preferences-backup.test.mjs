import test from 'node:test';
import assert from 'node:assert/strict';
import { REGIONAL_STORAGE_KEY, writeRegionalPreferences, readRegionalPreferences, sanitizeRegionalPreferences } from '../src/lib/regionalPreferences.js';
import { APPEARANCE_STORAGE_KEY, writeAppearance, readAppearance, sanitizeAppearance } from '../src/lib/appearance.js';
import { exportFarmData, importFarmData, mergeFarmData, localAuth, localEntities } from '../src/lib/localStorageStore.js';
import { computeDailyTasks } from '../src/lib/dailyTasks.js';
import { normalizeForecast, WEATHER_CACHE_MS } from '../src/lib/weather.js';
import { sanitizeFarmProfile } from '../src/lib/farmProfile.js';
const values = new Map();
globalThis.localStorage = { getItem:key=>values.get(key)??null, setItem:(key,value)=>values.set(key,String(value)), removeItem:key=>values.delete(key), clear:()=>values.clear() };
const prefs = { onboarded:true, countryCode:'PT', region:'Lisboa', language:'pt-PT', timeZone:'Europe/Lisbon', latitude:38.72, longitude:-9.14, weatherEnabled:true, climate:'mediterranean', growingEnvironment:'outdoor' };
test('new backups include saved profile, regional choices, appearance and planting environment, but no credentials',async()=>{
  values.clear(); writeRegionalPreferences(prefs); writeAppearance({theme:'ocean',texture:'leaves',fontSize:'large'});
  await localAuth.updateMe({farm_name:'Horta de teste',experience_years:7,farmer_type:'Amador'});
  await localEntities.Planting.create({plant_name:'Tomate',growing_environment:'container'});
  localStorage.setItem('hortaviva_gemini_api_key','test-secret-not-exported');
  localStorage.setItem('hortaviva_google_access_token','test-secret-not-exported');
  const backup=exportFarmData();
  assert.equal(backup.version,4); assert.equal(backup.user.farm_name,'Horta de teste');
  assert.equal(backup.regionalPreferences.countryCode,'PT'); assert.equal(backup.appearance.theme,'ocean');
  assert.equal(backup.plantings[0].growing_environment,'container'); assert.ok(!JSON.stringify(backup).includes('test-secret-not-exported'));
  values.clear(); importFarmData(backup,false);
  assert.equal(readRegionalPreferences().region,'Lisboa'); assert.equal(readAppearance().texture,'leaves');
  assert.equal((await localAuth.me()).experience_years,7);
});
test('legacy backups never erase modern preferences and newer profile edits survive old remote copies',()=>{
  const local=exportFarmData(); const remote={version:3,user:{farm_name:'Antiga'},plantings:[],myAnimals:[],reminders:[]};
  const merged=mergeFarmData(local,remote);
  assert.equal(merged.user.farm_name,'Horta de teste'); assert.equal(merged.appearance.theme,'ocean');
  importFarmData(remote,false); assert.equal(readAppearance().theme,'ocean'); assert.equal(readRegionalPreferences().region,'Lisboa');
});
test('settings conflict resolution follows edit timestamps in both directions',()=>{
  const older={theme:'forest',updatedAt:'2026-10-01T10:00:00Z'},newer={theme:'sunset',updatedAt:'2026-10-08T10:00:00Z'};
  assert.equal(mergeFarmData({appearance:older},{appearance:newer}).appearance.theme,'sunset');
  assert.equal(mergeFarmData({appearance:newer},{appearance:older}).appearance.theme,'sunset');
});
test('invalid settings and profile values are constrained before persistence',()=>{
  assert.equal(sanitizeRegionalPreferences({...prefs,latitude:200}).weatherEnabled,false);
  assert.equal(sanitizeRegionalPreferences({...prefs,timeZone:'invalid/zone'}).timeZone,Intl.DateTimeFormat().resolvedOptions().timeZone);
  assert.equal(sanitizeAppearance({theme:'url(evil)',texture:'script',fontSize:'99'}).theme,'forest');
  assert.equal(sanitizeFarmProfile({farm_name:'  Test  ',experience_years:500}).experience_years,100);
  assert.equal(sanitizeFarmProfile({farm_name:'  Test  '}).farm_name,'Test');
});
test('rain advice respects each planting instead of the farm default and completed watering stays complete',()=>{
  values.clear(); const now=Date.parse('2026-10-08T00:00:00Z');
  const payload={properties:{meta:{updated_at:new Date(now).toISOString()},timeseries:Array.from({length:145},(_,index)=>({time:new Date(now+index*WEATHER_CACHE_MS).toISOString(),data:{instant:{details:{air_temperature:20,wind_speed:1}},next_1_hours:{details:{precipitation_amount:1},summary:{symbol_code:'rain'}}}}))}};
  const weather=normalizeForecast(payload,{preferences:prefs,now});
  const plantings=['outdoor','container','greenhouse','indoor'].map(env=>({id:env,plant_name:'Tomate',growing_environment:env,planted_date:'2026-10-01'}));
  const result=computeDailyTasks({plantings,plants:[],preferences:prefs,weather,now:new Date(now)});
  assert.equal(result.rega.length,4);
  for(const task of result.rega) assert.equal(task.weatherAdvice.some(a=>a.kind==='rain'),task.plantingId==='outdoor');
  localStorage.setItem('hortaviva_plantings_watered',JSON.stringify({outdoor:'2026-10-08'}));
  const completed=computeDailyTasks({plantings,plants:[],preferences:prefs,weather,now:new Date(now)}).rega.find(item=>item.plantingId==='outdoor');
  assert.equal(completed.wateredToday,true); assert.equal(completed.weatherAdvice.length,0);
});
