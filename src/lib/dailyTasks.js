// Motor de tarefas diárias da quinta.
// Combina plantações (rega), animais da quinta (alimentação/cuidados),
// podas sazonais e mondas (apenas de culturas que o utilizador tem plantadas)
// para gerar a lista do que fazer hoje.

import { PODA_SCHEMAS } from "./pruningThinningSchemas.js";
import { getLastWateredMap } from "./smartAlerts.js";
import { readRegionalPreferences } from "./regionalPreferences.js";
import { getLocalMonth } from "./regionalClimate.js";
import { getWeatherAdvice, localDateKey } from "./weather.js";
import { translate } from "./i18n.js";

const WATER_FREQ = {
  "Abundante": 1,
  "Moderada": 2,
  "Pouca": 3,
};

function daysSince(dateStr, today) {
  if (!dateStr) return 0;
  return Math.max(0, Math.floor((Date.parse(today + 'T00:00:00Z') - Date.parse(dateStr + 'T00:00:00Z')) / 86400000));
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

const PODA_MAPPING = {
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

const MONDA_MAPPING = {
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

function matchesPoda(poda, plantingNames) {
  const keywords = PODA_MAPPING[poda.id] || [];
  const podaNameNorm = normalize(poda.name);

  return plantingNames.some(plRaw => {
    const plNorm = normalize(plRaw);
    if (!plNorm) return false;

    for (const kw of keywords) {
      if (wordMatch(plNorm, kw)) return true;
    }
    if (wordMatch(podaNameNorm, plNorm) || wordMatch(plNorm, podaNameNorm)) return true;
    return false;
  });
}

function matchesMonda(monda, plantingNames) {
  const keywords = MONDA_MAPPING[monda.id] || [];
  const mondaNameNorm = normalize(monda.name);

  return plantingNames.some(plRaw => {
    const plNorm = normalize(plRaw);
    if (!plNorm) return false;

    // Desambiguação de alho vs alho-porro/alho-francês
    if (monda.id === "monda_alho") {
      if (plNorm.includes("porro") || plNorm.includes("frances")) return false;
      return wordMatch(plNorm, "alho");
    }
    if (monda.id === "monda_alho_porro") {
      return wordMatch(plNorm, "alho porro") || wordMatch(plNorm, "alho frances") || wordMatch(plNorm, "porro");
    }
    // Desambiguação de abóbora vs curgete
    if (monda.id === "monda_abobora") {
      if (plNorm.includes("curgete") || plNorm.includes("courgette") || plNorm.includes("aboborinha")) return false;
    }

    for (const kw of keywords) {
      if (wordMatch(plNorm, kw)) return true;
    }
    if (wordMatch(mondaNameNorm, plNorm) || wordMatch(plNorm, mondaNameNorm)) return true;
    return false;
  });
}

function calendarApplies(item) {
  const adaptation = item.regional_adaptation;
  return !adaptation || (adaptation.configured && adaptation.status === 'estimate' && !['conditional', 'not_recommended'].includes(adaptation.suitability));
}

export function computeDailyTasks({ plantings, plants, myAnimals, farmAnimals, podas, mondas, preferences = readRegionalPreferences(), weather = null, now = new Date() }) {
  const tasks = { rega: [], animais: [], podas: [], mondas: [] };
  const t = (key, vars) => translate(key, preferences.language, vars);
  const plantByName = {};
  (plants || []).forEach(p => { plantByName[p.name] = p; });
  const faById = {};
  (farmAnimals || []).forEach(a => { faById[a.id] = a; });
  const currentMonth = getLocalMonth(now, preferences);
  const today = localDateKey(now, preferences.timeZone);
  const lastWateredMap = getLastWateredMap();

  // Apenas plantações ativas (exclui as já colhidas)
  const activePlantings = (plantings || []).filter(pl => pl.status !== "Colhida");
  const activePlantNames = activePlantings.map(pl => pl.plant_name).filter(Boolean);

  // Rega — frequência conforme necessidades de água da planta e última rega
  activePlantings.forEach(pl => {
    const plant = plantByName[pl.plant_name];
    const water = plant?.water_requirements || "Moderada";
    const freq = WATER_FREQ[water] || 2;
    const lastWatered = lastWateredMap[pl.id] || pl.planted_date || today;
    const isWateredToday = lastWateredMap[pl.id] === today;
    const daysSinceWater = daysSince(lastWatered, today);
    const environment = ['outdoor','container','greenhouse','indoor'].includes(pl.growing_environment) ? pl.growing_environment : preferences.growingEnvironment;
    const weatherAdvice = getWeatherAdvice(weather, { ...preferences, growingEnvironment: environment }, { now: Number(now), wateredToday: isWateredToday }).filter(advice => ['rain', 'shelteredRain', 'heat'].includes(advice.kind) && !(environment === 'indoor' && advice.kind === 'heat'));

    if (daysSinceWater >= freq || isWateredToday || weatherAdvice.some(advice=>advice.kind==='heat')) {
      tasks.rega.push({
        id: `rega-${pl.id}`,
        plantingId: pl.id,
        plantName: pl.plant_name,
        title: t(weatherAdvice.some(advice => advice.kind === 'rain') ? 'tasks.checkSoilTitle' : 'tasks.waterTitle', { name: pl.plant_name }),
        detail: t('tasks.waterDetail', { requirement: water.toLowerCase() }) + (pl.location ? ` · ${pl.location}` : ''),
        weatherAdvice: weatherAdvice.map(advice => ({ ...advice, message: t(advice.bodyKey, advice.vars) })),
        emoji: pl.plant_emoji || "🌱",
        color: pl.plant_color || "#0ea5e9",
        waterReq: water,
        wateredToday: isWateredToday,
        isOverdue: daysSinceWater > freq && !isWateredToday,
      });
    }
  });

  // Animais — tarefas diárias de alimentação e cuidados
  (myAnimals || []).forEach(ma => {
    const fa = ma.animal_id ? faById[ma.animal_id] : null;
    const feeding = fa?.feeding || fa?.feed_items || "";
    const care = fa?.care || "";
    const meta = [
      ma.quantity ? t('tasks.animalCount', { count: ma.quantity }) : "",
      ma.location || "",
    ].filter(Boolean).join(" · ");
    tasks.animais.push({
      id: `anim-${ma.id}`,
      title: t('tasks.feedTitle', { name: ma.animal_name }),
      detail: meta,
      how: feeding,
      care,
      emoji: ma.animal_emoji || "🐾",
      color: ma.animal_color || "#ea580c",
    });
  });

  // Podas — apenas de espécies plantadas pelo utilizador (ativas) e no mês correto
  (podas || []).forEach(po => {
    if (calendarApplies(po) && (po.when_months || []).includes(currentMonth) && matchesPoda(po, activePlantNames)) {
      const cleanTitle = po.name.toLowerCase().startsWith("poda")
        ? po.name
        : t('tasks.pruneTitle', { name: po.name });
      const schema = PODA_SCHEMAS[po.id] || {};

      tasks.podas.push({
        id: `poda-${po.id}`,
        podaId: po.id,
        podaName: po.name,
        title: cleanTitle,
        detail: po.when_info || t('tasks.pruningSeason'),
        how: po.how,
        tips: po.tips,
        diagramType: schema.diagramType || "cup_shape",
        goldenRule: schema.goldenRule || "",
        emoji: po.emoji || "✂️",
        color: po.color || "#16a34a",
      });
    }
  });

  // Mondas — apenas de espécies plantadas pelo utilizador (ativas) e no mês correto
  (mondas || []).forEach(mo => {
    const conditional = mo.regional_adaptation?.suitability === 'conditional';
    const observedStage = conditional && activePlantings.some(planting => {
      if (!planting.planted_date || !matchesMonda(mo, [planting.plant_name])) return false;
      const age = daysSince(planting.planted_date, today);
      return mo.id.includes('tomate') ? age >= 15 : ['monda_cenoura', 'monda_rabanete', 'monda_beterraba', 'monda_nabo'].includes(mo.id) && age >= 12 && age <= 45;
    });
    if (((calendarApplies(mo) && (mo.when_months || []).includes(currentMonth)) || observedStage) && matchesMonda(mo, activePlantNames)) {
      const cleanTitle = mo.name.toLowerCase().startsWith("monda")
        ? mo.name
        : t('tasks.thinTitle', { name: mo.name });
      const isTomato = mo.id.includes("tomate") || normalize(mo.name).includes("tomate");

      tasks.mondas.push({
        id: `monda-${mo.id}`,
        mondaId: mo.id,
        mondaName: mo.name,
        title: cleanTitle,
        detail: mo.when_stage || mo.when_info || t('tasks.thinningSeason'),
        spacing: mo.spacing || "",
        how: mo.how,
        tips: mo.tips,
        diagramType: isTomato ? "solanaceae_sucker" : "root_thinning",
        emoji: mo.emoji || "🌱",
        color: mo.color || "#84cc16",
      });
    }
  });

  return tasks;
}

export function countTasks(tasks) {
  if (!tasks) return 0;
  return (
    (tasks.rega?.length || 0) +
    (tasks.animais?.length || 0) +
    (tasks.podas?.length || 0) +
    (tasks.mondas?.length || 0)
  );
}
