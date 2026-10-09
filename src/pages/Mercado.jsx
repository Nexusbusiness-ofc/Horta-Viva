import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Clock3, Coins, History, Loader2, Package, ShoppingBasket, Sprout, Store, X } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';
import { readAccountScope } from '@/lib/accountScope';
import { readRegionalPreferences } from '@/lib/regionalPreferences';
import { readMascotState, MASCOT_CHANGE_EVENT } from '@/lib/mascot';
import { buyMarketOffer, cancelMarketListing, getMarketPriceRange, getMarketView, listMarketProduct, settleMarketSales } from '@/lib/mascotMarket';
import MarketOfferCard from '@/components/mascot/MarketOfferCard';

const KNOWN_REASONS = new Set(['insufficient_funds','already_purchased','empty','invalid_quantity','invalid_price','listing_not_found','offer_expired']);
const reasonAliases = { insufficient_balance:'insufficient_funds', offer_already_bought:'already_purchased', already_bought:'already_purchased', insufficient_stock:'empty', not_enough_stock:'empty', price_out_of_range:'invalid_price', offer_not_found:'offer_expired', listing_not_active:'listing_not_found', already_cancelled:'listing_not_found', already_sold:'listing_not_found' };
const operationOptions = () => {const preferences=readRegionalPreferences();return {now:new Date(),preferences,timeZone:preferences.timeZone};};
const blankForm = () => ({ foodKey:'', quantity:'1', unitPrice:'' });

function countdown(until, now) {
  const seconds = Math.max(0, Math.ceil((Date.parse(until) - now) / 1000));
  if (!Number.isFinite(seconds)) return '—';
  const hours = Math.floor(seconds / 3600), minutes = Math.floor(seconds % 3600 / 60);
  return [hours,minutes,seconds % 60].map(value => String(value).padStart(2,'0')).join(':');
}

