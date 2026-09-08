import React, { useState, useEffect } from "react";
import {
  X,
  Cloud,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Settings,
  HelpCircle,
  HardDrive,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import GoogleIcon from "@/components/GoogleIcon";
import { useToast } from "@/components/ui/use-toast";
import {
  isGoogleConnected,
  isGoogleConfigured,
  getGoogleClientId,
  setGoogleClientId,
  getGoogleUser,
  getLastSyncTime,
  connectGoogleDrive,
  disconnectGoogleDrive,
  uploadToGoogleDrive,
  downloadFromGoogleDrive,
} from "@/lib/googleSync";
import { exportFarmData, importFarmData } from "@/lib/localStorageStore";

export default function SyncBackupModal({ isOpen, onClose, onDataChanged }) {
  const [googleConnected, setGoogleConnected] = useState(isGoogleConnected());
  const [googleConfigured, setGoogleConfigured] = useState(isGoogleConfigured());
  const [googleUser, setGoogleUser] = useState(getGoogleUser());
  const [lastSync, setLastSync] = useState(getLastSyncTime());
  const [clientIdInput, setClientIdInput] = useState(getGoogleClientId());
  const [showConfig, setShowConfig] = useState(!isGoogleConfigured());
  const [loadingAction, setLoadingAction] = useState("");
  const [importSummary, setImportSummary] = useState(null);
  const [pendingImportData, setPendingImportData] = useState(null);

  const { toast } = useToast();

  const updateState = () => {
    setGoogleConnected(isGoogleConnected());
    setGoogleConfigured(isGoogleConfigured());
    setGoogleUser(getGoogleUser());
    setLastSync(getLastSyncTime());
  };

  useEffect(() => {
    updateState();
    const handleSyncChange = () => updateState();
    window.addEventListener("hortaviva_sync_change", handleSyncChange);
    return () => window.removeEventListener("hortaviva_sync_change", handleSyncChange);
  }, []);

  if (!isOpen) return null;

  const handleSaveClientId = () => {
    setGoogleClientId(clientIdInput);
    setGoogleConfigured(isGoogleConfigured());
    toast({
      title: "ID de Cliente guardado ✅",
      description: clientIdInput ? "ID configurado com sucesso." : "Configuração de ID limpa.",
    });
  };

  const handleConnectGoogle = async () => {
    if (!googleConfigured) {
      setShowConfig(true);
      toast({
        title: "Configuração necessária",
        description: "Introduz o teu Google Client ID abaixo para ativar a ligação ao Google Drive.",
        variant: "destructive",
      });
      return;
    }
    setLoadingAction("connecting");
    try {
      await connectGoogleDrive();
      updateState();
      toast({
        title: "Ligado com sucesso! 🎉",
        description: "A tua conta Google está ligada ao Google Drive.",
      });
      // Sincronizar automaticamente após ligar
      await uploadToGoogleDrive();
      updateState();
    } catch (e) {
      toast({
        title: "Não foi possível ligar ao Google",
        description: String(e?.message || e),
        variant: "destructive",
      });
    } finally {
      setLoadingAction("");
    }
  };

  const handleDisconnect = () => {
    disconnectGoogleDrive();
    updateState();
    toast({
      title: "Desconectado",
      description: "A ligação ao Google Drive foi terminada neste dispositivo.",
    });
  };

  const handleSyncToDrive = async () => {
    setLoadingAction("uploading");
    try {
      await uploadToGoogleDrive();
      updateState();
      toast({
        title: "Sincronizado com o Google Drive ✅",
        description: "As tuas plantações e animais foram guardados na nuvem.",
      });
    } catch (e) {
      toast({
        title: "Erro ao sincronizar",
        description: String(e?.message || e),
        variant: "destructive",
      });
    } finally {
      setLoadingAction("");
    }
  };

  const handleDownloadFromDrive = async () => {
    setLoadingAction("downloading");
    try {
      const res = await downloadFromGoogleDrive();
      if (res.notFound) {
        toast({
          title: "Sem ficheiro na nuvem",
          description: "Ainda não existe nenhuma cópia da quinta no teu Google Drive.",
        });
      } else {
        updateState();
        onDataChanged?.();
        toast({
          title: "Quinta carregada da nuvem! 🌾",
          description: `Restauradas ${res.plantingsCount} plantações e ${res.animalsCount} animais.`,
        });
      }
    } catch (e) {
      toast({
        title: "Erro ao descarregar da nuvem",
        description: String(e?.message || e),
        variant: "destructive",
      });
    } finally {
      setLoadingAction("");
    }
  };

  // Exportar backup local como ficheiro .json
  const handleExportFile = () => {
    try {
      const data = exportFarmData();
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data, null, 2))}`;
      const downloadAnchor = document.createElement("a");
      const dateStr = new Date().toISOString().split("T")[0];
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute("download", `horta_viva_backup_${dateStr}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast({
        title: "Cópia descarregada! 📦",
        description: "O ficheiro foi descarregado. Podes guardá-lo na Pen USB D:\\ ou partilhá-lo.",
      });
    } catch (e) {
      toast({
        title: "Erro ao exportar",
        description: String(e?.message || e),
        variant: "destructive",
      });
    }
  };

  // Selecionar ficheiro para importar
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed || typeof parsed !== "object") throw new Error("Ficheiro inválido");

        setPendingImportData(parsed);
        setImportSummary({
          plantings: parsed.plantings?.length || 0,
          animals: parsed.myAnimals?.length || 0,
          reminders: parsed.reminders?.length || 0,
          farmName: parsed.user?.farm_name || "Quinta",
          exportedAt: parsed.exportedAt || "Data desconhecida",
        });
      } catch (err) {
        toast({
          title: "Ficheiro inválido",
          description: "O ficheiro selecionado não é uma cópia de segurança válida da Horta Viva.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleConfirmImport = () => {
    if (!pendingImportData) return;
    try {
      const res = importFarmData(pendingImportData);
      setImportSummary(null);
      setPendingImportData(null);
      onDataChanged?.();
      toast({
        title: "Quinta restaurada com sucesso! 🌱",
        description: `Importadas ${res.plantingsCount} plantações e ${res.animalsCount} animais.`,
      });
    } catch (e) {
      toast({
        title: "Erro ao importar",
        description: String(e?.message || e),
        variant: "destructive",
      });
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-xl sm:rounded-3xl rounded-t-3xl max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl animate-in slide-in-from-bottom duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur border-b border-stone-100 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-200/50">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-800">Sincronização & Dispositivos</h2>
              <p className="text-xs text-stone-500">Mantém a tua quinta entre o PC, telemóvel e tablet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* SECÇÃO 1: GOOGLE DRIVE SYNC */}
          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <GoogleIcon className="w-6 h-6 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-stone-800">Sincronização com Google Drive</h3>
                  <p className="text-xs text-stone-500">
                    Guarda a tua quinta na tua própria conta Google na nuvem
                  </p>
                </div>
              </div>
              {googleConnected ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Ligado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                  Offline
                </span>
              )}
            </div>

            {googleConnected && googleUser && (
              <div className="flex items-center gap-3 bg-white rounded-xl p-3 border border-stone-200/70">
                {googleUser.picture ? (
                  <img
                    src={googleUser.picture}
                    alt={googleUser.name}
                    className="w-10 h-10 rounded-full border border-stone-200 object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    {googleUser.name?.[0] || "G"}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-stone-800 truncate">{googleUser.name}</p>
                  <p className="text-xs text-stone-500 truncate">{googleUser.email}</p>
                  {lastSync && (
                    <p className="text-[11px] text-stone-400 mt-0.5">
                      Última sincronização: {new Date(lastSync).toLocaleString("pt-PT")}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Ações Google Drive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {!googleConnected ? (
                <button
                  onClick={handleConnectGoogle}
                  disabled={loadingAction === "connecting"}
                  className="sm:col-span-2 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 text-white text-sm font-medium py-2.5 px-4 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                >
                  <GoogleIcon className="w-4 h-4" />
                  {loadingAction === "connecting"
                    ? "A abrir autorização Google..."
                    : "Ligar à Conta Google (Google Drive)"}
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSyncToDrive}
                    disabled={loadingAction === "uploading"}
                    className="flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-2.5 px-3 rounded-xl shadow-sm transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${loadingAction === "uploading" ? "animate-spin" : ""}`} />
                    {loadingAction === "uploading" ? "A enviar..." : "Enviar para Nuvem"}
                  </button>

                  <button
                    onClick={handleDownloadFromDrive}
                    disabled={loadingAction === "downloading"}
                    className="flex items-center justify-center gap-1.5 bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold py-2.5 px-3 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <Download className={`w-3.5 h-3.5 ${loadingAction === "downloading" ? "animate-spin" : ""}`} />
                    {loadingAction === "downloading" ? "A carregar..." : "Carregar da Nuvem"}
                  </button>

                  <button
                    onClick={handleDisconnect}
                    className="sm:col-span-2 text-xs text-stone-400 hover:text-red-500 py-1 text-center"
                  >
                    Desconectar conta Google deste dispositivo
                  </button>
                </>
              )}
            </div>

            {/* Configuração do Google Client ID (Colapsável) */}
            <div className="border-t border-stone-200/60 pt-3">
              <button
                type="button"
                onClick={() => setShowConfig(!showConfig)}
                className="w-full flex items-center justify-between text-xs font-medium text-stone-600 hover:text-emerald-700"
              >
                <span className="flex items-center gap-1.5">
                  <Settings className="w-3.5 h-3.5" />
                  Configurar Google Client ID
                </span>
                {showConfig ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showConfig && (
                <div className="mt-3 space-y-3 bg-white p-3 rounded-xl border border-stone-200/70 text-xs">
                  <div className="space-y-1">
                    <label className="font-semibold text-stone-700 block">ID de Cliente OAuth 2.0 Google</label>
                    <input
                      type="text"
                      placeholder="ex: 123456789-abc.apps.googleusercontent.com"
                      value={clientIdInput}
                      onChange={(e) => setClientIdInput(e.target.value)}
                      className="w-full bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-2 text-xs outline-none focus:ring-2 focus:ring-emerald-300 font-mono"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={handleSaveClientId}
                      className="bg-emerald-600 text-white font-medium px-3 py-1.5 rounded-lg hover:bg-emerald-700 text-xs"
                    >
                      Guardar ID
                    </button>
                  </div>

                  <div className="rounded-lg bg-emerald-50/70 p-2.5 text-[11px] text-emerald-900 leading-relaxed space-y-1">
                    <p className="font-semibold flex items-center gap-1">
                      <HelpCircle className="w-3 h-3 text-emerald-700" /> Como obter um Client ID gratuito no Google:
                    </p>
                    <ol className="list-decimal list-inside space-y-0.5 text-stone-600 pl-1">
                      <li>Acede a <strong>console.cloud.google.com</strong> e cria um projeto.</li>
                      <li>Em <strong>APIs e Serviços → Credenciais</strong>, clica em <em>Criar Credenciais → ID do cliente OAuth</em>.</li>
                      <li>Tipo de aplicação: <em>Aplicação Web</em>.</li>
                      <li>Adiciona a origem: <code className="bg-emerald-100 px-1 rounded">http://localhost:5173</code>.</li>
                      <li>Copia o Client ID gerado e cola-o aqui em cima.</li>
                    </ol>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECÇÃO 2: CÓPIA DE SEGURANÇA PORTÁTIL (100% OFFLINE / PEN DRIVE) */}
          <div className="rounded-2xl border border-stone-200/80 bg-stone-50/50 p-4 space-y-3">
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-stone-800">Cópia de Segurança Portátil (Pen Drive / Ficheiro)</h3>
                <p className="text-xs text-stone-500">
                  Não requer configuração de chaves de API nem internet. Funciona de imediato!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleExportFile}
                className="flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 border border-stone-300 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 text-xs font-semibold py-3 px-3 rounded-xl shadow-sm transition-all"
              >
                <Download className="w-4 h-4 text-emerald-600" />
                Exportar Quinta (Descarregar JSON)
              </button>

              <label className="cursor-pointer flex items-center justify-center gap-2 bg-white hover:bg-emerald-50 border border-stone-300 hover:border-emerald-300 text-stone-700 hover:text-emerald-800 text-xs font-semibold py-3 px-3 rounded-xl shadow-sm transition-all">
                <Upload className="w-4 h-4 text-emerald-600" />
                Importar Quinta (Carregar JSON)
                <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
              </label>
            </div>

            {/* Modal de confirmação de importação */}
            {importSummary && (
              <div className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2.5 text-xs animate-in fade-in">
                <div className="flex items-center gap-2 text-amber-800 font-bold">
                  <AlertTriangle className="w-4 h-4 text-amber-600" /> Confirmar Restauração da Quinta
                </div>
                <p className="text-stone-600 text-xs leading-relaxed">
                  O ficheiro contém os seguintes dados de <strong>{importSummary.farmName}</strong>:
                </p>
                <div className="grid grid-cols-3 gap-2 text-center bg-white/80 p-2 rounded-lg border border-amber-100">
                  <div>
                    <span className="font-bold text-stone-800 text-sm">{importSummary.plantings}</span>
                    <p className="text-[10px] text-stone-400">Plantações</p>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800 text-sm">{importSummary.animals}</span>
                    <p className="text-[10px] text-stone-400">Animais</p>
                  </div>
                  <div>
                    <span className="font-bold text-stone-800 text-sm">{importSummary.reminders}</span>
                    <p className="text-[10px] text-stone-400">Lembretes</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={handleConfirmImport}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-lg text-xs"
                  >
                    Sim, restaurar agora
                  </button>
                  <button
                    onClick={() => {
                      setImportSummary(null);
                      setPendingImportData(null);
                    }}
                    className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded-lg text-xs"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-100 px-6 py-3 flex items-center justify-between text-xs text-stone-500">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Os teus dados pertencem-te a 100%
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white border border-stone-200 hover:bg-stone-100 rounded-lg font-medium text-stone-700"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
