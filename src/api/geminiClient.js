const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  (typeof window !== "undefined" ? localStorage.getItem("hortaviva_gemini_api_key") || "" : "");

const GEMINI_MODEL = "gemini-3.6-flash";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

/**
 * Converte um ficheiro de imagem (File ou Blob) para uma string Base64 limpa
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result;
        if (typeof result === "string") {
          const base64Data = result.includes(",") ? result.split(",")[1] : result;
          resolve(base64Data);
        } else {
          reject(new Error("Formato de leitura de imagem inválido."));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Limpa blocos de código markdown (```json ... ```) se o modelo os incluir
 */
function cleanJsonText(raw) {
  if (!raw) return "{}";
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }
  return cleaned.trim();
}

/**
 * Identifica uma planta a partir de uma fotografia através do Google Gemini Vision
 * @param {File|Blob} file Ficheiro da foto capturada ou selecionada
 * @param {string} prompt Instruções detalhadas de botânica
 * @param {object} [schema] Esquema JSON estrito para structured output
 */
export async function identifyPlantWithGemini(file, prompt, schema) {
  if (!GEMINI_API_KEY) {
    throw new Error("Chave da API Google Gemini não configurada.");
  }

  const base64 = await fileToBase64(file);
  const mimeType = file.type || "image/jpeg";

  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: base64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      ...(schema ? { responseSchema: schema } : {}),
      temperature: 0.2,
    },
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    let detail = "";
    try {
      const parsed = JSON.parse(errText);
      detail = parsed?.error?.message || errText;
    } catch {
      detail = errText;
    }
    throw new Error(`Erro na API Google Gemini (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("A IA do Google não retornou conteúdo para esta fotografia.");
  }

  const cleaned = cleanJsonText(rawText);
  return JSON.parse(cleaned);
}

/**
 * Consulta o Assistente Agrícola da Horta Viva via Google Gemini
 * @param {string} prompt Pergunta completa com contexto botânico
 */
export async function askGeminiAgriculturalAI(prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("Chave da API Google Gemini não configurada.");
  }

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.4,
    },
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    let detail = "";
    try {
      const parsed = JSON.parse(errText);
      detail = parsed?.error?.message || errText;
    } catch {
      detail = errText;
    }
    throw new Error(`Erro na API Google Gemini (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("A IA não gerou uma resposta.");
  }

  return rawText.trim();
}

/**
 * Faz uma pergunta sobre uma fotografia já analisada, preservando o contexto visual.
 * @param {File|Blob} file Ficheiro da fotografia original
 * @param {string} prompt Pergunta e contexto agrícola para o Gemini
 */
export async function askGeminiAboutPhoto(file, prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("Chave da API Google Gemini não configurada.");
  }

  const base64 = await fileToBase64(file);
  const payload = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: file.type || "image/jpeg",
              data: base64,
            },
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.35,
    },
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    let detail = "";
    try {
      detail = JSON.parse(errText)?.error?.message || errText;
    } catch {
      detail = errText;
    }
    throw new Error(`Erro na API Google Gemini (${response.status}): ${detail}`);
  }

  const data = await response.json();
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    throw new Error("A IA não gerou uma resposta para esta fotografia.");
  }

  return rawText.trim();
}
