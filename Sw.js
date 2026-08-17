const CACHE = 'koros-shell-v1';
const SHELL = ['./KOROS_Sovereign.html', './manifest.json'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// App shell (this HTML file + manifest) is cache-first for instant reopen.
// Model weights are cached separately by the browser's own model cache and are left alone here.
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (SHELL.some((s) => url.pathname.endsWith(s.replace('./', '')))) {
    e.respondWith(
      caches.match(e.request).then((cached) => cached || fetch(e.request))
    );
  }
});