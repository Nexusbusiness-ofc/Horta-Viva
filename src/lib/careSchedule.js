// Calendário de curas = tratamentos com produtos fitofarmacêuticos contra pragas e doenças
import { findPlant } from "./plantingCare";

// Estação de cada mês
const SEASONS = {
  12: "inverno", 1: "inverno", 2: "inverno",
  3: "primavera", 4: "primavera", 5: "primavera",
  6: "verao", 7: "verao", 8: "verao",
  9: "outono", 10: "outono", 11: "outono",
};

const SEASON_LABEL = {
  inverno: "Inverno",
  primavera: "Primavera",
  verao: "Verão",
  outono: "Outono",
};

// Produtos fitofarmacêuticos (com nome comercial + dosagem + quando aplicar)
export const TREATMENTS = {
  calda_bordalesa: {
    key: "calda_bordalesa",
    label: "Calda Bordalesa (Cobre)",
    emoji: "🟦",
    color: "#3b82f6",
    type: "Fungicida (cobre)",
    targets: "Míldio, botrytis, alternária, fungos",
    safetyDays: 15,
    organic: true,
    how: "Aplica em dias sem vento, molhando bem as folhas (frente e verso). Não aplicar perto da colheita (respeitar período de segurança).",
    when: "Ao início do crescimento; repetir a cada 10–15 dias em períodos húmidos",
    products: [
      { name: "Funguran HW", active: "Hidróxido de cobre", dose: "3–5 g/L" },
      { name: "Cuprogar", active: "Oxicloreto de cobre", dose: "4–6 g/L" },
      { name: "Cobre Nordox 75", active: "Óxido cuproso", dose: "2–3 g/L" },
    ],
  },
  enxofre: {
    key: "enxofre",
    label: "Enxofre",
    emoji: "🟡",
    color: "#eab308",
    type: "Fungicida / Acaricida",
    targets: "Oídio, ácaros (aranhiço vermelho)",
    safetyDays: 3,
    organic: true,
    how: "Aplica em dias frescos (abaixo de 28°C), ao entardecer, para evitar queimaduras nas folhas.",
    when: "Primavera/verão, em dias frescos; repetir a cada 10 dias",
    products: [
      { name: "Kumulus DF", active: "Enxofre molhável", dose: "5–8 g/L" },
      { name: "Thiovit Jet", active: "Enxofre", dose: "5–8 g/L" },
      { name: "Cosavet", active: "Enxofre", dose: "5–8 g/L" },
    ],
  },
  neem: {
    key: "neem",
    label: "Óleo de Neem",
    emoji: "🌿",
    color: "#16a34a",
    type: "Inseticida biológico",
    targets: "Pulgões, mosca branca, lagartas, tripes",
    safetyDays: 3,
    organic: true,
    how: "Dilui conforme o rótulo e pulveriza as folhas ao entardecer. Repete a cada 7–10 dias enquanto a praga estiver ativa.",
    when: "Quando se deteta a praga (curativo); repetir a cada 7–10 dias",
    products: [
      { name: "Neem Azal", active: "Azadiractina (óleo de neem)", dose: "3–5 mL/L" },
      { name: "Oikem", active: "Azadiractina", dose: "2–4 mL/L" },
    ],
  },
  bt: {
    key: "bt",
    label: "Bacillus thuringiensis",
    emoji: "🐛",
    color: "#f97316",
    type: "Inseticida biológico",
    targets: "Lagartas, traças, noctuídeos",
    safetyDays: 1,
    organic: true,
    how: "Pulveriza nas horas frescas, cobrindo bem as folhas onde há lagartas. Repete a cada 7 dias.",
    when: "Ao detetar lagartas; repetir a cada 7 dias",
    products: [
      { name: "Dipel", active: "B. thuringiensis kurstaki", dose: "0,5–1 g/L" },
      { name: "XenTari", active: "B. thuringiensis aizawai", dose: "0,5–1 g/L" },
      { name: "Turex", active: "B. thuringiensis", dose: "0,5–1 g/L" },
    ],
  },
  sabao: {
    key: "sabao",
    label: "Sabão Potássico",
    emoji: "🧼",
    color: "#06b6d4",
    type: "Inseticida de contacto",
    targets: "Pulgões, cochonilhas, mosca branca",
    safetyDays: 1,
    organic: true,
    how: "Dilui em água e pulveriza diretamente sobre os insetos, cobrindo-os. Repete semanalmente.",
    when: "Ao detetar pulgões/cochonilhas; repetir semanalmente",
    products: [
      { name: "Sabão Potássico", active: "Sais potássicos de ácidos gordos", dose: "10–20 mL/L" },
      { name: "Aphido", active: "Sabão potássico", dose: "10–15 mL/L" },
    ],
  },
  oleo_inverno: {
    key: "oleo_inverno",
    label: "Óleo de Inverno",
    emoji: "❄️",
    color: "#0ea5e9",
    type: "Inseticida asfixiante",
    targets: "Insetos hibernantes, cochonilhas, ovos",
    safetyDays: 30,
    organic: false,
    how: "Aplica durante a paragem vegetativa (inverno) para asfixiar insetos e ovos hibernantes. Uma só aplicação por ano, em dia sem geada.",
    when: "Inverno, durante a paragem vegetativa (uma aplicação/ano)",
    products: [
      { name: "Treix", active: "Óleo de parafina", dose: "1–2%" },
      { name: "Óleo Branco", active: "Óleo mineral", dose: "1–2%" },
    ],
  },
  piretro: {
    key: "piretro",
    label: "Piretro",
    emoji: "🌼",
    color: "#a855f7",
    type: "Inseticida botânico (amplo espetro)",
    targets: "Pulgões, lagartas, mosca branca, tripes",
    safetyDays: 2,
    organic: true,
    how: "Pulveriza ao entardecer (degrada com a luz). Evita horas de atividade das abelhas. Repete semanalmente.",
    when: "Ao detetar praga; repetir semanalmente",
    products: [
      { name: "Spruzit", active: "Piretrinas + óleo de canela", dose: "2–5 mL/L" },
      { name: "Piretro Natural", active: "Piretrinas", dose: "2–5 mL/L" },
    ],
  },
  mancozebe: {
    key: "mancozebe",
    label: "Mancozebe",
    emoji: "🟫",
    color: "#78350f",
    type: "Fungicida de contacto (ditiocarbamato)",
    targets: "Míldio, alternária, botrytis",
    safetyDays: 14,
    organic: false,
    how: "Aplica como preventivo em condições favoráveis (humidade). Repetir a cada 7–10 dias. Alternar com sistémicos para evitar resistências.",
    when: "Primavera/verão em períodos húmidos; preventivo",
    products: [
      { name: "Dithane DG", active: "Mancozebe", dose: "2–3 g/L" },
      { name: "Mancozeb 80", active: "Mancozebe", dose: "2–3 g/L" },
    ],
  },
  deltametrina: {
    key: "deltametrina",
    label: "Deltametrina",
    emoji: "🔴",
    color: "#dc2626",
    type: "Inseticida piretroide",
    targets: "Lagartas, pulgões, trips, mosca branca",
    safetyDays: 7,
    organic: false,
    how: "Aplica ao entardecer. Atenção: tóxico para abelhas e auxiliares — não aplicar em floração. Repetir a cada 7–10 dias.",
    when: "Ao detetar a praga (curativo)",
    products: [
      { name: "Decis", active: "Deltametrina", dose: "0,3–0,5 mL/L" },
      { name: "Decis Protech", active: "Deltametrina", dose: "0,3–0,5 mL/L" },
    ],
  },
  abamectina: {
    key: "abamectina",
    label: "Abamectina",
    emoji: "🟤",
    color: "#7c2d12",
    type: "Acaricida / Inseticida",
    targets: "Ácaros (aranhiço vermelho), mosca mineira",
    safetyDays: 14,
    organic: false,
    how: "Aplica ao entardecer; translaminar (entra na folha). Não usar em floração. Repetir a cada 14 dias se necessário.",
    when: "Ao detetar ácaros ou minas nas folhas",
    products: [
      { name: "Vertimec", active: "Abamectina", dose: "0,5–1 mL/L" },
      { name: "Abamectin 18", active: "Abamectina", dose: "0,5–1 mL/L" },
    ],
  },
  tebuconazol: {
    key: "tebuconazol",
    label: "Tebuconazol",
    emoji: "🟪",
    color: "#7c3aed",
    type: "Fungicida sistémico (triazol)",
    targets: "Oídio, ferrugem, septoria",
    safetyDays: 21,
    organic: false,
    how: "Sistémico — aplicar no início dos sintomas. Curativo e preventivo. Não repetir mais de 2–3 vezes por ciclo (resistências).",
    when: "Ao primeiro sinal de oídio/ferrugem",
    products: [
      { name: "Folicur", active: "Tebuconazol", dose: "1–1,5 mL/L" },
      { name: "Tebuconazole 25", active: "Tebuconazol", dose: "1–1,5 mL/L" },
    ],
  },
};

