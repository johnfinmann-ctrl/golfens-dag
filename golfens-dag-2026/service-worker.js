/* ============================================================
   Golfens Dag 2027 – service-worker.js v2.4.2
   Cache: golfens-dag-v2.4.1
   Skift CACHE_NAME ved enhver ny deploy.
   ============================================================ */
const CACHE_NAME = 'golfens-dag-v2.4.1';

// Assets med ?v= querystring matcher de faktiske requests fra index.html
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
          .map(k => {
            console.log('[SW] Deleting old cache:', k);
            return caches.delete(k);
          })
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
