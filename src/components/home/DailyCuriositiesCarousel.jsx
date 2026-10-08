import { useI18n } from "@/lib/I18nContext";
import React, { useState, useMemo } from "react";
import { Lightbulb, Shuffle, ChevronRight, Sparkles, X, CheckCircle2, Sprout } from "lucide-react";
import { CURIOSITIES } from "./DailyCuriosityCard";
export default function DailyCuriositiesCarousel() {
  const {
    t: i18nT,
    language
  } = useI18n();
  // Índice da curiosidade oficial do dia atual (calculado pelo dia do ano)
  const todayIndex = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % CURIOSITIES.length;
  }, []);

  // Lista de curiosidades visíveis no carrossel
  const [selectedCuriosity, setSelectedCuriosity] = useState(null);
  const [seed, setSeed] = useState(0);

  // Ordena colocando a de hoje em primeiro lugar, seguida de uma seleção rotativa
  const visibleCuriosities = useMemo(() => {
    const total = CURIOSITIES.length;
    const items = [];

    // 1º item é sempre a do dia
    const todayItem = {
      ...CURIOSITIES[todayIndex],
      isToday: true
    };
    items.push(todayItem);

    // Seleciona mais 7 curiosidades com offset baseado na semente de baralhar
    for (let i = 1; i <= 7; i++) {
      const idx = (todayIndex + i * 3 + seed * 7) % total;
      if (idx !== todayIndex && !items.some(it => it.id === CURIOSITIES[idx].id)) {
        items.push({
          ...CURIOSITIES[idx],
          isToday: false
        });
      }
    }
    return items;
  }, [todayIndex, seed]);
  const handleShuffle = () => {
    setSeed(prev => prev + 1);
  };
  return <section className="w-full space-y-2.5">
      {/* Cabeçalho da Secção */}
      <div className="flex items-center justify-between px-0.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-amber-100 border border-amber-200/80 flex items-center justify-center text-amber-700 shadow-2xs">
            <Lightbulb className="w-4 h-4 fill-amber-400 text-amber-600" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-black text-stone-800 tracking-tight flex items-center gap-1.5 leading-none">{i18nT("Curiosidades Diárias")}<span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 hidden sm:inline-block">{i18nT("Sabedoria Rural")}</span>
            </h2>
          </div>
        </div>

        <button type="button" onClick={handleShuffle} className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-emerald-50 active:scale-95" title={i18nT("Ver outras curiosidades")}>
          <Shuffle className="w-3.5 h-3.5" />
          <span>{i18nT("Outras dicas")}</span>
        </button>
      </div>

      {language !== "pt-PT" && <p className="text-[11px] text-stone-500 px-0.5" role="note">{i18nT("As curiosidades detalhadas mantêm o português original.")}</p>}

      {/* Carrossel Horizontal de Cartões de Curiosidades */}
      <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 scrollbar-hide">
        {i18nT(visibleCuriosities.map(item => {
        return <div key={item.id} onClick={() => setSelectedCuriosity(item)} className={`group min-w-[200px] max-w-[220px] sm:min-w-[240px] sm:max-w-[260px] rounded-2xl p-3.5 sm:p-4 border transition-all duration-200 active:scale-[0.98] cursor-pointer flex flex-col justify-between shrink-0 shadow-xs hover:shadow-md ${item.isToday ? "bg-gradient-to-br from-amber-50/90 via-white to-amber-50/40 border-amber-300 ring-2 ring-amber-400/20" : "bg-white border-stone-200/80 hover:border-emerald-300"}`}>
              <div>
                {/* Topo do Cartão: Emoji e Etiqueta */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-2xs ${item.isToday ? "bg-amber-100/90 border border-amber-200" : "bg-stone-50 border border-stone-100"}`}>
                    {i18nT(item.emoji)}
                  </div>
                  {item.isToday ? <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200/80 border border-amber-300/80 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
                      <Sparkles className="w-2.5 h-2.5 text-amber-700 animate-pulse" />{i18nT("Hoje")}</span> : <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${item.tagColor}`}>
                      #{i18nT(item.category)}
                    </span>}
                </div>

                {/* Título da Curiosidade */}
                <h3 className="font-extrabold text-stone-800 text-xs sm:text-sm leading-snug group-hover:text-emerald-700 transition-colors line-clamp-1">
                  {i18nT(item.title)}
                </h3>

                {/* Resumo do Facto */}
                <p className="text-[11px] text-stone-500 font-normal mt-1 leading-relaxed line-clamp-3">
                  {i18nT(item.fact)}
                </p>
              </div>

              {/* Rodapé do Cartão */}
              <div className="pt-2.5 mt-2 border-t border-stone-100/90 flex items-center justify-between text-emerald-700 font-bold text-[11px] group-hover:translate-x-0.5 transition-transform">
                <span className="inline-flex items-center gap-1 text-[11px]">
                  <span>{i18nT("Saber mais")}</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>;
      }))}
      </div>

      {/* Modal de Detalhes da Curiosidade */}
      {selectedCuriosity && <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-xs p-0 sm:p-4" onClick={() => setSelectedCuriosity(null)}>
          <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl max-h-[90dvh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-200" onClick={e => e.stopPropagation()}>
            {/* Cabeçalho do Modal */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-2xl shadow-sm">
                  {i18nT(selectedCuriosity.emoji)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${selectedCuriosity.tagColor}`}>
                      #{i18nT(selectedCuriosity.category)}
                    </span>
                    {selectedCuriosity.isToday && <span className="text-[10px] font-extrabold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">{i18nT("🌟 Curiosidade de Hoje")}</span>}
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-stone-800 leading-tight mt-1">
                    {i18nT(selectedCuriosity.title)}
                  </h3>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedCuriosity(null)} className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors" aria-label={i18nT("Fechar")}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Facto Principal */}
            <div className="bg-amber-50/80 border border-amber-200/70 rounded-2xl p-4 text-xs sm:text-sm text-stone-700 leading-relaxed space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
                <Lightbulb className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
                <span>{i18nT("Sabias que...?")}</span>
              </div>
              {language !== "pt-PT" && <p className="text-xs text-amber-800" role="note">{i18nT("As curiosidades detalhadas mantêm o português original.")}</p>}
              <p className="font-medium text-stone-800">
                {i18nT(selectedCuriosity.fact)}
              </p>
            </div>

            {/* Como Aplicar na Tua Horta */}
            <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-emerald-800 font-extrabold text-xs uppercase tracking-wider">
                <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                <span>{i18nT("Como aplicar na tua horta")}</span>
              </div>
              <ul className="space-y-1.5 text-xs text-stone-600 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{i18nT("Método 100% natural e ecológico, sem recurso a químicos sintéticos.")}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{i18nT("Aproveita os recursos da época para potenciar a fertilidade e o sabor dos frutos.")}</span>
                </li>
              </ul>
            </div>

            {/* Botão de Fechar */}
            <div className="pt-2">
              <button type="button" onClick={() => setSelectedCuriosity(null)} className="w-full py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition-all shadow-md active:scale-95">{i18nT("Entendido!")}</button>
            </div>
          </div>
        </div>}
    </section>;
}
