import { DEFAULT_PLANTS } from "./plantsData.js";
import { DEFAULT_ANIMALS, DEFAULT_MUSHROOMS, DEFAULT_PODAS, DEFAULT_MONDAS } from "./catalogData.js";
import { callGemini } from "./aiService.js";

const STORAGE_KEYS = {
  PLANTINGS: "hortaviva_plantings",
  MY_ANIMALS: "hortaviva_myanimals",
  REMINDERS: "hortaviva_reminders",
  USER: "hortaviva_current_user",
  TOKEN: "base44_access_token",
  LOGGED_OUT: "hortaviva_logged_out",
  PRO_SUBSCRIPTION: "hortaviva_pro_subscription",
};

export const DEFAULT_USER = {
  id: "user_local_quinta",
  full_name: "Minha Quinta",
  email: "quinta@hortaviva.local",
  farm_name: "Minha Quinta",
  farmer_type: "Agricultura biológica",
  experience_years: 2,
  avatar_emoji: "🌱",
  avatar_url: "",
  favorite_crops: "Tomate, Alface, Morango, Cenoura",
  favorite_season: "Primavera",
  bio: "A minha horta e animais biológicos em harmonia com a natureza.",
  role: "admin",
};

class LocalEntityStore {
  constructor(storageKey, idPrefix) {
    this.storageKey = storageKey;
    this.idPrefix = idPrefix;
  }

