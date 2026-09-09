import React from "react";
import { MapPin, Calendar, Scissors, Package, AlertTriangle, Leaf } from "lucide-react";
import { resolveAssetUrl } from "@/lib/utils";

const EDIBILITY_STYLES = {
  "Comestível": { bg: "#dcfce7", fg: "#16a34a" },
  "Comestível com precaução": { bg: "#fef3c7", fg: "#d97706" },
  "Tóxico": { bg: "#ffedd5", fg: "#ea580c" },
  "Mortal": { bg: "#fee2e2", fg: "#dc2626" },
};

const MONTH_NAMES = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function Section({ icon: Icon, title, children, color }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "22" }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <p className="text-stone-600 text-sm leading-relaxed pl-9">{children}</p>
    </div>
  );
}

export default function MushroomDetail({ mushroom, onClose }) {
  if (!mushroom) return null;
  const [imageFailed, setImageFailed] = React.useState(false);
  const ed = EDIBILITY_STYLES[mushroom.edibility] || EDIBILITY_STYLES["Comestível"];
  const isDanger = mushroom.edibility === "Tóxico" || mushroom.edibility === "Mortal";
  const months = (mushroom.season_months || []).map(m => MONTH_NAMES[m]).join(" · ");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-amber-50/20 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative px-6 pt-8 pb-5"
          style={{ background: `linear-gradient(135deg, ${mushroom.color || "#a16207"}28, ${mushroom.color || "#a16207"}08)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 transition-colors shadow-sm"
          >
            ✕
          </button>
          {mushroom.image_url && !imageFailed ? (
            <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3">
              <img
                src={resolveAssetUrl(mushroom.image_url)}
                alt={mushroom.name}
                className="w-full h-full object-cover"
                onError={() => setImageFailed(true)}
              />
            </div>
          ) : (
            <div className="text-6xl mb-2">{mushroom.emoji || "🍄"}</div>
          )}
          <h2 className="text-2xl font-bold text-stone-800">{mushroom.name}</h2>
          {mushroom.scientific_name && (
            <p className="text-sm text-stone-500 italic mt-0.5">{mushroom.scientific_name}</p>
          )}
          {mushroom.common_names && (
            <p className="text-sm text-stone-600 mt-1">
              <span className="text-stone-500 font-medium">Nomes comuns:</span> {mushroom.common_names}
            </p>
          )}
          <span
            className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ backgroundColor: ed.bg, color: ed.fg }}
          >
            {mushroom.edibility}
          </span>
        </div>

        {/* Aviso de perigo */}
        {isDanger && (
          <div className="mx-6 mt-4 rounded-xl bg-red-50 border border-red-200 p-3">
            <p className="text-xs text-red-700 leading-relaxed flex items-start gap-1.5 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {mushroom.edibility === "Mortal"
                  ? "⚠️ COGUMELO MORTAL. A ingestão pode ser fatal. Nunca o colha nem consuma. Aprenda a reconhecer para evitar a confusão."
                  : "⚠️ Cogumelo tóxico. Pode provocar intoxicações graves. Não consumir."}
              </span>
            </p>
          </div>
        )}

        {/* Conteúdo */}
        <div className="px-6 py-5 space-y-4">
          {mushroom.description && (
            <Section icon={Leaf} title="Descrição" color="#16a34a">{mushroom.description}</Section>
          )}
          {months && (
            <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Época</p>
                <p className="text-sm font-semibold text-stone-700">{months}</p>
              </div>
            </div>
          )}
          {mushroom.habitat && (
            <Section icon={MapPin} title="Habitat" color="#0891b2">{mushroom.habitat}</Section>
          )}
          {mushroom.where_to_find && (
            <Section icon={MapPin} title="Onde encontrar" color="#0ea5e9">{mushroom.where_to_find}</Section>
          )}
          {mushroom.how_to_pick && (
            <Section icon={Scissors} title="Como apanhar" color="#d97706">{mushroom.how_to_pick}</Section>
          )}
          {mushroom.how_to_store && (
            <Section icon={Package} title="Como armazenar" color="#7c3aed">{mushroom.how_to_store}</Section>
          )}
          {mushroom.lookalikes && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs text-amber-700 leading-relaxed flex items-start gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span><b>Atenção — espécies parecidas:</b> {mushroom.lookalikes}</span>
              </p>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <div className="px-6 pb-6">
          <p className="text-[11px] text-stone-400 leading-relaxed text-center">
            ⚠️ Esta informação é apenas educativa. Nunca consuma um cogumelo sem identificação confirmada por um especialista (micólogo).
          </p>
        </div>
      </div>
    </div>
  );
}