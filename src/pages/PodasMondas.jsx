import { useI18n } from "@/lib/I18nContext";
import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, Scissors, Sprout, Search, X, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PodaCard from "@/components/podas/PodaCard";
import PodaDetail from "@/components/podas/PodaDetail";
import MondaCard from "@/components/mondas/MondaCard";
import MondaDetail from "@/components/mondas/MondaDetail";
import UniversalPruningGuideModal from "@/components/podas/UniversalPruningGuideModal";
import PodaMondaAIModal from "@/components/podas/PodaMondaAIModal";
import { cachedList } from "@/lib/offlineCatalog";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import { ViewModeToggle, useViewMode } from "@/components/ui/ViewModeToggle";

export default function PodasMondas() {
  const { t: i18nT } = useI18n();
  const [tab, setTab] = useState("podas");
  const [podas, setPodas] = useState([]);
  const [mondas, setMondas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [inSeasonOnly, setInSeasonOnly] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedPruningType, setSelectedPruningType] = useState("production");
  const [showUniversalGuide, setShowUniversalGuide] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [viewMode, setViewMode] = useViewMode("hortaviva_podas_view_mode", "large");
  const currentMonth = new Date().getMonth() + 1;

  useEffect(() => {
    Promise.all([
      cachedList("podas", () => base44.entities.Podas.list()),
      cachedList("mondas", () => base44.entities.Mondas.list())
    ])
      .then(([p, m]) => {
        setPodas(p);
        setMondas(m);
      })
      .finally(() => setLoading(false));
  }, []);

  const data = tab === "podas" ? podas : mondas;
  const categories = useMemo(() => {
    const set = new Set(data.map(d => d.category).filter(Boolean));
    return ["Todas", ...Array.from(set)];
  }, [data]);

  const inSeasonCount = useMemo(() => {
    return data.filter(d => {
      const allMonths = new Set([
        ...(d.when_months || []),
        ...(d.formation_months || []),
        ...(d.production_months || []),
        ...(d.cleaning_months || [])
      ]);
      return allMonths.has(currentMonth);
    }).length;
  }, [data, currentMonth]);

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (category !== "Todas" && d.category !== category) return false;
      if (inSeasonOnly) {
        const allMonths = new Set([
          ...(d.when_months || []),
          ...(d.formation_months || []),
          ...(d.production_months || []),
          ...(d.cleaning_months || [])
        ]);
        if (!allMonths.has(currentMonth)) return false;
      }
      if (search.trim() && !d.name.toLowerCase().includes(search.toLowerCase().trim())) return false;
      return true;
    });
  }, [data, category, inSeasonOnly, currentMonth, search]);

  const switchTab = t => {
    setTab(t);
    setCategory("Todas");
    setInSeasonOnly(false);
    setSearch("");
    setSelected(null);
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <header className="sticky top-0 z-30 hv-app-header shadow-lg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 relative z-10">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="w-10 h-10 rounded-xl bg-white/15 border border-white/25 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/25 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 via-green-500 to-green-700 flex items-center justify-center shadow-lg border border-white/25">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-none tracking-tight">
                {i18nT("Podas & Mondas")}
              </h1>
              <p className="text-xs text-emerald-100/85 mt-1 truncate">
                {i18nT("Calendário interativo de formação, produção, limpeza e desbaste")}
              </p>
            </div>
            <NavigationDrawer />
          </div>

          <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-3.5">
            <button
              onClick={() => switchTab("podas")}
              className={`flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold py-2.5 rounded-xl transition-all ${
                tab === "podas"
                  ? "bg-white text-emerald-900 shadow-lg"
                  : "bg-white/12 border border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <Scissors className="w-4 h-4" />
              {i18nT(" Podas")} ({podas.length})
            </button>
            <button
              onClick={() => switchTab("mondas")}
              className={`flex-1 flex items-center justify-center gap-2 text-xs sm:text-sm font-extrabold py-2.5 rounded-xl transition-all ${
                tab === "mondas"
                  ? "bg-white text-emerald-900 shadow-lg"
                  : "bg-white/12 border border-white/20 text-white hover:bg-white/20"
              }`}
            >
              <Sprout className="w-4 h-4" />
              {i18nT(" Mondas")} ({mondas.length})
            </button>
            <button
              onClick={() => setShowUniversalGuide(true)}
              className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-extrabold py-2.5 px-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-amber-950 shadow-md transition-all shrink-0"
            >
              <span>📐</span>
              <span className="hidden sm:inline">{i18nT("Guia de Esquemas")}</span>
              <span className="sm:hidden">{i18nT("Esquemas")}</span>
            </button>
            <button
              onClick={() => setShowAIModal(true)}
              className="flex items-center justify-center gap-1.5 text-xs sm:text-sm font-extrabold py-2.5 px-3.5 rounded-xl bg-emerald-400/25 hover:bg-emerald-400/35 border border-emerald-300/40 text-white shadow-md transition-all shrink-0 active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span className="hidden sm:inline">{i18nT("Analisar com IA")}</span>
              <span className="sm:hidden">{i18nT("Analisar IA")}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-emerald-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={tab === "podas" ? i18nT("Pesquisar árvore ou cultura...") : i18nT("Pesquisar cultura...")}
              className="w-full bg-white border border-emerald-900/15 rounded-2xl pl-10 pr-9 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-emerald-400 shadow-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setInSeasonOnly(v => !v)}
            className={`shrink-0 px-4 py-2.5 rounded-2xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all border ${
              inSeasonOnly
                ? "bg-emerald-700 text-white border-emerald-700 shadow-md"
                : "bg-white text-emerald-800 border-emerald-900/15 hover:border-emerald-400 shadow-sm"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${inSeasonOnly ? "bg-amber-300 animate-ping" : "bg-emerald-500"}`} />
            <span>⚡ {i18nT("Em época este mês")} ({inSeasonCount})</span>
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {i18nT(
            categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-2xl transition-all ${
                  category === c
                    ? "bg-gradient-to-br from-emerald-700 to-green-800 text-white shadow-md"
                    : "bg-white border border-emerald-900/12 text-stone-700 hover:border-emerald-300 shadow-sm"
                }`}
              >
                {i18nT(c)}
              </button>
            ))
          )}
        </div>

        {/* Grelha de Destaques: IA + Guia Universal + Explicação */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-5 bg-white border border-emerald-900/12 rounded-3xl p-4 sm:p-5 text-sm text-stone-600 leading-relaxed shadow-sm flex flex-col justify-between">
            {tab === "podas" ? (
              <div>
                <p className="font-extrabold text-emerald-800 text-base mb-1.5 flex items-center gap-2">
                  <span>🌳</span> {i18nT("Menu Interativo de Podas (3 Tipos)")}
                </p>
                <p className="text-xs sm:text-sm text-stone-600">
                  {i18nT("Seleciona em cada cartão o separador de ")}
                  <b className="text-teal-700">{i18nT("🌱 Formação")}</b>
                  {i18nT(" (árvores jovens), ")}
                  <b className="text-emerald-700">{i18nT("🍎 Produção")}</b>
                  {i18nT(" (frutificação) ou ")}
                  <b className="text-amber-700">{i18nT("🧹 Limpeza/Rejuvenescimento")}</b>
                  {i18nT(" para veres a régua de meses exata de cada operação.")}
                </p>
              </div>
            ) : (
              <div>
                <p className="font-extrabold text-lime-800 text-base mb-1.5 flex items-center gap-2">
                  <span>🌱</span> {i18nT("Monda e Desbaste de Sementeiras")}
                </p>
                <p className="text-xs sm:text-sm text-stone-600">
                  {i18nT(
                    "A monda é o desbaste das plântulas nascidas da sementeira direta: removem-se as mais fracas para que as melhores tenham espaço, luz e nutrientes. Inclui também o "
                  )}
                  <b className="text-lime-800">{i18nT("deserbamento")}</b>
                  {i18nT(" (controlo de infestantes).")}
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-4 text-white shadow-md flex flex-col justify-between gap-3 border border-emerald-500/30">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
                  <span className="text-2xl">📸</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-extrabold text-sm leading-tight">{i18nT("Analisador IA por Foto")}</h3>
                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-400 text-amber-950">
                      {i18nT("IA")}
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-100/90 mt-1 leading-relaxed">
                    {i18nT("Fotografa os ramos ou sementeiras e descobre exatamente onde cortar ou desbastar.")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAIModal(true)}
                className="w-full py-2 bg-white text-emerald-900 hover:bg-emerald-50 rounded-xl font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>{i18nT("Fotografar & Analisar")}</span>
                <span>➔</span>
              </button>
            </div>

            <div className="bg-gradient-to-br from-amber-600 via-amber-700 to-orange-800 rounded-3xl p-4 text-white shadow-md flex flex-col justify-between gap-3 border border-amber-400/30">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center shrink-0">
                  <span className="text-2xl">📐</span>
                </div>
                <div>
                  <h3 className="font-extrabold text-sm leading-tight">{i18nT("Guia Universal de Esquemas")}</h3>
                  <p className="text-[11px] text-amber-100/90 mt-1 leading-relaxed">
                    {i18nT("Anatomia do corte em bisel a 45°, regra dos 3 cortes e réguas de desbaste.")}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowUniversalGuide(true)}
                className="w-full py-2 bg-white text-amber-950 hover:bg-amber-50 rounded-xl font-extrabold text-xs transition-all shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>{i18nT("Ver Guia e Esquemas")}</span>
                <span>➔</span>
              </button>
            </div>
          </div>
        </div>

        {/* Header com ViewModeToggle */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-stone-800">
              {tab === "podas" ? i18nT("✂️ Guias de Poda") : i18nT("🌱 Guias de Monda")}
            </h2>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white/70 rounded-3xl border border-stone-200/70">
            <div className="text-5xl mb-3">{tab === "podas" ? i18nT("🌳") : i18nT("🌱")}</div>
            <p className="text-stone-600 font-semibold">{i18nT("Nenhum resultado encontrado.")}</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5"
                : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            }
          >
            {i18nT(
              filtered.map(item =>
                tab === "podas" ? (
                  <PodaCard
                    key={item.id}
                    poda={item}
                    onClick={pruningType => {
                      setSelectedPruningType(typeof pruningType === "string" ? pruningType : "production");
                      setSelected(item);
                    }}
                    compact={viewMode === "grid"}
                  />
                ) : (
                  <MondaCard key={item.id} monda={item} onClick={() => setSelected(item)} compact={viewMode === "grid"} />
                )
              )
            )}
          </div>
        )}
      </main>

      <footer className="text-center pt-4 pb-28 text-xs">
        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-medium">
          {i18nT("🌱 Minha Horta — Cultiva com sabedoria")}
        </span>
      </footer>

      {selected && tab === "podas" && (
        <PodaDetail poda={selected} initialPruningType={selectedPruningType} onClose={() => setSelected(null)} />
      )}
      {selected && tab === "mondas" && <MondaDetail monda={selected} onClose={() => setSelected(null)} />}

      <UniversalPruningGuideModal isOpen={showUniversalGuide} onClose={() => setShowUniversalGuide(false)} />
      <PodaMondaAIModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onOpenUniversalGuide={() => {
          setShowAIModal(false);
          setShowUniversalGuide(true);
        }}
      />
    </div>
  );
}
