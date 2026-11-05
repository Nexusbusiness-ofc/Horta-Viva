import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Filter, Sprout, Sparkles, Calendar, Compass, ArrowRight } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import HomeMockupHeader from "@/components/home/HomeMockupHeader";
import MockupHeroCard from "@/components/home/MockupHeroCard";
import DailyCuriositiesCarousel from "@/components/home/DailyCuriositiesCarousel";
import CategoryFilterPills from "@/components/home/CategoryFilterPills";
import PlantCard from "@/components/plant/PlantCard";
import PlantDetail from "@/components/plant/PlantDetail";
import MonthSelector from "@/components/plant/MonthSelector";
import AIAssistant from "@/components/plant/AIAssistant";
import HomeExploreGrid from "@/components/home/HomeExploreGrid";
import OnboardingProfile from "@/components/profile/OnboardingProfile";
import { cachedList } from "@/lib/offlineCatalog";
import { ViewModeToggle, useViewMode } from "@/components/ui/ViewModeToggle";
import { getLunarPhaseInfo } from "@/lib/agronomicWisdom";
import { useSubscription } from "@/lib/subscription";
import UpgradeModal from "@/components/subscription/UpgradeModal";
import { useRegionalPreferences } from "@/lib/RegionalPreferencesContext";
import { useI18n, CatalogLanguageNote } from "@/lib/I18nContext";
import { getLocalMonth } from "@/lib/regionalClimate";
import WeatherCard from "@/components/weather/WeatherCard";
import RegionSummary from "@/components/regional/RegionSummary";
import MascotHomeCard from "@/components/mascot/MascotHomeCard";
import Emoji3D from "@/components/ui/Emoji3D";

