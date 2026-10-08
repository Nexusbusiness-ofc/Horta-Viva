import { useI18n } from "@/lib/I18nContext";
import React from "react";
import { Home, Heart, Sprout, Stethoscope, Wheat, Lightbulb, Ruler, Clock, Package, Info } from "lucide-react";
import { resolveAssetUrl } from "@/lib/utils";
const DIFFICULTY_STYLES = {
  "Fácil": {
    bg: "#dcfce7",
    fg: "#16a34a"
  },
  "Média": {
    bg: "#fef3c7",
    fg: "#d97706"
  },
  "Difícil": {
    bg: "#fee2e2",
    fg: "#dc2626"
  }
};
const EFFORT_STYLES = {
  "Baixo": {
    bg: "#dcfce7",
    fg: "#16a34a",
    emoji: "🟢"
  },
  "Médio": {
    bg: "#fef3c7",
    fg: "#d97706",
    emoji: "🟡"
  },
  "Alto": {
    bg: "#fee2e2",
    fg: "#dc2626",
    emoji: "🔴"
  }
};
function Section({
  icon: Icon,
  title,
  children,
  color
}) {
  const {
    t: i18nT
  } = useI18n();
  return <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
        backgroundColor: color + "22"
      }}>
          <Icon className="w-4 h-4" style={{
          color
        }} />
        </div>
        <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide">{i18nT(title)}</h3>
      </div>
      <p className="text-stone-600 text-sm leading-relaxed pl-9 whitespace-pre-line">{i18nT(children)}</p>
    </div>;
}
export default function AnimalDetail({
  animal,
  onClose
}) {
  const {
    t: i18nT
  } = useI18n();
  const [imageFailed, setImageFailed] = React.useState(false);
  if (!animal) return null;
  const diff = DIFFICULTY_STYLES[animal.difficulty] || DIFFICULTY_STYLES["Fácil"];
  const effort = EFFORT_STYLES[animal.daily_effort] || EFFORT_STYLES["Médio"];
  const color = animal.color || "#c2410c";
  return <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-gradient-to-br from-white to-orange-50/20 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="relative px-6 pt-8 pb-5" style={{
        background: `linear-gradient(135deg, ${color}28, ${color}08)`
      }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 transition-colors shadow-sm">
            ✕
          </button>
          {animal.image_url && !imageFailed ? <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3">
              <img src={resolveAssetUrl(animal.image_url)} alt={i18nT(animal.name)} className="w-full h-full object-cover" onError={() => setImageFailed(true)} />
            </div> : <div className="text-6xl mb-2">{animal.emoji || i18nT("🐔")}</div>}
          <h2 className="text-2xl font-bold text-stone-800">{i18nT(animal.name)}</h2>
          {animal.scientific_name && <p className="text-sm text-stone-500 italic mt-0.5">{i18nT(animal.scientific_name)}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs font-medium text-stone-500 bg-white/70 rounded-full px-2.5 py-1">{i18nT(animal.category)}</span>
            <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{
            backgroundColor: diff.bg,
            color: diff.fg
          }}>
              {i18nT(animal.difficulty)}
            </span>
            <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{
            backgroundColor: effort.bg,
            color: effort.fg
          }}>{i18nT("Esforço ")}{i18nT(effort.emoji)} {i18nT(animal.daily_effort)}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-5 space-y-5">
          {/* Resumo rápido */}
          <div className="grid grid-cols-2 gap-2">
            {animal.space_needed && <div className="bg-stone-50 rounded-xl p-3 flex items-start gap-2">
                <Ruler className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-stone-500 font-medium">{i18nT("Espaço")}</p>
                  <p className="text-sm font-semibold text-stone-700">{i18nT(animal.space_needed)}</p>
                </div>
              </div>}
            <div className="bg-stone-50 rounded-xl p-3 flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-stone-500 font-medium">{i18nT("Esforço diário")}</p>
                <p className="text-sm font-semibold text-stone-700">{i18nT(animal.daily_effort)}</p>
              </div>
            </div>
          </div>

          {animal.where_to_keep && <Section icon={Home} title={i18nT("Onde ter (instalações)")} color="#ea580c">{i18nT(animal.where_to_keep)}</Section>}
          {animal.how_to_keep && <Section icon={Info} title={i18nT("Como ter")} color="#0891b2">{i18nT(animal.how_to_keep)}</Section>}
          {animal.care && <Section icon={Heart} title={i18nT("Cuidados a ter")} color="#db2777">{i18nT(animal.care)}</Section>}
          {animal.feeding && <Section icon={Sprout} title={i18nT("Como alimentar")} color="#16a34a">{i18nT(animal.feeding)}</Section>}
          {animal.feed_items && <div className="rounded-xl bg-green-50/60 border border-green-100 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
                <Wheat className="w-4 h-4" />{i18nT(" Alimentos recomendados")}</p>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{i18nT(animal.feed_items)}</p>
            </div>}
          {animal.treatment && <Section icon={Stethoscope} title={i18nT("Saúde e tratamentos")} color="#dc2626">{i18nT(animal.treatment)}</Section>}
          {animal.what_they_do && <Section icon={Package} title={i18nT("O que produzem / utilidade")} color="#7c3aed">{i18nT(animal.what_they_do)}</Section>}
          {animal.special_info && <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4" />{i18nT(" Curiosidades")}</p>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{i18nT(animal.special_info)}</p>
            </div>}
        </div>
      </div>
    </div>;
}
