import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ArrowLeft, MapPin, Bug, ShieldCheck, FlaskConical, Clock, Bell, Check, Trash2, Sprout, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { generateAllCuras, groupCuras, TREATMENTS, HERBICIDES } from "@/lib/careSchedule";
import ReminderForm from "@/components/quinta/ReminderForm";
import HerbicideCard from "@/components/curas/HerbicideCard";
import HerbicideGuides from "@/components/curas/HerbicideGuides";
import { useToast } from "@/components/ui/use-toast";
import { cachedList } from "@/lib/offlineCatalog";

const MONTH_NAMES = ["", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

function fmtDate(d) {
  if (!d) return "—";
  const date = new Date(d + "T00:00");
  return `${date.getDate()} ${MONTH_NAMES[date.getMonth() + 1]}`;
}

function isToday(d) {
  return d === new Date().toISOString().split("T")[0];
}

export default function CalendarioCuras() {
  const [plantings, setPlantings] = useState([]);
  const [plants, setPlants] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadReminders = async () => {
    try {
      setReminders(await base44.entities.Reminder.list("date"));
    } catch (e) {}
  };

  useEffect(() => {
    Promise.all([
      base44.entities.Planting.list("-planted_date").catch(() => []),
      cachedList("plants", () => base44.entities.Plant.list()),
    ]).then(([p, allPlants]) => {
      setPlantings(p || []);
      setPlants(allPlants || []);
    }).finally(() => setLoading(false));
    loadReminders();
  }, []);

  const curas = useMemo(() => generateAllCuras(plantings, plants), [plantings, plants]);
  const groups = useMemo(() => groupCuras(curas), [curas]);

  const activeCount = plantings.filter(p => p.status !== "Colhida").length;
  const todayCount = groups.hoje.tasks.length;
  const overdueCount = groups.atrasadas.tasks.length;

  const markReminderDone = async (id) => {
    await base44.entities.Reminder.update(id, { done: true });
    setReminders(prev => prev.filter(r => r.id !== id));
    toast({ title: "Tratamento concluído", description: "Lembrete marcado como feito." });
  };

  const deleteReminder = async (id) => {
    await base44.entities.Reminder.delete(id);
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-green-50/40 to-lime-50/50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-emerald-50/60 to-white/90 backdrop-blur-lg border-b border-emerald-100/60">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/minha-quinta" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-300/50">
              <FlaskConical className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800 leading-none">Curas &amp; Tratamentos</h1>
              <p className="text-xs text-stone-500">Produtos fitofarmacêuticos · quando e como aplicar</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
          </div>
        ) : plantings.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🧪</div>
            <h2 className="text-lg font-semibold text-stone-700 mb-1">Sem plantações para tratar</h2>
            <p className="text-sm text-stone-500 mb-6">Adiciona plantações na Minha Quinta para veres os tratamentos agendados.</p>
            <Link
              to="/minha-quinta"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all active:scale-95"
            >
              <Sprout className="w-4 h-4" /> Ir para a Minha Quinta
            </Link>
          </div>
        ) : (
          <>
            {/* Resumo */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl border border-stone-200/80 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-emerald-600">{activeCount}</p>
                <p className="text-xs text-stone-500 mt-0.5">Plantações ativas</p>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200/80 p-4 text-center shadow-sm">
                <p className="text-2xl font-bold text-amber-600">{todayCount}</p>
                <p className="text-xs text-stone-500 mt-0.5">Curas hoje</p>
              </div>
              <div className="bg-white rounded-2xl border border-stone-200/80 p-4 text-center shadow-sm">
                <p className={`text-2xl font-bold ${overdueCount > 0 ? "text-red-500" : "text-stone-400"}`}>{overdueCount}</p>
                <p className="text-xs text-stone-500 mt-0.5">Atrasadas</p>
              </div>
            </div>

            {/* Meus lembretes */}
            {reminders.filter(r => !r.done).length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="w-4 h-4 text-amber-500" />
                  <h2 className="text-sm font-bold text-stone-700">Os meus lembretes</h2>
                </div>
                <div className="space-y-2">
                  {reminders.filter(r => !r.done).map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                      <div className="flex items-center gap-3 p-3">
                        <span className="text-xl shrink-0">{r.plant_emoji || "🌱"}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-stone-800 truncate">{r.product_name}</p>
                          <p className="text-xs text-stone-500 truncate">{r.plant_name}</p>
                        </div>
                        <span className="text-xs font-medium text-amber-700 shrink-0">{fmtDate(r.date)}</span>
                        <button onClick={() => markReminderDone(r.id)} className="w-7 h-7 rounded-full bg-green-100 hover:bg-green-200 flex items-center justify-center text-green-600 transition-colors shrink-0" title="Concluir">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteReminder(r.id)} className="w-7 h-7 rounded-full bg-stone-100 hover:bg-red-100 hover:text-red-500 flex items-center justify-center text-stone-400 transition-colors shrink-0" title="Eliminar">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      {r.how && <p className="text-xs text-stone-500 bg-stone-50 px-3 py-2 leading-relaxed">{r.how}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Grupos de curas */}
            {Object.entries(groups).map(([key, group]) => {
              if (group.tasks.length === 0) return null;
              return (
                <section key={key}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{group.emoji}</span>
                    <h2 className="text-sm font-bold text-stone-700">{group.label}</h2>
                    <span className="text-xs text-stone-400">({group.tasks.length})</span>
                  </div>
                  <div className="space-y-2">
                    {group.tasks.map((t, i) => (
                      <CuraCard key={`${t.planting.id}-${t.treatment.key}-${t.date}-${i}`} cura={t} isToday={isToday(t.date)} />
                    ))}
                  </div>
                </section>
              );
            })}

            {curas.length === 0 && (
              <div className="text-center py-12">
                <p className="text-sm text-stone-400">Nenhuma cura agendada para as tuas plantações ativas.</p>
              </div>
            )}

            {/* Referência de pragas */}
            <PestReference />
          </>
        )}

        {/* Herbicidas — controlo de ervas (sempre visível) */}
        <section>
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-4 h-4 text-lime-600" />
            <h2 className="text-sm font-bold text-stone-700">Herbicidas — controlo de ervas</h2>
          </div>
          <p className="text-xs text-stone-500 mb-3">Como preparar, como usar, em que plantações e quando aplicar. Cuidado — a maioria é não seletiva!</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(HERBICIDES).map(h => (
              <HerbicideCard key={h.key} herb={h} />
            ))}
          </div>
        </section>

        {/* Guias visuais — herbicidas naturais */}
        <HerbicideGuides />
      </main>

      <footer className="text-center py-6 text-xs">
        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-medium">
          🌱 Minha Horta — Cultiva com sabedoria
        </span>
      </footer>
    </div>
  );
}

