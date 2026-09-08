import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import ProfileForm from "./ProfileForm";

export default function OnboardingProfile() {
  const { user, checkUserAuth } = useAuth();
  const [open, setOpen] = useState(() => sessionStorage.getItem("hv_onboarded_skip") !== "1");

  if (!user) return null;
  // Só mostra se o perfil ainda não foi completado
  if (user.farm_name) return null;
  if (!open) return null;

  const skip = () => {
    sessionStorage.setItem("hv_onboarded_skip", "1");
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl animate-in slide-in-from-bottom duration-300">
        <div className="px-6 pt-8 pb-5 bg-gradient-to-br from-emerald-500 via-green-600 to-teal-700 text-white sm:rounded-t-3xl">
          <h2 className="text-2xl font-bold">Bem-vindo à Minha Horta! 🌱</h2>
          <p className="text-sm text-white/90 mt-1">Completa o teu perfil para personalizares a app e garantires que os teus dados ficam bem guardados na tua conta.</p>
        </div>
        <div className="p-6">
          <ProfileForm user={user} onSaved={async () => { await checkUserAuth(); setOpen(false); }} />
          <button onClick={skip} className="w-full text-center text-xs text-stone-400 hover:text-stone-600 mt-3">
            Prefiro fazer mais tarde
          </button>
        </div>
      </div>
    </div>
  );
}