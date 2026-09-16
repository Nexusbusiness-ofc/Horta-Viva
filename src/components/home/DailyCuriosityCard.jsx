import React, { useState, useMemo } from "react";
import { Lightbulb, Shuffle } from "lucide-react";

export const CURIOSITIES = [
  {
    id: "cur_1",
    category: "Consorciação",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    emoji: "🍅",
    title: "Tomates e Manjericão: Amigos Inseparáveis",
    fact: "Plantar manjericão ao lado dos tomateiros melhora o aroma dos frutos e repele naturalmente mosquitos, moscas-brancas e traças com os seus óleos aromáticos."
  },
  {
    id: "cur_2",
    category: "Fertilização",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    emoji: "🥚",
    title: "Cálcio Líquido das Cascas de Ovos",
    fact: "A água arrefecida da cozedura de ovos é rica em cálcio e minerais solúveis. Usa-a nas regas para prevenir a podridão apical nos tomateiros e pimentos."
  },
  {
    id: "cur_3",
    category: "Solo & Pragas",
    tagColor: "bg-stone-100 text-stone-800 border-stone-200",
    emoji: "☕",
    title: "O Escudo das Borras de Café",
    fact: "Espalhar borras de café secas à volta das alfaces cria uma barreira abrasiva que afasta lesmas e caracóis, além de fornecer azoto gradual à terra."
  },
  {
    id: "cur_4",
    category: "Controlo Natural",
    tagColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    emoji: "🌼",
    title: "Cravos-Túnicos Guardiões do Solo",
    fact: "As raízes dos cravos-túnicos (Tagetes) libertam substâncias nematicidas naturais que eliminam nemátodos prejudiciais, protegendo batatas e cenouras."
  },
  {
    id: "cur_5",
    category: "Solo Vivo",
    tagColor: "bg-orange-100 text-orange-800 border-orange-200",
    emoji: "🪱",
    title: "Engenheiras do Solo",
    fact: "Um solo rico em minhocas absorve até 10 vezes mais água da chuva. Os seus túneis biológicos arejam profundamente as raízes das plantas da horta."
  },
  {
    id: "cur_6",
    category: "Corretivo",
    tagColor: "bg-zinc-100 text-zinc-800 border-zinc-200",
    emoji: "🪵",
    title: "Ouro Cinzento da Lareira",
    fact: "A cinza de lenha limpa é rica em potássio e carbonato de cálcio. Em doses moderadas corrige solos ácidos e afasta formigas dos canteiros."
  },
  {
    id: "cur_7",
    category: "Permacultura",
    tagColor: "bg-lime-100 text-lime-800 border-lime-200",
    emoji: "🌽",
    title: "A Tríade Ancestral (As Três Irmãs)",
    fact: "O milho serve de tutor ao feijão, o feijão fixa azoto no solo e as folhas da abóbora cobrem a terra, conservando a humidade e travando ervas daninhas."
  },
  {
    id: "cur_8",
    category: "Fungicida Natural",
    tagColor: "bg-purple-100 text-purple-800 border-purple-200",
    emoji: "🧅",
    title: "Cebolinho contra o Oídio",
    fact: "Plantar cebolinho junto a macieiras, roseiras e curgetes reduz o oídio e sarna devido aos seus compostos voláteis de enxofre."
  },
  {
    id: "cur_9",
    category: "Clima & Natureza",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    emoji: "🦗",
    title: "Termómetro Natural dos Grilos",
    fact: "Podes estimar a temperatura ambiente contando o número de cantos de um grilo em 8 segundos e somando 5. A física dos insetos é surpreendente!"
  },
  {
    id: "cur_10",
    category: "Podas",
    tagColor: "bg-red-100 text-red-800 border-red-200",
    emoji: "✂️",
    title: "Desladroar os Tomateiros",
    fact: "Retirar os rebentos axilares ('ladrões') entre o caule e as folhas do tomateiro concentra toda a energia e seiva na maturação rápida dos frutos."
  },
  {
    id: "cur_11",
    category: "Receita Caseira",
    tagColor: "bg-slate-100 text-slate-800 border-slate-200",
    emoji: "🧄",
    title: "Spray Protetor de Alho",
    fact: "Macerar 3 dentes de alho em 1 litro de água durante 24h produz um repelente caseiro potente contra pulgões, fungos e ácaros, 100% ecológico."
  },
  {
    id: "cur_12",
    category: "Animais",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    emoji: "🐔",
    title: "Banhos de Pó das Galinhas",
    fact: "Quando as galinhas se esfregam na terra ou cinza, não estão a sujar-se: é o método natural e instintivo de sufocarem piolhos e ácaros nas penas."
  },
  {
    id: "cur_13",
    category: "Bioestimulante",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    emoji: "🌿",
    title: "Chorume de Urtiga Mágico",
    fact: "Fermentar urtigas em água durante 10 dias cria um bioestimulante ultra-rico em ferro e azoto que acelera o crescimento vegetativo de qualquer hortaliça."
  },
  {
    id: "cur_14",
    category: "Biodiversidade",
    tagColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    emoji: "🐝",
    title: "A Dança das Abelhas",
    fact: "As abelhas indicam a direção e distância exata de flores até 5 km através de uma 'dança em oito', comunicando a posição em relação ao sol com precisão milimétrica."
  },
  {
    id: "cur_15",
    category: "Poupança de Água",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    emoji: "🌾",
    title: "Acolchoamento (Mulching)",
    fact: "Cobrir a terra com 5 cm de palha ou folhas secas reduz a evaporação da água em até 60% e mantém o solo fresco nos dias mais quentes de verão."
  },
  {
    id: "cur_16",
    category: "Rega Eficiente",
    tagColor: "bg-cyan-100 text-cyan-800 border-cyan-200",
    emoji: "💧",
    title: "Regar ao Nascer do Sol",
    fact: "Regar cedo permite que as plantas absorvam a humidade antes do calor e evita que as folhas fiquem molhadas durante a noite, prevenindo fungos perigosos."
  },
  {
    id: "cur_17",
    category: "Consorciação",
    tagColor: "bg-orange-100 text-orange-800 border-orange-200",
    emoji: "🥕",
    title: "Alecrim Salva Cenouras",
    fact: "O odor penetrante do alecrim confunde a mosca-da-cenoura (Psila rosae), impedindo-a de encontrar as raízes tenras para fazer a postura."
  },
  {
    id: "cur_18",
    category: "Fungicida Lácteo",
    tagColor: "bg-sky-100 text-sky-800 border-sky-200",
    emoji: "🥛",
    title: "Leite contra Fungos",
    fact: "Uma mistura de 1 parte de leite para 9 partes de água pulverizada ao sol cria uma película com propriedades antissépticas que combate eficazmente o oídio."
  },
  {
    id: "cur_19",
    category: "Auxiliares",
    tagColor: "bg-rose-100 text-rose-800 border-rose-200",
    emoji: "🐞",
    title: "Joaninhas Devoradoras de Pulgões",
    fact: "Uma única joaninha adulta come mais de 50 pulgões por dia. São as melhores e mais eficazes aliadas biológicas para manter as plantas limpas."
  },
  {
    id: "cur_20",
    category: "Nutrientes",
    tagColor: "bg-yellow-100 text-yellow-800 border-yellow-200",
    emoji: "🍌",
    title: "Casca de Banana e Frutos Doces",
    fact: "Enterrar pedaços de casca de banana perto de pimenteiros e morangueiros fornece potássio lento, estimulando floração abundante e frutos mais doces."
  },
  {
    id: "cur_21",
    category: "Auxiliares da Noite",
    tagColor: "bg-emerald-100 text-emerald-800 border-emerald-200",
    emoji: "🐸",
    title: "Sapo no Canteiro é Riqueza",
    fact: "Um sapo na horta consome até 100 insetos, lesmas e lagartas por noite. Um pequeno abrigo de barro com sombra é um convite precioso para ele ficar."
  },
  {
    id: "cur_22",
    category: "Tradição Rural",
    tagColor: "bg-indigo-100 text-indigo-800 border-indigo-200",
    emoji: "🌕",
    title: "Sabedoria das Luas",
    fact: "\"O que dá abaixo da terra no minguante; o que dá acima no crescente.\" A sabedoria popular alinha a gravidade lunar com a subida e descida da seiva."
  },
  {
    id: "cur_23",
    category: "Truque Picante",
    tagColor: "bg-red-100 text-red-800 border-red-200",
    emoji: "🌶️",
    title: "Pimentas Mais Fortes",
    fact: "Reduzir ligeiramente a rega dos piripíris na fase final de maturação provoca um stress hídrico controlado que duplica a concentração de capsaicina."
  },
  {
    id: "cur_24",
    category: "Planta Sacrifício",
    tagColor: "bg-amber-100 text-amber-800 border-amber-200",
    emoji: "🌺",
    title: "Capuchinhas como Escudo",
    fact: "As capuchinhas atraem pulgões com tanta intensidade que poupam as outras hortaliças. Além disso, as suas flores e folhas são comestíveis e picantes!"
  },
  {
    id: "cur_25",
    category: "Aromáticas",
    tagColor: "bg-violet-100 text-violet-800 border-violet-200",
    emoji: "🪻",
    title: "Lavanda e Polinização",
    fact: "Ter lavanda na bordadura da horta atrai enxames de polinizadores para curgetes, abóboras e favas, aumentando as colheitas em até 40%."
  }
];

