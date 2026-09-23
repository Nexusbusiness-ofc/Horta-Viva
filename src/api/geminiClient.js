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

const PODA_MONDA_SCHEMA = {
  type: "object",
  properties: {
    plant_name: { type: "string" },
    scientific_name: { type: "string" },
    detected_subject: { type: "string" },
    operation_type: { type: "string", enum: ["poda", "monda"] },
    operation_subtype: { type: "string" },
    user_preference_match: { type: "string" },
    visual_assessment: { type: "string" },
    urgency: { type: "string", enum: ["ideal_agora", "pode_esperar", "atencao_epoca_errada"] },
    season_timing_advice: { type: "string" },
    what_to_do: {
      type: "array",
      items: { type: "string" }
    },
    how_to_do: {
      type: "array",
      items: { type: "string" }
    },
    tools_needed: { type: "string" },
    cut_technique: { type: "string" },
    cautions_and_healing: { type: "string" },
    pro_tip: { type: "string" }
  },
  required: [
    "plant_name",
    "operation_type",
    "operation_subtype",
    "visual_assessment",
    "urgency",
    "season_timing_advice",
    "what_to_do",
    "how_to_do",
    "tools_needed",
    "cut_technique"
  ]
};

/**
 * Analisa uma fotografia de poda ou monda através do Google Gemini Vision
 * @param {File|Blob} file Ficheiro da fotografia dos ramos ou sementeira
 * @param {"poda"|"monda"|"auto"} userPreference Preferência indicada pelo utilizador
 */
export async function analyzePodaMondaWithGemini(file, userPreference = "auto") {
  if (!GEMINI_API_KEY) {
    throw new Error("Chave da API Google Gemini não configurada.");
  }

  const preferenceText =
    userPreference === "poda"
      ? "Pretendo fazer PODA (cortar ramos, rebentos ladrões, limpeza, arejamento ou condução)"
      : userPreference === "monda"
      ? "Pretendo fazer MONDA (desbaste de frutos em excesso, flores, botões ou desbaste de sementeiras/ervas)"
      : "Não tenho a certeza, pretendo que a IA analise a foto e determine se a planta precisa de Poda ou de Monda";

  const prompt = `És um Engenheiro Agrónomo e Mestre Podador com vasta experiência em pomares, vinhas e hortas em Portugal.
Analisa atentamente esta fotografia enviada por um agricultor/jardineiro.

INTENÇÃO DO UTILIZADOR:
${preferenceText}.

A TUA MISSÃO É FORNECER UM DIAGNÓSTICO CIRÚRGICO E PRÁTICO:
1. IDENTIFICAR a planta/árvore visível (ex.: Laranjeira, Macieira, Oliveira, Tomateiro, Videira, Pereira, Couve, etc.).
2. CONFIRMAR a operação adequada:
   - Se for 'poda' (ou a foto mostrar ramos, ladrões, copas densas ou ramos secos) -> define operation_type="poda".
   - Se for 'monda' (ou a foto mostrar muitos frutos juntos no ramo, flores aglomeradas ou sementeiras densas) -> define operation_type="monda".
   - No campo user_preference_match, valida a escolha do utilizador de forma cordial e explica a tua concordância ou reorientação agronómica.
3. VISUAL_ASSESSMENT: Diagnóstico minucioso do que está na foto (ramos em cruzamento, ramos ladrões verticais sem gomos de flor, frutos aglomerados a tocar-se, folhagem a tapar a luz solar direta).
4. URGÊNCIA & ÉPOCA: Avalia se o momento atual é propício para podar/mondar esta espécie em Portugal (ex.: poda de inverno em repouso vegetativo vs. poda verde de verão). Define urgency ("ideal_agora", "pode_esperar", ou "atencao_epoca_errada") e explica detalhadamente em season_timing_advice.
5. WHAT_TO_DO: Lista ordenada de 2 a 5 ações concretas e imediatas para o utilizador fazer (ex.: "1. Retirar os 2 chupões que nascem no interior da bifurcação").
6. HOW_TO_DO: Passo a passo técnico de execução adaptado àquela foto específica (onde posicionar a tesoura, que ramo cortar primeiro, como desbastar os frutos mais pequenos para deixar espaço para os maiores vingarem).
7. TOOLS_NEEDED: Ferramentas exatas recomendadas (tesoura de corte deslizante bypass, tesourão de duas mãos, serrote de poda, luvas).
8. CUT_TECHNIQUE: Técnica do corte (ângulo a 45° inclinado, preservar o anel cicatricial, nunca cortar rente demais nem deixar tocos compridos que apodrecem).
9. CAUTIONS_AND_HEALING: Higiene e cicatrização (desinfeção da lâmina com álcool 70°, aplicação de pasta cicatrizante em cortes > 2cm).
10. PRO_TIP: Dica de ouro profissional para o agricultor.

Responde estritamente em conformidade com o esquema JSON solicitado em português de Portugal.`;

  return identifyPlantWithGemini(file, prompt, PODA_MONDA_SCHEMA);
}
