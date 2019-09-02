window.addEventListener("load", () => {
  navigator.serviceWorker
    .register("serviceWorker.js")
    .then(
      rgst => console.log(`SW registration successful: ${rgst.scope}`),
      err => console.log(`ServiceWorker registration failed: ${err}`)
    );
});
