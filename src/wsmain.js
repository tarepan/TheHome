window.addEventListener("load", () => {
  navigator.serviceWorker
    .register("serviceWorker.js")
    .then(
      rgst => null,
      err => console.log(`ServiceWorker registration failed: ${err}`)
    );
});
