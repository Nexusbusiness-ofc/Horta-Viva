import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Mail, Lock, Loader2, Sprout } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";

import { isGoogleConfigured, connectGoogleDrive, downloadFromGoogleDrive } from "@/lib/googleSync";

export default function Login() {
  const [searchParams] = useSearchParams();
  const fromUrl = searchParams.get("from_url") || searchParams.get("returnTo") || "/minha-quinta";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await base44.auth.loginViaEmailPassword(email, password);
      window.location.href = fromUrl;
    } catch (err) {
      setError(err.message || "Email ou palavra-passe inválidos");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    if (isGoogleConfigured()) {
      setLoading(true);
      try {
        await connectGoogleDrive();
        try {
          await downloadFromGoogleDrive();
        } catch {}
        window.location.href = fromUrl;
        return;
      } catch (err) {
        console.warn("Google Drive OAuth falhou ou cancelado, fallback:", err);
      } finally {
        setLoading(false);
      }
    }
    base44.auth.loginWithProvider("google", fromUrl);
  };

  const handleGuest = () => {
    base44.auth.loginAsGuest(fromUrl);
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="Bem-vindo à Minha Horta"
      subtitle="Inicia sessão para guardares as tuas plantações e animais"
      footer={
        <>
          Ainda não tens conta?{" "}
          <Link to="/register" className="text-emerald-700 font-medium hover:underline">
            Criar uma conta
          </Link>
        </>
      }
    >
      <div className="space-y-3 mb-6">
        <Button
          variant="outline"
          className="w-full h-12 text-sm font-medium border-stone-200 hover:bg-stone-50"
          onClick={handleGoogle}
        >
          <GoogleIcon className="w-5 h-5 mr-2" />
          Continuar com o Google
        </Button>

        <Button
          type="button"
          variant="secondary"
          className="w-full h-12 text-sm font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-sm"
          onClick={handleGuest}
        >
          <Sprout className="w-4 h-4 mr-2 text-emerald-600" />
          Entrar em Modo Local (Minha Quinta)
        </Button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground">ou com email</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="o-teu-email@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Palavra-passe</Label>
            <Link to="/forgot-password" className="text-xs text-emerald-700 hover:underline">
              Esqueceste-te da palavra-passe?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full h-12 font-medium bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white" disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              A iniciar sessão...
            </>
          ) : (
            "Iniciar sessão"
          )}
        </Button>
      </form>
    </AuthLayout>
  );
}

