import { getLocalMonth } from '@/lib/regionalClimate';
import { readRegionalPreferences } from '@/lib/regionalPreferences';
import { useI18n } from "@/lib/I18nContext";
import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Sprout, Scissors, PawPrint, Calendar, ChevronRight, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { generateAllCuras, groupCuras } from "@/lib/careSchedule";
import { cachedList } from "@/lib/offlineCatalog";
const MONTH_NAMES = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
export default function WeeklySummary() {
  const {
    t: i18nT, locale
  } = useI18n();
  const [loading, setLoading] = useState(true);
  const [curas, setCuras] = useState([]);
  const [podas, setPodas] = useState([]);
  const [animals, setAnimals] = useState([]);
  useEffect(() => {
    Promise.all([base44.entities.Planting.list("-planted_date").catch(() => []), cachedList("plants", () => base44.entities.Plant.list()), cachedList("podas", () => base44.entities.Podas.list()), cachedList("farmanimals", () => base44.entities.FarmAnimal.list())]).then(([plantings, plants, podasList, animalsList]) => {
      setCuras(generateAllCuras(plantings || [], plants || []));
      setPodas(podasList || []);
      setAnimals(animalsList || []);
    }).catch(() => setLoading(false)).finally(() => setLoading(false));
  }, []);
  if (loading) {
    return <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
      </div>;
  }
  const groups = groupCuras(curas);
  const curasHoje = groups.hoje.tasks;
  const curasSemana = groups.semana.tasks;
  const curasAtrasadas = groups.atrasadas.tasks;
  const currentMonth = getLocalMonth(new Date(), readRegionalPreferences());
  const podasEpoca = podas.filter(p => (p.when_months || []).includes(currentMonth));
  const animaisCuidar = animals;
  const animaisAltoEsforco = animals.filter(a => a.daily_effort === "Alto");
  const now = new Date();
  return <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 via-green-50/50 to-lime-50/40 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-stone-700">{i18nT("Resumo da semana")}</h2>
          <span className="text-xs text-stone-400 ml-auto">
            {new Intl.DateTimeFormat(locale,{weekday:'short',day:'numeric',month:'short',timeZone:readRegionalPreferences().timeZone}).format(now)}
          </span>
        </div>
      </div>

      {/* Hoje — destaque */}
      <div className="px-4 py-3 bg-amber-50/40 border-b border-amber-100/60">
        <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />{i18nT(" A fazer hoje")}</p>
        <div className="grid grid-cols-3 gap-2">
          <TodayStat icon={<Sprout className="w-3.5 h-3.5" />} color="#16a34a" count={curasHoje.length} label={i18nT("curas")} link="/calendario-curas" />
          <TodayStat icon={<Scissors className="w-3.5 h-3.5" />} color="#15803d" count={podasEpoca.length} label={i18nT("podas")} link="/podas-mondas" />
          <TodayStat icon={<PawPrint className="w-3.5 h-3.5" />} color="#ea580c" count={animaisCuidar.length} label={i18nT("animais")} link="/animais" />
        </div>
        {curasAtrasadas.length > 0 && <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {i18nT(curasAtrasadas.length)}{i18nT(" cura(s) atrasada(s) — trata o quanto antes!")}</p>}
      </div>

      {/* Cartões da semana */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
        <SummaryCard icon={<Sprout className="w-4 h-4" />} color="#16a34a" title={i18nT("Plantações")} count={curasHoje.length + curasSemana.length} countLabel="tarefas esta semana" link="/calendario-curas" items={[...curasHoje, ...curasSemana].slice(0, 3).map(c => ({
        emoji: c.planting.plant_emoji || "🌱",
        title: c.planting.plant_name,
        sub: c.treatment.label
      }))} />
        <SummaryCard icon={<Scissors className="w-4 h-4" />} color="#15803d" title={i18nT("Podas")} count={podasEpoca.length} countLabel="em época este mês" link="/podas-mondas" items={podasEpoca.slice(0, 3).map(p => ({
        emoji: p.emoji || "🌳",
        title: p.name,
        sub: p.category
      }))} />
        <SummaryCard icon={<PawPrint className="w-4 h-4" />} color="#ea580c" title={i18nT("Animais")} count={animaisCuidar.length} countLabel="cuidados diários" link="/animais" items={animaisCuidar.slice(0, 3).map(a => ({
        emoji: a.emoji || "🐔",
        title: a.name,
        sub: `Esforço ${(a.daily_effort || "médio").toLowerCase()}`
      }))} extra={animaisAltoEsforco.length > 0 ? `${animaisAltoEsforco.length} com esforço alto` : null} />
      </div>
    </div>;
}
function TodayStat({
  icon,
  color,
  count,
  label,
  link
}) {
  const {
    t: i18nT, locale
  } = useI18n();
  return <Link to={link} className="flex flex-col items-center justify-center bg-white rounded-xl border border-stone-100 py-2 hover:border-stone-300 transition-colors">
      <div className="flex items-center gap-1" style={{
      color
    }}>
        {i18nT(icon)}
        <span className="text-lg font-bold leading-none">{i18nT(count)}</span>
      </div>
      <span className="text-[10px] text-stone-400 mt-0.5">{i18nT(label)}</span>
    </Link>;
}
function SummaryCard({
  icon,
  color,
  title,
  count,
  countLabel,
  link,
  items,
  extra
}) {
  const {
    t: i18nT, locale
  } = useI18n();
  return <div className="p-3.5 flex flex-col">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{
        backgroundColor: color + "15",
        color
      }}>
          {i18nT(icon)}
        </div>
        <p className="text-sm font-bold text-stone-700">{i18nT(title)}</p>
        <Link to={link} className="ml-auto text-stone-300 hover:text-stone-500">
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <p className="text-xs text-stone-500 mb-2">
        <span className="text-lg font-bold" style={{
        color
      }}>{i18nT(count)}</span> {i18nT(countLabel)}
      </p>
      {items.length > 0 ? <div className="space-y-1.5">
          {i18nT(items.map((item, i) => <div key={i} className="flex items-center gap-1.5 text-xs">
              <span className="text-base shrink-0">{i18nT(item.emoji)}</span>
              <span className="font-medium text-stone-700 truncate">{i18nT(item.title)}</span>
              <span className="text-stone-400 truncate ml-auto">{i18nT(item.sub)}</span>
            </div>))}
        </div> : <div className="flex items-center gap-1.5 text-xs text-stone-400 py-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{i18nT("Tudo em dia!")}</span>
        </div>}
      {extra && <p className="text-xs text-orange-500 mt-2 font-medium">{i18nT(extra)}</p>}
    </div>;
}
