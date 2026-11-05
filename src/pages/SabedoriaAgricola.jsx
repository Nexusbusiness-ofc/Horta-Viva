import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/I18nContext";
import {
  ArrowLeft,
  Sparkles,
  Moon,
  RefreshCw,
  FlaskConical,
  Bug,
  ShoppingBasket,
  Ruler,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Euro
} from "lucide-react";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import Emoji3D from "@/components/ui/Emoji3D";
import { DEFAULT_PLANTS } from "@/lib/plantsData";
import {
  LUNAR_PHASES,
  getLunarPhaseInfo,
  getNextDaysMoon,
  ROTATION_GROUPS,
  getPlantAgronomyProfile,
  calculateBedPlan,
  BIO_RECIPES,
  PESTS_AND_ALLIES
} from "@/lib/agronomicWisdom";

const HARVEST_STORAGE_KEY = "hortaviva_harvest_diary_v1";

const DEFAULT_HARVEST_ENTRIES = [
  { id: "sample_1", item: "Tomate Coração-de-Boi", emoji: "🍅", category: "Horta", amount: 4.5, unit: "kg", pricePerUnit: 2.8, date: "2026-10-28" },
  { id: "sample_2", item: "Ovos Caseiros da Quinta", emoji: "🐔", category: "Animais", amount: 2, unit: "dúzias", pricePerUnit: 3.6, date: "2026-11-01" },
  { id: "sample_3", item: "Couve-galega & Nabiças", emoji: "🥬", category: "Horta", amount: 2.2, unit: "kg", pricePerUnit: 2.2, date: "2026-11-03" }
];

const CLASSIC_TRIOS = [
  {
    title: "As Três Irmãs (Milpa Tradicional)",
    badge: "Sinergia Máxima",
    plants: ["plant_35", "plant_40", "plant_49"],
    names: ["Milho", "Feijão", "Abóbora"],
    desc: "O milho serve de tutor vertical ao feijoeiro; o feijão fixa azoto no solo para alimentar o milho; a abóbora cobre o chão com folhas largas, mantendo a humidade e travando as ervas daninhas."
  },
  {
    title: "Trio Mediterrânico de Verão",
    badge: "Anti-Pragas & Sabor",
    plants: ["plant_41", "plant_44", "plant_45"],
    names: ["Tomate", "Manjericão", "Cenoura"],
    desc: "O manjericão repele a mosca-branca e intensifica o sabor do tomate, enquanto a cenoura solta a terra sem competir com as raízes profundas do tomateiro."
  },
  {
    title: "Escudo das Raízes",
    badge: "Proteção Mútua",
    plants: ["plant_45", "plant_5", "plant_31"],
    names: ["Cenoura", "Alho-porro", "Alface"],
    desc: "O cheiro do alho-porro afasta a mosca-da-cenoura e o aroma da cenoura afasta a traça do alho-porro. A alface aproveita o espaço superficial entre linhas."
  },
  {
    title: "Horta Portuguesa de Inverno",
    badge: "Azoto & Folha",
    plants: ["plant_75", "plant_1", "plant_2"],
    names: ["Couve-galega", "Fava", "Alecrim"],
    desc: "As favas enriquecem o canteiro com azoto para as couves crescerem viçosas, enquanto o alecrim na bordadura disfarça o odor e afasta a borboleta-da-couve."
  }
];

