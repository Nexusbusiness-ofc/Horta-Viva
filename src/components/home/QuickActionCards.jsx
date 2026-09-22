import React from "react";
import { Link } from "react-router-dom";
import { Sun, ClipboardList } from "lucide-react";

export default function QuickActionCards() {
  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {/* Cartão 1: Cuidado Diário (Horas de Sol & Rega) - Idêntico ao mockup */}
      <Link
        to="/tarefas-hoje"
        className="group relative overflow-hidden rounded-2xl bg-[#fffbf0] border border-amber-200/70 p-3.5 flex flex-col justify-between min-h-[114px] sm:min-h-[124px] shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98]"
      >
        {/* Topo: Ícone Sol com fundo redondo âmbar */}
        <div className="w-8 h-8 rounded-xl bg-amber-100/90 text-amber-600 flex items-center justify-center shadow-xs">
          <Sun className="w-4 h-4 text-amber-600" />
        </div>

        {/* Textos */}
        <div className="relative z-10 mt-2 pr-8">
          <h3 className="text-xs sm:text-sm font-black text-stone-800 leading-tight">
            Cuidado Diário
          </h3>
          <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium mt-0.5 leading-tight">
            Horas de sol & regas
          </p>
        </div>

        {/* Ilustração Planta / Suculenta no canto inferior direito */}
        <div className="absolute -bottom-1 -right-1 w-13 h-13 sm:w-15 sm:h-15 pointer-events-none transition-transform duration-300 group-hover:scale-105">
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Vaso pequeno ou base */}
            <path d="M18 48 L42 48 L39 58 L21 58 Z" fill="#b08968" />
            <path d="M15 45 L45 45 L42 48 L18 48 Z" fill="#8d5b4c" />
            {/* Folhas da suculenta */}
            <ellipse cx="30" cy="38" rx="7" ry="12" fill="#2e7d32" />
            <ellipse cx="23" cy="40" rx="6" ry="10" transform="rotate(-30 23 40)" fill="#388e3c" />
            <ellipse cx="37" cy="40" rx="6" ry="10" transform="rotate(30 37 40)" fill="#43a047" />
            <ellipse cx="18" cy="43" rx="5" ry="8" transform="rotate(-55 18 43)" fill="#4caf50" />
            <ellipse cx="42" cy="43" rx="5" ry="8" transform="rotate(55 42 43)" fill="#66bb6a" />
            {/* Centro */}
            <circle cx="30" cy="42" r="4" fill="#81c784" />
          </svg>
        </div>
      </Link>

      {/* Cartão 2: Mondas & Cobertura (Proteção das raízes) - Idêntico ao mockup */}
      <Link
        to="/podas-mondas"
        className="group relative overflow-hidden rounded-2xl bg-[#f0f8f3] border border-emerald-200/70 p-3.5 flex flex-col justify-between min-h-[114px] sm:min-h-[124px] shadow-xs hover:shadow-md transition-all duration-200 active:scale-[0.98]"
      >
        {/* Topo: Ícone Documento / Prancheta com fundo verde menta */}
        <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
          <ClipboardList className="w-4 h-4 text-emerald-700" />
        </div>

        {/* Textos */}
        <div className="relative z-10 mt-2 pr-8">
          <h3 className="text-xs sm:text-sm font-black text-stone-800 leading-tight">
            Mondas & Cobertura
          </h3>
          <p className="text-[10px] sm:text-[11px] text-stone-500 font-medium mt-0.5 leading-tight">
            Proteção das raízes
          </p>
        </div>

        {/* Ilustração Cenoura no canto inferior direito */}
        <div className="absolute -bottom-1 -right-1 w-13 h-13 sm:w-15 sm:h-15 pointer-events-none transition-transform duration-300 group-hover:scale-105">
          <svg viewBox="0 0 60 60" fill="none" className="w-full h-full drop-shadow-sm">
            {/* Rama da cenoura */}
            <path d="M38 18 Q32 10 26 8 Q24 16 32 20 Z" fill="#2e7d32" />
            <path d="M40 18 Q40 8 36 4 Q32 12 36 20 Z" fill="#43a047" />
            <path d="M42 19 Q48 12 52 10 Q48 18 42 22 Z" fill="#388e3c" />
            {/* Corpo da cenoura laranja */}
            <path
              d="M34 20 C42 22 44 26 40 32 L26 56 C24 58 22 56 23 54 L30 22 C31 20 32 19 34 20 Z"
              fill="#f57c00"
            />
            {/* Listras de textura */}
            <path d="M31 28 Q34 29 36 29" stroke="#e65100" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M28 36 Q31 37 34 37" stroke="#e65100" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M26 44 Q28 45 30 45" stroke="#e65100" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
      </Link>
    </div>
  );
}
