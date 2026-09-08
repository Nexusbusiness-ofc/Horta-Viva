import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, PawPrint, Search } from "lucide-react";
import { Link } from "react-router-dom";
import AnimalCard from "@/components/animal/AnimalCard";
import AnimalDetail from "@/components/animal/AnimalDetail";
import { cachedList } from "@/lib/offlineCatalog";

const CATEGORIES = ["Todos", "Aves", "Coelhos", "Caprinos", "Ovinos", "Suínos", "Bovinos", "Equídeos", "Apicultura"];

export default function Animais() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

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
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-orange-50 via-amber-50/40 to-stone-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-orange-50/60 to-white/90 backdrop-blur-lg border-b border-orange-100/60">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-orange-600 hover:border-orange-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 via-amber-500 to-orange-700 flex items-center justify-center shadow-lg shadow-orange-300/50">
              <PawPrint className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800 leading-none">Animais do Campo</h1>
              <p className="text-xs text-stone-500">Guia de criação e cuidados</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {/* Banner intro */}
        <div className="rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 p-5 text-white shadow-lg shadow-orange-200/40">
          <p className="text-sm font-medium opacity-90">🐓 Descobre todos os animais que podes ter na tua quinta</p>
          <p className="text-lg font-bold mt-1">Onde os ter · Como alimentar · Cuidados · Utilidade</p>
        </div>

        {/* Pesquisa */}
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar animal..."
            className="w-full bg-white rounded-xl pl-10 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-orange-300 border border-stone-200"
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
                  ? "bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-sm"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-orange-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Lista */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">🐾</div>
            <p className="text-stone-500">Nenhum animal encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(a => (
              <AnimalCard key={a.id} animal={a} onClick={() => setSelected(a)} />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs">
        <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 bg-clip-text text-transparent font-medium">
          🐾 Minha Horta — Cria com sabedoria
        </span>
      </footer>

      {selected && (
        <AnimalDetail animal={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}