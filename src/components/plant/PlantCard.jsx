import { getLocalMonth } from '@/lib/regionalClimate';
import { readRegionalPreferences } from '@/lib/regionalPreferences';
import { useI18n } from "@/lib/I18nContext";
import { translatedMonth } from "@/lib/i18n";
import React from "react";
import { Sprout, Sun, Droplets, ChevronRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import Emoji3D from "@/components/ui/Emoji3D";

const MONTH_SHORT = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function shortMonths(months, language, max = 5) {
  if (!months || months.length === 0) return "—";
  const labels = months.map(m => {
    const raw = translatedMonth(m - 1, language, 'short').replace(/\.$/, "");
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  });
  return labels.length > max ? labels.slice(0, max).join(" · ") + " …" : labels.join(" · ");
}

export default function PlantCard({
  plant,
  onClick,
  compact = false
}) {
  const {
    t: i18nT,
    language
  } = useI18n();
  const color = plant.color || "#16a34a";
  const currentMonth = getLocalMonth(new Date(), readRegionalPreferences());
  const sowMonths = plant.sow_months || [];
  const harvestMonths = plant.harvest_months || [];
  const isSowNow = sowMonths.includes(currentMonth);
  const isHarvestNow = harvestMonths.includes(currentMonth);

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="group relative text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-0.5 active:scale-[0.98] transition-all flex flex-col w-full"
      >
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: color }} />
        <div className="relative aspect-square w-full overflow-hidden bg-stone-50 shrink-0">
          {plant.image_url ? (
            <Image
              src={plant.image_url}
              fittingType="fill"
              alt={i18nT(plant.name)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${color}25, ${color}08)` }}
            >
              <Emoji3D item={plant} size="xl" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

          {/* Badges pequenos */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {isSowNow && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-xs flex items-center gap-0.5">
                🌱 <span className="hidden sm:inline">{i18nT("Semear")}</span>
              </span>
            )}
            {isHarvestNow && (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-0.5">
                🧺 <span className="hidden sm:inline">{i18nT("Colher")}</span>
              </span>
            )}
          </div>

          {plant.difficulty && (
            <span className="absolute top-1.5 right-1.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-xs">
              {i18nT(plant.difficulty)}
            </span>
          )}

          {/* Emoji 3D representativo sobre a imagem */}
          <div className="absolute bottom-1.5 right-1.5">
            <Emoji3D item={plant} size="sm" badge />
          </div>
        </div>

        <div className="p-2.5 flex-1 flex flex-col justify-between min-w-0">
          <div>
            <h3 className="font-extrabold text-stone-800 text-xs sm:text-sm leading-tight truncate group-hover:text-emerald-700 transition-colors">
              {i18nT(plant.name)}
            </h3>
            <span
              className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 truncate max-w-full"
              style={{ backgroundColor: color + "1a", color }}
            >
              {i18nT(plant.category)}
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group relative text-left bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300/80 hover:-translate-y-1 transition-all duration-300 active:scale-[0.99] flex flex-col w-full"
    >
      {/* Topo com Imagem */}
      <div
        className={`relative flex items-center justify-center overflow-hidden w-full shrink-0 ${
          plant.image_url ? "h-36" : "py-8"
        }`}
        style={
          plant.image_url
            ? undefined
            : { background: `linear-gradient(160deg, ${color}, ${color}cc)` }
        }
      >
        {plant.image_url ? (
          <Image
            src={plant.image_url}
            fittingType="fill"
            alt={i18nT(plant.name)}
            className="absolute inset-0 w-full h-full block group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="transition-transform duration-300 group-hover:scale-110">
            <Emoji3D item={plant} size="2xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

        {/* Badges de época */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {isSowNow && (
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-600/95 text-white flex items-center gap-1 shadow-sm backdrop-blur-xs">
              <Sprout className="w-3 h-3" />
              {i18nT(" Semear")}
            </span>
          )}
          {isHarvestNow && (
            <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500/95 text-white shadow-sm backdrop-blur-xs">
              {i18nT("🧺 Colher")}
            </span>
          )}
        </div>

        {/* Dificuldade */}
        {plant.difficulty && (
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-black/50 text-white border border-white/15 backdrop-blur-xs shadow-xs">
              {i18nT(plant.difficulty)}
            </span>
          </div>
        )}

        {/* Título, Categoria e Emoji 3D sobre a imagem */}
        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <span
              className="inline-block text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 shadow-2xs"
              style={{ backgroundColor: color, color: "#fff" }}
            >
              {i18nT(plant.category)}
            </span>
            <h3 className="font-extrabold text-white text-lg leading-tight truncate drop-shadow-sm">
              {i18nT(plant.name)}
            </h3>
          </div>
          <Emoji3D item={plant} size="md" badge />
        </div>
      </div>

      {/* Secção de Calendário & Requisitos */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-white to-stone-50/40 w-full">
        <div className="space-y-2">
          {/* Linha de Sementeira */}
          <div className="bg-emerald-50/60 border border-emerald-100 rounded-2xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                <span>🌱</span>
                <span>{i18nT("Sementeira")}</span>
              </span>
              <span className="font-bold text-emerald-700 text-[11px] truncate">
                {shortMonths(sowMonths, language)}
              </span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const active = sowMonths.includes(m);
                const isNow = m === currentMonth;
                return (
                  <span
                    key={m}
                    className={`flex-1 text-center text-[8px] leading-none rounded-xs py-1 font-extrabold ${
                      active ? "bg-emerald-600 text-white" : "bg-white/80 text-stone-300"
                    } ${isNow ? "ring-1 ring-stone-900" : ""}`}
                  >
                    {i18nT(MONTH_SHORT[m])}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Linha de Colheita */}
          <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="font-extrabold text-amber-900 flex items-center gap-1">
                <span>🧺</span>
                <span>{i18nT("Colheita")}</span>
              </span>
              <span className="font-bold text-amber-700 text-[11px] truncate">
                {shortMonths(harvestMonths, language)}
              </span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const active = harvestMonths.includes(m);
                const isNow = m === currentMonth;
                return (
                  <span
                    key={m}
                    className={`flex-1 text-center text-[8px] leading-none rounded-xs py-1 font-extrabold ${
                      active ? "bg-amber-500 text-white" : "bg-white/80 text-stone-300"
                    } ${isNow ? "ring-1 ring-stone-900" : ""}`}
                  >
                    {i18nT(MONTH_SHORT[m])}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé com Sol, Rega e Seta */}
        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/60 truncate">
              <Sun className="w-3 h-3 text-amber-500 shrink-0" />
              <span className="truncate">{i18nT(plant.sun_requirements)}</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-200/60 truncate">
              <Droplets className="w-3 h-3 text-sky-500 shrink-0" />
              <span className="truncate">{i18nT(plant.water_requirements)}</span>
            </span>
          </div>
          <div className="w-6 h-6 rounded-full bg-stone-100 group-hover:bg-emerald-600 text-stone-500 group-hover:text-white flex items-center justify-center transition-colors shrink-0">
            <ChevronRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </button>
  );
}
