import test from 'node:test';
import assert from 'node:assert/strict';
import { localAuth, exportFarmData, importFarmData, GOOGLE_ACCOUNT_BACKUP_PREFIX, GOOGLE_ACCOUNT_OWNER_KEY } from '../src/lib/localStorageStore.js';

const A = { id: 'subject-a', email: 'a@example.test', name: 'Person A' };
const B = { id: 'subject-b', email: 'b@example.test', name: 'Person B' };
const keys = { user: 'hortaviva_current_user', plants: 'hortaviva_plantings', region: 'hortaviva_regional_preferences_v1', appearance: 'hortaviva_appearance_v1', token: 'hortaviva_google_access_token', google: 'hortaviva_google_user_info' };
const browser = new EventTarget();
globalThis.window = browser;
globalThis.CustomEvent ||= class CustomEvent extends Event { constructor(type, options = {}) { super(type); this.detail = options.detail; } };
const reset = () => {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key), key: i => [...values.keys()][i], get length() { return values.size; } };
  browser.localStorage = globalThis.localStorage;
  return values;
};
const put = (key, value) => localStorage.setItem(key, JSON.stringify(value));
const read = key => JSON.parse(localStorage.getItem(key) || 'null');
const region = code => ({ onboarded: true, countryCode: code, region: `Region ${code}`, language: 'en', climate: 'temperate', latitude: code === 'PT' ? 38 : -33, longitude: 10, timeZone: 'UTC' });

test('A to B starts safely empty; returning to A restores its profile, farm and settings', () => {
  const values = reset();
  localAuth.loginWithGoogleUser(A, 'test-token-A');
  put(keys.user, { ...read(keys.user), full_name: 'Custom name A', avatar_url: 'data:image/png;base64,test-avatar', farm_name: 'Farm A' });
  put(keys.plants, [{ id: 'plant-A', plant_name: 'Tomate' }]);
  put(keys.region, region('PT')); put(keys.appearance, { theme: 'ocean' });
  put('hortaviva_myanimals', [{ id: 'animal-A' }]);
  put('hortaviva_reminders', [{ id: 'reminder-A' }]);
  put('hortaviva_pro_subscription', { active: true, tier: 'pro', google_email: A.email });
  localStorage.setItem('hortaviva_gemini_api_key', 'test-only-api-key');
  localStorage.setItem(keys.token, 'test-token-A');
  localAuth.loginWithGoogleUser(B, 'test-token-B');
  assert.equal(read(keys.user).email, B.email);
  assert.deepEqual(exportFarmData().plantings, []);
  assert.equal(localStorage.getItem(keys.region), null);
  assert.equal(localStorage.getItem(keys.appearance), null);
  const snapshotA = [...values].find(([key]) => key.startsWith(GOOGLE_ACCOUNT_BACKUP_PREFIX));
  assert.ok(snapshotA);
  assert.doesNotMatch(snapshotA[1], /test-token-A|test-only-api-key|base44_access_token/);
  put(keys.plants, [{ id: 'plant-B' }]); put(keys.region, region('ZA'));
  localAuth.loginWithGoogleUser(A, 'test-token-A2');
  assert.deepEqual(read(keys.plants), [{ id: 'plant-A', plant_name: 'Tomate' }]);
  assert.equal(read(keys.region).countryCode, 'PT');
  assert.equal(read(keys.appearance).theme, 'ocean');
  assert.equal(read('hortaviva_myanimals')[0].id, 'animal-A');
  assert.equal(read('hortaviva_reminders')[0].id, 'reminder-A');
  assert.equal(read('hortaviva_pro_subscription').google_email, A.email);
  assert.equal(read(keys.user).full_name, 'Custom name A');
  assert.equal(read(keys.user).avatar_url, 'data:image/png;base64,test-avatar');
  localAuth.loginWithGoogleUser(B, 'test-token-B2');
  assert.deepEqual(read(keys.plants), [{ id: 'plant-B' }]);
  assert.equal(read(keys.region).countryCode, 'ZA');
});

