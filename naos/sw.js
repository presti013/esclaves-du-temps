/* NAOS-9 — fonctionnement hors ligne. La version change à chaque assemblage. */
var VERSION = "naos9-ae4b6e76bb";
var FICHIERS = ["./", "index.html", "naos-engine.js", "naos-paliers.js", "naos-data.js", "manifest.webmanifest",
                "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", function (ev) {
  ev.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(FICHIERS); })
    .then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (ev) {
  ev.waitUntil(caches.keys().then(function (noms) {
    return Promise.all(noms.filter(function (n) { return n.indexOf("naos9-") === 0 && n !== VERSION; })
      .map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (ev) {
  if (ev.request.method !== "GET") return;
  ev.respondWith(caches.match(ev.request, { ignoreSearch: true }).then(function (trouve) {
    return trouve || fetch(ev.request).catch(function () {
      if (ev.request.mode === "navigate") return caches.match("index.html");
    });
  }));
});