// Tratamentos preventivos por estação (bio/preventivos)
const SEASONAL_PREVENTIVE = {
  inverno: ["oleo_inverno"],
  primavera: ["calda_bordalesa", "neem"],
  verao: ["enxofre", "bt", "neem", "calda_bordalesa"],
  outono: ["calda_bordalesa"],
};

export function seasonOf(month) {
  return SEASONS[month] || "primavera";
}

export { SEASON_LABEL };

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T00:00");
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

function firstOfMonth(year, month) {
  const m = String(month).padStart(2, "0");
  return `${year}-${m}-01`;
}

// Gera curas (tratamentos) agendadas para uma plantação, respeitando o período de segurança
export function generateCuras(planting, plants) {
  if (!planting.planted_date || planting.status === "Colhida") return [];
  const plant = findPlant(planting, plants);
  const curas = [];
  const planted = new Date(planting.planted_date + "T00:00");
  const end = planting.expected_harvest_date
    ? new Date(planting.expected_harvest_date + "T00:00")
    : new Date(planted.getTime() + 120 * 86400000);

  const startYear = planted.getFullYear();

  for (let y = startYear; ; y++) {
    let exceeded = true;
    for (let m = 1; m <= 12; m++) {
      const first = new Date(`${y}-${String(m).padStart(2, "0")}-01T00:00`);
      if (first < planted) continue;
      if (first > end) continue;
      exceeded = false;

      const season = SEASONS[m];
      const treatments = SEASONAL_PREVENTIVE[season] || [];
      for (const key of treatments) {
        const t = TREATMENTS[key];
        if (planting.expected_harvest_date) {
          const daysToHarvest = Math.round((new Date(planting.expected_harvest_date + "T00:00") - first) / 86400000);
          if (daysToHarvest < t.safetyDays) continue;
        }
        curas.push({
          date: firstOfMonth(y, m),
          treatment: t,
          planting,
          plant,
          season,
          preventive: true,
        });
      }
    }
    if (exceeded) break;
  }

  return curas;
}

