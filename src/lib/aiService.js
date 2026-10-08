import { DEFAULT_PLANTS } from "./plantsData.js";
import { DEFAULT_PODAS } from "./catalogData.js";
import { readRegionalPreferences } from "./regionalPreferences.js";
import { getRegionalAIContext, regionalizeItems } from "./regionalClimate.js";

const API_KEY_STORAGE = "hortaviva_gemini_api_key";

export function getStoredGeminiKey() {
  if (typeof window === "undefined") return "";
  const stored = localStorage.getItem(API_KEY_STORAGE);
  if (stored && stored.trim()) return stored.trim();
  return import.meta.env?.VITE_GEMINI_API_KEY || "";
}

export function saveGeminiKey(key) {
  if (typeof window === "undefined") return;
  if (!key || !key.trim()) {
    localStorage.removeItem(API_KEY_STORAGE);
  } else {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  }
}

export function hasGeminiKey() {
  return Boolean(getStoredGeminiKey());
}

/**
 * Converte um dataURL (data:image/jpeg;base64,...) em formato inlineData do Gemini
 */
function parseDataUrl(dataUrl) {
  if (typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) return null;
  return {
    mimeType: match[1],
    data: match[2],
  };
}

/**
 * Chama a API oficial do Google Gemini (Vision / Multimodal ou Texto)
 */
export async function callGemini({
  prompt,
  fileUrls = [],
  responseJsonSchema = null,
  model = "gemini-3.6-flash",
}) {
  const apiKey = getStoredGeminiKey();
  if (!apiKey) {
    const err = new Error("CHAVE_GEMINI_NECESSARIA");
    err.code = "API_KEY_MISSING";
    throw err;
  }

  const parts = [];

  // Adicionar ficheiros de imagem (Base64) se existirem
  for (const url of fileUrls) {
    const inline = parseDataUrl(url);
    if (inline) {
      parts.push({ inlineData: inline });
    }
  }

  // Adicionar o prompt de texto
  parts.push({ text: prompt });

  const payload = {
    contents: [{ parts }],
    systemInstruction: { parts: [{ text: getRegionalAIContext() }] },
  };

  if (responseJsonSchema) {
    payload.generationConfig = {
      responseMimeType: "application/json",
      responseSchema: responseJsonSchema,
    };
  }

  // Tentar primeiro gemini-3.6-flash
  const modelsToTry = [model, "gemini-3.6-flash"];
  const uniqueModels = [...new Set(modelsToTry)];

  let lastError = null;
  for (const currentModel of uniqueModels) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${currentModel}:generateContent?key=${apiKey}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        const errMsg = errData?.error?.message || `HTTP ${response.status} ao contactar a API do Gemini`;
        throw new Error(errMsg);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        throw new Error("A IA não devolveu resposta legível.");
      }

      if (responseJsonSchema) {
        try {
          let cleaned = text.trim();
          if (cleaned.startsWith("```json")) {
            cleaned = cleaned.replace(/^```json\s*/, "").replace(/\s*```$/, "");
          } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.replace(/^```\s*/, "").replace(/\s*```$/, "");
          }
          return JSON.parse(cleaned);
        } catch (parseErr) {
          console.warn("Erro ao fazer parse de JSON do Gemini:", parseErr, text);
          return text;
        }
      }

      return text;
    } catch (err) {
      lastError = err;
      if (err.message.includes("API key not valid") || err.message.includes("quota")) {
        throw err;
      }
    }
  }

  throw lastError || new Error("Falha ao contactar a IA da Google.");
}

/**
 * Reconhecimento / correspondência no catálogo botânico integrado da Horta Viva
 */
export function findPlantInCatalog(nameOrHint, preferences = readRegionalPreferences()) {
  if (!nameOrHint) return null;
  const q = nameOrHint.toLowerCase().trim();
  const language = preferences.language || "pt-PT";
  const lang = language.startsWith("en") ? "en" : language.startsWith("es") ? "es" : "pt";
  const labels = {
    pt: { source: "Informação do catálogo de referência", months: "Meses indicativos", unknown: "Confirma a época com orientação local", harvest: "Colheita: janela indicativa" },
    en: { source: "Reference catalogue information", months: "Indicative months", unknown: "Check timing with local guidance", harvest: "Harvest: approximate window" },
    es: { source: "Información del catálogo de referencia", months: "Meses orientativos", unknown: "Confirma la época con orientación local", harvest: "Cosecha: ventana orientativa" },
  }[lang];
  const formatMonths = months => (months || []).map(month => new Intl.DateTimeFormat(language, { month: "long", timeZone: "UTC" }).format(new Date(Date.UTC(2024, month - 1, 1)))).join(", ");
  const plants = regionalizeItems("plants", DEFAULT_PLANTS, preferences);
  const podas = regionalizeItems("podas", DEFAULT_PODAS, preferences);

  // Pesquisar em DEFAULT_PLANTS
  // Dar prioridade ao nome exato. Sem isto, por exemplo, "Couve" podia abrir
  // a ficha de "Couve-flor", que surge antes no catálogo.
  const plant = plants.find(p => p.name.toLowerCase() === q) ||
    plants.find(p =>
      p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase())
    );
  if (plant) {
    return {
      identified: true,
      name: plant.name,
      scientific_name: `${plant.name} (Espécie cultivada)`,
      category: plant.category || "Hortícola",
      confidence: "alta",
      description: `${labels.source}: ${plant.name}. ${plant.care_instructions || ""}`,
      sun: plant.sun_requirements || "Sol pleno",
      water: plant.water_requirements || "Moderada",
      soil: "Rico em matéria orgânica e bem drenado",
      when_to_plant: plant.plant_months?.length ? `${labels.months}: ${formatMonths(plant.plant_months)}` : labels.unknown,
      when_to_harvest: plant.harvest_months?.length ? `${labels.harvest}: ${formatMonths(plant.harvest_months)}` : labels.unknown,
      regional_adaptation: plant.regional_adaptation,
      common_pests: "Pulgões, lagartas, míldio e oídio",
      tips: `${plant.sow_instructions || ""} ${plant.storage_instructions || ""}`,
    };
  }

  // Pesquisar em Podas
  const poda = podas.find(p => p.name.toLowerCase() === q) ||
    podas.find(p => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
  if (poda) {
    return {
      identified: true,
      name: poda.name,
      scientific_name: poda.name,
      category: poda.category || "Árvore / Arbusto",
      confidence: "alta",
      description: `Espécie identificada no guia de podas da quinta. Categoria: ${poda.category}. Dificuldade: ${poda.difficulty}.`,
      sun: "Sol pleno",
      water: "Moderada a baixa após estabelecida",
      soil: "Arejado e profundo",
      when_to_plant: labels.unknown,
      when_to_harvest: labels.unknown,
      regional_adaptation: poda.regional_adaptation,
      common_pests: "Cochonilha, mosca-da-fruta, pedrado",
      tips: `${labels.months}: ${formatMonths(poda.when_months) || labels.unknown}. ${poda.how || ""}`,
    };
  }

  return null;
}
