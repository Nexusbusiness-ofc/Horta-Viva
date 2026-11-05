import { useI18n } from "@/lib/I18nContext";
import React from "react";

const CATEGORIES = [
  {
    id: "all",
    label: "Todos",
    emoji: "✨"
  },
  {
    id: "hortalicas",
    label: "Hortaliças",
    emoji: "🌱",
    match: ["hortaliça", "hortalica", "folha", "alface", "couve", "espinafre"]
  },
  {
    id: "frutos",
    label: "Frutos",
    emoji: "🍅",
    match: ["fruto", "tomate", "pimento", "pepino", "abobora", "morango"]
  },
  {
    id: "raizes",
    label: "Raízes",
    emoji: "🥕",
    match: ["raiz", "tuberculo", "cenoura", "rabanete", "beterraba", "batata", "alho", "cebola"]
  },
  {
    id: "aromaticas",
    label: "Aromáticas",
    emoji: "🌿",
    match: ["aromatica", "erva", "salsa", "coentros", "manjericao", "alecrim"]
  },
  {
    id: "podas",
    label: "Podas",
    emoji: "✂️",
    isSpecialLink: "/podas-mondas"
  },
  {
    id: "animais",
    label: "Animais",
    emoji: "🐾",
    isSpecialLink: "/animais"
  }
];

export default function CategoryFilterPills({
  activeCategory,
  onSelectCategory
}) {
  const {
    t: i18nT
  } = useI18n();

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 -mx-4 px-4 scrollbar-hide">
        {i18nT(
          CATEGORIES.map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all duration-200 active:scale-95 whitespace-nowrap ${
                  isActive
                    ? "bg-gradient-to-r from-[#155e37] via-emerald-700 to-teal-700 text-white shadow-md shadow-emerald-900/20 ring-2 ring-emerald-500/20"
                    : "bg-white text-stone-700 border border-stone-200/90 hover:border-emerald-300 hover:bg-emerald-50/40 hover:text-emerald-800 shadow-2xs"
                }`}
              >
                <span className="text-sm leading-none">{i18nT(cat.emoji)}</span>
                <span>{i18nT(cat.label)}</span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

export { CATEGORIES };
