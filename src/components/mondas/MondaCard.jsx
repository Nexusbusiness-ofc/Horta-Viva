import { useI18n } from "@/lib/I18nContext";
import { translatedMonth } from "@/lib/i18n";
import React from "react";
import { Image } from "@/components/ui/image";
import Emoji3D from "@/components/ui/Emoji3D";
import { ChevronRight, CheckCircle2, Ruler } from "lucide-react";

const MONTH_SHORT = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export default function MondaCard({
  monda,
  onClick,
  compact = false
}) {
  const {
    t: i18nT,
    language
  } = useI18n();
  const color = monda.color || "#65a30d";
  const months = monda.when_months || [];
  const currentMonth = new Date().getMonth() + 1;
  const isNow = months.includes(currentMonth);
  const monthNames = months.map(m => {
    const raw = translatedMonth(m - 1, language, "short").replace(/\.$/, "");
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  });

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
              alt={i18nT("Monda de {v0}", { v0: monda.name })}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${color}25, ${color}08)` }}
            >
              <Emoji3D item={monda} size="xl" />
            </div>
          )}
          <div className="absolute top-1.5 left-1.5">
            <Emoji3D item={monda} size="sm" badge />
          </div>
        </div>

        <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between min-w-0">
          <h3 className="font-bold text-stone-800 text-xs sm:text-sm leading-tight truncate group-hover:text-emerald-700 transition-colors">
            {i18nT(monda.name)}
          </h3>
          <div className="flex items-center justify-between gap-1 mt-1 text-[10px]">
            <span
              className="font-medium px-1.5 py-0.5 rounded-full truncate"
              style={{ backgroundColor: color + "18", color }}
            >
              {i18nT(monda.category)}
            </span>
            <span className="text-lime-700 font-bold bg-lime-50 px-1.5 py-0.5 rounded-md border border-lime-200/60 flex items-center gap-0.5">
              {i18nT("📐 Esquema")}
            </span>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-lime-300/80 hover:-translate-y-1 transition-all active:scale-[0.99] flex flex-col w-full"
    >
      <div className="relative h-36 w-full overflow-hidden shrink-0">
        {monda.image_url ? (
          <Image
            src={monda.image_url}
            fittingType="fill"
            alt={i18nT("Monda de {v0}", { v0: monda.name })}
            className="w-full h-full block group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${color}22, ${color}06)` }}
          >
            <Emoji3D item={monda} size="2xl" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute top-2.5 left-3">
          <Emoji3D item={monda} size="md" badge />
        </div>
        <span className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-lime-800 shadow-sm flex items-center gap-1">
          <span>📐</span>
          <span>{i18nT("Esquema")}</span>
        </span>

        <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 shadow-2xs"
              style={{ backgroundColor: color, color: "#fff" }}
            >
              {i18nT(monda.category)}
            </span>
            <h3 className="font-extrabold text-white text-base leading-tight truncate drop-shadow-sm">
              {i18nT(monda.name)}
            </h3>
          </div>
          {isNow && (
            <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-lime-600 text-white shadow-xs">
              <CheckCircle2 className="w-2.5 h-2.5" />
              {i18nT("Em época")}
            </span>
          )}
        </div>
      </div>

      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-white to-stone-50/40 w-full">
        <div className="space-y-2.5">
          {monda.when_stage && (
            <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
              {i18nT(monda.when_stage)}
            </p>
          )}
          {monda.spacing && (
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-lime-900 bg-lime-50/90 border border-lime-200/70 rounded-xl px-2.5 py-1.5">
              <Ruler className="w-3.5 h-3.5 text-lime-700 shrink-0" />
              <span className="truncate">{i18nT(monda.spacing)}</span>
            </div>
          )}

          <div className="bg-stone-50 rounded-2xl p-2.5 border border-stone-200/70 space-y-1.5">
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="font-extrabold uppercase tracking-wider text-stone-500">
                {i18nT("Época")}
              </span>
              <span className="font-bold text-stone-700 truncate">
                {monthNames.join(" • ")}
              </span>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const active = months.includes(m);
                const cur = m === currentMonth;
                return (
                  <span
                    key={m}
                    className={`flex-1 text-center text-[9px] leading-none rounded-md py-1.5 font-extrabold ${
                      active ? "text-white shadow-2xs" : "text-stone-300 bg-white"
                    } ${cur ? "ring-1.5 ring-stone-900" : ""}`}
                    style={active ? { backgroundColor: color } : {}}
                  >
                    {i18nT(MONTH_SHORT[m])}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="w-full py-2 px-3 rounded-xl bg-stone-100 group-hover:bg-lime-50 text-stone-700 group-hover:text-lime-800 border border-stone-200/80 group-hover:border-lime-200 text-[11px] font-bold flex items-center justify-between transition-all">
          <span>{i18nT("Ver guia de desbaste & esquema")}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-lime-700 group-hover:translate-x-0.5 transition-all" />
        </div>
      </div>
    </button>
  );
}