  _getItems() {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  _setItems(items) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("hortaviva_data_changed", {
            detail: { storageKey: this.storageKey },
          })
        );
      }
    } catch (e) {
      console.error(`Erro ao guardar em ${this.storageKey}:`, e);
    }
  }

  async list(sortField) {
    const items = this._getItems();
    if (!sortField) return [...items];

    const isDesc = sortField.startsWith("-");
    const field = isDesc ? sortField.slice(1) : sortField;

    return [...items].sort((a, b) => {
      const valA = a[field] ?? "";
      const valB = b[field] ?? "";
      if (valA < valB) return isDesc ? 1 : -1;
      if (valA > valB) return isDesc ? -1 : 1;
      return 0;
    });
  }

  async get(id) {
    const items = this._getItems();
    const item = items.find((i) => i.id === id);
    if (!item) throw new Error(`Item ${id} não encontrado.`);
    return { ...item };
  }

  async create(data) {
    const items = this._getItems();
    const newItem = {
      id: `${this.idPrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      created_date: new Date().toISOString(),
      ...data,
    };
    items.unshift(newItem);
    this._setItems(items);
    return { ...newItem };
  }

  async update(id, data) {
    const items = this._getItems();
    const index = items.findIndex((i) => i.id === id);

    if (index === -1) {
      const created = {
        id,
        created_date: new Date().toISOString(),
        ...data,
      };
      items.unshift(created);
      this._setItems(items);
      return { ...created };
    }

    const updated = {
      ...items[index],
      ...data,
      updated_date: new Date().toISOString(),
    };
    items[index] = updated;
    this._setItems(items);
    return { ...updated };
  }

  async delete(id) {
    const items = this._getItems();
    const filtered = items.filter((i) => i.id !== id);
    this._setItems(filtered);
    this._recordDeletion(id);
    return { id, success: true };
  }

  _recordDeletion(id) {
    try {
      const raw = localStorage.getItem("hortaviva_deleted_ids");
      const deleted = raw ? JSON.parse(raw) : {};
      deleted[id] = Date.now();
      localStorage.setItem("hortaviva_deleted_ids", JSON.stringify(deleted));
    } catch {}
  }
}

class ReadOnlyCatalogStore {
  constructor(data) {
    this.data = Array.isArray(data) ? data : [];
  }

  async list() {
    return [...this.data];
  }

  async get(id) {
    const item = this.data.find((i) => i.id === id);
    return item ? { ...item } : null;
  }

  async filter(predicate) {
    if (typeof predicate === "function") {
      return this.data.filter(predicate);
    }
    return [...this.data];
  }
}

// Singletons para cada entidade
export const localEntities = {
  Planting: new LocalEntityStore(STORAGE_KEYS.PLANTINGS, "plant"),
  MyAnimal: new LocalEntityStore(STORAGE_KEYS.MY_ANIMALS, "anim"),
  Reminder: new LocalEntityStore(STORAGE_KEYS.REMINDERS, "rem"),
  Plant: new ReadOnlyCatalogStore(DEFAULT_PLANTS),
  FarmAnimal: new ReadOnlyCatalogStore(DEFAULT_ANIMALS),
  Mushroom: new ReadOnlyCatalogStore(DEFAULT_MUSHROOMS),
  Podas: new ReadOnlyCatalogStore(DEFAULT_PODAS),
  Mondas: new ReadOnlyCatalogStore(DEFAULT_MONDAS),
};

export const localAuth = {
  me: async () => {
    try {
      const isLoggedOut = localStorage.getItem(STORAGE_KEYS.LOGGED_OUT) === "true";
      const googleRaw = localStorage.getItem("hortaviva_google_user_info");

      // 1. Se tem conta Google associada e não foi feito logout explícito, prioridade máxima
      if (googleRaw && !isLoggedOut) {
        const g = JSON.parse(googleRaw);
        let existing = null;
        try {
          const raw = localStorage.getItem(STORAGE_KEYS.USER);
          if (raw) existing = JSON.parse(raw);
        } catch {}

        const name = g.name || existing?.full_name || "Agricultor Google";
        const firstName = name.split(" ")[0] || "Cultivo";
        const googleUser = {
          ...(existing || {}),
          id: g.id || g.sub || existing?.id || "google_user",
          full_name: name,
          email: g.email || existing?.email || "agricultor@gmail.com",
          avatar_url: g.picture || existing?.avatar_url || "",
          avatar_emoji: existing?.avatar_emoji || "🌾",
          farm_name: existing?.farm_name || `Quinta de ${firstName}`,
          farmer_type: existing?.farmer_type || "Agricultura biológica",
          experience_years: existing?.experience_years ?? 2,
          role: "admin",
          auth_provider: "google",
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(googleUser));
        return googleUser;
      }

      // 2. Se o utilizador fez logout explícito
      if (isLoggedOut) {
        return null;
      }

      // 3. Utilizador guardado localmente (se existir)
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (raw) {
        return JSON.parse(raw);
      }

      // 4. Sem sessão ativa
      return null;
    } catch {
      return null;
    }
  },

  loginWithGoogleUser: (googleProfile, accessToken) => {
    let existing = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (raw) existing = JSON.parse(raw);
    } catch {}

    // Se o utilizador anterior tinha outro email, não herdar dados do perfil antigo
    if (existing?.email && googleProfile?.email && existing.email.toLowerCase() !== googleProfile.email.toLowerCase()) {
      existing = null;
    }

    const name = googleProfile.name || googleProfile.full_name || existing?.full_name || "Agricultor Google";
    const firstName = name.split(" ")[0] || "Cultivo";

    const user = {
      ...(existing || {}),
      id: googleProfile.sub || googleProfile.id || existing?.id || `google_${Date.now()}`,
      full_name: name,
      email: googleProfile.email || existing?.email || "agricultor@gmail.com",
      avatar_url: googleProfile.picture || googleProfile.avatar_url || existing?.avatar_url || "",
      avatar_emoji: existing?.avatar_emoji || "🌾",
      farm_name: existing?.farm_name || `Quinta de ${firstName}`,
      farmer_type: existing?.farmer_type || "Agricultura biológica",
      experience_years: existing?.experience_years ?? 2,
      role: "admin",
      auth_provider: "google",
    };
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      if (accessToken) {
        localStorage.setItem(STORAGE_KEYS.TOKEN, accessToken);
      }
      localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    } catch {}

    // Garantir que a subscrição em localStorage pertence estritamente a este novo perfil Google
    try {
      const rawSub = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
      if (rawSub) {
        const sub = JSON.parse(rawSub);
        const subEmail = (sub.google_email || sub.customer_email || "").toLowerCase().trim();
        const profileEmail = (googleProfile?.email || "").toLowerCase().trim();
        if (!profileEmail || !subEmail || subEmail !== profileEmail) {
          localStorage.removeItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hortaviva_auth_changed", { detail: { user } }));
      window.dispatchEvent(new CustomEvent("hortaviva_sync_change", { detail: { status: "synced", connected: true, user } }));
      window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed"));
    }
    return user;
  },

  updateMe: async (data) => {
    try {
      const current = (await localAuth.me()) || DEFAULT_USER;
      const updated = {
        ...current,
        ...data,
        updated_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(updated));
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("hortaviva_auth_changed", { detail: { user: updated } }));
        window.dispatchEvent(new CustomEvent("hortaviva_data_changed", { detail: { storageKey: STORAGE_KEYS.USER } }));
      }
      return updated;
    } catch (e) {
      console.error("Erro ao atualizar utilizador:", e);
      return data;
    }
  },

  loginWithProvider: (provider, fromUrl = "/") => {
    const isGoogle = provider === "google";
    const googleUser = {
      id: "user_google_local",
      full_name: isGoogle ? "Agricultor Google" : "Utilizador Quinta",
      email: isGoogle ? "agricultor@gmail.com" : "utilizador@hortaviva.local",
      farm_name: "Minha Quinta",
      farmer_type: "Agricultura biológica",
      experience_years: 2,
      avatar_emoji: "🌾",
      avatar_url: "",
      favorite_crops: "Tomate, Alface, Morango, Cenoura",
      favorite_season: "Primavera",
      bio: isGoogle ? "Sessão iniciada via Google." : "Sessão iniciada na Quinta.",
      role: "admin",
    };

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(googleUser));
      localStorage.setItem(STORAGE_KEYS.TOKEN, `google_token_${Date.now()}`);
      localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    } catch {}

    const target = fromUrl && fromUrl.startsWith("/") ? fromUrl : "/";
    window.location.hash = `#${target}`;
  },

  loginAsGuest: (fromUrl = "/") => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      localStorage.setItem(STORAGE_KEYS.TOKEN, `guest_token_${Date.now()}`);
      localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hortaviva_auth_changed", { detail: { user: DEFAULT_USER } }));
      window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed"));
    }

    const target = fromUrl && fromUrl.startsWith("/") ? fromUrl : "/";
    window.location.hash = `#${target}`;
  },

  loginViaEmailPassword: async (email, password) => {
    const namePart = (email || "utilizador").split("@")[0];
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const user = {
      id: `user_${Date.now().toString(36)}`,
      full_name: formattedName,
      email: email || "quinta@hortaviva.local",
      farm_name: `Quinta de ${formattedName}`,
      farmer_type: "Agricultura biológica",
      experience_years: 1,
      avatar_emoji: "🌱",
      avatar_url: "",
      favorite_crops: "Tomate, Couve, Cenoura",
      favorite_season: "Primavera",
      bio: "Agricultor da Horta Viva.",
      role: "admin",
    };

    try {
      const rawSub = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
      if (rawSub) {
        const sub = JSON.parse(rawSub);
        const subEmail = (sub.google_email || sub.customer_email || "").toLowerCase().trim();
        const activeEmail = (user.email || "").toLowerCase().trim();
        if (!activeEmail || !subEmail || subEmail !== activeEmail) {
          localStorage.removeItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    }

    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, `token_${Date.now()}`);
      localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hortaviva_auth_changed", { detail: { user } }));
      window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed"));
    }

    return user;
  },

  register: async ({ email, password }) => {
    return localAuth.loginViaEmailPassword(email, password);
  },

  verifyOtp: async () => {
    return { access_token: `otp_token_${Date.now()}` };
  },

  resendOtp: async () => {
    return { success: true };
  },

  resetPasswordRequest: async () => {
    return { success: true };
  },

  resetPassword: async () => {
    return { success: true };
  },

  logout: (redirectUrl) => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PRO_SUBSCRIPTION);

      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem("hortaviva_google_access_token");
      localStorage.removeItem("hortaviva_google_token_expires_at");
      localStorage.removeItem("hortaviva_google_user_info");
      localStorage.removeItem("hortaviva_google_drive_file_id");
      localStorage.removeItem("hortaviva_google_last_sync");
      localStorage.removeItem("hortaviva_monthly_usage_v2");
      localStorage.removeItem("hortaviva_photo_identifications_count");
      localStorage.removeItem("hortaviva_ai_usage_count");
      localStorage.setItem(STORAGE_KEYS.LOGGED_OUT, "true");
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hortaviva_auth_changed", { detail: { user: null } }));
      window.dispatchEvent(new CustomEvent("hortaviva_sync_change", { detail: { status: "idle", connected: false } }));
      window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed"));
    }

    if (redirectUrl) {
      window.location.hash = redirectUrl.startsWith("#") ? redirectUrl : `#${redirectUrl}`;
    }
  },

  redirectToLogin: (nextUrl) => {
    const target = nextUrl ? `/login?from_url=${encodeURIComponent(nextUrl)}` : "/login";
    window.location.hash = `#${target}`;
  },

  isAuthenticated: async () => {
    const u = await localAuth.me();
    return !!u;
  },

  hasToken: () => {
    try {
      if (localStorage.getItem(STORAGE_KEYS.LOGGED_OUT) === "true") return false;
      return !!(localStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem(STORAGE_KEYS.USER));
    } catch {
      return false;
    }
  },

  setToken: (token) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TOKEN, token);
      localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    } catch {}
  },
};

