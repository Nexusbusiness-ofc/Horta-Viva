import { useI18n } from "@/lib/I18nContext";
import { translatedMonth } from "@/lib/i18n";
import React, { useState } from "react";
import { Image } from "@/components/ui/image";
import { Sprout, Apple, Sparkles, Calendar, Layers, ChevronRight, CheckCircle2 } from "lucide-react";

const MONTH_SHORT = ["", "J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"];

export const PRUNING_TYPE_META = {
  formation: {
    key: "formation",
    shortLabel: "Formação",
    fullLabel: "Poda de Formação",
    emoji: "🌱",
    icon: Sprout,
    color: "#059669",
    bgLight: "bg-emerald-50/90",
    borderLight: "border-emerald-200/80",
    textDark: "text-emerald-800",
    textAccent: "text-emerald-700",
    pillBg: "bg-emerald-100/80 text-emerald-800 border-emerald-300/70",
    activeTab: "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm shadow-emerald-200",
    defaultStage: "1.º ao 3.º ano (Árvore Jovem)",
    defaultSummary: "Define o tronco e as pernadas mestras nos primeiros anos para criar uma copa equilibrada, forte e bem iluminada."
  },
  production: {
    key: "production",
    shortLabel: "Produção",
    fullLabel: "Poda de Produção / Frutificação",
    emoji: "🍎",
    icon: Apple,
    color: "#d97706",
    bgLight: "bg-amber-50/90",
    borderLight: "border-amber-200/80",
    textDark: "text-amber-900",
    textAccent: "text-amber-700",
    pillBg: "bg-amber-100/80 text-amber-900 border-amber-300/70",
    activeTab: "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-sm shadow-amber-200",
    defaultStage: "Anual (Árvore Adulta)",
    defaultSummary: "Renova a madeira frutífera e equilibra a carga de botões florais para obter frutos de maior calibre, doçura e regularidade."
  },
  cleaning: {
    key: "cleaning",
    shortLabel: "Limpeza",
    fullLabel: "Poda de Limpeza / Rejuvenescimento",
    emoji: "✨",
    icon: Sparkles,
    color: "#0284c7",
    bgLight: "bg-sky-50/90",
    borderLight: "border-sky-200/80",
    textDark: "text-sky-900",
    textAccent: "text-sky-700",
    pillBg: "bg-sky-100/80 text-sky-900 border-sky-300/70",
    activeTab: "bg-gradient-to-r from-sky-600 to-blue-600 text-white shadow-sm shadow-sky-200",
    defaultStage: "Manutenção & Rejuvenescimento",
    defaultSummary: "Elimina ramos ladrões, secos, doentes ou cruzados no interior da copa e rejuvenesce pernadas envelhecidas."
  }
};

export function getPruningSchedule(poda) {
  const baseMonths = Array.isArray(poda?.when_months) ? poda.when_months : [];
  const cal = poda?.pruning_calendar || {};

  const formationMonths = Array.isArray(poda?.formation_months) && poda.formation_months.length > 0
    ? poda.formation_months
    : Array.isArray(cal.formation?.months) && cal.formation.months.length > 0
      ? cal.formation.months
      : baseMonths;

  const productionMonths = Array.isArray(poda?.production_months) && poda.production_months.length > 0
    ? poda.production_months
    : Array.isArray(cal.production?.months) && cal.production.months.length > 0
      ? cal.production.months
      : baseMonths;

  const cleaningMonths = Array.isArray(poda?.cleaning_months) && poda.cleaning_months.length > 0
    ? poda.cleaning_months
    : Array.isArray(cal.cleaning?.months) && cal.cleaning.months.length > 0
      ? cal.cleaning.months
      : baseMonths;

  return {
    formation: {
      ...PRUNING_TYPE_META.formation,
      months: formationMonths,
      season: cal.formation?.season || "",
      stage: cal.formation?.stage || PRUNING_TYPE_META.formation.defaultStage,
      summary: cal.formation?.summary || PRUNING_TYPE_META.formation.defaultSummary
    },
    production: {
      ...PRUNING_TYPE_META.production,
      months: productionMonths,
      season: cal.production?.season || "",
      stage: cal.production?.stage || PRUNING_TYPE_META.production.defaultStage,
      summary: cal.production?.summary || PRUNING_TYPE_META.production.defaultSummary
    },
    cleaning: {
      ...PRUNING_TYPE_META.cleaning,
      months: cleaningMonths,
      season: cal.cleaning?.season || "",
      stage: cal.cleaning?.stage || PRUNING_TYPE_META.cleaning.defaultStage,
      summary: cal.cleaning?.summary || PRUNING_TYPE_META.cleaning.defaultSummary
    }
  };
}

