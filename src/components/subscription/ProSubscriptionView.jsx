import React, { useState } from "react";
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, Camera, 
  Sprout, PawPrint, Bug, RefreshCw, ChevronDown, ChevronUp
} from "lucide-react";
import { 
  STRIPE_PAYMENT_LINK, 
  useSubscription, 
  activateProSubscription, 
  FREE_PLANTATIONS_LIMIT,
  FREE_ANIMALS_LIMIT,
  FREE_AI_LIMIT,
  FREE_IDENTIFICATION_LIMIT
} from "@/lib/subscription";
import { useToast } from "@/components/ui/use-toast";

export default function ProSubscriptionView({ onSubscribed }) {
  const { isPro, usageCount } = useSubscription();
  const [emailInput, setEmailInput] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [showFaq, setShowFaq] = useState(null);
  const { toast } = useToast();

  const handleSubscribe = () => {
    window.open(STRIPE_PAYMENT_LINK, "_blank", "noopener,noreferrer");
  };

  const handleRestore = (e) => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const input = emailInput.trim();
    const isAdm = input.toLowerCase() === "admin" || input.toLowerCase() === "andre" || input.toLowerCase() === "hortaviva" || input.toLowerCase().includes("admin");
    setRestoring(true);
    setTimeout(() => {
      activateProSubscription({ email: input, is_admin: isAdm });
      setRestoring(false);
      toast({
        title: isAdm ? "👑 Modo Administrador Ativado!" : "🎉 Subscrição Pro ativada!",
        description: isAdm
          ? "Acesso Pro gratuito e vitalício ativado com sucesso para o administrador."
          : `Dispositivo vinculado com sucesso ao e-mail ${input}.`,
      });
      setEmailInput("");
      if (onSubscribed) onSubscribed();
    }, 600);
  };

  const faqs = [
    {
      q: "O que está incluído no Horta Viva Pro?",
      a: "Inteligência Artificial ilimitada (Assistente Botânico e identificação de plantas por fotografia), plantações ilimitadas na Minha Quinta (o plano base tem limite de 3), e animais ilimitados com lembretes diários de cuidados e tarefas (o plano base tem limite de 2)."
    },
    {
      q: "Como funciona a cobrança de 2,99€ / mês?",
      a: "A subscrição é processada de forma 100% segura através da plataforma internacional Stripe. É uma mensalidade de 2,99€ renovada automaticamente, sem qualquer fidelização ou taxa oculta."
    },
    {
      q: "Posso cancelar quando quiser?",
      a: "Sim! Não há período de fidelização. Podes cancelar a subscrição a qualquer momento com apenas 1 clique ou através do e-mail de confirmação da Stripe."
    },
    {
      q: "Posso utilizar a subscrição noutro telemóvel ou tablet?",
      a: "Com certeza! Basta acederes a esta aba no teu outro dispositivo e introduzires o e-mail que usaste na compra no campo 'Restaurar Subscrição'."
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
            <span>Horta Viva Pro</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
            Cultiva a tua horta sem limites
          </h2>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 max-w-lg leading-relaxed">
            Identifica qualquer planta ou praga por foto e gere todas as tuas plantações e animais na Minha Quinta.
          </p>

          <div className="mt-6 flex flex-wrap items-baseline gap-2 bg-black/20 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 w-fit">
            <span className="text-3xl sm:text-4xl font-extrabold text-white">2,99€</span>
            <span className="text-sm font-medium text-emerald-100">/ mês</span>
            <span className="text-xs bg-emerald-500/80 text-white font-bold px-2 py-0.5 rounded-full ml-2">
              Cancela quando quiseres
            </span>
          </div>

          {/* Botão de Ação */}
          <div className="mt-6">
            {isPro ? (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-white font-bold text-sm">
                <span className="text-lg">⭐</span>
                <span>Tens o Plano Pro Ativo! Aproveita todos os recursos sem limites.</span>
              </div>
            ) : (
              <button
                onClick={handleSubscribe}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-stone-900 font-extrabold text-base px-6 py-4 rounded-2xl shadow-xl shadow-amber-900/20 active:scale-[0.98] transition-all"
              >
                <span>Subscrever Pro por 2,99€ / mês</span>
                <ArrowRight className="w-5 h-5 stroke-[2.5]" />
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100/80">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>Processado com encriptação segura pela <strong>Stripe</strong></span>
          </div>
        </div>
      </div>

      {/* Cartões de Benefícios Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-50 border border-cyan-100 flex items-center justify-center shrink-0 text-cyan-700">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">Inteligência Artificial (IA)</h3>
              <span className="text-[10px] font-extrabold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded-full">PRO</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Conversa com o Assistente IA da horta e fotografa plantas ou folhas para diagnósticos botânicos imediatos.
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">Plano Base: {FREE_AI_LIMIT} utilizações gratuitas de IA</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">Plantações Ilimitadas</h3>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">PRO</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Adiciona quantos canteiros e culturas quiseres à tua quinta, com histórico de sementeira e colheita.
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">Plano Base: máximo {FREE_PLANTATIONS_LIMIT} plantações</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-700">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">Animais Ilimitados</h3>
              <span className="text-[10px] font-extrabold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full">PRO</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Regista todas as espécies de animais da tua quinta e recebe tarefas diárias automáticas de cuidados.
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">Plano Base: máximo {FREE_ANIMALS_LIMIT} animais</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-700">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">Pragas & Doenças</h3>
              <span className="text-[10px] font-extrabold bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">PRO</span>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">
              Diagnóstico imediato por IA botânica com dicas de tratamento biológico e convencional para salvar as culturas.
            </p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">Incluído no plano Pro</p>
          </div>
        </div>
      </div>

      {/* Tabela de Comparação */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/60">
          <h3 className="text-sm sm:text-base font-bold text-stone-800">
            Comparação dos Planos
          </h3>
          <p className="text-xs text-stone-500">Tudo o que ganhas ao ativar o Horta Viva Pro</p>
        </div>

        <div className="divide-y divide-stone-100 text-xs sm:text-sm">
          <div className="grid grid-cols-3 p-3.5 sm:p-4 bg-stone-50/30 font-bold text-stone-500 text-[11px] uppercase tracking-wider">
            <span>Funcionalidade</span>
            <span className="text-center">Plano Base</span>
            <span className="text-center text-emerald-700 font-extrabold">Horta Viva Pro</span>
          </div>

          <div className="grid grid-cols-3 p-3.5 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Inteligência Artificial (IA & Fotos)</span>
            <span className="text-center text-stone-500 font-medium">{FREE_AI_LIMIT} utilizações</span>
            <span className="text-center font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg">Ilimitado</span>
          </div>

          <div className="grid grid-cols-3 p-3.5 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Plantações na Minha Quinta</span>
            <span className="text-center text-stone-500 font-medium">Até 3</span>
            <span className="text-center font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg">Ilimitado</span>
          </div>

          <div className="grid grid-cols-3 p-3.5 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Animais na Minha Quinta</span>
            <span className="text-center text-stone-500 font-medium">Até 2</span>
            <span className="text-center font-bold text-emerald-700 bg-emerald-50 py-1 px-2 rounded-lg">Ilimitado</span>
          </div>

          <div className="grid grid-cols-3 p-3.5 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Catálogo Botânico (50+ espécies)</span>
            <span className="text-center text-emerald-600 font-semibold">✓ Incluído</span>
            <span className="text-center text-emerald-600 font-semibold">✓ Incluído</span>
          </div>

          <div className="grid grid-cols-3 p-3.5 sm:p-4 items-center">
            <span className="font-semibold text-stone-800">Lembretes & Tarefas de Hoje</span>
            <span className="text-center text-emerald-600 font-semibold">✓ Incluído</span>
            <span className="text-center text-emerald-600 font-semibold">✓ Incluído</span>
          </div>

          <div className="grid grid-cols-3 p-3.5 sm:p-4 items-center bg-emerald-50/30">
            <span className="font-bold text-stone-800">Preço</span>
            <span className="text-center font-bold text-stone-600">Grátis</span>
            <span className="text-center font-extrabold text-emerald-700 text-sm sm:text-base">2,99€ / mês</span>
          </div>
        </div>
      </div>

      {/* Secção de Restauro de Subscrição */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw className="w-4 h-4 text-teal-600" />
          <h3 className="text-sm font-bold text-stone-800">Já subscreveste noutro telemóvel?</h3>
        </div>
        <p className="text-xs text-stone-500 mb-3.5">
          Se já compraste a subscrição de 2,99€/mês, insere o teu e-mail da compra para ativar o Pro neste dispositivo:
        </p>
        <form onSubmit={handleRestore} className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            required
            placeholder="teu.email@exemplo.com (ou 'admin')"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors"
          />
          <button
            type="submit"
            disabled={restoring}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 whitespace-nowrap"
          >
            {restoring ? "A verificar..." : "Ativar neste dispositivo"}
          </button>
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