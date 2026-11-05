import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Filter, Sprout, Sparkles, Search, X, ArrowLeft, Scan } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import CategoryFilterPills from "@/components/home/CategoryFilterPills";
import PlantCard from "@/components/plant/PlantCard";
import PlantDetail from "@/components/plant/PlantDetail";
import MonthSelector from "@/components/plant/MonthSelector";
import AIAssistant from "@/components/plant/AIAssistant";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import { cachedList } from "@/lib/offlineCatalog";
import { ViewModeToggle, useViewMode } from "@/components/ui/ViewModeToggle";
import { useRegionalPreferences } from "@/lib/RegionalPreferencesContext";
import { useI18n, CatalogLanguageNote } from "@/lib/I18nContext";
import { getLocalMonth } from "@/lib/regionalClimate";
import Emoji3D from "@/components/ui/Emoji3D";

export default function Catalogo() {
  const { preferences } = useRegionalPreferences();
  const { t, locale } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const monthName = (m) =>
    new Intl.DateTimeFormat(locale, { month: "long", timeZone: "UTC" }).format(
      new Date(Date.UTC(2026, m - 1, 15))
    );

  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("cat") || "all");
  const [seasonActionFilter, setSeasonActionFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [aiQuery, setAiQuery] = useState(null);
  const [viewMode, setViewMode] = useViewMode("hortaviva_plant_view_mode", "large");

  useEffect(() => {
    cachedList("plants", () => base44.entities.Plant.list())
      .then(setPlants)
      .finally(() => setLoading(false));
  }, []);

  const currentMonth = getLocalMonth(new Date(), preferences);

  const currentMonthFormatted = useMemo(() => {
    const raw = monthName(currentMonth);
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }, [currentMonth, locale]);

  // Contadores rápidos para o mês atual
  const sowNowCount = useMemo(
    () => plants.filter((p) => (p.sow_months || []).includes(currentMonth)).length,
    [plants, currentMonth]
  );
  const harvestNowCount = useMemo(
    () => plants.filter((p) => (p.harvest_months || []).includes(currentMonth)).length,
    [plants, currentMonth]
  );

  // Filtragem de plantas
  const visiblePlants = useMemo(() => {
    let list = plants;

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

    if (seasonActionFilter === "sow_now") {
      list = list.filter((p) => (p.sow_months || []).includes(currentMonth));
    } else if (seasonActionFilter === "harvest_now") {
      list = list.filter((p) => (p.harvest_months || []).includes(currentMonth));
    }

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

  const handleGoToAI = (text) => {
    if (text && text.trim()) {
      setAiQuery(text.trim());
    }
    const el = document.getElementById("assistente-ia-catalogo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(() => {
        const input = el.querySelector("input");
        if (input) input.focus();
      }, 400);
    }
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-[#f3f8f4] via-[#f7faf7] to-[#f4f7f3] text-stone-800">
      {/* Cabeçalho Verde Floresta Dedicado do Catálogo */}
      <header className="hv-app-header relative overflow-hidden w-full text-white pt-4 pb-6 px-4 sm:px-6 lg:px-8 rounded-b-[32px] sm:rounded-b-[40px] shadow-2xl shadow-emerald-950/20 border-b border-emerald-400/15">
        <div className="pointer-events-none absolute -top-16 -left-12 w-64 h-64 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -right-12 w-64 h-64 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative z-10 max-w-6xl mx-auto space-y-3.5">
          {/* Barra Superior */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <Link
                to="/"
                className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/20 shadow-sm shrink-0"
                title={t("Voltar ao Início")}
                aria-label={t("Voltar ao Início")}
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shadow-inner shrink-0">
                  <Emoji3D emoji="🌱" size="md" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-none flex items-center gap-2">
                    <span>{t("Catálogo de Culturas")}</span>
                    <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white/20 text-emerald-100 border border-white/20">
                      {plants.length || 94}
                    </span>
                  </h1>
                  <p className="text-[11px] sm:text-xs text-emerald-200/95 font-semibold mt-0.5">
                    {t("Guia de sementeira, colheita, consociação e cuidados")}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                to="/identificar"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white text-xs font-bold border border-white/20 backdrop-blur-md shadow-sm transition-all"
                title={t("Identificador IA por foto")}
              >
                <Scan className="w-4 h-4 text-emerald-300" />
                <span className="hidden sm:inline">{t("Foto IA")}</span>
              </Link>
              <NavigationDrawer />
            </div>
          </div>

          {/* Barra de Pesquisa */}
          <div className="w-full max-w-3xl mx-auto bg-white/98 rounded-2xl sm:rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-xl shadow-emerald-950/25 flex items-center gap-2 sm:gap-2.5 border border-white/80 transition-all">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Search className="w-4 h-4 text-emerald-700" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("Buscar por nome, categoria ou cuidados (ex: tomate, alface)...")}
              className="flex-1 min-w-0 bg-transparent outline-none text-stone-800 placeholder:text-stone-400 text-xs sm:text-sm font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-full hover:bg-stone-100"
                aria-label={t("Limpar pesquisa")}
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => handleGoToAI(searchQuery)}
              className="shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[11px] sm:text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm active:scale-95 transition-all"
              title={t("Perguntar à IA")}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
              <span>{t("IA")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal do Catálogo */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-28 space-y-4">
        {/* Painel de Filtros e Categorias */}
        <section className="bg-white rounded-3xl p-4 sm:p-5 border border-emerald-200/70 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-stone-800">
                {isSearching
                  ? t('{count} resultados para "{query}"', { count: visiblePlants.length, query: searchQuery })
                  : t("A mostrar {count} culturas", { count: visiblePlants.length })}
              </span>
              {isSearching && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="text-[11px] font-extrabold text-emerald-700 hover:underline bg-emerald-50 px-2 py-0.5 rounded-lg"
                >
                  {t("Limpar")}
                </button>
              )}
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

          {/* Filtros Sazonais Rápidos do Mês Atual */}
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
                setSeasonActionFilter((prev) => (prev === "harvest_now" ? "all" : "harvest_now"))
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

          {/* Categorias */}
          <CategoryFilterPills
            activeCategory={activeCategory}
            onSelectCategory={handleCategorySelect}
          />

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
        </section>

        <CatalogLanguageNote />

        {/* Grelha / Lista das Plantas */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-9 h-9 text-emerald-600 animate-spin" />
          </div>
        ) : visiblePlants.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200/70 p-6 shadow-2xs">
            <div className="text-5xl mb-2">🌿</div>
            <p className="text-base font-extrabold text-stone-800">
              {t("Nenhum alimento encontrado com estes filtros.")}
            </p>
            <p className="text-xs text-stone-500 mt-1">
              {t("Experimenta limpar a pesquisa ou selecionar outra categoria.")}
            </p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setSeasonActionFilter("all");
                setSelectedMonth(0);
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-extrabold hover:bg-emerald-800 transition-all shadow-xs"
            >
              {t("Limpar todos os filtros")}
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

        {/* Assistente IA Integrado no fundo do catálogo */}
        <section
          id="assistente-ia-catalogo"
          className="bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/30 rounded-3xl p-4 sm:p-6 border border-emerald-200/80 shadow-sm scroll-mt-20 mt-8"
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

      {/* Modal de Detalhes da Planta */}
      {selectedPlant && (
        <PlantDetail plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      )}
    </div>
  );
}
