import React, { useState, useEffect, useMemo } from "react";
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
import { useSubscription, FREE_PLANTATIONS_LIMIT, FREE_ANIMALS_LIMIT } from "@/lib/subscription";
import UpgradeModal from "@/components/subscription/UpgradeModal";
import ProSubscriptionView from "@/components/subscription/ProSubscriptionView";

const FILTERS = ["Todas", "Plantada", "Em crescimento", "Pronta a colher", "Colhida"];

export default function MinhaQuinta() {
  const [tab, setTab] = useState("plantacoes");
  const [plantings, setPlantings] = useState([]);
  const [plants, setPlants] = useState([]);
  const [myAnimals, setMyAnimals] = useState([]);
  const [farmAnimals, setFarmAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [editingAnimal, setEditingAnimal] = useState(null);
  const [filter, setFilter] = useState("Todas");
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isSynced, setIsSynced] = useState(isGoogleConnected());
  const [syncStatus, setSyncStatus] = useState(getSyncStatus());
  const [syncingNow, setSyncingNow] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("plantacoes");
  const { isPro } = useSubscription();
  const requireAuth = useRequireAuth();

  const load = async () => {
    setLoading(true);
    try {
      const [p, allPlants, ma, fa] = await Promise.all([
        base44.entities.Planting.list("-planted_date").catch(() => []),
        cachedList("plants", () => base44.entities.Plant.list()),
        base44.entities.MyAnimal.list("-added_date").catch(() => []),
        cachedList("farmanimals", () => base44.entities.FarmAnimal.list()),
      ]);
      const updates = [];
      for (const pl of p) {
        const target = getAutoStatus(pl);
        if (target) {
          const updated = { ...pl, status: target };
          updates.push({ id: pl.id, data: { status: target }, local: updated });
        }
      }
      setPlantings(p);
      setPlants(allPlants);
      setMyAnimals(ma);
      setFarmAnimals(fa);
      if (updates.length) {
        try {
          await Promise.all(updates.map(u => base44.entities.Planting.update(u.id, u.data)));
          setPlantings(prev => prev.map(pl => {
            const u = updates.find(x => x.id === pl.id);
            return u ? u.local : pl;
          }));
        } catch { /* as atualizações de estado são best-effort */ }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const handleSyncChange = (e) => {
      setIsSynced(isGoogleConnected());
      setSyncStatus(e?.detail?.syncStatus || getSyncStatus());
    };
    const handleRemoteUpdate = () => {
      load();
    };
    window.addEventListener("hortaviva_sync_change", handleSyncChange);
    window.addEventListener("hortaviva_remote_updated", handleRemoteUpdate);

    if (isGoogleConnected()) {
      autoSyncGoogleDrive(false).then(() => {
        setIsSynced(isGoogleConnected());
        setSyncStatus(getSyncStatus());
      }).catch(() => {});
    }

    return () => {
      window.removeEventListener("hortaviva_sync_change", handleSyncChange);
      window.removeEventListener("hortaviva_remote_updated", handleRemoteUpdate);
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
    await base44.entities.Planting.update(id, data);
    setPlantings(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
    autoSyncGoogleDrive();
  };

  const handleDelete = async (id) => {
    try {
      await base44.entities.Planting.delete(id);
    } catch (e) {
      // se já não existir no servidor, remove na mesma do estado local
    }
    setPlantings(prev => prev.filter(p => p.id !== id));
    autoSyncGoogleDrive();
  };

  const handleSaved = () => {
    setShowForm(false);
    load();
    autoSyncGoogleDrive();
  };

  const handleAnimalDelete = async (id) => {
    try { await base44.entities.MyAnimal.delete(id); } catch {}
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
      if (!isPro && myAnimals.length >= FREE_ANIMALS_LIMIT) {
        setUpgradeReason("animais");
        setShowUpgradeModal(true);
        return;
      }
      setEditingAnimal(null);
      setShowAnimalForm(true);
    } else {
      if (!isPro && plantings.length >= FREE_PLANTATIONS_LIMIT) {
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

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-green-50/40 to-lime-50/50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-emerald-50/60 to-white/90 backdrop-blur-lg border-b border-emerald-100/60">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 via-green-500 to-green-700 flex items-center justify-center shadow-lg shadow-emerald-300/50">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-stone-800 leading-none truncate">Minha Quinta</h1>
              <p className="text-xs text-stone-500 truncate">As tuas plantações e animais</p>
            </div>
            {isPro ? (
              <button
                onClick={() => setTab("pro")}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border bg-gradient-to-r from-amber-50 to-emerald-50 text-emerald-800 border-emerald-300 shadow-sm hover:shadow transition-all"
                title="Ver estado do plano Pro"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Pro Ativo</span>
              </button>
            ) : (
              <button
                onClick={() => setTab("pro")}
                className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-900 border-amber-300 hover:border-amber-400 shadow-sm transition-all active:scale-95"
                title="Ver e pagar o plano Horta Viva Pro"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-[11px] font-extrabold">Pagar Pro (2,99€)</span>
              </button>
            )}
            <button
              onClick={syncStatus === "needs_reconnect" ? handleManualSync : () => setShowSyncModal(true)}
              title={
                syncStatus === "needs_reconnect"
                  ? "Sessão expirada. Clica para sincronizar as plantações do telemóvel."
                  : isSynced
                  ? "Nuvem ativa · Dados sincronizados com o Google Drive"
                  : "Sincronização & Cópias de Segurança (Google / Pen Drive)"
              }
              className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-xl border transition-all ${
                syncStatus === "needs_reconnect"
                  ? "bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100 shadow-sm animate-pulse"
                  : isSynced
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-sm"
                  : "bg-white border-stone-200 text-stone-600 hover:border-emerald-300 shadow-sm"
              }`}
            >
              {syncingNow ? (
                <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
              ) : (
                <Cloud className={`w-4 h-4 ${syncStatus === "needs_reconnect" ? "text-amber-600" : isSynced ? "text-emerald-600" : "text-stone-400"}`} />
              )}
              <span className="hidden sm:inline">
                {syncingNow ? "A sincronizar..." : syncStatus === "needs_reconnect" ? "Atualizar Nuvem" : isSynced ? "Nuvem ativa" : "Sincronizar"}
              </span>
              {isSynced && syncStatus !== "needs_reconnect" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
            <Link
              to="/identificar"
              title="Identificar planta com foto"
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-xl border bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100 shadow-sm transition-all"
            >
              <Camera className="w-4 h-4 text-cyan-700" />
              <span className="hidden sm:inline">Identificar</span>
            </Link>
            {tab !== "pro" && (
              <button
                onClick={openAdd}
                className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Adicionar</span>
              </button>
            )}
            <NavigationDrawer />
          </div>

          {/* Separador Plantações / Animais / Plano Pro */}
          <div className="flex gap-1.5 sm:gap-2 mt-3">
            <button
              onClick={() => setTab("plantacoes")}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold py-2 px-2 sm:px-3 rounded-xl transition-all ${
                tab === "plantacoes"
                  ? "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white shadow-md"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-200"
              }`}
            >
              <Sprout className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
              <span>Plantações</span>
              <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-bold transition-all ${
                tab === "plantacoes" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
              }`}>
                {isPro ? `${plantings.length}` : `${plantings.length}/${FREE_PLANTATIONS_LIMIT}`}
              </span>
            </button>
            <button
              onClick={() => setTab("animais")}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold py-2 px-2 sm:px-3 rounded-xl transition-all ${
                tab === "animais"
                  ? "bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 text-white shadow-md"
                  : "bg-white border border-stone-200 text-stone-600 hover:border-orange-200"
              }`}
            >
              <PawPrint className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> 
              <span>Animais</span>
              <span className={`text-[10px] sm:text-[11px] px-1.5 py-0.5 rounded-full font-bold transition-all ${
                tab === "animais" ? "bg-white/20 text-white" : "bg-stone-100 text-stone-600"
              }`}>
                {isPro ? `${myAnimals.length}` : `${myAnimals.length}/${FREE_ANIMALS_LIMIT}`}
              </span>
            </button>
            <button
              onClick={() => setTab("pro")}
              className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-bold py-2 px-2 sm:px-3 rounded-xl transition-all ${
                tab === "pro"
                  ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white shadow-md"
                  : isPro
                    ? "bg-emerald-50/70 border border-emerald-300 text-emerald-800 hover:bg-emerald-100/60"
                    : "bg-amber-50/60 border border-amber-300 text-amber-800 hover:bg-amber-100/60"
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${tab === "pro" ? "text-white" : "text-amber-500"}`} /> 
              <span>{isPro ? "Pro Ativo" : "Pagar Pro"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
        {/* Banner de Sincronização Pendente / Reconexão Google */}
        {syncStatus === "needs_reconnect" && (
          <div className="bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-50 border border-amber-300/80 rounded-3xl p-4 sm:p-4.5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-300 flex items-center justify-center shrink-0 text-amber-700">
                <RefreshCw className="w-5 h-5 text-amber-600 animate-spin-slow" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-amber-950">Sessão da nuvem em pausa</h3>
                <p className="text-xs text-amber-800/90 mt-0.5">
                  Clica para carregar e atualizar automaticamente as plantações do teu telemóvel.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleManualSync}
              disabled={syncingNow}
              className="shrink-0 w-full sm:w-auto bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              {syncingNow ? <Loader2 className="w-4 h-4 animate-spin" /> : <Cloud className="w-4 h-4" />}
              <span>{syncingNow ? "A sincronizar..." : "Sincronizar Agora"}</span>
            </button>
          </div>
        )}

        {tab === "pro" ? (
          <ProSubscriptionView />
        ) : (
          <>
            {/* Banner de Limite de Plantações */}
            {!isPro && tab === "plantacoes" && plantings.length >= FREE_PLANTATIONS_LIMIT && (
              <div className="bg-gradient-to-r from-amber-50 via-emerald-50/40 to-teal-50 border border-amber-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600 text-lg">
                    🌱
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-800">
                        Limite gratuito atingido ({FREE_PLANTATIONS_LIMIT}/{FREE_PLANTATIONS_LIMIT} plantações)
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        2,99€ / mês
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 max-w-md">
                      No plano base podes registar até {FREE_PLANTATIONS_LIMIT} plantações ativas. Desbloqueia plantações ilimitadas e gere toda a tua quinta com o Horta Viva Pro!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTab("pro");
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-emerald-200/50 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ver e Pagar Pro (2,99€)
                </button>
              </div>
            )}

            {/* Banner de Limite de Animais */}
            {!isPro && tab === "animais" && myAnimals.length >= FREE_ANIMALS_LIMIT && (
              <div className="bg-gradient-to-r from-amber-50 via-orange-50/40 to-amber-50 border border-amber-200 rounded-3xl p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-200 flex items-center justify-center shrink-0 text-amber-600 text-lg">
                    🐾
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-stone-800">
                        Limite gratuito atingido ({FREE_ANIMALS_LIMIT}/{FREE_ANIMALS_LIMIT} animais)
                      </h3>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                        2,99€ / mês
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 mt-0.5 max-w-md">
                      No plano base podes registar até {FREE_ANIMALS_LIMIT} animais. Desbloqueia animais ilimitados e organiza todos os cuidados e tarefas diárias!
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setTab("pro");
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 hover:from-orange-600 hover:to-amber-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-200/50 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ver e Pagar Pro (2,99€)
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
              </div>
            ) : tab === "plantacoes" ? (
              plantings.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🌱</div>
                  <h2 className="text-lg font-semibold text-stone-700 mb-1">A tua quinta está vazia</h2>
                  <p className="text-sm text-stone-500 mb-6">Adiciona a tua primeira plantação para começar a acompanhar.</p>
                  <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Adicionar plantação
                  </button>
                </div>
              ) : (
                <>
                  <TreatmentReminders />
                  <ReminderBanner plantings={plantings} />

                  {/* Filtros */}
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
                    {FILTERS.map(f => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`shrink-0 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full transition-all ${
                          filter === f
                            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm"
                            : "bg-white border border-stone-200 text-stone-600 hover:border-emerald-300"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>

                  {filtered.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-sm text-stone-400">Nenhuma plantação neste estado.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filtered.map(p => (
                        <PlantingCard key={p.id} planting={p} plants={plants} onUpdate={handleUpdate} onDelete={handleDelete} />
                      ))}
                    </div>
                  )}
                </>
              )
            ) : (
              // Separador Animais
              myAnimals.length === 0 ? (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">🐾</div>
                  <h2 className="text-lg font-semibold text-stone-700 mb-1">Sem animais registados</h2>
                  <p className="text-sm text-stone-500 mb-6">Adiciona os animais que tens na quinta para receberes lembretes diários de alimentação e cuidados.</p>
                  <button
                    onClick={openAdd}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-orange-200/50 hover:shadow-xl transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" /> Adicionar animal
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {myAnimals.map(a => (
                    <MyAnimalCard
                      key={a.id}
                      myAnimal={a}
                      farmAnimal={farmAnimals.find(f => f.id === a.animal_id)}
                      onDelete={handleAnimalDelete}
                      onEdit={() => { setEditingAnimal(a); setShowAnimalForm(true); }}
                    />
                  ))}
                </div>
              )
            )}
          </>
        )}
      </main>

      <footer className="text-center pt-4 pb-28 text-xs">
        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-medium">
          🌱 Minha Horta — Cultiva com sabedoria
        </span>
      </footer>

      {showForm && (
        <PlantingForm plants={plants} onClose={() => setShowForm(false)} onSaved={handleSaved} />
      )}
      {showAnimalForm && (
        <MyAnimalForm
          animals={farmAnimals}
          editing={editingAnimal}
          onClose={() => { setShowAnimalForm(false); setEditingAnimal(null); }}
          onSaved={handleAnimalSaved}
        />
      )}
      <SyncBackupModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        onDataChanged={load}
      />
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason={upgradeReason}
      />
    </div>
  );
}