export function generateAllCuras(plantings, plants) {
  const all = [];
  for (const p of plantings) {
    all.push(...generateCuras(p, plants));
  }
  all.sort((a, b) => a.date.localeCompare(b.date));
  return all;
}

export function groupCuras(curas) {
  const today = new Date().toISOString().split("T")[0];
  const weekEnd = addDays(today, 7);

  const groups = {
    atrasadas: { label: "Atrasadas", emoji: "🔴", tasks: [] },
    hoje: { label: "Hoje", emoji: "📅", tasks: [] },
    semana: { label: "Esta semana", emoji: "📆", tasks: [] },
    proximas: { label: "Próximas", emoji: "🗓️", tasks: [] },
  };

  for (const t of curas) {
    if (t.date < today) groups.atrasadas.tasks.push(t);
    else if (t.date === today) groups.hoje.tasks.push(t);
    else if (t.date <= weekEnd) groups.semana.tasks.push(t);
    else groups.proximas.tasks.push(t);
  }

  return groups;
}

// Guia de curas para uma planta do catálogo — por estação
export function getPlantCurasGuide(plant) {
  if (!plant) return [];
  const guide = [];
  const seasons = ["inverno", "primavera", "verao", "outono"];
  for (const s of seasons) {
    const keys = SEASONAL_PREVENTIVE[s] || [];
    for (const key of keys) {
      const t = TREATMENTS[key];
      guide.push({ ...t, season: s, seasonLabel: SEASON_LABEL[s] });
    }
  }
  return guide;
}

