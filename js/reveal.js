/* ==========================================================
   reveal.js
   Tugas: menampilkan elemen [data-reveal] saat masuk layar.
   Pengamatan baru dimulai ketika cover mulai terbuka
   (event "invitation:opening"), sehingga isi pertama ikut
   muncul tepat saat pintu terbelah.
   ========================================================== */

window.WeddingReveal = (function () {
  "use strict";

  function observe(items) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (item) { observer.observe(item); });
  }

  function init() {
    const items = document.querySelectorAll("[data-reveal]");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Tanpa dukungan atau dengan efek gerak dimatikan: semua isi tetap terlihat
    if (!items.length || reduceMotion || !("IntersectionObserver" in window)) return;

    document.documentElement.classList.add("reveal-ready");

    const hasCover = Boolean(document.getElementById("cover"));
    if (!hasCover) {
      observe(items);
      return;
    }
    document.addEventListener("invitation:opening", function () { observe(items); }, { once: true });
  }

  return { init: init };
})();