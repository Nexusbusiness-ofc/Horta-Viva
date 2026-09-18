import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, Bell, BellOff, Droplets, PawPrint, Scissors, Sprout, Plus, Box, Check, X } from "lucide-react";
import { computeDailyTasks, countTasks } from "@/lib/dailyTasks";
import { notifyPermission, requestNotifyPermission, sendNotify, shouldNotifyToday, notifySupported } from "@/lib/notify";
import { markPlantingWatered, getLastWateredMap } from "@/lib/smartAlerts";
import SmartAlertsBanner from "@/components/quinta/SmartAlertsBanner";
import Poda3DViewer from "@/components/podas/Poda3DViewer";
import Monda3DViewer from "@/components/mondas/Monda3DViewer";
import { useToast } from "@/components/ui/use-toast";
import { cachedList } from "@/lib/offlineCatalog";
import NavigationDrawer from "@/components/home/NavigationDrawer";

const SECTIONS = [
  { key: "rega", icon: Droplets, label: "Rega", color: "#0ea5e9", emoji: "💧" },
  { key: "animais", icon: PawPrint, label: "Animais", color: "#ea580c", emoji: "🐾" },
  { key: "podas", icon: Scissors, label: "Podas", color: "#16a34a", emoji: "✂️" },
  { key: "mondas", icon: Sprout, label: "Mondas", color: "#84cc16", emoji: "🌱" },
];

