import { useState, useEffect } from "react";

export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/eVqaEX0i272p92Mc5tfjG00";
export const FREE_AI_LIMIT = 2;
export const FREE_IDENTIFICATION_LIMIT = 2;
export const FREE_PLANTATIONS_LIMIT = 3;
export const FREE_ANIMALS_LIMIT = 2;

const STORAGE_KEYS = {
  AI_USAGE_COUNT: "hortaviva_ai_usage_count",
  USAGE_COUNT: "hortaviva_photo_identifications_count",
  PRO_SUBSCRIPTION: "hortaviva_pro_subscription",
};

/**
 * Retorna o número de utilizações de IA (chat ou fotos) já realizadas pelo utilizador.
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

/**
 * Retorna o número de identificações fotográficas já realizadas (compatibilidade).
 */
export function getPhotoUsageCount() {
  return getAIUsageCount();
}

/**
 * Incrementa o número de utilizações de IA (chat ou foto).
 */
export function incrementAIUsage() {
  try {
    const current = getAIUsageCount();
    const updated = current + 1;
    localStorage.setItem(STORAGE_KEYS.AI_USAGE_COUNT, updated.toString());
    localStorage.setItem(STORAGE_KEYS.USAGE_COUNT, updated.toString());
    emitSubscriptionChange();
    return updated;
  } catch {
    return 1;
  }
}

/**
 * Incrementa o número de fotos identificadas (alias para incrementAIUsage).
 */
export const incrementPhotoUsage = incrementAIUsage;

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
 * Retorna os detalhes da subscrição Pro ativa ou null.
 */
export function getProSubscriptionDetails() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Ativa a subscrição Pro no dispositivo local.
 * Suporta modo Administrador gratuito vitalício.
 */
export function activateProSubscription(details = {}) {
  try {
    const emailRaw = (details.email || "").trim().toLowerCase();
    const isAdmin = Boolean(
      details.is_admin === true ||
      emailRaw === "admin" ||
      emailRaw === "andre" ||
      emailRaw === "hortaviva" ||
      emailRaw.includes("admin") ||
      emailRaw.includes("hortaviva")
    );

    const subData = {
      active: true,
      plan: isAdmin ? "admin_lifetime" : (details.plan || "monthly"),
      price: isAdmin ? "0.00€ (Acesso Administrador)" : "2.99€",
      currency: "eur",
      is_admin: isAdmin,
      activated_at: new Date().toISOString(),
      session_id: details.session_id || null,
      customer_email: details.email || (isAdmin ? "admin@hortaviva.pt" : null),
    };
    localStorage.setItem(STORAGE_KEYS.PRO_SUBSCRIPTION, JSON.stringify(subData));
    emitSubscriptionChange();
    return true;
  } catch {
    return false;
  }
}

/**
 * Ativa diretamente o plano Pro gratuito de Administrador.
 */
export function activateAdminPro(adminEmail = "admin@hortaviva.pt") {
  return activateProSubscription({ email: adminEmail, is_admin: true });
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
 * Verifica se o utilizador pode efetuar mais uma chamada de IA (chat ou foto).
 * Retorna true se for Pro OU se ainda tiver utilizações gratuitas (< FREE_AI_LIMIT = 2).
 */
export function canUseAI() {
  if (isProSubscriber()) return true;
  return getAIUsageCount() < FREE_AI_LIMIT;
}

/**
 * Alias de retrocompatibilidade para identificação fotográfica.
 */
export const canUsePhotoIdentification = canUseAI;

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
  const [aiUsageCount, setAiUsageCount] = useState(getAIUsageCount());
  const [subDetails, setSubDetails] = useState(getProSubscriptionDetails());

  const syncState = () => {
    setIsPro(isProSubscriber());
    setAiUsageCount(getAIUsageCount());
    setSubDetails(getProSubscriptionDetails());
  };

  useEffect(() => {
    // Verificação automática de URL de administrador ou sucesso de pagamento
    if (typeof window !== "undefined") {
      const hash = window.location.hash || "";
      const search = window.location.search || "";
      if (
        hash.includes("admin=true") || 
        hash.includes("admin_pro=true") || 
        search.includes("admin=true") || 
        search.includes("admin_pro=true")
      ) {
        activateAdminPro();
      }
    }

    window.addEventListener("hortaviva_subscription_changed", syncState);
    window.addEventListener("storage", syncState);
    return () => {
      window.removeEventListener("hortaviva_subscription_changed", syncState);
      window.removeEventListener("storage", syncState);
    };
  }, []);

  const remainingFreeAI = Math.max(0, FREE_AI_LIMIT - aiUsageCount);
  const userCanUseAI = isPro || remainingFreeAI > 0;
  const isAdminPro = isPro && (subDetails?.is_admin === true || subDetails?.plan === "admin_lifetime");

  return {
    isPro,
    isAdminPro,
    subDetails,
    aiUsageCount,
    usageCount: aiUsageCount,
    remainingFreeAI,
    remainingFree: remainingFreeAI,
    canUseAI: userCanUseAI,
    canIdentify: userCanUseAI,
    freeAILimit: FREE_AI_LIMIT,
    freeLimit: FREE_AI_LIMIT,
    freePlantationsLimit: FREE_PLANTATIONS_LIMIT,
    freeAnimalsLimit: FREE_ANIMALS_LIMIT,
    canAddPlantation: (count = 0) => isPro || count < FREE_PLANTATIONS_LIMIT,
    canAddAnimal: (count = 0) => isPro || count < FREE_ANIMALS_LIMIT,
    openCheckout: () => {
      window.open(STRIPE_PAYMENT_LINK, "_blank", "noopener,noreferrer");
    },
    activatePro: activateProSubscription,
    activateAdminPro,
    cancelPro: cancelProSubscription,
  };
}
