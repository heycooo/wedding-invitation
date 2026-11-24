/* ==========================================================
   opening.js (TAHAP 2)
   Tugas: urutan pembuka cover amplop.
   1. Ketukan pertama      -> .is-open     (lipatan terbuka, kertas naik)
   2. Klik "Buka Undangan" -> .is-leaving  (lagu mulai, amplop turun,
                                            kertas terbuka ke kiri, kabut masuk)
   3. Kabut penuh          -> .is-revealing (kabut memudar, isi terungkap)
   4. Kabut selesai        -> cover dihapus, scroll dibuka
   Semua gerak dan durasi diatur di cover.css; file ini hanya
   menambah kelas pada saat yang tepat.
   ========================================================== */

window.WeddingOpening = (function () {
  "use strict";

  const SAFETY_REVEAL_MS = 7000;  // jaga-jaga jika animationend tidak terpicu
  const SAFETY_FINISH_MS = 3500;

  let cover = null;
  let tapButton = null;
  let openButton = null;
  let mist = null;
  let revealed = false;
  let finished = false;

  // Membaca durasi dari variabel CSS (contoh "1.1s" menjadi 1100)
  function cssMs(name) {
    const raw = getComputedStyle(cover).getPropertyValue(name).trim();
    const value = parseFloat(raw);
    if (Number.isNaN(value)) return 0;
    return raw.endsWith("ms") ? value : value * 1000;
  }

  /* ---------- 1. Ketukan pertama ---------- */
  function openEnvelope() {
    if (cover.classList.contains("is-open")) return; // cegah ketuk ganda

    cover.classList.add("is-open");
    tapButton.disabled = true;

    const flap = cssMs("--dur-flap");
    const paper = cssMs("--dur-paper");
    const button = cssMs("--dur-button");

    // Fokus pindah ke tombol saat sudah terlihat (membantu pengguna keyboard)
    setTimeout(function () {
      openButton.focus({ preventScroll: true });
    }, flap * 0.6 + paper * 0.7 + button);

    // Hapus will-change setelah animasi selesai
    setTimeout(function () {
      cover.classList.add("is-settled");
    }, flap * 0.6 + paper + 100);
  }

  /* ---------- 4. Selesai ---------- */
  function finish() {
    if (finished) return;
    finished = true;
    cover.remove();
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
  }

  /* ---------- 3. Kabut penuh: ungkap isi undangan ---------- */
  function reveal() {
    if (revealed) return;
    revealed = true;

    cover.classList.add("is-revealing");
    document.dispatchEvent(new CustomEvent("invitation:opening")); // memicu animasi isi (reveal.js)
    setTimeout(finish, SAFETY_FINISH_MS);
  }

  function onMistEnd(event) {
    if (event.animationName === "mist-in") reveal();
    if (event.animationName === "mist-out") finish();
  }

  /* ---------- 2. Klik "Buka Undangan" ---------- */
  function openInvitation() {
    if (cover.classList.contains("is-leaving")) return; // cegah klik ganda

    WeddingMusic.start(); // dipanggil langsung di handler klik; aman jika lagu gagal diputar
    openButton.disabled = true;

    mist.addEventListener("animationend", onMistEnd);
    cover.classList.add("is-leaving");
    setTimeout(reveal, SAFETY_REVEAL_MS);
  }

  function init(config) {
    cover = document.getElementById("cover");
    if (!cover) return;

    tapButton = document.getElementById("coverTap");
    openButton = document.getElementById("openInvitation");
    mist = cover.querySelector(".cover__mist");

    document.body.classList.add("is-locked");

    // Cover dan ketukan baru aktif setelah segel dan kertas siap
    tapButton.disabled = true;
    WeddingPreload.init(config.assets, cover).then(function () {
      cover.classList.add("is-ready");
      tapButton.disabled = false;
    });

    tapButton.addEventListener("click", openEnvelope);
    openButton.addEventListener("click", openInvitation);
  }

  return { init: init };
})();