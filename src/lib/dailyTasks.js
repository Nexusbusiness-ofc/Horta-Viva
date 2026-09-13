// Motor de tarefas diárias da quinta.
// Combina plantações (rega), animais da quinta (alimentação/cuidados),
// podas sazonais e mondas (apenas de culturas que o utilizador tem plantadas)
// para gerar a lista do que fazer hoje.

const WATER_FREQ = {
  "Abundante": 1,
  "Moderada": 2,
  "Pouca": 3,
};

function daysSince(dateStr) {
  if (!dateStr) return 0;
  const start = new Date(dateStr + "T00:00:00");
  const today = new Date();
  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.floor((today - start) / 86400000));
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
  monda_cenoura: ["cenoura"],
  monda_rabanete: ["rabanete", "rabano"],
  monda_beterraba: ["beterraba"],
  monda_nabo: ["nabo", "nabica", "nabicas", "grelos"],
  monda_alface: ["alface"],
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
  monda_abobora: ["abobora"],
  monda_melao: ["melao", "melancia"],
  monda_milho: ["milho"],
  monda_favas: ["fava", "favas", "ervilha", "ervilhas"],
  monda_couve: ["couve", "couves", "repolho", "repolhos", "couve flor", "brocolos", "couve portuguesa"],
  monda_salsa: ["salsa", "coentro", "coentros"],
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

export function computeDailyTasks({ plantings, plants, myAnimals, farmAnimals, podas, mondas }) {
  const tasks = { rega: [], animais: [], podas: [], mondas: [] };
  const plantByName = {};
  (plants || []).forEach(p => { plantByName[p.name] = p; });
  const faById = {};
  (farmAnimals || []).forEach(a => { faById[a.id] = a; });
  const currentMonth = new Date().getMonth() + 1;

  // Apenas plantações ativas (exclui as já colhidas)
  const activePlantings = (plantings || []).filter(pl => pl.status !== "Colhida");
  const activePlantNames = activePlantings.map(pl => pl.plant_name).filter(Boolean);

  // Rega — frequência conforme necessidades de água da planta
  activePlantings.forEach(pl => {
    const plant = plantByName[pl.plant_name];
    const water = plant?.water_requirements || "Moderada";
    const freq = WATER_FREQ[water] || 2;
    const dayIdx = daysSince(pl.planted_date);
    if (dayIdx % freq === 0) {
      tasks.rega.push({
        id: `rega-${pl.id}`,
        title: `Regar ${pl.plant_name}`,
        detail: `Rega ${water.toLowerCase()}${pl.location ? ` · ${pl.location}` : ""}`,
        emoji: pl.plant_emoji || "🌱",
        color: pl.plant_color || "#84cc16",
      });
    }
  });

  // Animais — tarefas diárias de alimentação e cuidados
  (myAnimals || []).forEach(ma => {
    const fa = ma.animal_id ? faById[ma.animal_id] : null;
    const feeding = fa?.feeding || fa?.feed_items || "";
    const care = fa?.care || "";
    const meta = [
      ma.quantity ? `${ma.quantity} animal(ns)` : "",
      ma.location || "",
    ].filter(Boolean).join(" · ");
    tasks.animais.push({
      id: `anim-${ma.id}`,
      title: `Alimentar e cuidar de ${ma.animal_name}`,
      detail: meta,
      how: feeding,
      care,
      emoji: ma.animal_emoji || "🐾",
      color: ma.animal_color || "#ea580c",
    });
  });

  // Podas — apenas de espécies plantadas pelo utilizador (ativas) e no mês correto
  (podas || []).forEach(po => {
    if ((po.when_months || []).includes(currentMonth) && matchesPoda(po, activePlantNames)) {
      tasks.podas.push({
        id: `poda-${po.id}`,
        title: `Podar ${po.name}`,
        detail: po.when_info || "Época de poda",
        how: po.how,
        tips: po.tips,
        emoji: po.emoji || "✂️",
        color: po.color || "#16a34a",
      });
    }
  });

  // Mondas — apenas de espécies plantadas pelo utilizador (ativas) e no mês correto
  (mondas || []).forEach(mo => {
    if ((mo.when_months || []).includes(currentMonth) && matchesMonda(mo, activePlantNames)) {
      tasks.mondas.push({
        id: `monda-${mo.id}`,
        title: `Monda: ${mo.name}`,
        detail: mo.when_stage || mo.spacing || "Época de monda",
        how: mo.how,
        tips: mo.tips,
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