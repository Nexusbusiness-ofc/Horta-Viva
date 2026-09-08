import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, Scissors, Sprout, Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import PodaCard from "@/components/podas/PodaCard";
import PodaDetail from "@/components/podas/PodaDetail";
import MondaCard from "@/components/mondas/MondaCard";
import MondaDetail from "@/components/mondas/MondaDetail";
import { cachedList } from "@/lib/offlineCatalog";

export default function PodasMondas() {
  const [tab, setTab] = useState("podas");
  const [podas, setPodas] = useState([]);
  const [mondas, setMondas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todas");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    Promise.all([
      cachedList("podas", () => base44.entities.Podas.list()),
      cachedList("mondas", () => base44.entities.Mondas.list())
    ]).then(([p, m]) => { setPodas(p); setMondas(m); }).finally(() => setLoading(false));
  }, []);

  const data = tab === "podas" ? podas : mondas;

  const categories = useMemo(() => {
    const set = new Set(data.map(d => d.category).filter(Boolean));
    return ["Todas", ...Array.from(set)];
  }, [data]);

  const filtered = useMemo(() => {
    return data.filter(d => {
      if (category !== "Todas" && d.category !== category) return false;
      if (search.trim() && !d.name.toLowerCase().includes(search.toLowerCase().trim())) return false;
      return true;
    });
  }, [data, category, search]);

  const switchTab = (t) => { setTab(t); setCategory("Todas"); setSearch(""); setSelected(null); };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-green-50/40 to-lime-50/50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-emerald-50/60 to-white/90 backdrop-blur-lg border-b border-emerald-100/60">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-300/50">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800 leading-none">Podas &amp; Mondas</h1>
              <p className="text-xs text-stone-500">Poda de árvores e desbaste de sementeiras</p>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => switchTab("podas")}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-xl transition-all ${tab === "podas" ? "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white shadow-md" : "bg-white border border-stone-200 text-stone-600"}`}
            >
              <Scissors className="w-4 h-4" /> Podas
            </button>
            <button
              onClick={() => switchTab("mondas")}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-xl transition-all ${tab === "mondas" ? "bg-gradient-to-r from-lime-500 via-green-600 to-emerald-600 text-white shadow-md" : "bg-white border border-stone-200 text-stone-600"}`}
            >
              <Sprout className="w-4 h-4" /> Mondas
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        <div className="relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={tab === "podas" ? "Pesquisar árvore ou cultura..." : "Pesquisar cultura..."}
            className="w-full bg-white border border-stone-200 rounded-xl pl-9 pr-9 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-300"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full transition-all ${category === c ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm" : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-300"}`}
            >
              {c}
            </button>
          ))}
        </div>

        {tab === "podas" ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-sm text-stone-600 leading-relaxed">
            <p className="font-semibold text-emerald-700 mb-1">🌳 Poda de árvores</p>
            <p>A poda orienta o crescimento, a produção e a saúde da árvore. Há 3 tipos: <b>formação</b> (árvores jovens), <b>produção</b> (adultas) e <b>limpeza/rejuvenescimento</b>. Cada espécie tem a sua época e técnica — segue o guia de cada árvore.</p>
          </div>
        ) : (
          <div className="bg-lime-50 border border-lime-200 rounded-2xl p-4 text-sm text-stone-600 leading-relaxed">
            <p className="font-semibold text-lime-700 mb-1">🌱 Monda (desbaste)</p>
            <p>A monda é o desbaste das plântulas nascidas da sementeira direta: removem-se as mais fracas para que as melhores tenham espaço, luz e nutrientes para crescer. Inclui também o <b>deserbamento</b> (remover as ervas daninhas concorrentes).</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-emerald-500 animate-spin" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">{tab === "podas" ? "🌳" : "🌱"}</div>
            <p className="text-stone-500">Nenhum resultado encontrado.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(item => (
              tab === "podas"
                ? <PodaCard key={item.id} poda={item} onClick={() => setSelected(item)} />
                : <MondaCard key={item.id} monda={item} onClick={() => setSelected(item)} />
            ))}
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-xs">
        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-medium">
          🌱 Minha Horta — Cultiva com sabedoria
        </span>
      </footer>

      {selected && tab === "podas" && <PodaDetail poda={selected} onClose={() => setSelected(null)} />}
      {selected && tab === "mondas" && <MondaDetail monda={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}