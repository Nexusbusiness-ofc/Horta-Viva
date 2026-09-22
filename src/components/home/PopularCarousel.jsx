import React from "react";
import { ChevronRight, Plus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CURATED_POPULAR = [
  {
    id: "alface",
    nameMatch: ["alface", "canonigos", "agriao"],
    title: "Salada Crocante",
    subtitle: "Estimada em 14 dias",
    tag: "Fácil cultivo",
    emoji: "🥗",
    bgAccent: "bg-emerald-50",
  },
  {
    id: "cenoura",
    nameMatch: ["cenoura"],
    title: "Cenoura Doce",
    subtitle: "Solos leves e fundos",
    tag: "Rica em sabor",
    emoji: "🥕",
    bgAccent: "bg-amber-50",
  },
  {
    id: "tomate",
    nameMatch: ["tomate"],
    title: "Tomate Chucha",
    subtitle: "Sol pleno e rega regular",
    tag: "Colheita farta",
    emoji: "🍅",
    bgAccent: "bg-red-50",
  },
  {
    id: "morango",
    nameMatch: ["morango", "amora", "framboesa"],
    title: "Morango Silvestre",
    subtitle: "Ideal para floreiras",
    tag: "Doce todo o ano",
    emoji: "🍓",
    bgAccent: "bg-pink-50",
  },
  {
    id: "ervas",
    nameMatch: ["salsa", "manjericao", "oregaos", "alecrim"],
    title: "Ervas Aromáticas",
    subtitle: "Salsa, Alecrim & Manjericão",
    tag: "Frescura diária",
    emoji: "🌿",
    bgAccent: "bg-teal-50",
  },
];

export default function PopularCarousel({ plants = [], onSelectPlant, onSeeAll }) {
  const handleCardClick = (item) => {
    // Procura a planta correspondente no catálogo completo
    const found = plants.find((p) => {
      const pName = (p.name || "").toLowerCase();
      return item.nameMatch.some((m) => pName.includes(m));
    });

    if (found) {
      onSelectPlant(found);
    } else if (plants.length > 0) {
      onSelectPlant(plants[0]);
    }
  };

  return (
    <section className="w-full space-y-2.5">
      {/* Cabeçalho da Secção */}
      <div className="flex items-center justify-between px-0.5">
        <h2 className="text-sm sm:text-base font-black text-stone-800 tracking-tight">
          Muito Procuradas
        </h2>
        <button
          onClick={onSeeAll}
          className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5 transition-colors"
        >
          <span>Ver todas</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Carrossel Horizontal de Cartões (idêntico ao mockup) */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {CURATED_POPULAR.map((item) => {
          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item)}
              className="group min-w-[170px] max-w-[195px] bg-white rounded-2xl p-3.5 border border-stone-200/80 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer flex flex-col justify-between shrink-0"
            >
              <div>
                {/* Ícone / Emoji em círculo de cor suave */}
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-10 h-10 rounded-xl ${item.bgAccent} flex items-center justify-center text-xl shadow-xs`}>
                    {item.emoji}
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                    {item.tag}
                  </span>
                </div>

                {/* Título & Subtítulo */}
                <h3 className="font-extrabold text-stone-800 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-[11px] text-stone-500 font-medium mt-0.5 leading-tight line-clamp-1">
                  {item.subtitle}
                </p>
              </div>

              {/* Botão de ação inferior */}
              <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-emerald-700 font-bold text-[11px] group-hover:translate-x-0.5 transition-transform">
                <span className="inline-flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Começar plantio</span>
                </span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
