import { DEFAULT_PLANTS } from "./plantsData";
import { DEFAULT_ANIMALS, DEFAULT_MUSHROOMS, DEFAULT_PODAS, DEFAULT_MONDAS } from "./catalogData";
import { resolveAssetUrl } from "./utils";

// Cache offline simples para catálogos de consulta rápida na horta.
// Guarda o resultado da última carga com sucesso no localStorage e
// devolve a cache ou catálogo pré-carregado quando o pedido à API falha (ex: sem rede ou backend).
const PREFIX = "hv_offline_v4_";

try {
  if (typeof window !== "undefined" && window.localStorage) {
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && k.startsWith("hv_offline_") && !k.startsWith(PREFIX)) {
        localStorage.removeItem(k);
      }
    }
  }
} catch {}

const SEED_DATA = {
  plants: DEFAULT_PLANTS,
  farmanimals: DEFAULT_ANIMALS,
  mushrooms: DEFAULT_MUSHROOMS,
  podas: DEFAULT_PODAS,
  mondas: DEFAULT_MONDAS,
};

function normalizeItems(items, key) {
  if (!Array.isArray(items)) return [];
  const seedMap = new Map((SEED_DATA[key] || []).map(s => [s.id, s]));
  return items.map(item => {
    if (!item) return item;
    const seed = seedMap.get(item.id);
    const updated = { ...item };
    if (updated.image_url) {
      updated.image_url = resolveAssetUrl(updated.image_url);
    }
    // Se o emoji ou nome contiver caracteres corrompidos, restaurar do seed oficial
    if (seed) {
      if (!updated.emoji || updated.emoji.includes("ð") || updated.emoji.includes("Ã")) {
        updated.emoji = seed.emoji;
      }
      if (updated.name && (updated.name.includes("Ã") || updated.name.includes("Â"))) {
        updated.name = seed.name;
      }
    }
    return updated;
  });
}

export async function cachedList(key, fetcher) {
  const storageKey = PREFIX + key;
  const rawFallback = SEED_DATA[key] || [];
  const fallback = normalizeItems(rawFallback, key);

  try {
    if (typeof fetcher === "function") {
      const data = await fetcher();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = normalizeItems(data, key);
        try { localStorage.setItem(storageKey, JSON.stringify({ t: Date.now(), data: normalized })); } catch {}
        return normalized;
      }
    }
  } catch (e) {
    console.warn(`[offlineCatalog] Falha ao carregar ${key} da API, a usar cache local / sementes:`, e?.message);
  }

  // Tentar carregar do localStorage
  try {
    const raw = localStorage.getItem(storageKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.data) && parsed.data.length >= fallback.length && parsed.data.length > 0) {
        const normalized = normalizeItems(parsed.data, key);
        try { localStorage.setItem(storageKey, JSON.stringify({ t: Date.now(), data: normalized })); } catch {}
        return normalized;
      }
    }
  } catch {}

  // Guardar no localStorage para futuras consultas offline
  try {
    if (fallback.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify({ t: Date.now(), data: fallback }));
    }
  } catch {}

  return fallback;
}