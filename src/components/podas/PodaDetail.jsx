import { useI18n, CatalogLanguageNote } from "@/lib/I18nContext";
import { translatedMonth } from "@/lib/i18n";
import RegionalCalendarNotice from "@/components/regional/RegionalCalendarNotice";
import React, { useState } from "react";
import { Image } from "@/components/ui/image";
import { Scissors, Calendar, Wrench, Lightbulb, Trees, BookOpen, Layers } from "lucide-react";
import PodaSchemaViewer from "./PodaSchemaViewer";
function monthList(months, language) {
  return (months || []).map(m => translatedMonth(m - 1, language)).join(", ");
}
function Section({
  icon: Icon,
  title,
  children,
  color
}) {
  const {
    t: i18nT
  } = useI18n();
  return <div className="space-y-1.5 min-w-0">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{
        backgroundColor: color + "22"
      }}>
          <Icon className="w-4 h-4" style={{
          color
        }} />
        </div>
        <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide truncate">{i18nT(title)}</h3>
      </div>
      <p className="text-stone-600 text-sm leading-relaxed pl-9 whitespace-pre-line break-words">{i18nT(children)}</p>
    </div>;
}
export default function PodaDetail({
  poda,
  onClose
}) {
  const {
    t: i18nT,
    language
  } = useI18n();
  const [activeView, setActiveView] = useState("schema"); // 'schema' | 'details'

  if (!poda) return null;
  const color = poda.color || "#16a34a";
  return <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gradient-to-br from-white to-emerald-50/20 w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl flex flex-col" style={{
      WebkitOverflowScrolling: "touch"
    }} onClick={e => e.stopPropagation()}>
        {poda.image_url && <div className="relative w-full h-44 sm:h-52 shrink-0 overflow-hidden">
            <Image src={poda.image_url} fittingType="fill" alt={i18nT("Poda de {v0}", {
          v0: poda.name
        })} className="w-full h-full block" focalPointY={0.4} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <span className="absolute bottom-3 left-4 text-4xl drop-shadow-lg">{i18nT(poda.emoji)}</span>
          </div>}

        <div className="relative px-6 pt-6 pb-4 shrink-0" style={{
        background: `linear-gradient(135deg, ${color}22, ${color}08)`
      }}>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 shadow-sm transition-colors">✕</button>
          {!poda.image_url && <div className="text-6xl mb-2">{i18nT(poda.emoji)}</div>}
          <h2 className="text-2xl font-bold text-stone-800">{i18nT(poda.name)}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full" style={{
            backgroundColor: color + "22",
            color
          }}>
              {i18nT(poda.category)}
            </span>
            <div className="flex items-center gap-1 bg-white/80 rounded-full px-2.5 py-0.5 border border-stone-200/60">
              <Scissors className="w-3 h-3" style={{
              color
            }} />
              <span className="text-[11px] font-medium text-stone-600">{i18nT("Dificuldade: ")}{i18nT(poda.difficulty)}</span>
            </div>
          </div>

          {/* Abas Alternadoras de Vista */}
          <div className="flex gap-2 mt-4 bg-white/70 p-1 rounded-2xl border border-stone-200/70">
            <button onClick={() => setActiveView("schema")} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${activeView === "schema" ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-white/60"}`}>
              <Layers className="w-4 h-4" />
              <span>{i18nT("📐 Esquema Prático")}</span>
            </button>
            <button onClick={() => setActiveView("details")} className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${activeView === "details" ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm" : "text-stone-600 hover:text-stone-900 hover:bg-white/60"}`}>
              <BookOpen className="w-4 h-4" />
              <span>{i18nT("📋 Ficha Detalhada")}</span>
            </button>
          </div>
        </div>

        {/* Conteúdo Principal com Scroll */}
        <div className="px-5 sm:px-6 py-5 flex-1 space-y-5">
          <CatalogLanguageNote />
          <RegionalCalendarNotice item={poda} />
          {activeView === "schema" ? <PodaSchemaViewer poda={poda} /> : <div className="space-y-5">
              {poda.when_months?.length > 0 && <div className="bg-stone-50 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center"><Calendar className="w-5 h-5 text-emerald-600" /></div>
                  <div>
                    <p className="text-xs text-stone-500 font-medium">{i18nT("Meses de poda")}</p>
                    <p className="text-sm font-semibold text-stone-700">{monthList(poda.when_months, language)}</p>
                  </div>
                </div>}
              {poda.when_info && <Section icon={Calendar} title={i18nT("Quando podar")} color="#0891b2">{i18nT(poda.when_info)}</Section>}
              {poda.pruning_types && <Section icon={Trees} title={i18nT("Tipos de poda")} color="#16a34a">{i18nT(poda.pruning_types)}</Section>}
              {poda.how && <Section icon={Scissors} title={i18nT("Como podar")} color={color}>{i18nT(poda.how)}</Section>}
              {poda.tools && <Section icon={Wrench} title={i18nT("Ferramentas")} color="#7c3aed">{i18nT(poda.tools)}</Section>}
              {poda.tips && <Section icon={Lightbulb} title={i18nT("Dicas e cuidados")} color="#d97706">{i18nT(poda.tips)}</Section>}
            </div>}
        </div>
      </div>
    </div>;
}