export default function Home() {
  const { preferences } = useRegionalPreferences();
  const { t, locale } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();

  const monthName = (month) =>
    new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(
      new Date(Date.UTC(2026, month - 1, 15))
    );
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [seasonActionFilter, setSeasonActionFilter] = useState("all"); // 'all' | 'sow_now' | 'harvest_now'
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [aiQuery, setAiQuery] = useState(null);
  const [showProModal, setShowProModal] = useState(false);
  const [pendingTasksCount, setPendingTasksCount] = useState(1);
  const [viewMode, setViewMode] = useViewMode("hortaviva_plant_view_mode", "large");
  const { isUltra, isPro, isPlus, isPaid } = useSubscription();

  // Separador rápido no topo: 'catalogo' (visível logo no 1.º ecrã) | 'painel' (dashboard completo)
  const [activeHomeTab, setActiveHomeTab] = useState(
    searchParams.get("tab") === "painel" ? "painel" : "catalogo"
  );

  useEffect(() => {
    cachedList("plants", () => base44.entities.Plant.list())
      .then(setPlants)
      .finally(() => setLoading(false));

    base44.entities.Planting.list("-planted_date")
      .then((plantings) => {
        if (plantings && plantings.length > 0) {
          setPendingTasksCount(Math.min(plantings.length, 9));
        }
      })
      .catch(() => {});
  }, []);

  const currentMonth = getLocalMonth(new Date(), preferences);

  // Contadores rápidos para o mês atual
  const sowNowCount = useMemo(
    () => plants.filter((p) => (p.sow_months || []).includes(currentMonth)).length,
    [plants, currentMonth]
  );
  const harvestNowCount = useMemo(
    () => plants.filter((p) => (p.harvest_months || []).includes(currentMonth)).length,
    [plants, currentMonth]
  );

  // Filtragem de plantas por pesquisa, categoria, ação sazonal e mês
  const visiblePlants = useMemo(() => {
    let list = plants;

    // Filtro de pesquisa por texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          t(p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.sow_instructions || "").toLowerCase().includes(q) ||
          (p.care_instructions || "").toLowerCase().includes(q)
      );
    }

    // Filtro por categoria
    if (activeCategory !== "all") {
      list = list.filter((p) => {
        const catName = (p.category || "").toLowerCase();
        const pName = (p.name || "").toLowerCase();
        if (activeCategory === "hortalicas") {
          return (
            catName.includes("hortaliça") ||
            catName.includes("hortalica") ||
            catName.includes("folha") ||
            pName.includes("alface") ||
            pName.includes("couve") ||
            pName.includes("espinafre") ||
            pName.includes("agrião") ||
            pName.includes("agriao")
          );
        }
        if (activeCategory === "frutos") {
          return (
            catName.includes("fruto") ||
            pName.includes("tomate") ||
            pName.includes("pimento") ||
            pName.includes("pepino") ||
            pName.includes("morango")
          );
        }
        if (activeCategory === "legumes") {
          return (
            catName.includes("legume") ||
            pName.includes("feijão") ||
            pName.includes("feijao") ||
            pName.includes("fava") ||
            pName.includes("ervilha") ||
            pName.includes("grão") ||
            pName.includes("tremoço") ||
            pName.includes("tremoco") ||
            pName.includes("amendoim") ||
            pName.includes("lentilha")
          );
        }
        if (activeCategory === "raizes") {
          return (
            catName.includes("raiz") ||
            catName.includes("tubérculo") ||
            catName.includes("tuberculo") ||
            pName.includes("cenoura") ||
            pName.includes("rabanete") ||
            pName.includes("alho") ||
            pName.includes("batata")
          );
        }
        if (activeCategory === "aromaticas") {
          return (
            catName.includes("aromática") ||
            catName.includes("aromatica") ||
            catName.includes("erva") ||
            pName.includes("salsa") ||
            pName.includes("coentros") ||
            pName.includes("alecrim") ||
            pName.includes("manjericão") ||
            pName.includes("salva")
          );
        }
        return true;
      });
    }

    // Filtro rápido "Semear Agora" / "Colher Agora"
    if (seasonActionFilter === "sow_now") {
      list = list.filter((p) => (p.sow_months || []).includes(currentMonth));
    } else if (seasonActionFilter === "harvest_now") {
      list = list.filter((p) => (p.harvest_months || []).includes(currentMonth));
    }

    // Filtro opcional por mês específico
    if (selectedMonth !== 0) {
      list = list.filter(
        (p) =>
          (p.sow_months || []).includes(selectedMonth) ||
          (p.plant_months || []).includes(selectedMonth) ||
          (p.harvest_months || []).includes(selectedMonth)
      );
    }

    return list;
  }, [plants, searchQuery, activeCategory, seasonActionFilter, selectedMonth, currentMonth, t]);

  const handleCategorySelect = (cat) => {
    if (cat.isSpecialLink) {
      navigate(cat.isSpecialLink);
      return;
    }
    setActiveCategory(cat.id);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (query.trim() && activeHomeTab !== "catalogo") {
      setActiveHomeTab("catalogo");
    }
  };

  const handleGoToAI = (text) => {
    if (text && text.trim()) {
      setAiQuery(text.trim());
      setSearchQuery("");
    }
    const el = document.getElementById("assistente-ia");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        const input = el.querySelector("input");
        if (input) input.focus();
      }, 500);
    }
  };

  const isSearching = searchQuery.trim().length > 0;
  const todayMoon = useMemo(() => getLunarPhaseInfo(new Date()), []);
  const currentMonthFormatted = (() => {
    const raw = monthName(currentMonth);
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  })();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#f3f8f4] via-[#f7faf7] to-[#f4f7f3] text-stone-800">
      {/* 1. Topo Verde Floresta Arredondado com Barra de Pesquisa em Pílula */}
      <HomeMockupHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
        onGoToAI={handleGoToAI}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Conteúdo Principal */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-5">
        {/* Alternador Rápido no Topo: Catálogo de Alimentos vs. Painel Geral da Quinta */}
        <div className="flex items-center justify-between gap-2 bg-white/95 backdrop-blur-md p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl border border-emerald-900/10 shadow-sm max-w-lg mx-auto">
          <button
            type="button"
            onClick={() => setActiveHomeTab("catalogo")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeHomeTab === "catalogo"
                ? "bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 text-white shadow-md shadow-emerald-900/20"
                : "text-stone-600 hover:text-emerald-800 hover:bg-emerald-50/50"
            }`}
          >
            <Emoji3D emoji="🌱" size="sm" />
            <span className="truncate">{t("Catálogo de Culturas")}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeHomeTab === "catalogo"
                  ? "bg-white/20 text-white"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {visiblePlants.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveHomeTab("painel")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm font-black transition-all ${
              activeHomeTab === "painel"
                ? "bg-gradient-to-r from-emerald-700 via-green-700 to-teal-800 text-white shadow-md shadow-emerald-900/20"
                : "text-stone-600 hover:text-emerald-800 hover:bg-emerald-50/50"
            }`}
          >
            <Emoji3D emoji="🏡" size="sm" />
            <span className="truncate">{t("Painel & Resumo")}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                activeHomeTab === "painel"
                  ? "bg-white/20 text-white"
                  : "bg-amber-100 text-amber-900"
              }`}
            >
              ✨ {t("Quinta")}
            </span>
          </button>
        </div>

        {/* =========================================================================
            MODO 1: CATÁLOGO DE CULTURAS (Imediato no 1.º Ecrã!)
            ========================================================================= */}
        {activeHomeTab === "catalogo" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Barra Compacta de Estado (Clima + Lua + Região) numa linha única */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-hide text-xs">
              <div className="flex items-center gap-2 shrink-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200/80 text-stone-700 font-bold shadow-2xs">
                  <span>📍</span>
                  <span className="truncate">{preferences.region || "Portugal"}</span>
                </span>
                <Link
                  to="/sabedoria-agricola"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-emerald-200/80 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 font-bold shadow-2xs transition-all"
                  title={t("Fase Lunar de Hoje")}
                >
                  <span>{todayMoon.emoji}</span>
                  <span className="truncate">
                    {t(todayMoon.name)} · {todayMoon.illumination}%
                  </span>
                </Link>
              </div>
              <button
                type="button"
                onClick={() => setActiveHomeTab("painel")}
                className="shrink-0 text-[11px] font-extrabold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1"
              >
                <span>{t("Ver Clima & Painel da Quinta")}</span>
                <span>➔</span>
              </button>
            </div>

            {/* Cabeçalho do Catálogo + Filtros */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-200/70 shadow-xs space-y-3.5">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-sm shadow-emerald-200">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base sm:text-lg font-black text-stone-800 leading-none">
                        {t("Catálogo de Alimentos")}
                      </h2>
                      <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        {visiblePlants.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                      {t("Calendários de sementeira, plantação, colheita e cuidados")}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMonthFilter((prev) => !prev)}
                    className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                      selectedMonth !== 0 || showMonthFilter
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                        : "bg-stone-50 hover:bg-emerald-50 text-stone-700 border-stone-200"
                    }`}
                    title={t("Filtrar por mês do ano")}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>{selectedMonth === 0 ? t("Filtrar Mês") : monthName(selectedMonth)}</span>
                  </button>

                  <ViewModeToggle mode={viewMode} onChange={setViewMode} />
                </div>
              </div>

              {/* Pílulas de Ação Rápida do Mês Atual (Semear Agora / Colher Agora) */}
              {!isSearching && (
                <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
                  <button
                    type="button"
                    onClick={() => setSeasonActionFilter("all")}
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                      seasonActionFilter === "all"
                        ? "bg-stone-900 text-white border-stone-900 shadow-2xs"
                        : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    <span>📋</span>
                    <span>{t("Todas as épocas")}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSeasonActionFilter((prev) => (prev === "sow_now" ? "all" : "sow_now"))
                    }
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                      seasonActionFilter === "sow_now"
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200"
                        : "bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80"
                    }`}
                  >
                    <span>🌱</span>
                    <span>
                      {t("Semear em")} {currentMonthFormatted}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        seasonActionFilter === "sow_now"
                          ? "bg-white/25 text-white"
                          : "bg-emerald-200/80 text-emerald-900"
                      }`}
                    >
                      {sowNowCount}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSeasonActionFilter((prev) =>
                        prev === "harvest_now" ? "all" : "harvest_now"
                      )
                    }
                    className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                      seasonActionFilter === "harvest_now"
                        ? "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200"
                        : "bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100/80"
                    }`}
                  >
                    <span>🧺</span>
                    <span>
                      {t("Colher em")} {currentMonthFormatted}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                        seasonActionFilter === "harvest_now"
                          ? "bg-white/25 text-white"
                          : "bg-amber-200/80 text-amber-900"
                      }`}
                    >
                      {harvestNowCount}
                    </span>
                  </button>
                </div>
              )}

              {/* Pílulas de Categorias */}
              {!isSearching && (
                <CategoryFilterPills
                  activeCategory={activeCategory}
                  onSelectCategory={handleCategorySelect}
                />
              )}

              {/* Seletor de Mês Expansível */}
              {showMonthFilter && (
                <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 animate-in fade-in duration-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-stone-700">
                      📅 {t("Época de plantio / colheita:")}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setSelectedMonth(currentMonth)}
                        className="text-[11px] font-extrabold text-emerald-700 hover:underline"
                      >
                        {t("Mês atual")} ({monthName(currentMonth)})
                      </button>
                      {selectedMonth !== 0 && (
                        <button
                          onClick={() => setSelectedMonth(0)}
                          className="text-[11px] text-stone-600 font-bold hover:underline"
                        >
                          {t("Ver todos")}
                        </button>
                      )}
                    </div>
                  </div>
                  <MonthSelector selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
                </div>
              )}
            </div>

            <CatalogLanguageNote />

            {/* Grelha de Plantas */}
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              </div>
            ) : visiblePlants.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/70 p-6 shadow-2xs">
                <div className="text-4xl mb-2">🌿</div>
                <p className="text-sm font-bold text-stone-700">
                  {t("Nenhum alimento encontrado nesta categoria.")}
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("all");
                    setSeasonActionFilter("all");
                    setSelectedMonth(0);
                    setSearchQuery("");
                  }}
                  className="mt-3 text-xs text-emerald-700 font-extrabold underline"
                >
                  {t("Limpar filtros e ver todas as plantas")}
                </button>
              </div>
            ) : (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3.5"
                    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
                }
              >
                {visiblePlants.map((p) => (
                  <PlantCard
                    key={p.id}
                    plant={p}
                    onClick={() => setSelectedPlant(p)}
                    compact={viewMode === "grid"}
                  />
                ))}
              </div>
            )}

            {/* Banner de atalho para o Painel da Quinta */}
            <div className="mt-8 bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 rounded-3xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">
                  🏡
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black leading-tight">
                    {t("Queres consultar o tempo e o estado da quinta?")}
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    {t("Acede à meteorologia detalhada, fase da lua, mascote e curiosidades")}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveHomeTab("painel")}
                className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black shadow-md shrink-0 transition-transform active:scale-95 flex items-center justify-center gap-1.5"
              >
                <span>{t("Abrir Painel da Quinta")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            MODO 2: PAINEL DA QUINTA & FERRAMENTAS (Dashboard Completo)
            ========================================================================= */}
        {activeHomeTab === "painel" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Banner Chamativo para o Catálogo */}
            <div className="bg-gradient-to-r from-emerald-800 via-green-800 to-teal-900 rounded-3xl p-5 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center text-3xl shrink-0">
                  🌱
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/20 text-emerald-100">
                    {plants.length || 94} {t("Culturas Disponíveis")}
                  </span>
                  <h3 className="text-base sm:text-lg font-black mt-1 leading-tight">
                    {t("Catálogo de Plantas & Alimentos")}
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-0.5">
                    {t("Sementeira, colheita, consociações e cuidados mês a mês")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveHomeTab("catalogo")}
                  className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black shadow-md transition-transform active:scale-95"
                >
                  {t("Ver no Início ➔")}
                </button>
                <Link
                  to="/catalogo"
                  className="px-4 py-2.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-700 border border-white/20 text-white text-xs font-black shadow-md transition-transform active:scale-95"
                >
                  {t("Página Exclusiva ➔")}
                </Link>
              </div>
            </div>

            {/* Painel Bento Superior: Hero + Clima, Região e Mascote */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <div className="lg:col-span-7 flex flex-col justify-between gap-3">
                <RegionSummary />
                <MockupHeroCard />
              </div>
              <div className="lg:col-span-5 flex flex-col justify-between gap-3">
                <MascotHomeCard />
                <WeatherCard compact />
              </div>
            </div>

            {/* Grelha em Destaque: 4 Áreas da App com Imagens Representativas */}
            <HomeExploreGrid />

            {/* Painel Interativo: Fase Lunar de Hoje + Centro de Sabedoria Agrícola */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
              <Link
                to="/sabedoria-agricola"
                className={`lg:col-span-5 rounded-3xl bg-gradient-to-br ${todayMoon.bg} text-white p-5 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between gap-3 border border-white/15`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-13 h-13 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-3xl shrink-0">
                      {todayMoon.emoji}
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100">
                        {t("Calendário Lunar de Hoje")} · {todayMoon.illumination}%
                      </span>
                      <h3 className="text-lg sm:text-xl font-black mt-0.5 leading-tight">
                        {t(todayMoon.name)}
                      </h3>
                      <p className="text-[11px] text-emerald-100/90">{t(todayMoon.sapFlow)}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/90 leading-relaxed line-clamp-2">
                  {t(todayMoon.bestFor)}
                </p>
                <div className="flex items-center justify-between pt-2 border-t border-white/15 text-xs font-extrabold text-amber-300">
                  <span>{t(todayMoon.recommendedTasks[0])}</span>
                  <span>{t("Ver 28 dias ➔")}</span>
                </div>
              </Link>

              <div className="lg:col-span-7 rounded-3xl bg-white border border-emerald-900/12 p-5 shadow-sm flex flex-col justify-between gap-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      ✨ {t("Novo · Ferramentas Avançadas")}
                    </span>
                    <h3 className="text-base sm:text-lg font-extrabold text-stone-800 mt-1">
                      🧭 {t("Centro de Sabedoria Agrícola")}
                    </h3>
                  </div>
                  <Link
                    to="/sabedoria-agricola"
                    className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold shadow-xs transition-all shrink-0"
                  >
                    {t("Abrir Tudo ➔")}
                  </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { emoji: "🤝", title: "Consociação", desc: "Plantas Amigas vs. Evitar" },
                    { emoji: "🌙", title: "Lua Agrícola", desc: "Fases de sementeira e poda" },
                    { emoji: "🔄", title: "Rotação 4 Anos", desc: "Saúde e azoto do solo" },
                    { emoji: "📐", title: "Calc. Canteiro", desc: "Quantas plantas cabem" },
                    { emoji: "🧪", title: "Caldas Bio", desc: "Urtiga, Bordalesa, Alho" },
                    { emoji: "🧺", title: "Diário & €", desc: "Colheitas e poupança" }
                  ].map((feat, i) => (
                    <Link
                      key={i}
                      to="/sabedoria-agricola"
                      className="rounded-2xl bg-stone-50 hover:bg-emerald-50/70 border border-stone-200/80 hover:border-emerald-300 p-2.5 transition-all flex items-start gap-2"
                    >
                      <span className="text-lg leading-none mt-0.5">{feat.emoji}</span>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-stone-800 truncate">{t(feat.title)}</p>
                        <p className="text-[10px] text-stone-500 truncate">{t(feat.desc)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Carrossel Horizontal: Curiosidades Diárias da Horta */}
            <DailyCuriositiesCarousel />
          </div>
        )}

        {/* Assistente IA Integrado */}
        <section
          id="assistente-ia"
          className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 rounded-3xl p-4 sm:p-6 border border-emerald-200/80 shadow-sm scroll-mt-20 mt-6"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4.5 h-4.5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-stone-800 leading-none">
                {t("Assistente Agrónomo IA")}
              </h2>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                {t("Tira dúvidas sobre cultivo, pragas, rega e calendário regional")}
              </p>
            </div>
          </div>
          <AIAssistant query={aiQuery} plants={plants} onClearQuery={() => setAiQuery(null)} />
        </section>
      </main>

      {/* Rodapé suave */}
      <footer className="text-center pt-2 pb-24 text-xs text-stone-400 font-medium">
        <span>🌱 Horta Viva — {t("Cultiva com sabedoria")}</span>
      </footer>

      {/* Modal de Detalhes da Planta ao Clicar */}
      {selectedPlant && (
        <PlantDetail plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      )}

      {/* Modal Pro */}
      <UpgradeModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
        reason="home"
      />

      <OnboardingProfile />
    </div>
  );
}
