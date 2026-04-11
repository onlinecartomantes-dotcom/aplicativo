const CACHE_NAME = "cartomantes-v4";

/* 🔥 TODOS OS ARQUIVOS DO SEU APP */
const urlsToCache = [
  "/aplicativo/",
  "/aplicativo/index.html",
  "/aplicativo/mural.html",
  "/aplicativo/painel.html",
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

/* 🔥 FETCH INTELIGENTE (SEM BUG / SEM TELA BRANCA) */
self.addEventListener("fetch", event => {

  /* só pega GET */
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then(response => {

        /* salva cache atualizado */
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseClone);
        });

        return response;

      })
      .catch(() => {

        return caches.match(event.request)
          .then(response => {

            /* fallback */
            return response || caches.match("/aplicativo/index.html");

          });

      })
  );
});
