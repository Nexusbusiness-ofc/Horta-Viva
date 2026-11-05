import { useI18n, CatalogLanguageNote } from "@/lib/I18nContext";
import { translatedMonth } from "@/lib/i18n";
import RegionalCalendarNotice from "@/components/regional/RegionalCalendarNotice";
import React, { useState } from "react";
import { Image } from "@/components/ui/image";
import Emoji3D from "@/components/ui/Emoji3D";
import { Scissors, Calendar, Wrench, Lightbulb, Trees, BookOpen, Layers, CheckCircle2 } from "lucide-react";
import PodaSchemaViewer from "./PodaSchemaViewer";
import { PRUNING_TYPE_META, getPruningSchedule, formatShortMonths } from "./PodaCard";

const MONTH_SHORT = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

function monthList(months, language) {
  return (months || []).map(m => {
    const raw = translatedMonth(m - 1, language);
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }).join(", ");
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
  return (
    <div className="space-y-1.5 min-w-0">
      <div className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
          style={{ backgroundColor: color + "22" }}
        >
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <h3 className="font-semibold text-stone-800 text-sm uppercase tracking-wide truncate">
          {i18nT(title)}
        </h3>
      </div>
      <p className="text-stone-600 text-sm leading-relaxed pl-9 whitespace-pre-line break-words">
        {i18nT(children)}
      </p>
    </div>
  );
}

