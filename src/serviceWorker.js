const mainURL = "https://tarepan.github.io/TheHome/";

self.addEventListener("fetch", event => {
  // We only want to call event.respondWith() if this is a GET request for an HTML document.
  console.log(`fetch URL: ${event.request.url}`);
  if (event.request.url === mainURL) {
    console.log("Handling fetch event for", event.request.url);
    // event.respondWith(
    //   fetch(event.request).catch(e => {
    //     console.error("Fetch failed; returning offline page instead.", e);
    //     return caches.open(OFFLINE_CACHE).then(cache => {
    //       return cache.match(mainURL);
    //     });
    //   })
    // );
  }
});
