import React, { useState, useEffect } from "react";
import { Download, X, Share2, PlusSquare } from "lucide-react";

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
      window.matchMedia("(display-mode: window-controls-overlay)").matches ||
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
    isInstallable: !isStandalone,
    isStandalone,
    isIOS,
    hasPrompt: !!deferredPrompt,
    triggerInstall,
  };
}

export default function InstallPrompt() {
  const { isInstallable, isStandalone, isIOS, hasPrompt, triggerInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
      const outcome = await triggerInstall();
      if (outcome !== "accepted") {
        setShowModal(true);
      }
    } else {
      setShowModal(true);
    }
  };

  if (isStandalone || dismissed || !isInstallable) {
    return showModal ? (
      <InstallInstructionsModal onClose={() => setShowModal(false)} />
    ) : null;
  }

  return (
    <>
      {/* Banner flutuante no fundo para telemóvel e desktop */}
      <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-30 animate-in fade-in slide-in-from-bottom-5 duration-300">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-emerald-200/90 flex items-center gap-3">
          <img
            src="./icons/icon-192x192.png"
            alt="Horta Viva"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover shadow-md border border-stone-200/60 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-stone-800 text-xs sm:text-sm leading-tight truncate flex items-center gap-1">
              <span>Instalar App Horta Viva</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">App</span>
            </p>
            <p className="text-[11px] sm:text-xs text-stone-500 truncate mt-0.5">
              Usa como app independente sem barras de site
            </p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-semibold text-xs px-3 sm:px-3.5 py-2 rounded-xl shadow-md shadow-emerald-200/50 hover:shadow-lg transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Instalar</span>
            </button>
            <button
              onClick={handleDismiss}
              className="w-7 h-7 rounded-full text-stone-400 hover:text-stone-600 flex items-center justify-center transition-colors"
              title="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showModal && <InstallInstructionsModal onClose={() => setShowModal(false)} />}
    </>
  );
}

export function InstallInstructionsModal({ onClose }) {
  const { isIOS, hasPrompt, triggerInstall } = usePWAInstall();

  const handleAction = async () => {
    if (hasPrompt) {
      await triggerInstall();
      onClose();
    } else {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-emerald-100 text-left relative animate-in slide-in-from-bottom-4 duration-300"
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
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl shadow-md border border-stone-200/60 shrink-0"
          />
          <div>
            <h3 className="font-bold text-stone-800 text-base leading-tight">
              {isIOS ? "Instalar App no iPhone / iPad" : "Instalar App Oficial (Android / Google)"}
            </h3>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              Modo App Completo (Sem barra de site)
            </p>
          </div>
        </div>

        {isIOS ? (
          <>
            <p className="text-xs text-stone-600 leading-relaxed mb-4">
              Para teres a <b>Horta Viva</b> a abrir como uma app autónoma em ecrã completo no teu iOS, segue estes passos no Safari:
            </p>

            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3 bg-stone-50 rounded-xl p-3 border border-stone-200/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Share2 className="w-4 h-4" />
                </div>
                <div className="text-xs text-stone-700 leading-snug">
                  <span className="font-bold text-stone-800">1. Botão Partilhar</span>
                  <p className="text-stone-500 mt-0.5">Toca no ícone de partilha (quadrado com seta para cima) na barra inferior do Safari.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-stone-50 rounded-xl p-3 border border-stone-200/60">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <PlusSquare className="w-4 h-4" />
                </div>
                <div className="text-xs text-stone-700 leading-snug">
                  <span className="font-bold text-stone-800">2. Adicionar ao ecrã principal</span>
                  <p className="text-stone-500 mt-0.5">Desce na lista e seleciona <b>«Adicionar ao ecrã principal»</b>.</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className="text-xs text-stone-600 leading-relaxed mb-3.5">
              Para a <b>Horta Viva</b> abrir diretamente como uma <b>app nativa independente</b> (como a Epic Games ou jogos instalados, sem barra de navegação nem cabeçalho de site):
            </p>

            <div className="space-y-2.5 mb-4">
              <div className="flex items-start gap-2.5 bg-amber-50/80 rounded-xl p-2.5 border border-amber-200/70">
                <div className="w-6 h-6 rounded-lg bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  1
                </div>
                <div className="text-xs text-stone-700 leading-snug">
                  <span className="font-bold text-stone-800">Se tinhas um atalho antigo no ecrã:</span>
                  <p className="text-stone-600 mt-0.5">Remove primeiro o atalho antigo do ecrã inicial do telemóvel para não abrir em modo de navegador.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-emerald-50/80 rounded-xl p-2.5 border border-emerald-200/70">
                <div className="w-6 h-6 rounded-lg bg-emerald-200/80 text-emerald-900 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  2
                </div>
                <div className="text-xs text-stone-700 leading-snug">
                  <span className="font-bold text-stone-800">No Google Chrome:</span>
                  <p className="text-stone-600 mt-0.5">Toca nos <b>3 pontos (⋮)</b> no topo direito do Chrome e escolhe <b>«Instalar aplicação»</b> (ou clica no botão abaixo).</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-emerald-50/80 rounded-xl p-2.5 border border-emerald-200/70">
                <div className="w-6 h-6 rounded-lg bg-emerald-200/80 text-emerald-900 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                  3
                </div>
                <div className="text-xs text-stone-700 leading-snug">
                  <span className="font-bold text-stone-800">App instalada no sistema:</span>
                  <p className="text-stone-600 mt-0.5">A app aparecerá na gaveta de aplicações do telemóvel e abrirá em ecrã completo sem barras de site.</p>
                </div>
              </div>
            </div>
          </>
        )}

        <button
          onClick={handleAction}
          className="w-full bg-gradient-to-r from-emerald-500 via-green-600 to-teal-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-emerald-200/50 hover:shadow-xl transition-all active:scale-95 text-sm flex items-center justify-center gap-2"
        >
          {hasPrompt ? (
            <>
              <Download className="w-4 h-4" />
              <span>Instalar Aplicação Agora</span>
            </>
          ) : (
            <span>Entendido!</span>
          )}
        </button>
      </div>
    </div>
  );
}

// Alias para compatibilidade
export const IOSInstructionsModal = InstallInstructionsModal;
