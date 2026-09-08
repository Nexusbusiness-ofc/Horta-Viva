import React from "react";
import { cn } from "@/lib/utils";

const MONTHS = [
  { num: 0, label: "Agora", emoji: "📅" },
  { num: 1, label: "Jan", emoji: "❄️" },
  { num: 2, label: "Fev", emoji: "❄️" },
  { num: 3, label: "Mar", emoji: "🌱" },
  { num: 4, label: "Abr", emoji: "🌸" },
  { num: 5, label: "Mai", emoji: "🌷" },
  { num: 6, label: "Jun", emoji: "☀️" },
  { num: 7, label: "Jul", emoji: "☀️" },
  { num: 8, label: "Ago", emoji: "🌞" },
  { num: 9, label: "Set", emoji: "🍂" },
  { num: 10, label: "Out", emoji: "🍁" },
  { num: 11, label: "Nov", emoji: "🍂" },
  { num: 12, label: "Dez", emoji: "🎄" },
];

export default function MonthSelector({ selectedMonth, onSelect }) {
  const currentMonth = new Date().getMonth() + 1;

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {MONTHS.map(m => {
        const isActive = selectedMonth === m.num;
        const isCurrent = m.num === currentMonth;
        return (
          <button
            key={m.num}
            onClick={() => onSelect(m.num)}
            className={cn(
              "relative shrink-0 flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-all duration-200 border-2",
              isActive
                ? "bg-gradient-to-br from-emerald-400 to-green-600 border-green-600 text-white shadow-lg shadow-emerald-300/50 scale-105"
                : "bg-gradient-to-br from-white to-stone-50 border-stone-200 text-stone-600 hover:border-emerald-300 hover:from-emerald-50 hover:to-green-50"
            )}
          >
            <span className="text-lg leading-none mb-0.5">{m.emoji}</span>
            <span className="text-xs font-semibold">{m.label}</span>
            {isCurrent && !isActive && (
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}