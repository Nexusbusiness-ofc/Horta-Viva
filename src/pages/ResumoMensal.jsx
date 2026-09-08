import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { ArrowLeft, Sprout, Scissors, PawPrint, Calendar, Loader2, ChevronRight } from "lucide-react";
import { generateAllCuras } from "@/lib/careSchedule";
import { cachedList } from "@/lib/offlineCatalog";

const MONTH_NAMES_FULL = ["", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
const WEEKDAYS_SHORT = ["D", "S", "T", "Q", "Q", "S", "S"];
const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export default function ResumoMensal() {
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
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const todayStr = now.toISOString().split("T")[0];
  const todayDay = now.getDate();

  const curasMes = useMemo(() =>
    curas.filter(c => {
      const d = new Date(c.date + "T00:00");
      return d.getMonth() + 1 === currentMonth && d.getFullYear() === currentYear;
    }).sort((a, b) => a.date.localeCompare(b.date))
  , [curas, currentMonth, currentYear]);

  const podasEpoca = podas.filter(p => (p.when_months || []).includes(currentMonth));
  const overdueCuras = curasMes.filter(c => c.date < todayStr);

  const curasByDate = useMemo(() => {
    const map = {};
    curasMes.forEach(c => { map[c.date] = (map[c.date] || 0) + 1; });
    return map;
  }, [curasMes]);

  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstWeekday = new Date(currentYear, currentMonth - 1, 1).getDay();
  const calendarCells = [];
  for (let i = 0; i < firstWeekday; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-green-50/40 to-lime-50/50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-emerald-50/60 to-white/90 backdrop-blur-lg border-b border-emerald-100/60">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center shadow-lg shadow-indigo-300/50">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800 leading-none">Resumo mensal</h1>
              <p className="text-xs text-stone-500">{MONTH_NAMES_FULL[currentMonth]} {currentYear}</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              <StatCard icon={<Sprout className="w-4 h-4" />} color="#16a34a" count={curasMes.length} label="curas no mês" link="/calendario-curas" />
              <StatCard icon={<Scissors className="w-4 h-4" />} color="#15803d" count={podasEpoca.length} label="podas em época" link="/podas-mondas" />
              <StatCard icon={<PawPrint className="w-4 h-4" />} color="#ea580c" count={animals.length} label="animais a cuidar" link="/animais" />
            </div>

            {overdueCuras.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3 flex items-center gap-2">
                <span className="text-sm">⚠️</span>
                <p className="text-xs text-red-600 font-medium">{overdueCuras.length} cura(s) atrasada(s) este mês — trata o quanto antes!</p>
              </div>
            )}

            {/* Calendário do mês */}
            <section>
              <h2 className="text-sm font-bold text-stone-700 mb-2">Calendário de curas</h2>
              <div className="bg-white rounded-2xl border border-stone-200/80 p-3 shadow-sm">
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {WEEKDAYS_SHORT.map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-semibold text-stone-400">{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((day, i) => {
                    if (day === null) return <div key={i} />;
                    const dateStr = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                    const hasCuras = curasByDate[dateStr] > 0;
                    const isToday = day === todayDay;
                    const isPast = dateStr < todayStr;
                    return (
                      <div key={i} className="aspect-square flex flex-col items-center justify-center rounded-lg text-xs relative"
                        style={{
                          backgroundColor: isToday ? "#4f46e5" : hasCuras ? "#dcfce7" : "transparent",
                          color: isToday ? "white" : isPast && hasCuras ? "#dc2626" : "#52525b",
                          fontWeight: isToday ? 700 : hasCuras ? 600 : 400,
                        }}>
                        {day}
                        {hasCuras && !isToday && <span className="w-1 h-1 rounded-full bg-green-500 mt-0.5" />}
                      </div>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 mt-2 pt-2 border-t border-stone-100">
                  <span className="flex items-center gap-1 text-[10px] text-stone-400"><span className="w-2.5 h-2.5 rounded bg-indigo-600"></span> Hoje</span>
                  <span className="flex items-center gap-1 text-[10px] text-stone-400"><span className="w-2.5 h-2.5 rounded bg-green-100"></span> Com curas</span>
                </div>
              </div>
            </section>

            {/* Curas previstas este mês */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-stone-700">Curas previstas este mês</h2>
                <Link to="/calendario-curas" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-0.5">
                  Ver todas <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {curasMes.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200/80 py-8 text-center">
                  <p className="text-sm text-stone-400">Nenhuma cura prevista para este mês.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {curasMes.map((c, i) => (
                    <CuraRow key={i} cura={c} todayStr={todayStr} />
                  ))}
                </div>
              )}
            </section>

            {/* Podas em época */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-stone-700">Podas em época este mês</h2>
                <Link to="/podas-mondas" className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-0.5">
                  Ver guias <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {podasEpoca.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200/80 py-8 text-center">
                  <p className="text-sm text-stone-400">Nenhuma poda em época este mês.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {podasEpoca.map(p => (
                    <div key={p.id} className="bg-white rounded-2xl border border-stone-200/80 p-3 flex items-center gap-3 shadow-sm">
                      <span className="text-2xl">{p.emoji || "🌳"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate">{p.name}</p>
                        <p className="text-xs text-stone-400">{p.category}</p>
                      </div>
                      {p.difficulty && (
                        <span className="text-xs bg-stone-100 text-stone-500 rounded-full px-2 py-0.5">{p.difficulty}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Animais */}
            <section>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-bold text-stone-700">Cuidados com animais</h2>
                <Link to="/animais" className="text-xs text-orange-600 hover:text-orange-700 font-medium flex items-center gap-0.5">
                  Ver guias <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {animals.length === 0 ? (
                <div className="bg-white rounded-2xl border border-stone-200/80 py-8 text-center">
                  <p className="text-sm text-stone-400">Sem animais registados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {animals.map(a => (
                    <div key={a.id} className="bg-white rounded-2xl border border-stone-200/80 p-3 flex items-center gap-3 shadow-sm">
                      <span className="text-2xl">{a.emoji || "🐔"}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate">{a.name}</p>
                        <p className="text-xs text-stone-400">Esforço diário {(a.daily_effort || "médio").toLowerCase()}</p>
                      </div>
                      <span className={`text-xs rounded-full px-2 py-0.5 ${
                        a.daily_effort === "Alto" ? "bg-red-50 text-red-600" :
                        a.daily_effort === "Médio" ? "bg-amber-50 text-amber-600" :
                        "bg-green-50 text-green-600"
                      }`}>{a.daily_effort || "Médio"}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <footer className="text-center py-6 text-xs">
        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-medium">
          🌱 Minha Horta — Cultiva com sabedoria
        </span>
      </footer>
    </div>
  );
}

function StatCard({ icon, color, count, label, link }) {
  return (
    <Link to={link} className="bg-white rounded-2xl border border-stone-200/80 p-4 text-center shadow-sm hover:border-stone-300 transition-colors">
      <div className="flex items-center justify-center mb-1" style={{ color }}>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color }}>{count}</p>
      <p className="text-xs text-stone-500 mt-0.5">{label}</p>
    </Link>
  );
}

function CuraRow({ cura, todayStr }) {
  const { planting, treatment, date } = cura;
  const isToday = date === todayStr;
  const isOverdue = date < todayStr;
  const dateObj = new Date(date + "T00:00");
  const dayLabel = `${WEEKDAYS[dateObj.getDay()]} ${dateObj.getDate()}`;
  const plantColor = planting.plant_color || "#84cc16";

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0" style={{ background: treatment.color }} />
        <div className="flex-1 p-3 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0" style={{ backgroundColor: plantColor + "15" }}>
            {planting.plant_emoji || "🌱"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-stone-800 truncate">{planting.plant_name}</p>
            <p className="text-xs text-stone-400 truncate">{treatment.emoji} {treatment.label}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs font-semibold" style={{ color: isOverdue ? "#dc2626" : isToday ? "#4f46e5" : "#78716c" }}>
              {isToday ? "Hoje" : dayLabel}
            </p>
            {isOverdue && <p className="text-[10px] text-red-500">atrasada</p>}
          </div>
        </div>
      </div>
    </div>
  );
}