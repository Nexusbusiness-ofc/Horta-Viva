const GEMINI_API_KEY =
  import.meta.env.VITE_GEMINI_API_KEY ||
  (typeof window !== "undefined" ? localStorage.getItem("hortaviva_gemini_api_key") || "" : "");

const GEMINI_MODELS = ["gemini-3.6-flash", "gemini-2.5-flash"];

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

function getApiUrl(model) {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
}

async function generateContent(payload) {
  let lastError = null;

  for (const model of GEMINI_MODELS) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      try {
        const response = await fetch(getApiUrl(model), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          return response.json();
        }

        const errText = await response.text();
        let detail = errText;
        try {
          detail = JSON.parse(errText)?.error?.message || errText;
        } catch {}

        const transient = [429, 500, 502, 503, 504].includes(response.status);
        lastError = new Error(`Erro na API Google Gemini (${response.status}): ${detail}`);

        if (transient && attempt === 0) {
          await wait(700);
          continue;
        }

        break;
      } catch (error) {
        lastError = error;
        if (attempt === 0) {
          await wait(700);
          continue;
        }
      }
    }
  }

  throw lastError || new Error("Não foi possível contactar a IA da Google.");
}

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

  const data = await generateContent(payload);
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

  const data = await generateContent(payload);
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) {
    throw new Error("A IA não gerou uma resposta.");
  }

  return rawText.trim();
}

/**
 * Consulta o Gemini sobre uma fotografia, mantendo a imagem no contexto visual.
 */
export async function askGeminiAboutPhoto(file, prompt) {
  if (!GEMINI_API_KEY) {
    throw new Error("Chave da API Google Gemini não configurada.");
  }

  const base64 = await fileToBase64(file);
  const data = await generateContent({
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
    generationConfig: { temperature: 0.35 },
  });
  const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!answer) {
    throw new Error("A IA não gerou uma resposta para esta fotografia.");
  }

  return answer.trim();
}
