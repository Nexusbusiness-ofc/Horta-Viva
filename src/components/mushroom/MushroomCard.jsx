import { useI18n } from "@/lib/I18nContext";
import React from "react";
import { resolveAssetUrl } from "@/lib/utils";
import Emoji3D from "@/components/ui/Emoji3D";
import { ChevronRight } from "lucide-react";

const EDIBILITY_STYLES = {
  "Comestível": {
    bg: "#dcfce7",
    fg: "#15803d",
    dot: "#22c55e"
  },
  "Comestível com precaução": {
    bg: "#fef3c7",
    fg: "#b45309",
    dot: "#f59e0b"
  },
  "Tóxico": {
    bg: "#ffedd5",
    fg: "#c2410c",
    dot: "#f97316"
  },
  "Mortal": {
    bg: "#fee2e2",
    fg: "#b91c1c",
    dot: "#ef4444"
  }
};

const MONTH_SHORT = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function MushroomCard({
  mushroom,
  onClick,
  compact = false
}) {
  const {
    t: i18nT
  } = useI18n();
  const [imageFailed, setImageFailed] = React.useState(false);
  const ed = EDIBILITY_STYLES[mushroom.edibility] || EDIBILITY_STYLES["Comestível"];
  const months = (mushroom.season_months || []).map(m => MONTH_SHORT[m]).join(" · ");

  if (compact) {
    return (
      <button
        onClick={onClick}
        className="group relative text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] transition-all flex flex-col w-full"
      >
        <div className="relative aspect-square w-full overflow-hidden bg-stone-50 shrink-0">
          {mushroom.image_url && !imageFailed ? (
            <>
              <img
                src={resolveAssetUrl(mushroom.image_url)}
                alt={i18nT(mushroom.name)}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={() => setImageFailed(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-1.5 left-2 right-2 flex items-center gap-1.5">
                <Emoji3D item={mushroom} size="sm" badge />
                <span className="font-bold text-white text-xs sm:text-sm truncate drop-shadow">
                  {i18nT(mushroom.name)}
                </span>
              </div>
            </>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center p-2"
              style={{
                background: `linear-gradient(135deg, ${mushroom.color || "#a16207"}25, ${mushroom.color || "#a16207"}08)`
              }}
            >
              <Emoji3D item={mushroom} size="xl" />
              <span className="font-bold text-stone-800 text-xs sm:text-sm text-center truncate mt-1">
                {i18nT(mushroom.name)}
              </span>
            </div>
          )}
        </div>

        <div className="p-2 sm:p-2.5 flex items-center justify-between gap-1">
          <span
            className="inline-flex items-center gap-1 text-[10px] font-bold rounded-full px-1.5 py-0.5 truncate max-w-full"
            style={{ backgroundColor: ed.bg, color: ed.fg }}
          >
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: ed.dot }} />
            <span className="truncate">{i18nT(mushroom.edibility)}</span>
          </span>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group text-left bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-amber-300/80 hover:-translate-y-1 transition-all flex flex-col w-full"
    >
      {mushroom.image_url && !imageFailed ? (
        <div className="relative h-36 w-full overflow-hidden shrink-0">
          <img
            src={resolveAssetUrl(mushroom.image_url)}
            alt={i18nT(mushroom.name)}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-2.5 left-3 right-3 flex items-center gap-2">
            <Emoji3D item={mushroom} size="md" badge />
            <div className="flex-1 min-w-0">
              <h3 className="font-extrabold text-white text-base leading-tight truncate drop-shadow">
                {i18nT(mushroom.name)}
              </h3>
              <p className="text-[11px] text-white/85 italic truncate">
                {mushroom.scientific_name || i18nT("")}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative px-4 pt-4 pb-3 flex items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${mushroom.color || "#a16207"}22, ${mushroom.color || "#a16207"}08)`
          }}
        >
          <Emoji3D item={mushroom} size="xl" badge />
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-stone-800 text-base leading-tight truncate">
              {i18nT(mushroom.name)}
            </h3>
            <p className="text-xs text-stone-500 italic truncate">
              {mushroom.scientific_name || i18nT("")}
            </p>
          </div>
        </div>
      )}

      <div className="px-4 py-3.5 flex-1 flex flex-col justify-between space-y-2.5 w-full bg-gradient-to-b from-white to-amber-50/20">
        <div className="space-y-1.5">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-extrabold rounded-full px-2.5 py-1"
            style={{ backgroundColor: ed.bg, color: ed.fg }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: ed.dot }} />
            {i18nT(mushroom.edibility)}
          </span>
          {mushroom.common_names && (
            <p className="text-xs text-stone-600 truncate">🏷️ {i18nT(mushroom.common_names)}</p>
          )}
          {mushroom.habitat && (
            <p className="text-xs text-stone-500 truncate">📍 {i18nT(mushroom.habitat)}</p>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-100">
          <span className="text-[11px] font-semibold text-amber-800 truncate">
            {months ? `📅 ${i18nT(months)}` : ""}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 shrink-0 transition-colors" />
        </div>
      </div>
    </button>
  );
}
