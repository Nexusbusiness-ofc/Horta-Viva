import { createClient } from "@base44/sdk";

const apiKey = import.meta.env.VITE_BASE44_API_KEY;

if (!apiKey) {
  console.warn("A chave da IA Base44 não está configurada. Cria o ficheiro .env.local antes de usar a identificação por fotografia.");
}

// Cliente separado: mantém a persistência local da Quinta independente da IA.
export const visionBase44 = createClient({
  appId: import.meta.env.VITE_BASE44_APP_ID || "6a622b52133adbcab96822d3",
  headers: apiKey ? { api_key: apiKey } : undefined,
  analytics: { enabled: false },
});
