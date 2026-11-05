// Biblioteca de Sabedoria Agrícola: Calendário Lunar, Consociação, Calculadora de Canteiro,
// Rotação de Culturas (4 Anos), Caldas Biológicas & Compostagem e Guia de Pragas/Auxiliares.

export const LUNAR_PHASES = {
  new: {
    key: "new",
    name: "Lua Nova",
    emoji: "🌑",
    color: "#334155",
    bg: "from-slate-800 via-slate-900 to-emerald-950",
    badgeBg: "bg-slate-800 text-slate-100",
    sapFlow: "Seiva concentrada nas raízes",
    bestFor: "Repouso do solo, limpeza de ervas daninhas, poda de ramos secos/doentes, compostagem e preparação de canteiros.",
    avoid: "Evitar sementeiras delicadas de folha ou transplantes de raiz nua.",
    recommendedTasks: ["🧹 Limpar infestantes", "🪵 Podar ramos secos", "♻️ Virar pilha de composto", "🚜 Preparar e estrumar a terra"]
  },
  waxing: {
    key: "waxing",
    name: "Lua Crescente",
    emoji: "🌓",
    color: "#059669",
    bg: "from-emerald-700 via-green-800 to-teal-900",
    badgeBg: "bg-emerald-600 text-white",
    sapFlow: "Seiva a subir para os caules e folhas",
    bestFor: "Semear e transplantar hortaliças de fruto e folha que crescem acima do solo (Tomate, Pimento, Feijão, Ervilha, Couves, Milho, Curgete) e enxertias.",
    avoid: "Evitar podas drásticas em árvores com muita seiva e colheita de raízes para guardar.",
    recommendedTasks: ["🌱 Semear frutos e folhas", "🍅 Transplantar tomate/pimento", "🌿 Fazer estacas e enxertos", "💧 Regar com biofertilizante"]
  },
  full: {
    key: "full",
    name: "Lua Cheia",
    emoji: "🌕",
    color: "#d97706",
    bg: "from-amber-600 via-orange-700 to-emerald-900",
    badgeBg: "bg-amber-500 text-amber-950",
    sapFlow: "Seiva no pico máximo na copa, flores e frutos",
    bestFor: "Colher frutos sumarentos e ervas aromáticas/medicinais (máximo aroma), semear alfaces de cabeça/repolho e aplicar caldas foliares.",
    avoid: "Evitar podar árvores de fruto ou fazer enxertias (excesso de perda de seiva).",
    recommendedTasks: ["🧺 Colher frutos e aromáticas", "🥬 Semear couves de repolho", "🧪 Aplicar calda de cavalinha/urtiga", "🍯 Inspecionar colmeias"]
  },
  waning: {
    key: "waning",
    name: "Lua Minguante",
    emoji: "🌗",
    color: "#0284c7",
    bg: "from-sky-800 via-teal-900 to-emerald-950",
    badgeBg: "bg-sky-600 text-white",
    sapFlow: "Seiva a descer de volta para as raízes e bolbos",
    bestFor: "Semear e plantar raízes, tubérculos e bolbos (Batata, Cenoura, Alho, Cebola, Beterraba, Rabanete, Nabo) e realizar podas de formação/produção.",
    avoid: "Evitar semear plantas que espigam facilmente se quiseres apenas sementes rápidas.",
    recommendedTasks: ["🥔 Plantar batata, alho e cebola", "🥕 Semear cenoura e beterraba", "✂️ Podar árvores e videiras", "🪵 Cortar madeira e estacas"]
  }
};

