import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Check, Clock3, Coins, Heart, History, Info, Loader2, Minus, Package, Plus, ShoppingBasket, Store, X } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';
import { readAccountScope } from '@/lib/accountScope';
import { readRegionalPreferences } from '@/lib/regionalPreferences';
import { readMascotState, MASCOT_CHANGE_EVENT } from '@/lib/mascot';
import { buyMarketOffer, cancelMarketListing, getMarketPriceRange, getMarketView, listMarketProduct, settleMarketSales } from '@/lib/mascotMarket';
import MarketOfferCard from '@/components/mascot/MarketOfferCard';
import FarmMarketScene from '@/components/mascot/FarmMarketScene';
import ProduceIllustration from '@/components/mascot/ProduceIllustration';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogPortal, DialogOverlay, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import '@/components/mascot/market.css';

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
  const [tab, setTab] = useState(() => typeof window !== 'undefined' && ['#banca','#historico'].includes(window.location.hash) ? window.location.hash.slice(1) : 'loja');
  const [purchaseIntent, setPurchaseIntent] = useState(null);
  const purchaseTrigger = useRef(null);
  const shopTabRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState(blankForm);
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(Date.now);
  const [historyLimit, setHistoryLimit] = useState(20);
  const mounted = useRef(false);
  const visibleScope = useRef(readAccountScope());
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
      setSnapshot(null); setFeedback(null); setForm(blankForm()); setHistoryLimit(20); setPurchaseIntent(null); setTab('loja');
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
      if (scope !== visibleScope.current) {setSnapshot(null);setForm(blankForm());setFeedback(null);setLoading(true);setPurchaseIntent(null);setTab('loja');}
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
      return result.success;
    } catch {setFeedback({key:'market.storageError',error:true});refresh();return false;}
    finally {locked.current=false;setBusy(false);}
  };
  const previewOffer = purchaseIntent?.scope === currentScope ? view?.offers.find(offer => offer.id === purchaseIntent.id) : null;
  useEffect(() => {
    if (purchaseIntent && (!previewOffer || previewOffer.purchased)) setPurchaseIntent(null);
  }, [purchaseIntent,previewOffer]);
  useEffect(() => {
    const hashChanged = () => setTab(['#banca','#historico'].includes(window.location.hash) ? window.location.hash.slice(1) : 'loja');
    window.addEventListener('hashchange',hashChanged);
    return () => window.removeEventListener('hashchange',hashChanged);
  }, []);
  const openPurchase = (offer, trigger) => {
    if (busy || error || !view || snapshot.scope !== readAccountScope()) {refresh();return;}
    purchaseTrigger.current = trigger;
    setFeedback(null);
    setPurchaseIntent({id:offer.id,scope:snapshot.scope});
  };
  const confirmPurchase = () => {
    if (!previewOffer || purchaseIntent.scope !== readAccountScope()) {setPurchaseIntent(null);refresh();return;}
    if (perform(options => buyMarketOffer(previewOffer.id,options),{key:'market.buySuccess',vars:{quantity:number(previewOffer.quantity),food:t(previewOffer.plantName)}})) setPurchaseIntent(null);
  };
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
  const activeListings = listings.filter(listing => listing.status === 'active');
  const purchasedCount = view?.offers.filter(offer => offer.purchased).length || 0;
  const chooseProduct = item => setForm({foodKey:item.key,quantity:'1',unitPrice:String(getMarketPriceRange(item.key).basePrice)});
  const changeNumber = (field, step, min, max) => setForm(previous => ({...previous,[field]:String(Math.min(max,Math.max(min,(Number(previous[field]) || min)+step)))}));

  return <main className="market-game">
    <header className="market-topbar">
      <div className="market-topbar-inner">
        <Link to="/mascote" aria-label={t('market.back')} className="market-back"><ArrowLeft className="h-4 w-4"/></Link>
        <div className="market-brand"><p>HORTA VIVA</p><h1>{t('market.navTitle')}</h1></div>
        <Link to="/mascote#armazem" className="market-warehouse" aria-label={t('mascot.warehouse')}><Package className="h-4 w-4"/><span>{t('mascot.warehouse')}</span></Link>
        <div className="market-wallet" aria-label={t('market.balance')}><span className="market-wallet-icon"><Coins className="h-5 w-5"/></span><div><small>{t('market.currency')}</small><strong>{view ? number(view.balance) : '—'}</strong></div></div>
      </div>
    </header>
    <div className="market-container">
      <section className="market-world">
        <FarmMarketScene className="market-world-art"/>
        <div className="market-world-sign"><h2>{t('market.gameTitle')}</h2><p>{t('market.gameSubtitle')}</p></div>
      </section>
      {error && <div role="alert" className="market-notice"><p>{t('market.storageError')}</p><button type="button" onClick={refresh}>{t('market.retry')}</button></div>}
      {view?.conflicts?.length > 0 && <div role="status" className="market-notice">{t('market.syncNotice')}</div>}
      <div role={feedback?.error ? 'alert' : 'status'} aria-live="polite" aria-atomic="true" className={feedback && !previewOffer ? `market-notice ${feedback.error ? '' : 'is-success'}` : 'sr-only'}>{feedback && !previewOffer ? t(feedback.key,feedback.vars || {}) : ''}</div>
      {loading && <div role="status" className="market-loading"><Loader2 className="h-5 w-5 animate-spin motion-reduce:animate-none"/>{t('market.loading')}</div>}
      {!loading && view && <Tabs value={tab} onValueChange={setTab} className="market-tabs">
        <TabsList aria-label={t('market.navTitle')} className="market-tabs-list">
          <TabsTrigger value="loja" ref={shopTabRef} className="market-tab"><ShoppingBasket/>{t('market.shopTab')}<span className="market-tab-count">{number(view.offers.length-purchasedCount)}</span></TabsTrigger>
          <TabsTrigger value="banca" className="market-tab"><Store/>{t('market.stallTab')}{activeListings.length > 0 && <span className="market-tab-count">{number(activeListings.length)}</span>}</TabsTrigger>
          <TabsTrigger value="historico" className="market-tab"><History/>{t('market.historyTab')}{sales.length > 0 && <span className="market-tab-count">{number(sales.length)}</span>}</TabsTrigger>
        </TabsList>
        <TabsContent value="loja" className="market-pane">
          <section id="loja" className="market-board">
            <div className="market-awning" aria-hidden="true"/>
            <div className="market-board-content">
              <div className="market-section-heading"><div><h3>{t('market.dailyShop')}</h3><p>{t('market.shopInstruction')}</p></div><div className="market-clock" title={t('market.refreshAt',{zone:view.timeZone})}><Clock3/><div><small>{t('market.refreshLabel')}</small><strong>{countdown(view.nextRefreshAt,now)}</strong></div></div></div>
              <div className="market-shop-summary"><span>{t('market.offersCount',{count:view.offers.length})}</span><span><Check className="h-3 w-3"/>{t('market.boughtCount',{count:purchasedCount,total:view.offers.length})}</span></div>
              <div className="market-crates">{view.offers.map(offer => <MarketOfferCard key={offer.id} offer={offer} balance={view.balance} disabled={disabled} onBuy={openPurchase}/>)}</div>
              <div className="market-tip"><Heart/><p>{t('market.petTip')} <Link to="/mascote#armazem" className="font-extrabold underline">{t('market.feedPet')}</Link></p></div>
            </div>
          </section>
        </TabsContent>
        <TabsContent value="banca" className="market-pane">
          <div className="market-stall-layout">
            <section className="market-board" id="banca">
              <div className="market-awning" aria-hidden="true"/>
              <div className="market-board-content">
                <div className="market-section-heading"><div><h3>{t('market.listTitle')}</h3><p>{t('market.chooseInstruction')}</p></div><Package className="h-6 w-6 shrink-0 text-[#a18556]"/></div>
                {selected ? <>
                  <div className="market-stock-grid" role="group" aria-label={t('market.food')}>{inventory.map(item => <button type="button" key={item.key} disabled={disabled} onClick={() => chooseProduct(item)} aria-pressed={selected.key === item.key} className="market-stock-item"><ProduceIllustration foodKey={item.key} plantName={item.plantName}/><strong>{t(item.plantName)}</strong><span>×{number(item.quantity)}</span></button>)}</div>
                  <div className="market-selected-food"><ProduceIllustration foodKey={selected.key} plantName={selected.plantName}/><div><h4>{t(selected.plantName)}</h4><p>{t(selected.quantity === 1 ? 'market.availableOne' : 'market.available',{quantity:number(selected.quantity)})}</p></div></div>
                  <form onSubmit={list} className="market-form">
                    <div className="market-field-row">
                      <div><label htmlFor="market-quantity" className="market-field">{t('market.quantityLabel')}</label><div className="market-stepper"><button type="button" onClick={() => changeNumber('quantity',-1,1,selected.quantity)} disabled={disabled || integerQuantity <= 1} aria-label={t('market.lessQuantity')}><Minus/></button><input id="market-quantity" type="number" min="1" max={selected.quantity} step="1" inputMode="numeric" required value={form.quantity} onChange={event => setForm(previous => ({...previous,quantity:event.target.value}))}/><button type="button" onClick={() => changeNumber('quantity',1,1,selected.quantity)} disabled={disabled || integerQuantity >= selected.quantity} aria-label={t('market.moreQuantity')}><Plus/></button></div></div>
                      <div><label htmlFor="market-price" className="market-field">{t('market.priceLabel')}</label><div className="market-stepper"><button type="button" onClick={() => changeNumber('unitPrice',-1,range.minPrice,range.maxPrice)} disabled={disabled || integerPrice <= range.minPrice} aria-label={t('market.lessPrice')}><Minus/></button><input id="market-price" type="number" min={range.minPrice} max={range.maxPrice} step="1" inputMode="numeric" required value={form.unitPrice} onChange={event => setForm(previous => ({...previous,unitPrice:event.target.value}))}/><button type="button" onClick={() => changeNumber('unitPrice',1,range.minPrice,range.maxPrice)} disabled={disabled || integerPrice >= range.maxPrice} aria-label={t('market.morePrice')}><Plus/></button></div></div>
                    </div>
                    <div className="market-presets" aria-label={t('market.pricePresets')}>{[['minPrice','market.priceLow'],['basePrice','market.priceFair'],['maxPrice','market.priceHigh']].map(([key,label]) => <button key={key} type="button" disabled={disabled} aria-pressed={integerPrice === range[key]} onClick={() => setForm(previous => ({...previous,unitPrice:String(range[key])}))}>{t(label)} · {number(range[key])}</button>)}</div>
                    <div className="market-interest"><div><p>{t(`market.speed.${range.speedHint}`)}</p><span className="market-interest-bars" aria-hidden="true">{Array.from({length:5},(_,i) => <i key={i} className={i < (range.speedHint === 'fast' ? 5 : range.speedHint === 'normal' ? 3 : 1) ? 'is-on' : ''}/>)}</span></div><small>{t('market.priceRange',{min:range.minPrice,max:range.maxPrice})}</small></div>
                    <div className="market-total"><span>{t('market.possibleTotal')}</span><strong><Coins/>{validForm ? number(integerQuantity*integerPrice) : '—'}</strong></div>
                    <button type="submit" disabled={!validForm || disabled} className="market-primary market-full"><Store/>{t('market.listButton')}</button>
                    <p className="mt-3 text-[10px] leading-relaxed text-[#9a8260]">{t('market.reserveShort')}</p>
                  </form>
                </> : <div className="market-empty"><Package/><h4>{t('market.emptyInventory')}</h4><p>{t('market.emptyInventoryHint')}</p><button type="button" onClick={() => setTab('loja')} className="market-primary"><ShoppingBasket/>{t('market.shopTab')}</button><Link to="/minha-quinta" className="market-secondary">{t('mascot.backFarm')}<ArrowUpRight/></Link></div>}
              </div>
            </section>
            <section className="market-board"><div className="market-board-content"><div className="market-section-heading"><div><h3>{t('market.myListings')}</h3><p>{t('market.stallInstruction')}</p></div><Store className="h-6 w-6 shrink-0 text-[#a18556]"/></div>
              {listings.length ? <div className="market-listings">{[...listings].sort((a,b) => Number(b.status === 'active')-Number(a.status === 'active') || Date.parse(b.at)-Date.parse(a.at)).map(listing => <article key={listing.id} className="market-listing">
                <div className="market-listing-top"><ProduceIllustration foodKey={listing.foodKey} plantName={listing.plantName}/><div className="min-w-0"><h4>{t(listing.plantName)}</h4><p className="market-listing-price"><Coins/>{number(listing.unitPrice)} <span className="text-[9px] font-medium">{t('market.perUnitShort')}</span></p></div><span className={`market-status ${listing.status === 'active' ? '' : 'is-finished'}`}>{t(`market.listing.${listing.status}`)}</span></div>
                <div className="market-progress" aria-hidden="true"><div style={{width:`${Math.min(100,listing.soldQuantity/listing.quantity*100)}%`}}/></div>
                <div className="market-listing-meta"><span>{t('market.soldProgress',{sold:number(listing.soldQuantity),total:number(listing.quantity)})}</span><strong>{t('market.earned',{amount:number(listing.soldQuantity*listing.unitPrice)})}</strong></div>
                {listing.status === 'active' && listing.remaining > 0 && <div className="market-listing-footer"><p>{t(listing.remaining === 1 ? 'market.reservedOne' : 'market.reserved',{quantity:number(listing.remaining)})}</p><button type="button" onClick={() => cancel(listing)} disabled={disabled}><X className="h-3 w-3"/>{t('market.cancel')}</button></div>}
              </article>)}</div> : <div className="market-empty"><Store/><h4>{t('market.noListings')}</h4><p>{t('market.noListingsHint')}</p></div>}
            </div></section>
          </div>
        </TabsContent>
        <TabsContent value="historico" className="market-pane">
          <section id="historico" className="market-board"><div className="market-board-content">
            <div className="market-section-heading"><div><h3>{t('market.historyTitle')}</h3><p>{t('market.historyHint')}</p></div><History className="h-6 w-6 shrink-0 text-[#a18556]"/></div>
            {sales.length ? <>{sales.slice(0,historyLimit).map(sale => <article key={sale.id} className="market-receipt"><ProduceIllustration foodKey={sale.foodKey} plantName={sale.plantName}/><div><h4>{t(sale.plantName)} <span className="text-xs font-medium text-[#9b8261]">×{number(sale.quantity)}</span></h4><p>{t('market.simulatedBuyer')} · <time dateTime={sale.at}>{date(sale.at)}</time></p></div><span className="market-receipt-credit"><Coins/>+{number(sale.totalPrice)}</span></article>)}<div className="market-history-footer"><p>{t('market.historyCount',{shown:Math.min(historyLimit,sales.length),total:sales.length})}</p>{sales.length > historyLimit && <button type="button" onClick={() => setHistoryLimit(limit=>limit+20)} className="market-secondary">{t('market.showMore')}</button>}</div></> : <div className="market-empty"><History/><h4>{t('market.noSales')}</h4><p>{t('market.noSalesHint')}</p><button type="button" onClick={() => setTab('banca')} className="market-primary"><Store/>{t('market.stallTab')}</button></div>}
          </div></section>
        </TabsContent>
      </Tabs>}
      <details className="market-info"><summary><Info/>{t('market.simulationShort')}</summary><p>{t('market.simulationHint')} {t('market.startingBalance')}</p><p>{view && t('market.refreshAt',{zone:view.timeZone})}</p></details>
    </div>
    <Dialog open={Boolean(previewOffer)} onOpenChange={open => {if (!open) setPurchaseIntent(null);}}>
      {previewOffer && <DialogPortal><DialogOverlay className="bg-[#253b20]/60 backdrop-blur-sm"/><DialogPrimitive.Content className="market-dialog fixed left-1/2 top-1/2 z-50 grid -translate-x-1/2 -translate-y-1/2" onCloseAutoFocus={event => {event.preventDefault();if (purchaseTrigger.current?.isConnected && !purchaseTrigger.current.disabled) purchaseTrigger.current.focus();else shopTabRef.current?.focus();}}>
        <DialogClose asChild><button type="button" className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-lg text-[#9a7c51]" aria-label={t('market.close')}><X className="h-5 w-5"/></button></DialogClose>
        <DialogTitle>{t(previewOffer.plantName)}</DialogTitle>
        <DialogDescription className="market-dialog-description">{t('market.packageDetails',{quantity:number(previewOffer.quantity),price:number(previewOffer.unitPrice)})}</DialogDescription>
        <div className="market-dialog-produce"><ProduceIllustration foodKey={previewOffer.foodKey} plantName={previewOffer.plantName}/><span>×{number(previewOffer.quantity)}</span></div>
        <div className="market-dialog-summary"><div><span>{t('market.nutritionPerUnit')}</span><strong><Heart className="text-[#c77860]"/>+{number(previewOffer.nutrition)}</strong></div><div><span>{t('market.balance')}</span><strong>{number(view.balance)} <Coins/></strong></div><div><span>{t('market.afterPurchase')}</span><strong>{view.balance >= previewOffer.totalPrice ? number(view.balance-previewOffer.totalPrice) : '—'} <Coins/></strong></div><div className="market-dialog-total"><span>{t('market.total')}</span><strong>{number(previewOffer.totalPrice)} <Coins/></strong></div></div>
        {feedback?.error && <p role="alert" className="market-notice">{t(feedback.key,feedback.vars || {})}</p>}
        {view.balance < previewOffer.totalPrice && <p className="market-dialog-hint">{t('market.needCoins',{amount:number(previewOffer.totalPrice-view.balance)})}</p>}
        <p className="market-dialog-hint">{t('market.packDestination')}</p>
        <div className="market-dialog-actions"><DialogClose asChild><button type="button" className="market-secondary">{t('market.notNow')}</button></DialogClose><button type="button" disabled={disabled || previewOffer.purchased || view.balance < previewOffer.totalPrice} onClick={confirmPurchase} className="market-primary"><ShoppingBasket/>{t(previewOffer.purchaseRejected ? 'market.retryPurchase' : 'market.confirmBuy')}</button></div>
      </DialogPrimitive.Content></DialogPortal>}
    </Dialog>
  </main>;
}