export const localIntegrations = {
  Core: {
    UploadFile: async ({ file }) => {
      return new Promise((resolve, reject) => {
        if (!file) return reject(new Error("Nenhum ficheiro fornecido"));
        const reader = new FileReader();
        reader.onload = () => resolve({ file_url: reader.result });
        reader.onerror = (err) => reject(err);
        reader.readAsDataURL(file);
      });
    },
    InvokeLLM: async ({ prompt, model, file_urls, response_json_schema, add_context_from_internet }) => {
      return callGemini({
        prompt,
        model,
        fileUrls: file_urls,
        responseJsonSchema: response_json_schema,
      });
    },
  },
};

export function exportFarmData(options = {}) {
  const plantings = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANTINGS) || "[]");
  const myAnimals = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_ANIMALS) || "[]");
  const reminders = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS) || "[]");
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");
  const deletedIds = JSON.parse(localStorage.getItem("hortaviva_deleted_ids") || "{}");
  
  let subscription = null;
  if (!options?.forceResetSubscription) {
    try {
      const rawSub = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
      if (rawSub) {
        const parsed = JSON.parse(rawSub);
        const activeEmail = (user?.email || "").toLowerCase().trim();
        const subEmail = (parsed.google_email || parsed.customer_email || "").toLowerCase().trim();
        // A subscrição só é exportada se pertencer comprovadamente a este utilizador e não for código master de teste
        if (parsed.active && !parsed.is_master && parsed.plan !== "lifetime" && activeEmail && subEmail === activeEmail) {
          subscription = parsed;
        }
      }
    } catch {}
  }

  return {
    version: 3,
    appName: "Horta Viva",
    exportedAt: new Date().toISOString(),
    user,
    subscription,
    deletedIds,
    plantings,
    myAnimals,
    reminders,
  };
}