export function getLunarPhaseInfo(date = new Date()) {
  // Known new moon reference: Jan 6, 2000 18:14 UTC
  const synodicMonth = 29.530588853;
  const refNewMoon = Date.UTC(2000, 0, 6, 18, 14, 0);
  const targetMs = date.getTime();
  const daysSince = (targetMs - refNewMoon) / 86400000;
  const normalized = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth;
  const cycleFraction = normalized / synodicMonth;

  // Illumination percentage (0% at new, 100% at full)
  const illumination = Math.round(((1 - Math.cos(cycleFraction * 2 * Math.PI)) / 2) * 100);

  let phaseKey = "new";
  if (normalized < 1.85 || normalized >= 27.68) {
    phaseKey = "new";
  } else if (normalized < 12.9) {
    phaseKey = "waxing";
  } else if (normalized < 16.6) {
    phaseKey = "full";
  } else {
    phaseKey = "waning";
  }

  const meta = LUNAR_PHASES[phaseKey];
  return {
    ...meta,
    ageDays: Number(normalized.toFixed(1)),
    illumination,
    date
  };
}

export function getNextDaysMoon(count = 28, startDate = new Date()) {
  const days = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(startDate);
    d.setDate(startDate.getDate() + i);
    days.push(getLunarPhaseInfo(d));
  }
  return days;
}

// 4-Year Crop Rotation System
export const ROTATION_GROUPS = {
  leguminosas: {
    id: "leguminosas",
    step: 1,
    title: "1.º Ano — Leguminosas (Enriquecedoras)",
    emoji: "🫘",
    color: "#059669",
    bg: "bg-emerald-50 border-emerald-200",
    badge: "bg-emerald-600 text-white",
    nutrientRole: "Fixam azoto atmosférico na terra através das raízes (Rhizobium), preparando o solo para culturas exigentes.",
    examples: ["Fava", "Feijão", "Feijão-frade", "Ervilha", "Grão-de-bico", "Tremoço", "Lentilha", "Amendoim"],
    prevGroup: "Raízes e Bolbos",
    nextGroup: "Folhas e Brássicas (Couves, Alface, Espinafre)"
  },
  folhas: {
    id: "folhas",
    step: 2,
    title: "2.º Ano — Folhas & Brássicas (Consumidoras de Azoto)",
    emoji: "🥬",
    color: "#16a34a",
    bg: "bg-green-50 border-green-200",
    badge: "bg-green-600 text-white",
    nutrientRole: "Aproveitam todo o azoto deixado pelas leguminosas para desenvolver folhas verdes vigorosas.",
    examples: ["Couve-galega", "Couve-flor", "Brócolos", "Couve-roxa", "Alface", "Espinafre", "Acelga", "Agrião", "Rúcula"],
    prevGroup: "Leguminosas (Fava, Feijão, Ervilha, Tremoço)",
    nextGroup: "Frutos Exigentes (Tomate, Pimento, Abóbora, Milho)"
  },
  frutos: {
    id: "frutos",
    step: 3,
    title: "3.º Ano — Frutos & Solanáceas/Cucurbitáceas (Exigentes)",
    emoji: "🍅",
    color: "#ea580c",
    bg: "bg-orange-50 border-orange-200",
    badge: "bg-orange-600 text-white",
    nutrientRole: "Exigem matéria orgânica madura, fósforo e potássio para florir e frutificar em abundância.",
    examples: ["Tomate", "Pimento", "Beringela", "Curgete", "Abóbora", "Pepino", "Melão", "Melancia", "Milho", "Morango"],
    prevGroup: "Folhas e Brássicas",
    nextGroup: "Raízes, Tubérculos e Bolbos (Cenoura, Cebola, Alho)"
  },
  raizes: {
    id: "raizes",
    step: 4,
    title: "4.º Ano — Raízes, Tubérculos & Bolbos (Frugal / Limpeza)",
    emoji: "🥕",
    color: "#d97706",
    bg: "bg-amber-50 border-amber-200",
    badge: "bg-amber-600 text-white",
    nutrientRole: "Aproveitam nutrientes profundos do solo sem precisar de estrume fresco (que racha as raízes). Fecham o ciclo!",
    examples: ["Cenoura", "Beterraba", "Rabanete", "Nabo", "Cebola", "Alho", "Alho-porro", "Batata", "Batata-doce", "Cherovia"],
    prevGroup: "Frutos Exigentes",
    nextGroup: "Leguminosas (para voltar a fixar azoto no 1.º Ano)"
  }
};

