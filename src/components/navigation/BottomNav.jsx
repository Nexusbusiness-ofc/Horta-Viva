import React from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Início",
    emoji: "🏡",
  },
  {
    to: "/tarefas-hoje",
    label: "Tarefas",
    emoji: "📋",
  },
  {
    to: "/minha-quinta",
    label: "Quinta",
    emoji: "🌱",
  },
  {
    to: "/perfil",
    label: "Perfil",
    emoji: "👨‍🌾",
  },
];

const HIDDEN_ROUTES = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/oauth-consent",
];

export default function BottomNav() {
  const location = useLocation();

  if (HIDDEN_ROUTES.includes(location.pathname)) {
    return null;
  }

  return (
    <div className="fixed bottom-3 sm:bottom-4 inset-x-0 z-40 flex justify-center px-3 sm:px-4 pointer-events-none select-none">
      <nav
        aria-label="Navegação rápida"
        className="pointer-events-auto flex items-center justify-around w-full max-w-md bg-white/92 backdrop-blur-xl border border-emerald-200/70 shadow-2xl shadow-emerald-950/20 rounded-3xl p-1.5 sm:p-2 ring-1 ring-emerald-900/5 transition-all duration-300"
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === "/"
              ? location.pathname === "/"
              : location.pathname.startsWith(item.to);

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1.5 sm:px-2 rounded-2xl transition-all duration-200 active:scale-95 group ${
                isActive
                  ? "bg-gradient-to-br from-emerald-600 via-green-600 to-emerald-700 text-white shadow-md shadow-emerald-600/35 font-bold scale-[1.02]"
                  : "text-stone-500 hover:text-emerald-700 hover:bg-emerald-50/70 font-medium"
              }`}
            >
              <span
                className={`text-xl sm:text-2xl transition-transform duration-200 ${
                  isActive
                    ? "scale-110 drop-shadow-sm"
                    : "opacity-85 group-hover:scale-110 group-hover:opacity-100"
                }`}
                role="img"
                aria-label={item.label}
              >
                {item.emoji}
              </span>
              <span
                className={`text-[11px] sm:text-xs leading-tight tracking-tight mt-0.5 ${
                  isActive ? "text-white font-bold" : "text-stone-600 font-semibold"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
