import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Filter, Sprout, Sparkles, Calendar, Compass } from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { useSubscription } from "@/lib/subscription";
import UpgradeModal from "@/components/subscription/UpgradeModal";
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext';
import { useI18n, CatalogLanguageNote } from '@/lib/I18nContext';
import { getLocalMonth } from '@/lib/regionalClimate';
import WeatherCard from '@/components/weather/WeatherCard';
import RegionSummary from '@/components/regional/RegionSummary';
import MascotHomeCard from '@/components/mascot/MascotHomeCard';

export default function Home() {
  const { preferences } = useRegionalPreferences();
  const { t, locale } = useI18n();
  const monthName = month =>
    new Intl.DateTimeFormat(locale, { month: 'long', timeZone: 'UTC' }).format(
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
    () => plants.filter(p => (p.sow_months || []).includes(currentMonth)).length,
    [plants, currentMonth]
  );
  const harvestNowCount = useMemo(
    () => plants.filter(p => (p.harvest_months || []).includes(currentMonth)).length,
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
  const currentMonthFormatted = (() => {
    const raw = monthName(currentMonth);
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  })();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#f3f8f4] via-[#f7faf7] to-[#f4f7f3] text-stone-800">
      {/* 1. Topo Verde Floresta Arredondado com Barra de Pesquisa em Pílula */}
      <HomeMockupHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        onGoToAI={handleGoToAI}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Conteúdo Principal em Bento Layout */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-28 space-y-6">
        {!isSearching && (
          <>
            {/* Painel Bento Superior: Hero à esquerda + Clima, Região e Mascote organizados */}
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

            {/* Carrossel Horizontal: Curiosidades Diárias da Horta */}
            <DailyCuriositiesCarousel />
          </>
        )}

        {isSearching && (
          <div className="flex items-center justify-between pt-1 bg-white rounded-2xl px-4 py-3 border border-emerald-200/80 shadow-2xs">
            <h2 className="text-sm font-extrabold text-stone-800">
              🔍 {t('{count} resultados para "{query}"', { count: visiblePlants.length, query: searchQuery })}
            </h2>
            <button
              onClick={handleClearSearch}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50"
            >
              {t('Limpar pesquisa')}
            </button>
          </div>
        )}

        {/* Secção do Catálogo de Plantas & Alimentos */}
        <section className="space-y-4 pt-1">
          {/* Cabeçalho do Catálogo + Filtro Sazonal Rápido */}
          <div className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-200/70 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 text-white flex items-center justify-center shadow-sm shadow-emerald-200">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black text-stone-800 leading-none">
                      {t('Catálogo de Alimentos')}
                    </h2>
                    <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {visiblePlants.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                    {t('Calendários de sementeira, plantação, colheita e cuidados')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Botão de filtro sazonal por mês */}
                <button
                  type="button"
                  onClick={() => setShowMonthFilter((prev) => !prev)}
                  className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-all ${
                    selectedMonth !== 0 || showMonthFilter
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                      : "bg-stone-50 hover:bg-emerald-50 text-stone-700 border-stone-200"
                  }`}
                  title={t('Filtrar por mês do ano')}
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>{selectedMonth === 0 ? t('Filtrar Mês') : monthName(selectedMonth)}</span>
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
                  <span>{t('Todas as épocas')}</span>
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setSeasonActionFilter(prev => (prev === "sow_now" ? "all" : "sow_now"))
                  }
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                    seasonActionFilter === "sow_now"
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-200"
                      : "bg-emerald-50/80 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80"
                  }`}
                >
                  <span>🌱</span>
                  <span>
                    {t('Semear em')} {currentMonthFormatted}
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
                    setSeasonActionFilter(prev => (prev === "harvest_now" ? "all" : "harvest_now"))
                  }
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                    seasonActionFilter === "harvest_now"
                      ? "bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-200"
                      : "bg-amber-50/80 text-amber-900 border-amber-200 hover:bg-amber-100/80"
                  }`}
                >
                  <span>🧺</span>
                  <span>
                    {t('Colher em')} {currentMonthFormatted}
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
                    📅 {t('Época de plantio / colheita:')}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedMonth(currentMonth)}
                      className="text-[11px] font-extrabold text-emerald-700 hover:underline"
                    >
                      {t('Mês atual')} ({monthName(currentMonth)})
                    </button>
                    {selectedMonth !== 0 && (
                      <button
                        onClick={() => setSelectedMonth(0)}
                        className="text-[11px] text-stone-600 font-bold hover:underline"
                      >
                        {t('Ver todos')}
                      </button>
                    )}
                  </div>
                </div>
                <MonthSelector selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
              </div>
            )}
          </div>

          <CatalogLanguageNote />

          {/* Lista / Grelha de Plantas */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : visiblePlants.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/70 p-6 shadow-2xs">
              <div className="text-4xl mb-2">🌿</div>
              <p className="text-sm font-bold text-stone-700">
                {t('Nenhum alimento encontrado nesta categoria.')}
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
                {t('Limpar filtros e ver todas as plantas')}
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
        </section>

        {/* Assistente IA Integrado */}
        <section
          id="assistente-ia"
          className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 rounded-3xl p-4 sm:p-6 border border-emerald-200/80 shadow-sm scroll-mt-20"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-4.5 h-4.5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-black text-stone-800 leading-none">
                {t('Assistente Agrónomo IA')}
              </h2>
              <p className="text-[11px] text-stone-500 font-medium mt-0.5">
                {t('Tira dúvidas sobre cultivo, pragas, rega e calendário regional')}
              </p>
            </div>
          </div>
          <AIAssistant query={aiQuery} plants={plants} onClearQuery={() => setAiQuery(null)} />
        </section>
      </main>

      {/* Rodapé suave */}
      <footer className="text-center pt-2 pb-24 text-xs text-stone-400 font-medium">
        <span>🌱 Horta Viva — {t('Cultiva com sabedoria')}</span>
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
