import React from "react";
import { getPlantCurasGuide, TREATMENTS, SEASON_LABEL, seasonOf } from "@/lib/careSchedule";
import { Bug, ShieldCheck, Clock, FlaskConical } from "lucide-react";
import ReminderForm from "@/components/quinta/ReminderForm";

const MONTH_SHORT = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

const SEASON_STYLES = {
  inverno: { bg: "#e0f2fe", fg: "#0284c7", label: "Inverno" },
  primavera: { bg: "#dcfce7", fg: "#16a34a", label: "Primavera" },
  verao: { bg: "#fef3c7", fg: "#d97706", label: "Verão" },
  outono: { bg: "#ffedd5", fg: "#ea580c", label: "Outono" },
};

export default function PlantCareCalendar({ plant }) {
  if (!plant) return null;
  const guide = getPlantCurasGuide(plant);
  const currentMonth = new Date().getMonth() + 1;
  const currentSeason = seasonOf(currentMonth);
  const today = new Date().toISOString().split("T")[0];

  const monthSeason = Array.from({ length: 12 }, (_, i) => seasonOf(i + 1));
  const currentSeasonGuide = guide.filter(t => t.season === currentSeason);

  return (
    <div className="space-y-4">
      {/* Calendário sazonal */}
      <div>
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">🧪 Curas por estação</h3>
        <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
          {monthSeason.map((s, i) => {
            const m = i + 1;
            const isCurrent = m === currentMonth;
            const st = SEASON_STYLES[s];
            return (
              <div
                key={m}
                className={`flex-1 min-w-[40px] rounded-lg p-1.5 text-center border ${isCurrent ? "border-emerald-400 ring-1 ring-emerald-300" : "border-stone-100"}`}
                style={{ backgroundColor: st.bg }}
              >
                <p className="text-[10px] font-medium text-stone-400">{MONTH_SHORT[m]}</p>
                <p className="text-[9px] font-bold mt-0.5" style={{ color: st.fg }}>{st.label.slice(0, 3)}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tratamentos da estação atual */}
      <div>
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">
          Tratamentos preventivos · agora: {SEASON_LABEL[currentSeason]}
        </h3>
        <div className="space-y-2">
          {currentSeasonGuide.map(t => (
            <TreatmentCard key={t.key} t={t} plant={plant} highlight today={today} />
          ))}
          {currentSeasonGuide.length === 0 && (
            <p className="text-xs text-stone-400 italic">Sem tratamentos preventivos nesta estação.</p>
          )}
        </div>
      </div>

      {/* Todos os tratamentos */}
      <div>
        <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wide mb-2">Todos os tratamentos do ano</h3>
        <div className="space-y-2">
          {guide.map((t, i) => (
            <TreatmentCard key={`${t.key}-${t.season}-${i}`} t={t} plant={plant} today={today} />
          ))}
        </div>
      </div>

      {/* Aviso período de segurança */}
      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
        <p className="text-xs text-amber-700 leading-relaxed flex items-start gap-1.5">
          <Clock className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          <span><b>Período de segurança:</b> nunca colher antes de passar o número de dias indicado em cada produto. Aplica ao entardecer e evita horas de calor.</span>
        </p>
      </div>
    </div>
  );
}

function TreatmentCard({ t, plant, highlight, today }) {
  return (
    <div className={`bg-white rounded-xl border overflow-hidden ${highlight ? "border-emerald-200 ring-1 ring-emerald-100" : "border-stone-200/80"}`}>
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0" style={{ background: t.color }} />
        <div className="flex-1 p-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">{t.emoji}</span>
            <span className="font-semibold text-stone-800 text-sm">{t.label}</span>
            {highlight && (
              <span className="ml-auto text-[10px] font-bold text-emerald-600 bg-emerald-50 rounded-full px-2 py-0.5">AGORA</span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            <span className="text-xs text-stone-500">{t.type}</span>
            <span className="text-xs text-stone-300">·</span>
            <span className="text-xs" style={{ color: t.color }}>{SEASON_LABEL[t.season]}</span>
            {t.organic ? (
              <span className="text-xs bg-green-50 text-green-700 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" /> Biológico
              </span>
            ) : (
              <span className="text-xs bg-stone-100 text-stone-500 rounded-full px-1.5 py-0.5">Químico</span>
            )}
          </div>
          <div className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
            <Bug className="w-3 h-3" /> {t.targets}
          </div>
          <p className="text-xs text-stone-500 mt-1"><b className="text-stone-600">Quando:</b> {t.when}</p>
          <p className="text-xs text-stone-600 leading-relaxed mt-1">{t.how}</p>
          <div className="mt-1.5 text-xs text-amber-600 flex items-center gap-1">
            <Clock className="w-3 h-3" /> {t.safetyDays} dia{t.safetyDays !== 1 ? "s" : ""} de segurança até colher
          </div>

          {/* Produtos fitofarmacêuticos */}
          {t.products?.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5 text-stone-500" /> Produtos fitofarmacêuticos
              </p>
              {t.products.map((p, i) => (
                <div key={i} className="flex items-center gap-2 bg-blue-50/50 rounded-lg px-2.5 py-1.5">
                  <span className="text-sm font-medium text-stone-800">{p.name}</span>
                  <span className="text-xs text-stone-400">· {p.active}</span>
                  <span className="ml-auto text-xs font-semibold text-blue-600">{p.dose}</span>
                </div>
              ))}
            </div>
          )}

          {/* Lembrete */}
          <ReminderForm
            treatment={t}
            plantName={plant.name}
            plantEmoji={plant.emoji}
            defaultDate={today}
          />
        </div>
      </div>
    </div>
  );
}