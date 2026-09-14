import { useState, useEffect } from "react";

export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVqaEX0i272p92Mc5tfjG00";
export const FREE_IDENTIFICATION_LIMIT = 1;
export const FREE_PLANTATIONS_LIMIT = 3;
export const FREE_ANIMALS_LIMIT = 2;

const STORAGE_KEYS = {
  USAGE_COUNT: "hortaviva_photo_identifications_count",
  PRO_SUBSCRIPTION: "hortaviva_pro_subscription",
};

/**
 * Retorna o número de identificações fotográficas já realizadas pelo utilizador.
 */
export function getPhotoUsageCount() {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.USAGE_COUNT);
    return val ? parseInt(val, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

/**
 * Incrementa o número de fotos identificadas.
 */
export function incrementPhotoUsage() {
  try {
    const current = getPhotoUsageCount();
    const updated = current + 1;
    localStorage.setItem(STORAGE_KEYS.USAGE_COUNT, updated.toString());
    emitSubscriptionChange();
    return updated;
  } catch {
    return 1;
  }
}

/**
 * Verifica se o utilizador possui o plano Pro ativo.
 */
export function isProSubscriber() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    if (!raw) return false;
    const sub = JSON.parse(raw);
    return sub && sub.active === true;
  } catch {
    return false;
  }
}

/**
 * Ativa a subscrição Pro no dispositivo local.
 */
export function activateProSubscription(details = {}) {
  try {
    const subData = {
      active: true,
      plan: "monthly",
      price: "2.99€",
      currency: "eur",
      activated_at: new Date().toISOString(),
      session_id: details.session_id || null,
      customer_email: details.email || null,
    };
    localStorage.setItem(STORAGE_KEYS.PRO_SUBSCRIPTION, JSON.stringify(subData));
    emitSubscriptionChange();
    return true;
  } catch {
    return false;
  }
}

/**
 * Cancela ou desativa o estado Pro no dispositivo local.
 */
export function cancelProSubscription() {
  try {
    localStorage.removeItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    emitSubscriptionChange();
    return true;
  } catch {
    return false;
  }
}

/**
 * Verifica se o utilizador pode efetuar mais uma identificação fotográfica.
 * Retorna true se for Pro OU se ainda tiver o 1 uso gratuito.
 */
export function canUsePhotoIdentification() {
  if (isProSubscriber()) return true;
  return getPhotoUsageCount() < FREE_IDENTIFICATION_LIMIT;
}

/**
 * Verifica se o utilizador pode adicionar mais uma plantação à Minha Quinta.
 * Retorna true se for Pro OU se o total for inferior a FREE_PLANTATIONS_LIMIT (3).
 */
export function canAddPlantation(currentCount = 0) {
  if (isProSubscriber()) return true;
  return currentCount < FREE_PLANTATIONS_LIMIT;
}

/**
 * Verifica se o utilizador pode adicionar mais um animal à Minha Quinta.
 * Retorna true se for Pro OU se o total for inferior a FREE_ANIMALS_LIMIT (2).
 */
export function canAddAnimal(currentCount = 0) {
  if (isProSubscriber()) return true;
  return currentCount < FREE_ANIMALS_LIMIT;
}

/**
 * Notifica a aplicação de alterações na subscrição ou quota.
 */
function emitSubscriptionChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed"));
  }
}

/**
 * Hook do React para acompanhar em tempo real o estado da subscrição e quota.
 */
export function useSubscription() {
  const [isPro, setIsPro] = useState(isProSubscriber());
  const [usageCount, setUsageCount] = useState(getPhotoUsageCount());

  const syncState = () => {
    setIsPro(isProSubscriber());
    setUsageCount(getPhotoUsageCount());
  };

  useEffect(() => {
    window.addEventListener("hortaviva_subscription_changed", syncState);
    window.addEventListener("storage", syncState);
    return () => {
      window.removeEventListener("hortaviva_subscription_changed", syncState);
      window.removeEventListener("storage", syncState);
    };
  }, []);

  const remainingFree = Math.max(0, FREE_IDENTIFICATION_LIMIT - usageCount);
  const canIdentify = isPro || remainingFree > 0;

  return {
    isPro,
    usageCount,
    remainingFree,
    canIdentify,
    freeLimit: FREE_IDENTIFICATION_LIMIT,
    freePlantationsLimit: FREE_PLANTATIONS_LIMIT,
    freeAnimalsLimit: FREE_ANIMALS_LIMIT,
    canAddPlantation: (count = 0) => isPro || count < FREE_PLANTATIONS_LIMIT,
    canAddAnimal: (count = 0) => isPro || count < FREE_ANIMALS_LIMIT,
    openCheckout: () => {
      window.open(STRIPE_PAYMENT_LINK, "_blank", "noopener,noreferrer");
    },
    activatePro: activateProSubscription,
  };
}
