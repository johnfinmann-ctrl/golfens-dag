/* ============================================================
   Golfens Dag 2027 – service-worker.js v2.6.1
   Cache: golfens-dag-v2.6.1
   Overført og tilpasset fra golfens-dag-2026/ (v2.4.2) til rodens
   faktiske filsæt. Skift CACHE_NAME ved enhver ny deploy, så
   gamle billeder/layout ikke hænger fast i brugernes cache.
   ============================================================ */
const CACHE_NAME = 'golfens-dag-v2.6.1';

// Assets med ?v= querystring matcher de faktiske requests fra index.html
const ASSETS = [
  './',
  './index.html',
  './style.css?v=2.6.1',
  './app.js?v=2.6.1',
  './intro.js?v=2.6.1',
  './manifest.json',
  './assets/images/golf-swing.webp?v=2.6.1',
  // './assets/images/intro-bg.webp', — tilføjes når et rent, tekstfrit
  //   introbillede foreligger (se leveringsrapport). Indtil da MÅ denne
  //   linje ikke stå her: caches.addAll() fejler hele installationen,
  //   hvis blot ét asset i listen ikke findes (404).
];

// Install: cache alle assets, skipWaiting så ny SW overtager hurtigt
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: slet alle gamle golfens-dag-* caches, overtag klienter
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(k => k.startsWith('golfens-dag-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: navigation = network-first (altid ny HTML), assets = cache-first
self.addEventListener('fetch', e => {
  // Kun samme-oprindelse og http(s) requests
  if (!e.request.url.startsWith('http')) return;

  if (e.request.mode === 'navigate') {
    // Navigation: network-first med cache-fallback
    e.respondWith(
      fetch(e.request)
        .then(r => {
          if (r && r.status === 200) {
            const clone = r.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return r;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // Assets: cache-first, network-fallback
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (r && r.status === 200 && r.type !== 'opaque') {
          const clone = r.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return r;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
