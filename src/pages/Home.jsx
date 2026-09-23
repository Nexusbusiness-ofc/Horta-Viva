import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Sparkles, Filter } from "lucide-react";
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

const MONTH_NAMES = [
  "", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function Home() {
  const navigate = useNavigate();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [showMonthFilter, setShowMonthFilter] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [aiQuery, setAiQuery] = useState(null);
  const [showProModal, setShowProModal] = useState(false);
  const [pendingTasksCount, setPendingTasksCount] = useState(1);
  const [viewMode, setViewMode] = useViewMode("hortaviva_plant_view_mode", "large");
  const { isPro, isPlus } = useSubscription();

  useEffect(() => {
    cachedList("plants", () => base44.entities.Plant.list())
      .then(setPlants)
      .finally(() => setLoading(false));

    // Carregar contagem de plantações ou tarefas para o badge de notificações
    base44.entities.Planting.list("-planted_date")
      .then((plantings) => {
        if (plantings && plantings.length > 0) {
          setPendingTasksCount(Math.min(plantings.length, 9));
        }
      })
      .catch(() => {});
  }, []);

  const currentMonth = new Date().getMonth() + 1;

  // Filtragem de plantas por pesquisa, categoria e mês
  const visiblePlants = useMemo(() => {
    let list = plants;

    // Filtro de pesquisa por texto
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      return list.filter(
        (p) =>
          (p.name || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.sow_instructions || "").toLowerCase().includes(q) ||
          (p.care_instructions || "").toLowerCase().includes(q)
      );
    }

    // Filtro por categoria do mockup
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
            pName.includes("espinafre")
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
            pName.includes("manjericão")
          );
        }
        return true;
      });
    }

    // Filtro opcional por mês
    if (selectedMonth !== 0) {
      list = list.filter(
        (p) =>
          (p.sow_months || []).includes(selectedMonth) ||
          (p.plant_months || []).includes(selectedMonth) ||
          (p.harvest_months || []).includes(selectedMonth)
      );
    }

    return list;
  }, [plants, searchQuery, activeCategory, selectedMonth]);

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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f7f9f6] text-stone-800">
      {/* 1. Topo Verde Floresta Arredondado com Barra de Pesquisa em Pílula (Idêntico ao Mockup) */}
      <HomeMockupHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onClearSearch={handleClearSearch}
        onGoToAI={handleGoToAI}
        pendingTasksCount={pendingTasksCount}
      />

      {/* Conteúdo Principal com medidas e espaçamentos idênticos ao layout mobile do mockup */}
      <main className="max-w-xl mx-auto px-4 pt-3.5 pb-28 space-y-4">
        {/* Quando o utilizador NÃO está a pesquisar, exibe todos os blocos do mockup */}
        {!isSearching && (
          <>
            {/* 2. Cartão de Destaque / Carrossel com Broto e 3 Pontos (Idêntico ao Mockup) */}
            <MockupHeroCard />

            {/* 3. Carrossel Horizontal: Curiosidades Diárias da Horta */}
            <DailyCuriositiesCarousel />

            {/* 5. Grelha em Destaque: 4 Áreas da App com Imagens Representativas */}
            <HomeExploreGrid />

            {/* 6. Pílulas de Filtros de Categorias (Todos, Hortaliças, Frutos, Raízes, Aromáticas, Podas, Animais) */}
            <CategoryFilterPills
              activeCategory={activeCategory}
              onSelectCategory={handleCategorySelect}
            />
          </>
        )}

        {/* Informação de Pesquisa Ativa */}
        {isSearching && (
          <div className="flex items-center justify-between pt-1">
            <h2 className="text-sm font-bold text-stone-700">
              🔍 {visiblePlants.length} resultado{visiblePlants.length !== 1 ? "s" : ""} para "{searchQuery}"
            </h2>
            <button
              onClick={handleClearSearch}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-bold"
            >
              Limpar pesquisa
            </button>
          </div>
        )}

        {/* 6. Catálogo de Plantas & Alimentos */}
        <section className="space-y-3 pt-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-black text-stone-800">
                🌱 Catálogo de Alimentos
              </h2>
              <span className="text-[11px] text-stone-400 font-bold">
                ({visiblePlants.length})
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Botão de filtro sazonal por mês */}
              <button
                type="button"
                onClick={() => setShowMonthFilter((prev) => !prev)}
                className={`text-xs font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1 transition-all ${
                  selectedMonth !== 0 || showMonthFilter
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-white text-stone-600 border-stone-200"
                }`}
                title="Filtrar por mês do ano"
              >
                <Filter className="w-3 h-3 text-emerald-700" />
                <span>{selectedMonth === 0 ? "Mês" : MONTH_NAMES[selectedMonth]}</span>
              </button>

              <ViewModeToggle mode={viewMode} onChange={setViewMode} />
            </div>
          </div>

          {/* Seletor de Mês Expansível */}
          {showMonthFilter && (
            <div className="bg-white p-3 rounded-2xl border border-stone-200/80 shadow-xs animate-in fade-in duration-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-700">📅 Época de plantio / colheita:</span>
                {selectedMonth !== 0 && (
                  <button
                    onClick={() => setSelectedMonth(0)}
                    className="text-[11px] text-emerald-700 font-bold hover:underline"
                  >
                    Ver todos
                  </button>
                )}
              </div>
              <MonthSelector selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
            </div>
          )}

          {/* Lista / Grelha de Plantas */}
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
            </div>
          ) : visiblePlants.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-stone-200/70 p-6">
              <div className="text-4xl mb-2">🌿</div>
              <p className="text-sm font-bold text-stone-700">Nenhum alimento encontrado nesta categoria.</p>
              <button
                onClick={() => {
                  setActiveCategory("all");
                  setSelectedMonth(0);
                  setSearchQuery("");
                }}
                className="mt-3 text-xs text-emerald-700 font-bold underline"
              >
                Limpar filtros e ver todas as plantas
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-2 sm:grid-cols-3 gap-2.5"
                  : "grid grid-cols-1 sm:grid-cols-2 gap-3"
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

        {/* 8. Assistente IA Integrado */}
        <section id="assistente-ia" className="bg-white rounded-3xl p-4 border border-stone-200/80 shadow-xs scroll-mt-20">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">🤖</span>
            <h2 className="text-sm font-black text-stone-800">Assistente Agrónomo IA</h2>
          </div>
          <AIAssistant query={aiQuery} plants={plants} onClearQuery={() => setAiQuery(null)} />
        </section>
      </main>

      {/* Rodapé suave */}
      <footer className="text-center pt-2 pb-24 text-xs text-stone-400">
        <span>🌱 Horta Viva — Cultiva com sabedoria</span>
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
