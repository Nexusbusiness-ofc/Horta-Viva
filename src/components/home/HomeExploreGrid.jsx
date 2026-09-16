import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { resolveAssetUrl } from "@/lib/utils";

const SECTIONS = [
  {
    id: "animais",
    title: "Animais da Quinta",
    desc: "Criação, cuidados e pasto",
    badge: "33 espécies",
    emoji: "🐔",
    to: "/animais",
    accent: "from-orange-500/30 to-amber-500/20",
    border: "group-hover:border-amber-400/60",
    intervalMs: 4000,
    delayMs: 0,
    images: [
      "./images/animals/galinha.jpg",
      "./images/animals/cabra.jpg",
      "./images/animals/burro.jpg",
      "./images/animals/cao_guarda.jpg",
      "./images/animals/ovelha.jpg",
      "./images/animals/cavalo.jpg",
      "./images/animals/pato.jpg",
      "./images/animals/pavao.jpg",
      "./images/animals/alpaca.jpg",
    ],
  },
  {
    id: "cogumelos",
    title: "Cogumelos Silvestres",
    desc: "Identificação e toxicidade",
    badge: "Guia Micológico",
    emoji: "🍄",
    to: "/cogumelos",
    accent: "from-amber-600/30 to-yellow-500/20",
    border: "group-hover:border-yellow-400/60",
    intervalMs: 4500,
    delayMs: 1200,
    images: [
      "./images/mushrooms/boletus.jpg",
      "./images/mushrooms/tortulho.jpg",
      "./images/mushrooms/cantarela.jpg",
      "./images/mushrooms/miscaro.jpg",
      "./images/mushrooms/morchella.jpg",
      "./images/mushrooms/sancha.jpg",
      "./images/mushrooms/amanita_muscaria.jpg",
    ],
  },
  {
    id: "curas",
    title: "Curas & Tratamentos",
    desc: "Fitofármacos e receitas",
    badge: "Saúde Vegetal",
    emoji: "🌿",
    to: "/calendario-curas",
    accent: "from-purple-500/30 to-teal-500/20",
    border: "group-hover:border-emerald-400/60",
    intervalMs: 4200,
    delayMs: 2400,
    images: [
      "./images/curas/calda_bordalesa.jpg",
      "./images/curas/urtiga.jpg",
      "./images/curas/pulverizador.jpg",
      "./images/curas/cavalinha.jpg",
      "./images/curas/neem.jpg",
      "./images/curas/camomila_cura.jpg",
      "./images/curas/alho_cura.jpg",
    ],
  },
  {
    id: "podas",
    title: "Podas & Mondas",
    desc: "Épocas, desbaste e corte",
    badge: "Maneio & Vigor",
    emoji: "✂️",
    to: "/podas-mondas",
    accent: "from-emerald-500/30 to-green-600/20",
    border: "group-hover:border-emerald-400/60",
    intervalMs: 4600,
    delayMs: 3600,
    images: [
      "./images/podas/oliveira.jpg",
      "./images/podas/vinha.jpg",
      "./images/podas/macieira.jpg",
      "./images/podas/laranjeira.jpg",
      "./images/mondas/tomateiro.jpg",
      "./images/podas/pessegueiro.jpg",
      "./images/mondas/cenoura.jpg",
      "./images/podas/cerejeira.jpg",
    ],
  },
];

function SectionFadingCard({ section }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let timer;
    // Delay inicial desfasado para que as 4 secções não mudem ao mesmo milissegundo
    const startTimeout = setTimeout(() => {
      timer = setInterval(() => {
        setIndex((prev) => (prev + 1) % section.images.length);
      }, section.intervalMs);
    }, section.delayMs);

    return () => {
      clearTimeout(startTimeout);
      if (timer) clearInterval(timer);
    };
  }, [section.images.length, section.intervalMs, section.delayMs]);

  return (
    <Link
      to={section.to}
      className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-stone-200/80 bg-stone-900 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex flex-col justify-between p-3.5 sm:p-4 h-36 sm:h-44 md:h-48 select-none ${section.border}`}
    >
      {/* Imagens de fundo com crossfade suave */}
      {section.images.map((img, i) => {
        const isCurrent = i === index;
        return (
          <img
            key={img}
            src={resolveAssetUrl(img)}
            alt={section.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out group-hover:scale-105 ${
              isCurrent ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
            }`}
            loading="lazy"
            onError={(e) => {
              e.currentTarget.style.opacity = "0";
            }}
          />
        );
      })}

      {/* Gradiente escuro para legibilidade perfeita */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20 pointer-events-none" />

      {/* Gradiente de cor subtil temático no hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${section.accent} opacity-40 group-hover:opacity-60 transition-opacity duration-300 pointer-events-none`}
      />

      {/* Topo do cartão: Badge e Ícone de Ação */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[10px] sm:text-xs font-semibold shadow-sm">
          <span className="text-xs sm:text-sm">{section.emoji}</span>
          <span className="tracking-wide">{section.badge}</span>
        </span>

        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white group-hover:text-stone-900 shadow-sm">
          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </div>
      </div>

      {/* Fundo do cartão: Título, Descrição e Micro-indicadores */}
      <div className="relative z-10">
        <h3 className="text-sm sm:text-base md:text-lg font-bold text-white drop-shadow-sm leading-tight flex items-center gap-1 group-hover:text-white transition-colors">
          {section.title}
        </h3>
        <p className="text-[11px] sm:text-xs text-stone-200/90 font-medium line-clamp-1 mt-0.5 drop-shadow-sm">
          {section.desc}
        </p>

        {/* Micro-indicador de foto ativa */}
        <div className="flex items-center gap-1 mt-2">
          {section.images.slice(0, 6).map((_, dotIdx) => {
            const active = (index % 6) === dotIdx;
            return (
              <span
                key={dotIdx}
                className={`h-1 rounded-full transition-all duration-500 ${
                  active ? "w-3.5 bg-white" : "w-1 bg-white/40"
                }`}
              />
            );
          })}
        </div>
      </div>
    </Link>
  );
}

export default function HomeExploreGrid() {
  return (
    <section aria-label="Secções da Quinta" className="space-y-2.5">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-sm sm:text-base font-bold text-stone-800 flex items-center gap-1.5">
            <span>🧭</span>
            <span>Explorar a Quinta</span>
          </h2>
          <span className="text-[10px] sm:text-xs bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
            Guias Práticos
          </span>
        </div>
        <span className="text-xs text-stone-400 font-medium hidden sm:inline">
          Toque para abrir
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {SECTIONS.map((sec) => (
          <SectionFadingCard key={sec.id} section={sec} />
        ))}
      </div>
    </section>
  );
}