// Companion & Spacing rules by crop keyword
const CROP_PROFILES = [
  {
    match: ["tomate", "piri-piri", "pimento", "beringela"],
    family: "Solanáceas",
    rotation: "frutos",
    rowSpacingCm: 60,
    plantSpacingCm: 45,
    yieldKgPerPlant: 3.2,
    waterLitersPerWeek: 10,
    good: [
      { id: "plant_44", name: "Manjericão", reason: "Repele mosca-branca e pulgão, intensificando o aroma do fruto." },
      { id: "plant_45", name: "Cenoura", reason: "Areja a camada superficial sem competir com as raízes fundas." },
      { id: "plant_46", name: "Cebola", reason: "O cheiro sulfuroso afasta ácaros e pragas do colo." },
      { id: "plant_31", name: "Alface", reason: "Cobre o solo à sombra do tomateiro, poupando humidade." },
      { id: "plant_38", name: "Salsa", reason: "Atrai insetos polinizadores e sirfídeos predadores de pragas." }
    ],
    bad: [
      { id: "plant_48", name: "Batata", reason: "Mesma família: partilham o fungo do míldio e o escaravelho." },
      { id: "plant_91", name: "Funcho", reason: "Liberta substâncias nas raízes que inibem o crescimento do tomateiro." },
      { id: "plant_7", name: "Couve-flor", reason: "Compete fortemente pelos mesmos nutrientes do solo." }
    ]
  },
  {
    match: ["feijão", "feijao", "fava", "ervilha", "grão", "grao", "tremoço", "tremoco", "lentilha", "amendoim"],
    family: "Leguminosas (Fabáceas)",
    rotation: "leguminosas",
    rowSpacingCm: 45,
    plantSpacingCm: 20,
    yieldKgPerPlant: 0.45,
    waterLitersPerWeek: 5,
    good: [
      { id: "plant_35", name: "Milho", reason: "Serve de tutor natural aos feijoeiros enquanto recebe azoto na raiz." },
      { id: "plant_49", name: "Abóbora", reason: "As folhas largas sombreiam o solo e travam as ervas daninhas (Tríade Milpa)." },
      { id: "plant_45", name: "Cenoura", reason: "Beneficia diretamente do azoto fixado pelas leguminosas." },
      { id: "plant_75", name: "Couve-galega", reason: "Excelente sinergia: a leguminosa alimenta a couve com azoto." },
      { id: "plant_32", name: "Pepino", reason: "Estimula a produção e aproveita a cobertura do solo." }
    ],
    bad: [
      { id: "plant_42", name: "Alho", reason: "Os compostos antibacterianos dos bolbos travam as bactérias fixadoras de azoto das leguminosas." },
      { id: "plant_46", name: "Cebola", reason: "Inibe a simbiose radicular do feijão, fava e ervilha." },
      { id: "plant_5", name: "Alho-porro", reason: "Antagonismo radicular direto com toda a família das leguminosas." }
    ]
  },
  {
    match: ["couve", "brócolo", "brocolo", "nabiça", "nabica", "rúcula", "rucula", "agrião", "agriao"],
    family: "Brássicas (Crucíferas)",
    rotation: "folhas",
    rowSpacingCm: 50,
    plantSpacingCm: 40,
    yieldKgPerPlant: 1.4,
    waterLitersPerWeek: 8,
    good: [
      { id: "plant_2", name: "Alecrim", reason: "O aroma forte disfarça o cheiro da couve e afasta a borboleta-da-couve." },
      { id: "plant_92", name: "Salva", reason: "Protege contra a lagarta-da-couve e pulgão-cinzento." },
      { id: "plant_11", name: "Hortelã", reason: "Repele alticas, pulgões e borboletas brancas." },
      { id: "plant_4", name: "Beterraba", reason: "Raízes a profundidades diferentes; excelente ocupação do canteiro." },
      { id: "plant_47", name: "Ervilha", reason: "Fornece azoto essencial para folhas grandes e tenras." }
    ],
    bad: [
      { id: "plant_50", name: "Morango", reason: "Competem por nutrientes superficiais e prejudicam o vigor mútuo." },
      { id: "plant_28", name: "Uva", reason: "As couves reduzem o vigor e a doçura junto às videiras." }
    ]
  },
  {
    match: ["alface", "espinafre", "acelga", "canónigo", "canonigo", "chicória", "chicoria", "aipo"],
    family: "Folhosas de Salada",
    rotation: "folhas",
    rowSpacingCm: 30,
    plantSpacingCm: 25,
    yieldKgPerPlant: 0.4,
    waterLitersPerWeek: 6,
    good: [
      { id: "plant_36", name: "Rabanete", reason: "Cresce depressa entre as alfaces e deixa-as mais tenras." },
      { id: "plant_45", name: "Cenoura", reason: "Raiz funda que não compete com a raiz superficial da alface." },
      { id: "plant_50", name: "Morango", reason: "Excelente combinação de bordadura em canteiros elevados." },
      { id: "plant_46", name: "Cebola", reason: "Repele pulgões que atacam o coração das alfaces." }
    ],
    bad: [
      { id: "plant_38", name: "Salsa", reason: "Em excesso pode abafar a germinação de alfaces jovens." }
    ]
  },
  {
    match: ["cenoura", "beterraba", "rabanete", "nabo", "cherovia", "gengibre"],
    family: "Raízes & Umbelíferas",
    rotation: "raizes",
    rowSpacingCm: 30,
    plantSpacingCm: 10,
    yieldKgPerPlant: 0.22,
    waterLitersPerWeek: 4,
    good: [
      { id: "plant_5", name: "Alho-porro", reason: "Parceria clássica: o alho-porro afasta a mosca-da-cenoura e a cenoura afasta a traça do alho-porro!" },
      { id: "plant_46", name: "Cebola", reason: "Cria uma barreira aromática protetora contra pragas de raiz." },
      { id: "plant_31", name: "Alface", reason: "Aproveita o espaço entre linhas nos primeiros 40 dias." },
      { id: "plant_2", name: "Alecrim", reason: "Reforça a proteção natural contra a mosca-da-cenoura." }
    ],
    bad: [
      { id: "plant_91", name: "Funcho", reason: "Atrai pragas da mesma família e trava o engrossamento da raiz." }
    ]
  },
  {
    match: ["alho", "cebola"],
    family: "Allium (Bolbos)",
    rotation: "raizes",
    rowSpacingCm: 25,
    plantSpacingCm: 12,
    yieldKgPerPlant: 0.18,
    waterLitersPerWeek: 3,
    good: [
      { id: "plant_45", name: "Cenoura", reason: "Proteção mútua contra a mosca-da-cebola e a mosca-da-cenoura." },
      { id: "plant_50", name: "Morango", reason: "O alho e a cebola evitam a podridão cinzenta (Botrytis) nos morangos!" },
      { id: "plant_41", name: "Tomate", reason: "Reduz infeções fúngicas e ataques de ácaros." },
      { id: "plant_4", name: "Beterraba", reason: "Ótima consociação sem competição por luz." }
    ],
    bad: [
      { id: "plant_40", name: "Feijão", reason: "Inibe o crescimento das leguminosas (feijão, fava, ervilha, tremoço)." },
      { id: "plant_1", name: "Fava", reason: "Prejudica a fixação de azoto nas raízes das favas." },
      { id: "plant_47", name: "Ervilha", reason: "Incompatível com todas as ervilhas e leguminosas." }
    ]
  },
  {
    match: ["batata"],
    family: "Tubérculos",
    rotation: "raizes",
    rowSpacingCm: 65,
    plantSpacingCm: 35,
    yieldKgPerPlant: 1.5,
    waterLitersPerWeek: 7,
    good: [
      { id: "plant_1", name: "Fava", reason: "Enriquece a terra com azoto e ajuda a afastar o escaravelho." },
      { id: "plant_40", name: "Feijão", reason: "Protege os corredores entre linhas de batata." },
      { id: "plant_75", name: "Couve-galega", reason: "Aproveita a terra mobilizada na amontoa da batata." },
      { id: "plant_35", name: "Milho", reason: "Boa parceria de bordo para quebrar o vento." }
    ],
    bad: [
      { id: "plant_41", name: "Tomate", reason: "Partilham o míldio — nunca plantar lado a lado!" },
      { id: "plant_49", name: "Abóbora", reason: "Compete demasiado por água e espaço subterrâneo." },
      { id: "plant_32", name: "Pepino", reason: "Aumenta a suscetibilidade da batata ao míldio." }
    ]
  },
  {
    match: ["curgete", "abóbora", "abobora", "pepino", "melão", "melao", "melancia", "chuchu"],
    family: "Cucurbitáceas",
    rotation: "frutos",
    rowSpacingCm: 90,
    plantSpacingCm: 80,
    yieldKgPerPlant: 4.5,
    waterLitersPerWeek: 14,
    good: [
      { id: "plant_35", name: "Milho", reason: "Oferece meia-sombra ligeira e proteção contra ventos secos." },
      { id: "plant_40", name: "Feijão", reason: "Fornece o azoto de que as abóboras e curgetes precisam." },
      { id: "plant_36", name: "Rabanete", reason: "Semear junto ao pé afasta escaravelhos das cucurbitáceas." },
      { id: "plant_44", name: "Manjericão", reason: "Atrai abelhas essenciais para polinizar as flores femininas!" }
    ],
    bad: [
      { id: "plant_48", name: "Batata", reason: "Forte competição por potássio e água." }
    ]
  }
];

