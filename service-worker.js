const CACHE_NAME = "cartomantes-v5";

/* 🔥 ARQUIVOS DO APP (ATUALIZADO) */
const urlsToCache = [
  "/aplicativo/",
  "/aplicativo/index.html",
  "/aplicativo/mural.html",
  "/aplicativo/perfil.html",
  "/aplicativo/perguntas.html",
  "/aplicativo/pix.html",
  "/aplicativo/trabalho.html",

  "/aplicativo/logo.png",
  "/aplicativo/logo-192.png",
  "/aplicativo/logo-512.png",

  "/aplicativo/manifest.json"
];

/* 🔥 INSTALAÇÃO */
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

/* 🔥 ATIVAÇÃO */
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
  self.clients.claim();
});

/* 🔥 FETCH ESTÁVEL */
self.addEventListener("fetch", event => {

  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {

        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

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