// Pragas comuns com recomendação biológica e química (cura curativa)
export const COMMON_PESTS = [
  { pest: "Pulgões (afídeos)", symptom: "Folhas encaracoladas, melada pegajosa", bio: "neem", chem: "deltametrina" },
  { pest: "Lagartas / traças", symptom: "Folhas comidas, orifícios, excrementos", bio: "bt", chem: "deltametrina" },
  { pest: "Mosca branca", symptom: "Pequenas moscas brancas ao tocar", bio: "neem", chem: "deltametrina" },
  { pest: "Oídio (podridão branca)", symptom: "Pó branco nas folhas", bio: "enxofre", chem: "tebuconazol" },
  { pest: "Míldio", symptom: "Manchas amarelas/marrón, penugem branca", bio: "calda_bordalesa", chem: "mancozebe" },
  { pest: "Ácaros (aranhiço)", symptom: "Folhas prateadas/amarelas, teias finas", bio: "enxofre", chem: "abamectina" },
  { pest: "Cochonilhas", symptom: "Bolinhas/crostas marrón nos caules", bio: "sabao", chem: "oleo_inverno" },
  { pest: "Ferrugem", symptom: "Pústulas alaranjadas nas folhas", bio: "enxofre", chem: "tebuconazol" },
  { pest: "Mosca mineira", symptom: "Galerias/minas nas folhas", bio: "neem", chem: "abamectina" },
];

