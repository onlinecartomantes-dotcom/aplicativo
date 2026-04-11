const CACHE_NAME = "cartomantes-v7";

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

/* INSTALAÇÃO */
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

/* ATIVAÇÃO */
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => key !== CACHE_NAME && caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

/* 🔥 FETCH CORRIGIDO TOTAL */
self.addEventListener("fetch", event => {

  const url = event.request.url;

  /* 🔥 NÃO INTERFERIR NO FIREBASE (CRÍTICO) */
  if (
    url.includes("googleapis.com") ||
    url.includes("firestore") ||
    url.includes("firebase") ||
    url.includes("gstatic")
  ) {
    return;
  }

  /* 🔥 NÃO INTERFERIR EM UPLOAD / POST (ENVIO DE IMAGEM) */
  if (event.request.method !== "GET") {
    return;
  }

  /* 🔥 NÃO INTERFERIR EM IMAGENS (ESSENCIAL PRA FUNCIONAR NO CELULAR) */
  if (event.request.destination === "image") {
    event.respondWith(fetch(event.request));
    return;
  }

  /* 🔥 HTML SEMPRE ONLINE (MURAL TEMPO REAL) */
  if (event.request.mode === "navigate") {
    event.respondWith(fetch(event.request));
    return;
  }

  /* 🔥 CACHE SOMENTE ARQUIVOS LEVES */
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
