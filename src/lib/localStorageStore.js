import { DEFAULT_PLANTS } from "./plantsData.js";
import { DEFAULT_ANIMALS, DEFAULT_MUSHROOMS, DEFAULT_PODAS, DEFAULT_MONDAS } from "./catalogData.js";

const STORAGE_KEYS = {
  PLANTINGS: "hortaviva_plantings",
  MY_ANIMALS: "hortaviva_myanimals",
  REMINDERS: "hortaviva_reminders",
  USER: "hortaviva_current_user",
  TOKEN: "base44_access_token",
  LOGGED_OUT: "hortaviva_logged_out",
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
    return { id, success: true };
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
      if (localStorage.getItem(STORAGE_KEYS.LOGGED_OUT) === "true") {
        return null;
      }
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (raw) {
        return JSON.parse(raw);
      }
      // Se houver utilizador Google guardado, carregar automaticamente
      const googleRaw = localStorage.getItem("hortaviva_google_user_info");
      if (googleRaw) {
        const g = JSON.parse(googleRaw);
        const user = {
          id: g.id || "google_user",
          full_name: g.name || "Agricultor Google",
          email: g.email || "agricultor@gmail.com",
          avatar_url: g.picture || "",
          avatar_emoji: "🌾",
          farm_name: `Quinta de ${g.name?.split(" ")[0] || "Cultivo"}`,
          farmer_type: "Agricultura biológica",
          experience_years: 2,
          role: "admin",
          auth_provider: "google",
        };
        localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
        return user;
      }
      // Sessão local predefinida ativa por padrão
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      localStorage.setItem(STORAGE_KEYS.TOKEN, "local_default_token");
      return DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  },

  loginWithGoogleUser: (googleProfile, accessToken) => {
    let existing = null;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      if (raw) existing = JSON.parse(raw);
    } catch {}

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

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hortaviva_auth_changed", { detail: { user } }));
      window.dispatchEvent(new CustomEvent("hortaviva_sync_change", { detail: { status: "synced", connected: true, user } }));
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

  loginWithProvider: (provider, fromUrl = "/minha-quinta") => {
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

    const target = fromUrl && fromUrl.startsWith("/") ? fromUrl : "/minha-quinta";
    window.location.hash = `#${target}`;
  },

  loginAsGuest: (fromUrl = "/minha-quinta") => {
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(DEFAULT_USER));
      localStorage.setItem(STORAGE_KEYS.TOKEN, `guest_token_${Date.now()}`);
      localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    } catch {}

    const target = fromUrl && fromUrl.startsWith("/") ? fromUrl : "/minha-quinta";
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
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      localStorage.setItem(STORAGE_KEYS.TOKEN, `token_${Date.now()}`);
      localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
    } catch {}

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
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      localStorage.removeItem("hortaviva_google_access_token");
      localStorage.removeItem("hortaviva_google_token_expires_at");
      localStorage.removeItem("hortaviva_google_user_info");
      localStorage.setItem(STORAGE_KEYS.LOGGED_OUT, "true");
    } catch {}

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("hortaviva_auth_changed", { detail: { user: null } }));
      window.dispatchEvent(new CustomEvent("hortaviva_sync_change", { detail: { status: "idle", connected: false } }));
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
  },
};

export function exportFarmData() {
  const plantings = JSON.parse(localStorage.getItem(STORAGE_KEYS.PLANTINGS) || "[]");
  const myAnimals = JSON.parse(localStorage.getItem(STORAGE_KEYS.MY_ANIMALS) || "[]");
  const reminders = JSON.parse(localStorage.getItem(STORAGE_KEYS.REMINDERS) || "[]");
  const user = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER) || "null");

  return {
    version: 1,
    appName: "Horta Viva",
    exportedAt: new Date().toISOString(),
    user,
    plantings,
    myAnimals,
    reminders,
  };
}

export function importFarmData(data) {
  if (!data || typeof data !== "object") {
    throw new Error("Ficheiro de cópia de segurança inválido.");
  }
  if (Array.isArray(data.plantings)) {
    localStorage.setItem(STORAGE_KEYS.PLANTINGS, JSON.stringify(data.plantings));
  }
  if (Array.isArray(data.myAnimals)) {
    localStorage.setItem(STORAGE_KEYS.MY_ANIMALS, JSON.stringify(data.myAnimals));
  }
  if (Array.isArray(data.reminders)) {
    localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(data.reminders));
  }
  if (data.user && typeof data.user === "object") {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    localStorage.removeItem(STORAGE_KEYS.LOGGED_OUT);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("hortaviva_remote_updated"));
    if (data.user) {
      window.dispatchEvent(new CustomEvent("hortaviva_auth_changed", { detail: { user: data.user } }));
    }
  }
  return {
    success: true,
    plantingsCount: data.plantings?.length || 0,
    animalsCount: data.myAnimals?.length || 0,
    remindersCount: data.reminders?.length || 0,
  };
}

