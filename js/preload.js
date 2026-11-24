/* ==========================================================
   preload.js
   Tugas: memuat gambar segel dan kertas lebih dulu, lalu
   memasangnya ke cover. Mengembalikan Promise yang selesai
   saat kedua gambar siap, atau setelah batas waktu agar
   cover tidak tertahan jika ada file yang tidak ditemukan.
   ========================================================== */

window.WeddingPreload = (function () {
  "use strict";

  const MAX_WAIT_MS = 3000;

  function loadInto(cover, path, name) {
    return new Promise(function (resolve) {
      if (!path) {
        resolve(false);
        return;
      }

      const image = new Image();
      image.onload = function () {
        const url = new URL(path, document.baseURI).href;
        cover.style.setProperty("--" + name + "-image", 'url("' + url + '")');
        cover.classList.add("has-" + name + "-image");
        resolve(true);
      };
      image.onerror = function () { resolve(false); };
      image.src = path;
    });
  }

  function init(assets, cover) {
    const loading = Promise.all([
      loadInto(cover, assets.seal, "seal"),
      loadInto(cover, assets.paper, "paper")
    ]);
    const timeout = new Promise(function (resolve) { setTimeout(resolve, MAX_WAIT_MS); });
    return Promise.race([loading, timeout]);
  }

  return { init: init };
})();