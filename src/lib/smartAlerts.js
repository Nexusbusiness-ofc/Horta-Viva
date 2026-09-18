// Motor de Alertas Inteligentes da Quinta
// Analisa em tempo real o que o utilizador tem na página "Minha Quinta" (plantações e animais)
// e gera alertas práticos com frequência de rega, podas sazonais ativas, mondas e colheitas.

import { PODA_SCHEMAS } from "./pruningThinningSchemas";

const WATER_STORAGE_KEY = "hortaviva_plantings_watered";

const WATER_INTERVALS = {
  "Abundante": 1, // Rega diária
  "Moderada": 2,  // Rega a cada 2 dias
  "Pouca": 3,     // Rega a cada 3 dias
};

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function daysDiff(dateA, dateB) {
  if (!dateA || !dateB) return 0;
  const da = new Date(dateA + "T00:00:00");
  const db = new Date(dateB + "T00:00:00");
  return Math.floor((db - da) / 86400000);
}

function normalize(str) {
  return (str || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function wordMatch(textNorm, targetNorm) {
  if (!textNorm || !targetNorm) return false;
  if (textNorm === targetNorm) return true;

  const tWords = textNorm.replace(/[^a-z0-9]/g, " ").split(/\s+/).filter(Boolean);
  const targetWords = targetNorm.replace(/[^a-z0-9]/g, " ").split(/\s+/).filter(Boolean);

  if (targetWords.length === 1) {
    return tWords.includes(targetWords[0]);
  }

  const tClean = " " + tWords.join(" ") + " ";
  const targetClean = " " + targetWords.join(" ") + " ";
  return tClean.includes(targetClean);
}

// Mapa de correspondência para Podas
const PODA_KEYWORDS = {
  poda_vinha_inverno: ["videira", "vinha", "uva"],
  poda_vinha_verde: ["videira", "vinha", "uva"],
  poda_macieira: ["macieira", "maca"],
  poda_pereira: ["pereira", "pera"],
  poda_marmeleiro: ["marmeleiro", "marmelo"],
  poda_pessegueiro: ["pessegueiro", "pessego", "nectarina"],
  poda_cerejeira: ["cerejeira", "cereja"],
  poda_ameixeira: ["ameixeira", "ameixa"],
  poda_damasqueiro: ["damasqueiro", "damasco", "alperceiro", "alperce"],
  poda_laranjeira: ["laranjeira", "laranja"],
  poda_limoeiro: ["limoeiro", "limao"],
  poda_clementineira: ["tangerineira", "tangerina", "clementina", "clementineira", "mandarim"],
  poda_oliveira: ["oliveira", "azeitona"],
  poda_oliveira_desladroamento: ["oliveira", "azeitona"],
  poda_amendoeira: ["amendoeira", "amendoa"],
  poda_castanheiro: ["castanheiro", "castanha"],
  poda_figueira: ["figueira", "figo"],
  poda_framboesa: ["framboeseiro", "framboesa"],
  poda_mirtilo: ["mirtileiro", "mirtilo"],
  poda_roseira: ["roseira", "rosa"],
  poda_hortensia: ["hortensia"],
  poda_lavanda: ["alfazema", "lavanda"]
};

// Mapa de correspondência para Mondas
const MONDA_KEYWORDS = {
  monda_cenoura: ["cenoura", "cherovia", "pastinaca"],
  monda_rabanete: ["rabanete", "rabano"],
  monda_beterraba: ["beterraba"],
  monda_nabo: ["nabo", "nabica", "nabicas", "grelos"],
  monda_alface: ["alface", "canonigos", "agriao", "chicoria", "endivia"],
  monda_espinafre: ["espinafre", "espinafres"],
  monda_rucula: ["rucula"],
  monda_acelga: ["acelga", "acelgas"],
  monda_alho: ["alho"],
  monda_alho_porro: ["alho porro", "alho frances", "alho-porro", "alho-frances", "porro"],
  monda_cebola: ["cebola", "cebolinho", "cebolinha"],
  monda_tomateiro: ["tomate", "tomateiro", "tomatinho"],
  monda_pimenteiro: ["pimento", "pimenteiro", "pimentos", "malagueta", "malaguetas", "piri piri", "piripiri"],
  monda_beringela: ["beringela", "berinjela"],
  monda_curgete: ["curgete", "courgette"],
  monda_abobora: ["abobora", "chuchu"],
  monda_melao: ["melao", "melancia"],
  monda_milho: ["milho"],
  monda_favas: ["fava", "favas", "ervilha", "ervilhas", "grao de bico", "grao-de-bico", "feijao frade", "feijao-frade", "lentilha", "lentilhas", "tremoco", "tremocos"],
  monda_couve: ["couve", "couves", "repolho", "repolhos", "couve flor", "brocolos", "couve portuguesa", "couve galega", "couve-galega", "couve lombarda", "couve-lombarda", "couve coracao", "couve-coracao", "couve roxa", "couve-roxa"],
  monda_salsa: ["salsa", "coentro", "coentros", "oregaos", "lucia-lima", "lucia lima", "erva-cidreira", "erva cidreira", "poejo", "salva", "camomila", "estragao"],
  monda_manjericao: ["manjericao"]
};

// --- GESTÃO DA DATA DA ÚLTIMA REGA (LOCALSTORAGE) ---
export function getLastWateredMap() {
  try {
    const raw = localStorage.getItem(WATER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function markPlantingWatered(plantingId, date = todayStr()) {
  try {
    const map = getLastWateredMap();
    map[plantingId] = date;
    localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("hortaviva_watered_update", { detail: { plantingId, date } }));
    return map;
  } catch {
    return {};
  }
}

export function removePlantingWatered(plantingId) {
  try {
    const map = getLastWateredMap();
    delete map[plantingId];
    localStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(map));
    window.dispatchEvent(new CustomEvent("hortaviva_watered_update", { detail: { plantingId } }));
    return map;
  } catch {
    return {};
  }
}

// --- VERIFICAÇÃO DE CORRESPONDÊNCIA ---
function matchesPlanting(keywords, catalogItemName, plantingName) {
  const plNorm = normalize(plantingName);
  const catNorm = normalize(catalogItemName);
  if (!plNorm) return false;

  for (const kw of keywords) {
    if (wordMatch(plNorm, kw)) return true;
  }
  if (wordMatch(catNorm, plNorm) || wordMatch(plNorm, catNorm)) return true;
  return false;
}

// --- MOTOR CENTRAL DE ALERTAS INTELIGENTES ---
export function computeSmartAlerts({
  plantings = [],
  plants = [],
  myAnimals = [],
  farmAnimals = [],
  podas = [],
  mondas = [],
  lastWateredMap = getLastWateredMap(),
}) {
  const today = todayStr();
  const currentMonth = new Date().getMonth() + 1;
  const plantByName = {};
  (plants || []).forEach(p => { plantByName[p.name] = p; });

  const activePlantings = (plantings || []).filter(pl => pl.status !== "Colhida");

  const wateringAlerts = [];
  const pruningAlerts = [];
  const thinningAlerts = [];
  const animalAlerts = [];
  const harvestAlerts = [];

  // 1. ALERTAS DE REGA INTELIGENTE
  activePlantings.forEach(pl => {
    const plant = plantByName[pl.plant_name];
    const waterReq = plant?.water_requirements || "Moderada";
    const intervalDays = WATER_INTERVALS[waterReq] || 2;

    const lastWatered = lastWateredMap[pl.id] || pl.planted_date || today;
    const daysSinceLastWater = daysDiff(lastWatered, today);

    let status = "ok";
    let message = `Rega ${waterReq.toLowerCase()} (a cada ${intervalDays} dias)`;
    let badgeText = "Hidratada";
    let urgency = "low";

    if (daysSinceLastWater >= intervalDays) {
      if (daysSinceLastWater > intervalDays) {
        status = "overdue";
        urgency = "high";
        badgeText = `Atrasada (${daysSinceLastWater - intervalDays + 1}d)`;
        message = `Atraso na rega! Precisa de água abundante hoje.`;
      } else {
        status = "today";
        urgency = "today";
        badgeText = "Regar Hoje";
        message = `É dia de rega (${waterReq.toLowerCase()}). Mantém a terra húmida.`;
      }
      wateringAlerts.push({
        id: `alert-rega-${pl.id}`,
        type: "rega",
        plantingId: pl.id,
        plantingName: pl.plant_name,
        plantingEmoji: pl.plant_emoji || "🌱",
        plantingColor: pl.plant_color || "#84cc16",
        location: pl.location || "",
        waterReq,
        intervalDays,
        lastWatered,
        daysSinceLastWater,
        status,
        urgency,
        badgeText,
        message,
      });
    } else if (daysSinceLastWater === intervalDays - 1 && intervalDays > 1) {
      // Rega agendada para amanhã (visível como dica informativa)
      status = "tomorrow";
      urgency = "medium";
      badgeText = "Amanhã";
      message = `Próxima rega prevista para amanhã.`;
      wateringAlerts.push({
        id: `alert-rega-${pl.id}`,
        type: "rega",
        plantingId: pl.id,
        plantingName: pl.plant_name,
        plantingEmoji: pl.plant_emoji || "🌱",
        plantingColor: pl.plant_color || "#84cc16",
        location: pl.location || "",
        waterReq,
        intervalDays,
        lastWatered,
        daysSinceLastWater,
        status,
        urgency,
        badgeText,
        message,
      });
    }
  });

  // Ordenar regas: atrasadas primeiro, hoje depois, amanhã por fim
  wateringAlerts.sort((a, b) => {
    const order = { high: 0, today: 1, medium: 2, low: 3 };
    return order[a.urgency] - order[b.urgency];
  });

  // 2. ALERTAS DE PODAS SAZONAIS INTELIGENTES
  (podas || []).forEach(po => {
    const keywords = PODA_KEYWORDS[po.id] || [];
    const whenMonths = po.when_months || [];
    const isPruningMonth = whenMonths.includes(currentMonth);

    if (isPruningMonth) {
      const matchingPlantings = activePlantings.filter(pl =>
        matchesPlanting(keywords, po.name, pl.plant_name)
      );

      matchingPlantings.forEach(pl => {
        const schema = PODA_SCHEMAS[po.id] || {};
        pruningAlerts.push({
          id: `alert-poda-${po.id}-${pl.id}`,
          type: "poda",
          podaId: po.id,
          plantingId: pl.id,
          plantingName: pl.plant_name,
          podaName: po.name,
          emoji: po.emoji || "✂️",
          color: po.color || "#16a34a",
          whenInfo: po.when_info || "Mês ideal de poda",
          how: po.how || "",
          tips: po.tips || "",
          goldenRule: schema.goldenRule || "",
          diagramType: schema.diagramType || "cup_shape",
          urgency: "high",
          message: `O mês atual (${currentMonth}) é a época ideal para a poda de ${pl.plant_name}!`,
        });
      });
    }
  });

  // 3. ALERTAS DE MONDAS & DESLADROAMENTO
  (mondas || []).forEach(mo => {
    const keywords = MONDA_KEYWORDS[mo.id] || [];
    const whenMonths = mo.when_months || [];
    const isMondaMonth = whenMonths.includes(currentMonth);

    const matchingPlantings = activePlantings.filter(pl =>
      matchesPlanting(keywords, mo.name, pl.plant_name)
    );

    matchingPlantings.forEach(pl => {
      const daysSincePlanting = daysDiff(pl.planted_date, today);
      const isTomato = mo.id.includes("tomate") || normalize(pl.plant_name).includes("tomate");
      const isRoot = ["monda_cenoura", "monda_rabanete", "monda_beterraba", "monda_nabo"].includes(mo.id);

      const needsAction =
        (isTomato && daysSincePlanting >= 15) ||
        (isRoot && daysSincePlanting >= 12 && daysSincePlanting <= 45) ||
        isMondaMonth;

      if (needsAction) {
        thinningAlerts.push({
          id: `alert-monda-${mo.id}-${pl.id}`,
          type: "monda",
          mondaId: mo.id,
          plantingId: pl.id,
          plantingName: pl.plant_name,
          mondaName: mo.name,
          emoji: mo.emoji || "🌱",
          color: mo.color || "#84cc16",
          spacing: mo.spacing || "",
          stage: mo.when_stage || mo.when_info || "Fase recomendada",
          how: mo.how || "",
          tips: mo.tips || "",
          diagramType: isTomato ? "solanaceae_sucker" : "root_thinning",
          urgency: "medium",
          message: isTomato
            ? `Vigiar axilas e retirar rebentos ladrões com o polegar para concentrar energia nos frutos.`
            : `Desbastar as plântulas em excesso para garantir o espaçamento ideal de ${mo.spacing || "desenvolvimento"}.`,
        });
      }
    });
  });

  // 4. ALERTAS DE COLHEITA IMINENTE
  activePlantings.forEach(pl => {
    if (!pl.expected_harvest_date) return;
    const daysToHarvest = daysDiff(today, pl.expected_harvest_date);

    if (daysToHarvest <= 0) {
      harvestAlerts.push({
        id: `alert-colheita-${pl.id}`,
        type: "colheita",
        plantingId: pl.id,
        plantingName: pl.plant_name,
        plantingEmoji: pl.plant_emoji || "🌾",
        plantingColor: pl.plant_color || "#eab308",
        expectedDate: pl.expected_harvest_date,
        urgency: "high",
        message: daysToHarvest === 0
          ? `Atingiu a data prevista de colheita hoje!`
          : `Ultrapassou a data prevista de colheita há ${Math.abs(daysToHarvest)} dias. Verifica a prontidão!`,
      });
    } else if (daysToHarvest <= 5) {
      harvestAlerts.push({
        id: `alert-colheita-${pl.id}`,
        type: "colheita",
        plantingId: pl.id,
        plantingName: pl.plant_name,
        plantingEmoji: pl.plant_emoji || "🌾",
        plantingColor: pl.plant_color || "#eab308",
        expectedDate: pl.expected_harvest_date,
        urgency: "medium",
        message: `Faltam apenas ${daysToHarvest} dias para a colheita prevista.`,
      });
    }
  });

  // 5. ALERTAS DE ANIMAIS (Alimentação e água diária)
  (myAnimals || []).forEach(ma => {
    animalAlerts.push({
      id: `alert-animal-${ma.id}`,
      type: "animal",
      animalId: ma.id,
      animalName: ma.animal_name,
      emoji: ma.animal_emoji || "🐾",
      color: ma.animal_color || "#ea580c",
      location: ma.location || "",
      urgency: "today",
      message: `Verificar água fresca e alimentação diária de ${ma.animal_name}.`,
    });
  });

  const allAlerts = [
    ...wateringAlerts.filter(a => a.urgency === "high" || a.urgency === "today"),
    ...pruningAlerts,
    ...thinningAlerts,
    ...harvestAlerts,
    ...animalAlerts,
  ];

  const totalDueToday =
    wateringAlerts.filter(a => a.urgency === "high" || a.urgency === "today").length +
    pruningAlerts.length +
    thinningAlerts.length +
    harvestAlerts.length +
    animalAlerts.length;

  return {
    allAlerts,
    wateringAlerts,
    pruningAlerts,
    thinningAlerts,
    harvestAlerts,
    animalAlerts,
    counts: {
      totalDueToday,
      watering: wateringAlerts.filter(a => a.urgency === "high" || a.urgency === "today").length,
      pruning: pruningAlerts.length,
      thinning: thinningAlerts.length,
      harvest: harvestAlerts.length,
      animals: animalAlerts.length,
    }
  };
}
