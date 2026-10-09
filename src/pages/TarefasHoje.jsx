import React, { useState, useEffect, useCallback, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Loader2, ArrowLeft, Bell, BellOff, Droplets, PawPrint, Scissors, Sprout, Plus, Box, Check, X, Lock } from "lucide-react";
import { computeDailyTasks, countTasks } from "@/lib/dailyTasks";
import { notifyPermission, requestNotifyPermission, sendNotify, shouldNotifyToday, notifySupported } from "@/lib/notify";
import { markPlantingWatered } from "@/lib/smartAlerts";
import SmartAlertsBanner from "@/components/quinta/SmartAlertsBanner";
import Poda3DViewer from "@/components/podas/Poda3DViewer";
import Monda3DViewer from "@/components/mondas/Monda3DViewer";
import { useToast } from "@/components/ui/use-toast";
import { cachedList } from "@/lib/offlineCatalog";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import { useSubscription } from "@/lib/subscription";
import UpgradeModal from "@/components/subscription/UpgradeModal";
import { useRegionalPreferences } from '@/lib/RegionalPreferencesContext.jsx';
import { useWeather } from '@/lib/WeatherContext.jsx';
import { useI18n } from '@/lib/I18nContext';
import WeatherCard from '@/components/weather/WeatherCard.jsx';
import { readAccountScope } from '@/lib/accountScope';

const emptyFarmData = () => ({ plantings: [], plants: [], myAnimals: [], farmAnimals: [], podas: [], mondas: [] });
const emptyTasks = () => ({ rega: [], animais: [], podas: [], mondas: [] });
const TASK_DATA_KEYS = new Set(['hortaviva_plantings', 'hortaviva_myanimals', 'hortaviva_plantings_watered', 'hortaviva_mascot_v1', 'hortaviva_deleted_ids']);
const ACCOUNT_KEYS = new Set(['hortaviva_account_owner_v1', 'hortaviva_current_user', 'hortaviva_google_user_info', 'hortaviva_logged_out']);

const SECTIONS = [
  { key: "rega", icon: Droplets, label: "Rega", color: "#0ea5e9", emoji: "💧" },
  { key: "animais", icon: PawPrint, label: "Animais", color: "#ea580c", emoji: "🐾" },
  { key: "podas", icon: Scissors, label: "Podas", color: "#16a34a", emoji: "✂️" },
  { key: "mondas", icon: Sprout, label: "Mondas", color: "#84cc16", emoji: "🌱" },
];

