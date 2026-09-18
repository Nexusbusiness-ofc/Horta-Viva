import React from "react";
import { Image } from "@/components/ui/image";

const MONTH_SHORT = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function MondaCard({ monda, onClick, compact = false }) {
  const color = monda.color || "#84cc16";
  const months = monda.when_months || [];

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="group relative text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all flex flex-col w-full"
      >
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: color }} />
        <div className="relative aspect-square w-full overflow-hidden bg-stone-50 shrink-0">
          {monda.image_url ? (
            <Image
              src={monda.image_url}
              fittingType="fill"
              alt={`Monda de ${monda.name}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: `linear-gradient(135deg, ${color}25, ${color}08)` }}
            >
              {monda.emoji || "🌱"}
            </div>
          )}
          <span className="absolute top-1.5 left-1.5 text-xl drop-shadow-xs">{monda.emoji}</span>
        </div>

        <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between min-w-0">
          <h3 className="font-bold text-stone-800 text-xs sm:text-sm leading-tight truncate group-hover:text-emerald-700 transition-colors">
            {monda.name}
          </h3>
          <div className="flex items-center justify-between gap-1 mt-1 text-[10px]">
            <span
              className="font-medium px-1.5 py-0.5 rounded-full truncate"
              style={{ backgroundColor: color + "18", color }}
            >
              {monda.category}
            </span>
            <span className="text-lime-700 font-bold bg-lime-50 px-1.5 py-0.5 rounded-md border border-lime-200/60 flex items-center gap-0.5">
              📐 Esquema
            </span>
          </div>
        </div>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all active:scale-[0.98] flex flex-col"
    >
      <div className="relative h-32 w-full overflow-hidden">
        {monda.image_url ? (
          <Image src={monda.image_url} fittingType="fill" alt={`Monda de ${monda.name}`} className="w-full h-full block" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${color}22, ${color}06)` }}>
            <span className="text-5xl">{monda.emoji}</span>
          </div>
        )}
        <span className="absolute top-2 left-2 text-2xl drop-shadow-sm">{monda.emoji}</span>
      </div>
      <div className="px-4 pt-3 pb-1 space-y-2">
        <h3 className="font-bold text-stone-800 leading-tight">{monda.name}</h3>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: color + "22", color }}>
            {monda.category}
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-lime-50 text-lime-700 border border-lime-200/60 flex items-center gap-1">
            <span>📐</span> Esquema
          </span>
        </div>
        {monda.when_stage && <p className="text-xs text-stone-500 leading-snug line-clamp-2">{monda.when_stage}</p>}
      </div>
      <div className="px-4 py-2.5 mt-auto">
        <p className="text-[10px] text-stone-400 font-medium mb-1">Época</p>
        <div className="flex gap-0.5">
          {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
            <span
              key={m}
              className={`flex-1 text-center text-[9px] leading-none rounded-sm py-1 font-medium ${months.includes(m) ? "text-white" : "text-stone-300 bg-stone-100"}`}
              style={months.includes(m) ? { backgroundColor: color } : {}}
            >
              {MONTH_SHORT[m]}
            </span>
          ))}
        </div>
      </div>
    </button>
  );
}