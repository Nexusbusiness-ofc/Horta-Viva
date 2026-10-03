import React, { useState } from "react";
import { Sparkles, Check, ShieldCheck, ArrowRight, X, RefreshCw, Loader2, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import GoogleIcon from "@/components/GoogleIcon";
import { syncSubscriptionWithGoogleAccount } from "@/lib/googleSync";
import { 
  getCheckoutUrl,
  validateAndActivateSubscription,
  useSubscription,
  FREE_PLANTATIONS_LIMIT,
  FREE_ANIMALS_LIMIT,
  FREE_PHOTO_LIMIT,
  FREE_AI_LIMIT,
  PLUS_PLANTATIONS_LIMIT,
  PLUS_ANIMALS_LIMIT,
  PLUS_PHOTO_LIMIT,
  PLUS_AI_LIMIT,
  PRO_PLANTATIONS_LIMIT,
  PRO_ANIMALS_LIMIT,
  PRO_PHOTO_LIMIT
} from "@/lib/subscription";

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  onExploreCatalog,
  reason = "photos",
  customTitle,
  customDescription
}) {
  const [selectedPlan, setSelectedPlan] = useState("pro"); // "plus" | "pro" | "ultra"
  const [showRestore, setShowRestore] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const [syncingGoogle, setSyncingGoogle] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState(null);
  const { isPro, isPlus, isUltra, tier } = useSubscription();

  if (!isOpen) return null;

  const handleSubscribe = () => {
    const url = getCheckoutUrl(selectedPlan);
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleGoogleRestore = async () => {
    setSyncingGoogle(true);
    setRestoreMessage(null);
    try {
      const res = await syncSubscriptionWithGoogleAccount(true);
      if (res.success && res.restored) {
        setRestoreSuccess(true);
        const tierName = res.tier === "ultra" ? "Ultra" : res.tier === "pro" ? "Pro" : "Plus";
        setRestoreMessage({
          type: "success",
          text: `Subscrição ${tierName} sincronizada com sucesso com a Conta Google!`,
        });
        setTimeout(() => {
          onClose();
        }, 1600);
      } else {
        setRestoreMessage({
          type: "error",
          text: `Nenhuma subscrição ativa encontrada na Conta Google (${res.email || "atual"}). Se subscreveste com outra conta, inicia sessão com essa conta.`,
        });
      }
    } catch (err) {
      setRestoreMessage({
        type: "error",
        text: err?.message || "Erro ao conectar à Conta Google.",
      });
    } finally {
      setSyncingGoogle(false);
    }
  };

  const handleManualRestore = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const validation = validateAndActivateSubscription(emailInput.trim());
    if (validation.success) {
      setRestoreSuccess(true);
      setRestoreMessage({ type: "success", text: validation.message });
      setEmailInput("");
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setRestoreMessage({ type: "error", text: validation.error });
    }
  };

  const getHeaderInfo = () => {
    if (isUltra) {
      return {
        tag: "🚀 Subscrição Ultra Ativa",
        title: "Tens o Plano Ultra Ativo!",
        desc: "Aproveita todas as funcionalidades sem quaisquer limites: plantações, animais e fotos infinitas.",
      };
    }
    if (isPro) {
      return {
        tag: "⭐ Subscrição Pro Ativa",
        title: "Tens o Plano Pro Ativo",
        desc: "Até 8 plantações, 7 animais, 15 fotos/mês, IA ilimitada e esquemas 3D. Queres tudo infinito? Faz upgrade para o Ultra (3,99€)!",
      };
    }
    if (isPlus) {
      return {
        tag: "🌱 Plano Plus Ativo",
        title: "Tens o Plano Plus Ativo",
        desc: "Até 5 plantações, 4 animais, 10 fotos/mês e 20 chats/mês. Atualiza para o Pro (2,99€) ou Ultra (3,99€)!",
      };
    }
    if (reason === "home") {
      return {
        tag: "⭐ Escolhe o Teu Plano",
        title: customTitle || "Cultiva a Tua Horta Sem Limites",
        desc: customDescription || "Escolhe o plano que melhor se adapta à dimensão da tua horta e quinta familiar.",
      };
    }
    if (reason === "resumo") {
      return {
        tag: "Resumo Mensal · Bloqueado",
        title: customTitle || "Desbloquear Resumo Mensal",
        desc: customDescription || "Disponível a partir do Plano Plus (1,99€/mês) ou completo no Pro e Ultra.",
      };
    }
    if (reason === "esquemas") {
      return {
        tag: "Podas e Mondas · Esquemas",
        title: customTitle || "Desbloquear Esquemas 2D e 3D",
        desc: customDescription || "Esquemas 2D disponíveis no Plus (1,99€) e modelos 3D no Pro (2,99€) e Ultra (3,99€).",
      };
    }
    if (reason === "plantacoes") {
      return {
        tag: "Minha Quinta · Plantações",
        title: customTitle || "Limite de Plantações Atingido",
        desc: customDescription || `O plano base permite até ${FREE_PLANTATIONS_LIMIT} plantações. Escolhe Plus (até ${PLUS_PLANTATIONS_LIMIT}), Pro (até ${PRO_PLANTATIONS_LIMIT}) ou Ultra (infinitas)!`,
      };
    }
    if (reason === "animais") {
      return {
        tag: "Minha Quinta · Animais",
        title: customTitle || "Limite de Animais Atingido",
        desc: customDescription || `O plano base permite até ${FREE_ANIMALS_LIMIT} animais. Escolhe Plus (até ${PLUS_ANIMALS_LIMIT}), Pro (até ${PRO_ANIMALS_LIMIT}) ou Ultra (infinitos)!`,
      };
    }
    if (reason === "ai") {
      return {
        tag: "Inteligência Artificial · IA",
        title: customTitle || "Limite de IA Atingido",
        desc: customDescription || `Atingiste o limite de ${FREE_AI_LIMIT} chats de IA/mês. Escolhe o Plano Plus (${PLUS_AI_LIMIT} chats/mês) ou Pro/Ultra (ilimitada)!`,
      };
    }
    if (reason === "photos") {
      return {
        tag: "Identificação por Foto · IA",
        title: customTitle || "Limite de Fotos por IA Atingido",
        desc: customDescription || `Atingiste o limite de ${FREE_PHOTO_LIMIT} fotos/mês. Escolhe Plus (${PLUS_PHOTO_LIMIT}/mês), Pro (${PRO_PHOTO_LIMIT}/mês) ou Ultra (infinitas)!`,
      };
    }
    return {
      tag: "Planos Horta Viva",
      title: customTitle || "Escolhe o Teu Plano",
      desc: customDescription || "Desbloqueia todo o potencial da tua horta e quinta com recursos alargados!",
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl sm:max-w-2xl lg:max-w-3xl w-full shadow-2xl border border-stone-100 overflow-hidden relative flex flex-col my-auto max-h-[94vh]">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 hover:bg-stone-100 flex items-center justify-center text-stone-500 z-10 transition-colors shadow-xs"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner de destaque */}
        <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-5 pt-6 pb-5 text-white text-center relative overflow-hidden shrink-0">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-emerald-400/20 blur-lg pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-emerald-100 mb-2.5 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{headerInfo.tag}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
            {headerInfo.title}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-sm mx-auto">
            {headerInfo.desc}
          </p>
        </div>

        {/* Corpo do modal com scroll interno se necessário */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Seletor de Planos (Plus 1,99€ vs Pro 2,99€ vs Ultra 3,99€) */}
          {!isUltra && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider text-center">
                Selecione o plano desejado:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Opção 1: Plano Plus 1,99€ */}
                <div 
                  onClick={() => setSelectedPlan("plus")}
                  className={`cursor-pointer rounded-2xl p-3 sm:p-3.5 border-2 transition-all relative flex flex-col justify-between ${
                    selectedPlan === "plus" 
                      ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-400/30" 
                      : "border-stone-200 hover:border-emerald-200 bg-white"
                  }`}
                >
                  {isPlus && (
                    <span className="absolute -top-2.5 left-2.5 text-[9px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                      Plano Atual
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-extrabold uppercase tracking-wide text-emerald-800">
                        🌱 Plus
                      </span>
                      <input 
                        type="radio" 
                        name="plan_choice" 
                        checked={selectedPlan === "plus"} 
                        onChange={() => setSelectedPlan("plus")}
                        className="accent-emerald-600"
                      />
                    </div>
                    <div className="mt-1.5">
                      <span className="text-2xl font-black text-stone-800">1,99€</span>
                      <span className="text-[10px] text-stone-500 font-medium"> / mês</span>
                    </div>

                    <div className="mt-2.5 space-y-1 text-[11px] text-stone-700">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[3]" />
                        <span><strong>20 chats IA</strong> / mês</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[3]" />
                        <span><strong>5 plantações</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[3]" />
                        <span><strong>4 animais</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[3]" />
                        <span><strong>10 fotos IA</strong> / mês</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>Resumo encurtado</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-emerald-600 shrink-0 stroke-[3]" />
                        <span>Esquemas 2D (podas e mondas)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opção 2: Plano Pro 2,99€ */}
                <div 
                  onClick={() => setSelectedPlan("pro")}
                  className={`cursor-pointer rounded-2xl p-3 sm:p-3.5 border-2 transition-all relative flex flex-col justify-between ${
                    selectedPlan === "pro" 
                      ? "border-amber-500 bg-gradient-to-b from-amber-50/70 to-yellow-50/40 shadow-md ring-2 ring-amber-400/40" 
                      : "border-stone-200 hover:border-amber-200 bg-white"
                  }`}
                >
                  <span className="absolute -top-2.5 right-2 text-[9px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900 px-2 py-0.5 rounded-full shadow-xs">
                    ⭐ Popular
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wide text-amber-900">
                        ⭐ Pro
                      </span>
                      <input 
                        type="radio" 
                        name="plan_choice" 
                        checked={selectedPlan === "pro"} 
                        onChange={() => setSelectedPlan("pro")}
                        className="accent-amber-600"
                      />
                    </div>
                    <div className="mt-1.5">
                      <span className="text-2xl font-black text-stone-900">2,99€</span>
                      <span className="text-[10px] text-stone-500 font-medium"> / mês</span>
                    </div>

                    <div className="mt-2.5 space-y-1 text-[11px] text-stone-800">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-amber-600 shrink-0 stroke-[3]" />
                        <span><strong>IA Ilimitada</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-amber-600 shrink-0 stroke-[3]" />
                        <span><strong>8 plantações</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-amber-600 shrink-0 stroke-[3]" />
                        <span><strong>7 animais</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-amber-600 shrink-0 stroke-[3]" />
                        <span><strong>15 fotos IA</strong> / mês</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-amber-600 shrink-0 stroke-[3]" />
                        <span>Resumo detalhado</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-amber-600 shrink-0 stroke-[3]" />
                        <span>Esquemas 3D e 2D</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opção 3: Plano Ultra 3,99€ */}
                <div 
                  onClick={() => setSelectedPlan("ultra")}
                  className={`cursor-pointer rounded-2xl p-3 sm:p-3.5 border-2 transition-all relative flex flex-col justify-between ${
                    selectedPlan === "ultra" 
                      ? "border-purple-500 bg-gradient-to-b from-purple-50/70 to-indigo-50/40 shadow-md ring-2 ring-purple-400/40" 
                      : "border-stone-200 hover:border-purple-200 bg-white"
                  }`}
                >
                  <span className="absolute -top-2.5 right-2 text-[9px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                    🚀 Total
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-black uppercase tracking-wide text-purple-900">
                        🚀 Ultra
                      </span>
                      <input 
                        type="radio" 
                        name="plan_choice" 
                        checked={selectedPlan === "ultra"} 
                        onChange={() => setSelectedPlan("ultra")}
                        className="accent-purple-600"
                      />
                    </div>
                    <div className="mt-1.5">
                      <span className="text-2xl font-black text-purple-950">3,99€</span>
                      <span className="text-[10px] text-stone-500 font-medium"> / mês</span>
                    </div>

                    <div className="mt-2.5 space-y-1 text-[11px] text-stone-800">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-purple-600 shrink-0 stroke-[3]" />
                        <span><strong>IA Ilimitada</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-purple-600 shrink-0 stroke-[3]" />
                        <span><strong>Plantações Infinitas</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-purple-600 shrink-0 stroke-[3]" />
                        <span><strong>Animais Infinitos</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-purple-600 shrink-0 stroke-[3]" />
                        <span><strong>Fotos Infinitas</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-purple-600 shrink-0 stroke-[3]" />
                        <span>Resumo detalhado</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-purple-600 shrink-0 stroke-[3]" />
                        <span>Esquemas 3D e 2D</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão de pagamento Stripe ou Estado Ativo */}
          {isUltra ? (
            <div className="space-y-2">
              <div className="bg-purple-50 border border-purple-200 rounded-2xl p-3.5 text-center">
                <p className="text-xs font-bold text-purple-900">✅ A tua subscrição Ultra está ativa</p>
                <p className="text-[11px] text-purple-700 mt-0.5">Tens acesso ilimitado e infinito a todas as funcionalidades!</p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-[0.99]"
              >
                Continuar a Usar a Horta
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              className={`w-full flex items-center justify-center gap-2 font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-lg active:scale-[0.99] transition-all ${
                selectedPlan === "ultra"
                  ? "bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white shadow-purple-600/30 font-black"
                  : selectedPlan === "plus"
                  ? "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-600/30"
                  : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-stone-900 shadow-amber-500/30 font-black"
              }`}
            >
              <span>
                {selectedPlan === "ultra"
                  ? "Subscrever Plano Ultra por 3,99€ / mês"
                  : selectedPlan === "plus"
                  ? "Subscrever Plano Plus por 1,99€ / mês"
                  : "Subscrever Horta Viva Pro por 2,99€ / mês"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sem fidelização · Pagamento 100% seguro via <strong>Stripe</strong></span>
          </div>

          {/* Link para página detalhada de comparação */}
          <div className="text-center pt-1">
            <Link
              to="/pro"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
            >
              <span>📊 Ver comparação completa entre Base, Plus, Pro e Ultra</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Opção secundária: Catálogo Botânico gratuito */}
          {onExploreCatalog && (
            <div className="pt-2 border-t border-stone-100 text-center">
              <button
                onClick={() => {
                  onClose();
                  onExploreCatalog();
                }}
                className="text-xs font-semibold text-teal-700 hover:text-teal-800 transition-colors"
              >
                📖 Continuar a usar o Catálogo Botânico Gratuito (50+ espécies)
              </button>
            </div>
          )}

          {/* Restaurar subscrição com Conta Google */}
          <div className="text-center pt-1 border-t border-stone-100 mt-2">
            {!showRestore ? (
              <button
                type="button"
                onClick={() => setShowRestore(true)}
                className="text-[11px] text-stone-500 hover:text-emerald-700 underline font-medium inline-flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Já subscreveste noutro dispositivo? Sincronizar Pro</span>
              </button>
            ) : restoreSuccess ? (
              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-center">
                <p className="text-xs text-emerald-700 font-bold">
                  ✅ Subscrição restaurada com sucesso!
                </p>
                {restoreMessage && (
                  <p className="text-[11px] text-emerald-600 mt-1">{restoreMessage.text}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2.5 mt-2 bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 text-left">
                <div>
                  <h4 className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Sincronizar com a Conta Google</span>
                  </h4>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    A tua subscrição fica guardada na tua Conta Google. Ao sincronizares, o teu plano Pro é ativado automaticamente neste dispositivo.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleRestore}
                  disabled={syncingGoogle}
                  className="w-full flex items-center justify-center gap-2 bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs py-2.5 px-3 rounded-xl border border-stone-200 shadow-2xs transition-all disabled:opacity-60"
                >
                  {syncingGoogle ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                      <span>A verificar Conta Google...</span>
                    </>
                  ) : (
                    <>
                      <GoogleIcon className="w-4 h-4" />
                      <span>Sincronizar Subscrição da Conta Google</span>
                    </>
                  )}
                </button>

                {restoreMessage && (
                  <p className={`text-[11px] font-medium p-2 rounded-lg ${
                    restoreMessage.type === "success" 
                      ? "bg-emerald-100 text-emerald-800" 
                      : "bg-amber-100 text-amber-900 border border-amber-200"
                  }`}>
                    {restoreMessage.text}
                  </p>
                )}

                <form onSubmit={handleManualRestore} className="pt-2 border-t border-stone-200/60">
                  <p className="text-[10px] text-stone-500 mb-1">
                    Tens um código de ativação?
                  </p>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Código de ativação"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="flex-1 bg-white border border-stone-200 rounded-xl px-2.5 py-1 text-xs text-stone-800 outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs px-3 py-1 rounded-xl transition-colors shrink-0"
                    >
                      Validar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
