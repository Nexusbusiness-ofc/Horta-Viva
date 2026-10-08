import { useI18n } from '@/lib/I18nContext';
import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { Link } from "react-router-dom";
import { ArrowLeft, LogOut, Mail, Sprout, Cloud, Sparkles, ArrowRight } from "lucide-react";
import ProfileForm from "@/components/profile/ProfileForm";
import SyncBackupModal from "@/components/quinta/SyncBackupModal";
import { isGoogleConnected } from "@/lib/googleSync";
import NavigationDrawer from "@/components/home/NavigationDrawer";
import { useSubscription, resetSubscriptionToFree } from "@/lib/subscription";
import { useToast } from "@/components/ui/use-toast";

export default function Perfil() {
  const { t } = useI18n();
  const { user, checkUserAuth, logout, navigateToLogin } = useAuth();
  const { isUltra, isPro, isPlus } = useSubscription();
  const { toast } = useToast();
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [isGoogleLinked, setIsGoogleLinked] = useState(isGoogleConnected());

  React.useEffect(() => {
    const handleSync = () => setIsGoogleLinked(isGoogleConnected());
    window.addEventListener("hortaviva_sync_change", handleSync);
    if (!user) {
      checkUserAuth();
    }
    return () => window.removeEventListener("hortaviva_sync_change", handleSync);
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-green-50/40 to-lime-50/50">
        <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-emerald-50/60 to-white/90 backdrop-blur-lg border-b border-emerald-100/60">
          <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex-1">
                <h1 className="text-xl font-bold text-stone-800 leading-none">{t("O meu perfil")}</h1>
                <p className="text-xs text-stone-500">{t("Personaliza a tua experiência")}</p>
              </div>
              <NavigationDrawer />
            </div>
          </div>
        </header>
        <main className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-28">
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-lg font-semibold text-stone-700 mb-1">Inicia sessão para veres o teu perfil</h2>
            <p className="text-sm text-stone-500 mb-6">Entra ou cria uma conta para guardares os dados da tua quinta e personalizares a experiência.</p>
            <Link
              to="/login?from_url=/perfil"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-medium px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all active:scale-95"
            >
              Entrar / Inscrever-se
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const avatarEmoji = user.avatar_emoji || "🌱";

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-br from-emerald-50 via-green-50/40 to-lime-50/50">
      <header className="sticky top-0 z-30 bg-gradient-to-r from-white/90 via-emerald-50/60 to-white/90 backdrop-blur-lg border-b border-emerald-100/60">
        <div className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <Link to="/" className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-500 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-stone-800 leading-none">{t("O meu perfil")}</h1>
              <p className="text-xs text-stone-500">{t("Personaliza a tua experiência")}</p>
            </div>
            <NavigationDrawer />
          </div>
        </div>
      </header>

      <main className="max-w-4xl lg:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-6">
        {/* Cartão de identidade */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 px-6 py-8 flex flex-col items-center text-white">
            <div className="w-24 h-24 rounded-full overflow-hidden bg-white/20 border-4 border-white shadow-lg flex items-center justify-center">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-5xl">{avatarEmoji}</span>
              )}
            </div>
            <h2 className="text-xl font-bold mt-3">{user.full_name || "Agricultor"}</h2>
            <p className="text-sm text-white/90 flex items-center gap-1 mt-0.5">
              <Mail className="w-3.5 h-3.5" /> {user.email}
            </p>
            {user.farm_name && (
              <p className="text-sm text-white/90 flex items-center gap-1 mt-0.5">
                <Sprout className="w-3.5 h-3.5" /> {user.farm_name}
              </p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-3 p-4 text-center">
            <div>
              <p className="text-xs text-stone-400">{t("Tipo")}</p>
              <p className="text-sm font-semibold text-stone-700 truncate">{t(user.farmer_type || "—")}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">{t("Experiência")}</p>
              <p className="text-sm font-semibold text-stone-700">{user.experience_years || 0} {t("anos")}</p>
            </div>
            <div>
              <p className="text-xs text-stone-400">{t("Estação favorita")}</p>
              <p className="text-sm font-semibold text-stone-700 truncate">{t(user.favorite_season || "—")}</p>
            </div>
          </div>
        </div>

        <Link to="/definicoes" className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-white p-5 text-sm font-bold text-emerald-800"><span>⚙️ Região, meteorologia e aparência</span><ArrowRight className="h-4 w-4" /></Link>
        {/* Formulário de edição */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-5">
          <h3 className="text-sm font-bold text-stone-700 mb-4">{t("Editar perfil")}</h3>
          <ProfileForm user={user} onSaved={checkUserAuth} />
        </div>

        {/* Subscrição Horta Viva */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                ⭐
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">
                  {isUltra ? "Horta Viva Ultra" : isPro ? "Horta Viva Pro" : isPlus ? "Horta Viva Plus" : "Plano Gratuito"}
                </h3>
                <p className="text-xs text-stone-500">
                  {isUltra
                    ? "Acesso infinito ativo (3,99€/mês)"
                    : isPro
                    ? "Plano Pro ativo (2,99€/mês)"
                    : isPlus
                    ? "Plano Plus ativo (1,99€/mês)"
                    : "Plano Base gratuito"}
                </p>
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                isUltra
                  ? "bg-purple-100 text-purple-800 border-purple-300"
                  : isPro
                  ? "bg-amber-100 text-amber-800 border-amber-300"
                  : isPlus
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-stone-100 text-stone-700 border-stone-300"
              }`}
            >
              {isUltra ? "Ultra Ativo" : isPro ? "Pro Ativo" : isPlus ? "Plus (1,99€)" : "Plano Base"}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            {isUltra
              ? "Tens acesso ilimitado e infinito a conversas com IA, fotos, plantações e animais na Minha Quinta, resumo detalhado e esquemas 3D/2D."
              : isPro
              ? "O teu plano Pro inclui conversas com IA ilimitadas, até 8 plantações, 7 animais, 15 fotos/mês, resumo detalhado e esquemas 3D/2D."
              : isPlus
              ? "O teu plano Plus inclui 20 chats IA/mês, até 5 plantações, 4 animais, 10 fotos IA/mês, resumo encurtado e esquemas 2D."
              : "No plano gratuito tens 10 chats IA/mês, 3 plantações, 2 animais e 3 fotos IA/mês. Escolhe Plus (1,99€), Pro (2,99€) ou Ultra (3,99€)."}
          </p>

          <Link
            to="/pro"
            className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md shadow-amber-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isUltra ? "Ver Detalhes do Plano Ultra" : isPro ? "Ver Detalhes do Plano Pro / Upgrade Ultra" : isPlus ? "Ver e Gerir Planos / Upgrade Pro" : "Ver e Escolher Plano (a partir de 1,99€)"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          {(isUltra || isPro || isPlus) && (
            <button
              type="button"
              onClick={async () => {
                if (window.confirm("Tens a certeza de que pretendes repor esta conta para o Plano Base Gratuito? A subscrição desta conta e a respetiva cópia no Google Drive serão removidas.")) {
                  await resetSubscriptionToFree();
                  toast({
                    title: "Plano Base Reposto ✅",
                    description: "Esta conta está agora no Plano Base Gratuito.",
                  });
                }
              }}
              className="w-full text-stone-500 hover:text-red-600 text-[11px] font-medium py-1.5 transition-colors text-center block"
            >
              Repor Plano Base Gratuito nesta Conta
            </button>
          )}
        </div>

        {/* Sincronização Google Drive & Cópia de Segurança */}
        <div className="bg-white rounded-3xl border border-stone-200/80 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">Sincronização & Dispositivos</h3>
                <p className="text-xs text-stone-500">Google Drive e cópias de segurança portáteis</p>
              </div>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                isGoogleLinked
                  ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                  : "bg-stone-100 text-stone-600 border-stone-200"
              }`}
            >
              {isGoogleLinked ? "Google Drive Ativo" : "Modo Local"}
            </span>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed">
            Mantém o perfil, a região, a língua, a aparência, as plantações e os animais sincronizados entre dispositivos através da tua conta Google Drive, ou transfere os dados através de ficheiro.
          </p>

          <button
            type="button"
            onClick={() => setShowSyncModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 font-semibold text-xs py-2.5 rounded-xl transition-all shadow-sm"
          >
            <Cloud className="w-4 h-4 text-emerald-600" />
            Gerir Sincronização com Google Drive e Cópias
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          className="w-full flex items-center justify-center gap-2 bg-white border border-stone-200 text-stone-600 font-medium py-3 rounded-xl hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Terminar sessão
        </button>
      </main>

      <footer className="text-center pt-4 pb-28 text-xs">
        <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent font-medium">
          🌱 Minha Horta — Cultiva com sabedoria
        </span>
      </footer>

      <SyncBackupModal
        isOpen={showSyncModal}
        onClose={() => setShowSyncModal(false)}
        onDataChanged={checkUserAuth}
      />
    </div>
  );
}