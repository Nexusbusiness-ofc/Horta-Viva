import { useI18n } from "@/lib/I18nContext";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ClipboardList, Home, Sprout, UserRound } from "lucide-react";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Início",
    icon: Home
  },
  {
    to: "/tarefas-hoje",
    label: "Tarefas",
    icon: ClipboardList
  },
  {
    to: "/minha-quinta",
    label: "Quinta",
    icon: Sprout
  },
  {
    to: "/perfil",
    label: "Perfil",
    icon: UserRound
  }
];

const HIDDEN_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password", "/oauth-consent"];
const CENTER_LOGO_URL = `${import.meta.env.BASE_URL}images/horta-viva-logo.png`;

export default function BottomNav() {
  const {
    t: i18nT
  } = useI18n();
  const location = useLocation();
  if (HIDDEN_ROUTES.includes(location.pathname)) {
    return null;
  }

  const renderNavItem = item => {
    const isActive = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
    const Icon = item.icon;
    return (
      <Link
        key={item.to}
        to={item.to}
        aria-current={isActive ? "page" : undefined}
        className={`group relative flex h-full min-w-0 flex-col items-center justify-center gap-1 px-1 transition-all duration-200 active:scale-95 ${
          isActive ? "text-emerald-800" : "text-stone-500 hover:text-emerald-700"
        }`}
      >
        {isActive && (
          <span className="absolute top-1.5 h-1 w-6 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600" />
        )}
        <div
          className={`flex items-center justify-center rounded-2xl px-3 py-1 transition-all duration-200 ${
            isActive ? "bg-emerald-100/90 text-emerald-800 shadow-2xs" : "group-hover:bg-stone-100/70"
          }`}
        >
          <Icon
            className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
              isActive ? "stroke-[2.6]" : "stroke-2"
            }`}
            aria-hidden="true"
          />
        </div>
        <span className={`text-[10px] leading-none sm:text-[11px] ${isActive ? "font-extrabold" : "font-semibold"}`}>
          {i18nT(item.label)}
        </span>
      </Link>
    );
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 select-none px-0 sm:px-4 md:pb-3">
      <nav
        aria-label={i18nT("Navegação rápida")}
        className="pointer-events-auto h-[74px] w-full md:max-w-xl md:mx-auto md:rounded-3xl md:border md:border-emerald-950/15 md:shadow-[0_12px_40px_rgba(6,78,59,0.20)] border-t border-emerald-950/10 bg-white/95 shadow-[0_-8px_25px_rgba(6,78,59,0.12)] backdrop-blur-xl transition-all"
      >
        <div className="grid h-full grid-cols-[1fr_1fr_76px_1fr_1fr]">
          {i18nT(NAV_ITEMS.slice(0, 2).map(renderNavItem))}
          <Link to="/" aria-label={i18nT("Horta Viva - Início")} className="group relative flex items-center justify-center">
            <img
              src={CENTER_LOGO_URL}
              alt=""
              className="absolute bottom-5 h-[104px] w-[104px] object-contain drop-shadow-[0_8px_14px_rgba(6,78,59,0.28)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
            />
          </Link>
          {i18nT(NAV_ITEMS.slice(2).map(renderNavItem))}
        </div>
      </nav>
    </div>
  );
}