function TaskItem({ task, onWater, onOpen3D }) {
  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-sm w-full min-w-0">
      <div className="flex items-stretch w-full min-w-0">
        <div className="w-1.5 shrink-0" style={{ background: task.color }} />
        <div className="flex-1 min-w-0 p-3 sm:p-3.5 space-y-2">
          {/* Cabeçalho do item */}
          <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 mt-0.5"
              style={{ backgroundColor: task.color + "15" }}
            >
              {task.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 flex-wrap">
                <p className="font-semibold text-stone-800 text-sm leading-snug break-words">
                  {task.title}
                </p>
                {task.wateredToday && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Check className="w-3 h-3" /> Regado Hoje
                  </span>
                )}
                {task.isOverdue && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Atrasada
                  </span>
                )}
              </div>
              {task.detail && (
                <p className="text-xs text-stone-500 leading-snug break-words mt-0.5">
                  {task.detail}
                </p>
              )}
            </div>
          </div>

          {/* Como fazer */}
          {task.how && (
            <div className="bg-stone-50 rounded-xl p-2.5 min-w-0">
              <p className="text-xs font-semibold text-stone-700 mb-0.5 flex items-center gap-1">
                <span>📋</span> Como fazer
              </p>
              <p className="text-xs text-stone-600 leading-relaxed break-words">
                {task.how}
              </p>
            </div>
          )}

          {/* Dica de ouro da poda */}
          {task.goldenRule && (
            <div className="bg-emerald-50/70 border border-emerald-100 rounded-xl p-2.5 min-w-0">
              <p className="text-xs font-semibold text-emerald-900 mb-0.5 flex items-center gap-1">
                <span>⭐</span> Regra de Ouro da Poda
              </p>
              <p className="text-xs text-emerald-800 leading-relaxed break-words">
                {task.goldenRule}
              </p>
            </div>
          )}

          {/* Espaçamento (quando aplicável a mondas) */}
          {task.spacing && (
            <div className="bg-lime-50/70 rounded-xl p-2.5 min-w-0">
              <p className="text-xs font-semibold text-lime-800 mb-0.5 flex items-center gap-1">
                <span>📏</span> Espaçamento recomendado
              </p>
              <p className="text-xs text-stone-600 leading-relaxed break-words">
                {task.spacing}
              </p>
            </div>
          )}

          {/* Dicas */}
          {task.tips && (
            <div className="bg-emerald-50/70 rounded-xl p-2.5 min-w-0">
              <p className="text-xs font-semibold text-emerald-800 mb-0.5 flex items-center gap-1">
                <span>💡</span> Dica
              </p>
              <p className="text-xs text-stone-600 leading-relaxed break-words">
                {task.tips}
              </p>
            </div>
          )}

          {/* Cuidados dos animais */}
          {task.care && (
            <div className="bg-amber-50/70 rounded-xl p-2.5 min-w-0">
              <p className="text-xs font-semibold text-amber-800 mb-0.5 flex items-center gap-1">
                <span>🩺</span> Cuidados
              </p>
              <p className="text-xs text-stone-600 leading-relaxed break-words">
                {task.care}
              </p>
            </div>
          )}

          {/* Botões de Ação Interativa */}
          <div className="flex items-center gap-2 pt-1 flex-wrap">
            {task.plantingId && (
              <button
                onClick={() => onWater(task.plantingId, task.plantName || task.title)}
                disabled={task.wateredToday}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                  task.wateredToday
                    ? "bg-emerald-600 text-white cursor-default"
                    : task.isOverdue
                    ? "bg-rose-600 hover:bg-rose-700 text-white active:scale-95"
                    : "bg-sky-600 hover:bg-sky-700 text-white active:scale-95"
                }`}
              >
                {task.wateredToday ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Regado Hoje ✓</span>
                  </>
                ) : (
                  <>
                    <Droplets className="w-3.5 h-3.5" />
                    <span>Regar Agora ✓</span>
                  </>
                )}
              </button>
            )}

            {task.diagramType && (
              <button
                onClick={() =>
                  onOpen3D({
                    type: task.id.startsWith("poda") ? "poda" : "monda",
                    name: task.podaName || task.mondaName || task.title,
                    diagramType: task.diagramType,
                    spacingCm: task.spacing,
                  })
                }
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
              >
                <Box className="w-3.5 h-3.5" />
                <span>Ver Esquema 3D</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TarefasHoje() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState({ rega: [], animais: [], podas: [], mondas: [] });
  const [data, setData] = useState({
    plantings: [],
    plants: [],
    myAnimals: [],
    farmAnimals: [],
    podas: [],
    mondas: []
  });
  const [active3DModal, setActive3DModal] = useState(null);
  const [perm, setPerm] = useState(notifyPermission());
  const [hasData, setHasData] = useState(true);
  const { toast } = useToast();

  const loadAll = useCallback(async () => {
    try {
      const [plantings, plants, myAnimals, farmAnimals, podas, mondas] = await Promise.all([
        base44.entities.Planting.list("-planted_date").catch(() => []),
        cachedList("plants", () => base44.entities.Plant.list()),
        base44.entities.MyAnimal.list().catch(() => []),
        cachedList("farmanimals", () => base44.entities.FarmAnimal.list()),
        cachedList("podas", () => base44.entities.Podas.list()),
        cachedList("mondas", () => base44.entities.Mondas.list()),
      ]);
      const raw = { plantings, plants, myAnimals, farmAnimals, podas, mondas };
      setData(raw);
      const t = computeDailyTasks(raw);
      setTasks(t);
      setHasData(plantings.length > 0 || myAnimals.length > 0);
      if (notifySupported() && Notification.permission === "granted" && shouldNotifyToday()) {
        const n = countTasks(t);
        if (n > 0) {
          const parts = [];
          if (t.rega?.length) parts.push(`${t.rega.length} rega(s)`);
          if (t.animais?.length) parts.push(`${t.animais.length} animal(is)`);
          if (t.podas?.length) parts.push(`${t.podas.length} poda(s)`);
          if (t.mondas?.length) parts.push(`${t.mondas.length} monda(s)`);
          sendNotify("Tarefas de hoje 🌱", `Tens ${n} tarefas: ${parts.join(", ")}.`);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // Atualizar quando houver rega
  useEffect(() => {
    const handleUpdate = () => {
      if (data.plantings.length > 0) {
        setTasks(computeDailyTasks(data));
      }
    };
    window.addEventListener("hortaviva_watered_update", handleUpdate);
    return () => window.removeEventListener("hortaviva_watered_update", handleUpdate);
  }, [data]);

  const handleWater = (plantingId, plantName) => {
    markPlantingWatered(plantingId);
    toast({
      title: "Rega Registada! 💧",
      description: `${plantName} foi marcada como regada hoje com sucesso.`,
    });
    setTasks(computeDailyTasks(data));
  };

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
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-sm shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-teal-300/50 shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-stone-800 leading-tight truncate">Tarefas de Hoje</h1>
              <p className="text-xs text-stone-500 truncate">Rega, animais, podas e mondas</p>
            </div>
            <button
              onClick={enableNotifications}
              className={`shrink-0 flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-2 rounded-xl shadow-sm transition-all active:scale-95 ${
                perm === "granted"
                  ? "bg-teal-100 text-teal-700"
                  : "bg-gradient-to-r from-teal-500 to-emerald-600 text-white"
              }`}
            >
              {perm === "granted" ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
              <span className="hidden sm:inline">{perm === "granted" ? "Ativadas" : "Ativar"}</span>
            </button>
            <NavigationDrawer />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5 w-full min-w-0">
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
        ) : (
          <>
            {/* Banner de Alertas Inteligentes da Quinta */}
            <SmartAlertsBanner
              plantings={data.plantings}
              plants={data.plants}
              myAnimals={data.myAnimals}
              farmAnimals={data.farmAnimals}
              podas={data.podas}
              mondas={data.mondas}
              onOpen3D={(modalData) => setActive3DModal(modalData)}
            />

            {/* Resumo das secções */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {SECTIONS.map(s => (
                <div key={s.key} className="bg-white rounded-2xl border border-stone-200/80 p-3 sm:p-4 text-center shadow-sm min-w-0">
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: s.color }}>{tasks[s.key]?.length || 0}</p>
                  <p className="text-xs text-stone-500 mt-0.5 truncate">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Secções de tarefas detalhadas com botões interativos */}
            {SECTIONS.map(s => {
              const list = tasks[s.key] || [];
              if (list.length === 0) return null;
              const Icon = s.icon;
              return (
                <section key={s.key} className="w-full min-w-0">
                  <div className="flex items-center gap-2 mb-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: s.color + "15" }}>
                      <Icon className="w-4 h-4" style={{ color: s.color }} />
                    </div>
                    <h2 className="text-sm font-bold text-stone-700 truncate">{s.label}</h2>
                    <span className="text-xs text-stone-400 shrink-0">({list.length})</span>
                  </div>
                  <div className="space-y-2.5 w-full min-w-0">
                    {list.map(t => (
                      <TaskItem
                        key={t.id}
                        task={t}
                        onWater={handleWater}
                        onOpen3D={(modalData) => setActive3DModal(modalData)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </>
        )}
      </main>

      <footer className="text-center pt-4 pb-28 text-xs px-4">
        <span className="bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 bg-clip-text text-transparent font-medium">
          🌱 Minha Horta — Nunca te esqueças de nada
        </span>
      </footer>

      {/* Modal 3D Interativo acionado das Tarefas */}
      {active3DModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-150"
          onClick={() => setActive3DModal(null)}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92dvh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-stone-50/80">
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl">{active3DModal.type === "poda" ? "✂️" : "🌱"}</span>
                <div>
                  <h3 className="font-extrabold text-stone-800 text-sm sm:text-base leading-tight">
                    Esquema 3D: {active3DModal.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {active3DModal.type === "poda" ? "Técnica de corte e poda de pomar" : "Técnica de desbaste e monda de horta"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActive3DModal(null)}
                className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
                title="Fechar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-4 overflow-y-auto">
              {active3DModal.type === "poda" ? (
                <Poda3DViewer
                  diagramType={active3DModal.diagramType}
                  name={active3DModal.name}
                />
              ) : (
                <Monda3DViewer
                  diagramType={active3DModal.diagramType}
                  name={active3DModal.name}
                  spacingCm={active3DModal.spacingCm}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}