export default function Mercado() {
  const { t, locale } = useI18n();
  const [snapshot, setSnapshot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now);
  const [historyLimit, setHistoryLimit] = useState(20);
  const mounted = useRef(false);
  const visibleScope = useRef(null);
  const locked = useRef(false);
  const currentScope = readAccountScope();
  const view = snapshot && snapshot.scope === currentScope ? snapshot.view : null;
  const inventory = view?.inventory || [];
  const selected = inventory.find(item => item.key === form.foodKey) || inventory[0] || null;
  const range = selected ? getMarketPriceRange(selected.key, Number(form.unitPrice)) : null;
  const integerQuantity = Number(form.quantity), integerPrice = Number(form.unitPrice);
  const validForm = Boolean(selected && Number.isSafeInteger(integerQuantity) && integerQuantity > 0 && integerQuantity <= selected.quantity && Number.isSafeInteger(integerPrice) && integerPrice >= range.minPrice && integerPrice <= range.maxPrice);
  const number = value => new Intl.NumberFormat(locale).format(value);

  const refresh = useCallback(() => {
    const scope = readAccountScope();
    if (scope !== visibleScope.current) {
      visibleScope.current = scope;
      setSnapshot(null); setFeedback(null); setForm(blankForm()); setHistoryLimit(20);
    }
    if (scope === null) {setError(true);setLoading(false);return;}
    try {
      const options = operationOptions();
      if (scope !== readAccountScope()) return;
      const settled = settleMarketSales(options);
      const state = settled?.state || readMascotState();
      const next = getMarketView(state, options);
      if (!mounted.current || scope !== readAccountScope()) return;
      setSnapshot({scope,view:next}); setError(false); setNow(Date.now());
    } catch { if (mounted.current && scope === readAccountScope()) setError(true); }
    finally { if (mounted.current && scope === readAccountScope()) setLoading(false); }
  }, []);

  useEffect(() => {
    mounted.current = true; refresh();
    let queued;
    const changed = () => {
      const scope = readAccountScope();
      if (scope !== visibleScope.current) {setSnapshot(null);setForm(blankForm());setFeedback(null);setLoading(true);}
      clearTimeout(queued); queued = setTimeout(refresh,100);
    };
    const focus = () => {if (!document.hidden) refresh();};
    const events = [MASCOT_CHANGE_EVENT,'hortaviva_data_changed','hortaviva_remote_updated','hortaviva_auth_changed','storage'];
    for (const event of events) window.addEventListener(event,changed);
    window.addEventListener('focus',focus); document.addEventListener('visibilitychange',focus);
    const polling = setInterval(focus,30_000), clock = setInterval(() => setNow(Date.now()),1000);
    return () => {
      mounted.current = false; clearTimeout(queued); clearInterval(polling); clearInterval(clock);
      for (const event of events) window.removeEventListener(event,changed);
      window.removeEventListener('focus',focus); document.removeEventListener('visibilitychange',focus);
    };
  }, [refresh]);

  useEffect(() => {
    if (!selected) {if (form.foodKey) setForm(blankForm());return;}
    if (selected.key !== form.foodKey) setForm({foodKey:selected.key,quantity:'1',unitPrice:String(getMarketPriceRange(selected.key).basePrice)});
  }, [selected, form.foodKey]);

  useEffect(() => {
    const expiry = Date.parse(view?.nextRefreshAt);
    if (!Number.isFinite(expiry)) return undefined;
    const timer = setTimeout(refresh,Math.max(0,expiry-Date.now())+50);
    return () => clearTimeout(timer);
  }, [view?.nextRefreshAt,refresh]);

  const perform = (operation, success) => {
    if (locked.current || error || !view) return;
    const scope = snapshot.scope;
    const options = operationOptions();
    if (scope === null || scope !== readAccountScope()) {
      refresh(); setFeedback({key:'market.accountChanged',error:true}); return;
    }
    locked.current = true; setBusy(true); setFeedback(null);
    try {
      const result = operation(options);
      if (scope !== readAccountScope()) {refresh();setFeedback({key:'market.accountChanged',error:true});return;}
      const next = result?.view || getMarketView(result?.state || readMascotState(),options);
      setSnapshot({scope,view:next}); setNow(Date.now());
      if (result.success) {
        setFeedback(success); setForm(previous => ({...previous,quantity:'1'}));
      } else {
        const reason = reasonAliases[result.reason] || result.reason;
        setFeedback({key:reason === 'sync_conflict' ? 'market.operationConflict' : KNOWN_REASONS.has(reason) ? `market.error.${reason}` : 'market.error',error:true});
      }
    } catch {setFeedback({key:'market.storageError',error:true});refresh();}
    finally {locked.current=false;setBusy(false);}
  };
  const buy = offer => perform(options => buyMarketOffer(offer.id,options),{key:'market.buySuccess',vars:{quantity:number(offer.quantity),food:t(offer.plantName)}});
  const list = event => {
    event.preventDefault();
    if (!validForm) {setFeedback({key:integerQuantity > 0 && integerQuantity <= selected?.quantity ? 'market.error.invalid_price' : 'market.error.invalid_quantity',error:true});return;}
    perform(options => listMarketProduct(selected.key,integerQuantity,integerPrice,options),{key:'market.listSuccess'});
  };
  const cancel = listing => perform(options => cancelMarketListing(listing.id,options),{key:'market.cancelSuccess'});
  const date = value => {
    try {return new Intl.DateTimeFormat(locale,{dateStyle:'medium',timeStyle:'short',timeZone:view?.timeZone || readRegionalPreferences().timeZone}).format(new Date(value));}
    catch {return '—';}
  };
  const sales = [...(view?.sales || [])].sort((a,b) => Date.parse(b.at)-Date.parse(a.at));
  const listings = view?.listings || [];
  const disabled = busy || error || !view;

  return <main className="min-h-screen bg-[#faf8f1] pb-16 text-stone-800">
    <header className="border-b border-stone-200/70 bg-white/85">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-4 sm:px-6">
        <Link to="/mascote#armazem" aria-label={t('market.back')} className="rounded-xl border border-stone-200 bg-white p-2.5 text-stone-600 hover:border-emerald-400"><ArrowLeft className="h-4 w-4"/></Link>
        <div className="flex-1"><p className="text-[10px] font-bold uppercase tracking-[.2em] text-emerald-700">Horta Viva</p><h1 className="text-lg font-black sm:text-xl">{t('market.navTitle')}</h1></div>
        <Link to="/mascote#armazem" className="rounded-full border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-600"><Package className="inline h-3.5 w-3.5 sm:mr-1.5"/><span className="sr-only sm:not-sr-only">{t('mascot.warehouse')}</span></Link>
      </div>
    </header>
    <div className="mx-auto max-w-6xl space-y-6 px-4 pt-6 sm:px-6 sm:pt-9">
      <section className="relative overflow-hidden rounded-[2rem] border border-[#e4dcc5] bg-[#f2edda]">
        <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-5 overflow-hidden">{Array.from({length:20},(_,index) => <span key={index} className={`h-5 flex-1 shrink-0 rounded-b-xl ${index%2 ? 'bg-[#e8dfc6]' : 'bg-[#749c79]'}`}/>)}</div>
        <div className="relative grid gap-5 px-5 pb-6 pt-10 sm:grid-cols-[1fr_auto] sm:px-8 sm:pb-8">
          <div className="max-w-xl"><p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.2em] text-[#6a8454]"><Sprout className="h-3.5 w-3.5"/>{t('market.eyebrow')}</p><h2 className="text-3xl font-black leading-tight tracking-tight text-[#334b36] sm:text-4xl">{t('market.title')}</h2><p className="mt-3 max-w-lg text-sm leading-relaxed text-[#78816a]">{t('market.subtitle')}</p></div>
          <div className="self-center rounded-2xl border border-white/80 bg-white/65 px-5 py-4 sm:min-w-[200px]"><p className="text-[10px] font-bold uppercase tracking-wider text-[#9b8554]">{t('market.balance')}</p><div className="mt-1 flex items-center gap-2 text-[#a88a3e]"><Coins className="h-6 w-6"/><span className="text-3xl font-black tabular-nums">{view ? number(view.balance) : '—'}</span></div><p className="mt-1 text-[10px] leading-relaxed text-stone-500">{t('market.startingBalance')}</p></div>
        </div>
      </section>
      <div className="flex items-start gap-2.5 rounded-2xl border border-[#e4dfd0] bg-white/70 px-4 py-3"><Store className="mt-0.5 h-4 w-4 shrink-0 text-[#9c8653]"/><p className="text-xs leading-relaxed text-stone-500"><span className="font-bold text-stone-700">{t('market.simulation')}. </span>{t('market.simulationHint')}</p></div>
      <nav aria-label={t('market.navTitle')} className="flex gap-2 overflow-x-auto pb-1 text-xs font-bold"><a href="#loja" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-emerald-800"><ShoppingBasket className="h-3.5 w-3.5"/>{t('market.shopTab')}</a><a href="#banca" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-stone-600"><Store className="h-3.5 w-3.5"/>{t('market.stallTab')}</a><a href="#historico" className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-stone-200 bg-white px-4 py-2.5 text-stone-600"><History className="h-3.5 w-3.5"/>{t('market.historyTab')}</a></nav>
      {error && <div role="alert" className="rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900"><p>{t('market.storageError')}</p><button type="button" onClick={refresh} className="mt-2 font-bold underline">{t('market.retry')}</button></div>}
      {view?.conflicts?.length > 0 && <div role="status" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">{t('market.syncNotice')}</div>}
      <div role={feedback?.error ? 'alert' : 'status'} aria-live="polite" aria-atomic="true" className={`${feedback ? feedback.error ? 'border border-amber-200 bg-amber-50 text-amber-900' : 'border border-emerald-200 bg-emerald-50 text-emerald-800' : 'sr-only'} rounded-xl px-4 py-3 text-sm font-semibold`}>{feedback ? t(feedback.key,feedback.vars || {}) : ''}</div>
      {loading && <div role="status" className="flex items-center justify-center gap-3 rounded-[2rem] bg-white py-20 text-sm text-stone-500"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none"/>{t('market.loading')}</div>}
      {!loading && view && <>
        <section id="loja" className="scroll-mt-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-xl font-black tracking-tight">{t('market.dailyShop')}</h3><p className="mt-1 max-w-2xl text-xs leading-relaxed text-stone-500">{t('market.dailyShopHint')}</p></div><div className="rounded-xl border border-stone-200/80 bg-white px-3 py-2 text-right"><p className="flex items-center gap-1.5 text-xs font-bold tabular-nums text-[#8f7a45]"><Clock3 className="h-3.5 w-3.5"/>{t('market.refreshIn',{time:countdown(view.nextRefreshAt,now)})}</p><p className="mt-0.5 text-[9px] text-stone-400">{t('market.refreshAt',{zone:view.timeZone || readRegionalPreferences().timeZone})}</p></div></div>
          <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">{t('market.offersCount',{count: view.offers.length})}</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">{view.offers.map(offer => <MarketOfferCard key={offer.id} offer={offer} balance={view.balance} disabled={disabled} onBuy={buy}/>)}</div>
        </section>
        <section id="banca" className="scroll-mt-6 grid gap-5 pt-3 lg:grid-cols-[.9fr_1.1fr]">
          <div className="min-w-0 rounded-[1.75rem] border border-[#dce5d1] bg-white p-5 sm:p-6"><div className="mb-5 flex items-start gap-3"><span className="rounded-xl bg-emerald-50 p-2.5 text-emerald-700"><Store className="h-5 w-5"/></span><div><h3 className="text-xl font-black tracking-tight">{t('market.listTitle')}</h3><p className="mt-1 text-xs leading-relaxed text-stone-500">{t('market.listHint')}</p></div></div>
            {selected ? <form onSubmit={list} className="space-y-4">
              <label className="block text-xs font-bold text-stone-600">{t('market.food')}<select value={selected.key} onChange={event => setForm({foodKey:event.target.value,quantity:'1',unitPrice:String(getMarketPriceRange(event.target.value).basePrice)})} className="mt-2 w-full rounded-xl border border-stone-200 bg-[#fafbf7] px-3 py-3 text-sm font-semibold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">{inventory.map(item => <option key={item.key} value={item.key}>{item.emoji} {t(item.plantName)} · {number(item.quantity)}</option>)}</select></label>
              <div className="-mt-2 flex flex-wrap items-center justify-between gap-1 text-[10px]"><span className="text-stone-400">{t(selected.quantity === 1 ? 'market.availableOne' : 'market.available',{quantity:number(selected.quantity)})}</span><span className="font-semibold text-emerald-700">{t(`market.difficulty.${range.difficulty}`)}</span></div>
              <div className="grid grid-cols-2 gap-3"><label className="block text-xs font-bold leading-relaxed text-stone-600">{t('market.quantityLabel')}<input type="number" min="1" max={selected.quantity} step="1" inputMode="numeric" required value={form.quantity} onChange={event => setForm(previous => ({...previous,quantity:event.target.value}))} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"/></label><label className="block text-xs font-bold leading-relaxed text-stone-600">{t('market.priceLabel')}<input type="number" min={range.minPrice} max={range.maxPrice} step="1" inputMode="numeric" required value={form.unitPrice} onChange={event => setForm(previous => ({...previous,unitPrice:event.target.value}))} className="mt-2 w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"/></label></div>
              <div className="rounded-xl border border-[#ebe2cf] bg-[#fbf7ed] p-3"><p className="text-xs font-bold text-[#947d43]">{t(`market.speed.${range.speedHint}`)}</p><p className="mt-1 text-[10px] text-[#a39776]">{t('market.priceRange',{min:range.minPrice,max:range.maxPrice})}</p><p className="mt-2 text-[11px] leading-relaxed text-stone-500">{t('market.speedHint')}</p></div>
              <p className="text-[11px] leading-relaxed text-stone-400">{t('market.reserveHint')}</p>
              <button type="submit" disabled={!validForm || disabled} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#37664b] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-emerald-800 disabled:bg-stone-100 disabled:text-stone-400"><Store className="h-4 w-4"/>{t('market.listButton')}</button>
            </form> : <div className="rounded-2xl border border-dashed border-stone-200 bg-[#fafaf5] px-4 py-7 text-center"><ShoppingBasket className="mx-auto h-8 w-8 text-[#b8b68d]"/><h4 className="mt-3 text-sm font-bold text-stone-600">{t('market.emptyInventory')}</h4><p className="mt-2 text-xs leading-relaxed text-stone-400">{t('market.emptyInventoryHint')}</p><Link to="/minha-quinta" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-700">{t('mascot.backFarm')}<ArrowUpRight className="h-3.5 w-3.5"/></Link></div>}
          </div>
          <div className="min-w-0 rounded-[1.75rem] border border-stone-200/80 bg-white p-5 sm:p-6"><h3 className="mb-4 text-xl font-black tracking-tight">{t('market.myListings')}</h3>{listings.length ? <div className="max-h-[650px] space-y-3 overflow-y-auto pr-1">{listings.map(listing => <article key={listing.id} className="rounded-2xl border border-stone-100 bg-[#fafaf7] p-3.5"><div className="flex items-start gap-3"><span className="rounded-xl bg-white p-2 text-2xl" aria-hidden="true">{listing.emoji}</span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-1"><h4 className="break-words text-sm font-bold text-stone-700">{t(listing.plantName)}</h4><span className={`rounded-full px-2 py-1 text-[9px] font-bold ${listing.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-400'}`}>{t(`market.listing.${listing.status}`)}</span></div><p className="mt-1 text-[11px] text-stone-500">{t('market.soldProgress',{sold:number(listing.soldQuantity),total:number(listing.quantity)})}</p><p className="mt-0.5 text-[11px] font-semibold text-[#9c8447]">{t('market.unitPrice',{price:number(listing.unitPrice)})}</p></div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-200/70"><div className="h-full rounded-full bg-[#8daf7d]" style={{width:`${Math.min(100,listing.soldQuantity/listing.quantity*100)}%`}}/></div><div className="mt-2.5 flex flex-wrap items-center justify-between gap-2"><p className="text-[10px] text-stone-400">{listing.status === 'active' ? t(listing.remaining === 1 ? 'market.reservedOne' : 'market.reserved',{quantity:number(listing.remaining)}) : t(`market.listing.${listing.status}`)}</p>{listing.status === 'active' && listing.remaining > 0 && <button type="button" onClick={() => cancel(listing)} disabled={disabled} className="inline-flex items-center gap-1 rounded-lg border border-stone-200 bg-white px-2 py-1.5 text-[10px] font-bold text-stone-500 hover:border-rose-200 hover:text-rose-600 disabled:opacity-50"><X className="h-3 w-3"/>{t('market.cancel')}</button>}</div></article>)}</div> : <div className="rounded-2xl border border-dashed border-stone-200 p-8 text-center"><Store className="mx-auto h-8 w-8 text-stone-300"/><p className="mt-3 text-sm text-stone-400">{t('market.noListings')}</p></div>}</div>
        </section>
        <section id="historico" className="scroll-mt-6 rounded-[1.75rem] border border-stone-200/80 bg-white p-5 sm:p-6"><div className="mb-5 flex items-start gap-3"><span className="rounded-xl bg-[#f4eee1] p-2.5 text-[#a48b52]"><History className="h-5 w-5"/></span><div><h3 className="text-xl font-black tracking-tight">{t('market.historyTitle')}</h3><p className="mt-1 text-xs leading-relaxed text-stone-500">{t('market.historyHint')}</p></div></div>{sales.length ? <><div className="divide-y divide-stone-100">{sales.slice(0,historyLimit).map(sale => <article key={sale.id} className="flex items-center gap-3 py-3"><span className="rounded-xl bg-[#faf8f0] p-2 text-xl" aria-hidden="true">{sale.emoji}</span><div className="min-w-0 flex-1"><h4 className="text-sm font-bold text-stone-700">{t(sale.plantName)} <span className="text-xs font-medium text-stone-400">× {number(sale.quantity)}</span></h4><p className="mt-0.5 text-[10px] text-stone-400">{t('market.simulatedBuyer')} · <time dateTime={sale.at}>{date(sale.at)}</time></p></div><span className="inline-flex shrink-0 items-center gap-1 text-xs font-bold text-[#9c8447]"><Coins className="h-3.5 w-3.5"/>+{number(sale.totalPrice)}</span></article>)}</div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 pt-4"><p className="text-[10px] text-stone-400">{t('market.historyCount',{shown:Math.min(historyLimit,sales.length),total:sales.length})}</p>{sales.length > historyLimit && <button type="button" onClick={() => setHistoryLimit(limit=>limit+20)} className="rounded-full border border-stone-200 px-4 py-2 text-xs font-bold text-stone-500">{t('market.showMore')}</button>}</div></> : <div className="rounded-2xl bg-[#fafaf7] p-8 text-center"><Check className="mx-auto h-7 w-7 text-stone-300"/><p className="mt-2 text-sm text-stone-400">{t('market.noSales')}</p></div>}</section>
      </>}
    </div>
  </main>;
}
