import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { IconResumo, IconQuinta, IconCuras, IconPodas, IconAnimais, IconCogumelos, IconIdentificar, IconTarefas, IconPerfil } from "@/components/home/SectionIcons";

const SECTIONS = [
  { to: "/tarefas-hoje", icon: IconTarefas, label: "Tarefas de hoje", desc: "Rega, podas e animais", color: "#0d9488" },
  { to: "/resumo-mensal", icon: IconResumo, label: "Resumo mensal", desc: "Visão geral do mês", color: "#4f46e5" },
  { to: "/minha-quinta", icon: IconQuinta, label: "Minha Quinta", desc: "As tuas plantações", color: "#16a34a" },
  { to: "/calendario-curas", icon: IconCuras, label: "Curas & Tratamentos", desc: "Produtos fitofarmacêuticos", color: "#7c3aed" },
  { to: "/podas-mondas", icon: IconPodas, label: "Podas & Mondas", desc: "Guias de poda e monda", color: "#15803d" },
  { to: "/animais", icon: IconAnimais, label: "Animais", desc: "Criação de animais", color: "#ea580c" },
  { to: "/cogumelos", icon: IconCogumelos, label: "Cogumelos", desc: "Catálogo micológico", color: "#d97706" },
  { to: "/identificar", icon: IconIdentificar, label: "Identificar Planta", desc: "Tira foto e descobre", color: "#0891b2" },
  { to: "/perfil", icon: IconPerfil, label: "O meu perfil", desc: "Foto e dados da quinta", color: "#9333ea" },
];

export default function NavigationDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-white border border-stone-200 text-stone-600 hover:border-emerald-300 hover:text-emerald-600 transition-colors shadow-sm"
          aria-label="Menu de secções"
        >
          <Menu className="w-6 h-6" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] sm:w-[320px] p-0">
        <SheetHeader className="px-5 pt-5 pb-3 border-b border-stone-100">
          <SheetTitle className="text-left text-lg font-bold text-stone-800">Minha Horta</SheetTitle>
          <p className="text-xs text-stone-500 text-left">Escolhe uma secção</p>
        </SheetHeader>
        <div className="p-3 space-y-2 overflow-y-auto">
          {SECTIONS.map(s => {
            const Icon = s.icon;
            return (
              <Link
                key={s.to}
                to={s.to}
                onClick={() => setOpen(false)}
                className="flex items-center gap-4 rounded-2xl p-4 hover:bg-stone-50 active:scale-[0.98] transition-all min-h-[60px]"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: s.color + "15", color: s.color }}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-stone-800">{s.label}</p>
                  <p className="text-xs text-stone-400">{s.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}