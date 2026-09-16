import React, { useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import LoadingScreen from './components/LoadingScreen';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import OAuthConsent from './pages/OAuthConsent';
// Add page imports here
import Home from './pages/Home';
import MinhaQuinta from './pages/MinhaQuinta';
import CalendarioCuras from './pages/CalendarioCuras';
import ResumoMensal from './pages/ResumoMensal';
import Cogumelos from './pages/Cogumelos';
import Animais from './pages/Animais';
import PodasMondas from './pages/PodasMondas';
import IdentificarPlanta from './pages/IdentificarPlanta';
import TarefasHoje from './pages/TarefasHoje';
import Perfil from './pages/Perfil';
import HortaVivaPro from './pages/HortaVivaPro';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import BottomNav from '@/components/navigation/BottomNav';
import BackToTopButton from '@/components/navigation/BackToTopButton';
import { isGoogleConnected, hasValidGoogleToken, autoSyncGoogleDrive } from '@/lib/googleSync';
import { activateProSubscription, activatePlusSubscription } from '@/lib/subscription';
import { useToast } from "@/components/ui/use-toast";

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const hash = window.location.hash || "";
    const search = window.location.search || "";
    if (hash.includes("payment=success") || search.includes("payment=success")) {
      const isPlusTier = hash.includes("tier=plus") || search.includes("tier=plus");
      if (isPlusTier) {
        activatePlusSubscription({ verified: true, source: "stripe_checkout" });
        toast({
          title: "🎉 Horta Viva Plus Ativado!",
          description: "O teu plano Plus (1,99€/mês) foi ativado com sucesso!",
        });
      } else {
        activateProSubscription({ verified: true, source: "stripe_checkout" });
        toast({
          title: "🎉 Horta Viva Pro Ativado!",
          description: "A tua subscrição Pro foi confirmada! Tens acesso ilimitado em todos os teus dispositivos.",
        });
      }
      if (isGoogleConnected()) {
        autoSyncGoogleDrive(false).catch(() => {});
      }
      try {
        if (window.history && window.history.replaceState) {
          const url = new URL(window.location.href);
          url.searchParams.delete("payment");
          url.searchParams.delete("tier");
          url.searchParams.delete("session_id");
          if (url.hash.includes("payment=success") || url.hash.includes("tier=")) {
            const hashParts = url.hash.split("?");
            if (hashParts.length > 1) {
              const hashParams = new URLSearchParams(hashParts[1]);
              hashParams.delete("payment");
              hashParams.delete("tier");
              hashParams.delete("session_id");
              const remaining = hashParams.toString();
              url.hash = hashParts[0] + (remaining ? "?" + remaining : "");
            }
          }
          window.history.replaceState(null, "", url.toString());
        }
      } catch (cleanErr) {
        console.warn("Erro ao limpar parâmetros de pagamento da URL:", cleanErr);
      }
    }
  }, [toast]);

  useEffect(() => {
    if (isGoogleConnected()) {
      autoSyncGoogleDrive(false).catch(() => {});
    }

    const handleFocus = () => {
      if (isGoogleConnected() && hasValidGoogleToken()) {
        autoSyncGoogleDrive(false).catch(() => {});
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && isGoogleConnected() && hasValidGoogleToken()) {
        autoSyncGoogleDrive(false).catch(() => {});
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const interval = setInterval(() => {
      if (document.visibilityState === "visible" && isGoogleConnected() && hasValidGoogleToken()) {
        autoSyncGoogleDrive(false).catch(() => {});
      }
    }, 45000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, []);

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return <LoadingScreen />;
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/oauth-consent" element={<OAuthConsent />} />
      <Route path="/" element={<Home />} />
      <Route path="/minha-quinta" element={<MinhaQuinta />} />
      <Route path="/calendario-curas" element={<CalendarioCuras />} />
      <Route path="/resumo-mensal" element={<ResumoMensal />} />
      <Route path="/cogumelos" element={<Cogumelos />} />
      <Route path="/animais" element={<Animais />} />
      <Route path="/podas-mondas" element={<PodasMondas />} />
      <Route path="/identificar" element={<IdentificarPlanta />} />
      <Route path="/tarefas-hoje" element={<TarefasHoje />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/pro" element={<HortaVivaPro />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <ScrollToTop />
          <AuthenticatedApp />
          <BottomNav />
          <BackToTopButton />
          <InstallPrompt />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App