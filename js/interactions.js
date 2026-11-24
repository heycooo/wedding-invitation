/* ==========================================================
   interactions.js
   Tugas: interaksi tamu - tombol buka undangan (memulai musik)
   dan salin teks.
   ========================================================== */

window.WeddingInteractions = (function () {
  "use strict";

  /* ---------- Buka undangan ---------- */
  function setupOpenButton() {
    const button = document.getElementById("openInvitation");
    if (button) button.addEventListener("click", WeddingMusic.start);
  }

  /* ---------- Salin teks ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const ok = document.execCommand("copy");
      helper.remove();
      ok ? resolve() : reject();
    });
  }

  function setupCopyButtons(values) {
    document.querySelectorAll("[data-copy]").forEach(function (button) {
      const originalLabel = button.textContent;
      button.addEventListener("click", function () {
        const text = String(values[button.dataset.copy] || "").replace(/\s+/g, "");
        copyText(text).then(function () {
          button.textContent = "Tersalin";
        }).catch(function () {
          button.textContent = "Gagal menyalin";
        }).finally(function () {
          setTimeout(function () { button.textContent = originalLabel; }, 2000);
        });
      });
    });
  }

  function init(values) {
    setupOpenButton();
    setupCopyButtons(values);
  }

  return { init: init };
})();