function CuraCard({ cura }) {
  const { planting, treatment, date } = cura;
  const plantColor = planting.plant_color || "#84cc16";
  const today = new Date().toISOString().split("T")[0];
  const defaultDate = date >= today ? date : today;

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0" style={{ background: treatment.color }} />
        <div className="flex-1 p-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: plantColor + "15" }}
            >
              {planting.plant_emoji || "🌱"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-800 text-sm truncate">{planting.plant_name}</span>
                {planting.location && (
                  <span className="text-xs text-stone-400 flex items-center gap-0.5 shrink-0">
                    <MapPin className="w-3 h-3" /> {planting.location}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-base">{treatment.emoji}</span>
                <span className="text-xs font-semibold" style={{ color: treatment.color }}>{treatment.label}</span>
                <span className="text-xs text-stone-400">· {treatment.type}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-semibold text-stone-400">{date === today ? "Hoje" : fmtDate(date)}</p>
            </div>
          </div>

          {/* Alvo e badges */}
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-xs bg-red-50 text-red-600 rounded-full px-2 py-0.5 flex items-center gap-1">
              <Bug className="w-3 h-3" /> {treatment.targets}
            </span>
            {treatment.organic ? (
              <span className="text-xs bg-green-50 text-green-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Biológico
              </span>
            ) : (
              <span className="text-xs bg-stone-100 text-stone-500 rounded-full px-2 py-0.5">Químico</span>
            )}
            <span className="text-xs bg-amber-50 text-amber-600 rounded-full px-2 py-0.5 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {treatment.safetyDays}d segurança
            </span>
          </div>

          {/* Quando aplicar */}
          <p className="mt-2 text-xs text-stone-500"><b className="text-stone-600">Quando:</b> {treatment.when}</p>

          {/* Como aplicar */}
          <div className="mt-1.5 bg-stone-50 rounded-lg p-2.5">
            <p className="text-xs text-stone-600 leading-relaxed">{treatment.how}</p>
          </div>

          {/* Produtos fitofarmacêuticos */}
          {treatment.products?.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-xs font-semibold text-stone-600 flex items-center gap-1">
                <FlaskConical className="w-3.5 h-3.5 text-stone-500" /> Produtos fitofarmacêuticos
              </p>
              {treatment.products.map((p, i) => (
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
            treatment={treatment}
            plantName={planting.plant_name}
            plantEmoji={planting.plant_emoji}
            plantingId={planting.id}
            defaultDate={defaultDate}
          />
        </div>
      </div>
    </div>
  );
}

function PestReference() {
  const rows = [
    { pest: "Pulgões (afídeos)", symptom: "Folhas encaracoladas, melada pegajosa", bio: "neem", chem: "deltametrina" },
    { pest: "Lagartas / traças", symptom: "Folhas comidas, orifícios, excrementos", bio: "bt", chem: "deltametrina" },
    { pest: "Mosca branca", symptom: "Pequenas moscas brancas ao tocar", bio: "neem", chem: "deltametrina" },
    { pest: "Oídio (podridão branca)", symptom: "Pó branco nas folhas", bio: "enxofre", chem: "tebuconazol" },
    { pest: "Míldio", symptom: "Manchas amarelas/marrón, penugem branca", bio: "calda_bordalesa", chem: "mancozebe" },
    { pest: "Ácaros (aranhiço)", symptom: "Folhas prateadas/amarelas, teias finas", bio: "enxofre", chem: "abamectina" },
    { pest: "Cochonilhas", symptom: "Bolinhas/crostas marrón nos caules", bio: "sabao", chem: "oleo_inverno" },
    { pest: "Ferrugem", symptom: "Pústulas alaranjadas nas folhas", bio: "enxofre", chem: "tebuconazol" },
    { pest: "Mosca mineira", symptom: "Galerias/minas nas folhas", bio: "neem", chem: "abamectina" },
  ];

  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <Bug className="w-4 h-4 text-orange-500" />
        <h2 className="text-sm font-bold text-stone-700">Referência de pragas (cura curativa)</h2>
      </div>
      <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden divide-y divide-stone-100">
        {rows.map((row, i) => (
          <div key={i} className="p-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-800">{row.pest}</p>
                <p className="text-xs text-stone-500">{row.symptom}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              <span className="text-xs bg-green-50 text-green-700 rounded-full px-2 py-0.5 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> {TREATMENTS[row.bio].label}
              </span>
              <span className="text-xs bg-stone-100 text-stone-600 rounded-full px-2 py-0.5">
                {TREATMENTS[row.chem].emoji} {TREATMENTS[row.chem].label} (químico)
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}