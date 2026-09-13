import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App.jsx'
import '@/index.css'

// Registar Service Worker para suporte PWA e instalação no smartphone
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Caminho relativo para funcionar tanto no GitHub Pages (/Horta-Viva/) como em domínio próprio
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      console.log('[PWA] Service Worker ativo com scope:', registration.scope);
    }).catch((error) => {
      console.warn('[PWA] Erro ao registar Service Worker:', error);
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />
)
