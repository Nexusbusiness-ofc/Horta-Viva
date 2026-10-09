import React from 'react';
import { Check, Coins, ShoppingBasket } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';

export default function MarketOfferCard({ offer, balance, disabled, onBuy }) {
  const { t, locale } = useI18n();
  const number = value => new Intl.NumberFormat(locale).format(value);
  const shortfall = Math.max(0, offer.totalPrice - balance);
  return <article className={`flex min-w-0 flex-col overflow-hidden rounded-[1.4rem] border bg-white transition-shadow ${offer.purchased ? 'border-stone-200/70' : 'border-[#e7decb] hover:shadow-lg hover:shadow-stone-200/40'}`}>
    <div className={`relative flex h-28 items-center justify-center ${offer.purchased ? 'bg-stone-50' : 'bg-gradient-to-br from-[#f4f3df] via-[#f9f4e6] to-[#f2ead7]'}`}>
      <span aria-hidden="true" className={`text-5xl ${offer.purchased ? 'opacity-45' : ''}`}>{offer.emoji}</span>
      <span className="absolute bottom-2 right-2 rounded-full border border-white bg-white/85 px-2 py-1 text-[10px] font-bold text-[#7f714b]">{t('market.quantity',{quantity:number(offer.quantity)})}</span>
      {offer.purchased && <span className="absolute left-2 top-2 rounded-full bg-emerald-700 p-1.5 text-white"><Check className="h-3 w-3"/></span>}
    </div>
    <div className="flex flex-1 flex-col p-3.5">
      <h4 className="text-sm font-black text-stone-800">{t(offer.plantName)}</h4>
      <p className="mt-1 text-[10px] font-medium text-stone-500">{t(`market.difficulty.${offer.difficulty}`)}</p>
      <div className="mt-3 flex items-center gap-1.5 text-[#9d7d35]"><Coins className="h-4 w-4"/><span className="text-base font-black">{number(offer.totalPrice)}</span><span className="text-[10px] text-stone-400">{t('market.currency')}</span></div>
      <p className="mt-0.5 text-[10px] text-stone-400">{t('market.unitPrice',{price:number(offer.unitPrice)})}</p>
      <button type="button" onClick={() => onBuy(offer)} disabled={disabled || offer.purchased || shortfall > 0} className={`mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl px-2 py-2.5 text-xs font-bold transition-colors ${offer.purchased ? 'bg-emerald-50 text-emerald-700' : 'bg-[#37664b] text-white hover:bg-emerald-800 disabled:bg-stone-100 disabled:text-stone-400'}`}>
        {offer.purchased ? <Check className="h-3.5 w-3.5"/> : <ShoppingBasket className="h-3.5 w-3.5"/>}{t(offer.purchased ? 'market.bought' : offer.purchaseRejected ? 'market.retryPurchase' : 'market.buy')}
      </button>
      {!offer.purchased && shortfall > 0 && <p className="mt-1.5 text-center text-[10px] text-stone-400">{t('market.needCoins',{amount:number(shortfall)})}</p>}
      {!offer.purchased && offer.purchaseRejected && <p className="mt-1.5 text-center text-[10px] leading-relaxed text-amber-700">{t('market.previousRejectedPurchase')}</p>}
    </div>
  </article>;
}
