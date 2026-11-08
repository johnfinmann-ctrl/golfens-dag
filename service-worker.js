/* ============================================================
   Golfens Dag 2027 – service-worker.js v3.0.4
   Cache: golfens-dag-v3.0.4
   Overført og tilpasset fra golfens-dag-2026/ (v2.4.2) til rodens
   faktiske filsæt. Skift CACHE_NAME ved enhver ny deploy, så
   gamle billeder/layout ikke hænger fast i brugernes cache.
   ============================================================ */
const CACHE_NAME = 'golfens-dag-v3.0.4';

// Assets med ?v= querystring matcher de faktiske requests fra index.html
const ASSETS = [
  './',
  './index.html',
  './style.css?v=3.0.4',
  './app.js?v=3.0.4',
  './intro.js?v=3.0.4',
  './velkomst.js?v=3.0.4',
  './assets/images/velkomst-golfbane.webp?v=3.0.4',
  './assets/images/lyngbygaard-logo-decal.webp?v=3.0.4',
  './manifest.json',
  './assets/images/forside-golfbane.webp?v=3.0.4',
  './assets/images/forside-golfbane-mobil.webp?v=3.0.4',
  './assets/images/forside-hero-bane.webp?v=3.0.4',
  './assets/images/forside-hero-bane-mobil.webp?v=3.0.4',
  './assets/images/forside-bold-logo.webp?v=3.0.4',
  './assets/images/program-kalender-logo.webp?v=3.0.4',
  './assets/images/traenerteam-golfbag.webp?v=3.0.4',
  './assets/images/golfbegreber-flag.webp?v=3.0.4',
  './assets/images/begynderforloeb-bolde-logo.webp?v=3.0.4',
  './assets/images/kontakt-klubhus.webp?v=3.0.4',
  './assets/images/lyngbygaard-golfbold.webp?v=3.0.4',
  './assets/images/om-restaurant.webp?v=3.0.4',
  './assets/images/om-traenerteam-bolde.webp?v=3.0.4',
  './assets/images/om-begynderhold-tre-spillere.webp?v=3.0.4',
  './assets/images/om-hjemmeside-place-to-play.webp?v=3.0.4',
  './assets/images/om-18-bane.webp?v=3.0.4',
  './assets/images/om-9-bane.webp?v=3.0.4',
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