export function formatShortMonths(months, language = "pt-PT") {
  if (!Array.isArray(months) || months.length === 0) return [];
  return months.map(m => {
    const raw = translatedMonth(m - 1, language, "short").replace(/\.$/, "");
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  });
}

export default function PodaCard({
  poda,
  onClick,
  compact = false
}) {
  const {
    t: i18nT,
    language
  } = useI18n();

  const currentMonth = new Date().getMonth() + 1;
  const schedule = getPruningSchedule(poda);

  // Escolhe por defeito o tipo de poda que estiver em época no mês atual, ou "production"
  const defaultType = (() => {
    if (schedule.production.months.includes(currentMonth)) return "production";
    if (schedule.formation.months.includes(currentMonth)) return "formation";
    if (schedule.cleaning.months.includes(currentMonth)) return "cleaning";
    return "production";
  })();

  const [selectedType, setSelectedType] = useState(defaultType);
  const [showAllMatrix, setShowAllMatrix] = useState(false);

  const color = poda.color || "#16a34a";
  const activeData = schedule[selectedType] || schedule.production;
  const activeMonthNames = formatShortMonths(activeData.months, language);
  const isActiveNow = activeData.months.includes(currentMonth);

  const handleCardClick = () => {
    if (onClick) onClick(selectedType);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  if (compact) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={handleCardClick}
        onKeyDown={handleKeyDown}
        className="group relative text-left bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col w-full cursor-pointer"
      >
        <div className="h-1.5 w-full shrink-0" style={{ backgroundColor: color }} />
        <div className="relative aspect-square w-full overflow-hidden bg-stone-50 shrink-0">
          {poda.image_url ? (
            <Image
              src={poda.image_url}
              fittingType="fill"
              alt={i18nT("Poda de {v0}", { v0: poda.name })}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center text-4xl"
              style={{ background: `linear-gradient(135deg, ${color}25, ${color}08)` }}
            >
              {poda.emoji || i18nT("🌳")}
            </div>
          )}
          <span className="absolute top-1.5 left-1.5 text-xl drop-shadow-xs">{i18nT(poda.emoji)}</span>
          {isActiveNow && (
            <span className="absolute top-1.5 right-1.5 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white shadow-sm">
              {i18nT("Em época")}
            </span>
          )}
        </div>

        <div className="p-2 sm:p-2.5 flex-1 flex flex-col justify-between min-w-0 gap-1.5">
          <div>
            <h3 className="font-bold text-stone-800 text-xs sm:text-sm leading-tight truncate group-hover:text-emerald-700 transition-colors">
              {i18nT(poda.name)}
            </h3>
            <div className="flex items-center justify-between gap-1 mt-1 text-[10px]">
              <span
                className="font-medium px-1.5 py-0.5 rounded-full truncate"
                style={{ backgroundColor: color + "18", color }}
              >
                {i18nT(poda.category)}
              </span>
            </div>
          </div>

          {/* Mini Seletor de Tipo de Poda no modo compacto */}
          <div
            className="pt-1 border-t border-stone-100 space-y-1"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid grid-cols-3 gap-0.5 bg-stone-100 p-0.5 rounded-lg">
              {Object.values(PRUNING_TYPE_META).map((meta) => {
                const isSel = selectedType === meta.key;
                return (
                  <button
                    key={meta.key}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedType(meta.key);
                    }}
                    title={i18nT(meta.fullLabel)}
                    className={`text-[9px] font-bold py-0.5 px-1 rounded-md truncate transition-all ${
                      isSel ? "bg-white text-stone-800 shadow-2xs" : "text-stone-500 hover:text-stone-700"
                    }`}
                  >
                    {meta.emoji} {i18nT(meta.shortLabel.slice(0, 4))}.
                  </button>
                );
              })}
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                const active = activeData.months.includes(m);
                return (
                  <span
                    key={m}
                    className={`flex-1 text-center text-[8px] leading-none rounded-xs py-0.5 font-bold ${
                      active ? "text-white" : "text-stone-300 bg-stone-100"
                    }`}
                    style={active ? { backgroundColor: activeData.color } : {}}
                  >
                    {i18nT(MONTH_SHORT[m])}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className="group text-left bg-white rounded-3xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-300/80 transition-all flex flex-col cursor-pointer"
    >
      {/* Topo com Imagem e Badges */}
      <div className="relative h-36 w-full overflow-hidden shrink-0">
        {poda.image_url ? (
          <Image
            src={poda.image_url}
            fittingType="fill"
            alt={i18nT("Poda de {v0}", { v0: poda.name })}
            className="w-full h-full block group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${color}22, ${color}06)` }}
          >
            <span className="text-5xl">{i18nT(poda.emoji)}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <span className="absolute top-2.5 left-3 text-2xl drop-shadow-md">{i18nT(poda.emoji)}</span>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/95 text-emerald-800 shadow-sm flex items-center gap-1 backdrop-blur-xs">
            <span>📐</span>
            <span>{i18nT("Esquema 3D")}</span>
          </span>
        </div>

        <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <span
              className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-1 shadow-2xs"
              style={{ backgroundColor: color, color: "#fff" }}
            >
              {i18nT(poda.category)}
            </span>
            <h3 className="font-extrabold text-white text-base leading-tight truncate drop-shadow-sm">
              {i18nT(poda.name)}
            </h3>
          </div>
          {poda.difficulty && (
            <span className="shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-black/45 text-white/95 backdrop-blur-xs border border-white/15">
              {i18nT(poda.difficulty)}
            </span>
          )}
        </div>
      </div>

      {/* Menu Interativo dos 3 Tipos de Poda */}
      <div
        className="p-3.5 flex-1 flex flex-col justify-between space-y-3 bg-gradient-to-b from-white to-stone-50/50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2.5">
          {/* Cabeçalho do Menu */}
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-stone-600">
                {i18nT("Calendário por Tipo de Poda")}
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowAllMatrix((v) => !v);
              }}
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 ${
                showAllMatrix
                  ? "bg-stone-800 text-white border-stone-800"
                  : "bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200/70"
              }`}
            >
              <Layers className="w-2.5 h-2.5" />
              <span>{showAllMatrix ? i18nT("Vista Detalhada") : i18nT("Ver os 3")}</span>
            </button>
          </div>

          {/* Botões / Abas dos 3 Tipos de Poda */}
          <div className="grid grid-cols-3 gap-1 bg-stone-100/90 p-1 rounded-2xl border border-stone-200/70">
            {Object.values(PRUNING_TYPE_META).map((meta) => {
              const isSelected = !showAllMatrix && selectedType === meta.key;
              const typeMonths = schedule[meta.key]?.months || [];
              const inSeason = typeMonths.includes(currentMonth);
              return (
                <button
                  key={meta.key}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedType(meta.key);
                    setShowAllMatrix(false);
                  }}
                  className={`relative flex flex-col items-center justify-center py-1.5 px-1.5 rounded-xl text-center transition-all ${
                    isSelected
                      ? meta.activeTab
                      : "text-stone-600 hover:text-stone-900 hover:bg-white/70"
                  }`}
                >
                  {inSeason && (
                    <span
                      title={i18nT("Em época este mês")}
                      className={`absolute top-1 right-1 w-1.5 h-1.5 rounded-full ${
                        isSelected ? "bg-white animate-pulse" : "bg-emerald-500"
                      }`}
                    />
                  )}
                  <span className="text-xs leading-none mb-0.5">{meta.emoji}</span>
                  <span className="text-[10px] font-extrabold leading-tight truncate w-full">
                    {i18nT(meta.shortLabel)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Conteúdo Dinâmico: Vista Comparativa dos 3 Tipos OU Detalhe do Tipo Selecionado */}
          {showAllMatrix ? (
            <div className="space-y-2 bg-stone-50/90 rounded-2xl p-2.5 border border-stone-200/80">
              <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                {i18nT("Comparativo Anual (Clica num tipo para detalhar)")}
              </p>
              {Object.values(schedule).map((item) => {
                const names = formatShortMonths(item.months, language);
                return (
                  <div
                    key={item.key}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedType(item.key);
                      setShowAllMatrix(false);
                    }}
                    className="bg-white rounded-xl p-2 border border-stone-200/70 hover:border-emerald-300 transition-all cursor-pointer space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[11px] font-extrabold text-stone-800 flex items-center gap-1">
                        <span>{item.emoji}</span>
                        <span>{i18nT(item.shortLabel)}</span>
                      </span>
                      <span
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded-md truncate max-w-[145px]"
                        style={{ backgroundColor: item.color + "18", color: item.color }}
                      >
                        {names.length > 0 ? names.join(" • ") : i18nT("Ver guia")}
                      </span>
                    </div>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                        const active = item.months.includes(m);
                        const isNow = m === currentMonth;
                        return (
                          <span
                            key={m}
                            className={`flex-1 text-center text-[8px] leading-none rounded-xs py-1 font-bold ${
                              active ? "text-white" : "text-stone-300 bg-stone-100"
                            } ${isNow ? "ring-1 ring-stone-800" : ""}`}
                            style={active ? { backgroundColor: item.color } : {}}
                          >
                            {i18nT(MONTH_SHORT[m])}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className={`rounded-2xl p-3 border transition-all space-y-2.5 ${activeData.bgLight} ${activeData.borderLight}`}>
              {/* Título do Tipo de Poda + Status Mês Atual */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm leading-none">{activeData.emoji}</span>
                    <h4 className={`text-xs font-extrabold leading-tight truncate ${activeData.textDark}`}>
                      {i18nT(activeData.fullLabel)}
                    </h4>
                  </div>
                  <p className="text-[10px] font-semibold text-stone-500 mt-0.5 truncate">
                    {i18nT(activeData.stage)}
                  </p>
                </div>
                {isActiveNow && (
                  <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-wide px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    {i18nT("Em época")}
                  </span>
                )}
              </div>

              {/* Pílulas com os Nomes dos Meses Recomendados */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-bold text-stone-600">{i18nT("Meses ideais:")}</span>
                  {activeData.season && (
                    <span className={`font-bold text-[10px] truncate max-w-[165px] ${activeData.textAccent}`} title={i18nT(activeData.season)}>
                      {i18nT(activeData.season)}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1">
                  {activeMonthNames.length > 0 ? (
                    activeData.months.map((m, idx) => {
                      const isCur = m === currentMonth;
                      return (
                        <span
                          key={m}
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border transition-all ${
                            isCur
                              ? "bg-stone-900 text-white border-stone-900 shadow-2xs"
                              : activeData.pillBg
                          }`}
                        >
                          {activeMonthNames[idx]}
                          {isCur ? " •" : ""}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-[10px] text-stone-500 italic">
                      {i18nT("Consultar condição local na ficha")}
                    </span>
                  )}
                </div>
              </div>

              {/* Barra Anual de 12 Meses (J a D) */}
              <div className="bg-white/90 rounded-xl p-1.5 border border-white/80 shadow-2xs">
                <div className="flex gap-0.5">
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => {
                    const active = activeData.months.includes(m);
                    const isNow = m === currentMonth;
                    return (
                      <span
                        key={m}
                        title={translatedMonth(m - 1, language, "long")}
                        className={`flex-1 text-center text-[9px] leading-none rounded-md py-1.5 font-extrabold transition-all ${
                          active
                            ? "text-white shadow-2xs scale-[1.02]"
                            : "text-stone-300 bg-stone-100/80"
                        } ${isNow ? "ring-1.5 ring-stone-900" : ""}`}
                        style={active ? { backgroundColor: activeData.color } : {}}
                      >
                        {i18nT(MONTH_SHORT[m])}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Explicação Curta do Objetivo / Como fazer este tipo de poda */}
              <p className="text-[11px] text-stone-700 leading-relaxed line-clamp-3">
                {i18nT(activeData.summary)}
              </p>
            </div>
          )}
        </div>

        {/* Rodapé de Ação para Abrir Guia Completo e Esquema 3D */}
        <button
          type="button"
          onClick={handleCardClick}
          className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200/80 hover:border-emerald-200 text-[11px] font-bold flex items-center justify-between transition-all group/btn"
        >
          <span>{i18nT("Ver guia completo, cortes & 3D")}</span>
          <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover/btn:text-emerald-600 group-hover/btn:translate-x-0.5 transition-all" />
        </button>
      </div>
    </div>
  );
}
