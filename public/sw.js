// Service Worker da Horta Viva (PWA)
// Permite instalação no smartphone, arranque instantâneo e acesso offline às fichas da horta.

const CACHE_NAME = 'hortaviva-cache-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.jpg',
  './icons/icon-192x192.png',
  './icons/icon-512x512.png',
  './icons/icon-maskable-512x512.png',
  './icons/apple-touch-icon.png',
  './icons/favicon-32x32.png'
];

// Instalação: pré-carrega os ficheiros essenciais da app
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS).catch((err) => {
        console.warn('[SW] Alguns ficheiros iniciais não foram colocados em cache:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Ativação: limpa caches antigas e assume o controlo imediato
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Interceção de pedidos: Network-first com fallback para cache
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Apenas métodos GET e protocolos http/https
  if (request.method !== 'GET' || !request.url.startsWith('http')) {
    return;
  }

  // Pedidos de navegação (páginas HTML)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            return cached || caches.match('./index.html') || caches.match('./');
          });
        })
    );
    return;
  }

  // Recursos estáticos (imagens, scripts, folhas de estilo, fontes)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Atualiza a cache em segundo plano (Stale-while-revalidate)
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, networkResponse));
            }
          })
          .catch(() => {});
        return cachedResponse;
      }

      // Se não estiver em cache, faz pedido de rede e guarda em cache
      return fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      });
    })
  );
});
