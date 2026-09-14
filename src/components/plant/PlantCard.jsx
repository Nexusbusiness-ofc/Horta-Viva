import React from "react";
import { Sprout, Calendar, Sun, Droplets } from "lucide-react";
import { Image } from "@/components/ui/image";

const MONTH_SHORT = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function shortMonths(months, max = 4) {
  if (!months || months.length === 0) return "—";
  const labels = months.map(m => MONTH_SHORT[m]);
  return labels.length > max ? labels.slice(0, max).join(" · ") + " …" : labels.join(" · ");
}

export default function PlantCard({ plant, onClick, compact = false }) {
  const color = plant.color || "#84cc16";

  const currentMonth = new Date().getMonth() + 1;
  const isSowNow = (plant.sow_months || []).includes(currentMonth);
  const isHarvestNow = (plant.harvest_months || []).includes(currentMonth);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="group relative text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all flex flex-col w-full"
      >
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: color }} />
        <div className="relative aspect-square w-full overflow-hidden bg-stone-50 shrink-0">
          {plant.image_url ? (
            <Image
              src={plant.image_url}
              fittingType="fill"
              alt={plant.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: `linear-gradient(135deg, ${color}25, ${color}08)` }}
            >
              {plant.emoji || "🌱"}
            </div>
          )}

          {/* Badges pequenos */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {isSowNow && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/95 text-green-700 shadow-xs flex items-center gap-0.5">
                🌱 <span className="hidden sm:inline">Semear</span>
              </span>
            )}
            {isHarvestNow && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-white/95 text-orange-600 shadow-xs flex items-center gap-0.5">
                🧺 <span className="hidden sm:inline">Colher</span>
              </span>
            )}
          </div>

          {plant.difficulty && (
            <span className="absolute top-1.5 right-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-black/45 text-white backdrop-blur-xs">
              {plant.difficulty}
            </span>
          )}
        </div>

        <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-bold text-stone-800 text-xs sm:text-sm leading-tight truncate group-hover:text-emerald-700 transition-colors">
              {plant.name}
            </h3>
            <span
              className="inline-block text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1 truncate max-w-full"
              style={{ backgroundColor: color + "1a", color }}
            >
              {plant.category}
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group relative text-left rounded-3xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-[0.99] w-full"
    >
      {/* Top color band */}
      <div
        className="h-2"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88, ${color})` }}
      />

      {/* Header: photo or colored gradient with emoji */}
      <div
        className={`relative flex items-center justify-center overflow-hidden ${plant.image_url ? "h-32" : "py-8"}`}
        style={plant.image_url ? undefined : { background: `linear-gradient(160deg, ${color}, ${color}cc)` }}
      >
        {plant.image_url ? (
          <Image src={plant.image_url} fittingType="fill" alt={plant.name} className="absolute inset-0 w-full h-full block" />
        ) : (
          <div className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
            {plant.emoji}
          </div>
        )}

        {/* Status badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isSowNow && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 text-green-700 flex items-center gap-1 shadow-sm">
              <Sprout className="w-3.5 h-3.5" /> Semear
            </span>
          )}
          {isHarvestNow && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/90 text-orange-600 shadow-sm">
              🧺 Colher
            </span>
          )}
        </div>

        {/* Difficulty dot */}
        <div className="absolute top-3 right-3">
          <span
            className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white/90 text-stone-600 shadow-sm"
          >
            {plant.difficulty}
          </span>
        </div>
      </div>

      {/* White info section */}
      <div className="bg-white px-4 py-4 space-y-3">
        <div>
          <h3 className="font-bold text-stone-800 text-lg leading-tight">{plant.name}</h3>
          <span
            className="inline-block text-xs font-medium px-2.5 py-0.5 rounded-full mt-1"
            style={{ backgroundColor: color + "1a", color }}
          >
            {plant.category}
          </span>
        </div>

        {/* Month info row */}
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-base shrink-0">🌱</span>
            <span className="text-stone-400 w-14 shrink-0">Sementeira</span>
            <span className="font-semibold text-stone-700 truncate">{shortMonths(plant.sow_months)}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-base shrink-0">🧺</span>
            <span className="text-stone-400 w-14 shrink-0">Colheita</span>
            <span className="font-semibold text-stone-700 truncate">{shortMonths(plant.harvest_months)}</span>
          </div>
        </div>

        {/* Requirements footer */}
        <div className="flex items-center gap-3 pt-2 border-t border-emerald-50/60">
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <Sun className="w-3.5 h-3.5" />
            <span className="truncate">{plant.sun_requirements}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <Droplets className="w-3.5 h-3.5" />
            <span className="truncate">{plant.water_requirements}</span>
          </div>
        </div>
      </div>
    </button>
  );
}