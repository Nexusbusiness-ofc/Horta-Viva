import React from "react";

const DIFFICULTY_STYLES = {
  "Fácil": { bg: "#dcfce7", fg: "#16a34a" },
  "Média": { bg: "#fef3c7", fg: "#d97706" },
  "Difícil": { bg: "#fee2e2", fg: "#dc2626" },
};

const EFFORT_STYLES = {
  "Baixo": "🟢",
  "Médio": "🟡",
  "Alto": "🔴",
};

export default function AnimalCard({ animal, onClick }) {
  const diff = DIFFICULTY_STYLES[animal.difficulty] || DIFFICULTY_STYLES["Fácil"];
  const effort = EFFORT_STYLES[animal.daily_effort] || "🟡";

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all"
    >
      {animal.image_url ? (
        <div className="relative h-28 w-full overflow-hidden">
          <img src={animal.image_url} alt={animal.name} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
            <span className="text-xl drop-shadow">{animal.emoji || "🐔"}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm leading-tight truncate drop-shadow">{animal.name}</h3>
              <p className="text-xs text-white/80 italic truncate">{animal.scientific_name || ""}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: `linear-gradient(135deg, ${animal.color || "#c2410c"}22, ${animal.color || "#c2410c"}08)` }}
        >
          <div className="text-4xl">{animal.emoji || "🐔"}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-stone-800 text-sm leading-tight truncate">{animal.name}</h3>
            <p className="text-xs text-stone-500 italic truncate">{animal.scientific_name || ""}</p>
          </div>
        </div>
      )}
      <div className="px-4 py-3 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-stone-500 bg-stone-100 rounded-full px-2 py-0.5">{animal.category}</span>
          <span className="text-xs font-semibold rounded-full px-2 py-0.5" style={{ backgroundColor: diff.bg, color: diff.fg }}>
            {animal.difficulty}
          </span>
        </div>
        {animal.what_they_do && (
          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">{animal.what_they_do}</p>
        )}
        <div className="flex items-center gap-2 pt-1 border-t border-stone-100">
          <span className="text-[10px] text-stone-400">Esforço</span>
          <span className="text-sm">{effort}</span>
          {animal.space_needed && (
            <span className="text-[10px] text-stone-400 ml-auto truncate">📐 {animal.space_needed.split(".")[0]}</span>
          )}
        </div>
      </div>
    </button>
  );
}