import { useI18n } from "@/lib/I18nContext";
import React, { useState } from "react";
import { Sparkles, Check, ArrowRight, ShieldCheck, Camera, Sprout, PawPrint, Bug, RefreshCw, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { syncSubscriptionWithGoogleAccount, isGoogleConnected, getGoogleUser } from "@/lib/googleSync";
import { getCheckoutUrl, validateAndActivateSubscription, useSubscription, resetSubscriptionToFree, FREE_PLANTATIONS_LIMIT, FREE_ANIMALS_LIMIT, FREE_AI_LIMIT, FREE_PHOTO_LIMIT, PLUS_PLANTATIONS_LIMIT, PLUS_ANIMALS_LIMIT, PLUS_PHOTO_LIMIT, PLUS_AI_LIMIT, PRO_PLANTATIONS_LIMIT, PRO_ANIMALS_LIMIT, PRO_PHOTO_LIMIT } from "@/lib/subscription";
import { useToast } from "@/components/ui/use-toast";
export default function ProSubscriptionView({
  onSubscribed
}) {
  const {
    t: i18nT
  } = useI18n();
  const {
    isPro,
    isPlus,
    isUltra,
    isPaid,
    tier,
    usageCount
  } = useSubscription();
  const [emailInput, setEmailInput] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [showFaq, setShowFaq] = useState(null);
  const {
    toast
  } = useToast();
  const handleResetToFree = async () => {
    if (window.confirm("Pretendes repor esta conta para o Plano Base Gratuito?")) {
      await resetSubscriptionToFree();
      toast({
        title: "Plano Base Reposto ✅",
        description: "Esta conta está agora no Plano Base Gratuito."
      });
    }
  };
  const handleSubscribeUltra = () => {
    window.open(getCheckoutUrl("ultra"), "_blank", "noopener,noreferrer");
  };
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
        const tierName = res.tier === "ultra" ? "Ultra" : res.tier === "pro" ? "Pro" : "Plus";
        toast({
          title: `🎉 Subscrição ${tierName} Sincronizada!`,
          description: `A tua subscrição foi restaurada com sucesso através da Conta Google (${res.email}).`
        });
        if (onSubscribed) onSubscribed();
      } else {
        toast({
          variant: "destructive",
          title: "Nenhuma subscrição encontrada",
          description: `Não foi encontrada nenhuma subscrição ativa na Conta Google (${res.email || "atual"}). Se compraste com outra conta, inicia sessão com essa conta.`
        });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro na sincronização Google",
        description: err?.message || String(err)
      });
    } finally {
      setRestoring(false);
    }
  };
  const handleRestore = e => {
    e.preventDefault();
    if (!emailInput.trim()) return;
    const validation = validateAndActivateSubscription(emailInput.trim());
    if (validation.success) {
      toast({
        title: validation.isExit ? "🔒 Modo Administrador Desativado" : "⭐ Modo Administrador Ativado!",
        description: validation.message
      });
      setEmailInput("");
      if (onSubscribed) onSubscribed();
    } else {
      toast({
        variant: "destructive",
        title: "Código ou Email Não Válido",
        description: validation.error
      });
    }
  };
  const faqs = [{
    q: "Qual é a diferença entre os 4 planos da Horta Viva?",
    a: "O Plano Base (Gratuito) oferece 10 chats IA/mês, 3 plantações, 2 animais e 3 fotos IA/mês. O Plano Plus (1,99€/mês) aumenta para 20 chats IA/mês, 5 plantações, 4 animais, 10 fotos IA/mês, resumo mensal encurtado e esquemas 2D de podas. O Plano Pro (2,99€/mês) oferece IA ilimitada, 8 plantações, 7 animais, 15 fotos IA/mês, resumo mensal detalhado e esquemas 3D e 2D. O Plano Ultra (3,99€/mês) oferece IA ilimitada, plantações infinitas, animais infinitos e fotos infinitas!"
  }, {
    q: "Como funciona a renovação mensal?",
    a: "O pagamento é processado com total segurança através da Stripe. A mensalidade (1,99€, 2,99€ ou 3,99€) renova automaticamente mês a mês, sem taxas ocultas e sem fidelização."
  }, {
    q: "Posso cancelar quando quiser?",
    a: "Sim! Não há qualquer período de fidelização. Podes cancelar a subscrição a qualquer momento diretamente pelo recibo de compra da Stripe com apenas 1 clique."
  }, {
    q: "Posso utilizar a subscrição noutro telemóvel ou tablet?",
    a: "Com certeza! A tua subscrição fica associada à tua Conta Google. Basta iniciares sessão com a mesma conta Google no teu telemóvel, tablet ou computador, e o teu plano é sincronizado automaticamente."
  }];
  return <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Banner Principal */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-40 h-40 rounded-full bg-emerald-400/20 blur-xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider text-emerald-100 mb-4 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>{i18nT("Planos Horta Viva")}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">{i18nT("Cultiva a tua horta com poder inteligente")}</h2>
          <p className="text-sm sm:text-base text-emerald-100/90 mt-2 max-w-xl leading-relaxed">{i18nT("Identifica plantas, animais e técnicas de podas por foto com IA, gere canteiros e tarefas na Minha Quinta e acede a esquemas anatómicos em 2D e 3D.")}</p>

          {/* Estado atual se ativo */}
          {isUltra ? <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-purple-900/40 backdrop-blur-md px-4 py-3 rounded-2xl border border-purple-300/40 text-white font-bold text-sm">
              <div className="flex items-center gap-2">
                <span className="text-lg">🚀</span>
                <span>{i18nT("Tens o Plano Ultra Ativo! Recursos totalmente infinitos e sem limites.")}</span>
              </div>
              <button type="button" onClick={handleResetToFree} className="text-purple-200 hover:text-white underline text-xs font-normal">{i18nT("Repor Plano Base")}</button>
            </div> : isPro ? <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-white">
              <div>
                <p className="font-bold text-sm">{i18nT("⭐ Tens o Plano Pro Ativo (2,99€/mês)")}</p>
                <p className="text-xs text-amber-100">{i18nT("Até 8 plantações, 7 animais, 15 fotos/mês, IA ilimitada e esquemas 3D.")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleSubscribeUltra} className="bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition-all">{i18nT("Upgrade Ultra (3,99€)")}</button>
                <button type="button" onClick={handleResetToFree} className="text-emerald-100 hover:text-white underline text-xs font-normal">{i18nT("Repor Base")}</button>
              </div>
            </div> : isPlus ? <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white/20 backdrop-blur-md px-4 py-3 rounded-2xl border border-white/30 text-white">
              <div>
                <p className="font-bold text-sm">{i18nT("🌱 Tens o Plano Plus Ativo (1,99€/mês)")}</p>
                <p className="text-xs text-emerald-100">{i18nT("Até 5 plantações, 4 animais, 10 fotos IA/mês e 20 chats IA/mês.")}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleSubscribePro} className="bg-amber-400 hover:bg-amber-300 text-stone-900 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition-all">{i18nT("Upgrade Pro (2,99€)")}</button>
                <button onClick={handleSubscribeUltra} className="bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition-all">{i18nT("Upgrade Ultra (3,99€)")}</button>
                <button type="button" onClick={handleResetToFree} className="text-emerald-100 hover:text-white underline text-xs font-normal">{i18nT("Repor Base")}</button>
              </div>
            </div> : <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-emerald-100 font-medium">
              <span className="bg-white/20 px-2.5 py-1 rounded-full">{i18nT("Plano Plus: 1,99€ / mês")}</span>
              <span className="bg-amber-400/30 text-amber-200 px-2.5 py-1 rounded-full font-bold">{i18nT("Plano Pro: 2,99€ / mês")}</span>
              <span className="bg-purple-500/30 text-purple-200 px-2.5 py-1 rounded-full font-bold">{i18nT("Plano Ultra: 3,99€ / mês")}</span>
            </div>}

          <div className="mt-4 flex items-center gap-2 text-xs text-emerald-100/80">
            <ShieldCheck className="w-4 h-4 text-emerald-200" />
            <span>{i18nT("Processado com encriptação segura pela ")}<strong>{i18nT("Stripe")}</strong></span>
          </div>
        </div>
      </div>

      {/* Cartões dos 3 Planos de Compra */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card Plano Plus */}
        <div className={`bg-white rounded-3xl p-5 border-2 shadow-sm flex flex-col justify-between relative transition-all ${isPlus ? "border-emerald-500 bg-emerald-50/30 ring-2 ring-emerald-400/20" : "border-stone-200 hover:border-emerald-300"}`}>
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">{i18nT("🌱 Plano Plus")}</span>
              {isPlus && <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-300 px-2 py-0.5 rounded-md">{i18nT("✓ Ativo")}</span>}
            </div>

            <div className="mt-3">
              <span className="text-3xl font-black text-stone-900">1,99€</span>
              <span className="text-xs text-stone-500 font-medium">{i18nT(" / mês")}</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">{i18nT("Perfeito para quem tem uma horta familiar e animais domésticos.")}</p>

            <div className="mt-4 space-y-2 text-xs text-stone-700">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("20 chats com a IA")}</strong>{i18nT(" / mês")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Até 5 plantações")}</strong>{i18nT(" na Minha Quinta")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Até 4 animais")}</strong>{i18nT(" na Minha Quinta")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("10 fotos IA")}</strong>{i18nT(" / mês (plantas, animais, podas)")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Resumo mensal encurtado")}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Esquema 2D")}</strong>{i18nT(" das podas e mondas")}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-stone-100">
            {isPlus ? <div className="text-center py-2.5 text-xs font-bold text-emerald-700 bg-emerald-50 rounded-xl">{i18nT("✓ Plano Plus Ativo")}</div> : isPro || isUltra ? <div className="text-center py-2.5 text-xs font-medium text-stone-400 bg-stone-50 rounded-xl">{i18nT("Incluído no teu plano atual")}</div> : <button onClick={handleSubscribePlus} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm py-2.5 px-4 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all">
                <span>{i18nT("Subscrever Plus (1,99€)")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>}
          </div>
        </div>

        {/* Card Plano Pro */}
        <div className={`bg-gradient-to-b from-amber-50/60 to-white rounded-3xl p-5 border-2 shadow-md flex flex-col justify-between relative transition-all ${isPro ? "border-amber-500 ring-2 ring-amber-400/40" : "border-amber-400 hover:border-amber-500"}`}>
          <span className="absolute -top-3 right-4 text-[11px] font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-900 px-3 py-0.5 rounded-full shadow-sm">{i18nT("⭐ MAIS ESCOLHIDO")}</span>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-200/80 px-2.5 py-1 rounded-full">{i18nT("Horta Viva Pro")}</span>
              {isPro && <span className="text-[11px] font-bold text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md">{i18nT("✓ Ativo")}</span>}
            </div>

            <div className="mt-3">
              <span className="text-3xl font-black text-stone-900">2,99€</span>
              <span className="text-xs text-stone-500 font-medium">{i18nT(" / mês")}</span>
            </div>
            <p className="text-xs text-stone-600 mt-1">{i18nT("Capacidade alargada com IA ilimitada e esquemas 3D.")}</p>

            <div className="mt-4 space-y-2 text-xs text-stone-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Conversa com IA Ilimitada")}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Até 8 plantações")}</strong>{i18nT(" na Minha Quinta")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Até 7 animais")}</strong>{i18nT(" na Minha Quinta")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("15 fotos IA")}</strong>{i18nT(" / mês (plantas, animais, podas)")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Resumo mensal detalhado")}</strong>{i18nT(" (completo)")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Esquemas 3D e 2D")}</strong>{i18nT(" das podas e mondas")}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-amber-100">
            {isPro ? <div className="text-center py-2.5 text-xs font-bold text-amber-800 bg-amber-100 rounded-xl">{i18nT("✓ Plano Pro Ativo")}</div> : isUltra ? <div className="text-center py-2.5 text-xs font-medium text-stone-400 bg-stone-50 rounded-xl">{i18nT("Incluído no teu plano atual")}</div> : <button onClick={handleSubscribePro} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 text-stone-950 font-black text-sm py-2.5 px-4 rounded-xl shadow-md shadow-amber-500/30 active:scale-95 transition-all">
                <span>{isPlus ? i18nT("Upgrade Pro (2,99€)") : i18nT("Subscrever Pro (2,99€)")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>}
          </div>
        </div>

        {/* Card Plano Ultra */}
        <div className={`bg-gradient-to-b from-purple-50/70 via-indigo-50/30 to-white rounded-3xl p-5 border-2 shadow-md flex flex-col justify-between relative transition-all ${isUltra ? "border-purple-500 ring-2 ring-purple-400/40" : "border-purple-300 hover:border-purple-400"}`}>
          <span className="absolute -top-3 right-4 text-[11px] font-black bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-0.5 rounded-full shadow-sm">{i18nT("🚀 INFINITO TOTAL")}</span>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900 bg-purple-100/90 px-2.5 py-1 rounded-full">{i18nT("Horta Viva Ultra")}</span>
              {isUltra && <span className="text-[11px] font-bold text-purple-800 bg-purple-100 border border-purple-300 px-2 py-0.5 rounded-md">{i18nT("✓ Ativo")}</span>}
            </div>

            <div className="mt-3">
              <span className="text-3xl font-black text-purple-950">3,99€</span>
              <span className="text-xs text-stone-500 font-medium">{i18nT(" / mês")}</span>
            </div>
            <p className="text-xs text-stone-600 mt-1">{i18nT("Sem quaisquer limites. Liberdade absoluta para qualquer exploração.")}</p>

            <div className="mt-4 space-y-2 text-xs text-stone-800">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Conversa com IA Ilimitada")}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Plantações Infinitas")}</strong>{i18nT(" na Minha Quinta")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Animais Infinitos")}</strong>{i18nT(" na Minha Quinta")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Fotos com IA Infinitas")}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Resumo mensal detalhado")}</strong>{i18nT(" (completo)")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-purple-600 shrink-0 stroke-[2.5]" />
                <span><strong>{i18nT("Esquemas 3D e 2D")}</strong>{i18nT(" das podas e mondas")}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-purple-100">
            {isUltra ? <div className="text-center py-2.5 text-xs font-bold text-purple-800 bg-purple-100 rounded-xl">{i18nT("✓ Plano Ultra Ativo")}</div> : <button onClick={handleSubscribeUltra} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm py-2.5 px-4 rounded-xl shadow-md shadow-purple-600/30 active:scale-95 transition-all">
                <span>{isPaid ? i18nT("Upgrade Ultra (3,99€)") : i18nT("Subscrever Ultra (3,99€)")}</span>
                <ArrowRight className="w-4 h-4" />
              </button>}
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
              <h3 className="font-bold text-stone-800 text-sm">{i18nT("Fotos & Identificação IA")}</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">{i18nT("Fotografa plantas, animais ou folhas e analisa podas e mondas para saber o que fazer no local.")}</p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">{i18nT("Base: ")}{i18nT(FREE_PHOTO_LIMIT)}{i18nT("/mês · Plus: ")}{i18nT(PLUS_PHOTO_LIMIT)}{i18nT("/mês · Pro: ")}{i18nT(PRO_PHOTO_LIMIT)}{i18nT("/mês · Ultra: Infinito")}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-emerald-700">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">{i18nT("Plantações na Minha Quinta")}</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">{i18nT("Organiza os teus canteiros com datas de sementeira, rega e previsão de colheita.")}</p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">{i18nT("Base: ")}{i18nT(FREE_PLANTATIONS_LIMIT)}{i18nT(" · Plus: ")}{i18nT(PLUS_PLANTATIONS_LIMIT)}{i18nT(" · Pro: ")}{i18nT(PRO_PLANTATIONS_LIMIT)}{i18nT(" · Ultra: Infinitas")}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0 text-orange-700">
            <PawPrint className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">{i18nT("Animais da Quinta")}</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">{i18nT("Regista animais da quinta e obtém tarefas automáticas diárias de alimentação e higiene.")}</p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">{i18nT("Base: ")}{i18nT(FREE_ANIMALS_LIMIT)}{i18nT(" · Plus: ")}{i18nT(PLUS_ANIMALS_LIMIT)}{i18nT(" · Pro: ")}{i18nT(PRO_ANIMALS_LIMIT)}{i18nT(" · Ultra: Infinitos")}</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-stone-200/80 shadow-xs flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center shrink-0 text-purple-700">
            <Bug className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-stone-800 text-sm">{i18nT("Conversa com IA")}</h3>
            </div>
            <p className="text-xs text-stone-500 mt-1 leading-relaxed">{i18nT("Conversa com o Assistente IA sobre o que plantar, tratamentos biológicos e dúvidas de agricultura.")}</p>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">{i18nT("Base: ")}{i18nT(FREE_AI_LIMIT)}{i18nT("/mês · Plus: ")}{i18nT(PLUS_AI_LIMIT)}{i18nT("/mês · Pro: Ilimitado · Ultra: Ilimitado")}</p>
          </div>
        </div>
      </div>

      {/* Tabela de Comparação dos 4 Planos */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-stone-100 bg-stone-50/60">
          <h3 className="text-sm sm:text-base font-bold text-stone-800">{i18nT("Comparação dos Planos")}</h3>
          <p className="text-xs text-stone-500">{i18nT("Compara os recursos incluídos em cada opção")}</p>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[620px] divide-y divide-stone-100 text-xs sm:text-sm">
            <div className="grid grid-cols-5 p-3 sm:p-4 bg-stone-50/50 font-bold text-stone-500 text-[10px] sm:text-[11px] uppercase tracking-wider">
              <span>{i18nT("Recurso")}</span>
              <span className="text-center">{i18nT("Base (0€)")}</span>
              <span className="text-center text-emerald-700">{i18nT("Plus (1,99€)")}</span>
              <span className="text-center text-amber-700">{i18nT("Pro (2,99€)")}</span>
              <span className="text-center text-purple-700">{i18nT("Ultra (3,99€)")}</span>
            </div>

            <div className="grid grid-cols-5 p-3 sm:p-4 items-center">
              <span className="font-semibold text-stone-800">{i18nT("Conversa com IA")}</span>
              <span className="text-center text-stone-500">{i18nT("10 chats/mês")}</span>
              <span className="text-center font-bold text-emerald-700">{i18nT("20 chats/mês")}</span>
              <span className="text-center font-black text-amber-800 bg-amber-50/80 py-0.5 rounded">{i18nT("Ilimitada")}</span>
              <span className="text-center font-black text-purple-800 bg-purple-50/80 py-0.5 rounded">{i18nT("Ilimitada")}</span>
            </div>

            <div className="grid grid-cols-5 p-3 sm:p-4 items-center">
              <span className="font-semibold text-stone-800">{i18nT("Plantações (Quinta)")}</span>
              <span className="text-center text-stone-500">{i18nT("Até 3")}</span>
              <span className="text-center font-bold text-emerald-700">{i18nT("Até 5")}</span>
              <span className="text-center font-bold text-amber-800">{i18nT("Até 8")}</span>
              <span className="text-center font-black text-purple-800 bg-purple-50/80 py-0.5 rounded">{i18nT("Infinitas")}</span>
            </div>

            <div className="grid grid-cols-5 p-3 sm:p-4 items-center">
              <span className="font-semibold text-stone-800">{i18nT("Animais (Quinta)")}</span>
              <span className="text-center text-stone-500">{i18nT("Até 2")}</span>
              <span className="text-center font-bold text-emerald-700">{i18nT("Até 4")}</span>
              <span className="text-center font-bold text-amber-800">{i18nT("Até 7")}</span>
              <span className="text-center font-black text-purple-800 bg-purple-50/80 py-0.5 rounded">{i18nT("Infinitos")}</span>
            </div>

            <div className="grid grid-cols-5 p-3 sm:p-4 items-center">
              <span className="font-semibold text-stone-800">{i18nT("Identificação por Foto")}</span>
              <span className="text-center text-stone-500">{i18nT("3 vezes/mês")}</span>
              <span className="text-center font-bold text-emerald-700">{i18nT("10 vezes/mês")}</span>
              <span className="text-center font-bold text-amber-800">{i18nT("15 vezes/mês")}</span>
              <span className="text-center font-black text-purple-800 bg-purple-50/80 py-0.5 rounded">{i18nT("Infinitas")}</span>
            </div>

            <div className="grid grid-cols-5 p-3 sm:p-4 items-center">
              <span className="font-semibold text-stone-800">{i18nT("Resumo Mensal")}</span>
              <span className="text-center text-rose-500 font-semibold">{i18nT("🔒 Bloqueado")}</span>
              <span className="text-center font-bold text-emerald-700">{i18nT("Encurtado")}</span>
              <span className="text-center font-bold text-amber-800">{i18nT("✓ Detalhado")}</span>
              <span className="text-center font-bold text-purple-800">{i18nT("✓ Detalhado")}</span>
            </div>

            <div className="grid grid-cols-5 p-3 sm:p-4 items-center">
              <span className="font-semibold text-stone-800">{i18nT("Esquemas 2D (Podas e Mondas)")}</span>
              <span className="text-center text-rose-500 font-semibold">{i18nT("🔒 Bloqueado")}</span>
              <span className="text-center text-emerald-600 font-bold">{i18nT("✓ Incluído")}</span>
              <span className="text-center text-emerald-600 font-bold">{i18nT("✓ Incluído")}</span>
              <span className="text-center text-emerald-600 font-bold">{i18nT("✓ Incluído")}</span>
            </div>

            <div className="grid grid-cols-5 p-3 sm:p-4 items-center">
              <span className="font-semibold text-stone-800">{i18nT("Esquemas 3D (Podas e Mondas)")}</span>
              <span className="text-center text-rose-500 font-semibold">{i18nT("🔒 Bloqueado")}</span>
              <span className="text-center text-rose-500 font-semibold">{i18nT("🔒 Bloqueado")}</span>
              <span className="text-center text-amber-700 font-bold">{i18nT("✓ Incluído")}</span>
              <span className="text-center text-purple-700 font-bold">{i18nT("✓ Incluído")}</span>
            </div>

            <div className="grid grid-cols-5 p-3 sm:p-4 items-center">
              <span className="font-semibold text-stone-800">{i18nT("Catálogo Botânico")}</span>
              <span className="text-center text-emerald-600 font-semibold">✓</span>
              <span className="text-center text-emerald-600 font-semibold">✓</span>
              <span className="text-center text-emerald-600 font-semibold">✓</span>
              <span className="text-center text-emerald-600 font-semibold">✓</span>
            </div>

            <div className="grid grid-cols-5 p-3 sm:p-4 items-center bg-stone-50/60">
              <span className="font-bold text-stone-800">{i18nT("Preço")}</span>
              <span className="text-center font-semibold text-stone-600">0,00€</span>
              <span className="text-center font-bold text-emerald-700">{i18nT("1,99€ / mês")}</span>
              <span className="text-center font-bold text-amber-700">{i18nT("2,99€ / mês")}</span>
              <span className="text-center font-black text-purple-700 text-sm">{i18nT("3,99€ / mês")}</span>
            </div>
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
            <h3 className="text-sm sm:text-base font-bold text-stone-800">{i18nT("Sincronização com a Conta Google (Multi-dispositivo)")}</h3>
            <p className="text-xs text-stone-500">{i18nT("Usa o teu plano Pro ou Plus em qualquer telemóvel, tablet ou computador.")}</p>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">{i18nT("A tua subscrição Pro ou Plus fica vinculada à tua ")}<strong>{i18nT("Conta Google")}</strong>{i18nT(". Sempre que iniciares sessão com a mesma conta Google noutro dispositivo, o teu plano é sincronizado e ativado de imediato sem teres de pagar novamente.")}</p>

        {isGoogleConnected() ? <div className="bg-white p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-stone-500">{i18nT("Conta Google ativa:")}</span>
              <span className="font-bold text-emerald-800">{getGoogleUser()?.email || i18nT("Ligada")}</span>
            </div>
            <button type="button" onClick={handleGoogleSyncRestore} disabled={restoring} className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95 disabled:opacity-50">
              {restoring ? <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{i18nT("A sincronizar com a Conta Google...")}</span>
                </> : <>
                  <RefreshCw className="w-4 h-4" />
                  <span>{i18nT("Sincronizar Subscrição da Conta Google")}</span>
                </>}
            </button>
          </div> : <div className="space-y-2">
            <button type="button" onClick={handleGoogleSyncRestore} disabled={restoring} className="w-full inline-flex items-center justify-center gap-2 bg-white hover:bg-stone-50 text-stone-800 font-bold text-xs sm:text-sm py-3 px-4 rounded-xl border border-stone-200 shadow-2xs transition-all active:scale-95 disabled:opacity-50">
              {restoring ? <>
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                  <span>{i18nT("A ligar à Conta Google...")}</span>
                </> : <>
                  <GoogleIcon className="w-4 h-4" />
                  <span>{i18nT("Entrar com a Conta Google para Sincronizar Pro")}</span>
                </>}
            </button>
          </div>}

        <form onSubmit={handleRestore} className="pt-2 border-t border-stone-200/60">
          <p className="text-[11px] text-stone-500 mb-1.5 font-medium">{i18nT("Tens um código de ativação?")}</p>
          <div className="flex gap-2">
            <input type="text" placeholder={i18nT("Código de ativação")} value={emailInput} onChange={e => setEmailInput(e.target.value)} className="flex-1 bg-white border border-stone-200 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-stone-800 outline-none focus:border-emerald-500 transition-colors" />
            <button type="submit" disabled={restoring} className="bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 shrink-0">{i18nT("Validar Código")}</button>
          </div>
        </form>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-3">
        <h3 className="text-sm sm:text-base font-bold text-stone-800 mb-1">{i18nT("Perguntas Frequentes")}</h3>
        <div className="divide-y divide-stone-100">
          {i18nT(faqs.map((faq, idx) => <div key={idx} className="py-3">
              <button type="button" onClick={() => setShowFaq(showFaq === idx ? null : idx)} className="w-full flex items-center justify-between text-left font-semibold text-xs sm:text-sm text-stone-800 gap-2">
                <span>{i18nT(faq.q)}</span>
                {showFaq === idx ? <ChevronUp className="w-4 h-4 text-stone-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />}
              </button>
              {showFaq === idx && <p className="text-xs text-stone-500 mt-2 leading-relaxed animate-in fade-in">
                  {i18nT(faq.a)}
                </p>}
            </div>))}
        </div>
      </div>
    </div>;
}
