import { useI18n } from "@/lib/I18nContext";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Scan, Bell, Menu, Sparkles } from "lucide-react";
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
  return <header className="hv-app-header w-full text-white pt-3 sm:pt-4 pb-5 px-4 sm:px-6 lg:px-8 rounded-b-[28px] sm:rounded-b-[36px] shadow-xl shadow-emerald-950/15">
      <div className="max-w-6xl mx-auto">
        {/* Linha Superior: Logo + Título à esquerda / Links no Desktop / Notificações + Menu à direita */}
        <div className="flex items-center justify-between gap-4 mb-3.5">
          <div className="flex items-center gap-2.5 shrink-0">
            <img src={logoUrl} alt={i18nT("Horta Viva")} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover shadow-md border border-white/25 shrink-0" onError={e => {
            e.currentTarget.src = "./logo.jpg";
          }} />
            <div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">{i18nT("Horta Viva")}</h1>
              <p className="text-[10px] sm:text-xs text-emerald-200/90 font-medium">{i18nT("Guia de Cultivo & Horta")}</p>
            </div>
          </div>

          {/* Links Rápidos de Navegação para Desktop (PC) */}
          <nav className="hidden lg:flex items-center gap-1 bg-black/20 backdrop-blur-md rounded-full px-3 py-1 border border-white/15">
            <Link to="/minha-quinta" className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors">{i18nT("Minha Quinta")}</Link>
            <Link to="/tarefas-hoje" className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors">{i18nT("Tarefas")}</Link>
            <Link to="/podas-mondas" className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors">{i18nT("Podas & Mondas")}</Link>
            <Link to="/animais" className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors">{i18nT("Animais")}</Link>
            <Link to="/calendario-curas" className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors">{i18nT("Curas")}</Link>
            <Link to="/cogumelos" className="text-xs font-semibold px-2.5 py-1 rounded-full text-white/90 hover:text-white hover:bg-white/20 transition-colors">{i18nT("Cogumelos")}</Link>
            <Link to="/pro" className="text-xs font-bold px-2.5 py-1 rounded-full text-amber-200 hover:text-amber-100 hover:bg-white/20 transition-colors flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-300" />{i18nT(" Planos")}</Link>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Sino de Notificações com Badge vermelho (idêntico ao mockup) */}
            <Link to="/tarefas-hoje" className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all backdrop-blur-md" title={i18nT("Tarefas e Alertas de Hoje")} aria-label={i18nT("Tarefas de hoje")}>
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              {pendingTasksCount > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#155e37] shadow-xs">
                  {pendingTasksCount > 9 ? i18nT("9+") : i18nT(pendingTasksCount)}
                </span>}
            </Link>

            {/* Menu Drawer lateral com estilo circular */}
            <NavigationDrawer customTrigger={<button className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/15 hover:bg-white/25 active:scale-95 text-white flex items-center justify-center transition-all backdrop-blur-md" aria-label={i18nT("Abrir menu de secções")} title={i18nT("Menu")}>
                  <Menu className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </button>} />
          </div>
        </div>

        {/* Barra de Pesquisa Branca em Pílula (idêntica ao mockup) */}
        <div className={`w-full max-w-3xl mx-auto bg-white rounded-full px-4 py-2.5 sm:py-3 shadow-lg flex items-center gap-2.5 transition-all duration-200 ${isFocused ? "ring-2 ring-emerald-300 shadow-emerald-950/20" : ""}`}>
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 shrink-0" />
          <input type="text" value={searchQuery} onChange={e => onSearchChange(e.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} placeholder={i18nT("Buscar qualquer planta...")} className="flex-1 min-w-0 bg-transparent outline-none text-stone-800 placeholder:text-stone-400 text-xs sm:text-sm font-medium" />
          {searchQuery && <button onClick={onClearSearch} className="text-stone-400 hover:text-stone-600 transition-colors p-0.5" aria-label={i18nT("Limpar pesquisa")}>
              <X className="w-4 h-4" />
            </button>}
          {/* Botão IA que leva diretamente para o Assistente IA */}
          <button type="button" onClick={() => {
          if (onGoToAI) {
            onGoToAI(searchQuery);
          } else {
            const el = document.getElementById("assistente-ia");
            if (el) {
              el.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });
              setTimeout(() => {
                const input = el.querySelector("input");
                if (input) input.focus();
              }, 400);
            }
          }
        }} className="shrink-0 inline-flex items-center gap-1 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-[11px] sm:text-xs font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full shadow-sm hover:shadow active:scale-95 transition-all" title={i18nT("Ir para o Assistente Agrónomo IA")} aria-label={i18nT("Ir para o Assistente Agrónomo IA")}>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span>{i18nT("IA")}</span>
          </button>

          {/* Botão Scan/Foto para Identificador IA (Plantas & Animais) */}
          <Link to="/identificar" className="shrink-0 text-stone-500 hover:text-emerald-700 active:scale-95 transition-all p-1 rounded-full hover:bg-emerald-50" title={i18nT("Identificador IA (plantas e animais por foto)")} aria-label={i18nT("Identificador IA (plantas e animais por foto)")}>
            <Scan className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 hover:text-emerald-700" />
          </Link>
        </div>
      </div>
    </header>;
}
