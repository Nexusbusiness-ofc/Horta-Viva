import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ClipboardList, Home, Sprout, UserRound } from "lucide-react";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Início",
    icon: Home,
  },
  {
    to: "/tarefas-hoje",
    label: "Tarefas",
    icon: ClipboardList,
  },
  {
    to: "/minha-quinta",
    label: "Quinta",
    icon: Sprout,
  },
  {
    to: "/perfil",
    label: "Perfil",
    icon: UserRound,
  },
];

const HIDDEN_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/oauth-consent",
];

const CENTER_LOGO_URL = `${import.meta.env.BASE_URL}images/horta-viva-logo.png`;

export default function BottomNav() {
  const location = useLocation();

  if (HIDDEN_ROUTES.includes(location.pathname)) {
    return null;
  }

  const renderNavItem = (item) => {
    const isActive =
      item.to === "/"
        ? location.pathname === "/"
        : location.pathname.startsWith(item.to);
    const Icon = item.icon;

    return (
      <Link
        key={item.to}
        to={item.to}
        aria-current={isActive ? "page" : undefined}
        className={`group relative flex h-full min-w-0 flex-col items-center justify-center gap-1 px-1 transition-all duration-200 active:scale-95 ${
          isActive
            ? "text-emerald-700"
            : "text-stone-500 hover:text-emerald-700"
        }`}
      >
        <Icon
          className={`h-5 w-5 transition-transform duration-200 group-hover:scale-110 ${
            isActive ? "stroke-[2.5]" : "stroke-2"
          }`}
          aria-hidden="true"
        />
        <span className="text-[10px] font-semibold leading-none sm:text-[11px]">
          {item.label}
        </span>
      </Link>
    );
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 select-none">
      <nav
        aria-label="Navegação rápida"
        className="pointer-events-auto h-[74px] w-full border-t border-emerald-950/10 bg-white/85 shadow-[0_-6px_20px_rgba(20,83,45,0.10)] backdrop-blur-xl"
      >
        <div className="grid h-full grid-cols-[1fr_1fr_76px_1fr_1fr]">
          {NAV_ITEMS.slice(0, 2).map(renderNavItem)}
          <Link
            to="/"
            aria-label="Horta Viva - Início"
            className="group relative flex items-center justify-center"
          >
            <img
              src={CENTER_LOGO_URL}
              alt=""
              className="absolute bottom-5 h-[104px] w-[104px] object-contain drop-shadow-[0_5px_8px_rgba(20,83,45,0.18)] transition-transform duration-200 group-hover:scale-105 group-active:scale-95"
            />
          </Link>
          {NAV_ITEMS.slice(2).map(renderNavItem)}
        </div>
      </nav>
    </div>
  );
}
