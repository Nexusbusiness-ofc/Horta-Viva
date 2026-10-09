import { readRegionalPreferences } from './regionalPreferences.js';
import { getLocalDateString } from './regionalClimate.js';
import { readMascotState, saveMascotState, sanitizeMascotState, getMascotView, getMarketProduct,
  createMarketDay, marketSaleSchedule, replayMascotLedger, getAvailableMascotUnits, nextMascotSequence } from './mascot.js';

const MAX_QUANTITY = 1000000;
const eventId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const validInteger = value => value !== '' && value !== null && Number.isSafeInteger(Number(value)) && Number(value) > 0 && Number(value) <= MAX_QUANTITY;

function context(options = {}) {
  const preferences = options.preferences || readRegionalPreferences();
  return { now: new Date(options.now ?? Date.now()), timeZone: options.timeZone || preferences.timeZone || 'UTC' };
}

export function getMarketPriceRange(foodKey, unitPrice) {
  const product = getMarketProduct(foodKey);
  const price = Number(unitPrice ?? product.basePrice);
  const ratio = (price - product.minPrice) / (product.maxPrice - product.minPrice);
  return { ...product, speedHint: ratio <= 0.25 ? 'fast' : ratio >= 0.7 ? 'slow' : 'normal' };
}

function nextRefresh(now, timeZone) {
  const date = getLocalDateString(now, { timeZone });
  let low = now.getTime(), high = low + 27 * 60 * 60 * 1000;
  while (high - low > 1) {
    const middle = Math.floor((high + low) / 2);
    if (getLocalDateString(new Date(middle), { timeZone }) === date) low = middle;
    else high = middle;
  }
  return new Date(high).toISOString();
}

export function getMarketView(input, options = {}) {
  const { now, timeZone } = context(options);
  const state = sanitizeMascotState(input, { now });
  const localDate = getLocalDateString(now, { timeZone });
  const day = state.market.days[localDate] || createMarketDay(localDate, timeZone);
  const replay = replayMascotLedger(state, { now });
  const offers = day.offers.map(offer => {
    const purchased = Boolean(replay.purchases[`purchase:${offer.id}`]);
    return { ...offer, purchased, purchaseRejected: !purchased && Object.values(state.market.purchases)
      .some(attempt => attempt.offerId === offer.id && replay.rejected[attempt.id]) };
  });
  const listings = Object.values(replay.listings).map(listing => {
    const source = replay.sources[listing.units[0].harvestId];
    const quantity = listing.units.length, remaining = quantity - listing.soldQuantity;
    const prices = getMarketPriceRange(listing.foodKey, listing.unitPrice);
    return { id: listing.id, foodKey: listing.foodKey, plantName: source.plantName, emoji: source.emoji, nutrition: source.nutrition,
      quantity, soldQuantity: listing.soldQuantity, remaining, unitPrice: listing.unitPrice, minPrice: prices.minPrice, maxPrice: prices.maxPrice,
      basePrice: prices.basePrice, difficulty: prices.difficulty, speedHint: prices.speedHint, at: listing.at,
      cancelledAt: listing.cancelledAt, status: remaining === 0 ? 'sold' : listing.cancelledAt ? 'cancelled' : 'active' };
  }).sort((a, b) => b.at.localeCompare(a.at) || a.id.localeCompare(b.id));
  return { balance: replay.balance, localDate, timeZone, nextRefreshAt: nextRefresh(now, timeZone), offers, listings,
    sales: replay.sales.sort((a, b) => b.at.localeCompare(a.at) || a.id.localeCompare(b.id)),
    inventory: getMascotView(state, { now, timeZone }).inventory,
    conflicts: Object.entries(replay.rejected).map(([id, reason]) => ({ id, reason })) };
}

function result(state, options, success = true, reason, extra = {}) {
  return { success, ...(reason ? { reason } : {}), state, view: getMarketView(state, options), ...extra };
}

