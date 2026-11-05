import { useI18n } from "@/lib/I18nContext";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Smartphone, ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { usePWAInstall, IOSInstructionsModal } from "@/components/pwa/InstallPrompt";

const SECTIONS = [
  {
    to: "/",
    emoji: "🏡",
    label: "Início",
    desc: "Página principal e catálogo",
    color: "#16a34a"
  },
  {
    to: "/minha-quinta",
    emoji: "🌱",
    label: "Minha Quinta",
    desc: "As tuas plantações",
    color: "#16a34a"
  },
  {
    to: "/tarefas-hoje",
    emoji: "📋",
    label: "Tarefas de hoje",
    desc: "Rega, podas e animais",
    color: "#0d9488"
  },
  {
    to: "/podas-mondas",
    emoji: "✂️",
    label: "Podas & Mondas",
    desc: "Guias de poda e monda",
    color: "#15803d"
  },
  {
    to: "/sabedoria-agricola",
    emoji: "🧭",
    label: "Sabedoria Agrícola",
    desc: "Lua, Consociação, Caldas, Pragas & Diário",
    color: "#059669"
  },
  {
    to: "/calendario-curas",
    emoji: "🌿",
    label: "Curas & Tratamentos",
    desc: "Produtos fitofarmacêuticos",
    color: "#7c3aed"
  },
  {
    to: "/animais",
    emoji: "🐔",
    label: "Animais da Quinta",
    desc: "Criação de animais",
    color: "#ea580c"
  },
  {
    to: "/cogumelos",
    emoji: "🍄",
    label: "Cogumelos",
    desc: "Catálogo micológico",
    color: "#d97706"
  },
  {
    to: "/identificar",
    emoji: "📸",
    label: "Identificador IA",
    desc: "Plantas e animais da quinta",
    color: "#0891b2"
  },
  {
    to: "/mascote",
    emoji: "🌱",
    label: "mascot.navTitle",
    desc: "mascot.navDesc",
    color: "#c27336"
  },
  {
    to: "/mercado",
    emoji: "🧺",
    label: "market.navTitle",
    desc: "market.navDesc",
    color: "#b77931"
  },
  {
    to: "/resumo-mensal",
    emoji: "📊",
    label: "Resumo mensal",
    desc: "Visão geral do mês",
    color: "#4f46e5"
  },
  {
    to: "/pro",
    emoji: "⭐",
    label: "Horta Viva Pro",
    desc: "Planos a partir de 1,99€/mês",
    color: "#f59e0b"
  },
  {
    to: "/perfil",
    emoji: "👨‍🌾",
    label: "O meu perfil",
    desc: "Foto e dados da quinta",
    color: "#9333ea"
  },
  {
    to: "/definicoes",
    emoji: "⚙️",
    label: "Definições",
    desc: "Idioma, país e clima",
    color: "#0f766e"
  }
];

export default function NavigationDrawer({
  trigger,
  customTrigger,
  triggerClassName,
  triggerIcon
}) {
  const {
    t: i18nT
  } = useI18n();
  const [open, setOpen] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const location = useLocation();
  const {
    isStandalone,
    hasPrompt,
    triggerInstall
  } = usePWAInstall();

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {trigger ||
            customTrigger || (
              <button
                className={
                  triggerClassName ||
                  "shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-stone-200 text-stone-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors shadow-sm"
                }
                aria-label={i18nT("Menu de secções")}
              >
                {triggerIcon || <Menu className="w-5 h-5" />}
              </button>
            )}
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[340px] p-0 flex flex-col border-r border-emerald-900/10 bg-[#f9fbf9]">
          <SheetHeader className="hv-app-header px-5 pt-6 pb-5 text-white flex flex-row items-center gap-3.5 shrink-0">
            <img
              src={`${import.meta.env.BASE_URL}icons/icon-192x192.png`}
              alt={i18nT("Horta Viva")}
              className="w-11 h-11 rounded-2xl object-cover shadow-md border-2 border-white/30 shrink-0"
            />
            <div>
              <SheetTitle className="text-left text-lg font-black text-white leading-tight">
                {i18nT("Horta Viva")}
              </SheetTitle>
              <p className="text-xs text-emerald-200 text-left font-medium">
                {i18nT("Menu & Secções")}
              </p>
            </div>
          </SheetHeader>

          <div className="p-3 space-y-1.5 overflow-y-auto flex-1">
            {i18nT(
              SECTIONS.map(s => {
                const isActive = s.to === "/" ? location.pathname === "/" : location.pathname.startsWith(s.to);
                return (
                  <Link
                    key={s.to}
                    to={s.to}
                    onClick={() => setOpen(false)}
                    className={`group flex items-center gap-3.5 rounded-2xl p-2.5 transition-all min-h-[54px] border ${
                      isActive
                        ? "bg-emerald-50/90 border-emerald-300/80 shadow-2xs"
                        : "bg-white border-stone-200/60 hover:border-emerald-200 hover:bg-emerald-50/30"
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl shadow-2xs"
                      style={{ backgroundColor: s.color + "18" }}
                    >
                      <span role="img" aria-label={i18nT(s.label)}>
                        {i18nT(s.emoji)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-extrabold leading-snug truncate ${
                          isActive ? "text-emerald-900" : "text-stone-800 group-hover:text-emerald-800"
                        }`}
                      >
                        {i18nT(s.label)}
                      </p>
                      <p className="text-[11px] text-stone-500 truncate">{i18nT(s.desc)}</p>
                    </div>
                    <ChevronRight
                      className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5 ${
                        isActive ? "text-emerald-600" : "text-stone-300 group-hover:text-emerald-600"
                      }`}
                    />
                  </Link>
                );
              })
            )}

            {/* Botão de instalação da app no smartphone */}
            {!isStandalone && (
              <div className="pt-2 pb-2">
                <button
                  onClick={() => {
                    setOpen(false);
                    if (hasPrompt) {
                      triggerInstall();
                    } else {
                      setShowIOSModal(true);
                    }
                  }}
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 text-white shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-[0.98] text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight">{i18nT("Instalar no Telemóvel")}</p>
                    <p className="text-xs text-white/80">{i18nT("Ícone oficial no ecrã inicial")}</p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {showIOSModal && <IOSInstructionsModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
}
