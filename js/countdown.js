/* ==========================================================
   countdown.js
   Tugas: menghitung mundur ke waktu acara dan menampilkannya
   pada elemen [data-countdown="days|hours|minutes|seconds"].
   ========================================================== */

window.WeddingCountdown = (function () {
  "use strict";

  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  function pad(value) {
    return String(value).padStart(2, "0");
  }

  function split(remainingMs) {
    const safe = Math.max(remainingMs, 0);
    return {
      days: Math.floor(safe / DAY),
      hours: Math.floor((safe % DAY) / HOUR),
      minutes: Math.floor((safe % HOUR) / MINUTE),
      seconds: Math.floor((safe % MINUTE) / SECOND)
    };
  }

  function render(parts) {
    Object.keys(parts).forEach(function (unit) {
      const element = document.querySelector('[data-countdown="' + unit + '"]');
      if (element) element.textContent = pad(parts[unit]);
    });
  }

  function init(startIso) {
    const target = new Date(startIso).getTime();
    if (Number.isNaN(target)) return;

    function tick() {
      const remaining = target - Date.now();
      render(split(remaining));
      if (remaining <= 0) clearInterval(timer);
    }

    const timer = setInterval(tick, SECOND);
    tick();
  }

  return { init: init };
})();