export default function DailyCuriosityCard() {
  const dayIndex = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dayOfYear % CURIOSITIES.length;
  }, []);

  const [currentIndex, setCurrentIndex] = useState(dayIndex);
  const [isFlipping, setIsFlipping] = useState(false);

  const cur = CURIOSITIES[currentIndex] || CURIOSITIES[0];
  const isDaily = currentIndex === dayIndex;

  const handleNext = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % CURIOSITIES.length);
      setIsFlipping(false);
    }, 150);
  };

  return (
    <section 
      aria-label="Curiosidade Diária" 
      className="relative overflow-hidden rounded-2xl border border-amber-200/80 bg-gradient-to-r from-amber-50/90 via-emerald-50/50 to-amber-50/80 p-3 sm:p-3.5 shadow-sm transition-all hover:shadow-md"
    >
      <div className="pointer-events-none absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-amber-200/20 blur-xl" />

      <div className="relative flex items-start sm:items-center gap-3">
        {/* Emoji / Ícone compacto com badge */}
        <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-xl sm:text-2xl shadow-sm border border-amber-300/60 select-none">
          {cur.emoji}
        </div>

        {/* Conteúdo textual */}
        <div className={`flex-1 min-w-0 transition-opacity duration-150 ${isFlipping ? "opacity-30" : "opacity-100"}`}>
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-900/90">
              <Lightbulb className="w-3 h-3 text-amber-600 fill-amber-500" />
              {isDaily ? "Sabedoria do Dia" : "Curiosidade da Horta"}
            </span>
            <span className={`text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${cur.tagColor}`}>
              #{cur.category}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-stone-700 leading-snug">
            <strong className="font-semibold text-stone-900">{cur.title}: </strong>
            <span>{cur.fact}</span>
          </p>
        </div>

        {/* Botão compacto para rodar/ver outra dica */}
        <div className="shrink-0 flex items-center">
          <button
            type="button"
            onClick={handleNext}
            title="Ver outra curiosidade"
            className="w-8 h-8 rounded-xl bg-white/90 hover:bg-white border border-amber-200 text-stone-600 hover:text-amber-700 flex items-center justify-center transition-all active:scale-90 shadow-sm"
            aria-label="Ver outra curiosidade"
          >
            <Shuffle className={`w-3.5 h-3.5 transition-transform duration-300 ${isFlipping ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>
    </section>
  );
}