function TaskItem({ task, onWater, onOpen3D, canAccessPruning3D }) {
  const { t } = useI18n();
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
                    <Check className="w-3 h-3" /> {t('tasks.wateredToday')}
                  </span>
                )}
                {task.isOverdue && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {t('tasks.overdue')}
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

          {task.weatherAdvice?.map(advice => <p key={advice.kind} className="rounded-xl border border-sky-100 bg-sky-50 p-2.5 text-xs leading-relaxed text-sky-900">{advice.message}</p>)}

          {/* Como fazer */}
          {task.how && (
            <div className="bg-stone-50 rounded-xl p-2.5 min-w-0">
              <p className="text-xs font-semibold text-stone-700 mb-0.5 flex items-center gap-1">
                <span>📋</span> {t('tasks.how')}
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
                <span>⭐</span> {t('tasks.goldenRule')}
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
                <span>📏</span> {t('tasks.spacing')}
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
                <span>💡</span> {t('tasks.tip')}
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
                <span>🩺</span> {t('tasks.care')}
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
                    <span>{t('tasks.wateredToday')} ✓</span>
                  </>
                ) : (
                  <>
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{t('tasks.recordWater')}</span>
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
                <span>{t('tasks.view3D')}</span>
                {!canAccessPruning3D && <Lock className="w-3 h-3 text-amber-300 shrink-0" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TarefasHoje() {
  const { preferences } = useRegionalPreferences();
  const { weather } = useWeather();
  const { t } = useI18n();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState(emptyTasks);
  const [data, setData] = useState(emptyFarmData);
  const { canAccessPruning3D } = useSubscription();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [active3DModal, setActive3DModal] = useState(null);
  const [perm, setPerm] = useState(notifyPermission());
  const [hasData, setHasData] = useState(true);
  const { toast } = useToast();
  const sequence = useRef(0);
  const mounted = useRef(true);
  const loadedScope = useRef(null);
  const visibleScope = useRef(readAccountScope());

  const handleOpen3D = (modalData) => {
    if (loadedScope.current === null || loadedScope.current !== readAccountScope()) return;
    if (!canAccessPruning3D) {
      setShowUpgradeModal(true);
      return;
    }
    setActive3DModal(modalData);
  };

  const loadAll = useCallback(async () => {
    const currentSequence = ++sequence.current;
    const scope = readAccountScope();
    const previousScope = loadedScope.current;
    const current = () => mounted.current && currentSequence === sequence.current && scope !== null && scope === readAccountScope();
    loadedScope.current = null;
    if (scope === null || visibleScope.current !== scope) {
      visibleScope.current = scope;
      setData(emptyFarmData()); setTasks(emptyTasks()); setHasData(false);
      setActive3DModal(null); setShowUpgradeModal(false);
    }
    if (scope === null) { setLoading(false); return; }
    setLoading(true);
    try {
      const [plantings, plants, myAnimals, farmAnimals, podas, mondas] = await Promise.all([
        base44.entities.Planting.list("-planted_date").catch(() => []),
        cachedList("plants", () => base44.entities.Plant.list()),
        base44.entities.MyAnimal.list().catch(() => []),
        cachedList("farmanimals", () => base44.entities.FarmAnimal.list()),
        cachedList("podas", () => base44.entities.Podas.list()),
        cachedList("mondas", () => base44.entities.Mondas.list()),
      ]);
      if (!current()) return;
      const raw = { plantings, plants, myAnimals, farmAnimals, podas, mondas };
      loadedScope.current = scope;
      setData(raw);
      setHasData(plantings.length > 0 || myAnimals.length > 0);
    } catch {
      // A catalogue failure can retain the last readable list from this account.
      if (current() && previousScope === scope) loadedScope.current = scope;
    } finally {
      if (current()) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    loadAll();
    let queued;
    const schedule = () => {
      // Invalidate pending reads immediately; coalesce the events generated by
      // a watering record, its XP reward and the subsequent Drive snapshot.
      ++sequence.current; loadedScope.current = null;
      clearTimeout(queued); setLoading(true);
      if (visibleScope.current !== readAccountScope()) {
        setData(emptyFarmData()); setTasks(emptyTasks()); setHasData(false);
        setActive3DModal(null); setShowUpgradeModal(false);
      }
      queued = setTimeout(loadAll, 60);
    };
    const dataChanged = event => {
      const key = event.detail?.storageKey;
      if (!key || TASK_DATA_KEYS.has(key)) schedule();
    };
    const authChanged = () => { if (visibleScope.current !== readAccountScope()) schedule(); };
    const storageChanged = event => {
      if (event.key === null || TASK_DATA_KEYS.has(event.key) || ACCOUNT_KEYS.has(event.key)) schedule();
    };
    window.addEventListener('hortaviva_remote_updated', schedule);
    window.addEventListener('hortaviva_data_changed', dataChanged);
    window.addEventListener('hortaviva_auth_changed', authChanged);
    window.addEventListener('storage', storageChanged);
    return () => {
      mounted.current = false; ++sequence.current; loadedScope.current = null;
      clearTimeout(queued);
      window.removeEventListener('hortaviva_remote_updated', schedule);
      window.removeEventListener('hortaviva_data_changed', dataChanged);
      window.removeEventListener('hortaviva_auth_changed', authChanged);
      window.removeEventListener('storage', storageChanged);
    };
  }, [loadAll]);

  useEffect(() => {
    setTasks(loadedScope.current !== null && loadedScope.current === readAccountScope() ? computeDailyTasks({ ...data, preferences, weather }) : emptyTasks());
  }, [data, preferences, weather]);

  // Atualizar quando houver rega
  useEffect(() => {
    const handleUpdate = () => {
      if (loadedScope.current !== null && loadedScope.current === readAccountScope() && data.plantings.length > 0) {
        setTasks(computeDailyTasks({ ...data, preferences, weather }));
      }
    };
    window.addEventListener("hortaviva_watered_update", handleUpdate);
    return () => window.removeEventListener("hortaviva_watered_update", handleUpdate);
  }, [data, preferences, weather]);

  const handleWater = (plantingId, plantName) => {
    if (loadedScope.current === null || loadedScope.current !== readAccountScope() || !data.plantings.some(planting => planting.id === plantingId && planting.status !== 'Colhida')) return;
    markPlantingWatered(plantingId);
    toast({
      title: t('tasks.waterSaved'),
      description: t('tasks.waterSavedDetail', { name: plantName }),
    });
    setTasks(computeDailyTasks({ ...data, preferences, weather }));
  };

  const enableNotifications = async () => {
    const scope = readAccountScope();
    const p = await requestNotifyPermission();
    setPerm(p);
    if (scope === null || scope !== readAccountScope()) return;
    if (p === "granted") {
      toast({ title: t('tasks.notificationsOn'), description: t('tasks.notificationsDetail') });
      const n = countTasks(tasks);
      if (n > 0) sendNotify(t('tasks.title'), t('tasks.summary', { count: n }));
    } else if (p === "denied") {
      toast({ variant: "destructive", title: t('tasks.notificationsBlocked'), description: t('tasks.notificationsSettings') });
    }
  };

  const total = countTasks(tasks);
  useEffect(() => {
    if (!loading && loadedScope.current !== null && loadedScope.current === readAccountScope() && total > 0 && notifySupported() && perm === 'granted' && shouldNotifyToday()) sendNotify(t('tasks.title'), t('tasks.summary', { count: total }));
  }, [loading, total, perm, t]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-teal-50 via-emerald-50/40 to-lime-50/50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-teal-50/60 to-white/90 backdrop-blur-lg border-b border-teal-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-teal-600 hover:border-teal-300 transition-colors shadow-sm shrink-0">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 via-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-teal-300/50 shrink-0">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-stone-800 leading-tight truncate">{t('tasks.title')}</h1>
              <p className="text-xs text-stone-500 truncate">{t('tasks.subtitle')}</p>
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
              <span className="hidden sm:inline">{t(perm === 'granted' ? 'tasks.enabled' : 'tasks.enable')}</span>
            </button>
            <NavigationDrawer />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6 w-full min-w-0">
        <WeatherCard />
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 text-teal-500 animate-spin" />
          </div>
        ) : !hasData ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-lg font-semibold text-stone-700 mb-1">{t('tasks.emptyTitle')}</h2>
            <p className="text-sm text-stone-500 mb-6">{t('tasks.emptyDetail')}</p>
            <Link
              to="/minha-quinta"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-teal-500 via-emerald-600 to-green-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-teal-200/50 hover:shadow-xl transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> {t('tasks.goFarm')}
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
              onOpen3D={handleOpen3D}
            />

            {/* Resumo das secções */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
              {SECTIONS.map(s => (
                <div key={s.key} className="bg-white rounded-2xl border border-stone-200/80 p-3 sm:p-4 text-center shadow-sm min-w-0">
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: s.color }}>{tasks[s.key]?.length || 0}</p>
                  <p className="text-xs text-stone-500 mt-0.5 truncate">{t(`tasks.${s.key}`)}</p>
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
                    <h2 className="text-sm font-bold text-stone-700 truncate">{t(`tasks.${s.key}`)}</h2>
                    <span className="text-xs text-stone-400 shrink-0">({list.length})</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full min-w-0">
                    {list.map(t => (
                      <TaskItem
                        key={t.id}
                        task={t}
                        onWater={handleWater}
                        onOpen3D={handleOpen3D}
                        canAccessPruning3D={canAccessPruning3D}
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
          🌱 {t('tasks.footer')}
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
                    {t('tasks.diagram', { name: active3DModal.name })}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {t(active3DModal.type === 'poda' ? 'tasks.pruningTechnique' : 'tasks.thinningTechnique')}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActive3DModal(null)}
                className="w-9 h-9 rounded-full bg-stone-200/80 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors"
                title={t('tasks.close')}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-3 sm:p-4 overflow-y-auto">
              {!canAccessPruning3D ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-stone-800 text-sm">{t('tasks.locked3D')}</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    {t('tasks.lockedDetail')}
                  </p>
                  <button
                    onClick={() => {
                      setActive3DModal(null);
                      setShowUpgradeModal(true);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-4 rounded-xl shadow-xs transition-all"
                  >
                    {t('tasks.plans')}
                  </button>
                </div>
              ) : active3DModal.type === "poda" ? (
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

      {/* Modal de Upgrade */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="esquemas"
        customTitle={t('tasks.unlock3D')}
        customDescription={t('tasks.lockedDetail')}
      />
    </div>
  );
}
