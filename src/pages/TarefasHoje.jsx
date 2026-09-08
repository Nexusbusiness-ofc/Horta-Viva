import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, Bell, BellOff, Droplets, PawPrint, Scissors, Plus } from "lucide-react";
import { computeDailyTasks, countTasks } from "@/lib/dailyTasks";
import { notifyPermission, requestNotifyPermission, sendNotify, shouldNotifyToday, notifySupported } from "@/lib/notify";
import { useToast } from "@/components/ui/use-toast";
import { cachedList } from "@/lib/offlineCatalog";

const SECTIONS = [
  { key: "rega", icon: Droplets, label: "Rega", color: "#0ea5e9", emoji: "💧" },
  { key: "animais", icon: PawPrint, label: "Animais", color: "#ea580c", emoji: "🐾" },
  { key: "podas", icon: Scissors, label: "Podas", color: "#16a34a", emoji: "✂️" },
];

function TaskItem({ task }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm">
      <div className="flex items-stretch">
        <div className="w-1.5 shrink-0" style={{ background: task.color }} />
        <div className="flex-1 p-3.5">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
              style={{ backgroundColor: task.color + "15" }}
            >
              {task.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 text-sm truncate">{task.title}</p>
              {task.detail && <p className="text-xs text-stone-500 truncate">{task.detail}</p>}
            </div>
          </div>
          {task.how && (
            <div className="mt-2 bg-stone-50 rounded-lg p-2.5">
              <p className="text-xs text-stone-600 leading-relaxed">{task.how}</p>
            </div>
          )}
          {task.care && (
            <div className="mt-1.5 bg-amber-50 rounded-lg p-2.5">
              <p className="text-xs font-semibold text-amber-700 mb-0.5">🩺 Cuidados</p>
              <p className="text-xs text-stone-600 leading-relaxed">{task.care}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TarefasHoje() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState({ rega: [], animais: [], podas: [] });
  const [perm, setPerm] = useState(notifyPermission());
  const [hasData, setHasData] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const [plantings, plants, myAnimals, farmAnimals, podas] = await Promise.all([
          base44.entities.Planting.list("-planted_date").catch(() => []),
          cachedList("plants", () => base44.entities.Plant.list()),
          base44.entities.MyAnimal.list().catch(() => []),
          cachedList("farmanimals", () => base44.entities.FarmAnimal.list()),
          cachedList("podas", () => base44.entities.Podas.list()),
        ]);
        const t = computeDailyTasks({ plantings, plants, myAnimals, farmAnimals, podas });
        setTasks(t);
        setHasData(plantings.length > 0 || myAnimals.length > 0);
        if (notifySupported() && Notification.permission === "granted" && shouldNotifyToday()) {
          const n = countTasks(t);
          if (n > 0) {
            const parts = [];
            if (t.rega.length) parts.push(`${t.rega.length} rega(s)`);
            if (t.animais.length) parts.push(`${t.animais.length} animal(is)`);
            if (t.podas.length) parts.push(`${t.podas.length} poda(s)`);
            sendNotify("Tarefas de hoje 🌱", `Tens ${n} tarefas: ${parts.join(", ")}.`);
          }
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const enableNotifications = async () => {
    const p = await requestNotifyPermission();
    setPerm(p);
    if (p === "granted") {
      toast({ title: "Lembretes ativados ✅", description: "Vais receber notificações das tuas tarefas diárias." });
      const n = countTasks(tasks);
      if (n > 0) sendNotify("Tarefas de hoje 🌱", `Tens ${n} tarefas na tua quinta.`);
    } else if (p === "denied") {
      toast({ variant: "destructive", title: "Notificações bloqueadas", description: "Ativa-as nas definições do navegador." });
    }
  };

  const total = countTasks(tasks);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-teal-50 via-emerald-50/40 to-lime-50/50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-teal-50/60 to-white/90 backdrop-blur-lg border-b border-teal-100/60">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-teal-300/50">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800 leading-none">Tarefas de Hoje</h1>
              <p className="text-xs text-stone-500">Rega, animais e podas — o que fazer hoje</p>
            </div>
            <button
              onClick={enableNotifications}
              className={`shrink-0 flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-xl shadow-sm transition-all active:scale-95 ${
                perm === "granted"
                  ? "bg-teal-100 text-teal-700"
                  : "bg-gradient-to-r from-teal-500 to-emerald-600 text-white"
              }`}
            >
              {perm === "granted" ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span className="hidden sm:inline">{perm === "granted" ? "Ativadas" : "Ativar"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          </div>
        ) : !hasData ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-lg font-semibold text-stone-700 mb-1">A tua quinta está vazia</h2>
            <p className="text-sm text-stone-500 mb-6">Adiciona plantações e animais para receberes as tuas tarefas diárias.</p>
            <Link
              to="/minha-quinta"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 via-emerald-600 to-green-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-teal-200/50 hover:shadow-xl transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Ir para a Minha Quinta
            </Link>
          </div>
        ) : total === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌿</div>
            <h2 className="text-lg font-semibold text-stone-700 mb-1">Tudo em dia!</h2>
            <p className="text-sm text-stone-500">Não tens tarefas de rega marcadas para hoje.</p>
          </div>
        ) : (
          <>
            {/* Resumo */}
            <div className="grid grid-cols-3 gap-3">
              {SECTIONS.map(s => (
                <div key={s.key} className="bg-white rounded-2xl border border-stone-200/80 p-4 text-center shadow-sm">
                  <p className="text-2xl font-bold" style={{ color: s.color }}>{tasks[s.key].length}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Banner de notificações se não ativas */}
            {perm !== "granted" && (
              <button
                onClick={enableNotifications}
                className="w-full flex items-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-2xl p-4 shadow-lg shadow-teal-200/40 active:scale-[0.99] transition-all text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Ativar lembretes automáticos</p>
                  <p className="text-xs text-white/80">Receber notificação diária com as tuas tarefas</p>
                </div>
              </button>
            )}

            {/* Secções de tarefas */}
            {SECTIONS.map(s => {
              const list = tasks[s.key];
              if (list.length === 0) return null;
              const Icon = s.icon;
              return (
                <section key={s.key}>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: s.color + "15" }}>
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <h2 className="text-sm font-bold text-stone-700">{s.label}</h2>
                    <span className="text-xs text-stone-400">({list.length})</span>
                  </div>
                  <div className="space-y-2">
                    {list.map(t => <TaskItem key={t.id} task={t} />)}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>

      <footer className="text-center py-6 text-xs">
        <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent font-medium">
          🌱 Minha Horta — Nunca te esqueças de nada
        </span>
      </footer>
    </div>
  );
}