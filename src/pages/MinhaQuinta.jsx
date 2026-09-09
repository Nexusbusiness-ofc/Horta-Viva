import React, { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { Plus, Loader2, ArrowLeft, Sprout, PawPrint, Camera } from "lucide-react";
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
import { isGoogleConnected, autoSyncGoogleDrive } from "@/lib/googleSync";
import { Cloud } from "lucide-react";

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
    const handleSyncChange = () => {
      setIsSynced(isGoogleConnected());
    };
    const handleRemoteUpdate = () => {
      load();
    };
    window.addEventListener("hortaviva_sync_change", handleSyncChange);
    window.addEventListener("hortaviva_remote_updated", handleRemoteUpdate);

    if (isGoogleConnected()) {
      autoSyncGoogleDrive().catch(() => {});
    }

    return () => {
      window.removeEventListener("hortaviva_sync_change", handleSyncChange);
      window.removeEventListener("hortaviva_remote_updated", handleRemoteUpdate);
    };
  }, []);

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
      setEditingAnimal(null);
      setShowAnimalForm(true);
    } else {
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
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800 leading-none">Minha Quinta</h1>
              <p className="text-xs text-stone-500">As tuas plantações e animais</p>
            </div>
            <button
              onClick={() => setShowSyncModal(true)}
              title="Sincronização & Cópias de Segurança (Google / Pen Drive)"
              className={`shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-xl border transition-all ${
                isSynced
                  ? "bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100 shadow-sm"
                  : "bg-white border-stone-200 text-stone-600 hover:border-emerald-300 shadow-sm"
              }`}
            >
              <Cloud className={`w-4 h-4 ${isSynced ? "text-emerald-600" : "text-stone-400"}`} />
              <span className="hidden sm:inline">{isSynced ? "Nuvem ativa" : "Sincronizar"}</span>
              {isSynced && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
            </button>
            <Link
              to="/identificar"
              title="Identificar planta com foto"
              className="shrink-0 flex items-center gap-1.5 text-xs font-semibold px-2.5 sm:px-3 py-2 rounded-xl border bg-cyan-50 border-cyan-200 text-cyan-800 hover:bg-cyan-100 shadow-sm transition-all"
            >
              <Camera className="w-4 h-4 text-cyan-700" />
              <span className="hidden sm:inline">Identificar</span>
            </Link>
            <button
              onClick={openAdd}
              className="shrink-0 flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white text-sm font-medium px-3 sm:px-4 py-2 rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>

          {/* Separador Plantações / Animais */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setTab("plantacoes")}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-xl transition-all ${
                tab === "plantacoes"
                  ? "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white shadow-md"
                  : "bg-white border border-stone-200 text-stone-600"
              }`}
            >
              <Sprout className="w-4 h-4" /> Plantações
            </button>
            <button
              onClick={() => setTab("animais")}
              className={`flex-1 flex items-center justify-center gap-2 text-sm font-semibold py-2 rounded-xl transition-all ${
                tab === "animais"
                  ? "bg-gradient-to-r from-orange-500 via-amber-600 to-orange-700 text-white shadow-md"
                  : "bg-white border border-stone-200 text-stone-600"
              }`}
            >
              <PawPrint className="w-4 h-4" /> Animais
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-5 space-y-5">
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
                onClick={() => requireAuth() && setShowForm(true)}
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
                onClick={() => requireAuth() && setShowAnimalForm(true)}
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
      </main>

      <footer className="text-center py-6 text-xs">
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
    </div>
  );
}