test('custom profile name and photo survive auth reads and Drive imports', async () => {
  reset(); localAuth.loginWithGoogleUser(A, 'test-token-A'); put(keys.google, { ...A, picture: 'https://example.test/google-photo' });
  await localAuth.updateMe({ full_name: 'Chosen name', avatar_url: 'data:image/png;base64,chosen', farm_name: 'Chosen farm' });
  assert.equal((await localAuth.me()).full_name, 'Chosen name');
  const backup = exportFarmData();
  importFarmData(backup, false);
  assert.equal(read(keys.user).full_name, 'Chosen name');
  assert.equal(read(keys.user).avatar_url, 'data:image/png;base64,chosen');
  assert.equal(read(keys.user).email, A.email);
  localStorage.removeItem(keys.google);
});

test('a guest farm intentionally migrates to the first Google connection', () => {
  reset(); put(keys.user, { id: 'guest', farm_name: 'Guest farm' });
  put(keys.plants, [{ id: 'guest-plant' }]); put(keys.region, region('PT'));
  localAuth.loginWithGoogleUser(A, 'test-token');
  assert.equal(read(keys.user).farm_name, 'Guest farm');
  assert.equal(read(keys.plants)[0].id, 'guest-plant');
  assert.equal(read(keys.region).countryCode, 'PT');
});

test('logout preserves the source account and reconnecting another account does not migrate it', () => {
  reset(); localAuth.loginWithGoogleUser(A, 'test-token');
  put(keys.plants, [{ id: 'only-A' }]);
  localAuth.logout();
  assert.equal(read(GOOGLE_ACCOUNT_OWNER_KEY).identity, 'id:subject-a');
  localAuth.loginWithGoogleUser(B, 'test-token-B');
  assert.deepEqual(exportFarmData().plantings, []);
  localAuth.loginWithGoogleUser(A, 'test-token-A');
  assert.equal(read(keys.plants)[0].id, 'only-A');
});

test('storage quota failure aborts a switch before clearing the source farm', () => {
  reset(); localAuth.loginWithGoogleUser(A, 'test-token'); put(keys.plants, [{ id: 'only-A' }]);
  const normalSet = localStorage.setItem;
  localStorage.setItem = (key, value) => { if (key.startsWith(GOOGLE_ACCOUNT_BACKUP_PREFIX)) throw new Error('QuotaExceeded'); normalSet(key, value); };
  assert.throws(() => localAuth.loginWithGoogleUser(B, 'test-token-B'), /QuotaExceeded/);
  assert.equal(read(keys.user).email, A.email);
  assert.equal(read(keys.plants)[0].id, 'only-A');
});

const google = await import('../src/lib/googleSync.js');
function mockGoogle(response) {
  browser.google = { accounts: { oauth2: { initTokenClient: options => ({ requestAccessToken: () => { queueMicrotask(() => options.callback(response)); } }) } } };
}

test('failed Google identity lookup does not replace the current credentials or account', async () => {
  reset(); localAuth.loginWithGoogleUser(A, 'test-token-A');
  put(keys.google, A); localStorage.setItem(keys.token, 'test-token-A');
  put(keys.plants, [{ id: 'only-A' }]);
  mockGoogle({ access_token: 'test-token-B', expires_in: 3600 });
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false });
  try {
    await assert.rejects(google.connectGoogleDrive(), /identidade Google/);
    assert.equal(localStorage.getItem(keys.token), 'test-token-A');
    assert.equal(read(keys.user).email, A.email);
    assert.equal(read(keys.plants)[0].id, 'only-A');
  } finally { globalThis.fetch = oldFetch; localStorage.removeItem(keys.google); }
});

