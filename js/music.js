/* ==========================================================
   music.js
   Tugas: musik latar dengan fade masuk dan fade keluar,
   serta loop otomatis saat lagu selesai.
   Memakai Web Audio API agar fade juga bekerja di iPhone
   (volume audio biasa tidak bisa diatur di iOS).
   ========================================================== */

window.WeddingMusic = (function () {
  "use strict";

  const DEFAULT_FADE_MS = 500;

  let audio = null;
  let audioContext = null;
  let gainNode = null;
  let fadeMs = DEFAULT_FADE_MS;
  let fallbackFrame = null;
  let isActive = false; // niat pemutaran: true = sedang/akan diputar
  let sequence = 0;     // membatalkan jeda yang tertunda jika tamu menekan play lagi

  /* ---------- Tampilan tombol ---------- */
  function setPlayingState(isPlaying) {
    isActive = isPlaying;
    const button = document.getElementById("musicToggle");
    if (button) button.classList.toggle("is-playing", isPlaying);
  }

  /* ---------- Penyiapan Web Audio ---------- */
  function ensureAudioGraph() {
    if (audioContext) return;
    const ContextClass = window.AudioContext || window.webkitAudioContext;
    if (!ContextClass) return; // cadangan: fade lewat audio.volume

    audioContext = new ContextClass();
    gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    audioContext.createMediaElementSource(audio).connect(gainNode).connect(audioContext.destination);
  }

  /* ---------- Fade ---------- */
  function wait(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function fadeWithGain(target) {
    const now = audioContext.currentTime;
    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(target, now + fadeMs / 1000);
    return wait(fadeMs);
  }

  function fadeWithVolume(target) {
    cancelAnimationFrame(fallbackFrame);
    return new Promise(function (resolve) {
      const from = audio.volume;
      const startTime = performance.now();

      function step(time) {
        const progress = Math.min((time - startTime) / fadeMs, 1);
        audio.volume = from + (target - from) * progress;
        if (progress < 1) fallbackFrame = requestAnimationFrame(step); else resolve();
      }
      fallbackFrame = requestAnimationFrame(step);
    });
  }

  function fadeTo(target) {
    return gainNode ? fadeWithGain(target) : fadeWithVolume(target);
  }

  /* ---------- Kontrol ---------- */
  function start() {
    if (!audio) return;

    ensureAudioGraph();
    sequence += 1;

    if (audioContext && audioContext.state === "suspended") audioContext.resume();
    if (!gainNode && audio.paused) audio.volume = 0;

    audio.play().then(function () {
      setPlayingState(true);
      fadeTo(1);
    }).catch(function () {
      setPlayingState(false); // ditolak browser atau file tidak ditemukan
    });
  }

  function stop() {
    if (!audio) return;

    const token = ++sequence;
    setPlayingState(false);
    fadeTo(0).then(function () {
      if (token === sequence) audio.pause();
    });
  }

  function toggle() {
    if (isActive) stop(); else start();
  }

  /* ---------- Inisialisasi ---------- */
  function init(musicPath, fadeDurationMs) {
    const button = document.getElementById("musicToggle");
    if (!button) return;

    if (!musicPath) {
      button.hidden = true;
      return;
    }

    fadeMs = fadeDurationMs || DEFAULT_FADE_MS;

    audio = new Audio(musicPath);
    audio.loop = true;      // ulang otomatis saat lagu selesai
    audio.preload = "auto";
    audio.addEventListener("error", function () { setPlayingState(false); });

    button.addEventListener("click", toggle);
  }

  return { init: init, start: start, stop: stop };
})();