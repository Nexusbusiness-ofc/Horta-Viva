import { useI18n } from "@/lib/I18nContext";
import { useAuth } from '@/lib/AuthContext';
import React, { useState, useEffect, useMemo, useRef } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2, ArrowLeft, Sprout, PawPrint, Camera, Cloud, Sparkles, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import PlantingForm from "@/components/quinta/PlantingForm";
import PlantingCard from "@/components/quinta/PlantingCard";
import MyAnimalForm from "@/components/quinta/MyAnimalForm";
import MyAnimalCard from "@/components/quinta/MyAnimalCard";
import ReminderBanner from "@/components/quinta/ReminderBanner";
import TreatmentReminders from "@/components/quinta/TreatmentReminders";
import SyncBackupModal from "@/components/quinta/SyncBackupModal";
import { getAutoStatus } from "@/lib/plantingCare";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cachedList } from "@/lib/offlineCatalog";
import { isGoogleConnected, autoSyncGoogleDrive, getSyncStatus } from "@/lib/googleSync";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import { useSubscription, FREE_PLANTATIONS_LIMIT, FREE_ANIMALS_LIMIT, PLUS_PLANTATIONS_LIMIT, PLUS_ANIMALS_LIMIT, PRO_PLANTATIONS_LIMIT, PRO_ANIMALS_LIMIT } from "@/lib/subscription";
import UpgradeModal from "@/components/subscription/UpgradeModal";
import ProSubscriptionView from "@/components/subscription/ProSubscriptionView";
import HarvestDialog from '@/components/quinta/HarvestDialog';
import { harvestPlanting, hasHarvest, readMascotState } from '@/lib/mascot';
import { useToast } from '@/components/ui/use-toast';
import { readAccountScope } from '@/lib/accountScope';
const FILTERS = ["Todas", "Plantada", "Em crescimento", "Pronta a colher", "Colhida"];
const safeMascotState = () => { try { return readMascotState(); } catch { return null; } };
export default function MinhaQuinta() {
  const { user } = useAuth();
  const {
    t: i18nT
  } = useI18n();
  const [tab, setTab] = useState("plantacoes");
  const [plantings, setPlantings] = useState([]);
  const [plants, setPlants] = useState([]);
  const [myAnimals, setMyAnimals] = useState([]);
  const [farmAnimals, setFarmAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlanting, setEditingPlanting] = useState(null);
  const [harvestTarget, setHarvestTarget] = useState(null);
  const [mascotState, setMascotState] = useState(safeMascotState);
  const { toast } = useToast();
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [filter, setFilter] = useState("Todas");
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isSynced, setIsSynced] = useState(isGoogleConnected());
  const [syncStatus, setSyncStatus] = useState(getSyncStatus());
  const [syncingNow, setSyncingNow] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("plantacoes");
  const {
    isUltra,
    isPro,
    isPlus,
    tier,
    plantationsLimit,
    animalsLimit,
    canAddPlantation,
    canAddAnimal
  } = useSubscription();
  const requireAuth = useRequireAuth();
  const loadSequence = useRef(0);
  const mounted = useRef(true);
  const loadedScope = useRef(null);
  const visibleScope = useRef(readAccountScope());
  const load = async () => {
    const sequence = ++loadSequence.current;
    const scope = readAccountScope();
    const current = () => mounted.current && sequence === loadSequence.current && scope !== null && scope === readAccountScope();
    if (visibleScope.current !== scope) {
      visibleScope.current = scope;
      setShowForm(false); setEditingPlanting(null); setHarvestTarget(null);
      setShowAnimalForm(false); setEditingAnimal(null);
      setPlantings([]); setMyAnimals([]);
    }
    loadedScope.current = null;
    setMascotState(safeMascotState());
    setLoading(true);
    try {
      const [p, allPlants, ma, fa] = await Promise.all([base44.entities.Planting.list("-planted_date").catch(() => []), cachedList("plants", () => base44.entities.Plant.list()), base44.entities.MyAnimal.list("-added_date").catch(() => []), cachedList("farmanimals", () => base44.entities.FarmAnimal.list())]);
      if (!current()) return;
      const updates = [];
      for (const pl of p) {
        const target = getAutoStatus(pl);
        if (target) {
          const updated = {
            ...pl,
            status: target
          };
          updates.push({
            id: pl.id,
            data: {
              status: target
            },
            local: updated
          });
        }
      }
      setPlantings(p);
      setPlants(allPlants);
      setMyAnimals(ma);
      setFarmAnimals(fa);
      loadedScope.current = scope;
      if (updates.length) {
        try {
          for (const update of updates) {
            if (!current()) return;
            await base44.entities.Planting.update(update.id, update.data);
          }
          if (!current()) return;
          setPlantings(prev => prev.map(pl => {
            const u = updates.find(x => x.id === pl.id);
            return u ? u.local : pl;
          }));
        } catch {/* as atualizações de estado são best-effort */}
      }
    } finally {
      if (current()) setLoading(false);
    }
  };
  useEffect(() => {
    mounted.current = true;
    load();
    const handleSyncChange = e => {
      setIsSynced(isGoogleConnected());
      setSyncStatus(e?.detail?.syncStatus || getSyncStatus());
    };
    const handleRemoteUpdate = () => {
      load();
    };
    window.addEventListener("hortaviva_sync_change", handleSyncChange);
    window.addEventListener("hortaviva_remote_updated", handleRemoteUpdate);
    window.addEventListener("hortaviva_auth_changed", handleRemoteUpdate);
    window.addEventListener("storage", handleRemoteUpdate);
    if (isGoogleConnected()) {
      autoSyncGoogleDrive(false).then(() => {
        setIsSynced(isGoogleConnected());
        setSyncStatus(getSyncStatus());
      }).catch(() => {});
    }
    return () => {
      mounted.current = false; ++loadSequence.current;
      window.removeEventListener("hortaviva_sync_change", handleSyncChange);
      window.removeEventListener("hortaviva_remote_updated", handleRemoteUpdate);
      window.removeEventListener("hortaviva_auth_changed", handleRemoteUpdate);
      window.removeEventListener("storage", handleRemoteUpdate);
    };
  }, []);
  const handleManualSync = async () => {
    setSyncingNow(true);
    try {
      await autoSyncGoogleDrive(true);
      await load();
    } catch (err) {
      console.warn("Sincronização manual falhou:", err);
    } finally {
      setSyncingNow(false);
      setIsSynced(isGoogleConnected());
      setSyncStatus(getSyncStatus());
    }
  };
  const handleUpdate = async (id, data) => {
    const scope = loadedScope.current;
    if (scope === null || scope !== readAccountScope()) return;
    if (data.status === 'Colhida') { setHarvestTarget(plantings.find(planting=>planting.id === id)); return; }
    try { await base44.entities.Planting.update(id, data); }
    catch { toast({ title: i18nT('harvest.updateError'), variant: 'destructive' }); return; }
    if (!mounted.current || scope !== readAccountScope()) return;
    setPlantings(prev => prev.map(p => p.id === id ? {
      ...p,
      ...data
    } : p));
    autoSyncGoogleDrive();
  };
  const handleDelete = async id => {
    const scope = loadedScope.current;
    if (scope === null || scope !== readAccountScope()) return;
    try {
      await base44.entities.Planting.delete(id);
    } catch (e) {
      toast({ title: i18nT('harvest.updateError'), variant: 'destructive' }); return;
    }
    if (!mounted.current || scope !== readAccountScope()) return;
    setPlantings(prev => prev.filter(p => p.id !== id));
    autoSyncGoogleDrive();
  };
  const handleSaved = () => {
    setShowForm(false);
    setEditingPlanting(null);
    load();
    autoSyncGoogleDrive();
  };
  const confirmHarvest = async quantityData => {
    const scope = loadedScope.current;
    if (!harvestTarget || scope === null || scope !== readAccountScope()) throw new Error('Account changed');
    harvestPlanting(harvestTarget.id, quantityData);
    setHarvestTarget(null);
    await load();
    if (!mounted.current || scope !== readAccountScope()) return;
    toast({ title: i18nT('harvest.success'), description: i18nT('harvest.total',{count:quantityData.plant_count}) });
    autoSyncGoogleDrive();
  };
  const handleAnimalDelete = async id => {
    const scope = loadedScope.current;
    if (scope === null || scope !== readAccountScope()) return;
    try {
      await base44.entities.MyAnimal.delete(id);
    } catch { toast({ title: i18nT('harvest.updateError'), variant: 'destructive' }); return; }
    if (!mounted.current || scope !== readAccountScope()) return;
    setMyAnimals(prev => prev.filter(a => a.id !== id));
    autoSyncGoogleDrive();
  };
  const handleAnimalSaved = () => {
    setShowAnimalForm(false);
    setEditingAnimal(null);
    load();
    autoSyncGoogleDrive();
  };
  const openAdd = () => {
    if (!requireAuth()) return;
    if (tab === "animais") {
      if (!canAddAnimal(myAnimals.length)) {
        setUpgradeReason("animais");
        setShowUpgradeModal(true);
        return;
      }
      setEditingAnimal(null);
      setShowAnimalForm(true);
    } else {
      setEditingPlanting(null);
      if (!canAddPlantation(plantings.length)) {
        setUpgradeReason("plantacoes");
        setShowUpgradeModal(true);
        return;
      }
      setShowForm(true);
    }
  };
  const filtered = useMemo(() => {
    if (filter === "Todas") return plantings;
    return plantings.filter(p => p.status === filter);
  }, [plantings, filter]);
  return <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-green-50/40 to-lime-50/50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-emerald-50/60 to-white/90 backdrop-blur-lg border-b border-emerald-100/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-300/50">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-stone-800 leading-none truncate">{user?.farm_name || i18nT("Minha Quinta")}</h1>
              <p className="text-xs text-stone-500 truncate">{i18nT("As tuas plantações e animais")}</p>
            </div>
            {isPro ? <button onClick={() => setTab("pro")} className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border bg-gradient-to-r from-amber-50 to-emerald-50 text-emerald-800 border-emerald-300 shadow-sm hover:shadow transition-all" title={i18nT("Ver estado do plano Pro")}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{i18nT("Pro Ativo")}</span>
              </button> : isPlus ? <button onClick={() => setTab("pro")} className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 border-emerald-300 shadow-sm hover:shadow transition-all" title={i18nT("Ver estado do plano Plus")}>
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-[11px] font-extrabold">{i18nT("Plus Ativo")}</span>
              </button> : <button onClick={() => setTab("pro")} className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 border-amber-300 hover:border-amber-400 shadow-sm transition-all active:scale-95" title={i18nT("Ver e subscrever planos Horta Viva")}>
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-extrabold">{i18nT("Planos (1,99€)")}</span>
              </button>}
            <button onClick={syncStatus === "needs_reconnect" ? handleManualSync : () => setShowSyncModal(true)} title={syncStatus === "needs_reconnect" ? i18nT("Sessão expirada. Clica para sincronizar as plantações do telemóvel.") : isSynced ? i18nT("Nuvem ativa · Dados sincronizados com o Google Drive") : i18nT("Sincronização & Cópias de Segurança (Google / Pen Drive)")} className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-xl border transition-all ${syncStatus === "needs_reconnect" ? "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-sm animate-pulse" : isSynced ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-sm" : "bg-white border-stone-200 text-stone-600 hover:border-emerald-300 shadow-sm"}`}>
              {syncingNow ? <Loader2 className="w-4 h-4 animate-spin text-amber-600" /> : <Cloud className={`w-4 h-4 ${syncStatus === "needs_reconnect" ? "text-amber-600" : isSynced ? "text-emerald-600" : "text-stone-400"}`} />}
              <span className="hidden sm:inline">
                {syncingNow ? i18nT("A sincronizar...") : syncStatus === "needs_reconnect" ? i18nT("Atualizar Nuvem") : isSynced ? i18nT("Nuvem ativa") : i18nT("Sincronizar")}
              </span>
              {isSynced && syncStatus !== "needs_reconnect" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
            <Link to="/identificar" title={i18nT("Identificador IA (plantas e animais com foto)")} className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-xl border bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100 shadow-sm transition-all">
              <Camera className="w-4 h-4 text-cyan-700" />
              <span className="hidden sm:inline">{i18nT("Identificador IA")}</span>
            </Link>
            {tab !== "pro" && <button onClick={openAdd} className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-95">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{i18nT("Adicionar")}</span>
              </button>}
            <NavigationDrawer />
          </div>

          {/* Separador Plantações / Animais / Plano Pro */}
          <div className="flex gap-1.5 sm:gap-2 mt-3">
            <button onClick={() => setTab("plantacoes")} className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold py-2 px-2 sm:px-3 rounded-xl transition-all ${tab === "plantacoes" ? "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white shadow-md" : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-200"}`}>
              <Sprout className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
              <span>{i18nT("Plantações")}</span>
              <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-bold transition-all ${tab === "plantacoes" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"}`}>
                {isUltra ? i18nT("{v0}", {
                v0: plantings.length
              }) : i18nT("{v0}/{v1}", {
                v0: plantings.length,
                v1: plantationsLimit
              })}
              </span>
            </button>
            <button onClick={() => setTab("animais")} className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold py-2 px-2 sm:px-3 rounded-xl transition-all ${tab === "animais" ? "bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 text-white shadow-md" : "bg-white border border-stone-200 text-stone-600 hover:border-orange-200"}`}>
              <PawPrint className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
              <span>{i18nT("Animais")}</span>
              <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-bold transition-all ${tab === "animais" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"}`}>
                {isUltra ? i18nT("{v0}", {
                v0: myAnimals.length
              }) : i18nT("{v0}/{v1}", {
                v0: myAnimals.length,
                v1: animalsLimit
              })}
              </span>
            </button>
            <button onClick={() => setTab("pro")} className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold py-2 px-2 sm:px-3 rounded-xl transition-all ${tab === "pro" ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-md" : isUltra ? "bg-purple-50/70 border border-purple-300 text-purple-800 hover:bg-purple-100/60" : isPro ? "bg-amber-50/70 border border-amber-300 text-amber-800 hover:bg-amber-100/60" : isPlus ? "bg-emerald-50/70 border border-emerald-300 text-emerald-800 hover:bg-emerald-100/60" : "bg-stone-50 border border-stone-300 text-stone-700 hover:bg-stone-100/60"}`}>
              <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${tab === "pro" ? "text-white" : isUltra ? "text-purple-600" : "text-amber-500"}`} /> 
              <span>{isUltra ? i18nT("Ultra Ativo") : isPro ? i18nT("Pro Ativo") : isPlus ? i18nT("Plus Ativo") : i18nT("Planos & Pro")}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200/70 bg-white/80 px-4 py-3 shadow-sm"><Link to="/mascote" className="flex items-center gap-2 text-sm font-bold text-stone-800"><span className="text-xl" aria-hidden="true">🌱</span>{i18nT('mascot.navTitle')}</Link><Link to="/mascote#armazem" className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100">{i18nT('harvest.open')} →</Link></div>
        {/* Banner de Sincronização Pendente / Reconexão Google */}
        {syncStatus === "needs_reconnect" && <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-300/80 rounded-3xl p-4 sm:p-4.5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
                <RefreshCw className="w-5 h-5 text-amber-600 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">{i18nT("Sessão da nuvem em pausa")}</h3>
                <p className="text-xs text-amber-800/90 mt-0.5">{i18nT("Clica para carregar e atualizar automaticamente as plantações do teu telemóvel.")}</p>
              </div>
            </div>
            <button type="button" onClick={handleManualSync} disabled={syncingNow} className="shrink-0 w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2">
              {syncingNow ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
              <span>{syncingNow ? i18nT("A sincronizar...") : i18nT("Sincronizar Agora")}</span>
            </button>
          </div>}

        {tab === "pro" ? <ProSubscriptionView /> : <>
            {/* Banner de Limite de Plantações */}
            {!isUltra && tab === "plantacoes" && plantings.length >= plantationsLimit && <div className="bg-gradient-to-r from-amber-50 via-emerald-50/40 to-teal-50 border border-amber-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600 text-lg">
                    🌱
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-800">{i18nT("Limite atingido (")}{i18nT(plantings.length)}/{i18nT(plantationsLimit)}{i18nT(" plantações)")}</h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {isPro ? i18nT("Upgrade Ultra") : isPlus ? i18nT("Upgrade Pro") : i18nT("A partir de 1,99€")}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 max-w-md">
                      {isPro ? i18nT("O Plano Pro permite até {v0} plantações. Para canteiros infinitos, faz upgrade para o Horta Viva Ultra (3,99€/mês)!", {
                  v0: PRO_PLANTATIONS_LIMIT
                }) : isPlus ? i18nT("O Plano Plus permite até {v0} plantações. Desbloqueia até {v1} no Pro (2,99€/mês) ou infinitas no Ultra (3,99€/mês)!", {
                  v0: PLUS_PLANTATIONS_LIMIT,
                  v1: PRO_PLANTATIONS_LIMIT
                }) : i18nT("No plano base podes registar até {v0} plantações. Desbloqueia até {v1} no Plano Plus (1,99€/mês), {v2} no Pro (2,99€) ou infinitas no Ultra (3,99€)!", {
                  v0: FREE_PLANTATIONS_LIMIT,
                  v1: PLUS_PLANTATIONS_LIMIT,
                  v2: PRO_PLANTATIONS_LIMIT
                })}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => {
            setUpgradeReason("plantacoes");
            setShowUpgradeModal(true);
          }} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200/50 transition-all active:scale-95 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isPro ? i18nT("Upgrade Ultra (3,99€)") : isPlus ? i18nT("Upgrade Pro (2,99€)") : i18nT("Ver Planos (1,99€)")}
                </button>
              </div>}

            {/* Banner de Limite de Animais */}
            {!isUltra && tab === "animais" && myAnimals.length >= animalsLimit && <div className="bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 border border-amber-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600 text-lg">
                    🐾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-800">{i18nT("Limite atingido (")}{i18nT(myAnimals.length)}/{i18nT(animalsLimit)}{i18nT(" animais)")}</h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        {isPro ? i18nT("Upgrade Ultra") : isPlus ? i18nT("Upgrade Pro") : i18nT("A partir de 1,99€")}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 max-w-md">
                      {isPro ? i18nT("O Plano Pro permite até {v0} animais. Para animais infinitos e tarefas automáticas diárias, faz upgrade para o Ultra (3,99€/mês)!", {
                  v0: PRO_ANIMALS_LIMIT
                }) : isPlus ? i18nT("O Plano Plus permite até {v0} animais. Desbloqueia até {v1} no Pro (2,99€/mês) ou infinitos no Ultra (3,99€/mês)!", {
                  v0: PLUS_ANIMALS_LIMIT,
                  v1: PRO_ANIMALS_LIMIT
                }) : i18nT("No plano base podes registar até {v0} animais. Desbloqueia até {v1} no Plano Plus (1,99€/mês), {v2} no Pro (2,99€) ou infinitos no Ultra (3,99€)!", {
                  v0: FREE_ANIMALS_LIMIT,
                  v1: PLUS_ANIMALS_LIMIT,
                  v2: PRO_ANIMALS_LIMIT
                })}
                    </p>
                  </div>
                </div>
                <button type="button" onClick={() => {
            setUpgradeReason("animais");
            setShowUpgradeModal(true);
          }} className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-200/50 transition-all active:scale-95 whitespace-nowrap">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isPro ? i18nT("Upgrade Ultra (3,99€)") : isPlus ? i18nT("Upgrade Pro (2,99€)") : i18nT("Ver Planos (1,99€)")}
                </button>
              </div>}

            {loading ? <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              </div> : tab === "plantacoes" ? plantings.length === 0 ? <div className="text-center py-20">
                  <div className="text-6xl mb-4">🌱</div>
                  <h2 className="text-lg font-semibold text-stone-700 mb-1">{i18nT("A tua quinta está vazia")}</h2>
                  <p className="text-sm text-stone-500 mb-6">{i18nT("Adiciona a tua primeira plantação para começar a acompanhar.")}</p>
                  <button onClick={openAdd} className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all active:scale-95">
                    <Plus className="w-4 h-4" />{i18nT(" Adicionar plantação")}</button>
                </div> : <>
                  <TreatmentReminders />
                  <ReminderBanner plantings={plantings} />

                  {/* Filtros */}
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                    {i18nT(FILTERS.map(f => <button key={f} onClick={() => setFilter(f)} className={`shrink-0 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full transition-all ${filter === f ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm" : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-300"}`}>
                        {i18nT(f)}
                      </button>))}
                  </div>

                  {filtered.length === 0 ? <div className="text-center py-12">
                      <p className="text-sm text-stone-400">{i18nT("Nenhuma plantação neste estado.")}</p>
                    </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {i18nT(filtered.map(p => <PlantingCard key={p.id} planting={p} plants={plants} onUpdate={handleUpdate} onDelete={handleDelete} onEdit={planting=>{setEditingPlanting(planting);setShowForm(true);}} onHarvest={!hasHarvest(p.id,mascotState) ? setHarvestTarget : undefined} />))}
                    </div>}
                </> : myAnimals.length === 0 ? <div className="text-center py-20">
                  <div className="text-6xl mb-4">🐾</div>
                  <h2 className="text-lg font-semibold text-stone-700 mb-1">{i18nT("Sem animais registados")}</h2>
                  <p className="text-sm text-stone-500 mb-6">{i18nT("Adiciona os animais que tens na quinta para receberes lembretes diários de alimentação e cuidados.")}</p>
                  <button onClick={openAdd} className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all active:scale-95">
                    <Plus className="w-4 h-4" />{i18nT(" Adicionar animal")}</button>
                </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {i18nT(myAnimals.map(a => <MyAnimalCard key={a.id} myAnimal={a} farmAnimal={farmAnimals.find(f => f.id === a.animal_id)} onDelete={handleAnimalDelete} onEdit={() => {
            setEditingAnimal(a);
            setShowAnimalForm(true);
          }} />))}
                </div>}
          </>}
      </main>

      <footer className="text-center pt-4 pb-28 text-xs">
        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-medium">{i18nT("🌱 Minha Horta — Cultiva com sabedoria")}</span>
      </footer>

      {showForm && <PlantingForm plants={plants} editing={editingPlanting} onClose={() => {setShowForm(false);setEditingPlanting(null);}} onSaved={handleSaved} />}
      {harvestTarget && <HarvestDialog key={harvestTarget.id} planting={harvestTarget} onClose={()=>setHarvestTarget(null)} onHarvest={confirmHarvest} />}
      {showAnimalForm && <MyAnimalForm animals={farmAnimals} editing={editingAnimal} onClose={() => {
      setShowAnimalForm(false);
      setEditingAnimal(null);
    }} onSaved={handleAnimalSaved} />}
      <SyncBackupModal isOpen={showSyncModal} onClose={() => setShowSyncModal(false)} onDataChanged={load} />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} reason={upgradeReason} />
    </div>;
}
