import React, { useState, useEffect } from "react";
import { Download, X, Share2, PlusSquare, Smartphone, Check } from "lucide-react";

// Estado global para guardar o evento de instalação capturado
let globalDeferredPrompt = null;
const listeners = new Set();

if (typeof window !== "undefined") {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    globalDeferredPrompt = e;
    listeners.forEach(fn => fn(globalDeferredPrompt));
  });

  window.addEventListener("appinstalled", () => {
    globalDeferredPrompt = null;
    listeners.forEach(fn => fn(null));
  });
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(globalDeferredPrompt);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Verificar se já está a correr como app instalada
    const standalone = window.matchMedia("(display-mode: standalone)").matches || 
      window.navigator.standalone === true;
    setIsStandalone(standalone);

    // Deteção de iOS (Safari)
    const userAgent = window.navigator.userAgent || "";
    const isApple = /iPad|iPhone|iPod/.test(userAgent) && !window.MSStream;
    setIsIOS(isApple);

    const updatePrompt = (p) => setDeferredPrompt(p);
    listeners.add(updatePrompt);
    return () => listeners.delete(updatePrompt);
  }, []);

  const triggerInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        globalDeferredPrompt = null;
        setDeferredPrompt(null);
      }
      return outcome;
    }
    return null;
  };

  return {
    isInstallable: !isStandalone && (!!deferredPrompt || isIOS),
    isStandalone,
    isIOS,
    hasPrompt: !!deferredPrompt,
    triggerInstall,
  };
}

export default function InstallPrompt() {
  const { isInstallable, isStandalone, isIOS, hasPrompt, triggerInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("hv_pwa_dismissed") === "true") {
        setDismissed(true);
      }
    } catch {}
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem("hv_pwa_dismissed", "true");
    } catch {}
  };

  const handleInstallClick = async () => {
    if (hasPrompt) {
      await triggerInstall();
    } else if (isIOS) {
      setShowIOSModal(true);
    }
  };

  if (isStandalone || dismissed || !isInstallable) {
    return showIOSModal ? (
      <IOSInstructionsModal onClose={() => setShowIOSModal(false)} />
    ) : null;
  }

  return (
    <>
      {/* Banner flutuante no fundo para telemóvel */}
      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-emerald-200/80 flex items-center gap-3.5">
          <img
            src="./icons/icon-192x192.png"
            alt="Horta Viva"
            className="w-12 h-12 rounded-xl object-cover shadow-md border border-stone-200/60 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-stone-800 text-sm leading-tight flex items-center gap-1.5 truncate">
              Instalar App Horta Viva
            </p>
            <p className="text-xs text-stone-500 truncate mt-0.5">
              Adiciona ao ecrã inicial do telemóvel
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
            <button
              onClick={handleDismiss}
              className="w-8 h-8 rounded-full text-stone-400 hover:text-stone-600 flex items-center justify-center transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showIOSModal && <IOSInstructionsModal onClose={() => setShowIOSModal(false)} />}
    </>
  );
}

export function IOSInstructionsModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-emerald-100 text-left relative animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <img
            src="./icons/icon-192x192.png"
            alt="Horta Viva"
            className="w-14 h-14 rounded-2xl shadow-md border border-stone-200/60 shrink-0"
          />
          <div>
            <h3 className="font-bold text-stone-800 text-base leading-tight">Instalar no iPhone / iPad</h3>
            <p className="text-xs text-emerald-600 font-medium mt-0.5">Sem precisar da App Store</p>
          </div>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed mb-4">
          Para teres a <b>Horta Viva</b> instalada como app no teu ecrã inicial com o ícone oficial, segue estes 2 passos no Safari:
        </p>

        <div className="space-y-3 mb-5">
          <div className="flex items-start gap-3 bg-stone-50 rounded-xl p-3 border border-stone-200/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <Share2 className="w-4 h-4" />
            </div>
            <div className="text-xs text-stone-700 leading-snug">
              <span className="font-bold text-stone-800">1. Toca no botão Partilhar</span>
              <p className="text-stone-500 mt-0.5">Clica no ícone de partilha (quadrado com seta para cima) na barra do Safari.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-stone-50 rounded-xl p-3 border border-stone-200/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <PlusSquare className="w-4 h-4" />
            </div>
            <div className="text-xs text-stone-700 leading-snug">
              <span className="font-bold text-stone-800">2. Adicionar ao ecrã principal</span>
              <p className="text-stone-500 mt-0.5">Percorre a lista para baixo e toca em <b>«Adicionar ao ecrã principal»</b>.</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all active:scale-95 text-sm"
        >
          Entendido!
        </button>
      </div>
    </div>
  );
}