function settleState(state, { now, timeZone }) {
  const date = getLocalDateString(now, { timeZone });
  let changed = false;
  if (!state.market.days[date]) {
    state = { ...state, market: { ...state.market, days: { ...state.market.days, [date]: createMarketDay(date, timeZone) } } };
    changed = true;
  }
  const replay = replayMascotLedger(state, { now });
  const sales = { ...state.market.sales };
  for (const listing of Object.values(replay.listings)) {
    for (const sale of marketSaleSchedule(listing)) {
      if (Date.parse(sale.at) > now.getTime()) break;
      if (listing.cancelledAt && Date.parse(sale.at) > Date.parse(listing.cancelledAt)) break;
      if (sales[sale.id]) continue;
      sales[sale.id] = { id: sale.id, listingId: sale.listingId, unitIndex: sale.unitIndex, at: sale.at };
      changed = true;
    }
  }
  return { state: changed ? { ...state, market: { ...state.market, sales } } : state, changed };
}

export function settleMarketSales(options = {}) {
  const opts = context(options), current = readMascotState(opts);
  const { state, changed } = settleState(current, opts);
  const next = changed ? saveMascotState(state) : state;
  return result(next, opts, true, undefined, { changed });
}

export function buyMarketOffer(offerId, options = {}) {
  const opts = context(options), current = readMascotState(opts);
  const { state } = settleState(current, opts);
  const view = getMarketView(state, opts), offer = view.offers.find(offer => offer.id === offerId);
  if (!offer) return result(state, opts, false, 'offer_not_found');
  if (offer.purchased) return result(state, opts, false, 'already_purchased');
  if (offer.totalPrice > view.balance) return result(state, opts, false, 'insufficient_funds');
  const purchase = { id: `purchase:${offerId}:attempt:${eventId()}`, offerId, localDate: view.localDate, at: opts.now.toISOString(), sequence: nextMascotSequence(state) };
  const next = saveMascotState({ ...state, market: { ...state.market, purchases: { ...state.market.purchases, [purchase.id]: purchase } } });
  const accepted = replayMascotLedger(next, opts).purchases[`purchase:${offerId}`]?.id === purchase.id;
  return result(next, opts, accepted, accepted ? undefined : 'sync_conflict', { purchaseId: purchase.id });
}

export function listMarketProduct(foodKey, quantity, unitPrice, options = {}) {
  const opts = context(options), current = readMascotState(opts);
  const { state } = settleState(current, opts);
  if (!validInteger(quantity)) return result(state, opts, false, 'invalid_quantity');
  const range = getMarketPriceRange(foodKey, unitPrice);
  if (!validInteger(unitPrice) || Number(unitPrice) < range.minPrice || Number(unitPrice) > range.maxPrice) return result(state, opts, false, 'invalid_price');
  const units = getAvailableMascotUnits(state, foodKey, { now: opts.now, limit: Number(quantity) });
  if (units.length !== Number(quantity)) return result(state, opts, false, 'empty');
  const listing = { id: `listing:${eventId()}`, foodKey, units, unitPrice: Number(unitPrice), at: opts.now.toISOString(), sequence: nextMascotSequence(state) };
  const next = saveMascotState({ ...state, market: { ...state.market, listings: { ...state.market.listings, [listing.id]: listing } } });
  const accepted = Boolean(replayMascotLedger(next, opts).listings[listing.id]);
  return result(next, opts, accepted, accepted ? undefined : 'sync_conflict', { listingId: listing.id });
}

export function cancelMarketListing(id, options = {}) {
  const opts = context(options), current = readMascotState(opts);
  const { state } = settleState(current, opts);
  const listing = getMarketView(state, opts).listings.find(listing => listing.id === id);
  if (!listing) return result(state, opts, false, 'listing_not_found');
  if (listing.status === 'cancelled') return result(state, opts, false, 'already_cancelled');
  if (listing.status === 'sold') return result(state, opts, false, 'already_sold');
  const cancellation = { id: `cancel:${id}`, listingId: id, at: opts.now.toISOString(), sequence: nextMascotSequence(state) };
  const next = saveMascotState({ ...state, market: { ...state.market, cancellations: { ...state.market.cancellations, [cancellation.id]: cancellation } } });
  return result(next, opts, true, undefined, { returnedQuantity: listing.remaining });
}
