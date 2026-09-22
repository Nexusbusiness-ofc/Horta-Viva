import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, Smartphone } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { usePWAInstall, IOSInstructionsModal } from "@/components/pwa/InstallPrompt";

const SECTIONS = [
  { to: "/", emoji: "🏡", label: "Início", desc: "Página principal e catálogo", color: "#16a34a" },
  { to: "/tarefas-hoje", emoji: "📋", label: "Tarefas de hoje", desc: "Rega, podas e animais", color: "#0d9488" },
  { to: "/minha-quinta", emoji: "🌱", label: "Minha Quinta", desc: "As tuas plantações", color: "#16a34a" },
  { to: "/perfil", emoji: "👨‍🌾", label: "O meu perfil", desc: "Foto e dados da quinta", color: "#9333ea" },
  { to: "/pro", emoji: "⭐", label: "Horta Viva Pro", desc: "Planos a partir de 1,99€/mês", color: "#f59e0b" },
  { to: "/resumo-mensal", emoji: "📊", label: "Resumo mensal", desc: "Visão geral do mês", color: "#4f46e5" },
  { to: "/calendario-curas", emoji: "🌿", label: "Curas & Tratamentos", desc: "Produtos fitofarmacêuticos", color: "#7c3aed" },
  { to: "/podas-mondas", emoji: "✂️", label: "Podas & Mondas", desc: "Guias de poda e monda", color: "#15803d" },
  { to: "/animais", emoji: "🐔", label: "Animais da Quinta", desc: "Criação de animais", color: "#ea580c" },
  { to: "/cogumelos", emoji: "🍄", label: "Cogumelos", desc: "Catálogo micológico", color: "#d97706" },
  { to: "/identificar", emoji: "📸", label: "Identificar Planta", desc: "Tira foto e descobre", color: "#0891b2" },
];

export default function NavigationDrawer({ trigger, triggerClassName, triggerIcon }) {
  const [open, setOpen] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const { isStandalone, hasPrompt, triggerInstall } = usePWAInstall();

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {trigger || (
            <button
              className={triggerClassName || "shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-stone-200 text-stone-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors shadow-sm"}
              aria-label="Menu de secções"
            >
              {triggerIcon || <Menu className="w-6 h-6" />}
            </button>
          )}
        </SheetTrigger>
        <SheetContent side="left" className="w-[290px] sm:w-[330px] p-0 flex flex-col">
          <SheetHeader className="px-5 pt-5 pb-3 border-b border-stone-100 flex flex-row items-center gap-3 shrink-0">
            <img src="./icons/icon-192x192.png" alt="Horta Viva" className="w-10 h-10 rounded-xl object-cover shadow-sm border border-stone-200/60 shrink-0" />
            <div>
              <SheetTitle className="text-left text-lg font-bold text-stone-800 leading-tight">Horta Viva</SheetTitle>
              <p className="text-xs text-stone-500 text-left">Menu & Secções</p>
            </div>
          </SheetHeader>
          <div className="p-3 space-y-1.5 overflow-y-auto flex-1">
            {SECTIONS.map(s => {
              return (
                <Link
                  key={s.to}
                  to={s.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3.5 rounded-2xl p-3 hover:bg-stone-50 active:scale-[0.98] transition-all min-h-[56px]"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 text-2xl shadow-sm"
                    style={{ backgroundColor: s.color + "18" }}
                  >
                    <span role="img" aria-label={s.label}>{s.emoji}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base font-semibold text-stone-800 leading-snug">{s.label}</p>
                    <p className="text-xs text-stone-400 truncate">{s.desc}</p>
                  </div>
                </Link>
              );
            })}

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
                  className="w-full flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-[0.98] text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold leading-tight">Instalar no Telemóvel</p>
                    <p className="text-xs text-white/80">Ícone oficial no ecrã inicial</p>
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