export default function SabedoriaAgricola() {
  const { t: i18nT } = useI18n();
  const [activeTab, setActiveTab] = useState("consociacao");

  // Tab 1: Companion Simulator state
  const [plantAId, setPlantAId] = useState("plant_41"); // Tomate
  const [plantBId, setPlantBId] = useState("plant_44"); // Manjericão

  // Tab 3: Bed Calculator state
  const [calcPlantId, setCalcPlantId] = useState("plant_71"); // Feijão-frade
  const [bedL, setBedL] = useState(3.0);
  const [bedW, setBedW] = useState(1.2);

  // Tab 4: Bio Recipes water volume state
  const [waterLiters, setWaterLiters] = useState(10);

  // Tab 5: Pest filter state
  const [pestFilter, setPestFilter] = useState("todos");

  // Tab 6: Harvest Diary state
  const [harvests, setHarvests] = useState(() => {
    try {
      const raw = localStorage.getItem(HARVEST_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return DEFAULT_HARVEST_ENTRIES;
  });
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("Horta");
  const [newItemAmount, setNewItemAmount] = useState("2");
  const [newItemUnit, setNewItemUnit] = useState("kg");
  const [newItemPrice, setNewItemPrice] = useState("2.5");

  useEffect(() => {
    try {
      localStorage.setItem(HARVEST_STORAGE_KEY, JSON.stringify(harvests));
    } catch {}
  }, [harvests]);

  const todayMoon = useMemo(() => getLunarPhaseInfo(new Date()), []);
  const next28Days = useMemo(() => getNextDaysMoon(28, new Date()), []);

  const plantA = useMemo(() => DEFAULT_PLANTS.find(p => p.id === plantAId) || DEFAULT_PLANTS[0], [plantAId]);
  const plantB = useMemo(() => DEFAULT_PLANTS.find(p => p.id === plantBId) || DEFAULT_PLANTS[1], [plantBId]);

  const compatibilityResult = useMemo(() => {
    if (!plantA || !plantB) return null;
    if (plantA.id === plantB.id) {
      return {
        status: "same",
        title: "Mesma Cultura (Monocultura no Canteiro)",
        color: "bg-sky-50 border-sky-200 text-sky-900",
        badge: "bg-sky-600 text-white",
        reason: "Podes plantar vários pés da mesma cultura respeitando o compasso de plantação, mas intercalar com ervas aromáticas ou alfaces reduz muito as pragas!"
      };
    }
    const profA = getPlantAgronomyProfile(plantA);
    const profB = getPlantAgronomyProfile(plantB);
    const nameA = plantA.name.toLowerCase();
    const nameB = plantB.name.toLowerCase();

    const badMatch =
      profA.bad.find(b => b.id === plantB.id || nameB.includes(b.name.toLowerCase())) ||
      profB.bad.find(b => b.id === plantA.id || nameA.includes(b.name.toLowerCase()));

    if (badMatch) {
      return {
        status: "bad",
        title: "⛔ Incompatíveis — Evitar Plantar Lado a Lado!",
        color: "bg-rose-50 border-rose-300 text-rose-950",
        badge: "bg-rose-600 text-white",
        reason: badMatch.reason
      };
    }

    const goodMatch =
      profA.good.find(g => g.id === plantB.id || nameB.includes(g.name.toLowerCase())) ||
      profB.good.find(g => g.id === plantA.id || nameA.includes(g.name.toLowerCase()));

    if (goodMatch) {
      return {
        status: "good",
        title: "🌟 Excelente Consociação — Plantas Amigas!",
        color: "bg-emerald-50 border-emerald-300 text-emerald-950",
        badge: "bg-emerald-600 text-white",
        reason: goodMatch.reason
      };
    }

    if (profA.rotation !== profB.rotation) {
      return {
        status: "good",
        title: "✅ Boa Compatibilidade Complementar",
        color: "bg-teal-50 border-teal-200 text-teal-950",
        badge: "bg-teal-600 text-white",
        reason: `Pertencem a famílias diferentes (${profA.family} e ${profB.family}), pelo que exploram camadas distintas do solo sem competir diretamente.`
      };
    }

    return {
      status: "neutral",
      title: "⚖️ Compatibilidade Neutra (Mesmo Grupo Nutricional)",
      color: "bg-amber-50 border-amber-200 text-amber-950",
      badge: "bg-amber-500 text-amber-950",
      reason: `Ambas pertencem ao grupo "${profA.rotationGroup.title.split("—")[1]?.trim() || profA.family}". Podem conviver desde que reforces a adubação orgânica e a rega.`
    };
  }, [plantA, plantB]);

  const calcPlant = useMemo(() => DEFAULT_PLANTS.find(p => p.id === calcPlantId) || DEFAULT_PLANTS[0], [calcPlantId]);
  const calcResult = useMemo(() => calculateBedPlan(calcPlant, bedL, bedW), [calcPlant, bedL, bedW]);

  const filteredPests = useMemo(() => {
    if (pestFilter === "todos") return PESTS_AND_ALLIES;
    return PESTS_AND_ALLIES.filter(p => p.type === pestFilter);
  }, [pestFilter]);

  const harvestTotals = useMemo(() => {
    let totalSavings = 0;
    let totalKg = 0;
    for (const h of harvests) {
      const amt = Number(h.amount) || 0;
      const pr = Number(h.pricePerUnit) || 0;
      totalSavings += amt * pr;
      if (h.unit === "kg") totalKg += amt;
    }
    return {
      totalSavings: totalSavings.toFixed(2),
      totalKg: totalKg.toFixed(1),
      count: harvests.length
    };
  }, [harvests]);

  const handleAddHarvest = e => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const entry = {
      id: "hv_" + Date.now(),
      item: newItemName.trim(),
      emoji: newItemCategory === "Animais" ? "🐔" : newItemCategory === "Pomar" ? "🍎" : "🧺",
      category: newItemCategory,
      amount: Math.max(0.1, Number(newItemAmount) || 1),
      unit: newItemUnit,
      pricePerUnit: Math.max(0, Number(newItemPrice) || 2),
      date: new Date().toISOString().slice(0, 10)
    };
    setHarvests(prev => [entry, ...prev]);
    setNewItemName("");
  };

  const TABS = [
    { id: "consociacao", label: "Consociação", emoji: "🤝", icon: Sparkles },
    { id: "lua", label: "Calendário Lunar", emoji: "🌙", icon: Moon },
    { id: "rotacao", label: "Rotação & Canteiro", emoji: "🔄", icon: RefreshCw },
    { id: "caldas", label: "Caldas & Composto", emoji: "🧪", icon: FlaskConical },
    { id: "pragas", label: "Pragas & Amigos", emoji: "🐞", icon: Bug },
    { id: "colheitas", label: "Diário & Poupança", emoji: "🧺", icon: ShoppingBasket }
  ];

  return (
    <div className="min-h-screen w-full overflow-x-hidden pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 hv-app-header shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 relative z-10">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-emerald-500 to-teal-700 flex items-center justify-center shadow-lg border border-white/25 text-xl">
              <span>🧭</span>
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-none tracking-tight">
                {i18nT("Centro de Sabedoria Agrícola")}
              </h1>
              <p className="text-xs text-emerald-100/85 mt-1 truncate">
                {i18nT("Consociação · Fases da Lua · Rotação 4 Anos · Caldas Biológicas · Pragas · Diário de Colheitas")}
              </p>
            </div>
            <NavigationDrawer />
          </div>

          {/* Barra de Abas */}
          <div className="flex gap-1.5 overflow-x-auto pt-3.5 pb-1 scrollbar-hide">
            {TABS.map(t => {
              const active = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                    active
                      ? "bg-white text-emerald-950 shadow-md scale-[1.02]"
                      : "bg-white/12 text-white border border-white/15 hover:bg-white/20"
                  }`}
                >
                  <span>{t.emoji}</span>
                  <span>{i18nT(t.label)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* ================= ABA 1: CONSOCIAÇÃO DE CULTURAS ================= */}
        {activeTab === "consociacao" && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-emerald-900/12 p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    🤝 {i18nT("Simulador Interativo")}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-stone-800 mt-2">
                    {i18nT("Posso plantar estas duas culturas lado a lado?")}
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500">
                    {i18nT("Escolhe duas plantas do catálogo para testar a sinergia entre raízes, nutrientes e proteção contra pragas.")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Seletor Planta A */}
                <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-4 flex items-center gap-3.5">
                  <Emoji3D item={plantA} size="xl" badge />
                  <div className="flex-1 min-w-0">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block">
                      {i18nT("1.ª Cultura no Canteiro")}
                    </label>
                    <select
                      value={plantAId}
                      onChange={e => setPlantAId(e.target.value)}
                      className="w-full mt-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-extrabold text-stone-800 outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      {DEFAULT_PLANTS.map(p => (
                        <option key={p.id} value={p.id}>
                          {i18nT(p.name)} ({i18nT(p.category)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Seletor Planta B */}
                <div className="rounded-2xl bg-stone-50 border border-stone-200/80 p-4 flex items-center gap-3.5">
                  <Emoji3D item={plantB} size="xl" badge />
                  <div className="flex-1 min-w-0">
                    <label className="text-[11px] font-extrabold uppercase tracking-wider text-stone-400 block">
                      {i18nT("2.ª Cultura Vizinha")}
                    </label>
                    <select
                      value={plantBId}
                      onChange={e => setPlantBId(e.target.value)}
                      className="w-full mt-1 bg-white border border-stone-200 rounded-xl px-3 py-2 text-sm font-extrabold text-stone-800 outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      {DEFAULT_PLANTS.map(p => (
                        <option key={p.id} value={p.id}>
                          {i18nT(p.name)} ({i18nT(p.category)})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Resultado da Consociação */}
              {compatibilityResult && (
                <div className={`rounded-3xl border-2 p-5 transition-all ${compatibilityResult.color}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="text-base sm:text-lg font-extrabold">{i18nT(compatibilityResult.title)}</h3>
                    <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${compatibilityResult.badge}`}>
                      {i18nT(plantA.name)} + {i18nT(plantB.name)}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed opacity-90">{i18nT(compatibilityResult.reason)}</p>
                </div>
              )}
            </div>

            {/* Trios Clássicos de Consociação */}
            <div className="space-y-3">
              <h3 className="text-base sm:text-lg font-extrabold text-stone-800">
                🌟 {i18nT("Combinações Clássicas de Sucesso na Horta")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CLASSIC_TRIOS.map((trio, idx) => (
                  <div
                    key={idx}
                    className="rounded-3xl bg-white border border-emerald-900/12 p-5 shadow-xs hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-extrabold text-stone-800 text-base">{i18nT(trio.title)}</h4>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                        {i18nT(trio.badge)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 bg-emerald-50/60 rounded-2xl p-3 border border-emerald-100">
                      {trio.plants.map((pid, i) => (
                        <React.Fragment key={pid}>
                          <div className="flex items-center gap-2">
                            <Emoji3D item={{ id: pid, name: trio.names[i] }} size="md" badge />
                            <span className="text-xs font-extrabold text-stone-800">{i18nT(trio.names[i])}</span>
                          </div>
                          {i < trio.plants.length - 1 && <span className="text-emerald-600 font-black">+</span>}
                        </React.Fragment>
                      ))}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">{i18nT(trio.desc)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 2: CALENDÁRIO LUNAR AGRÍCOLA ================= */}
        {activeTab === "lua" && (
          <div className="space-y-6">
            {/* Cartão da Lua de Hoje */}
            <div className={`rounded-3xl bg-gradient-to-r ${todayMoon.bg} text-white p-6 shadow-xl space-y-4`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-4xl shadow-inner">
                    {todayMoon.emoji}
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100">
                      {i18nT("Fase Lunar de Hoje")} · {todayMoon.illumination}% {i18nT("iluminada")}
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black mt-1">{i18nT(todayMoon.name)}</h2>
                    <p className="text-xs sm:text-sm text-emerald-100/90 font-medium">{i18nT(todayMoon.sapFlow)}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:max-w-xs">
                  {todayMoon.recommendedTasks.map((task, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white/15 backdrop-blur-xs border border-white/15"
                    >
                      {i18nT(task)}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="bg-white/12 rounded-2xl p-3.5 border border-white/15">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-200 mb-1">
                    ✅ {i18nT("O que fazer nesta lua")}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed">{i18nT(todayMoon.bestFor)}</p>
                </div>
                <div className="bg-black/20 rounded-2xl p-3.5 border border-white/10">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-amber-300 mb-1">
                    ⚠️ {i18nT("O que evitar")}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed">{i18nT(todayMoon.avoid)}</p>
                </div>
              </div>
            </div>

            {/* Guia das 4 Fases */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.values(LUNAR_PHASES).map(phase => (
                <div
                  key={phase.key}
                  className="rounded-3xl bg-white border border-stone-200/90 p-4 shadow-xs flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-3xl">{phase.emoji}</span>
                      <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full ${phase.badgeBg}`}>
                        {i18nT(phase.name)}
                      </span>
                    </div>
                    <p className="text-xs font-extrabold text-stone-800 mb-1">{i18nT(phase.sapFlow)}</p>
                    <p className="text-xs text-stone-600 leading-relaxed">{i18nT(phase.bestFor)}</p>
                  </div>
                  <div className="pt-2 border-t border-stone-100 space-y-1">
                    {phase.recommendedTasks.slice(0, 2).map((t, i) => (
                      <p key={i} className="text-[11px] font-bold text-emerald-800">
                        {i18nT(t)}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Previsão Lunar dos Próximos 28 Dias */}
            <div className="rounded-3xl bg-white border border-stone-200/90 p-5 shadow-xs space-y-3">
              <h3 className="text-base font-extrabold text-stone-800">
                📅 {i18nT("Calendário Lunar dos Próximos 28 Dias")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                {next28Days.map((dayInfo, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl p-3 border text-center space-y-1 ${
                      idx === 0
                        ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20"
                        : "bg-stone-50/70 border-stone-200/80"
                    }`}
                  >
                    <p className="text-[10px] font-extrabold uppercase text-stone-500">
                      {idx === 0
                        ? i18nT("Hoje")
                        : dayInfo.date.toLocaleDateString("pt-PT", { day: "2-digit", month: "short" })}
                    </p>
                    <div className="text-2xl py-0.5">{dayInfo.emoji}</div>
                    <p className="text-xs font-extrabold text-stone-800">{i18nT(dayInfo.name)}</p>
                    <p className="text-[10px] font-semibold text-emerald-700 truncate">
                      {i18nT(dayInfo.recommendedTasks[0])}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 3: ROTAÇÃO DE 4 ANOS & CALCULADORA DE CANTEIRO ================= */}
        {activeTab === "rotacao" && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-emerald-900/12 p-5 sm:p-6 shadow-xs space-y-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  🔄 {i18nT("Saúde e Fertilidade do Solo")}
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-stone-800 mt-2">
                  {i18nT("Sistema de Rotação de Culturas em 4 Ciclos")}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 mt-1">
                  {i18nT(
                    "Nunca plantes a mesma família botânica dois anos seguidos no mesmo talhão. Rodar os 4 grupos repõe o azoto naturalmente e corta o ciclo às pragas e doenças do solo!"
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(ROTATION_GROUPS).map(group => (
                  <div key={group.id} className={`rounded-3xl border-2 p-5 space-y-3 ${group.bg}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-xs font-extrabold px-3 py-1 rounded-full ${group.badge}`}>
                        {i18nT(group.title)}
                      </span>
                      <span className="text-2xl">{group.emoji}</span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                      {i18nT(group.nutrientRole)}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {group.examples.map(ex => (
                        <span
                          key={ex}
                          className="text-xs font-bold px-2.5 py-1 rounded-xl bg-white/90 text-stone-800 border border-stone-200/70 shadow-2xs"
                        >
                          {i18nT(ex)}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-stone-200/60 text-xs font-bold text-emerald-900">
                      ➡️ {i18nT("No ano seguinte mudar para:")} <span className="underline">{i18nT(group.nextGroup)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculadora Universal de Canteiro */}
            <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-6 shadow-lg space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">{i18nT("📐 Calculadora de Canteiro, Sementes & Colheita")}</h3>
                  <p className="text-xs text-emerald-100/85">
                    {i18nT("Descobre quantas plantas cabem no teu canteiro, quanto vais colher e de quanta água/composto precisas.")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white/10 border border-white/15 rounded-2xl p-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                    {i18nT("Cultura")}
                  </label>
                  <select
                    value={calcPlantId}
                    onChange={e => setCalcPlantId(e.target.value)}
                    className="w-full mt-1 bg-emerald-950/80 text-white rounded-xl px-2.5 py-2 text-sm font-bold outline-none border border-white/20"
                  >
                    {DEFAULT_PLANTS.map(p => (
                      <option key={p.id} value={p.id}>
                        {i18nT(p.name)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="bg-white/10 border border-white/15 rounded-2xl p-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                    {i18nT("Comprimento do Canteiro (m)")}
                  </label>
                  <input
                    type="number"
                    min="0.5"
                    max="100"
                    step="0.5"
                    value={bedL}
                    onChange={e => setBedL(e.target.value)}
                    className="w-full mt-1 bg-transparent text-white font-black text-lg outline-none"
                  />
                </div>
                <div className="bg-white/10 border border-white/15 rounded-2xl p-3">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-emerald-200 block">
                    {i18nT("Largura do Canteiro (m)")}
                  </label>
                  <input
                    type="number"
                    min="0.4"
                    max="50"
                    step="0.2"
                    value={bedW}
                    onChange={e => setBedW(e.target.value)}
                    className="w-full mt-1 bg-transparent text-white font-black text-lg outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="bg-white/12 rounded-2xl p-3.5 border border-white/15 text-center">
                  <p className="text-2xl font-black text-amber-300">{calcResult.totalPlants}</p>
                  <p className="text-xs font-bold text-emerald-100">
                    {i18nT("Plantas")} ({calcResult.rows} {i18nT("linhas")} × {calcResult.cols})
                  </p>
                </div>
                <div className="bg-white/12 rounded-2xl p-3.5 border border-white/15 text-center">
                  <p className="text-2xl font-black text-emerald-200">~{calcResult.estimatedYieldKg} kg</p>
                  <p className="text-xs font-bold text-emerald-100">{i18nT("Produção Estimada")}</p>
                </div>
                <div className="bg-white/12 rounded-2xl p-3.5 border border-white/15 text-center">
                  <p className="text-2xl font-black text-sky-200">{calcResult.weeklyWaterLiters} L</p>
                  <p className="text-xs font-bold text-emerald-100">{i18nT("Rega Semanal")}</p>
                </div>
                <div className="bg-white/12 rounded-2xl p-3.5 border border-white/15 text-center">
                  <p className="text-2xl font-black text-orange-200">{calcResult.compostKg} kg</p>
                  <p className="text-xs font-bold text-emerald-100">{i18nT("Composto / Estrume")}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ABA 4: RECEITUÁRIO & CALCULADORA DE CALDAS BIOLÓGICAS ================= */}
        {activeTab === "caldas" && (
          <div className="space-y-6">
            <div className="rounded-3xl bg-white border border-emerald-900/12 p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  🧪 {i18nT("Calculadora Automática de Doses")}
                </span>
                <h2 className="text-xl font-extrabold text-stone-800 mt-1.5">
                  {i18nT("Receituário de Caldas Biológicas & Biofertilizantes")}
                </h2>
                <p className="text-xs text-stone-500">
                  {i18nT("Escolhe a capacidade do teu pulverizador/balde para ajustar todas as medidas automaticamente:")}
                </p>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[1, 5, 10, 16, 20, 50].map(L => (
                  <button
                    key={L}
                    onClick={() => setWaterLiters(L)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      waterLiters === L
                        ? "bg-emerald-700 text-white shadow-md"
                        : "bg-stone-100 text-stone-700 hover:bg-emerald-50"
                    }`}
                  >
                    💧 {L} L
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BIO_RECIPES.map(recipe => (
                <div
                  key={recipe.id}
                  className="rounded-3xl bg-white border border-stone-200/90 p-5 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{recipe.emoji}</span>
                        <div>
                          <span
                            className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full"
                            style={{ backgroundColor: recipe.color + "18", color: recipe.color }}
                          >
                            {i18nT(recipe.category)}
                          </span>
                          <h3 className="text-base font-extrabold text-stone-800 mt-0.5">{i18nT(recipe.name)}</h3>
                        </div>
                      </div>
                      <span className="text-xs font-black px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Para {waterLiters} L
                      </span>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed">{i18nT(recipe.purpose)}</p>

                    {/* Ingredientes Escalados */}
                    <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200/80 p-3 space-y-1.5">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-900">
                        ⚖️ {i18nT("Ingredientes para")} {waterLiters} {i18nT("Litros")}:
                      </p>
                      {recipe.ingredientsPerLiter.map((ing, i) => (
                        <div key={i} className="flex items-center justify-between text-xs font-bold text-stone-800">
                          <span>• {i18nT(ing.name)}</span>
                          <span className="text-emerald-800 bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                            {Math.round(ing.amountPerLiter * waterLiters * 10) / 10} {ing.unit}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Passos */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-extrabold uppercase tracking-wider text-stone-500">
                        📋 {i18nT("Como preparar")}:
                      </p>
                      {recipe.steps.map((st, i) => (
                        <p key={i} className="text-xs text-stone-600 leading-relaxed">
                          <b>{i + 1}.</b> {i18nT(st)}
                        </p>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-semibold">
                    <span>💡 {i18nT(recipe.dilutionNote)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ABA 5: GUIA DE PRAGAS, DOENÇAS & INSETOS AUXILIARES ================= */}
        {activeTab === "pragas" && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 bg-white rounded-3xl p-4 border border-stone-200/90 shadow-2xs">
              <div>
                <h2 className="text-lg font-extrabold text-stone-800">
                  🐛 {i18nT("Guia Visual de Pragas, Doenças & Aliados da Horta")}
                </h2>
                <p className="text-xs text-stone-500">
                  {i18nT("Aprende a distinguir os inimigos das plantas dos insetos auxiliares que trabalham por ti.")}
                </p>
              </div>
              <div className="flex gap-1.5">
                {[
                  { id: "todos", label: "Todos" },
                  { id: "praga", label: "🐛 Pragas" },
                  { id: "doenca", label: "🍂 Fungos/Doenças" },
                  { id: "auxiliar", label: "🐞 Amigos da Horta" }
                ].map(f => (
                  <button
                    key={f.id}
                    onClick={() => setPestFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                      pestFilter === f.id
                        ? "bg-emerald-700 text-white shadow-sm"
                        : "bg-stone-100 text-stone-700 hover:bg-emerald-50"
                    }`}
                  >
                    {i18nT(f.label)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredPests.map(item => (
                <div
                  key={item.id}
                  className="rounded-3xl bg-white border border-stone-200/90 p-5 shadow-xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span className="text-3xl">{item.emoji}</span>
                        <div>
                          <h3 className="text-base font-extrabold text-stone-800">{i18nT(item.name)}</h3>
                          <p className="text-[11px] font-semibold text-stone-500">
                            🎯 {i18nT("Culturas:")} {i18nT(item.affectedCrops)}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                          item.type === "auxiliar"
                            ? "bg-emerald-100 text-emerald-800"
                            : item.type === "doenca"
                              ? "bg-amber-100 text-amber-900"
                              : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {item.type === "auxiliar"
                          ? i18nT("Inseto Amigo")
                          : item.type === "doenca"
                            ? i18nT("Doença / Fungo")
                            : i18nT("Praga")}
                      </span>
                    </div>

                    <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200/60 space-y-1">
                      <p className="text-[11px] font-extrabold text-stone-700">🔍 {i18nT("Como reconhecer:")}</p>
                      <p className="text-xs text-stone-600 leading-relaxed">{i18nT(item.symptoms)}</p>
                    </div>

                    <div className="bg-emerald-50/60 rounded-2xl p-3 border border-emerald-200/60 space-y-1">
                      <p className="text-[11px] font-extrabold text-emerald-900">🛡️ {i18nT("Prevenção e Tratamento Biológico:")}</p>
                      <p className="text-xs text-stone-700 leading-relaxed">{i18nT(item.prevention)}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-emerald-800">
                      🧪 {i18nT(item.remedyName)}
                    </span>
                    {item.remedyRecipeId && (
                      <button
                        onClick={() => setActiveTab("caldas")}
                        className="text-xs font-extrabold text-white bg-emerald-700 hover:bg-emerald-800 px-3 py-1.5 rounded-xl transition-all"
                      >
                        {i18nT("Ver Receita ➔")}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= ABA 6: DIÁRIO DE COLHEITAS & POUPANÇA EM € ================= */}
        {activeTab === "colheitas" && (
          <div className="space-y-6">
            {/* Resumo Financeiro e de Produção */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-3xl bg-gradient-to-br from-emerald-700 to-green-900 text-white p-5 shadow-md">
                <p className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                  💶 {i18nT("Poupança Acumulada na Quinta")}
                </p>
                <p className="text-3xl font-black mt-1">{harvestTotals.totalSavings} €</p>
                <p className="text-[11px] text-emerald-100/85 mt-1">
                  {i18nT("Valor estimado face ao preço médio de mercado")}
                </p>
              </div>
              <div className="rounded-3xl bg-white border border-emerald-900/12 p-5 shadow-xs">
                <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                  🧺 {i18nT("Total Colhido (Peso)")}
                </p>
                <p className="text-3xl font-black text-stone-800 mt-1">{harvestTotals.totalKg} kg</p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {i18nT("Alimentos frescos colhidos na tua horta e pomar")}
                </p>
              </div>
              <div className="rounded-3xl bg-white border border-emerald-900/12 p-5 shadow-xs">
                <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500">
                  📋 {i18nT("Registos de Produção")}
                </p>
                <p className="text-3xl font-black text-emerald-700 mt-1">{harvestTotals.count}</p>
                <p className="text-[11px] text-stone-500 mt-1">
                  {i18nT("Colheitas de horta, fruta, ovos, mel e laticínios")}
                </p>
              </div>
            </div>

            {/* Formulário de Novo Registo */}
            <form
              onSubmit={handleAddHarvest}
              className="rounded-3xl bg-white border border-emerald-900/12 p-5 shadow-xs space-y-4"
            >
              <h3 className="text-base font-extrabold text-stone-800 flex items-center gap-2">
                <Plus className="w-4 h-4 text-emerald-600" />
                <span>{i18nT("Registar Nova Colheita ou Produção Animal")}</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                <input
                  type="text"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  placeholder={i18nT("Ex: Tomate, Ovos, Batata, Mel...")}
                  className="sm:col-span-2 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <select
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value)}
                  className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none"
                >
                  <option value="Horta">🥬 Horta</option>
                  <option value="Pomar">🍎 Pomar</option>
                  <option value="Animais">🐔 Animais (Ovos/Leite/Mel)</option>
                </select>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={newItemAmount}
                    onChange={e => setNewItemAmount(e.target.value)}
                    className="w-20 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-2.5 text-sm font-bold outline-none"
                  />
                  <select
                    value={newItemUnit}
                    onChange={e => setNewItemUnit(e.target.value)}
                    className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-2 py-2.5 text-xs font-bold outline-none"
                  >
                    <option value="kg">kg</option>
                    <option value="dúzias">dúzias</option>
                    <option value="litros">L</option>
                    <option value="molhos">molhos</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl px-4 py-2.5 shadow-sm transition-all active:scale-95"
                >
                  ➕ {i18nT("Guardar Colheita")}
                </button>
              </div>
            </form>

            {/* Lista de Colheitas */}
            <div className="space-y-2.5">
              {harvests.map(h => (
                <div
                  key={h.id}
                  className="rounded-2xl bg-white border border-stone-200/80 p-4 flex items-center justify-between gap-3 shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Emoji3D emoji={h.emoji} size="md" badge />
                    <div className="min-w-0">
                      <p className="font-extrabold text-stone-800 text-sm truncate">{i18nT(h.item)}</p>
                      <p className="text-xs text-stone-500">
                        {h.category} · {h.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-black text-stone-800">
                        {h.amount} {h.unit}
                      </p>
                      <p className="text-xs font-extrabold text-emerald-700">
                        +{((Number(h.amount) || 0) * (Number(h.pricePerUnit) || 0)).toFixed(2)} €
                      </p>
                    </div>
                    <button
                      onClick={() => setHarvests(prev => prev.filter(item => item.id !== h.id))}
                      className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 flex items-center justify-center transition-colors"
                      title={i18nT("Remover")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
