import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

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
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App