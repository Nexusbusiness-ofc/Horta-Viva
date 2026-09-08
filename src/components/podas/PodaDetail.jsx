import React from "react";
import { Image } from "@/components/ui/image";
import { Scissors, Calendar, Wrench, Lightbulb, Trees } from "lucide-react";

const MONTH_NAMES = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

function monthList(months) { return (months || []).map(m => MONTH_NAMES[m]).join(", "); }

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

export default function PodaDetail({ poda, onClose }) {
  if (!poda) return null;
  const color = poda.color || "#16a34a";
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-white to-emerald-50/20 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90dvh] overflow-y-auto overscroll-contain shadow-2xl"
        style={{ WebkitOverflowScrolling: "touch" }}
        onClick={e => e.stopPropagation()}
      >
        {poda.image_url && (
          <div className="relative w-full h-44 sm:h-56 overflow-hidden">
            <Image src={poda.image_url} fittingType="fill" alt={`Poda de ${poda.name}`} className="w-full h-full block" focalPointY={0.4} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <span className="absolute bottom-3 left-4 text-4xl drop-shadow-lg">{poda.emoji}</span>
          </div>
        )}
        <div className="relative px-6 pt-8 pb-6" style={{ background: `linear-gradient(135deg, ${color}28, ${color}08)` }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 shadow-sm">✕</button>
          {!poda.image_url && <div className="text-6xl mb-2">{poda.emoji}</div>}
          <h2 className="text-2xl font-bold text-stone-800">{poda.name}</h2>
          <span className="inline-block mt-1 text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: color + "22", color }}>{poda.category}</span>
          <div className="flex flex-wrap gap-2 mt-4">
            <div className="flex items-center gap-1.5 bg-white/70 rounded-lg px-2.5 py-1">
              <Scissors className="w-3.5 h-3.5" style={{ color }} />
              <span className="text-xs font-medium text-stone-600">Dificuldade: {poda.difficulty}</span>
            </div>
          </div>
        </div>
        <div className="px-6 py-6 space-y-5">
          {poda.when_months?.length > 0 && (
            <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-emerald-600" /></div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Meses de poda</p>
                <p className="text-sm font-semibold text-stone-700">{monthList(poda.when_months)}</p>
              </div>
            </div>
          )}
          {poda.when_info && <Section icon={Calendar} title="Quando podar" color="#0891b2">{poda.when_info}</Section>}
          {poda.pruning_types && <Section icon={Trees} title="Tipos de poda" color="#16a34a">{poda.pruning_types}</Section>}
          {poda.how && <Section icon={Scissors} title="Como podar" color={color}>{poda.how}</Section>}
          {poda.tools && <Section icon={Wrench} title="Ferramentas" color="#7c3aed">{poda.tools}</Section>}
          {poda.tips && <Section icon={Lightbulb} title="Dicas e cuidados" color="#d97706">{poda.tips}</Section>}
        </div>
      </div>
    </div>
  );
}