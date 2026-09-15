import { useState, useEffect } from "react";

// Links de Checkout Stripe Oficiais
export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVqaEX0i272p92Mc5tfjG00"; // Pro: 2,99€ / mês (Ilimitado)
export const STRIPE_PLUS_PAYMENT_LINK = "https://buy.stripe.com/5kQ8wP8Oy1I5gvec5tfjG01"; // Plus: 1,99€ / mês (6 plantações, 5 animais, 3 fotos IA/mês, 4 chats IA/mês)

// Limites do Plano Gratuito (Base)
export const FREE_AI_LIMIT = 2;
export const FREE_IDENTIFICATION_LIMIT = 2;
export const FREE_PLANTATIONS_LIMIT = 3;
export const FREE_ANIMALS_LIMIT = 2;

// Limites do Plano Plus (1,99€ / mês)
export const PLUS_PLANTATIONS_LIMIT = 6;
export const PLUS_ANIMALS_LIMIT = 5;
export const PLUS_PHOTO_LIMIT = 3; // 3 usos mensais de fotos com IA
export const PLUS_AI_LIMIT = 4; // 4 usos mensais da IA

const STORAGE_KEYS = {
  AI_USAGE_COUNT: "hortaviva_ai_usage_count",
  USAGE_COUNT: "hortaviva_photo_identifications_count",
  PRO_SUBSCRIPTION: "hortaviva_pro_subscription",
  MONTHLY_USAGE: "hortaviva_monthly_usage_v2",
};

/**
 * Retorna a chave do mês atual no formato "AAAA-MM" (ex: "2026-09").
 */
export function getCurrentMonthKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

/**
 * Retorna o consumo de IA e fotos no mês corrente.
 * Reinicia automaticamente a contagem a zero se o mês mudar.
 */
export function getMonthlyUsage() {
  try {
    const currentMonth = getCurrentMonthKey();
    const raw = localStorage.getItem(STORAGE_KEYS.MONTHLY_USAGE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.month === currentMonth) {
        return {
          month: currentMonth,
          photos: Number(parsed.photos) || 0,
          ai: Number(parsed.ai) || 0,
        };
      }
    }
    const initial = { month: currentMonth, photos: 0, ai: 0 };
    localStorage.setItem(STORAGE_KEYS.MONTHLY_USAGE, JSON.stringify(initial));
    return initial;
  } catch {
    return { month: getCurrentMonthKey(), photos: 0, ai: 0 };
  }
}

/**
 * Retorna o número total de utilizações gratuitas de IA/fotos (retrocompatibilidade).
 */
export function getAIUsageCount() {
  try {
    const aiVal = localStorage.getItem(STORAGE_KEYS.AI_USAGE_COUNT);
    if (aiVal !== null) {
      return parseInt(aiVal, 10) || 0;
    }
    const legacyVal = localStorage.getItem(STORAGE_KEYS.USAGE_COUNT);
    return legacyVal ? parseInt(legacyVal, 10) || 0 : 0;
  } catch {
    return 0;
  }
}

export function getPhotoUsageCount() {
  return getAIUsageCount();
}

function incrementLegacyCounts() {
  try {
    const current = getAIUsageCount();
    const updated = current + 1;
    localStorage.setItem(STORAGE_KEYS.AI_USAGE_COUNT, updated.toString());
    localStorage.setItem(STORAGE_KEYS.USAGE_COUNT, updated.toString());
  } catch {}
}

/**
 * Incrementa o número de fotos identificadas no mês atual.
 */
export function incrementPhotoUsage() {
  try {
    const currentMonth = getCurrentMonthKey();
    const usage = getMonthlyUsage();
    const updated = {
      month: currentMonth,
      photos: (usage.photos || 0) + 1,
      ai: usage.ai || 0,
    };
    localStorage.setItem(STORAGE_KEYS.MONTHLY_USAGE, JSON.stringify(updated));
    incrementLegacyCounts();
    emitSubscriptionChange();
    return updated.photos;
  } catch {
    return 1;
  }
}

/**
 * Incrementa o número de perguntas ao Assistente IA no mês atual.
 */
export function incrementAIUsage() {
  try {
    const currentMonth = getCurrentMonthKey();
    const usage = getMonthlyUsage();
    const updated = {
      month: currentMonth,
      photos: usage.photos || 0,
      ai: (usage.ai || 0) + 1,
    };
    localStorage.setItem(STORAGE_KEYS.MONTHLY_USAGE, JSON.stringify(updated));
    incrementLegacyCounts();
    emitSubscriptionChange();
    return updated.ai;
  } catch {
    return 1;
  }
}

