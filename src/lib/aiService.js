import { DEFAULT_PLANTS } from "./plantsData";
import { DEFAULT_PODAS, DEFAULT_MONDAS } from "./catalogData";

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
 * Converte um dataURL (data:image/jpeg;base64,...) em formato inline_data do Gemini
 */
function parseDataUrl(dataUrl) {
  if (typeof dataUrl !== "string") return null;
  const match = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!match) return null;
  return {
    mime_type: match[1],
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
  model = "gemini-2.5-flash",
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
      parts.push({ inline_data: inline });
    }
  }

  // Adicionar o prompt de texto
  parts.push({ text: prompt });

  const payload = {
    contents: [{ parts }],
  };

  if (responseJsonSchema) {
    payload.generationConfig = {
      response_mime_type: "application/json",
    };
  }

  // Tentar primeiro gemini-2.5-flash, depois gemini-1.5-flash se houver erro de modelo
  const modelsToTry = [model, "gemini-2.5-flash", "gemini-1.5-flash"];
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
export function findPlantInCatalog(nameOrHint) {
  if (!nameOrHint) return null;
  const q = nameOrHint.toLowerCase().trim();

  // Pesquisar em DEFAULT_PLANTS
  const plant = DEFAULT_PLANTS.find(p =>
    p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase())
  );
  if (plant) {
    return {
      identified: true,
      name: plant.name,
      scientific_name: `${plant.name} (Espécie cultivada)`,
      category: plant.category || "Hortícola",
      confidence: "alta",
      description: `${plant.name} é uma das culturas mais populares na horta em Portugal. ${plant.care_instructions || ""}`,
      sun: plant.sun_requirements || "Sol pleno",
      water: plant.water_requirements || "Moderada",
      soil: "Rico em matéria orgânica e bem drenado",
      when_to_plant: plant.plant_months ? `Meses recomendados: ${plant.plant_months.join(", ")}` : "Primavera / Outono",
      when_to_harvest: plant.harvest_months ? `Meses de colheita: ${plant.harvest_months.join(", ")}` : plant.days_to_harvest || "90 dias",
      common_pests: "Pulgões, lagartas, míldio e oídio",
      tips: `${plant.sow_instructions || ""} ${plant.storage_instructions || ""}`,
    };
  }

  // Pesquisar em Podas
  const poda = (DEFAULT_PODAS || []).find(p => p.name.toLowerCase().includes(q) || q.includes(p.name.toLowerCase()));
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
      when_to_plant: "Outono ou Inverno",
      when_to_harvest: "Verão / Outono",
      common_pests: "Cochonilha, mosca-da-fruta, pedrado",
      tips: `Poda em: ${(poda.when_months || []).join(", ")}. Instruções: ${poda.how || ""}`,
    };
  }

  return null;
}