export function mergeFarmData(local, remote, options = {}) {
  let deletedIds = {};
  try {
    const rawLocalDeleted = localStorage.getItem("hortaviva_deleted_ids");
    const localDeleted = rawLocalDeleted ? JSON.parse(rawLocalDeleted) : {};
    const remoteDeleted = remote && typeof remote.deletedIds === "object" ? remote.deletedIds : {};
    deletedIds = { ...localDeleted, ...remoteDeleted };
    const sixtyDaysAgo = Date.now() - 60 * 24 * 60 * 60 * 1000;
    for (const k in deletedIds) {
      if (Number(deletedIds[k]) < sixtyDaysAgo) delete deletedIds[k];
    }
    localStorage.setItem("hortaviva_deleted_ids", JSON.stringify(deletedIds));
  } catch {}

  const isDeleted = (id, itemDate) => {
    if (!id || !deletedIds[id]) return false;
    const deletedTime = Number(deletedIds[id]);
    const itemTime = itemDate ? new Date(itemDate).getTime() : 0;
    return deletedTime >= itemTime;
  };

  // 1. Fusão inteligente de plantações
  const localPlantings = Array.isArray(local?.plantings) ? local.plantings : [];
  const remotePlantings = Array.isArray(remote?.plantings) ? remote.plantings : [];
  const plantingsMap = new Map();

  for (const p of localPlantings) {
    if (!p) continue;
    const key = p.id || `${p.plant_name}_${p.planted_date}`;
    if (!isDeleted(p.id, p.updated_date || p.created_date)) {
      plantingsMap.set(key, p);
    }
  }

  for (const p of remotePlantings) {
    if (!p) continue;
    const key = p.id || `${p.plant_name}_${p.planted_date}`;
    if (isDeleted(p.id, p.updated_date || p.created_date)) {
      plantingsMap.delete(key);
      continue;
    }
    const existing = plantingsMap.get(key);
    if (!existing) {
      plantingsMap.set(key, p);
    } else {
      const localTime = new Date(existing.updated_date || existing.created_date || 0).getTime();
      const remoteTime = new Date(p.updated_date || p.created_date || 0).getTime();
      if (remoteTime > localTime) {
        plantingsMap.set(key, { ...existing, ...p });
      }
    }
  }

  // 2. Fusão inteligente de animais
  const localAnimals = Array.isArray(local?.myAnimals) ? local.myAnimals : [];
  const remoteAnimals = Array.isArray(remote?.myAnimals) ? remote.myAnimals : [];
  const animalsMap = new Map();

  for (const a of localAnimals) {
    if (!a) continue;
    const key = a.id || `${a.name}_${a.animal_type}`;
    if (!isDeleted(a.id, a.updated_date || a.created_date)) {
      animalsMap.set(key, a);
    }
  }

  for (const a of remoteAnimals) {
    if (!a) continue;
    const key = a.id || `${a.name}_${a.animal_type}`;
    if (isDeleted(a.id, a.updated_date || a.created_date)) {
      animalsMap.delete(key);
      continue;
    }
    const existing = animalsMap.get(key);
    if (!existing) {
      animalsMap.set(key, a);
    } else {
      const localTime = new Date(existing.updated_date || existing.created_date || 0).getTime();
      const remoteTime = new Date(a.updated_date || a.created_date || 0).getTime();
      if (remoteTime > localTime) {
        animalsMap.set(key, { ...existing, ...a });
      }
    }
  }

  // 3. Fusão de lembretes
  const localReminders = Array.isArray(local?.reminders) ? local.reminders : [];
  const remoteReminders = Array.isArray(remote?.reminders) ? remote.reminders : [];
  const remindersMap = new Map();

  for (const r of localReminders) {
    if (r && r.id && !isDeleted(r.id, r.date)) remindersMap.set(r.id, r);
  }
  for (const r of remoteReminders) {
    if (r && r.id && !isDeleted(r.id, r.date)) {
      if (!remindersMap.has(r.id)) remindersMap.set(r.id, r);
    }
  }

  // 4. Fusão inteligente de subscrição Pro / Plus estritamente vinculada à conta ativa
  const activeEmail = (remote?.user?.email || local?.user?.email || "").toLowerCase().trim();
  const activeGoogleId = remote?.user?.id || local?.user?.id || null;

  const isSubValidForUser = (sub) => {
    if (!sub || sub.active !== true) return false;
    // NUNCA aceitar licenças master de teste ("hortaviva") a partir de ficheiros da nuvem
    if (sub.is_master === true || sub.plan === "lifetime" || sub.customer_email === "master@hortaviva.local") {
      return false;
    }
    const subEmail = (sub.google_email || sub.customer_email || "").toLowerCase().trim();
    const subGoogleId = sub.google_id || null;
    if (subEmail && activeEmail) return subEmail === activeEmail;
    if (subGoogleId && activeGoogleId) return subGoogleId === activeGoogleId;
    return false;
  };

  const getSubRank = (sub) => {
    if (!sub || sub.active !== true) return 0;
    if (sub.plan === "lifetime") return 3;
    if (sub.tier === "pro" || sub.plan === "pro") return 2;
    if (sub.tier === "plus" || sub.plan === "plus") return 1;
    return 1;
  };

  const localSub = isSubValidForUser(local?.subscription) ? local.subscription : null;
  const remoteSub = isSubValidForUser(remote?.subscription) ? remote.subscription : null;
  const localRank = getSubRank(localSub);
  const remoteRank = getSubRank(remoteSub);

  let mergedSubscription = null;
  if (options?.forceResetSubscription) {
    mergedSubscription = null;
  } else if (remoteRank > localRank) {
    mergedSubscription = remoteSub;
  } else if (localRank > remoteRank) {
    mergedSubscription = localSub;
  } else if (localRank > 0 && remoteRank > 0) {
    const localTime = localSub.activated_at ? new Date(localSub.activated_at).getTime() : 0;
    const remoteTime = remoteSub.activated_at ? new Date(remoteSub.activated_at).getTime() : 0;
    mergedSubscription = remoteTime >= localTime ? remoteSub : localSub;
  } else {
    mergedSubscription = remoteSub || localSub || null;
  }

  return {
    version: 3,
    appName: "Horta Viva",
    exportedAt: new Date().toISOString(),
    user: remote?.user || local?.user,
    subscription: mergedSubscription,
    deletedIds,
    plantings: Array.from(plantingsMap.values()),
    myAnimals: Array.from(animalsMap.values()),
    reminders: Array.from(remindersMap.values()),
  };
}