export default function PodaDetail({
  poda,
  initialPruningType = "production",
  onClose
}) {
  const {
    t: i18nT,
    language
  } = useI18n();
  const [activeView, setActiveView] = useState("schema"); // 'schema' | 'details'
  const [selectedPruningType, setSelectedPruningType] = useState(
    initialPruningType && PRUNING_TYPE_META[initialPruningType] ? initialPruningType : "production"
  );

  if (!poda) return null;
  const color = poda.color || "#16a34a";
  const currentMonth = new Date().getMonth() + 1;
  const schedule = getPruningSchedule(poda);
  const activeTypeData = schedule[selectedPruningType] || schedule.production;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-gradient-to-br from-white to-emerald-50/20 w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl flex flex-col"
        style={{ WebkitOverflowScrolling: "touch" }}
        onClick={e => e.stopPropagation()}
      >
        {poda.image_url && (
          <div className="relative w-full h-44 sm:h-52 shrink-0 overflow-hidden">
            <Image
              src={poda.image_url}
              fittingType="fill"
              alt={i18nT("Poda de {v0}", { v0: poda.name })}
              className="w-full h-full block"
              focalPointY={0.4}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="absolute bottom-3 left-4">
              <Emoji3D item={poda} size="xl" badge />
            </div>
          </div>
        )}

        <div
          className="relative px-6 pt-6 pb-4 shrink-0"
          style={{ background: `linear-gradient(135deg, ${color}22, ${color}08)` }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-500 shadow-sm transition-colors"
          >
            ✕
          </button>
          {!poda.image_url && (
            <div className="mb-3">
              <Emoji3D item={poda} size="2xl" badge />
            </div>
          )}
          <h2 className="text-2xl font-bold text-stone-800">{i18nT(poda.name)}</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span
              className="inline-block text-xs font-medium px-3 py-1 rounded-full"
              style={{ backgroundColor: color + "22", color }}
            >
              {i18nT(poda.category)}
            </span>
            <div className="flex items-center gap-1 bg-white/80 rounded-full px-2.5 py-0.5 border border-stone-200/60">
              <Scissors className="w-3 h-3" style={{ color }} />
              <span className="text-[11px] font-medium text-stone-600">
                {i18nT("Dificuldade: ")}{i18nT(poda.difficulty)}
              </span>
            </div>
          </div>

          {/* Abas Alternadoras de Vista */}
          <div className="flex gap-2 mt-4 bg-white/70 p-1 rounded-2xl border border-stone-200/70">
            <button
              onClick={() => setActiveView("schema")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeView === "schema"
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>{i18nT("📐 Esquema Prático")}</span>
            </button>
            <button
              onClick={() => setActiveView("details")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                activeView === "details"
                  ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-sm"
                  : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{i18nT("📋 Ficha & Calendários")}</span>
            </button>
          </div>
        </div>

        {/* Conteúdo Principal com Scroll */}
        <div className="px-5 sm:px-6 py-5 flex-1 space-y-5">
          <CatalogLanguageNote />
          <RegionalCalendarNotice item={poda} />

          {/* Menu Interativo dos 3 Tipos de Poda (Visível tanto na Ficha como no Topo) */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-xs space-y-3.5">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-stone-800">
                    {i18nT("Quando Podar por Objetivo")}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {i18nT("Seleciona o tipo de poda para ver os meses ideais e instruções")}
                  </p>
                </div>
              </div>
            </div>

            {/* Abas dos 3 Tipos */}
            <div className="grid grid-cols-3 gap-1.5 bg-stone-100 p-1 rounded-2xl border border-stone-200/70">
              {Object.values(PRUNING_TYPE_META).map((meta) => {
                const isSelected = selectedPruningType === meta.key;
                const itemMonths = schedule[meta.key]?.months || [];
                const inSeason = itemMonths.includes(currentMonth);
                return (
                  <button
                    key={meta.key}
                    type="button"
                    onClick={() => setSelectedPruningType(meta.key)}
                    className={`relative flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-extrabold transition-all ${
                      isSelected
                        ? meta.activeTab
                        : "text-stone-600 hover:text-stone-900 hover:bg-white/70"
                    }`}
                  >
                    <span>{meta.emoji}</span>
                    <span className="truncate">{i18nT(meta.shortLabel)}</span>
                    {inSeason && (
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          isSelected ? "bg-white animate-pulse" : "bg-emerald-500"
                        }`}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cartão Detalhado do Tipo de Poda Ativo */}
            <div className={`rounded-2xl p-3.5 border space-y-3 ${activeTypeData.bgLight} ${activeTypeData.borderLight}`}>
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base">{activeTypeData.emoji}</span>
                    <h4 className={`text-sm font-extrabold ${activeTypeData.textDark}`}>
                      {i18nT(activeTypeData.fullLabel)}
                    </h4>
                  </div>
                  <p className="text-xs font-semibold text-stone-600 mt-0.5">
                    {i18nT("Fase / Idade:")} <span className="font-bold">{i18nT(activeTypeData.stage)}</span>
                  </p>
                </div>
                {activeTypeData.months.includes(currentMonth) && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wide px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-xs">
                    <CheckCircle2 className="w-3 h-3" />
                    {i18nT("Em época este mês")}
                  </span>
                )}
              </div>

              <div className="bg-white/90 rounded-xl p-2.5 border border-white/80 space-y-2">
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <span className="font-bold text-stone-600">{i18nT("Meses recomendados:")}</span>
                  <span className={`font-extrabold ${activeTypeData.textAccent}`}>
                    {activeTypeData.months.length > 0
                      ? monthList(activeTypeData.months, language)
                      : i18nT("Consultar nota regional")}
                  </span>
                </div>
                {activeTypeData.season && (
                  <p className="text-[11px] text-stone-500 font-medium">
                    🗓️ {i18nT("Época ideal:")} <b className="text-stone-700">{i18nT(activeTypeData.season)}</b>
                  </p>
                )}
                <div className="flex gap-1 pt-0.5">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                    const active = activeTypeData.months.includes(m);
                    const isNow = m === currentMonth;
                    return (
                      <span
                        key={m}
                        title={translatedMonth(m - 1, language, "long")}
                        className={`flex-1 text-center text-[10px] leading-none rounded-md py-1.5 font-extrabold transition-all ${
                          active ? "text-white shadow-2xs" : "text-stone-300 bg-stone-100"
                        } ${isNow ? "ring-2 ring-stone-900" : ""}`}
                        style={active ? { backgroundColor: activeTypeData.color } : {}}
                      >
                        {i18nT(MONTH_SHORT[m])}
                      </span>
                    );
                  })}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {i18nT(activeTypeData.summary)}
              </p>
            </div>

            {/* Resumo Comparativo Rápido dos 3 Tipos */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {Object.values(schedule).map((item) => {
                const shortNames = formatShortMonths(item.months, language);
                const isSel = selectedPruningType === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setSelectedPruningType(item.key)}
                    className={`text-left rounded-xl p-2.5 border transition-all ${
                      isSel
                        ? "bg-stone-900 text-white border-stone-900 shadow-xs"
                        : "bg-stone-50 hover:bg-stone-100/80 text-stone-700 border-stone-200/80"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[11px] font-extrabold flex items-center gap-1">
                        <span>{item.emoji}</span>
                        <span>{i18nT(item.shortLabel)}</span>
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${
                          isSel ? "bg-white/20 text-white" : "bg-white text-stone-600 border border-stone-200"
                        }`}
                      >
                        {i18nT("{v0} meses", { v0: item.months.length })}
                      </span>
                    </div>
                    <p className={`text-[10px] font-bold truncate ${isSel ? "text-emerald-300" : "text-stone-500"}`}>
                      {shortNames.length > 0 ? shortNames.join(" • ") : "—"}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {activeView === "schema" ? (
            <PodaSchemaViewer poda={poda} />
          ) : (
            <div className="space-y-5">
              {poda.when_info && (
                <Section icon={Calendar} title={i18nT("Quando podar (Visão Geral)")} color="#0891b2">
                  {i18nT(poda.when_info)}
                </Section>
              )}
              {poda.pruning_types && (
                <Section icon={Trees} title={i18nT("Sistemas e Tipos de Poda")} color="#16a34a">
                  {i18nT(poda.pruning_types)}
                </Section>
              )}
              {poda.how && (
                <Section icon={Scissors} title={i18nT("Como podar passo a passo")} color={color}>
                  {i18nT(poda.how)}
                </Section>
              )}
              {poda.tools && (
                <Section icon={Wrench} title={i18nT("Ferramentas recomendadas")} color="#7c3aed">
                  {i18nT(poda.tools)}
                </Section>
              )}
              {poda.tips && (
                <Section icon={Lightbulb} title={i18nT("Dicas e cuidados fitossanitários")} color="#d97706">
                  {i18nT(poda.tips)}
                </Section>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
