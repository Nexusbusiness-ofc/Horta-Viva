import React from "react";
import { Image } from "@/components/ui/image";

const MONTH_SHORT = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function MondaCard({ monda, onClick }) {
  const color = monda.color || "#84cc16";
  const months = monda.when_months || [];
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
        <span className="inline-block text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: color + "22", color }}>
          {monda.category}
        </span>
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