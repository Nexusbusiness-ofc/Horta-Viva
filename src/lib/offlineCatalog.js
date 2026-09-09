import { DEFAULT_PLANTS } from "./plantsData";
import { DEFAULT_ANIMALS, DEFAULT_MUSHROOMS, DEFAULT_PODAS, DEFAULT_MONDAS } from "./catalogData";
import { resolveAssetUrl } from "./utils";

// Cache offline simples para catálogos de consulta rápida na horta.
// Guarda o resultado da última carga com sucesso no localStorage e
// devolve a cache ou catálogo pré-carregado quando o pedido à API falha (ex: sem rede ou backend).
const PREFIX = "hv_offline_";

const SEED_DATA = {
  plants: DEFAULT_PLANTS,
  farmanimals: DEFAULT_ANIMALS,
  mushrooms: DEFAULT_MUSHROOMS,
  podas: DEFAULT_PODAS,
  mondas: DEFAULT_MONDAS,
};

function normalizeItems(items) {
  if (!Array.isArray(items)) return [];
  return items.map(item => {
    if (item && item.image_url) {
      return { ...item, image_url: resolveAssetUrl(item.image_url) };
    }
    return item;
  });
}

export async function cachedList(key, fetcher) {
  const storageKey = PREFIX + key;
  const rawFallback = SEED_DATA[key] || [];
  const fallback = normalizeItems(rawFallback);

  try {
    if (typeof fetcher === "function") {
      const data = await fetcher();
      if (Array.isArray(data) && data.length > 0) {
        const normalized = normalizeItems(data);
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
        const normalized = normalizeItems(parsed.data);
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