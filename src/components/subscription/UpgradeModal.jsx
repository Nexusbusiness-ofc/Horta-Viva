import React, { useState } from "react";
import { Sparkles, Check, Lock, ShieldCheck, ArrowRight, ExternalLink, X } from "lucide-react";
import { STRIPE_PAYMENT_LINK, activateProSubscription } from "@/lib/subscription";

export default function UpgradeModal({ isOpen, onClose, onExploreCatalog }) {
  const [showRestore, setShowRestore] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    window.open(STRIPE_PAYMENT_LINK, "_blank", "noopener,noreferrer");
  };

  const handleRestore = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    activateProSubscription({ email: emailInput.trim() });
    setRestoreSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-100 overflow-hidden relative flex flex-col">
        {/* Botão fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 z-10 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Banner de destaque Pro */}
        <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 px-6 pt-7 pb-6 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-28 h-28 rounded-full bg-emerald-400/20 blur-lg pointer-events-none" />

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-emerald-100 mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Horta Viva Pro</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold leading-tight">
            Limite Gratuito Atingido
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1.5 max-w-xs mx-auto">
            Já aproveitaste a tua identificação gratuita. Desbloqueia fotos ilimitadas para toda a tua horta!
          </p>

          <div className="mt-4 inline-flex items-baseline gap-1.5 bg-black/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
            <span className="text-3xl font-extrabold text-white">2,99€</span>
            <span className="text-xs font-medium text-emerald-100">/ mês</span>
          </div>
        </div>

        {/* Corpo do modal */}
        <div className="p-5 sm:p-6 space-y-4">
          <div className="space-y-2.5">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                <strong>Identificações fotográficas ilimitadas:</strong> qualquer planta, legume, árvore, fruto ou erva aromática.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                <strong>Deteção de pragas e doenças:</strong> diagnóstico por IA botânica com tratamento biológico e convencional.
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-snug">
                <strong>Sem fidelização:</strong> cancelamento simples a qualquer momento com 1 clique.
              </p>
            </div>
          </div>

          {/* Botão de pagamento Stripe */}
          <button
            onClick={handleSubscribe}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-lg shadow-emerald-600/30 active:scale-[0.99] transition-all"
          >
            <span>Subscrever por 2,99€ / mês</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Pagamento 100% seguro processado pela <strong>Stripe</strong></span>
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
                ✅ Subscrição Pro ativada com sucesso!
              </p>
            ) : (
              <form onSubmit={handleRestore} className="space-y-2 mt-2 bg-stone-50 p-3 rounded-2xl border border-stone-200/80">
                <p className="text-[11px] text-stone-600">Introduz o teu email da compra para ativar:</p>
                <div className="flex gap-1.5">
                  <input
                    type="email"
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
