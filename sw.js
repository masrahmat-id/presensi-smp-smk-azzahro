const CACHE_NAME = 'presensi-azzahro-v1.0.0';
const OFFLINE_URL = './offline.html';

// Tambahkan library scanner dan file audio ke cache agar bisa bekerja offline
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  OFFLINE_URL,
  './logo-smp-azzahro.png',
  './logo-smk-azzahro.png',
  'https://unpkg.com/html5-qrcode@2.3.8/html5-qrcode.min.js',
  './icon-apk-presensi-azzahro.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      );
    })
  );
});

// LOGIKA STRATEGI: Cache First, falling back to Network
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // Balas dengan cache jika ada, jika tidak ambil dari internet
      return response || fetch(e.request).catch(() => {
        // Jika internet mati dan yang diminta adalah halaman web
        if (e.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});
