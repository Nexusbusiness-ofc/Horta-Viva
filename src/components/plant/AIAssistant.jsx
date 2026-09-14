import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { visionBase44 } from "@/api/visionClient";
import { useSubscription, incrementAIUsage } from "@/lib/subscription";
import UpgradeModal from "@/components/subscription/UpgradeModal";

export default function AIAssistant({ query, plants, onClearQuery }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const scrollRef = useRef(null);
  const { isPro, remainingFreeAI, canUseAI } = useSubscription();

  useEffect(() => {
    if (query) {
      askAI(query);
      onClearQuery();
    }
  }, [query]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const buildContext = () => {
    return (plants || []).map(p =>
      `${p.emoji || "🌱"} ${p.name} (${p.category || "Geral"}) — Sementeira: ${(p.sow_months||[]).join(",")}; Plantação: ${(p.plant_months||[]).join(",")}; Colheita: ${(p.harvest_months||[]).join(",")}. Sol: ${p.sun_requirements || "Sol pleno"}; Rega: ${p.water_requirements || "Moderada"}; Dificuldade: ${p.difficulty || "Fácil"}. Semear: ${p.sow_instructions||""} Plantar: ${p.plant_instructions||""} Cuidados: ${p.care_instructions||""} Armazenar: ${p.storage_instructions||""}`
    ).join("\n");
  };

  const askAI = async (question) => {
    if (!canUseAI) {
      setShowUpgradeModal(true);
      setMessages(prev => [
        ...prev,
        { role: "user", text: question },
        {
          role: "assistant",
          text: "⭐ **Limite de 2 utilizações gratuitas de IA atingido.**\n\nJá utilizaste os teus 2 usos gratuitos de IA. Para continuares a conversar com o Assistente IA da Horta e identificares plantas por foto sem limites, ativa o **Horta Viva Pro** por apenas 2,99€/mês.",
        }
      ]);
      return;
    }

    const userMsg = { role: "user", text: question };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const currentMonth = new Date().toLocaleDateString("pt-PT", { month: "long" });
      const plantContext = buildContext();

      const prompt = `És um assistente especializado em hortas e agricultura em Portugal. O mês atual é ${currentMonth}.

Base de dados de plantas disponíveis na horta:
${plantContext}

Pergunta do utilizador: "${question}"

Responde de forma clara, prática e direta em português europeu. Se a pergunta for sobre o que plantar agora, usa os dados acima para recomendar plantas cujos meses de sementeira ou plantação incluem o mês atual. Se for sobre uma planta específica, dá instruções práticas. Se não souberes exactamente, usa o teu conhecimento geral sobre hortas em Portugal. Sê conciso mas completo.`;

      const res = await visionBase44.integrations.Core.InvokeLLM({
        prompt,
        model: "gemini_3_flash",
      });

      setMessages(prev => [...prev, { role: "assistant", text: res }]);

      if (!isPro) {
        incrementAIUsage();
      }
    } catch (e) {
      const qLower = question.toLowerCase();
      const matched = (plants || []).find(p => qLower.includes(p.name.toLowerCase()));
      if (matched) {
        setMessages(prev => [...prev, {
          role: "assistant",
          text: `🌱 **${matched.name}** (${matched.category || "Hortícola"}):\n\n• **Sementeira:** ${(matched.sow_months||[]).join(", ") || "—"}\n• **Plantação:** ${(matched.plant_months||[]).join(", ") || "—"}\n• **Colheita:** ${(matched.harvest_months||[]).join(", ") || "—"}\n• **Sol:** ${matched.sun_requirements || "Sol pleno"}\n• **Rega:** ${matched.water_requirements || "Moderada"}\n• **Dicas:** ${matched.sow_instructions || matched.plant_instructions || "Manter solo fértil e regado."}\n\n💡 *Dica: Podes também identificar plantas por foto abrindo a câmara no topo!*`
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: "assistant",
          text: "Não foi possível contactar a IA da Horta Viva neste momento. Podes perguntar diretamente pelo nome de uma planta (ex.: Tomate, Alface ou Fava) e consultar a respetiva ficha de cultivo."
        }]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    if (!canUseAI) {
      setShowUpgradeModal(true);
      return;
    }

    askAI(input.trim());
  };

  const suggestions = [
    "O que devo plantar este mês?",
    "Como plantar tomate?",
    "Como armazenar cebola?",
  ];

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50/20 rounded-3xl border border-emerald-100 shadow-md shadow-emerald-100/30 overflow-hidden flex flex-col" style={{ maxHeight: "540px" }}>
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 px-4 sm:px-5 py-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Sparkles className="w-5 h-5 text-white shrink-0" />
          <h3 className="text-white font-semibold text-sm truncate">Assistente IA da Horta</h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isPro ? (
            <span
              className="flex items-center gap-1 bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-xl shadow-2xs"
              title="Plano Pro ativo"
            >
              ⭐ Pro Ilimitado
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setShowUpgradeModal(true)}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-2.5 py-1 rounded-xl transition-all shadow-2xs"
              title="Quota de IA gratuita"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {remainingFreeAI > 0 ? (
                <span>{remainingFreeAI} {remainingFreeAI === 1 ? "uso grátis" : "usos grátis"}</span>
              ) : (
                <span className="font-bold text-amber-200">Ativar Pro</span>
              )}
            </button>
          )}

          <Link
            to="/identificar"
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-semibold px-3 py-1 rounded-xl transition-all shadow-sm"
            title="Tirar foto a uma planta para identificar"
          >
            <Camera className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Foto</span>
          </Link>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-[200px]">
        {messages.length === 0 && (
          <div className="text-center py-6">
            <div className="text-4xl mb-2">🌱🤖</div>
            <p className="text-sm text-stone-500 mb-4">Pergunta-me qualquer coisa sobre a tua horta!</p>
            <div className="flex flex-col gap-2 max-w-xs mx-auto">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => askAI(s)}
                  className="text-xs bg-gradient-to-br from-stone-50 to-emerald-50/30 hover:from-emerald-50 hover:to-green-50 text-stone-600 hover:text-emerald-700 rounded-xl px-3 py-2 transition-all duration-200 border border-emerald-100/50 hover:border-emerald-200 hover:shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-emerald-500 text-white rounded-br-md"
                  : "bg-stone-100 text-stone-700 rounded-bl-md"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-stone-100 rounded-2xl rounded-bl-md px-4 py-3">
              <Loader2 className="w-4 h-4 text-stone-400 animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Banner de limite de IA atingido */}
      {!isPro && remainingFreeAI === 0 && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-emerald-50 border-t border-amber-200/80 px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="text-amber-600 text-lg">⭐</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-stone-800 leading-tight">Usos gratuitos de IA esgotados (2/2)</p>
              <p className="text-[11px] text-stone-500 truncate">Ativa o Horta Viva Pro para conversares e identificares sem limites.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowUpgradeModal(true)}
            className="shrink-0 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-xs transition-all active:scale-95 whitespace-nowrap"
          >
            Ativar Pro (2,99€)
          </button>
        </div>
      )}

      {/* Input form */}
      <form onSubmit={handleSubmit} className="border-t border-stone-100 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={!canUseAI ? "Ativa o Pro para continuar a perguntar à IA..." : "Escreve a tua pergunta..."}
          className="flex-1 bg-gradient-to-br from-stone-50 to-emerald-50/20 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300 text-stone-700 placeholder:text-stone-400"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 disabled:from-stone-300 disabled:to-stone-400 text-white rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-200 shadow-sm shadow-emerald-200/50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        reason="ai"
      />
    </div>
  );
}
