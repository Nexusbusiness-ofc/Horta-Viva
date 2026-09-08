import React, { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MONTHS = [
  "Todos", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

export default function SearchBar({ plants, onResults, onAIQuery }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);

  const results = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase().trim();
    return plants.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.sow_instructions || "").toLowerCase().includes(q) ||
      (p.care_instructions || "").toLowerCase().includes(q)
    );
  }, [query, plants]);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    onResults(val.trim() ? results : null);
  };

  const handleClear = () => {
    setQuery("");
    onResults(null);
  };

  const handleAskAI = () => {
    if (query.trim()) {
      onAIQuery(query.trim());
    }
  };

  return (
    <div className="w-full">
      <div className={cn(
        "flex items-center gap-2 bg-gradient-to-r from-white to-stone-50/50 rounded-2xl border-2 transition-all duration-300 px-3 sm:px-4 py-3 shadow-sm",
        focused ? "border-emerald-500 shadow-md shadow-emerald-100 from-emerald-50/30 to-white" : "border-stone-200"
      )}>
        <Search className="w-5 h-5 text-stone-400 shrink-0" />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          placeholder="Pesquisar alimento..."
          className="flex-1 min-w-0 bg-transparent outline-none text-stone-700 placeholder:text-stone-400 text-sm sm:text-base"
        />
        {query && (
          <button onClick={handleClear} className="text-stone-400 hover:text-stone-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={handleAskAI}
          className="shrink-0 flex items-center gap-1 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-xl hover:shadow-lg hover:shadow-emerald-300/50 transition-all duration-200 active:scale-95"
        >
          <span className="hidden sm:inline">✨ Perguntar IA</span>
          <span className="sm:hidden">✨ IA</span>
        </button>
      </div>
    </div>
  );
}