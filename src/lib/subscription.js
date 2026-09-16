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
 * Retorna o email do utilizador autenticado ativo (Google ou Quinta).
 */
function getActiveUserEmail() {
  try {
    const rawGoogle = localStorage.getItem("hortaviva_google_user_info");
    if (rawGoogle) {
      const g = JSON.parse(rawGoogle);
      if (g && g.email) return g.email.toLowerCase().trim();
    }
  } catch {}
  try {
    const rawUser = localStorage.getItem("hortaviva_current_user");
    if (rawUser) {
      const u = JSON.parse(rawUser);
      if (u && u.email) return u.email.toLowerCase().trim();
    }
  } catch {}
  return null;
}

/**
 * Retorna o ID Google do utilizador ativo.
 */
function getActiveGoogleId() {
  try {
    const rawGoogle = localStorage.getItem("hortaviva_google_user_info");
    if (rawGoogle) {
      const g = JSON.parse(rawGoogle);
      return g?.id || g?.sub || null;
    }
  } catch {}
  return null;
}

/**
 * Retorna o escalão atual do utilizador: "pro", "plus" ou "free".
 */
export function getUserTier() {
  try {
    const isLoggedOut = localStorage.getItem("hortaviva_logged_out") === "true";
    const raw = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    if (!raw) return "free";
    const sub = JSON.parse(raw);
    if (!sub || sub.active !== true) return "free";

    // 1. Chave Master de Administrador ("hortaviva") funciona sempre
    if (sub.is_master || sub.plan === "lifetime") return "pro";

    // 2. Se o utilizador fez logout explícito, subscrições regulares ficam inativas
    if (isLoggedOut) return "free";

    // 3. Validação de posse por conta autenticada
    const activeEmail = getActiveUserEmail();
    const activeGoogleId = getActiveGoogleId();
    const subEmail = (sub.google_email || sub.customer_email || "").toLowerCase().trim();
    const subGoogleId = sub.google_id || null;

    // Se a subscrição estiver associada a um email e a sessão atual for de outro email, não ativar
    if (subEmail && activeEmail && subEmail !== activeEmail) {
      return "free";
    }
    // Se a subscrição estiver associada a um Google ID e a sessão for de outro Google ID, não ativar
    if (subGoogleId && activeGoogleId && subGoogleId !== activeGoogleId) {
      return "free";
    }

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
 * Retorna os detalhes da subscrição ativa ou null se inválida ou de outra conta.
 */
export function getSubscriptionDetails() {
  try {
    const isLoggedOut = localStorage.getItem("hortaviva_logged_out") === "true";
    const raw = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    if (!raw) return null;
    const sub = JSON.parse(raw);
    if (!sub || !sub.active) return null;

    // Chave Master funciona sempre
    if (sub.is_master || sub.plan === "lifetime") return sub;

    // Se fez logout explícito
    if (isLoggedOut) return null;

    // Validação de titularidade da conta
    const activeEmail = getActiveUserEmail();
    const activeGoogleId = getActiveGoogleId();
    const subEmail = (sub.google_email || sub.customer_email || "").toLowerCase().trim();
    const subGoogleId = sub.google_id || null;

    if (subEmail && activeEmail && subEmail !== activeEmail) return null;
    if (subGoogleId && activeGoogleId && subGoogleId !== activeGoogleId) return null;

    return sub;
  } catch {
    return null;
  }
}

export const getProSubscriptionDetails = getSubscriptionDetails;

/**
 * Ativa o Plano Plus (1,99€ / mês).
 */
/**
 * Ativa o Plano Plus (1,99€ / mês).
 * Requer validação por checkout Stripe, sincronização Google ou chave master.
 */
export function activatePlusSubscription(details = {}) {
  try {
    const isVerified =
      details.verified === true ||
      details.source === "stripe_checkout" ||
      details.source === "google_sync" ||
      details.source === "cloud_sync" ||
      Boolean(details.session_id);

    if (!isVerified) {
      console.warn("[Subscrição] Ativação rejeitada: introdução direta de email não verificada:", details.email);
      return false;
    }

    let googleUser = null;
    try {
      const rawUser = localStorage.getItem("hortaviva_google_user_info");
      if (rawUser) googleUser = JSON.parse(rawUser);
    } catch {}

    const subData = {
      active: true,
      plan: "plus",
      tier: "plus",
      price: "1.99€",
      currency: "eur",
      is_master: false,
      activated_at: details.activated_at || new Date().toISOString(),
      session_id: details.session_id || null,
      customer_email: details.email || googleUser?.email || null,
      google_id: details.google_id || googleUser?.id || null,
      google_email: details.google_email || googleUser?.email || null,
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
 * Requer validação por checkout Stripe, sincronização Google ou código master ("hortaviva").
 */
export function activateProSubscription(details = {}) {
  try {
    const emailRaw = (details.email || "").trim().toLowerCase();
    const normalized = emailRaw.replace(/\s+/g, "");
    const isMaster = normalized === "hortaviva";

    // Se pedir expressamente plus e não for master
    if (!isMaster && (details.tier === "plus" || details.plan === "plus")) {
      return activatePlusSubscription(details);
    }

    const isVerified =
      isMaster ||
      details.verified === true ||
      details.source === "stripe_checkout" ||
      details.source === "google_sync" ||
      details.source === "cloud_sync" ||
      Boolean(details.session_id);

    if (!isVerified) {
      console.warn("[Subscrição] Ativação rejeitada: introdução direta de email não verificada:", details.email);
      return false;
    }

    let googleUser = null;
    try {
      const rawUser = localStorage.getItem("hortaviva_google_user_info");
      if (rawUser) googleUser = JSON.parse(rawUser);
    } catch {}

    const subData = {
      active: true,
      plan: isMaster ? "lifetime" : (details.plan || "pro"),
      tier: "pro",
      price: isMaster ? "0.00€" : "2.99€",
      currency: "eur",
      is_master: isMaster,
      activated_at: details.activated_at || new Date().toISOString(),
      session_id: details.session_id || null,
      customer_email: isMaster ? "master@hortaviva.local" : (details.email || googleUser?.email || null),
      google_id: details.google_id || googleUser?.id || null,
      google_email: details.google_email || googleUser?.email || null,
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
 * Retorna o URL oficial de checkout Stripe, preenchendo automaticamente o email do utilizador Google se disponível.
 */
export function getCheckoutUrl(targetTier = "pro") {
  const base = targetTier === "plus" ? STRIPE_PLUS_PAYMENT_LINK : STRIPE_PAYMENT_LINK;
  try {
    const rawGoogle = typeof window !== "undefined" ? localStorage.getItem("hortaviva_google_user_info") : null;
    if (rawGoogle) {
      const g = JSON.parse(rawGoogle);
      if (g && g.email) {
        const sep = base.includes("?") ? "&" : "?";
        return `${base}${sep}prefilled_email=${encodeURIComponent(g.email)}`;
      }
    }
  } catch {}
  return base;
}

/**
 * Notifica a aplicação de alterações na subscrição ou quota e sincroniza na nuvem.
 */
function emitSubscriptionChange() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed"));
    window.dispatchEvent(
      new CustomEvent("hortaviva_data_changed", {
        detail: { storageKey: STORAGE_KEYS.PRO_SUBSCRIPTION },
      })
    );
  }
}

/**
 * Validação segura de código de ativação.
 * Apenas o código de administrador master ("hortaviva") permite ativação direta sem Google.
 */
export function validateAndActivateSubscription(codeOrEmail) {
  const trimmed = (codeOrEmail || "").trim().toLowerCase().replace(/\s+/g, "");
  if (!trimmed) {
    return { success: false, error: "Introduz um código de ativação válido." };
  }

  if (trimmed === "hortaviva") {
    activateProSubscription({ email: "hortaviva", is_master: true });
    return {
      success: true,
      tier: "pro",
      isMaster: true,
      message: "Acesso Master de Administrador ativado com sucesso!",
    };
  }

  return {
    success: false,
    needsGoogle: true,
    error: "Por motivos de segurança, subscrições regulares são vinculadas e restauradas através da tua Conta Google. Usa o botão 'Sincronizar com a Conta Google'.",
  };
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
      window.open(getCheckoutUrl("plus"), "_blank", "noopener,noreferrer");
    },
    openProCheckout: () => {
      window.open(getCheckoutUrl("pro"), "_blank", "noopener,noreferrer");
    },
    openCheckout: (targetTier = "pro") => {
      window.open(getCheckoutUrl(targetTier), "_blank", "noopener,noreferrer");
    },

    // Ações de ativação / cancelamento
    activatePlus: activatePlusSubscription,
    activatePro: activateProSubscription,
    cancelSubscription: cancelProSubscription,
    cancelPro: cancelProSubscription,
  };
}