// Herbicidas — controlo de ervas daninhas (não seletivos a menos que indicado)
// preparation = passo a passo para preparar em casa (null = produto comercial)
// crops = em que plantações / situações usar (e onde NÃO usar)
export const HERBICIDES = {
  vinagre_sal: {
    key: "vinagre_sal",
    label: "Vinagre + Sal + Sabão",
    emoji: "🫗",
    color: "#eab308",
    type: "Herbicida natural de contacto",
    targets: "Ervas anuais e ervas jovens de folha larga",
    safetyDays: 0,
    organic: true,
    when: "Antes da sementeira/plantação ou em caminhos; dia seco e solarengo",
    how: "Pulveriza diretamente sobre as ervas a eliminar, molhando bem as folhas. Repetir após 3–5 dias se necessário. Usa de manhã sem vento. Atenção: é não seletivo — mata qualquer planta que tocar.",
    preparation: [
      "1. Numa garrafa, junta 1 L de vinagre branco (mínimo 10% de ácido acético)",
      "2. Adiciona 3 colheres de sopa de sal fino (aprox. 45 g) e agita até dissolver bem",
      "3. Acrescenta 1 colher de chá de sabão líquido da louça (funciona como adesivo, faz a mistura grudar nas folhas)",
      "4. Fecha e agita vigorosamente. Usar de imediato — não armazenar mais de 2 dias.",
    ],
    crops: "Caminhos, canteiros vazios antes da sementeira, entre linhas (com proteção). NÃO pulverizar sobre hortícolas, aromáticas ou qualquer cultura — mata tudo o que tocar.",
    products: [
      { name: "Feito em casa", active: "Ácido acético + cloreto de sódio + sabão", dose: "Ver preparação" },
    ],
  },
  agua_fervente: {
    key: "agua_fervente",
    label: "Água Fervente",
    emoji: "💧",
    color: "#f97316",
    type: "Herbicida térmico (contacto)",
    targets: "Ervas jovens, musgo em caminhos e pavimento",
    safetyDays: 0,
    organic: true,
    when: "Sempre que necessário; mais eficaz em ervas jovens e com pouca raiz",
    how: "Verte a água a ferver diretamente sobre as ervas, molhando toda a planta. O choque térmico destrói as células. Repetir se a erva voltar a brotar. Cuidado para não te queimar.",
    preparation: [
      "1. Ferve água numa chaleira ou panela (usa luvas térmicas)",
      "2. Leva ao local a tratar num recipiente resistente ao calor",
      "3. Verte lentamente sobre cada erva, centímetro a centímetro",
      "4. Evita saltos e gotas para não atingir plantas vizinhas — a água escorre.",
    ],
    crops: "Caminhos, fendas do pavimento, muros, canteiros vazios. NÃO usar perto de culturas estabelecidas nem de sementes germinadas.",
    products: [],
  },
  bicarbonato: {
    key: "bicarbonato",
    label: "Bicarbonato de Sódio",
    emoji: "🧂",
    color: "#94a3b8",
    type: "Herbicida natural (contacto) + fungicida",
    targets: "Ervas jovens, musgo; também inibe fungos",
    safetyDays: 1,
    organic: true,
    when: "Antes da sementeira ou em caminhos; dias secos e solarengos",
    how: "Pulveriza a solução sobre as ervas, molhando bem as folhas. Melhor em dia seco com sol. Repetir após uma semana se a erva persistir.",
    preparation: [
      "1. Dissolve 2 colheres de sopa de bicarbonato de sódio (aprox. 30 g) em 1 L de água quente",
      "2. Mexe até dissolver completamente e deixa arrefecer à temperatura ambiente",
      "3. Adiciona 1 colher de chá de sabão líquido (adesivo) e mistura",
      "4. Coloca num pulverizador e agita antes de cada uso.",
    ],
    crops: "Caminhos, zonas pavimentadas, canteiros antes da sementeira. Evitar perto de plântulas e sementes recém-germinadas.",
    products: [],
  },
  pelargonico: {
    key: "pelargonico",
    label: "Ácido Pelargónico",
    emoji: "🌻",
    color: "#f59e0b",
    type: "Herbicida natural de contacto (rápido)",
    targets: "Ervas anuais jovens, musgo, rebentos tenros",
    safetyDays: 1,
    organic: true,
    when: "Dias quentes e solarengos — a luz solar aumenta a eficácia",
    how: "Pulveriza de manhã com sol forte, cobrindo bem as ervas. As ervas secam em poucas horas. Repetir a cada 7 dias em ervas perenes. Efeito visível no mesmo dia.",
    preparation: null,
    crops: "Caminhos, canteiros vazios antes da sementeira, entre linhas (com proteção). Deriva tóxica para culturas — pulverizar só nas ervas.",
    products: [
      { name: "Beloukha", active: "Ácido pelargónico", dose: "1–2%" },
      { name: "Scythe", active: "Ácido pelargónico", dose: "3–5%" },
    ],
  },
  glifosato: {
    key: "glifosato",
    label: "Glifosato",
    emoji: "🟩",
    color: "#16a34a",
    type: "Herbicida sistémico de amplo espetro",
    targets: "Todas as ervas — anuais e perenes (incl. gramíneas e cardos)",
    safetyDays: 7,
    organic: false,
    when: "Antes da sementeira/plantação; quando as ervas têm folhas verdes e estão em crescimento ativo",
    how: "Pulverisa sobre as ervas em crescimento ativo (folhas verdes, não secas). Espera 7 dias antes de lavrar ou plantar. Evita deriva para as culturas. Não aplicar perto de colheitas. Usa equipamento de proteção.",
    preparation: null,
    crops: "Antes da sementeira em hortas, vinhas, pomares; em pousio. NÃO aplicar sobre culturas — é total (não seletivo). Respeitar o intervalo de segurança antes de plantar.",
    products: [
      { name: "Roundup", active: "Glifosato (sal isopropilamina)", dose: "10–20 mL/L" },
      { name: "Touchdown", active: "Glifosato (sal trimesio)", dose: "10–20 mL/L" },
      { name: "Roundup Bio", active: "Glifosato", dose: "1–2%" },
    ],
  },
  glufosinato: {
    key: "glufosinato",
    label: "Glufosinato de Amónio",
    emoji: "🟢",
    color: "#15803d",
    type: "Herbicida de contacto (amplo espetro)",
    targets: "Ervas anuais e perenes jovens",
    safetyDays: 14,
    organic: false,
    when: "Antes da sementeira ou em pousio; em ervas em crescimento ativo",
    how: "Pulverisa cobrindo bem as ervas (não é sistémico — molha toda a planta). Espera 14 dias antes de cultivar. Não aplicar com vento para evitar deriva. Usa equipamento de proteção.",
    preparation: null,
    crops: "Antes da sementeira, em pousio, entre linhas (com proteção das culturas). NÃO aplicar sobre as culturas — contacto direto queima-as.",
    products: [
      { name: "Basta", active: "Glufosinato de amónio", dose: "10–15 mL/L" },
      { name: "Liberty", active: "Glufosinato", dose: "10–15 mL/L" },
    ],
  },
};