import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_PLANTS } from '../src/lib/plantsData.js';
import { MASCOT_STORAGE_KEY, createMascotState, readMascotState, getMascotView, getFoodInfo,
  feedMascot, harvestPlanting, mergeMascotStates, marketSaleSchedule, replayMascotLedger } from '../src/lib/mascot.js';
import { getMarketView, getMarketPriceRange, buyMarketOffer, listMarketProduct, cancelMarketListing, settleMarketSales } from '../src/lib/mascotMarket.js';
import { exportFarmData, importFarmData, localAuth } from '../src/lib/localStorageStore.js';

const start = new Date('2026-10-01T12:00:00Z');
const nextDay = new Date('2026-10-02T12:00:00Z');
const opts = now => ({ now, timeZone: 'UTC' });
const put = state => localStorage.setItem(MASCOT_STORAGE_KEY, JSON.stringify(state));
const state = () => readMascotState({ now: start });
const view = (now = start) => getMarketView(state(), opts(now));
function reset() {
  const values = new Map();
  globalThis.localStorage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key), key: i => [...values.keys()][i], get length() { return values.size; } };
  globalThis.window = new EventTarget(); window.localStorage = localStorage;
  globalThis.CustomEvent ||= class extends Event { constructor(type, options = {}) { super(type); this.detail = options.detail; } };
  put(createMascotState({ now: start }));
  localStorage.setItem('hortaviva_plantings', '[]');
  return values;
}
function harvest(quantity = 6) {
  const crop = { id: 'favas', plant_name: 'Fava', plant_emoji: '🫘', planted_date: '2026-09-01', status: 'Plantada', quantity_method: 'count', plant_count: quantity };
  localStorage.setItem('hortaviva_plantings', JSON.stringify([crop]));
  return harvestPlanting(crop.id, {}, opts(start));
}
function buy(now = start) {
  const offer = view(now).offers[0];
  const result = buyMarketOffer(offer.id, opts(now));
  assert.equal(result.success, true);
  return { ...result, offer };
}

test('new market has120 fictional coins, empty warehouse and no automatic farm stock', () => {
  reset();
  assert.equal(view().balance, 120); assert.deepEqual(view().inventory, []);
  localStorage.setItem('hortaviva_plantings', JSON.stringify([{ id: 'old', plant_name: 'Fava', status: 'Colhida', plant_count: 100 }]));
  assert.deepEqual(view().inventory, []);
});

test('daily shop persists10 deterministic products and10 distinct quantities2..11 without repeated writes', () => {
  reset(); let changes = 0;
  window.addEventListener('hortaviva_data_changed', () => changes++);
  const first = settleMarketSales(opts(start));
  assert.equal(first.changed, true); assert.equal(first.view.offers.length, 10);
  assert.equal(new Set(first.view.offers.map(offer => offer.foodKey)).size, 10);
  assert.deepEqual(first.view.offers.map(offer => offer.quantity).sort((a, b) => a - b), [2,3,4,5,6,7,8,9,10,11]);
  assert.deepEqual(state().market.days['2026-10-01'].offers, first.view.offers.map(({ purchased, purchaseRejected, ...offer }) => offer));
  assert.equal(settleMarketSales(opts(start)).changed, false); assert.equal(changes, 1);
  const merged = mergeMascotStates(state(), createMascotState({ now: start }));
  assert.deepEqual(getMarketView(merged, opts(start)).offers, first.view.offers);
});

test('price ranges use real Fácil/Média/Médio/Difícil labels and canonical catalogue prices', () => {
  for (const [label, difficulty, base] of [['Fácil','easy',3], ['Média','medium',5], ['Médio','medium',5], ['Difícil','hard',8]]) {
    const plant = DEFAULT_PLANTS.find(plant => plant.difficulty === label);
    assert.ok(plant, `catalogue contains ${label}`);
    const range = getMarketPriceRange(getFoodInfo(plant.name).key);
    assert.equal(range.difficulty, difficulty); assert.equal(range.basePrice, base);
    assert.equal(range.minPrice, Math.ceil(base * 0.6)); assert.equal(range.maxPrice, base * 2);
    assert.equal(getMarketPriceRange(range.key, range.minPrice).speedHint, 'fast');
    assert.equal(getMarketPriceRange(range.key, range.maxPrice).speedHint, 'slow');
  }
});