/**
 * Retorna o escalão atual do utilizador: "pro", "plus" ou "free".
 */
export function getUserTier() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    if (!raw) return "free";
    const sub = JSON.parse(raw);
    if (!sub || sub.active !== true) return "free";
    if (sub.is_master || sub.plan === "lifetime") return "pro";
    if (sub.tier === "plus" || sub.plan === "plus" || sub.price === "1.99€") return "plus";
    return "pro";
  } catch {
    return "free";
  }
}

/**
 * Verifica se o utilizador possui o plano Pro (2,99€ ou Vitalício) ativo.
 */
export function isProSubscriber() {
  return getUserTier() === "pro";
}

/**
 * Verifica se o utilizador possui o plano Plus (1,99€) ativo.
 */
export function isPlusSubscriber() {
  return getUserTier() === "plus";
}

/**
 * Verifica se o utilizador possui qualquer subscrição paga ativa (Pro ou Plus).
 */
export function isPaidSubscriber() {
  const tier = getUserTier();
  return tier === "pro" || tier === "plus";
}

/**
 * Retorna os detalhes da subscrição ativa ou null.
 */
export function getSubscriptionDetails() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export const getProSubscriptionDetails = getSubscriptionDetails;

/**
 * Ativa o Plano Plus (1,99€ / mês).
 */
