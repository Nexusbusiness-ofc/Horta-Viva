import { useI18n } from "@/lib/I18nContext";
import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, PawPrint, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import AnimalCard from "@/components/animal/AnimalCard";
import AnimalDetail from "@/components/animal/AnimalDetail";
import { cachedList } from "@/lib/offlineCatalog";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import { ViewModeToggle, useViewMode } from "@/components/ui/ViewModeToggle";

const CATEGORIES = [
  "Todos",
  "Aves",
  "Coelhos",
  "Caprinos",
  "Ovinos",
  "Suínos",
  "Bovinos",
  "Equídeos",
  "Apicultura",
  "Guarda & Pastoreio",
  "Solo &...Auxiliares".replace("...", " "),
  "Aquacultura"
];

export default function Animais() {
  const { t: i18nT } = useI18n();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useViewMode("hortaviva_animal_view_mode", "large");

  useEffect(() => {
    cachedList("farmanimals", () => base44.entities.FarmAnimal.list())
      .then(setAnimals)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return animals.filter(a => {
      if (category !== "Todos" && a.category !== category) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        if (!a.name?.toLowerCase().includes(q) && !(a.scientific_name || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [animals, category, search]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
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
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-400 via-amber-500 to-orange-700 flex items-center justify-center shadow-lg border border-white/25">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-none tracking-tight">
                {i18nT("Animais do Campo")}
              </h1>
              <p className="text-xs text-emerald-100/85 mt-1 truncate">
                {i18nT("Guia de criação, alimentação, bem-estar e utilidade na quinta")}
              </p>
            </div>
            <NavigationDrawer />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Banner intro */}
        <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 p-5 text-white shadow-lg shadow-orange-200/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-orange-400/30">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-amber-100/90">
              {i18nT("🐓 Pecuária familiar & Biodiversidade")}
            </p>
            <p className="text-base sm:text-lg font-extrabold mt-1">
              {i18nT("Onde os ter · Como alimentar · Cuidados · Sinergia com a Horta")}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-3 py-1.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-xs font-extrabold">
              🐾 {animals.length} {i18nT("espécies")}
            </span>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="relative">
          <Search className="w-4 h-4 text-orange-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={i18nT("Pesquisar animal ou nome científico...")}
            className="w-full bg-white rounded-2xl pl-10 pr-9 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-orange-400 border border-stone-200 shadow-sm"
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

        {/* Filtros por categoria */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {i18nT(
            CATEGORIES.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`shrink-0 text-xs sm:text-sm font-bold px-3.5 sm:px-4 py-2 rounded-2xl transition-all ${
                  category === c
                    ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-md"
                    : "bg-white border border-stone-200 text-stone-700 hover:border-orange-300 shadow-sm"
                }`}
              >
                {i18nT(c)}
              </button>
            ))
          )}
        </div>

        {/* Header da lista com ViewModeToggle */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-stone-800">{i18nT("🐾 Animais da Quinta")}</h2>
            <span className="text-xs font-extrabold text-orange-800 bg-orange-100 border border-orange-200 px-2.5 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white/70 rounded-3xl border border-stone-200/70">
            <div className="text-5xl mb-3">🐾</div>
            <p className="text-stone-600 font-semibold">{i18nT("Nenhum animal encontrado.")}</p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5 sm:gap-3.5"
                : "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
            }
          >
            {i18nT(
              filtered.map(a => (
                <AnimalCard key={a.id} animal={a} onClick={() => setSelected(a)} compact={viewMode === "grid"} />
              ))
            )}
          </div>
        )}
      </main>

      <footer className="text-center pt-4 pb-28 text-xs">
        <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent font-medium">
          {i18nT("🐾 Minha Horta — Cria com sabedoria")}
        </span>
      </footer>

      {selected && <AnimalDetail animal={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
