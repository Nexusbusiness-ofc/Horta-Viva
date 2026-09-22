import React from "react";

const CATEGORIES = [
  { id: "all", label: "Todos", emoji: "✨" },
  { id: "hortalicas", label: "Hortaliças", emoji: "🌱", match: ["hortaliça", "hortalica", "folha", "alface", "couve", "espinafre"] },
  { id: "frutos", label: "Frutos", emoji: "🍅", match: ["fruto", "tomate", "pimento", "pepino", "abobora", "morango"] },
  { id: "raizes", label: "Raízes", emoji: "🥕", match: ["raiz", "tuberculo", "cenoura", "rabanete", "beterraba", "batata", "alho", "cebola"] },
  { id: "aromaticas", label: "Aromáticas", emoji: "🌿", match: ["aromatica", "erva", "salsa", "coentros", "manjericao", "alecrim"] },
  { id: "podas", label: "Podas", emoji: "✂️", isSpecialLink: "/podas-mondas" },
  { id: "animais", label: "Animais", emoji: "🐾", isSpecialLink: "/animais" },
];

export default function CategoryFilterPills({ activeCategory, onSelectCategory }) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat)}
              className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 active:scale-95 whitespace-nowrap shadow-xs ${
                isActive
                  ? "bg-[#155e37] text-white shadow-md shadow-emerald-950/20"
                  : "bg-white text-stone-600 border border-stone-200/90 hover:border-emerald-300 hover:text-emerald-700"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { CATEGORIES };