export function activatePlusSubscription(details = {}) {
  try {
    const subData = {
      active: true,
      plan: "plus",
      tier: "plus",
      price: "1.99€",
      currency: "eur",
      is_master: false,
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
 * Ativa a subscrição Pro (2,99€ / mês ou Vitalício para administrador).
 */
export function activateProSubscription(details = {}) {
  try {
    const emailRaw = (details.email || "").trim().toLowerCase();
    const normalized = emailRaw.replace(/\s+/g, "");
    const isMaster = normalized === "hortaviva";

    // Se não for master e o detalhe pedir expressamente plus
    if (!isMaster && (details.tier === "plus" || details.plan === "plus")) {
      return activatePlusSubscription(details);
    }

    const subData = {
      active: true,
      plan: isMaster ? "lifetime" : (details.plan || "pro"),
      tier: "pro",
      price: isMaster ? "0.00€" : "2.99€",
      currency: "eur",
      is_master: isMaster,
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
 * Cancela ou remove a subscrição no dispositivo local.
 */
export function cancelSubscription() {
  try {
    localStorage.removeItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    emitSubscriptionChange();
    return true;
  } catch {
    return false;
  }
}

export const cancelProSubscription = cancelSubscription;

/**
 * Verifica se o utilizador pode efetuar mais uma identificação de planta por fotografia.
 * - Pro: ilimitado
 * - Plus (1,99€): até 3 fotos por mês
 * - Grátis: até 2 fotos de teste
 */
export function canUsePhotoIdentification() {
  const tier = getUserTier();
  if (tier === "pro") return true;
  if (tier === "plus") {
    const monthly = getMonthlyUsage();
    return monthly.photos < PLUS_PHOTO_LIMIT;
  }
  return getPhotoUsageCount() < FREE_IDENTIFICATION_LIMIT;
}

/**
 * Verifica se o utilizador pode efetuar mais uma pergunta ao Assistente IA.
 * - Pro: ilimitado
 * - Plus (1,99€): até 4 utilizações por mês
 * - Grátis: até 2 utilizações de teste
 */
export function canUseAI() {
  const tier = getUserTier();
  if (tier === "pro") return true;
  if (tier === "plus") {
    const monthly = getMonthlyUsage();
    return monthly.ai < PLUS_AI_LIMIT;
  }
  return getAIUsageCount() < FREE_AI_LIMIT;
}

/**
 * Verifica se o utilizador pode adicionar mais uma plantação à Minha Quinta.
 * - Pro: ilimitado
 * - Plus (1,99€): até 6 plantações
 * - Grátis: até 3 plantações
 */
export function canAddPlantation(currentCount = 0) {
  const tier = getUserTier();
  if (tier === "pro") return true;
  if (tier === "plus") return currentCount < PLUS_PLANTATIONS_LIMIT;
  return currentCount < FREE_PLANTATIONS_LIMIT;
}

/**
 * Verifica se o utilizador pode adicionar mais um animal à Minha Quinta.
 * - Pro: ilimitado
 * - Plus (1,99€): até 5 animais
 * - Grátis: até 2 animais
 */
export function canAddAnimal(currentCount = 0) {
  const tier = getUserTier();
  if (tier === "pro") return true;
  if (tier === "plus") return currentCount < PLUS_ANIMALS_LIMIT;
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
  const [tier, setTier] = useState(getUserTier());
  const [subDetails, setSubDetails] = useState(getSubscriptionDetails());
  const [monthlyUsage, setMonthlyUsage] = useState(getMonthlyUsage());
  const [aiUsageCount, setAiUsageCount] = useState(getAIUsageCount());

  const syncState = () => {
    setTier(getUserTier());
    setSubDetails(getSubscriptionDetails());
    setMonthlyUsage(getMonthlyUsage());
    setAiUsageCount(getAIUsageCount());
  };

  useEffect(() => {
    window.addEventListener("hortaviva_subscription_changed", syncState);
    window.addEventListener("storage", syncState);
    return () => {
      window.removeEventListener("hortaviva_subscription_changed", syncState);
      window.removeEventListener("storage", syncState);
    };
  }, []);

  const isPro = tier === "pro";
  const isPlus = tier === "plus";
  const isPaid = isPro || isPlus;

  const plantationsLimit = isPro ? Infinity : isPlus ? PLUS_PLANTATIONS_LIMIT : FREE_PLANTATIONS_LIMIT;
  const animalsLimit = isPro ? Infinity : isPlus ? PLUS_ANIMALS_LIMIT : FREE_ANIMALS_LIMIT;
  const photoLimit = isPro ? Infinity : isPlus ? PLUS_PHOTO_LIMIT : FREE_IDENTIFICATION_LIMIT;
  const aiLimit = isPro ? Infinity : isPlus ? PLUS_AI_LIMIT : FREE_AI_LIMIT;

  const currentPhotosUsed = isPlus ? monthlyUsage.photos : aiUsageCount;
  const currentAIUsed = isPlus ? monthlyUsage.ai : aiUsageCount;

  const remainingPhotos = isPro ? Infinity : Math.max(0, photoLimit - currentPhotosUsed);
  const remainingAI = isPro ? Infinity : Math.max(0, aiLimit - currentAIUsed);

  const userCanIdentify = canUsePhotoIdentification();
  const userCanUseAI = canUseAI();

  return {
    tier,
    isPro,
    isPlus,
    isPaid,
    subDetails,
    monthlyUsage,

    // Limites de cada recurso
    plantationsLimit,
    animalsLimit,
    photoLimit,
    aiLimit,
    freePlantationsLimit: FREE_PLANTATIONS_LIMIT,
    freeAnimalsLimit: FREE_ANIMALS_LIMIT,
    freeAILimit: FREE_AI_LIMIT,
    freeLimit: FREE_AI_LIMIT,
    plusPlantationsLimit: PLUS_PLANTATIONS_LIMIT,
    plusAnimalsLimit: PLUS_ANIMALS_LIMIT,
    plusPhotoLimit: PLUS_PHOTO_LIMIT,
    plusAILimit: PLUS_AI_LIMIT,

    // Contagens de uso
    currentPhotosUsed,
    currentAIUsed,
    aiUsageCount,
    usageCount: currentPhotosUsed,

    // Restantes
    remainingPhotos,
    remainingAI,
    remainingFreeAI: remainingAI,
    remainingFree: remainingPhotos,

    // Autorizações de ação
    canIdentify: userCanIdentify,
    canUseAI: userCanUseAI,
    canAddPlantation: (count = 0) => canAddPlantation(count),
    canAddAnimal: (count = 0) => canAddAnimal(count),

    // Abertura de checkout Stripe
    openPlusCheckout: () => {
      window.open(STRIPE_PLUS_PAYMENT_LINK, "_blank", "noopener,noreferrer");
    },
    openProCheckout: () => {
      window.open(STRIPE_PAYMENT_LINK, "_blank", "noopener,noreferrer");
    },
    openCheckout: (targetTier = "pro") => {
      const url = targetTier === "plus" ? STRIPE_PLUS_PAYMENT_LINK : STRIPE_PAYMENT_LINK;
      window.open(url, "_blank", "noopener,noreferrer");
    },

    // Ações de ativação / cancelamento
    activatePlus: activatePlusSubscription,
    activatePro: activateProSubscription,
    cancelSubscription: cancelProSubscription,
    cancelPro: cancelProSubscription,
  };
}