test('shop renews at real civil midnight including DST and timezone changes do not reset an existing day', () => {
  reset();
  const date = new Date('2026-10-24T23:30:00Z');
  const result = settleMarketSales({ now: date, preferences: { timeZone: 'Europe/Lisbon' } });
  assert.equal(result.view.localDate, '2026-10-25');
  assert.equal(result.view.nextRefreshAt, '2026-10-26T00:00:00.000Z');
  const utc = getMarketView(result.state, { now: new Date('2026-10-25T12:00:00Z'), timeZone: 'UTC' });
  assert.deepEqual(utc.offers, result.view.offers);
});

test('buying debits and creates exactly one package atomically; purchased offer stays visible until next day', () => {
  reset(); const bought = buy();
  assert.equal(bought.view.balance, 120 - bought.offer.totalPrice);
  assert.equal(bought.view.inventory.find(item => item.key === bought.offer.foodKey).quantity, bought.offer.quantity);
  assert.equal(bought.view.offers.find(offer => offer.id === bought.offer.id).purchased, true);
  const raw = localStorage.getItem(MASCOT_STORAGE_KEY);
  assert.equal(buyMarketOffer(bought.offer.id, opts(start)).reason, 'already_purchased');
  assert.equal(localStorage.getItem(MASCOT_STORAGE_KEY), raw);
  const tomorrow = settleMarketSales(opts(nextDay));
  assert.ok(tomorrow.view.offers.every(offer => !offer.purchased && offer.id.startsWith('2026-10-02:')));
  assert.equal(getMarketView(tomorrow.state, opts(start)).offers.find(offer => offer.id === bought.offer.id).purchased, true);
});

test('insufficient funds never overdraw and invalid or old offer IDs cannot be bought', () => {
  reset(); const offers = view().offers; let rejected = 0;
  for (const offer of offers) {
    const result = buyMarketOffer(offer.id, opts(start));
    assert.ok(result.view.balance >= 0);
    if (!result.success) { assert.equal(result.reason, 'insufficient_funds'); rejected++; }
  }
  assert.ok(rejected > 0);
  assert.equal(buyMarketOffer('fake', opts(start)).reason, 'offer_not_found');
  assert.equal(buyMarketOffer(offers[0].id, opts(nextDay)).reason, 'offer_not_found');
});

test('bought produce feeds the mascot with the same nutrition and never creates a harvest event', () => {
  reset(); const bought = buy();
  const fed = feedMascot(bought.offer.foodKey, opts(nextDay));
  assert.equal(fed.success, true); assert.equal(fed.gained, bought.offer.nutrition);
  assert.equal(fed.view.inventory[0].quantity, bought.offer.quantity - 1);
  assert.equal(Object.keys(fed.state.harvests).length, 0);
  assert.equal(view(nextDay).balance, 120 - bought.offer.totalPrice);
});

test('listing reserves stock immediately against feeding; cancel returns only its remaining stock once', () => {
  reset(); harvest(6);
  const listed = listMarketProduct('fava', 6, 2, opts(start));
  assert.equal(listed.success, true); assert.deepEqual(listed.view.inventory, []);
  assert.equal(feedMascot('fava', opts(nextDay)).reason, 'empty');
  assert.equal(listed.view.listings[0].soldQuantity, 0); assert.equal(listed.view.sales.length, 0);
  const cancelled = cancelMarketListing(listed.listingId, opts(start));
  assert.equal(cancelled.success, true); assert.equal(cancelled.returnedQuantity, 6);
  assert.equal(cancelled.view.inventory[0].quantity, 6); assert.equal(cancelled.view.listings[0].status, 'cancelled');
  assert.equal(cancelMarketListing(listed.listingId, opts(start)).reason, 'already_cancelled');
  assert.equal(view().inventory[0].quantity, 6);
});

