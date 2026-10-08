// Lógica partilhada: fase de crescimento, auto-avanço de estado e cuidados temporais
import { readRegionalPreferences } from "./regionalPreferences.js";
import { getClimateProfile, getLocalDateString } from "./regionalClimate.js";

const STATUS_ORDER = ["Plantada", "Em crescimento", "Pronta a colher", "Colhida"];

function todayStr(preferences, now) {
  return getLocalDateString(now, preferences);
}

function daysBetween(a, b) {
  if (!a || !b) return null;
  const d1 = new Date(a + "T00:00:00Z");
  const d2 = new Date(b + "T00:00:00Z");
  if (!Number.isFinite(d1.getTime()) || !Number.isFinite(d2.getTime())) return null;
  return Math.round((d2 - d1) / 86400000);
}

// Progresso da plantação: dias desde a plantação, dias totais até colheita, progresso 0..1
export function getPlantingProgress(planting, preferences = readRegionalPreferences(), now = new Date()) {
  if (!planting.planted_date) return { daysSince: 0, totalDays: null, progress: 0 };
  const daysSince = Math.max(0, daysBetween(planting.planted_date, todayStr(preferences, now)) ?? 0);
  let totalDays = null;
  if (planting.expected_harvest_date) {
    totalDays = daysBetween(planting.planted_date, planting.expected_harvest_date);
  }
  const progress = totalDays && totalDays > 0 ? Math.min(1, daysSince / totalDays) : 0;
  return { daysSince, totalDays, progress };
}

// Fase atual com base no progresso ou nos dias decorridos
export function getPhase(planting, preferences = readRegionalPreferences(), now = new Date()) {
  if (planting.status === "Colhida") return "colhida";
  const { progress, daysSince } = getPlantingProgress(planting, preferences, now);

  if (!planting.expected_harvest_date) {
    if (daysSince < 14) return "estabelecimento";
    return "crescimento";
  }
  if (progress >= 1) return "colheita";
  if (progress >= 0.75) return "maturacao";
  if (progress >= 0.25) return "crescimento";
  return "estabelecimento";
}

// Estado que a plantação deveria ter, segundo o tempo. Só avança (nunca recua).
export function getAutoStatus(planting, preferences = readRegionalPreferences(), now = new Date()) {
  if (planting.status === "Colhida") return null;
  const phase = getPhase(planting, preferences, now);
  const currentIdx = STATUS_ORDER.indexOf(planting.status);

  let target;
  if (phase === "colheita") target = "Pronta a colher";
  else if (phase === "maturacao") target = "Em crescimento";
  else if (phase === "crescimento") target = "Em crescimento";
  else target = "Plantada";

  const targetIdx = STATUS_ORDER.indexOf(target);
  return targetIdx > currentIdx ? target : null;
}

export const PHASE_INFO = {
  estabelecimento: {
    label: "Estabelecimento",
    emoji: "🌱",
    tips: [
      "Mantém o solo húmido para favorecer a germinação e enraizamento.",
      "Rega suave e frequente, evitando encharcar.",
      "Protege as jovens plantas de caracóis e lesmas.",
    ],
  },
  crescimento: {
    label: "Crescimento",
    emoji: "🌿",
    tips: [
      "Rega regular conforme as necessidades da planta.",
      "Remove infestantes que competem por nutrientes.",
      "Ajusta a fertilização à cultura e às necessidades do solo.",
      "Vigia pragas e age precocemente.",
    ],
  },
  maturacao: {
    label: "Maturação",
    emoji: "🌸",
    tips: [
      "Ajusta a rega ao solo, à cultura e ao tempo; evita stress hídrico.",
      "Confirma a nutrição adequada à cultura antes de fertilizar.",
      "Apoia ramos pesados com tutores.",
      "Vigia a prontidão para a colheita.",
    ],
  },
  colheita: {
    label: "Colheita",
    emoji: "🌾",
    tips: [
      "Colhe de manhã cedo, quando a planta está hidratada.",
      "Usa ferramentas limpas para evitar infeções.",
      "Colhe gradualmente conforme a maturação.",
    ],
  },
  colhida: {
    label: "Concluída",
    emoji: "✅",
    tips: [
      "Limpa o canteiro e prepara para a próxima cultura.",
      "Regista a produção para o planeamento futuro.",
    ],
  },
};

// Encontra a planta correspondente na base de dados (por nome)
export function findPlant(planting, plants) {
  if (!plants || !planting.plant_name) return null;
  return plants.find(p => p.name === planting.plant_name) || null;
}

// Constrói os cuidados atuais: fase + instruções da planta + dicas de rega/sol
export function getCareGuide(planting, plants, preferences = readRegionalPreferences(), now = new Date()) {
  const phase = getPhase(planting, preferences, now);
  const baseInfo = PHASE_INFO[phase] || PHASE_INFO.estabelecimento;
  const regional = getClimateProfile(preferences);
  const info = { ...baseInfo, tips: [...baseInfo.tips, ...regional.notes] };
  const plant = findPlant(planting, plants);
  return {
    phase,
    info,
    plant,
    regional,
    harvestIsEstimate: true,
  };
}
