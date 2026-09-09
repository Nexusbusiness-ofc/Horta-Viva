import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Leaf, Loader2, Sprout, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import SearchBar from "@/components/plant/SearchBar";
import MonthSelector from "@/components/plant/MonthSelector";
import PlantCard from "@/components/plant/PlantCard";
import PlantDetail from "@/components/plant/PlantDetail";
import AIAssistant from "@/components/plant/AIAssistant";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import HeroCarousel from "@/components/home/HeroCarousel";
import OnboardingProfile from "@/components/profile/OnboardingProfile";
import AuthButton from "@/components/auth/AuthButton";
import { cachedList } from "@/lib/offlineCatalog";

const MONTH_NAMES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

export default function Home() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [searchResults, setSearchResults] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [aiQuery, setAiQuery] = useState(null);

  useEffect(() => {
    cachedList("plants", () => base44.entities.Plant.list())
      .then(setPlants)
      .finally(() => setLoading(false));
  }, []);

  const currentMonth = new Date().getMonth() + 1;

  const visiblePlants = useMemo(() => {
    if (searchResults !== null) return searchResults;
    if (selectedMonth === 0) return plants;
    return plants.filter(p =>
      (p.sow_months || []).includes(selectedMonth) ||
      (p.plant_months || []).includes(selectedMonth) ||
      (p.harvest_months || []).includes(selectedMonth)
    );
  }, [plants, selectedMonth, searchResults]);

  const monthLabel = selectedMonth === 0
    ? "Este mês"
    : MONTH_NAMES[selectedMonth];

  const plantsToSow = useMemo(() =>
    plants.filter(p => (p.sow_months || []).includes(selectedMonth === 0 ? currentMonth : selectedMonth)),
  [plants, selectedMonth, currentMonth]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-green-50/40 to-lime-50/50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-emerald-50/60 to-white/90 backdrop-blur-lg border-b border-emerald-100/60">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src="./logo.jpg" 
              alt="Horta Viva" 
              className="w-11 h-11 rounded-xl shadow-md border border-emerald-200/70 object-cover shrink-0" 
            />
            <div>
              <h1 className="text-xl font-extrabold text-stone-800 leading-tight">Horta Viva</h1>
              <p className="text-xs text-stone-500 font-medium">Agricultura & Guia de Cultivo</p>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <AuthButton />
              <NavigationDrawer />
              <Link
                to="/identificar"
                className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white text-sm font-medium px-3 py-2 rounded-xl shadow-md shadow-teal-200/50 hover:shadow-lg transition-all active:scale-95"
                title="Identificar planta por foto"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden md:inline">Identificar</span>
              </Link>
              <Link
                to="/minha-quinta"
                className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-95"
              >
                <Sprout className="w-4 h-4" />
                <span className="hidden sm:inline">Minha Quinta</span>
              </Link>
            </div>
          </div>
          <SearchBar
            plants={plants}
            onResults={setSearchResults}
            onAIQuery={setAiQuery}
          />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-6">
        {/* Hero carousel (hidden during search) */}
        {searchResults === null && !loading && plants.length > 0 && (
          <HeroCarousel plants={plants} onSelect={setSelectedPlant} />
        )}

        {/* Month selector (hidden during search) */}
        {searchResults === null && (
          <section>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-stone-700">📅 Escolher mês</h2>
              {selectedMonth !== 0 && (
                <button
                  onClick={() => setSelectedMonth(0)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  Voltar a "Este mês"
                </button>
              )}
            </div>
            <MonthSelector selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
          </section>
        )}

        {/* Search results label */}
        {searchResults !== null && (
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-700">
              🔍 {searchResults.length} resultado{searchResults.length !== 1 ? "s" : ""}
            </h2>
            <button
              onClick={() => setSearchResults(null)}
              className="text-xs text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Limpar pesquisa
            </button>
          </div>
        )}

        {/* Month summary */}
        {searchResults === null && selectedMonth !== 0 && (
          <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 rounded-2xl px-5 py-4 text-white shadow-lg shadow-emerald-300/40">
            <p className="text-sm font-medium opacity-90">Em {monthLabel}</p>
            <p className="text-2xl font-bold">{plantsToSow.length} planta{plantsToSow.length !== 1 ? "s" : ""} para semear 🌱</p>
          </div>
        )}

        {/* Plants grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : visiblePlants.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🌿</div>
            <p className="text-stone-500">Nenhuma planta encontrada.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {visiblePlants.map(p => (
              <PlantCard key={p.id} plant={p} onClick={() => setSelectedPlant(p)} />
            ))}
          </div>
        )}

        {/* AI Assistant */}
        <section>
          <h2 className="text-sm font-semibold text-stone-700 mb-2">🤖 Assistente IA</h2>
          <AIAssistant query={aiQuery} plants={plants} onClearQuery={() => setAiQuery(null)} />
        </section>
      </main>

      <footer className="text-center py-6 text-xs">
        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-medium">
          🌱 Minha Horta — Cultiva com sabedoria
        </span>
      </footer>

      {selectedPlant && (
        <PlantDetail plant={selectedPlant} onClose={() => setSelectedPlant(null)} />
      )}

      <OnboardingProfile />
    </div>
  );
}