export function importFarmData(data, shouldMerge = true) {
  if (!data || typeof data !== "object") {
    throw new Error("Ficheiro de cópia de segurança inválido.");
  }

  const finalData = shouldMerge ? mergeFarmData(exportFarmData(), data) : data;

  if (Array.isArray(finalData.plantings)) {
    localStorage.setItem(STORAGE_KEYS.PLANTINGS, JSON.stringify(finalData.plantings));
  }
  if (Array.isArray(finalData.myAnimals)) {
    localStorage.setItem(STORAGE_KEYS.MY_ANIMALS, JSON.stringify(finalData.myAnimals));
  }
  if (Array.isArray(finalData.reminders)) {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(finalData.reminders));
  }
  if (finalData.user && typeof finalData.user === "object") {
    const googleRaw = localStorage.getItem("hortaviva_google_user_info");
    if (googleRaw) {
      try {
        const g = JSON.parse(googleRaw);
        const mergedUser = {
          ...finalData.user,
          id: g.id || g.sub || finalData.user.id || "google_user",
          full_name: g.name || finalData.user.full_name || "Agricultor Google",
          email: g.email || finalData.user.email || "agricultor@gmail.com",
          avatar_url: g.picture || finalData.user.avatar_url || "",
          auth_provider: "google",
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(mergedUser));
      } catch {
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(finalData.user));
      }
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(finalData.user));
    }
    localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
  }

  // Uma licença master é local de propósito e não é incluída nas cópias Google.
  // Não a podemos apagar quando a sincronização recebe uma cópia sem subscrição.
  let localMasterSubscription = null;
  try {
    const rawSubscription = localStorage.getItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    const subscription = rawSubscription ? JSON.parse(rawSubscription) : null;
    if (subscription?.active === true && (subscription.is_master === true || subscription.source === "master_code")) {
      localMasterSubscription = subscription;
    }
  } catch {}

  // Sincronizar subscrição Pro/Plus da nuvem garantindo isolamento estrito entre contas
  if (localMasterSubscription) {
    localStorage.setItem(STORAGE_KEYS.PRO_SUBSCRIPTION, JSON.stringify(localMasterSubscription));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed", { detail: localMasterSubscription }));
    }
  } else if (finalData.subscription && typeof finalData.subscription === "object" && finalData.subscription.active === true) {
    localStorage.setItem(STORAGE_KEYS.PRO_SUBSCRIPTION, JSON.stringify(finalData.subscription));
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed", { detail: finalData.subscription }));
    }
  } else {
    localStorage.removeItem(STORAGE_KEYS.PRO_SUBSCRIPTION);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hortaviva_subscription_changed", { detail: null }));
    }
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hortaviva_remote_updated"));
    const finalUser = (() => {
      try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.USER)); } catch { return null; }
    })();
    if (finalUser) {
      window.dispatchEvent(new CustomEvent("hortaviva_auth_changed", { detail: { user: finalUser } }));
    }
  }

  return {
    success: true,
    plantingsCount: finalData.plantings?.length || 0,
    animalsCount: finalData.myAnimals?.length || 0,
    remindersCount: finalData.reminders?.length || 0,
    subscriptionRestored: Boolean(finalData.subscription?.active),
  };
}
