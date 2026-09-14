import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Sparkles } from "lucide-react";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import ProSubscriptionView from "@/components/subscription/ProSubscriptionView";
import { useSubscription } from "@/lib/subscription";

export default function HortaVivaPro() {
  const { isPro } = useSubscription();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-green-50/40 to-lime-50/50">
      {/* Cabeçalho */}
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-emerald-50/60 to-white/90 backdrop-blur-lg border-b border-emerald-100/60">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <Link 
              to="/" 
              className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm"
              aria-label="Voltar"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-300/50 text-white font-black text-lg">
              ⭐
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-stone-800 leading-none truncate">Horta Viva Pro</h1>
              <p className="text-xs text-stone-500 truncate">Acesso ilimitado a fotos, plantações e animais</p>
            </div>
            <span
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border shadow-xs ${
                isPro 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-amber-50 text-amber-800 border-amber-300"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isPro ? "Ativo" : "2,99€ / mês"}</span>
            </span>
            <NavigationDrawer />
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <ProSubscriptionView />
      </main>

      {/* Rodapé */}
      <footer className="text-center pt-2 pb-28 text-xs">
        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-medium">
          🌱 Horta Viva — Cultiva com sabedoria
        </span>
      </footer>
    </div>
  );
}