test('invalid quantities, invalid prices and insufficient stock leave the ledger unchanged', () => {
  reset(); harvest(3);
  const raw = localStorage.getItem(MASCOT_STORAGE_KEY);
  for (const quantity of [0, -1, 1.5, NaN, Infinity, '', null, 1000001]) assert.equal(listMarketProduct('fava', quantity, 3, opts(start)).reason, 'invalid_quantity');
  for (const price of [0, -1, 1, 7, 2.5, Infinity, '', null]) assert.equal(listMarketProduct('fava', 1, price, opts(start)).reason, 'invalid_price');
  assert.equal(listMarketProduct('fava', 4, 3, opts(start)).reason, 'empty');
  assert.equal(listMarketProduct('not-owned', 1, 3, opts(start)).reason, 'empty');
  assert.equal(localStorage.getItem(MASCOT_STORAGE_KEY), raw);
});

test('sales have deterministic individual buyer times, first90s+ and later60s+, with higher prices slower', () => {
  reset(); harvest(4);
  const listed = listMarketProduct('fava', 4, 2, opts(start));
  const listing = listed.state.market.listings[listed.listingId];
  const cheap = marketSaleSchedule(listing), expensive = marketSaleSchedule({ ...listing, unitPrice: 6 });
  assert.ok(Date.parse(cheap[0].at) - start.getTime() >= 90000);
  for (let index = 1; index < cheap.length; index++) assert.ok(Date.parse(cheap[index].at) - Date.parse(cheap[index - 1].at) >= 60000);
  assert.ok(Date.parse(expensive[0].at) > Date.parse(cheap[0].at) + 3600000);
  assert.deepEqual(marketSaleSchedule(listing), cheap);
  assert.equal(settleMarketSales(opts(new Date(Date.parse(cheap[0].at) - 1))).view.sales.length, 0);
  const firstSale = settleMarketSales(opts(cheap[0].at));
  assert.equal(firstSale.view.sales.length, 1); assert.equal(firstSale.view.balance, 122);
  const complete = settleMarketSales(opts(cheap.at(-1).at));
  assert.equal(complete.view.sales.length, 4); assert.equal(complete.view.balance, 128);
  assert.equal(new Set(complete.view.sales.map(sale => sale.at)).size, 4);
  assert.equal(complete.view.listings[0].status, 'sold');
  assert.equal(settleMarketSales(opts(cheap.at(-1).at)).changed, false);
});

test('partial cancellation keeps completed sales and their coins, releases remaining units, and survives older merges', () => {
  reset(); harvest(4);
  const listed = listMarketProduct('fava', 4, 2, opts(start));
  const old = structuredClone(listed.state), plan = marketSaleSchedule(old.market.listings[listed.listingId]);
  const cancelled = cancelMarketListing(listed.listingId, opts(new Date(Date.parse(plan[0].at) + 1)));
  assert.equal(cancelled.view.sales.length, 1); assert.equal(cancelled.view.balance, 122);
  assert.equal(cancelled.returnedQuantity, 3); assert.equal(cancelled.view.inventory[0].quantity, 3);
  put(mergeMascotStates(cancelled.state, old));
  const later = settleMarketSales(opts(nextDay));
  assert.equal(later.view.sales.length, 1); assert.equal(later.view.balance, 122); assert.equal(later.view.inventory[0].quantity, 3);
  assert.equal(later.view.listings[0].soldQuantity, 1);
  const cancelledBranch = later.state;
  put(old);
  const completedElsewhere = settleMarketSales(opts(nextDay)).state;
  put(mergeMascotStates(cancelledBranch, completedElsewhere));
  const merged = view(nextDay);
  assert.equal(merged.sales.length, 1); assert.equal(merged.balance, 122); assert.equal(merged.inventory[0].quantity, 3);
  const fed = feedMascot('fava', opts(nextDay));
  assert.equal(fed.success, true); assert.equal(fed.view.inventory[0].quantity, 2);
});

