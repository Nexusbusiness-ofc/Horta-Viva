import React from "react";
import { resolveAssetUrl } from "@/lib/utils";

const EDIBILITY_STYLES = {
  "Comestível": { bg: "#dcfce7", fg: "#16a34a", dot: "#22c55e" },
  "Comestível com precaução": { bg: "#fef3c7", fg: "#d97706", dot: "#f59e0b" },
  "Tóxico": { bg: "#ffedd5", fg: "#ea580c", dot: "#f97316" },
  "Mortal": { bg: "#fee2e2", fg: "#dc2626", dot: "#ef4444" },
};

const MONTH_SHORT = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export default function MushroomCard({ mushroom, onClick }) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const ed = EDIBILITY_STYLES[mushroom.edibility] || EDIBILITY_STYLES["Comestível"];
  const months = (mushroom.season_months || []).map(m => MONTH_SHORT[m]).join(" · ");

  return (
    <button
      onClick={onClick}
      className="text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
    >
      {mushroom.image_url && !imageFailed ? (
        <div className="relative h-28 w-full overflow-hidden">
          <img
            src={resolveAssetUrl(mushroom.image_url)}
            alt={mushroom.name}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={() => setImageFailed(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-2 left-3 right-3 flex items-center gap-2">
            <span className="text-xl drop-shadow">{mushroom.emoji || "🍄"}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm leading-tight truncate drop-shadow">{mushroom.name}</h3>
              <p className="text-xs text-white/80 italic truncate">{mushroom.scientific_name || ""}</p>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="relative px-4 pt-4 pb-3 flex items-center gap-3"
          style={{ background: `linear-gradient(135deg, ${mushroom.color || "#a16207"}22, ${mushroom.color || "#a16207"}08)` }}
        >
          <div className="text-4xl">{mushroom.emoji || "🍄"}</div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-stone-800 text-sm leading-tight truncate">{mushroom.name}</h3>
            <p className="text-xs text-stone-500 italic truncate">{mushroom.scientific_name || ""}</p>
          </div>
        </div>
      )}
      <div className="px-4 py-3 space-y-2">
        <span
          className="inline-flex items-center gap-1.5 text-xs font-semibold rounded-full px-2.5 py-1"
          style={{ backgroundColor: ed.bg, color: ed.fg }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: ed.dot }} />
          {mushroom.edibility}
        </span>
        {mushroom.common_names && (
          <p className="text-xs text-stone-500 truncate">🏷️ {mushroom.common_names}</p>
        )}
        {mushroom.habitat && (
          <p className="text-xs text-stone-500 truncate">📍 {mushroom.habitat}</p>
        )}
        {months && (
          <p className="text-xs text-stone-400 truncate">📅 {months}</p>
        )}
      </div>
    </button>
  );
}