const DEFAULT_PROFILE = {
  family: "Aromáticas & Horto-frutícolas",
  rotation: "folhas",
  rowSpacingCm: 40,
  plantSpacingCm: 30,
  yieldKgPerPlant: 0.8,
  waterLitersPerWeek: 5,
  good: [
    { id: "plant_41", name: "Tomate", reason: "Beneficia da presença de polinizadores e proteção aromática." },
    { id: "plant_31", name: "Alface", reason: "Cobre o solo e conserva a frescura junto às raízes." },
    { id: "plant_45", name: "Cenoura", reason: "Compatível com quase todas as culturas da horta." }
  ],
  bad: [
    { id: "plant_91", name: "Funcho", reason: "O funcho deve ficar isolado no canto da horta por ser alelopático." }
  ]
};

export function getPlantAgronomyProfile(plant) {
  if (!plant) return { ...DEFAULT_PROFILE, rotationGroup: ROTATION_GROUPS.folhas };
  const name = (plant.name || "").toLowerCase();
  const found = CROP_PROFILES.find(p => p.match.some(m => name.includes(m))) || DEFAULT_PROFILE;
  const rotationGroup = ROTATION_GROUPS[found.rotation] || ROTATION_GROUPS.folhas;
  return {
    ...found,
    rotationGroup
  };
}

