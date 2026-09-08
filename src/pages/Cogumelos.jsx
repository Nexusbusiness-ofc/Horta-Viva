import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, Leaf, AlertTriangle, Search } from "lucide-react";
import { Link } from "react-router-dom";
import MonthSelector from "@/components/plant/MonthSelector";
import MushroomCard from "@/components/mushroom/MushroomCard";
import MushroomDetail from "@/components/mushroom/MushroomDetail";
import { cachedList } from "@/lib/offlineCatalog";

const CATEGORIES = ["Todos", "Comestível", "Comestível com precaução", "Tóxico", "Mortal"];

const CAT_COLORS = {
  "Comestível": "#16a34a",
  "Comestível com precaução": "#d97706",
  "Tóxico": "#ea580c",
  "Mortal": "#dc2626",
};

export default function Cogumelos() {
  const [mushrooms, setMushrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(0);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

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
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-amber-50 via-orange-50/30 to-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-amber-50/60 to-white/90 backdrop-blur-lg border-b border-amber-100/60">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-amber-600 hover:border-amber-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-300/50">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800 leading-none">Cogumelos Silvestres</h1>
              <p className="text-xs text-stone-500">Guia de apanha e identificação</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {/* Aviso de segurança */}
        <div className="rounded-2xl bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-red-700">Aviso de segurança</p>
              <p className="text-xs text-red-600 leading-relaxed mt-1">
                A identificação de cogumelos é complexa e o erro pode ser fatal. Esta app é apenas um guia educativo.
                <b> Nunca consuma um cogumelo sem confirmação por um especialista (micólogo).</b> Em caso de ingestão suspeita, ligue para o CIAV: <b>800 250 250</b>.
              </p>
            </div>
          </div>
        </div>

        {/* Pesquisa */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar cogumelo..."
            className="w-full bg-white rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-amber-300 border border-stone-200"
          />
        </div>

        {/* Filtros por categoria */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full transition-all ${
                category === c
                  ? "text-white shadow-sm"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-amber-300"
              }`}
              style={category === c ? { backgroundColor: c === "Todos" ? "#78350f" : CAT_COLORS[c] } : {}}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Mês */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-stone-700">📅 Época do ano</h2>
            {selectedMonth !== 0 && (
              <button onClick={() => setSelectedMonth(0)} className="text-xs text-amber-600 hover:text-amber-700 font-medium">
                Limpar
              </button>
            )}
          </div>
          <MonthSelector selectedMonth={selectedMonth} onSelect={setSelectedMonth} />
        </section>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🍄</div>
            <p className="text-stone-500">Nenhum cogumelo encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(m => (
              <MushroomCard key={m.id} mushroom={m} onClick={() => setSelected(m)} />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs">
        <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 bg-clip-text text-transparent font-medium">
          🍄 Minha Horta — Colhe com sabedoria
        </span>
      </footer>

      {selected && (
        <MushroomDetail mushroom={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}