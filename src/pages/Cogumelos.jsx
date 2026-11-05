import { useI18n } from "@/lib/I18nContext";
import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, Leaf, AlertTriangle, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import MonthSelector from "@/components/plant/MonthSelector";
import MushroomCard from "@/components/mushroom/MushroomCard";
import MushroomDetail from "@/components/mushroom/MushroomDetail";
import { cachedList } from "@/lib/offlineCatalog";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import { ViewModeToggle, useViewMode } from "@/components/ui/ViewModeToggle";

const CATEGORIES = ["Todos", "Comestível", "Comestível com precaução", "Tóxico", "Mortal"];
const CAT_COLORS = {
  "Comestível": "#16a34a",
  "Comestível com precaução": "#d97706",
  "Tóxico": "#ea580c",
  "Mortal": "#dc2626"
};

export default function Cogumelos() {
  const { t: i18nT } = useI18n();
  const [mushrooms, setMushrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [viewMode, setViewMode] = useViewMode("hortaviva_mushroom_view_mode", "large");

  useEffect(() => {
    cachedList("mushrooms", () => base44.entities.Mushroom.list())
      .then(setMushrooms)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return mushrooms.filter(m => {
      if (category !== "Todos" && m.edibility !== category) return false;
      if (selectedMonth !== 0 && !(m.season_months || []).includes(selectedMonth)) return false;
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        if (!m.name?.toLowerCase().includes(q) && !(m.scientific_name || "").toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [mushrooms, category, selectedMonth, search]);

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
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 flex items-center justify-center shadow-lg border border-white/25">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-none tracking-tight">
                {i18nT("Cogumelos Silvestres")}
              </h1>
              <p className="text-xs text-emerald-100/85 mt-1 truncate">
                {i18nT("Guia micológico de apanha, época e identificação segura")}
              </p>
            </div>
            <NavigationDrawer />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-5">
        {/* Aviso de segurança */}
        <div className="rounded-3xl bg-gradient-to-r from-red-50 via-rose-50 to-amber-50/70 border border-red-200/90 p-4 sm:p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-red-800">{i18nT("Aviso de segurança micológica")}</p>
              <p className="text-xs text-red-700 leading-relaxed mt-1">
                {i18nT("A identificação de cogumelos é complexa e o erro pode ser fatal. Esta app é apenas um guia educativo.")}
                <b>{i18nT(" Nunca consuma um cogumelo sem confirmação por um especialista (micólogo).")}</b>
                {i18nT(" Em caso de ingestão suspeita, ligue para o CIAV: ")}
                <b className="underline">800 250 250</b>.
              </p>
            </div>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="relative">
          <Search className="w-4 h-4 text-amber-700/60 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={i18nT("Pesquisar cogumelo ou nome científico...")}
            className="w-full bg-white rounded-2xl pl-10 pr-9 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-400 border border-stone-200 shadow-sm"
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
                    ? "text-white shadow-md"
                    : "bg-white border border-stone-200 text-stone-700 hover:border-amber-300 shadow-sm"
                }`}
                style={
                  category === c
                    ? {
                        backgroundColor: c === "Todos" ? "#78350f" : CAT_COLORS[c]
                      }
                    : {}
                }
              >
                {i18nT(c)}
              </button>
            ))
          )}
        </div>

        {/* Mês */}
        <section className="hv-section-panel">
          <div className="flex items-center justify-between mb-2.5">
            <h2 className="text-sm font-extrabold text-stone-800">{i18nT("📅 Época do ano")}</h2>
            {selectedMonth !== 0 && (
              <button
                onClick={() => setSelectedMonth(0)}
                className="text-xs text-amber-700 hover:text-amber-800 font-bold"
              >
                {i18nT("Limpar")}
              </button>
            )}
          </div>
          <MonthSelector selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
        </section>

        {/* Header da lista com ViewModeToggle */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-stone-800">{i18nT("🍄 Cogumelos Silvestres")}</h2>
            <span className="text-xs font-extrabold text-amber-900 bg-amber-100 border border-amber-200 px-2.5 py-0.5 rounded-full">
              {filtered.length}
            </span>
          </div>
          <ViewModeToggle mode={viewMode} onChange={setViewMode} />
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white/70 rounded-3xl border border-stone-200/70">
            <div className="text-5xl mb-3">🍄</div>
            <p className="text-stone-600 font-semibold">{i18nT("Nenhum cogumelo encontrado.")}</p>
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
              filtered.map(m => (
                <MushroomCard key={m.id} mushroom={m} onClick={() => setSelected(m)} compact={viewMode === "grid"} />
              ))
            )}
          </div>
        )}
      </main>

      <footer className="text-center pt-4 pb-28 text-xs">
        <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent font-medium">
          {i18nT("🍄 Minha Horta — Colhe com sabedoria")}
        </span>
      </footer>

      {selected && <MushroomDetail mushroom={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
