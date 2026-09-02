/* ============================================================
   Golfens Dag 2027 – service-worker.js
   Cache: golfens-dag-v2.4.1
   Skift CACHE_NAME ved enhver ny deploy for at tvinge opdatering.
   ============================================================ */
const CACHE_NAME = 'golfens-dag-v2.4.1';

// Alle assets med ?v= buster matcher den faktiske request fra index.html
const ASSETS = [
  './',
  './index.html',
  './style.css?v=2.4.1',
  './app.js?v=2.4.1',
  './intro.js?v=2.4.1',
  './manifest.json',
  './assets/images/golf-swing.webp',
  './assets/images/intro-bg.webp',
];

// Install: cache alle assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: slet ALLE gamle caches (tvinger GitHub Pages-besøgende til ny version)
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first, network-fallback
// Vigtigt: navigation requests returnerer index.html (til GitHub Pages subpath)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Navigation (HTML-sider): network-first så ny version altid hentes
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(r => {
          // Opdater cache med ny version
          const clone = r.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return r;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Assets: cache-first
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (!r || r.status !== 200 || r.type === 'opaque') return r;
        const clone = r.clone();
        caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        return r;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
