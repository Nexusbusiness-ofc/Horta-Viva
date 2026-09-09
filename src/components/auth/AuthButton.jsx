import React from "react";
import { Link } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

export default function AuthButton({ className = "" }) {
  const { isAuthenticated, user, navigateToLogin } = useAuth();

  if (isAuthenticated && user) {
    return (
      <Link
        to="/perfil"
        className={`shrink-0 w-11 h-11 rounded-xl bg-white border border-stone-200 flex items-center justify-center overflow-hidden shadow-sm hover:border-emerald-300 transition-colors ${className}`}
        title={`O meu perfil (${user.full_name || "Agricultor"})`}
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt="perfil" className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl">{user.avatar_emoji || "🌾"}</span>
        )}
      </Link>
    );
  }

  return (
    <button
      onClick={navigateToLogin}
      className={`shrink-0 flex items-center gap-1.5 bg-white border border-stone-200 text-stone-700 text-sm font-medium px-3 sm:px-4 py-2 rounded-xl shadow-sm hover:border-emerald-300 hover:text-emerald-600 transition-colors ${className}`}
      title="Entrar ou inscrever-se"
    >
      <LogIn className="w-4 h-4" />
      <span className="hidden sm:inline">Entrar</span>
    </button>
  );
}