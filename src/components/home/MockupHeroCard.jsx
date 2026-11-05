import { useI18n } from "@/lib/I18nContext";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

const SLIDES = [
  {
    id: "varanda",
    category: "Horta de Varanda",
    title: "Uma horta organizada, cuidado a cuidado",
    subtitle: "Reúne plantações, animais e tarefas num só lugar.",
    buttonText: "Abrir Minha Quinta",
    buttonTo: "/minha-quinta",
    cardBg: "from-emerald-50 via-[#e8f5ec] to-teal-50/90 border-emerald-200/90",
    badgeClass: "bg-emerald-700/10 text-emerald-900 border-emerald-600/20",
    btnClass: "bg-gradient-to-r from-[#155e37] via-emerald-700 to-teal-700 hover:from-[#0f4427] hover:to-emerald-800 shadow-emerald-900/20"
  },
  {
    id: "estacao",
    category: "Cultivo da Estação",
    title: "O calendário muda com a tua região",
    subtitle: "Consulta as indicações de época e os cuidados para as tuas culturas.",
    buttonText: "Ver Calendário",
    buttonTo: "/calendario-curas",
    cardBg: "from-amber-50/90 via-[#fbf5e6] to-emerald-50/80 border-amber-200/90",
    badgeClass: "bg-amber-600/15 text-amber-900 border-amber-500/25",
    btnClass: "bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 shadow-amber-900/20"
  },
  {
    id: "tarefas",
    category: "Alertas Inteligentes",
    title: "Acompanha as tuas regas e podas",
    subtitle: "Consulta as tarefas do dia para as tuas plantas e animais.",
    buttonText: "Ver Tarefas de Hoje",
    buttonTo: "/tarefas-hoje",
    cardBg: "from-teal-50/90 via-[#e6f5f2] to-emerald-50 border-teal-200/90",
    badgeClass: "bg-teal-700/10 text-teal-900 border-teal-600/20",
    btnClass: "bg-gradient-to-r from-teal-700 via-emerald-700 to-green-700 hover:from-teal-800 hover:to-emerald-800 shadow-teal-900/20"
  }
];

export default function MockupHeroCard() {
  const {
    t: i18nT
  } = useI18n();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="w-full">
      <div
        className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${slide.cardBg} border p-4 sm:p-6 md:p-7 shadow-md transition-all duration-500`}
      >
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/50 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-emerald-200/30 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-[1fr_auto] items-center gap-3 sm:gap-6">
          <div className="min-w-0 pr-1">
            <span
              className={`inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border mb-2 ${slide.badgeClass}`}
            >
              <Sparkles className="w-3 h-3" />
              <span>{i18nT(slide.category)}</span>
            </span>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-stone-800 leading-snug line-clamp-2 tracking-tight">
              {i18nT(slide.title)}
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 md:mt-1.5 line-clamp-2 font-medium leading-relaxed">
              {i18nT(slide.subtitle)}
            </p>

            <div className="flex items-center gap-3 mt-3.5 flex-wrap">
              <Link
                to={slide.buttonTo}
                className={`inline-flex items-center gap-2 ${slide.btnClass} active:scale-95 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-full shadow-md transition-all`}
              >
                <span>{i18nT(slide.buttonText)}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Ilustração Botânica */}
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 flex items-center justify-center relative">
            <div className="absolute inset-1 bg-white/70 rounded-3xl border border-white/80 shadow-inner" />
            <svg
              viewBox="0 0 100 100"
              className="w-full h-full drop-shadow-md relative z-10 p-1.5"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <ellipse cx="50" cy="85" rx="36" ry="10" fill="#5c3d2e" opacity="0.22" />
              <ellipse cx="50" cy="82" rx="30" ry="8" fill="#6d4c3d" />
              <ellipse cx="50" cy="80" rx="24" ry="6" fill="#8d6e63" />

              <path d="M50 80 Q51 55 49 42 Q48 30 52 20" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" />

              <path d="M50 55 Q42 50 36 52" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M36 52 C28 46 25 36 34 38 C42 40 40 50 36 52 Z" fill="#4caf50" />
              <path d="M36 52 Q33 44 32 38" stroke="#2e7d32" strokeWidth="1.2" strokeLinecap="round" />

              <path d="M50 46 Q58 42 64 45" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M64 45 C72 40 76 30 67 32 C58 34 60 43 64 45 Z" fill="#66bb6a" />
              <path d="M64 45 Q68 38 69 32" stroke="#388e3c" strokeWidth="1.2" strokeLinecap="round" />

              <path d="M52 20 C42 16 38 4 48 8 C55 11 53 18 52 20 Z" fill="#43a047" />
              <path d="M52 20 C60 14 65 5 56 6 C49 7 51 16 52 20 Z" fill="#81c784" />

              <circle cx="26" cy="20" r="4" fill="#fbbf24" opacity="0.85" />
              <circle cx="34" cy="14" r="2" fill="#fde68a" />
            </svg>
          </div>
        </div>
      </div>

      {/* Indicador de 3 pontos do carrossel */}
      <div className="flex items-center justify-center gap-2 mt-2.5">
        {i18nT(
          SLIDES.map((s, idx) => {
            const isActive = idx === current;
            return (
              <button
                key={s.id}
                onClick={() => setCurrent(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? "w-8 bg-[#155e37] shadow-2xs" : "w-2 bg-emerald-200 hover:bg-emerald-300"
                }`}
                aria-label={i18nT("Slide {v0}", { v0: idx + 1 })}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
