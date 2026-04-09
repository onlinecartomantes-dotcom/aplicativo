const CACHE_NAME = "cartomantes-v3";

const urlsToCache = [
  "/aplicativo/index.html",
  "/aplicativo/perfil.html",
  "/aplicativo/logo-192.png",
  "/aplicativo/logo-512.png"
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

// 🔥 FETCH CORRIGIDO (ANTI TELA BRANCA)
self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response;
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            return response || caches.match("/aplicativo/index.html");
          });
      })
  );
});
