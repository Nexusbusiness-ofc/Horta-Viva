import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Scan, Bell, Menu } from "lucide-react";
import NavigationDrawer from "@/components/home/NavigationDrawer";

export default function HomeMockupHeader({
  searchQuery,
  onSearchChange,
  onClearSearch,
  pendingTasksCount = 1,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const logoUrl = `${import.meta.env.BASE_URL}logo.jpg`;

  return (
    <header className="w-full bg-gradient-to-b from-[#185e3a] via-[#14532d] to-[#0f4423] text-white pt-3 sm:pt-4 pb-5 px-4 sm:px-6 rounded-b-[28px] sm:rounded-b-[36px] shadow-xl shadow-emerald-950/15">
      <div className="max-w-xl mx-auto">
        {/* Linha Superior: Logo + Título à esquerda / Notificações + Menu à direita */}
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <img
              src={logoUrl}
              alt="Horta Viva"
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-md border border-white/25 shrink-0"
              onError={(e) => {
                e.currentTarget.src = "./logo.jpg";
              }}
            />
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
                Horta Viva
              </h1>
              <p className="text-[10px] sm:text-xs text-emerald-200/90 font-medium">
                Guia de Cultivo & Horta
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Sino de Notificações com Badge vermelho (idêntico ao mockup) */}
            <Link
              to="/tarefas-hoje"
              className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all backdrop-blur-md"
              title="Tarefas e Alertas de Hoje"
              aria-label="Tarefas de hoje"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              {pendingTasksCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#155e37] shadow-xs">
                  {pendingTasksCount > 9 ? "9+" : pendingTasksCount}
                </span>
              )}
            </Link>

            {/* Menu Drawer lateral com estilo circular */}
            <NavigationDrawer
              customTrigger={
                <button
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all backdrop-blur-md"
                  aria-label="Abrir menu de secções"
                  title="Menu"
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              }
            />
          </div>
        </div>

        {/* Barra de Pesquisa Branca em Pílula (idêntica ao mockup) */}
        <div
          className={`w-full bg-white rounded-full px-4 py-2.5 sm:py-3 shadow-lg flex items-center gap-2.5 transition-all duration-200 ${
            isFocused ? "ring-2 ring-emerald-300 shadow-emerald-950/20" : ""
          }`}
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Buscar qualquer planta..."
            className="flex-1 min-w-0 bg-transparent outline-none text-stone-800 placeholder:text-stone-400 text-xs sm:text-sm font-medium"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="text-stone-400 hover:text-stone-600 transition-colors p-0.5"
              aria-label="Limpar pesquisa"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {/* Botão Scan/Foto para Identificador IA (Plantas & Animais) */}
          <Link
            to="/identificar"
            className="shrink-0 text-stone-500 hover:text-emerald-700 active:scale-95 transition-all p-1 rounded-full hover:bg-emerald-50"
            title="Identificador IA (plantas e animais por foto)"
            aria-label="Identificador IA (plantas e animais por foto)"
          >
            <Scan className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 hover:text-emerald-700" />
          </Link>
        </div>
      </div>
    </header>
  );
}
