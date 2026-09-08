import React, { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AIAssistant({ query, plants, onClearQuery }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

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
    return plants.map(p =>
      `${p.emoji} ${p.name} (${p.category}) — Sementeira: ${(p.sow_months||[]).join(",")}; Plantação: ${(p.plant_months||[]).join(",")}; Colheita: ${(p.harvest_months||[]).join(",")}. Sol: ${p.sun_requirements}; Rega: ${p.water_requirements}; Dificuldade: ${p.difficulty}. Semear: ${p.sow_instructions||""} Plantar: ${p.plant_instructions||""} Cuidados: ${p.care_instructions||""} Armazenar: ${p.storage_instructions||""}`
    ).join("\n");
  };

  const askAI = async (question) => {
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

      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        add_context_from_internet: true,
      });

      setMessages(prev => [...prev, { role: "assistant", text: res }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: "assistant", text: "Desculpa, ocorreu um erro. Tenta novamente." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      askAI(input.trim());
    }
  };

  const suggestions = [
    "O que devo plantar este mês?",
    "Como plantar tomate?",
    "Como armazenar cebola?",
  ];

  return (
    <div className="bg-gradient-to-br from-white to-emerald-50/20 rounded-3xl border border-emerald-100 shadow-md shadow-emerald-100/30 overflow-hidden flex flex-col" style={{ maxHeight: "520px" }}>
      <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 px-5 py-3 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-white" />
        <h3 className="text-white font-semibold text-sm">Assistente IA da Horta</h3>
      </div>

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

      <form onSubmit={handleSubmit} className="border-t border-stone-100 p-3 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Escreve a tua pergunta..."
          className="flex-1 bg-gradient-to-br from-stone-50 to-emerald-50/20 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-300 text-stone-700"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="bg-gradient-to-br from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:opacity-40 disabled:from-stone-300 disabled:to-stone-400 text-white rounded-xl w-10 h-10 flex items-center justify-center transition-all duration-200 shadow-sm shadow-emerald-200/50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}