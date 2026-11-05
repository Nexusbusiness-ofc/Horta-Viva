import { useI18n } from "@/lib/I18nContext";
import React from "react";
import { resolveAssetUrl } from "@/lib/utils";
import { ChevronRight } from "lucide-react";

const DIFFICULTY_STYLES = {
  "Fácil": { bg: "#dcfce7", fg: "#15803d" },
  "Média": { bg: "#fef3c7", fg: "#b45309" },
  "Difícil": { bg: "#fee2e2", fg: "#b91c1c" }
};

const EFFORT_STYLES = {
  "Baixo": "🟢",
  "Médio": "🟡",
  "Alto": "🔴"
};

export default function AnimalCard({
  animal,
  onClick,
  compact = false
}) {
  const {
    t: i18nT
  } = useI18n();
  const [imageFailed, setImageFailed] = React.useState(false);
  const diff = DIFFICULTY_STYLES[animal.difficulty] || DIFFICULTY_STYLES["Fácil"];
  const effort = EFFORT_STYLES[animal.daily_effort] || "🟡";

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="group relative text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all flex flex-col w-full"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-stone-50 shrink-0">
          {animal.image_url && !imageFailed ? (
            <>
              <img
                src={resolveAssetUrl(animal.image_url)}
                alt={i18nT(animal.name)}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageFailed(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center gap-1.5">
                <span className="text-base drop-shadow">{animal.emoji || i18nT("🐔")}</span>
                <span className="font-bold text-white text-xs sm:text-sm truncate drop-shadow">
                  {i18nT(animal.name)}
                </span>
              </div>
            </>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-2"
              style={{
                background: `linear-gradient(135deg, ${animal.color || "#c2410c"}25, ${animal.color || "#c2410c"}08)`
              }}
            >
              <span className="text-4xl drop-shadow-xs">{animal.emoji || i18nT("🐔")}</span>
              <span className="font-bold text-stone-800 text-xs sm:text-sm text-center truncate mt-1">
                {i18nT(animal.name)}
              </span>
            </div>
          )}

          <span
            className="absolute top-1.5 right-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-xs"
            style={{ backgroundColor: diff.bg, color: diff.fg }}
          >
            {i18nT(animal.difficulty)}
          </span>
        </div>

        <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1 text-[10px] text-stone-500">
          <span className="bg-stone-100 px-1.5 py-0.5 rounded-full truncate font-semibold">
            {i18nT(animal.category)}
          </span>
          <span title={i18nT("Esforço diário")}>{i18nT(effort)}</span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-300/80 hover:-translate-y-1 transition-all flex flex-col w-full"
    >
      {animal.image_url && !imageFailed ? (
        <div className="relative h-36 w-full overflow-hidden shrink-0">
          <img
            src={resolveAssetUrl(animal.image_url)}
            alt={i18nT(animal.name)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute top-2.5 right-2.5">
            <span
              className="text-[10px] font-extrabold rounded-full px-2.5 py-1 shadow-xs"
              style={{ backgroundColor: diff.bg, color: diff.fg }}
            >
              {i18nT(animal.difficulty)}
            </span>
          </div>
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2">
            <span className="text-2xl drop-shadow">{animal.emoji || i18nT("🐔")}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-white text-base leading-tight truncate drop-shadow">
                {i18nT(animal.name)}
              </h3>
              <p className="text-[11px] text-white/85 italic truncate">
                {animal.scientific_name || i18nT("")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative px-4 pt-4 pb-3 flex items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${animal.color || "#c2410c"}22, ${animal.color || "#c2410c"}08)`
          }}
        >
          <div className="text-4xl">{animal.emoji || i18nT("🐔")}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-stone-800 text-base leading-tight truncate">
              {i18nT(animal.name)}
            </h3>
            <p className="text-xs text-stone-500 italic truncate">
              {animal.scientific_name || i18nT("")}
            </p>
          </div>
        </div>
      )}

      <div className="px-4 py-3.5 flex-1 flex flex-col justify-between space-y-2.5 w-full bg-gradient-to-b from-white to-orange-50/20">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold text-orange-800 bg-orange-50 border border-orange-200/70 rounded-full px-2.5 py-0.5">
              {i18nT(animal.category)}
            </span>
          </div>
          {animal.what_they_do && (
            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
              {i18nT(animal.what_they_do)}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
          <span className="text-[10px] font-semibold text-stone-500">{i18nT("Esforço")}</span>
          <span className="text-xs">{i18nT(effort)}</span>
          {animal.space_needed && (
            <span className="text-[10px] font-medium text-stone-500 ml-auto truncate">
              📐 {i18nT(animal.space_needed.split(".")[0])}
            </span>
          )}
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-orange-600 shrink-0 transition-colors" />
        </div>
      </div>
    </button>
  );
}
