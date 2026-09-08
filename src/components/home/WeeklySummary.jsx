import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Sprout, Scissors, PawPrint, Calendar, ChevronRight, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { generateAllCuras, groupCuras } from "@/lib/careSchedule";
import { cachedList } from "@/lib/offlineCatalog";

const MONTH_NAMES = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function WeeklySummary() {
  const [loading, setLoading] = useState(true);
  const [curas, setCuras] = useState([]);
  const [podas, setPodas] = useState([]);
  const [animals, setAnimals] = useState([]);

  useEffect(() => {
    Promise.all([
      base44.entities.Planting.list("-planted_date").catch(() => []),
      cachedList("plants", () => base44.entities.Plant.list()),
      cachedList("podas", () => base44.entities.Podas.list()),
      cachedList("farmanimals", () => base44.entities.FarmAnimal.list()),
    ]).then(([plantings, plants, podasList, animalsList]) => {
      setCuras(generateAllCuras(plantings || [], plants || []));
      setPodas(podasList || []);
      setAnimals(animalsList || []);
    }).catch(() => setLoading(false))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-6">
        <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
      </div>
    );
  }

  const groups = groupCuras(curas);
  const curasHoje = groups.hoje.tasks;
  const curasSemana = groups.semana.tasks;
  const curasAtrasadas = groups.atrasadas.tasks;

  const currentMonth = new Date().getMonth() + 1;
  const podasEpoca = podas.filter(p => (p.when_months || []).includes(currentMonth));
  const animaisCuidar = animals;
  const animaisAltoEsforco = animals.filter(a => a.daily_effort === "Alto");

  const now = new Date();

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-sm overflow-hidden">
      {/* Cabeçalho */}
      <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 via-green-50/50 to-lime-50/40 border-b border-stone-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <h2 className="text-sm font-bold text-stone-700">Resumo da semana</h2>
          <span className="text-xs text-stone-400 ml-auto">
            {WEEKDAYS[now.getDay()]}, {now.getDate()} {MONTH_NAMES[now.getMonth() + 1]}
          </span>
        </div>
      </div>

      {/* Hoje — destaque */}
      <div className="px-4 py-3 bg-amber-50/40 border-b border-amber-100/60">
        <p className="text-xs font-bold text-amber-700 mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" /> A fazer hoje
        </p>
        <div className="grid grid-cols-3 gap-2">
          <TodayStat icon={<Sprout className="w-3.5 h-3.5" />} color="#16a34a" count={curasHoje.length} label="curas" link="/calendario-curas" />
          <TodayStat icon={<Scissors className="w-3.5 h-3.5" />} color="#15803d" count={podasEpoca.length} label="podas" link="/podas-mondas" />
          <TodayStat icon={<PawPrint className="w-3.5 h-3.5" />} color="#ea580c" count={animaisCuidar.length} label="animais" link="/animais" />
        </div>
        {curasAtrasadas.length > 0 && (
          <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> {curasAtrasadas.length} cura(s) atrasada(s) — trata o quanto antes!
          </p>
        )}
      </div>

      {/* Cartões da semana */}
      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
        <SummaryCard
          icon={<Sprout className="w-4 h-4" />}
          color="#16a34a"
          title="Plantações"
          count={curasHoje.length + curasSemana.length}
          countLabel="tarefas esta semana"
          link="/calendario-curas"
          items={[...curasHoje, ...curasSemana].slice(0, 3).map(c => ({
            emoji: c.planting.plant_emoji || "🌱",
            title: c.planting.plant_name,
            sub: c.treatment.label,
          }))}
        />
        <SummaryCard
          icon={<Scissors className="w-4 h-4" />}
          color="#15803d"
          title="Podas"
          count={podasEpoca.length}
          countLabel="em época este mês"
          link="/podas-mondas"
          items={podasEpoca.slice(0, 3).map(p => ({
            emoji: p.emoji || "🌳",
            title: p.name,
            sub: p.category,
          }))}
        />
        <SummaryCard
          icon={<PawPrint className="w-4 h-4" />}
          color="#ea580c"
          title="Animais"
          count={animaisCuidar.length}
          countLabel="cuidados diários"
          link="/animais"
          items={animaisCuidar.slice(0, 3).map(a => ({
            emoji: a.emoji || "🐔",
            title: a.name,
            sub: `Esforço ${(a.daily_effort || "médio").toLowerCase()}`,
          }))}
          extra={animaisAltoEsforco.length > 0 ? `${animaisAltoEsforco.length} com esforço alto` : null}
        />
      </div>
    </div>
  );
}

function TodayStat({ icon, color, count, label, link }) {
  return (
    <Link to={link} className="flex flex-col items-center justify-center bg-white rounded-xl border border-stone-100 py-2 hover:border-stone-300 transition-colors">
      <div className="flex items-center gap-1" style={{ color }}>
        {icon}
        <span className="text-lg font-bold leading-none">{count}</span>
      </div>
      <span className="text-[10px] text-stone-400 mt-0.5">{label}</span>
    </Link>
  );
}

function SummaryCard({ icon, color, title, count, countLabel, link, items, extra }) {
  return (
    <div className="p-3.5 flex flex-col">
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: color + "15", color }}>
          {icon}
        </div>
        <p className="text-sm font-bold text-stone-700">{title}</p>
        <Link to={link} className="ml-auto text-stone-300 hover:text-stone-500">
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
      <p className="text-xs text-stone-500 mb-2">
        <span className="text-lg font-bold" style={{ color }}>{count}</span> {countLabel}
      </p>
      {items.length > 0 ? (
        <div className="space-y-1.5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-1.5 text-xs">
              <span className="text-base shrink-0">{item.emoji}</span>
              <span className="font-medium text-stone-700 truncate">{item.title}</span>
              <span className="text-stone-400 truncate ml-auto">{item.sub}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-stone-400 py-2">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Tudo em dia!</span>
        </div>
      )}
      {extra && <p className="text-xs text-orange-500 mt-2 font-medium">{extra}</p>}
    </div>
  );
}