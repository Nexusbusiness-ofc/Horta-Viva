import { useI18n } from "@/lib/I18nContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Scan, Bell, Menu, Sparkles, Sprout } from "lucide-react";
import NavigationDrawer from "@/components/home/NavigationDrawer";

export default function HomeMockupHeader({
  searchQuery,
  onSearchChange,
  onClearSearch,
  onGoToAI,
  pendingTasksCount = 1
}) {
  const {
    t: i18nT
  } = useI18n();
  const [isFocused, setIsFocused] = useState(false);
  const logoUrl = `${import.meta.env.BASE_URL}logo.jpg`;

  return (
    <header className="hv-app-header relative overflow-hidden w-full text-white pt-3.5 sm:pt-5 pb-6 px-4 sm:px-6 lg:px-8 rounded-b-[32px] sm:rounded-b-[40px] shadow-2xl shadow-emerald-950/20 border-b border-emerald-400/15">
      {/* Brilhos decorativos subtis de fundo */}
      <div className="pointer-events-none absolute -top-20 -left-16 w-64 h-64 rounded-full bg-emerald-400/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-12 w-64 h-64 rounded-full bg-amber-300/10 blur-3xl" />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Linha Superior: Logo + Título à esquerda / Links no Desktop / Notificações + Menu à direita */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <div className="relative">
              <img
                src={logoUrl}
                alt={i18nT("Horta Viva")}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl object-cover shadow-lg border-2 border-emerald-300/40 group-hover:scale-105 transition-transform shrink-0"
                onError={e => {
                  e.currentTarget.src = "./logo.jpg";
                }}
              />
              <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-950 flex items-center justify-center shadow-2xs">
                <Sprout className="w-2.5 h-2.5 text-white" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none drop-shadow-xs">
                  {i18nT("Horta Viva")}
                </h1>
              </div>
              <p className="text-[11px] sm:text-xs text-emerald-200/95 font-semibold mt-0.5">
                {i18nT("Guia de Cultivo & Horta")}
              </p>
            </div>
          </Link>

          {/* Links Rápidos de Navegação para Desktop (PC) */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/10 backdrop-blur-xl rounded-full px-3 py-1.5 border border-white/20 shadow-inner">
            <Link to="/catalogo" className="text-xs font-bold px-3 py-1.5 rounded-full text-white/95 hover:text-white hover:bg-white/20 transition-all">
              {i18nT("Catálogo")}
            </Link>
            <Link to="/minha-quinta" className="text-xs font-bold px-3 py-1.5 rounded-full text-white/95 hover:text-white hover:bg-white/20 transition-all">
              {i18nT("Minha Quinta")}
            </Link>
            <Link to="/tarefas-hoje" className="text-xs font-bold px-3 py-1.5 rounded-full text-white/95 hover:text-white hover:bg-white/20 transition-all">
              {i18nT("Tarefas")}
            </Link>
            <Link to="/podas-mondas" className="text-xs font-bold px-3 py-1.5 rounded-full text-white/95 hover:text-white hover:bg-white/20 transition-all">
              {i18nT("Podas & Mondas")}
            </Link>
            <Link to="/animais" className="text-xs font-bold px-3 py-1.5 rounded-full text-white/95 hover:text-white hover:bg-white/20 transition-all">
              {i18nT("Animais")}
            </Link>
            <Link to="/calendario-curas" className="text-xs font-bold px-3 py-1.5 rounded-full text-white/95 hover:text-white hover:bg-white/20 transition-all">
              {i18nT("Curas")}
            </Link>
            <Link to="/cogumelos" className="text-xs font-bold px-3 py-1.5 rounded-full text-white/95 hover:text-white hover:bg-white/20 transition-all">
              {i18nT("Cogumelos")}
            </Link>
            <Link to="/pro" className="text-xs font-extrabold px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400/25 to-yellow-400/20 text-amber-200 hover:text-amber-100 hover:from-amber-400/35 border border-amber-300/30 transition-all flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {i18nT(" Planos")}
            </Link>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sino de Notificações com Badge */}
            <Link
              to="/tarefas-hoje"
              className="relative w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/20 shadow-sm"
              title={i18nT("Tarefas e Alertas de Hoje")}
              aria-label={i18nT("Tarefas de hoje")}
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              {pendingTasksCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-br from-rose-500 to-red-600 text-white font-black text-[10px] w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center border-2 border-[#064e3b] shadow-sm">
                  {pendingTasksCount > 9 ? i18nT("9+") : i18nT(pendingTasksCount)}
                </span>
              )}
            </Link>

            {/* Menu Drawer lateral */}
            <NavigationDrawer
              customTrigger={
                <button
                  className="w-10 h-10 rounded-2xl bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all backdrop-blur-md border border-white/20 shadow-sm"
                  aria-label={i18nT("Abrir menu de secções")}
                  title={i18nT("Menu")}
                >
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>
              }
            />
          </div>
        </div>

        {/* Barra de Pesquisa Branca em Pílula Elevada */}
        <div
          className={`w-full max-w-3xl mx-auto bg-white/98 rounded-2xl sm:rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5 shadow-xl shadow-emerald-950/25 flex items-center gap-2 sm:gap-2.5 border transition-all duration-200 ${
            isFocused
              ? "ring-4 ring-emerald-400/35 border-emerald-300 scale-[1.005]"
              : "border-white/80"
          }`}
        >
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
            <Search className="w-4 h-4 text-emerald-700" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchChange(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={i18nT("Buscar qualquer planta...")}
            className="flex-1 min-w-0 bg-transparent outline-none text-stone-800 placeholder:text-stone-400 text-xs sm:text-sm font-semibold"
          />
          {searchQuery && (
            <button
              onClick={onClearSearch}
              className="text-stone-400 hover:text-stone-600 transition-colors p-1 rounded-full hover:bg-stone-100"
              aria-label={i18nT("Limpar pesquisa")}
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Botão IA que leva diretamente para o Assistente IA */}
          <button
            type="button"
            onClick={() => {
              if (onGoToAI) {
                onGoToAI(searchQuery);
              } else {
                const el = document.getElementById("assistente-ia");
                if (el) {
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
                  setTimeout(() => {
                    const input = el.querySelector("input");
                    if (input) input.focus();
                  }, 400);
                }
              }
            }}
            className="shrink-0 inline-flex items-center gap-1.5 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[11px] sm:text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm hover:shadow-md active:scale-95 transition-all"
            title={i18nT("Ir para o Assistente Agrónomo IA")}
            aria-label={i18nT("Ir para o Assistente Agrónomo IA")}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{i18nT("IA")}</span>
          </button>

          {/* Botão Scan/Foto para Identificador IA (Plantas & Animais) */}
          <Link
            to="/identificar"
            className="shrink-0 inline-flex items-center gap-1.5 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 active:scale-95 transition-all px-2.5 py-1.5 rounded-full font-bold text-xs"
            title={i18nT("Identificador IA (plantas e animais por foto)")}
            aria-label={i18nT("Identificador IA (plantas e animais por foto)")}
          >
            <Scan className="w-4 h-4 text-emerald-700" />
            <span className="hidden sm:inline text-[11px] font-extrabold">{i18nT("Foto IA")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
