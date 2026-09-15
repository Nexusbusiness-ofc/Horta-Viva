import React, { useState } from "react";
import { Sparkles, Check, Lock, ShieldCheck, ArrowRight, ExternalLink, X, Sprout, PawPrint, Camera, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { 
  STRIPE_PAYMENT_LINK, 
  STRIPE_PLUS_PAYMENT_LINK, 
  activateProSubscription, 
  useSubscription,
  PLUS_PLANTATIONS_LIMIT,
  PLUS_ANIMALS_LIMIT,
  PLUS_PHOTO_LIMIT,
  PLUS_AI_LIMIT,
  FREE_PLANTATIONS_LIMIT,
  FREE_ANIMALS_LIMIT,
  FREE_AI_LIMIT
} from "@/lib/subscription";

export default function UpgradeModal({ 
  isOpen, 
  onClose, 
  onExploreCatalog,
  reason = "photos",
  customTitle,
  customDescription
}) {
  const [selectedPlan, setSelectedPlan] = useState("pro"); // "plus" | "pro"
  const [showRestore, setShowRestore] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [restoreSuccess, setRestoreSuccess] = useState(false);
  const { isPro, isPlus, tier } = useSubscription();

  if (!isOpen) return null;

  const handleSubscribe = () => {
    const url = selectedPlan === "plus" ? STRIPE_PLUS_PAYMENT_LINK : STRIPE_PAYMENT_LINK;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const handleRestore = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const input = emailInput.trim();
    activateProSubscription({ email: input });
    setRestoreSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  const getHeaderInfo = () => {
    if (isPro) {
      return {
        tag: "⭐ Subscrição Pro Ativa",
        title: "Tens o Plano Pro Ativo!",
        desc: "Aproveita todas as funcionalidades sem quaisquer limites neste dispositivo.",
      };
    }
    if (isPlus) {
      return {
        tag: "🌱 Plano Plus Ativo",
        title: "Tens o Plano Plus Ativo",
        desc: "Queres funcionalidades ilimitadas? Atualiza para o Horta Viva Pro por apenas 2,99€/mês.",
      };
    }
    if (reason === "home") {
      return {
        tag: "⭐ Escolhe o Teu Plano",
        title: customTitle || "Cultiva a Tua Horta Sem Limites",
        desc: customDescription || "Escolhe o plano que melhor se adapta à dimensão da tua horta e quinta familiar.",
      };
    }
    if (reason === "plantacoes") {
      return {
        tag: "Minha Quinta · Plantações",
        title: customTitle || "Limite de Plantações Atingido",
        desc: customDescription || `O plano base permite até ${FREE_PLANTATIONS_LIMIT} plantações. Escolhe o Plano Plus (até ${PLUS_PLANTATIONS_LIMIT}) ou Pro (ilimitado)!`,
      };
    }
    if (reason === "animais") {
      return {
        tag: "Minha Quinta · Animais",
        title: customTitle || "Limite de Animais Atingido",
        desc: customDescription || `O plano base permite até ${FREE_ANIMALS_LIMIT} animais. Escolhe o Plano Plus (até ${PLUS_ANIMALS_LIMIT}) ou Pro (ilimitado)!`,
      };
    }
    if (reason === "ai") {
      return {
        tag: "Inteligência Artificial · IA",
        title: customTitle || "Limite de IA Atingido",
        desc: customDescription || `Atingiste o limite de consultas de IA. Escolhe o Plano Plus (${PLUS_AI_LIMIT} usos/mês) ou Pro (ilimitado)!`,
      };
    }
    if (reason === "photos") {
      return {
        tag: "IA de Plantas · Foto",
        title: customTitle || "Limite de Fotos por IA Atingido",
        desc: customDescription || `Atingiste o limite de fotos por IA. Escolhe o Plano Plus (${PLUS_PHOTO_LIMIT} fotos/mês) ou Pro (ilimitado)!`,
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
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-100 overflow-hidden relative flex flex-col my-auto max-h-[92vh]">
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
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xs mx-auto">
            {headerInfo.desc}
          </p>
        </div>

        {/* Corpo do modal com scroll interno se necessário */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Seletor de Planos (Plus 1,99€ vs Pro 2,99€) */}
          {!isPro && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider text-center">
                Selecione a opção desejada:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Opção 1: Plano Plus 1,99€ */}
                <div 
                  onClick={() => setSelectedPlan("plus")}
                  className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 border-2 transition-all relative flex flex-col justify-between ${
                    selectedPlan === "plus" 
                      ? "border-emerald-500 bg-emerald-50/50 shadow-md ring-2 ring-emerald-400/30" 
                      : "border-stone-200 hover:border-emerald-200 bg-white"
                  }`}
                >
                  {isPlus && (
                    <span className="absolute -top-2.5 left-3 text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                      Plano Atual
                    </span>
                  )}
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wide text-emerald-800">
                        🌱 Plano Plus
                      </span>
                      <input 
                        type="radio" 
                        name="plan_choice" 
                        checked={selectedPlan === "plus"} 
                        onChange={() => setSelectedPlan("plus")}
                        className="accent-emerald-600"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-black text-stone-800">1,99€</span>
                      <span className="text-xs text-stone-500 font-medium"> / mês</span>
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1 leading-tight">
                      Ideal para hortas médias e quintas caseiras.
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-stone-700">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span><strong>Até 6 plantações</strong> na quinta</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span><strong>Até 5 animais</strong> com tarefas</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span><strong>3 fotos com IA</strong> / mês</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[3]" />
                        <span><strong>4 usos da IA</strong> / mês</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Opção 2: Plano Pro 2,99€ */}
                <div 
                  onClick={() => setSelectedPlan("pro")}
                  className={`cursor-pointer rounded-2xl p-3.5 sm:p-4 border-2 transition-all relative flex flex-col justify-between ${
                    selectedPlan === "pro" 
                      ? "border-amber-500 bg-gradient-to-b from-amber-50/70 to-yellow-50/40 shadow-md ring-2 ring-amber-400/40" 
                      : "border-stone-200 hover:border-amber-200 bg-white"
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 text-[10px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900 px-2 py-0.5 rounded-full shadow-xs">
                    ⭐ Mais Popular
                  </span>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black uppercase tracking-wide text-amber-900">
                        ⭐ Horta Viva Pro
                      </span>
                      <input 
                        type="radio" 
                        name="plan_choice" 
                        checked={selectedPlan === "pro"} 
                        onChange={() => setSelectedPlan("pro")}
                        className="accent-amber-600"
                      />
                    </div>
                    <div className="mt-2">
                      <span className="text-2xl font-black text-stone-900">2,99€</span>
                      <span className="text-xs text-stone-500 font-medium"> / mês</span>
                    </div>
                    <p className="text-[11px] text-amber-950 font-medium mt-1 leading-tight">
                      Acesso total sem quaisquer limites.
                    </p>

                    <div className="mt-3 space-y-1.5 text-xs text-stone-800">
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 stroke-[3]" />
                        <span><strong>Plantações Ilimitadas</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 stroke-[3]" />
                        <span><strong>Animais Ilimitados</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 stroke-[3]" />
                        <span><strong>Fotos com IA Ilimitadas</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 stroke-[3]" />
                        <span><strong>Assistente IA Ilimitado</strong></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-600">
                        <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 stroke-[3]" />
                        <span>Diagnóstico de pragas & doenças</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Botão de pagamento Stripe ou Estado Ativo */}
          {isPro ? (
            <div className="space-y-2">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-center">
                <p className="text-xs font-bold text-emerald-800">✅ A tua subscrição Pro está ativa</p>
                <p className="text-[11px] text-emerald-600 mt-0.5">Tens acesso ilimitado à IA, fotos, plantações e animais.</p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm py-3.5 px-4 rounded-2xl shadow-md transition-all active:scale-[0.99]"
              >
                Continuar a Usar a Horta
              </button>
            </div>
          ) : (
            <button
              onClick={handleSubscribe}
              className={`w-full flex items-center justify-center gap-2 font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-lg active:scale-[0.99] transition-all ${
                selectedPlan === "plus"
                  ? "bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-600/30"
                  : "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-600 hover:to-yellow-600 text-stone-900 shadow-amber-500/30 font-black"
              }`}
            >
              <span>
                {selectedPlan === "plus"
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
              <span>📊 Ver comparação completa entre Base, Plus e Pro</span>
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

          {/* Restaurar subscrição */}
          <div className="text-center pt-1">
            {!showRestore ? (
              <button
                type="button"
                onClick={() => setShowRestore(true)}
                className="text-[11px] text-stone-400 hover:text-stone-600 underline"
              >
                Já subscreveste? Ativar neste dispositivo
              </button>
            ) : restoreSuccess ? (
              <p className="text-xs text-emerald-600 font-bold">
                ✅ Subscrição ativada com sucesso!
              </p>
            ) : (
              <form onSubmit={handleRestore} className="space-y-2 mt-2 bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
                <p className="text-[11px] text-stone-600">Introduz o teu email da compra para ativar:</p>
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    required
                    placeholder="teu.email@exemplo.com"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="flex-1 bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs text-stone-800 outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-xl hover:bg-emerald-700 transition-colors"
                  >
                    Ativar
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
