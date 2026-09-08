import React from "react";
import { Image } from "@/components/ui/image";
import { Calendar, Hand, Ruler, Lightbulb, Sprout } from "lucide-react";

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

export default function MondaDetail({ monda, onClose }) {
  if (!monda) return null;
  const color = monda.color || "#84cc16";
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-gradient-to-br from-white to-lime-50/20 w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[90dvh] overflow-y-auto overscroll-contain shadow-2xl"
        style={{ WebkitOverflowScrolling: "touch" }}
        onClick={e => e.stopPropagation()}
      >
        {monda.image_url && (
          <div className="relative w-full h-44 sm:h-56 overflow-hidden">
            <Image src={monda.image_url} fittingType="fill" alt={`Monda de ${monda.name}`} className="w-full h-full block" focalPointY={0.4} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            <span className="absolute bottom-3 left-4 text-4xl drop-shadow-lg">{monda.emoji}</span>
          </div>
        )}
        <div className="relative px-6 pt-8 pb-6" style={{ background: `linear-gradient(135deg, ${color}28, ${color}08)` }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 shadow-sm">✕</button>
          {!monda.image_url && <div className="text-6xl mb-2">{monda.emoji}</div>}
          <h2 className="text-2xl font-bold text-stone-800">{monda.name}</h2>
          <span className="inline-block mt-1 text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: color + "22", color }}>{monda.category}</span>
        </div>
        <div className="px-6 py-6 space-y-5">
          {monda.when_months?.length > 0 && (
            <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "22" }}>
                <Calendar className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <p className="text-xs text-stone-500 font-medium">Época típica</p>
                <p className="text-sm font-semibold text-stone-700">{monthList(monda.when_months)}</p>
              </div>
            </div>
          )}
          {monda.when_stage && <Section icon={Sprout} title="Quando fazer (fase)" color="#16a34a">{monda.when_stage}</Section>}
          {monda.when_info && <Section icon={Calendar} title="Quando fazer" color="#0891b2">{monda.when_info}</Section>}
          {monda.how && <Section icon={Hand} title="Como fazer a monda" color={color}>{monda.how}</Section>}
          {monda.spacing && <Section icon={Ruler} title="Espaçamento final" color="#7c3aed">{monda.spacing}</Section>}
          {monda.tips && <Section icon={Lightbulb} title="Dicas" color="#d97706">{monda.tips}</Section>}
        </div>
      </div>
    </div>
  );
}