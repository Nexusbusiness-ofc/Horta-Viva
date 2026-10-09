import React from 'react';
import { Check, Coins, ShoppingBasket } from 'lucide-react';
import { useI18n } from '@/lib/I18nContext';
import ProduceIllustration from './ProduceIllustration';

export default function MarketOfferCard({ offer, balance, disabled, onBuy }) {
  const { t, locale } = useI18n();
  const number = value => new Intl.NumberFormat(locale).format(value);
  const shortfall = Math.max(0, offer.totalPrice - balance);
  return <article className={`market-crate ${offer.purchased ? 'is-bought' : ''}`}>
    <div className="market-crate-name"><h4>{t(offer.plantName)}</h4>{offer.purchased && <Check className="h-4 w-4" aria-hidden="true"/>}</div>
    <div className="market-crate-display">
      <ProduceIllustration foodKey={offer.foodKey} plantName={offer.plantName} className="market-produce"/>
      <span className="market-crate-quantity">×{number(offer.quantity)}<span className="sr-only"> {t('market.quantity',{quantity:number(offer.quantity)})}</span></span>
      <div className="market-crate-front" aria-hidden="true"><i/><i/><i/></div>
    </div>
    <div className="market-crate-action">
      <p className="market-crate-unit">{t('market.unitPrice',{price:number(offer.unitPrice)})}</p>
      <button type="button" onClick={event => onBuy(offer,event.currentTarget)} disabled={disabled || offer.purchased} aria-label={offer.purchased ? `${t(offer.plantName)}: ${t('market.bought')}` : t('market.inspectOffer',{food:t(offer.plantName),quantity:number(offer.quantity),price:number(offer.totalPrice)})} className={`market-price-button ${offer.purchased ? 'is-bought' : shortfall > 0 ? 'is-short' : ''}`}>
        {offer.purchased ? <><Check className="h-4 w-4"/>{t('market.bought')}</> : <><ShoppingBasket className="h-4 w-4"/><span>{number(offer.totalPrice)}</span><Coins className="h-4 w-4"/></>}
      </button>
      {!offer.purchased && shortfall > 0 && <p className="market-card-note">{t('market.needCoins',{amount:number(shortfall)})}</p>}
      {!offer.purchased && offer.purchaseRejected && <p className="market-card-note">{t('market.retryPurchase')}</p>}
    </div>
  </article>;
}
