import React, { useState, useEffect } from "react";
import {
  Bell,
  BellRing,
  Droplets,
  Scissors,
  Sprout,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Box,
  Check,
  Wheat,
  PawPrint
} from "lucide-react";
import {
  computeSmartAlerts,
  getLastWateredMap,
  markPlantingWatered,
} from "@/lib/smartAlerts";
import {
  notifySupported,
  notifyPermission,
  requestNotifyPermission,
  sendSmartAlertSummary,
  shouldNotifyToday
} from "@/lib/notify";
import { useToast } from "@/components/ui/use-toast";

export default function SmartAlertsBanner({
  plantings = [],
  plants = [],
  myAnimals = [],
  farmAnimals = [],
  podas = [],
  mondas = [],
  onOpen3D,
}) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isExpanded, setIsExpanded] = useState(true);
  const [wateredMap, setWateredMap] = useState(getLastWateredMap());
  const [perm, setPerm] = useState(notifyPermission());
  const [recentlyWateredId, setRecentlyWateredId] = useState(null);
  const { toast } = useToast();

  // Escutar eventos de atualização da rega
  useEffect(() => {
    const handleWateredUpdate = () => {
      setWateredMap(getLastWateredMap());
    };
    window.addEventListener("hortaviva_watered_update", handleWateredUpdate);
    return () => window.removeEventListener("hortaviva_watered_update", handleWateredUpdate);
  }, []);

  // Calcular alertas com o motor inteligente
  const alertsData = computeSmartAlerts({
    plantings,
    plants,
    myAnimals,
    farmAnimals,
    podas,
    mondas,
    lastWateredMap: wateredMap,
  });

  const { counts } = alertsData;

  // Enviar notificação inteligente diária se permitido
  useEffect(() => {
    if (notifySupported() && perm === "granted" && counts.totalDueToday > 0 && shouldNotifyToday()) {
      sendSmartAlertSummary(counts, alertsData.allAlerts);
    }
  }, [counts.totalDueToday, perm]);

  // Ativar notificações do navegador
  const handleEnableNotify = async () => {
    const p = await requestNotifyPermission();
    setPerm(p);
    if (p === "granted") {
      toast({
        title: "Alertas Ativados! 🔔",
        description: "Vais receber lembretes de rega e épocas de poda diretamente no teu dispositivo.",
      });
      sendSmartAlertSummary(counts, alertsData.allAlerts);
    } else {
      toast({
        title: "Permissão de Notificação",
        description: "Podes permitir notificações nas definições do teu navegador para receber lembretes automáticos.",
      });
    }
  };

  // Ação de regar
  const handleWaterClick = (plantingId, plantName) => {
    markPlantingWatered(plantingId);
    setRecentlyWateredId(plantingId);
    setTimeout(() => setRecentlyWateredId(null), 2500);

    toast({
      title: "Rega Registada! 💧",
      description: `${plantName} foi regada com sucesso. O próximo alerta foi recalculado.`,
    });
  };

  // Se não há plantações nem animais, não exibir banner
  if (plantings.length === 0 && myAnimals.length === 0) {
    return null;
  }

  // Filtrar alertas a exibir
  let displayedAlerts = [];
  if (activeFilter === "all") {
    displayedAlerts = alertsData.allAlerts;
  } else if (activeFilter === "rega") {
    displayedAlerts = alertsData.wateringAlerts;
  } else if (activeFilter === "podas") {
    displayedAlerts = alertsData.pruningAlerts;
  } else if (activeFilter === "mondas") {
    displayedAlerts = alertsData.thinningAlerts;
  } else if (activeFilter === "colheita") {
    displayedAlerts = alertsData.harvestAlerts;
  } else if (activeFilter === "animais") {
    displayedAlerts = alertsData.animalAlerts;
  }

  const hasUrgent = counts.totalDueToday > 0;

  return (
    <div className="rounded-3xl border border-stone-200/80 bg-white overflow-hidden shadow-sm transition-all">
      {/* Cabeçalho do Banner de Alertas */}
      <div
        className={`p-4 sm:p-5 flex items-center justify-between gap-3 flex-wrap cursor-pointer select-none transition-colors ${
          hasUrgent
            ? "bg-gradient-to-r from-emerald-500 via-teal-600 to-green-700 text-white"
            : "bg-stone-50 text-stone-800"
        }`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shadow-md ${
              hasUrgent
                ? "bg-white/20 text-white backdrop-blur-xs shadow-emerald-800/20"
                : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {hasUrgent ? <BellRing className="w-5 h-5 animate-bounce" /> : <CheckCircle2 className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base leading-tight">
                Alertas Inteligentes da Quinta
              </h3>
              {counts.totalDueToday > 0 ? (
                <span className="bg-rose-500 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                  {counts.totalDueToday} pendente{counts.totalDueToday > 1 ? "s" : ""}
                </span>
              ) : (
                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full">
                  Tudo em dia 🎉
                </span>
              )}
            </div>
            <p className={`text-xs mt-0.5 ${hasUrgent ? "text-emerald-100" : "text-stone-500"}`}>
              {hasUrgent
                ? "Cuidados específicos para hoje calculados com base nas tuas culturas"
                : "A tua quinta está hidratada e sem podas urgentes para hoje"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {/* Botão de Ativação de Notificações */}
          {notifySupported() && (
            <button
              onClick={handleEnableNotify}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                perm === "granted"
                  ? hasUrgent ? "bg-white/20 text-white hover:bg-white/30" : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                  : hasUrgent ? "bg-white text-emerald-800 hover:bg-white/90" : "bg-emerald-600 text-white hover:bg-emerald-700"
              }`}
              title="Notificações no Telemóvel / PC"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{perm === "granted" ? "Notificações Ativas" : "Ativar Alertas"}</span>
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              hasUrgent ? "hover:bg-white/20 text-white" : "hover:bg-stone-200 text-stone-600"
            }`}
            title={isExpanded ? "Encolher" : "Expandir"}
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Conteúdo Expandido com Abas e Lista de Tarefas */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          {/* Filtros em Pílulas */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide text-xs font-bold">
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                activeFilter === "all"
                  ? "bg-stone-800 text-white shadow-xs"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todos ({counts.totalDueToday})
            </button>

            {counts.watering > 0 && (
              <button
                onClick={() => setActiveFilter("rega")}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                  activeFilter === "rega"
                    ? "bg-sky-600 text-white shadow-xs"
                    : "bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100"
                }`}
              >
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                <span>Rega ({counts.watering})</span>
              </button>
            )}

            {counts.pruning > 0 && (
              <button
                onClick={() => setActiveFilter("podas")}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                  activeFilter === "podas"
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <Scissors className="w-3.5 h-3.5 text-emerald-600" />
                <span>Podas ({counts.pruning})</span>
              </button>
            )}

            {counts.thinning > 0 && (
              <button
                onClick={() => setActiveFilter("mondas")}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                  activeFilter === "mondas"
                    ? "bg-lime-600 text-white shadow-xs"
                    : "bg-lime-50 text-lime-800 border border-lime-200 hover:bg-lime-100"
                }`}
              >
                <Sprout className="w-3.5 h-3.5 text-lime-600" />
                <span>Mondas ({counts.thinning})</span>
              </button>
            )}

            {counts.harvest > 0 && (
              <button
                onClick={() => setActiveFilter("colheita")}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                  activeFilter === "colheita"
                    ? "bg-amber-600 text-white shadow-xs"
                    : "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                }`}
              >
                <Wheat className="w-3.5 h-3.5 text-amber-500" />
                <span>Colheita ({counts.harvest})</span>
              </button>
            )}

            {counts.animals > 0 && (
              <button
                onClick={() => setActiveFilter("animais")}
                className={`px-3 py-1.5 rounded-xl transition-all shrink-0 flex items-center gap-1.5 ${
                  activeFilter === "animais"
                    ? "bg-orange-600 text-white shadow-xs"
                    : "bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100"
                }`}
              >
                <PawPrint className="w-3.5 h-3.5 text-orange-500" />
                <span>Animais ({counts.animals})</span>
              </button>
            )}
          </div>

          {/* Lista de Alertas */}
          {displayedAlerts.length === 0 ? (
            <div className="bg-stone-50 rounded-2xl p-6 text-center space-y-2 border border-dashed border-stone-200">
              <span className="text-3xl">🌿</span>
              <h4 className="font-extrabold text-stone-700 text-sm">Tudo impecável nesta secção!</h4>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Não tens alertas pendentes para o filtro selecionado. As tuas plantas e animais estão bem cuidados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {displayedAlerts.map((alert) => {
                // ALERTA DE REGA
                if (alert.type === "rega") {
                  const isRecentlyWatered = recentlyWateredId === alert.plantingId;
                  const isOverdue = alert.status === "overdue";

                  return (
                    <div
                      key={alert.id}
                      className={`rounded-2xl border p-3.5 flex items-start gap-3 transition-all ${
                        isOverdue
                          ? "bg-rose-50/70 border-rose-200"
                          : "bg-sky-50/60 border-sky-200"
                      }`}
                    >
                      <div
                        className="w-11 h-11 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-xs"
                        style={{ backgroundColor: (alert.plantingColor || "#0ea5e9") + "20" }}
                      >
                        {alert.plantingEmoji || "🌱"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-stone-800 text-sm truncate">
                            {alert.plantingName}
                          </h4>
                          <span
                            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              isOverdue
                                ? "bg-rose-500 text-white"
                                : "bg-sky-500 text-white"
                            }`}
                          >
                            {alert.badgeText}
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                          {alert.message}
                        </p>

                        {alert.location && (
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            📍 {alert.location}
                          </p>
                        )}

                        <div className="mt-2.5 flex items-center gap-2">
                          <button
                            onClick={() => handleWaterClick(alert.plantingId, alert.plantingName)}
                            disabled={isRecentlyWatered}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                              isRecentlyWatered
                                ? "bg-emerald-600 text-white cursor-default"
                                : isOverdue
                                ? "bg-rose-600 hover:bg-rose-700 text-white active:scale-95"
                                : "bg-sky-600 hover:bg-sky-700 text-white active:scale-95"
                            }`}
                          >
                            {isRecentlyWatered ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Regado!</span>
                              </>
                            ) : (
                              <>
                                <Droplets className="w-3.5 h-3.5" />
                                <span>Regar Agora ✓</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                // ALERTA DE PODA
                if (alert.type === "poda") {
                  return (
                    <div
                      key={alert.id}
                      className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-3.5 flex items-start gap-3 transition-all"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl shrink-0 shadow-sm shadow-emerald-200">
                        {alert.emoji || "✂️"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-stone-800 text-sm truncate">
                            {alert.podaName || alert.plantingName}
                          </h4>
                          <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            Poda Ativa
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                          {alert.message}
                        </p>

                        {alert.goldenRule && (
                          <div className="mt-1.5 text-[11px] font-medium text-emerald-900 bg-emerald-100/80 rounded-lg p-1.5 leading-snug">
                            <b>Dica de Ouro:</b> {alert.goldenRule}
                          </div>
                        )}

                        <div className="mt-2.5 flex items-center gap-2">
                          {onOpen3D && (
                            <button
                              onClick={() =>
                                onOpen3D({
                                  type: "poda",
                                  name: alert.podaName,
                                  diagramType: alert.diagramType,
                                  item: alert,
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
                  );
                }

                // ALERTA DE MONDA & DESLADROAMENTO
                if (alert.type === "monda") {
                  return (
                    <div
                      key={alert.id}
                      className="rounded-2xl border border-lime-200 bg-lime-50/70 p-3.5 flex items-start gap-3 transition-all"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-lime-600 text-white flex items-center justify-center text-xl shrink-0 shadow-sm shadow-lime-200">
                        {alert.emoji || "🌱"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-stone-800 text-sm truncate">
                            {alert.mondaName || alert.plantingName}
                          </h4>
                          <span className="bg-lime-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            Monda / Desbaste
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                          {alert.message}
                        </p>

                        {alert.spacing && (
                          <p className="text-[11px] font-bold text-lime-800 mt-1">
                            📏 Espaçamento: {alert.spacing}
                          </p>
                        )}

                        <div className="mt-2.5 flex items-center gap-2">
                          {onOpen3D && (
                            <button
                              onClick={() =>
                                onOpen3D({
                                  type: "monda",
                                  name: alert.mondaName,
                                  diagramType: alert.diagramType,
                                  spacingCm: alert.spacing,
                                  item: alert,
                                })
                              }
                              className="px-3 py-1.5 rounded-xl bg-lime-700 hover:bg-lime-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs active:scale-95"
                            >
                              <Box className="w-3.5 h-3.5" />
                              <span>Ver Esquema 3D</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // ALERTA DE COLHEITA
                if (alert.type === "colheita") {
                  return (
                    <div
                      key={alert.id}
                      className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 flex items-start gap-3 transition-all"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm shadow-amber-200">
                        🌾
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-stone-800 text-sm truncate">
                            {alert.plantingName}
                          </h4>
                          <span className="bg-amber-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            Colheita
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  );
                }

                // ALERTA DE ANIMAL
                if (alert.type === "animal") {
                  return (
                    <div
                      key={alert.id}
                      className="rounded-2xl border border-orange-200 bg-orange-50/70 p-3.5 flex items-start gap-3 transition-all"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-orange-500 text-white flex items-center justify-center text-xl shrink-0 shadow-sm shadow-orange-200">
                        {alert.emoji || "🐾"}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <h4 className="font-bold text-stone-800 text-sm truncate">
                            {alert.animalName}
                          </h4>
                          <span className="bg-orange-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            Animais
                          </span>
                        </div>

                        <p className="text-xs text-stone-600 mt-0.5 leading-snug">
                          {alert.message}
                        </p>

                        {alert.location && (
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            📍 {alert.location}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
