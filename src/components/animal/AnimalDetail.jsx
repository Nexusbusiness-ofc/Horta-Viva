import React from "react";
import { Home, Heart, Sprout, Stethoscope, Wheat, Lightbulb, Ruler, Clock, Package, Info } from "lucide-react";

const DIFFICULTY_STYLES = {
  "Fácil": { bg: "#dcfce7", fg: "#16a34a" },
  "Média": { bg: "#fef3c7", fg: "#d97706" },
  "Difícil": { bg: "#fee2e2", fg: "#dc2626" },
};

const EFFORT_STYLES = {
  "Baixo": { bg: "#dcfce7", fg: "#16a34a", emoji: "🟢" },
  "Médio": { bg: "#fef3c7", fg: "#d97706", emoji: "🟡" },
  "Alto": { bg: "#fee2e2", fg: "#dc2626", emoji: "🔴" },
};

function Section({ icon: Icon, title, children, color }) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "22" }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide">{title}</h3>
      </div>
      <p className="text-stone-600 text-sm leading-relaxed pl-9 whitespace-pre-line">{children}</p>
    </div>
  );
}

export default function AnimalDetail({ animal, onClose }) {
  if (!animal) return null;
  const diff = DIFFICULTY_STYLES[animal.difficulty] || DIFFICULTY_STYLES["Fácil"];
  const effort = EFFORT_STYLES[animal.daily_effort] || EFFORT_STYLES["Médio"];
  const color = animal.color || "#c2410c";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-orange-50/20 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="relative px-6 pt-8 pb-5"
          style={{ background: `linear-gradient(135deg, ${color}28, ${color}08)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 transition-colors shadow-sm"
          >
            ✕
          </button>
          {animal.image_url ? (
            <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-3">
              <img src={animal.image_url} alt={animal.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="text-6xl mb-2">{animal.emoji || "🐔"}</div>
          )}
          <h2 className="text-2xl font-bold text-stone-800">{animal.name}</h2>
          {animal.scientific_name && (
            <p className="text-sm text-stone-500 italic mt-0.5">{animal.scientific_name}</p>
          )}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs font-medium text-stone-500 bg-white/70 rounded-full px-2.5 py-1">{animal.category}</span>
            <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{ backgroundColor: diff.bg, color: diff.fg }}>
              {animal.difficulty}
            </span>
            <span className="text-xs font-semibold rounded-full px-2.5 py-1" style={{ backgroundColor: effort.bg, color: effort.fg }}>
              Esforço {effort.emoji} {animal.daily_effort}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="px-6 py-5 space-y-5">
          {/* Resumo rápido */}
          <div className="grid grid-cols-2 gap-2">
            {animal.space_needed && (
              <div className="bg-stone-50 rounded-xl p-3 flex items-start gap-2">
                <Ruler className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-stone-500 font-medium">Espaço</p>
                  <p className="text-sm font-semibold text-stone-700">{animal.space_needed}</p>
                </div>
              </div>
            )}
            <div className="bg-stone-50 rounded-xl p-3 flex items-start gap-2">
              <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-stone-500 font-medium">Esforço diário</p>
                <p className="text-sm font-semibold text-stone-700">{animal.daily_effort}</p>
              </div>
            </div>
          </div>

          {animal.where_to_keep && (
            <Section icon={Home} title="Onde ter (instalações)" color="#ea580c">{animal.where_to_keep}</Section>
          )}
          {animal.how_to_keep && (
            <Section icon={Info} title="Como ter" color="#0891b2">{animal.how_to_keep}</Section>
          )}
          {animal.care && (
            <Section icon={Heart} title="Cuidados a ter" color="#db2777">{animal.care}</Section>
          )}
          {animal.feeding && (
            <Section icon={Sprout} title="Como alimentar" color="#16a34a">{animal.feeding}</Section>
          )}
          {animal.feed_items && (
            <div className="rounded-xl bg-green-50/60 border border-green-100 p-3 space-y-1.5">
              <p className="text-xs font-semibold text-green-700 flex items-center gap-1.5">
                <Wheat className="w-4 h-4" /> Alimentos recomendados
              </p>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{animal.feed_items}</p>
            </div>
          )}
          {animal.treatment && (
            <Section icon={Stethoscope} title="Saúde e tratamentos" color="#dc2626">{animal.treatment}</Section>
          )}
          {animal.what_they_do && (
            <Section icon={Package} title="O que produzem / utilidade" color="#7c3aed">{animal.what_they_do}</Section>
          )}
          {animal.special_info && (
            <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
              <p className="text-xs font-semibold text-amber-700 flex items-center gap-1.5 mb-1">
                <Lightbulb className="w-4 h-4" /> Curiosidades
              </p>
              <p className="text-sm text-stone-600 leading-relaxed whitespace-pre-line">{animal.special_info}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}