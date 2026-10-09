import { useI18n } from "@/lib/I18nContext";
import React, { useState } from "react";
import { MapPin, Trash2, Check, Calendar, ChevronDown, Sun, Droplets, BookOpen, Pencil, Grid3X3, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import { getPlantingProgress, getCareGuide } from "@/lib/plantingCare";
const STATUS_STYLES = {
  "Plantada": "bg-blue-50 text-blue-700 border-blue-200",
  "Em crescimento": "bg-green-50 text-green-700 border-green-200",
  "Pronta a colher": "bg-amber-50 text-amber-700 border-amber-200",
  "Colhida": "bg-stone-100 text-stone-500 border-stone-200"
};
const STATUS_ORDER = ["Plantada", "Em crescimento", "Pronta a colher", "Colhida"];
function fmtDate(d, locale) {
  if (!d) return "—";
  const date = new Date(d + "T00:00");
  return date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short"
  });
}
function daysBetween(a, b) {
  if (!a || !b) return null;
  const d1 = new Date(a + "T00:00");
  const d2 = new Date(b + "T00:00");
  return Math.round((d2 - d1) / 86400000);
}
export default function PlantingCard({
  planting,
  plants,
  onUpdate,
  onDelete,
  onEdit,
  onHarvest,
}) {
  const {
    t: i18nT,
    locale,
  } = useI18n();
  const positiveInteger = value => Number.isSafeInteger(Number(value)) && Number(value) > 0 && Number(value) <= 1000000;
  const rows = planting.rows;
  const columns = planting.columns ?? planting.cols;
  const isGrid = (planting.quantity_method === 'grid' || !planting.quantity_method) && positiveInteger(rows) && positiveInteger(columns) && positiveInteger(Number(rows) * Number(columns));
  const plantCount = isGrid ? Number(rows) * Number(columns) : positiveInteger(planting.plant_count) ? Number(planting.plant_count) : null;
  const color = planting.plant_color || "#84cc16";
  const today = new Date().toISOString().split("T")[0];
  const daysToHarvest = daysBetween(today, planting.expected_harvest_date);
  const isColhida = planting.status === "Colhida";
  const isOverdue = daysToHarvest !== null && daysToHarvest < 0 && !isColhida;
  const isReady = daysToHarvest !== null && daysToHarvest <= 0 && !isColhida;
  const advance = () => {
    const idx = STATUS_ORDER.indexOf(planting.status);
    const next = STATUS_ORDER[Math.min(idx + 1, STATUS_ORDER.length - 1)];
    const data = {
      status: next
    };
    if (next === "Colhida") data.actual_harvest_date = today;
    onUpdate(planting.id, data);
  };
  const {
    daysSince,
    totalDays,
    progress
  } = getPlantingProgress(planting);
  const care = getCareGuide(planting, plants);
  const [showCare, setShowCare] = useState(false);
  return <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="h-1.5" style={{
      background: `linear-gradient(90deg, ${color}, ${color}88)`
    }} />
      <div className="p-4"><span className="mb-3 inline-flex rounded-full bg-stone-100 px-2.5 py-1 text-[10px] font-semibold text-stone-600">{i18nT(({outdoor:"Ao ar livre",container:"Em vaso / floreira",greenhouse:"Em estufa",indoor:"No interior"})[planting.growing_environment] || "Ambiente não indicado")}</span>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{
          backgroundColor: color + "15"
        }}>
            {planting.plant_emoji || i18nT("🌱")}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-stone-800 leading-tight truncate">{i18nT(planting.plant_name)}</h3>
            {planting.location && <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {i18nT(planting.location)}
              </p>}
          </div>
          {onEdit && <button type="button" onClick={() => onEdit(planting)} title={i18nT('planting.edit')} aria-label={i18nT('planting.edit')} className="rounded-lg p-1.5 text-stone-400 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><Pencil className="h-4 w-4" /></button>}
          <button type="button" onClick={() => onDelete(planting.id)} title={i18nT('planting.delete')} aria-label={i18nT('planting.delete')} className="text-stone-300 hover:text-red-500 transition-colors p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 px-3 py-2.5">
          <p className="flex items-center gap-2 text-xs font-semibold text-emerald-900">{isGrid ? <Grid3X3 className="h-4 w-4 shrink-0" /> : <Package className="h-4 w-4 shrink-0" />}{plantCount ? i18nT(isGrid ? 'planting.quantityGridSummary' : 'planting.quantityCountSummary', { rows, columns, count: plantCount }) : i18nT('planting.quantityMissing')}</p>
          {planting.quantity && <p className="mt-1 text-xs text-stone-500">{i18nT('planting.quantityNotesSaved', { quantity: planting.quantity })}</p>}
        </div>

        {/* Datas */}
        <div className="flex items-center gap-3 mt-3 text-xs">
          <div className="flex items-center gap-1 text-stone-500">
            <Calendar className="w-3.5 h-3.5" />
            <span>{fmtDate(planting.planted_date, locale)}</span>
          </div>
          {planting.expected_harvest_date && <>
              <span className="text-stone-300">→</span>
              <div className="flex items-center gap-1 text-stone-500">
                <span>{fmtDate(planting.expected_harvest_date, locale)}</span>
              </div>
            </>}
        </div>

        {/* Barra de progresso */}
        {!isColhida && totalDays && <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-stone-400 mb-1">
              <span>{i18nT(daysSince)}{i18nT(" dia")}{daysSince !== 1 ? i18nT("s") : i18nT("")}{i18nT(" decorrido")}{daysSince !== 1 ? i18nT("s") : i18nT("")}</span>
              <span>{i18nT(care.info.emoji)} {i18nT(care.info.label)}</span>
            </div>
            <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{
            width: `${Math.min(100, progress * 100)}%`,
            background: `linear-gradient(90deg, ${color}, ${color}aa)`
          }} />
            </div>
          </div>}

        {/* Lembrete de colheita */}
        {!isColhida && planting.expected_harvest_date && <div className={cn("mt-3 rounded-xl px-3 py-2 text-xs font-medium", isOverdue ? "bg-red-50 text-red-700" : isReady ? "bg-amber-50 text-amber-700" : daysToHarvest <= 7 ? "bg-orange-50 text-orange-600" : "bg-stone-50 text-stone-500")}>
            {i18nT(isOverdue ? 'planting.estimatedHarvestPast' : daysToHarvest === 0 ? 'planting.estimatedHarvestToday' : 'planting.estimatedHarvestSoon', { days: Math.abs(daysToHarvest) })}
          </div>}

        {/* Notas */}
        {planting.notes && <p className="mt-3 text-xs text-stone-500 bg-stone-50 rounded-lg p-2.5 leading-relaxed">{i18nT(planting.notes)}</p>}

        {/* Cuidados ao longo do tempo */}
        <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/40 overflow-hidden">
          <button onClick={() => setShowCare(s => !s)} className="w-full flex items-center gap-2 px-3 py-2.5 text-left">
            <span className="text-lg">{i18nT(care.info.emoji)}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-emerald-700">{i18nT("Cuidados agora · ")}{i18nT(care.info.label)}</p>
              <p className="text-xs text-stone-500 truncate">
                {totalDays ? i18nT("Dia {v0} de {v1}", {
                v0: daysSince,
                v1: totalDays
              }) : i18nT("{v0} dia{v1} decorrido{v2}", {
                v0: daysSince,
                v1: daysSince !== 1 ? "s" : "",
                v2: daysSince !== 1 ? "s" : ""
              })}
              </p>
            </div>
            <ChevronDown className={cn("w-4 h-4 text-stone-400 transition-transform", showCare && "rotate-180")} />
          </button>
          {showCare && <div className="px-3 pb-3 space-y-3">
              <div>
                <p className="text-xs font-semibold text-stone-600 mb-1.5 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" />{i18nT(" O que fazer nesta fase")}</p>
                <ul className="space-y-1">
                  {i18nT(care.info.tips.map((t, i) => <li key={i} className="text-xs text-stone-600 flex gap-1.5">
                      <span className="text-emerald-500 shrink-0">•</span>
                      <span>{i18nT(t)}</span>
                    </li>))}
                </ul>
              </div>

              {care.plant && <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {care.plant.sun_requirements && <span className="text-xs bg-yellow-50 text-yellow-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Sun className="w-3 h-3" /> {i18nT(care.plant.sun_requirements)}
                      </span>}
                    {care.plant.water_requirements && <span className="text-xs bg-blue-50 text-blue-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                        <Droplets className="w-3 h-3" /> {i18nT(care.plant.water_requirements)}
                      </span>}
                    {care.plant.difficulty && <span className="text-xs bg-stone-100 text-stone-600 rounded-full px-2 py-0.5">
                        {i18nT(care.plant.difficulty)}
                      </span>}
                  </div>
                  {care.plant.care_instructions && <div>
                      <p className="text-xs font-semibold text-stone-600 mb-1">{i18nT("Guia de cultivo")}</p>
                      <p className="text-xs text-stone-600 leading-relaxed">{i18nT(care.plant.care_instructions)}</p>
                    </div>}
                </div>}

              {planting.notes && <div className="pt-1 border-t border-emerald-100/60">
                  <p className="text-xs text-stone-500 italic">{i18nT(planting.notes)}</p>
                </div>}
            </div>}
        </div>

        {/* Ações */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className={cn("text-xs font-medium px-2.5 py-1 rounded-full border", STATUS_STYLES[planting.status])}>
            {i18nT(planting.status)}
          </span>
          {!isColhida && <button onClick={advance} className="ml-auto text-xs font-medium bg-gradient-to-br from-emerald-500 to-green-600 text-white px-3 py-1.5 rounded-full hover:shadow-md transition-all flex items-center gap-1 active:scale-95">
              {planting.status === "Pronta a colher" ? <Check className="w-3.5 h-3.5" /> : null}
              {planting.status === "Pronta a colher" ? i18nT('planting.harvestAction') : i18nT("Avançar")}
            </button>}
          {isColhida && onHarvest && <button type="button" onClick={() => onHarvest(planting)} className="ml-auto flex items-center gap-1 rounded-full bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"><Package className="h-3.5 w-3.5" />{i18nT('planting.legacyHarvestAction')}</button>}
        </div>
      </div>
    </div>;
}