test('sales keep distinct ordinals after feeding and when a listing combines units from multiple harvests', () => {
  reset(); harvest(2);
  const extra = { id: 'second-favas', plant_name: 'Fava', plant_emoji: '🫘', planted_date: '2026-09-01', status: 'Plantada', quantity_method: 'count', plant_count: 3 };
  const plantings = JSON.parse(localStorage.getItem('hortaviva_plantings'));
  localStorage.setItem('hortaviva_plantings', JSON.stringify([...plantings, extra]));
  harvestPlanting(extra.id, {}, opts(start));
  assert.equal(feedMascot('fava', opts(nextDay)).success, true);
  const listed = listMarketProduct('fava', 4, 2, opts(nextDay));
  assert.equal(listed.success, true);
  const plan = marketSaleSchedule(listed.state.market.listings[listed.listingId]);
  assert.deepEqual(plan.map(sale => sale.unitIndex), [0,1,2,3]);
  assert.ok(plan.some(sale => sale.sourceUnitIndex !== sale.unitIndex));
  const sold = settleMarketSales(opts(plan.at(-1).at));
  assert.equal(sold.view.sales.length, 4); assert.equal(sold.view.balance, 128);
  assert.equal(sold.view.listings[0].remaining, 0); assert.deepEqual(sold.view.inventory, []);
  assert.equal(getMascotView(sold.state, opts(plan.at(-1).at)).totalXp, 15);
});

test('concurrent feed and listing claims resolve deterministically without double consumption or coins', () => {
  reset(); const original = harvest(1).state;
  const fed = feedMascot('fava', opts(nextDay)).state;
  put(original); const listed = listMarketProduct('fava', 1, 2, opts(nextDay)).state;
  const merged = mergeMascotStates(fed, listed);
  assert.deepEqual(merged, mergeMascotStates(listed, fed));
  const replay = replayMascotLedger(merged, opts(nextDay));
  assert.equal(replay.accepted.length + Object.keys(replay.listings).length, 1);
  assert.equal(getMascotView(merged, opts(nextDay)).inventory.length, 0);
  assert.equal(replay.balance, 120);
  assert.equal(Object.keys(replay.rejected).length, 1);
  assert.deepEqual(mergeMascotStates(merged, merged), merged);
});

test('offline purchases cannot spend the initial balance twice or create stock from rejected purchases', () => {
  reset(); const original = state(), offers = view().offers;
  const branches = offers.map(offer => {
    put(original); return buyMarketOffer(offer.id, opts(start)).state;
  });
  const merged = branches.reduce((result, branch) => mergeMascotStates(result, branch), original);
  const reversed = branches.toReversed().reduce((result, branch) => mergeMascotStates(result, branch), original);
  assert.deepEqual(merged, reversed);
  const replay = replayMascotLedger(merged, opts(start)), market = getMarketView(merged, opts(start));
  assert.ok(replay.balance >= 0); assert.ok(Object.keys(replay.rejected).length > 0);
  assert.equal(market.inventory.reduce((sum, item) => sum + item.quantity, 0), Object.keys(replay.purchases).reduce((sum, id) => sum + replay.sources[id].quantity, 0));
  assert.equal(replay.balance, 120 - Object.keys(replay.purchases).reduce((sum, id) => sum + replay.sources[id].totalPrice, 0));
});