export function calculateBedPlan(plant, lengthMeters = 2.5, widthMeters = 1.2) {
  const profile = getPlantAgronomyProfile(plant);
  const L = Math.max(0.5, Number(lengthMeters) || 1);
  const W = Math.max(0.4, Number(widthMeters) || 1);
  const areaM2 = Number((L * W).toFixed(2));

  const rowM = profile.rowSpacingCm / 100;
  const colM = profile.plantSpacingCm / 100;

  const rows = Math.max(1, Math.floor(W / rowM));
  const cols = Math.max(1, Math.floor(L / colM));
  const totalPlants = rows * cols;

  const estimatedYieldKg = Number((totalPlants * profile.yieldKgPerPlant).toFixed(1));
  const weeklyWaterLiters = Math.round(totalPlants * profile.waterLitersPerWeek);
  const compostKg = Number((areaM2 * 3.5).toFixed(1));

  return {
    areaM2,
    rows,
    cols,
    totalPlants,
    rowSpacingCm: profile.rowSpacingCm,
    plantSpacingCm: profile.plantSpacingCm,
    estimatedYieldKg,
    weeklyWaterLiters,
    compostKg
  };
}

// 7 Complete Organic Preparations (Caldas Biológicas)
export const BIO_RECIPES = [
  {
    id: "chorume_urtiga",
    name: "Chorume / Calda de Urtiga",
    emoji: "🌿",
    category: "Biofertilizante & Repelente",
    color: "#15803d",
    purpose: "Rico em azoto, ferro e magnésio. Estimula o crescimento e repele pulgões e ácaros.",
    baseWaterLiters: 10,
    ingredientsPerLiter: [
      { name: "Urtigas frescas picadas (sem sementes)", amountPerLiter: 100, unit: "g" },
      { name: "Água da chuva ou sem cloro", amountPerLiter: 1, unit: "L" }
    ],
    dilutionNote: "Diluir a 10% (1 L de calda para 10 L de água na rega) ou 5% para pulverização foliar.",
    steps: [
      "Colocar as urtigas picadas num balde de plástico ou madeira (nunca metal) com a água.",
      "Mexer diariamente durante 10 a 14 dias à sombra até deixarem de se formar bolhas de fermentação.",
      "Coar com um pano ou passador fino e diluir antes de aplicar ao final da tarde."
    ],
    safetyDays: "Sem intervalo de segurança (lavar bem antes de consumir)."
  },
  {
    id: "calda_bordalesa",
    name: "Calda Bordalesa Tradicional",
    emoji: "🛡️",
    category: "Fungicida Preventivo",
    color: "#0284c7",
    purpose: "Previne Míldio, Pedrado, Lepra-do-pessegueiro e Olho-de-pavão em tomateiros, batata, vinha e fruteiras.",
    baseWaterLiters: 10,
    ingredientsPerLiter: [
      { name: "Sulfato de cobre", amountPerLiter: 10, unit: "g" },
      { name: "Cal hidratada agrícola", amountPerLiter: 10, unit: "g" },
      { name: "Água limpa", amountPerLiter: 1, unit: "L" }
    ],
    dilutionNote: "Pronta a aplicar (para plantas jovens ou tomateiro em flor usar meia dose: 5g/L).",
    steps: [
      "Dissolver o sulfato de cobre em metade da água morna num balde de plástico.",
      "Noutro balde, dissolver a cal hidratada na restante água.",
      "Verter lentamente a solução de cobre sobre o leite de cal (nunca o contrário!), mexendo sempre."
    ],
    safetyDays: "7 a 15 dias consoante a cultura."
  },
  {
    id: "decoccao_cavalinha",
    name: "Decocção de Cavalinha",
    emoji: "🌾",
    category: "Fortificante Anti-Fungos",
    color: "#0d9488",
    purpose: "Rica em sílica orgânica: engrossa a parede celular das folhas e impede a entrada de Oídio, Míldio e Ferrugem.",
    baseWaterLiters: 10,
    ingredientsPerLiter: [
      { name: "Cavalinha seca (ou 100g fresca)", amountPerLiter: 25, unit: "g" },
      { name: "Água", amountPerLiter: 1, unit: "L" }
    ],
    dilutionNote: "Diluir 1 parte de decocção em 4 partes de água antes de pulverizar.",
    steps: [
      "Deixar a cavalinha de molho em água durante 24 horas.",
      "Ferver em lume brando durante 30 minutos e deixar arrefecer tapado.",
      "Coar, diluir e pulverizar as folhas de manhã cedo."
    ],
    safetyDays: "0 dias (100% natural)."
  },
  {
    id: "alho_malagueta",
    name: "Extrato de Alho e Malagueta",
    emoji: "🧄",
    category: "Inseticida & Repelente Natural",
    color: "#dc2626",
    purpose: "Afasta pulgão, mosca-branca, tripes, lagartas e formigas das hortaliças.",
    baseWaterLiters: 10,
    ingredientsPerLiter: [
      { name: "Dentes de alho esmagados", amountPerLiter: 10, unit: "g" },
      { name: "Malagueta / Piri-piri picado", amountPerLiter: 3, unit: "g" },
      { name: "Sabão neutro/potássico (aderente)", amountPerLiter: 2, unit: "ml" }
    ],
    dilutionNote: "Macerado concentrado pronto após coar e juntar à água total.",
    steps: [
      "Triturar o alho e a malagueta em 1 litro de água morna e deixar repousar 24 horas.",
      "Coar com um pano fino para não entupir o pulverizador.",
      "Juntar a restante água e o sabão neutro mesmo antes de pulverizar o verso das folhas."
    ],
    safetyDays: "2 dias (para não deixar sabor picante nas folhas)."
  },
  {
    id: "sabao_potassico",
    name: "Calda de Sabão Potássico",
    emoji: "🫧",
    category: "Controlo de Pragas de Corpo Mole",
    color: "#7c3aed",
    purpose: "Elimina piolho/pulgão, cochonilha e mosca-branca por contacto sem prejudicar abelhas ou joaninhas.",
    baseWaterLiters: 10,
    ingredientsPerLiter: [
      { name: "Sabão potássico líquido (ou sabão azul e branco ralado)", amountPerLiter: 15, unit: "ml" },
      { name: "Água morna", amountPerLiter: 1, unit: "L" }
    ],
    dilutionNote: "Aplicar diretamente nas colónias de pulgão ao pôr-do-sol.",
    steps: [
      "Dissolver o sabão potássico em água morna agitando suavemente.",
      "Pulverizar bem a página inferior das folhas onde se escondem os pulgões e a mosca-branca.",
      "Repetir passados 5 dias se necessário."
    ],
    safetyDays: "0 dias."
  },
  {
    id: "calda_cinza",
    name: "Calda & Barreira de Cinza de Madeira",
    emoji: "🔥",
    category: "Potássio, Oídio & Anti-Lesmas",
    color: "#b45309",
    purpose: "Fornece potássio e cálcio para frutos mais doces, trava o Oídio e cria barreira física contra caracóis/lesmas.",
    baseWaterLiters: 10,
    ingredientsPerLiter: [
      { name: "Cinza peneirada de lenha limpa (sem carvão tratado)", amountPerLiter: 50, unit: "g" },
      { name: "Água", amountPerLiter: 1, unit: "L" }
    ],
    dilutionNote: "Deixar decantar 24h e usar apenas a água limpa de cima no pulverizador.",
    steps: [
      "Misturar a cinza peneirada na água e mexer 3 vezes ao longo de 24 horas.",
      "Retirar o líquido límpido superior para pulverizar contra oídio ou regar junto a tomateiros e fruteiras.",
      "A cinza seca também pode ser espalhada em anel à volta das alfaces contra lesmas."
    ],
    safetyDays: "0 dias."
  }
];

