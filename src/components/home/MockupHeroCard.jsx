import { useI18n } from "@/lib/I18nContext";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
const SLIDES = [{
  id: "varanda",
  category: "Horta de Varanda",
  title: "Uma horta organizada, cuidado a cuidado",
  subtitle: "Reúne plantações, animais e tarefas num só lugar.",
  buttonText: "Abrir Minha Quinta",
  buttonTo: "/minha-quinta",
  badgeColor: "text-emerald-800",
  theme: "emerald"
}, {
  id: "estacao",
  category: "Cultivo da Estação",
  title: "O calendário muda com a tua região",
  subtitle: "Consulta as indicações de época e os cuidados para as tuas culturas.",
  buttonText: "Ver Calendário",
  buttonTo: "/calendario-curas",
  badgeColor: "text-amber-800",
  theme: "amber"
}, {
  id: "tarefas",
  category: "Alertas Inteligentes",
  title: "Acompanha as tuas regas e podas",
  subtitle: "Consulta as tarefas do dia para as tuas plantas e animais.",
  buttonText: "Ver Tarefas de Hoje",
  buttonTo: "/tarefas-hoje",
  badgeColor: "text-teal-800",
  theme: "teal"
}];
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
  return <div className="w-full">
      {/* Cartão de Destaque com visual idêntico ao mockup */}
      <div className="relative overflow-hidden rounded-[26px] bg-[#eaf4ec] border border-emerald-200/70 p-4 sm:p-6 md:p-7 shadow-xs transition-all duration-500">
        {/* Fundo com gradiente suave */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-transparent to-emerald-100/40 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-[1fr_auto] items-center gap-3 sm:gap-6">
          {/* Lado Esquerdo: Tag, Título, Subtítulo e Botão Verde Escuro */}
          <div className="min-w-0 pr-1">
            <span className="inline-block text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-emerald-800 mb-1">
              {i18nT(slide.category)}
            </span>
            <h2 className="text-base sm:text-xl md:text-2xl font-black text-stone-800 leading-snug line-clamp-2">
              {i18nT(slide.title)}
            </h2>
            <p className="text-[11px] sm:text-xs md:text-sm text-stone-600 mt-1 md:mt-1.5 line-clamp-2 font-medium">
              {i18nT(slide.subtitle)}
            </p>

            <Link to={slide.buttonTo} className="inline-flex items-center gap-1.5 bg-[#155e37] hover:bg-[#0f4427] active:scale-95 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md shadow-emerald-900/15 transition-all mt-3">
              <span>{i18nT(slide.buttonText)}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {/* Lado Direito: Ilustração de Planta / Broto com Folhas Verdes em Solo Fértil */}
          <div className="shrink-0 w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-emerald-300/20 rounded-full blur-lg" />
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Monte de terra */}
              <ellipse cx="50" cy="85" rx="36" ry="10" fill="#5c3d2e" opacity="0.25" />
              <ellipse cx="50" cy="82" rx="30" ry="8" fill="#6d4c3d" />
              <ellipse cx="50" cy="80" rx="24" ry="6" fill="#8d6e63" />
              
              {/* Caule principal do broto */}
              <path d="M50 80 Q51 55 49 42 Q48 30 52 20" stroke="#2e7d32" strokeWidth="4" strokeLinecap="round" />

              {/* Raminho esquerdo */}
              <path d="M50 55 Q42 50 36 52" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
              {/* Folha esquerda baixa */}
              <path d="M36 52 C28 46 25 36 34 38 C42 40 40 50 36 52 Z" fill="#4caf50" />
              <path d="M36 52 Q33 44 32 38" stroke="#2e7d32" strokeWidth="1.2" strokeLinecap="round" />

              {/* Raminho direito */}
              <path d="M50 46 Q58 42 64 45" stroke="#2e7d32" strokeWidth="2.5" strokeLinecap="round" />
              {/* Folha direita baixa */}
              <path d="M64 45 C72 40 76 30 67 32 C58 34 60 43 64 45 Z" fill="#66bb6a" />
              <path d="M64 45 Q68 38 69 32" stroke="#388e3c" strokeWidth="1.2" strokeLinecap="round" />

              {/* Folha do topo esquerda */}
              <path d="M52 20 C42 16 38 4 48 8 C55 11 53 18 52 20 Z" fill="#43a047" />
              {/* Folha do topo direita (mais jovem e brilhante) */}
              <path d="M52 20 C60 14 65 5 56 6 C49 7 51 16 52 20 Z" fill="#81c784" />

              {/* Brilho solar */}
              <circle cx="28" cy="18" r="3" fill="#fbc02d" opacity="0.6" />
              <circle cx="34" cy="14" r="1.5" fill="#fff59d" />
            </svg>
          </div>
        </div>
      </div>

      {/* Indicador de 3 pontos do carrossel (idêntico ao mockup: • • •) */}
      <div className="flex items-center justify-center gap-1.5 mt-2.5">
        {i18nT(SLIDES.map((s, idx) => {
        const isActive = idx === current;
        return <button key={s.id} onClick={() => setCurrent(idx)} className={`h-1.5 rounded-full transition-all duration-300 ${isActive ? "w-6 bg-[#155e37]" : "w-1.5 bg-emerald-200/90 hover:bg-emerald-300"}`} aria-label={i18nT("Slide {v0}", {
          v0: idx + 1
        })} />;
      }))}
      </div>
    </div>;
}