test('a rejected offline purchase can be retried after sales fund it, with only one accepted package', () => {
  reset(); const original = state(), offers = view().offers;
  const branches = offers.map(offer => { put(original); return buyMarketOffer(offer.id, opts(start)).state; });
  put(branches.reduce((result, branch) => mergeMascotStates(result, branch), original));
  const rejected = view().offers.find(offer => offer.purchaseRejected && !offer.purchased);
  assert.ok(rejected); harvest(100);
  assert.equal(listMarketProduct('fava', 100, 2, opts(start)).success, true);
  const later = new Date(start.getTime() + 10 * 60 * 60 * 1000);
  const funded = settleMarketSales(opts(later));
  assert.ok(funded.view.balance >= rejected.totalPrice);
  const retried = buyMarketOffer(rejected.id, opts(later));
  assert.equal(retried.success, true);
  assert.equal(retried.view.balance, funded.view.balance - rejected.totalPrice);
  assert.equal(retried.view.offers.find(offer => offer.id === rejected.id).purchased, true);
  assert.equal(buyMarketOffer(rejected.id, opts(later)).reason, 'already_purchased');
});

test('concurrent attempts for the same shop package share canonical stock and debit only once', () => {
  reset(); const original = state(), offer = view().offers[0];
  const first = buyMarketOffer(offer.id, opts(start));
  const fedFirst = feedMascot(offer.foodKey, opts(nextDay)).state;
  put(original); const second = buyMarketOffer(offer.id, opts(start));
  const fedSecond = feedMascot(offer.foodKey, opts(nextDay)).state;
  assert.notEqual(first.purchaseId, second.purchaseId);
  const merged = mergeMascotStates(fedFirst, fedSecond), market = getMarketView(merged, opts(nextDay));
  assert.equal(market.balance, 120 - offer.totalPrice);
  assert.equal(market.inventory[0].quantity, offer.quantity - 1);
  assert.equal(getMascotView(merged, opts(nextDay)).totalXp, offer.nutrition * 5);
});

test('storage failures leave purchases, listing reservations and cancellation fully unchanged', () => {
  reset(); harvest(3);
  const listed = listMarketProduct('fava', 1, 2, opts(start));
  const offer = listed.view.offers[0];
  const raw = localStorage.getItem(MASCOT_STORAGE_KEY), originalSet = localStorage.setItem;
  localStorage.setItem = (key, value) => { if (key === MASCOT_STORAGE_KEY) throw new Error('QuotaExceeded'); originalSet(key, value); };
  assert.throws(() => buyMarketOffer(offer.id, opts(start)), /QuotaExceeded/);
  assert.throws(() => listMarketProduct('fava', 1, 2, opts(start)), /QuotaExceeded/);
  assert.throws(() => cancelMarketListing(listed.listingId, opts(start)), /QuotaExceeded/);
  assert.throws(() => settleMarketSales(opts(nextDay)), /QuotaExceeded/);
  assert.equal(localStorage.getItem(MASCOT_STORAGE_KEY), raw);
  assert.equal(view().balance, 120); assert.equal(view().inventory[0].quantity, 2);
});

test('backup and account switching retain market history without resurrecting sold or eaten products', () => {
  reset(); localAuth.loginWithGoogleUser({ id: 'A', email: 'a@example.test' }, 'fake-A');
  harvest(3); const bought = buy(); const old = exportFarmData();
  const listed = listMarketProduct('fava', 2, 2, opts(start));
  const plan = marketSaleSchedule(listed.state.market.listings[listed.listingId]);
  settleMarketSales(opts(plan.at(-1).at)); feedMascot(bought.offer.foodKey, opts(nextDay));
  const before = view(nextDay); importFarmData(old, false);
  assert.deepEqual(view(nextDay), before);
  localAuth.loginWithGoogleUser({ id: 'B', email: 'b@example.test' }, 'fake-B');
  assert.equal(view().balance, 120); assert.deepEqual(view().inventory, []);
  localAuth.loginWithGoogleUser({ id: 'A', email: 'a@example.test' }, 'fake-A2');
  assert.deepEqual(view(nextDay), before);
});
