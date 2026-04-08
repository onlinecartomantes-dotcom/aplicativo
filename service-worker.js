const CACHE_NAME = "cartomantes-v1";

const urlsToCache = [
  "/aplicativo/",
  "/aplicativo/index.html",
  "/aplicativo/logo-192.png",
  "/aplicativo/logo-512.png"
  "/aplicativo/perfil.html"
];

// instalar
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

// ativar
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// fetch (offline + cache inteligente)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
