import React, { useState } from "react";
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, Camera, 
  Sprout, PawPrint, Bug, RefreshCw, ChevronDown, ChevronUp, Loader2
} from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { 
  syncSubscriptionWithGoogleAccount, 
  isGoogleConnected, 
  getGoogleUser 
} from "@/lib/googleSync";
import { 
  getCheckoutUrl,
  validateAndActivateSubscription,
  useSubscription, 
  FREE_PLANTATIONS_LIMIT,
  FREE_ANIMALS_LIMIT,
  FREE_AI_LIMIT,
  FREE_IDENTIFICATION_LIMIT,
  PLUS_PLANTATIONS_LIMIT,
  PLUS_ANIMALS_LIMIT,
  PLUS_PHOTO_LIMIT,
  PLUS_AI_LIMIT
} from "@/lib/subscription";
import { useToast } from "@/components/ui/use-toast";

export default function ProSubscriptionView({ onSubscribed }) {
  const { isPro, isPlus, tier, usageCount } = useSubscription();
  const [emailInput, setEmailInput] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [showFaq, setShowFaq] = useState(null);
  const { toast } = useToast();

  const handleSubscribePro = () => {
    window.open(getCheckoutUrl("pro"), "_blank", "noopener,noreferrer");
  };

  const handleSubscribePlus = () => {
    window.open(getCheckoutUrl("plus"), "_blank", "noopener,noreferrer");
  };

  const handleGoogleSyncRestore = async () => {
    setRestoring(true);
    try {
      const res = await syncSubscriptionWithGoogleAccount(true);
      if (res.success && res.restored) {
        toast({
          title: `🎉 Subscrição ${res.tier === "pro" ? "Pro" : "Plus"} Sincronizada!`,
          description: `A tua subscrição foi restaurada com sucesso através da Conta Google (${res.email}).`,
        });
        if (onSubscribed) onSubscribed();
      } else {
        toast({
          variant: "destructive",
          title: "Nenhuma subscrição encontrada",
          description: `Não foi encontrada nenhuma subscrição Pro ou Plus ativa na Conta Google (${res.email || "atual"}). Se compraste com outra conta, inicia sessão com essa conta.`,
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro na sincronização Google",
        description: err?.message || String(err),
      });
    } finally {
      setRestoring(false);
    }
  };

  const handleRestore = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const validation = validateAndActivateSubscription(emailInput.trim());
    if (validation.success) {
      toast({
        title: "🎉 Código Validado!",
        description: validation.message,
      });
      setEmailInput("");
      if (onSubscribed) onSubscribed();
    } else {
      toast({
        variant: "destructive",
        title: "Código ou Email Não Válido",
        description: validation.error,
      });
    }
  };

  const faqs = [
    {
      q: "Qual é a diferença entre o Plano Plus (1,99€) e o Pro (2,99€)?",
      a: "O Plano Plus (1,99€/mês) oferece até 6 plantações e 5 animais na Minha Quinta, 3 fotos com IA por mês e 4 conversas com o Assistente IA por mês. O Plano Pro (2,99€/mês) oferece acesso totalmente ILIMITADO a todas as ferramentas (plantações, animais, fotos e IA sem limites)."
    },
    {
      q: "Como funciona a renovação mensal?",
      a: "O pagamento é processado com total segurança através da Stripe. A mensalidade (1,99€ ou 2,99€) renova automaticamente mês a mês, sem taxas ocultas e sem fidelização."
    },
    {
      q: "Posso cancelar quando quiser?",
      a: "Sim! Não há qualquer período de fidelização. Podes cancelar a subscrição a qualquer momento diretamente pelo recibo de compra da Stripe com apenas 1 clique."
    },
    {
      q: "Posso utilizar a subscrição noutro telemóvel ou tablet?",
      a: "Com certeza! Basta acederes a esta página no teu outro dispositivo e introduzires o e-mail usado na compra no campo 'Restaurar Subscrição'."
    }
  ];

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      {/* Banner Principal */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-emerald-100 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Planos Horta Viva</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
            Cultiva a tua horta com poder inteligente
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 max-w-lg leading-relaxed">
            Identifica plantas e pragas por foto com Inteligência Artificial e gere todas as tuas plantações e animais na Minha Quinta.
          </p>

          {/* Estado atual se ativo */}
          {isPro ? (
            <div className="mt-6 flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-white font-bold text-sm">
              <span className="text-lg">⭐</span>
              <span>Tens o Plano Pro Ativo! Aproveita todos os recursos sem limites.</span>
            </div>
          ) : isPlus ? (
            <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-white">
              <div>
                <p className="font-bold text-sm">🌱 Tens o Plano Plus Ativo (1,99€/mês)</p>
                <p className="text-xs text-emerald-100">Até 6 plantações, 5 animais, 3 fotos IA e 4 consultas IA/mês.</p>
              </div>
              <button
                onClick={handleSubscribePro}
                className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition-all"
              >
                Fazer Upgrade para Pro (2,99€)
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-emerald-100 font-medium">
              <span className="bg-white/20 px-2.5 py-1 rounded-full">Plano Plus: 1,99€ / mês</span>
              <span className="bg-amber-400/30 text-amber-200 px-2.5 py-1 rounded-full font-bold">Plano Pro: 2,99€ / mês</span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100/80">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Processado com encriptação segura pela <strong>Stripe</strong></span>
          </div>
        </div>
      </div>

      {/* Cartões dos 2 Planos de Compra */}
      {!isPro && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Card Plano Plus */}
          <div className={`bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-sm flex flex-col justify-between relative transition-all ${
            isPlus ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-400/20" : "border-stone-200 hover:border-emerald-300"
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                  Plano Plus
                </span>
                {isPlus && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md">
                    ✓ Ativo
                  </span>
                )}
              </div>

              <div className="mt-3">
                <span className="text-3xl font-black text-stone-900">1,99€</span>
                <span className="text-xs text-stone-500 font-medium"> / mês</span>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                Perfeito para quem tem uma horta familiar e animais domésticos.
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span><strong>Até 6 plantações</strong> na Minha Quinta</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span><strong>Até 5 animais</strong> com lembretes diários</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span><strong>3 identificações de fotos com IA</strong> / mês</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span><strong>4 utilizações do Assistente IA</strong> / mês</span>
                </div>
                <div className="flex items-center gap-2 text-stone-500">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                  <span>Acesso integral ao Catálogo Botânico</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-stone-100">
              {isPlus ? (
                <div className="text-center py-2 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">
                  Plano Plus Ativo
                </div>
              ) : (
                <button
                  onClick={handleSubscribePlus}
                  className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                  <span>Subscrever Plus (1,99€)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Card Plano Pro */}
          <div className="bg-gradient-to-b from-amber-50/60 to-white rounded-3xl p-5 sm:p-6 border-2 border-amber-400 shadow-md flex flex-col justify-between relative transition-all ring-2 ring-amber-300/30">
            <span className="absolute -top-3 right-4 text-[11px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900 px-3 py-0.5 rounded-full shadow-sm">
              ⭐ MAIS ESCOLHIDO
            </span>

            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full">
                  Horta Viva Pro
                </span>
              </div>

              <div className="mt-3">
                <span className="text-3xl font-black text-stone-900">2,99€</span>
                <span className="text-xs text-stone-500 font-medium"> / mês</span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                A experiência definitiva sem qualquer tipo de restrição.
              </p>

              <div className="mt-4 space-y-2.5 text-xs text-stone-800">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                  <span><strong>Plantações Ilimitadas</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                  <span><strong>Animais Ilimitados</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                  <span><strong>Fotos com IA Ilimitadas</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                  <span><strong>Assistente de IA Ilimitado</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                  <span>Diagnóstico prioritário de pragas & doenças</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-100">
              <button
                onClick={handleSubscribePro}
                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-stone-950 font-black text-sm py-3 px-4 rounded-xl shadow-md shadow-amber-500/30 active:scale-95 transition-all"
              >
                <span>Subscrever Pro (2,99€)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cartões de Benefícios Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0 text-cyan-700">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">Fotos & Identificação IA</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Fotografa plantas, folhas ou flores e recebe fichas botânicas completas com dicas de cultivo.
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">
              Base: {FREE_IDENTIFICATION_LIMIT} usos · Plus: {PLUS_PHOTO_LIMIT}/mês · Pro: Ilimitado
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">Plantações na Minha Quinta</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Organiza os teus canteiros com datas de sementeira, rega e previsão de colheita.
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">
              Base: {FREE_PLANTATIONS_LIMIT} canteiros · Plus: {PLUS_PLANTATIONS_LIMIT} canteiros · Pro: Ilimitado
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-700">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">Animais da Quinta</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Regista animais da quinta e obtém tarefas automáticas diárias de alimentação e higiene.
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">
              Base: {FREE_ANIMALS_LIMIT} animais · Plus: {PLUS_ANIMALS_LIMIT} animais · Pro: Ilimitado
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-700">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">Assistente IA & Pragas</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Conversa com a IA sobre o que plantar, tratamentos biológicos e dúvidas de agricultura em Portugal.
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">
              Base: {FREE_AI_LIMIT} usos · Plus: {PLUS_AI_LIMIT}/mês · Pro: Ilimitado
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Comparação dos 3 Planos */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/60">
          <h3 className="text-sm sm:text-base font-bold text-stone-800">
            Comparação dos Planos
          </h3>
          <p className="text-xs text-stone-500">Compara os recursos incluídos em cada opção</p>
        </div>

        <div className="divide-y divide-stone-100 text-xs sm:text-sm">
          <div className="grid grid-cols-4 p-3 sm:p-4 bg-stone-50/40 font-bold text-stone-500 text-[10px] sm:text-[11px] uppercase tracking-wider">
            <span>Recurso</span>
            <span className="text-center">Base (0€)</span>
            <span className="text-center text-emerald-700">Plus (1,99€)</span>
            <span className="text-center text-amber-700">Pro (2,99€)</span>
          </div>

          <div className="grid grid-cols-4 p-3 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Plantações</span>
            <span className="text-center text-stone-500">Até 3</span>
            <span className="text-center font-bold text-emerald-700">Até 6</span>
            <span className="text-center font-black text-amber-800 bg-amber-50 py-1 rounded-md">Ilimitado</span>
          </div>

          <div className="grid grid-cols-4 p-3 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Animais</span>
            <span className="text-center text-stone-500">Até 2</span>
            <span className="text-center font-bold text-emerald-700">Até 5</span>
            <span className="text-center font-black text-amber-800 bg-amber-50 py-1 rounded-md">Ilimitado</span>
          </div>

          <div className="grid grid-cols-4 p-3 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Fotos com IA</span>
            <span className="text-center text-stone-500">{FREE_IDENTIFICATION_LIMIT} fotos</span>
            <span className="text-center font-bold text-emerald-700">{PLUS_PHOTO_LIMIT} / mês</span>
            <span className="text-center font-black text-amber-800 bg-amber-50 py-1 rounded-md">Ilimitado</span>
          </div>

          <div className="grid grid-cols-4 p-3 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Assistente IA</span>
            <span className="text-center text-stone-500">{FREE_AI_LIMIT} usos</span>
            <span className="text-center font-bold text-emerald-700">{PLUS_AI_LIMIT} / mês</span>
            <span className="text-center font-black text-amber-800 bg-amber-50 py-1 rounded-md">Ilimitado</span>
          </div>

          <div className="grid grid-cols-4 p-3 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Catálogo (50+ espécies)</span>
            <span className="text-center text-emerald-600 font-semibold">✓</span>
            <span className="text-center text-emerald-600 font-semibold">✓</span>
            <span className="text-center text-emerald-600 font-semibold">✓</span>
          </div>

          <div className="grid grid-cols-4 p-3 sm:p-4 items-center bg-stone-50/50">
            <span className="font-bold text-stone-800">Preço</span>
            <span className="text-center font-semibold text-stone-600">0,00€</span>
            <span className="text-center font-bold text-emerald-700">1,99€ / mês</span>
            <span className="text-center font-black text-amber-700 text-sm">2,99€ / mês</span>
          </div>
        </div>
      </div>

      {/* Secção de Restauro e Sincronização via Conta Google */}
      <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-3xl p-5 sm:p-6 border border-emerald-100/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
            <RefreshCw className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-stone-800">
              Sincronização com a Conta Google (Multi-dispositivo)
            </h3>
            <p className="text-xs text-stone-500">
              Usa o teu plano Pro ou Plus em qualquer telemóvel, tablet ou computador.
            </p>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          A tua subscrição Pro ou Plus fica vinculada à tua <strong>Conta Google</strong>. Sempre que iniciares sessão com a mesma conta Google noutro dispositivo, o teu plano é sincronizado e ativado de imediato sem teres de pagar novamente.
        </p>

        {isGoogleConnected() ? (
          <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">Conta Google ativa:</span>
              <span className="font-bold text-emerald-800">{getGoogleUser()?.email || "Ligada"}</span>
            </div>
            <button
              type="button"
              onClick={handleGoogleSyncRestore}
              disabled={restoring}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50"
            >
              {restoring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>A sincronizar com a Conta Google...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Sincronizar Subscrição da Conta Google</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <button
              type="button"
              onClick={handleGoogleSyncRestore}
              disabled={restoring}
              className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-stone-200 shadow-2xs transition-all active:scale-95 disabled:opacity-50"
            >
              {restoring ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>A ligar à Conta Google...</span>
                </>
              ) : (
                <>
                  <GoogleIcon className="w-4 h-4" />
                  <span>Entrar com a Conta Google para Sincronizar Pro</span>
                </>
              )}
            </button>
          </div>
        )}

        <form onSubmit={handleRestore} className="pt-2 border-t border-stone-200/60">
          <p className="text-[11px] text-stone-500 mb-1.5 font-medium">
            Tens um código master de ativação de administrador?
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Código de ativação"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="flex-1 bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors"
            />
            <button
              type="submit"
              disabled={restoring}
              className="bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 shrink-0"
            >
              Validar Código
            </button>
          </div>
        </form>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-stone-800 mb-1">
          Perguntas Frequentes
        </h3>
        <div className="divide-y divide-stone-100">
          {faqs.map((faq, idx) => (
            <div key={idx} className="py-3">
              <button
                type="button"
                onClick={() => setShowFaq(showFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between text-left font-semibold text-xs sm:text-sm text-stone-800 gap-2"
              >
                <span>{faq.q}</span>
                {showFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>
              {showFaq === idx && (
                <p className="text-xs text-stone-500 mt-2 leading-relaxed animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}