test('a late download from A cannot import into B after an actual OAuth switch', async () => {
  reset(); localAuth.loginWithGoogleUser(A, 'test-token-A');
  put(keys.google, A); localStorage.setItem(keys.token, 'test-token-A');
  localStorage.setItem('hortaviva_google_token_expires_at', String(Date.now() + 60000));
  localStorage.setItem('hortaviva_google_granted_scopes', 'https://www.googleapis.com/auth/drive.appdata');
  put(keys.plants, [{ id: 'only-A' }]);
  let releaseRemote; let enteredRemote;
  const remoteReached = new Promise(resolve => { enteredRemote = resolve; });
  const remoteBody = new Promise(resolve => { releaseRemote = resolve; });
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async url => {
    if (url.includes('oauth2/v3/userinfo')) return { ok: true, json: async () => ({ ...B, sub: B.id }) };
    if (url.includes('files?spaces=appDataFolder')) return { ok: true, json: async () => ({ files: [{ id: 'file-A' }] }) };
    if (url.includes('file-A?alt=media')) return { ok: true, json: async () => { enteredRemote(); return remoteBody; } };
    throw new Error('Unexpected mocked endpoint');
  };
  try {
    const downloadA = google.downloadFromGoogleDrive();
    await remoteReached;
    mockGoogle({ access_token: 'test-token-B', expires_in: 3600, scope: 'https://www.googleapis.com/auth/drive.appdata' });
    await google.connectGoogleDrive();
    put(keys.plants, [{ id: 'only-B' }]);
    releaseRemote({ version: 4, user: A, plantings: [{ id: 'remote-A' }] });
    await assert.rejects(downloadA, error => error.code === 'GOOGLE_ACCOUNT_CHANGED');
    assert.equal(read(keys.user).email, B.email);
    assert.deepEqual(read(keys.plants), [{ id: 'only-B' }]);
    assert.equal(localStorage.getItem('hortaviva_google_app_data_file_id'), null);
  } finally { globalThis.fetch = oldFetch; localStorage.removeItem(keys.google); }
});

test('applying an automatic Drive snapshot does not schedule another automatic sync', async () => {
  reset(); localAuth.loginWithGoogleUser(A, 'test-token-A');
  put(keys.google, A); localStorage.setItem(keys.token, 'test-token-A');
  localStorage.setItem('hortaviva_google_token_expires_at', String(Date.now() + 60000));
  localStorage.setItem('hortaviva_google_granted_scopes', 'https://www.googleapis.com/auth/drive.appdata');
  const remote = exportFarmData();
  let requests = 0;
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async url => {
    requests += 1;
    if (url.includes('files?spaces=appDataFolder')) return { ok: true, json: async () => ({ files: [{ id: 'file-A' }] }) };
    if (url.includes('file-A?alt=media')) return { ok: true, json: async () => remote };
    if (url.includes('file-A?fields=')) return { ok: true, json: async () => ({ id: 'file-A', trashed: false }) };
    throw new Error('Unexpected mocked endpoint');
  };
  try {
    await google.autoSyncGoogleDrive();
    const completedRequests = requests;
    await new Promise(resolve => setTimeout(resolve, 850));
    assert.equal(requests, completedRequests);
  } finally { globalThis.fetch = oldFetch; localStorage.removeItem(keys.google); }
});

test('an edit queued during an upload is included in a subsequent sync', async () => {
  reset(); localAuth.loginWithGoogleUser(A, 'test-token-A');
  put(keys.google, A); localStorage.setItem(keys.token, 'test-token-A');
  localStorage.setItem('hortaviva_google_token_expires_at', String(Date.now() + 60000));
  localStorage.setItem('hortaviva_google_granted_scopes', 'https://www.googleapis.com/auth/drive.appdata');
  let server = exportFarmData();
  put(keys.region, { ...region('PT'), updatedAt: '2020-01-01T00:00:00Z' });
  let releaseFirst; let firstStarted;
  const firstReached = new Promise(resolve => { firstStarted = resolve; });
  const firstResponse = new Promise(resolve => { releaseFirst = resolve; });
  let writes = 0;
  const oldFetch = globalThis.fetch;
  globalThis.fetch = async (url, options = {}) => {
    if (options.method === 'PATCH') {
      writes += 1; server = JSON.parse(options.body);
      if (writes === 1) { firstStarted(); await firstResponse; }
      return { ok: true };
    }
    if (url.includes('files?spaces=appDataFolder')) return { ok: true, json: async () => ({ files: [{ id: 'file-A' }] }) };
    if (url.includes('file-A?alt=media')) return { ok: true, json: async () => JSON.parse(JSON.stringify(server)) };
    if (url.includes('file-A?fields=')) return { ok: true, json: async () => ({ id: 'file-A', trashed: false }) };
    throw new Error('Unexpected mocked endpoint');
  };
  try {
    const first = google.autoSyncGoogleDrive();
    await firstReached;
    put(keys.region, { ...region('PT'), language: 'es', updatedAt: '2021-01-01T00:00:00Z' });
    const queued = google.autoSyncGoogleDrive();
    releaseFirst();
    await Promise.all([first, queued]);
    assert.equal(writes, 2);
    assert.equal(server.regionalPreferences.language, 'es');
  } finally { globalThis.fetch = oldFetch; localStorage.removeItem(keys.google); }
});
