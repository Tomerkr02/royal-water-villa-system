const STATIC_CACHE = "royal-water-villa-static-v2";
const RUNTIME_CACHE = "royal-water-villa-runtime-v2";
const STATIC_ASSETS = [
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== RUNTIME_CACHE)
          .map((key) => caches.delete(key)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          const responseClone = networkResponse.clone();
          void caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          return cachedResponse || Response.error();
        }),
    );
    return;
  }

  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request).then((networkResponse) => {
          const responseClone = networkResponse.clone();
          void caches.open(STATIC_CACHE).then((cache) => cache.put(request, responseClone));
          return networkResponse;
        });
      }),
    );
    return;
  }

  event.respondWith(
    fetch(request),
  );
});