// Pests, Diseases & Beneficial Insects Guide
export const PESTS_AND_ALLIES = [
  {
    id: "mildio",
    type: "doenca",
    name: "Míldio",
    emoji: "🍂",
    color: "#b45309",
    affectedCrops: "Tomateiro, Batateira, Videira, Cebola, Pepino",
    symptoms: "Manchas amareladas/oleosas na parte superior da folha que passam a castanho-escuro com bolor esbranquiçado por baixo e manchas negras no caule.",
    prevention: "Regar sempre no pé sem molhar as folhas, espaçar bem as plantas, desladroar o tomateiro e nunca plantar tomate junto a batata.",
    remedyRecipeId: "calda_bordalesa",
    remedyName: "Calda Bordalesa + Decocção de Cavalinha"
  },
  {
    id: "oidio",
    type: "doenca",
    name: "Oídio (Cinza / Pó-branco)",
    emoji: "🌫️",
    color: "#64748b",
    affectedCrops: "Curgete, Abóbora, Pepino, Melão, Videira, Ervilha, Roseira",
    symptoms: "Camada de pó branco semelhante a farinha ou cinza sobre as folhas, que acabam por secar.",
    prevention: "Evitar excesso de azoto, garantir boa circulação de ar e remover logo as primeiras folhas afetadas.",
    remedyRecipeId: "calda_cinza",
    remedyName: "Decocção de Cavalinha, Calda de Cinza ou Leite diluído a 10%"
  },
  {
    id: "pulgao",
    type: "praga",
    name: "Piolho / Pulgão (Preto, Verde e Cinzento)",
    emoji: "🐜",
    color: "#dc2626",
    affectedCrops: "Fava, Feijão, Couves, Roseira, Citrinos, Pessegueiro, Alface",
    symptoms: "Folhas novas enroladas e pegajosas (melada), presença de formigas a subir pelo caule.",
    prevention: "Despontar o topo das favas em flor, plantar chagas/manjericão/hortelã por perto e atrair joaninhas.",
    remedyRecipeId: "sabao_potassico",
    remedyName: "Sabão Potássico ou Chorume de Urtiga"
  },
  {
    id: "mosca_branca",
    type: "praga",
    name: "Mosca-Branca das Estufas e Hortas",
    emoji: "🦟",
    color: "#ea580c",
    affectedCrops: "Tomateiro, Pimento, Beringela, Couve, Feijão",
    symptoms: "Pequenos insetos brancos que voam em nuvem quando se abana a planta; folhas amareladas e pegajosas.",
    prevention: "Plantar Manjericão e Cravos-túnicos (Tagetes) entre os pés de tomate e colocar armadilhas cromotrópicas amarelas.",
    remedyRecipeId: "alho_malagueta",
    remedyName: "Extrato de Alho e Malagueta + Sabão Potássico"
  },
  {
    id: "lagarta_couve",
    type: "praga",
    name: "Lagarta-da-Couve (Pieris brassicae)",
    emoji: "🐛",
    color: "#65a30d",
    affectedCrops: "Couve-galega, Couve-flor, Brócolos, Repolho, Nabiça",
    symptoms: "Buracos grandes nas folhas deixando apenas as nervuras; ovos amarelos agrupados no verso da folha.",
    prevention: "Consociar couves com Alecrim, Salva e Tomilho para confundir o olfato da borboleta.",
    remedyRecipeId: "alho_malagueta",
    remedyName: "Inspeção manual dos ovos + Bacillus thuringiensis ou Extrato de Alho/Malagueta"
  },
  {
    id: "lesmas_caracois",
    type: "praga",
    name: "Lesmas e Caracóis",
    emoji: "🐌",
    color: "#92400e",
    affectedCrops: "Alface, Morango, Couves jovens, Plântulas recém-nascidas",
    symptoms: "Folhas roídas durante a noite com rasto brilhante prateado na terra.",
    prevention: "Regar de manhã (nunca à noite para a terra secar à superfície), ter patos na quinta.",
    remedyRecipeId: "calda_cinza",
    remedyName: "Anel de Cinza de Madeira, Casca de Ovo triturada ou armadilha de cerveja"
  },
  {
    id: "joaninha",
    type: "auxiliar",
    name: "Joaninha de 7 Pintas (Amiga da Horta)",
    emoji: "🐞",
    color: "#16a34a",
    affectedCrops: "Protege toda a horta e o pomar",
    symptoms: "Uma única larva ou joaninha adulta devora até 100 pulgões por dia!",
    prevention: "Nunca usar inseticidas químicos sintéticos; deixar flores de funcho, coentros, calêndula e camomila para as atrair.",
    remedyRecipeId: null,
    remedyName: "🌟 Aliado Natural — Preservar sempre!"
  },
  {
    id: "abelha",
    type: "auxiliar",
    name: "Abelhas & Polinizadores (Amigos da Horta)",
    emoji: "🐝",
    color: "#16a34a",
    affectedCrops: "Abóbora, Curgete, Melão, Tomate, Morango, Árvores de Fruto",
    symptoms: "Garantem o vingamento das flores em frutos — sem polinização as curgetes e abóboras abortam!",
    prevention: "Plantar Alfazema/Lavanda, Alecrim, Salva e Manjericão; pulverizar apenas ao pôr-do-sol.",
    remedyRecipeId: null,
    remedyName: "🌟 Aliado Natural — Preservar sempre!"
  }
];
