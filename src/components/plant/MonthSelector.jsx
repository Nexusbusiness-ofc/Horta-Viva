import { getLocalMonth } from '@/lib/regionalClimate';
import { readRegionalPreferences } from '@/lib/regionalPreferences';
import { useI18n } from "@/lib/I18nContext";
import { translatedMonth } from "@/lib/i18n";
import React from "react";
import { cn } from "@/lib/utils";
const MONTHS = Array.from({ length: 13 }, (_, num) => ({ num }));
export default function MonthSelector({
  selectedMonth,
  onSelect
}) {
  const {
    t: i18nT,
    language
  } = useI18n();
  const currentMonth = getLocalMonth(new Date(), readRegionalPreferences());
  return <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
      {i18nT(MONTHS.map(m => {
      const isActive = selectedMonth === m.num;
      const isCurrent = m.num === currentMonth;
      return <button key={m.num} onClick={() => onSelect(m.num)} className={cn("relative shrink-0 flex flex-col items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-2xl transition-all duration-200 border-2", isActive ? "bg-gradient-to-br from-emerald-400 to-green-600 border-green-600 text-white shadow-lg shadow-emerald-300/50 scale-105" : "bg-gradient-to-br from-white to-stone-50 border-stone-200 text-stone-600 hover:border-emerald-300 hover:from-emerald-50 hover:to-green-50")}>
            <span className="text-lg leading-none mb-0.5" aria-hidden="true">📅</span>
            <span className="text-xs font-semibold">{m.num === 0 ? i18nT("Agora") : translatedMonth(m.num - 1, language, 'short')}</span>
            {isCurrent && !isActive && <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />}
          </button>;
    }))}
    </div>;
}
