/* ==========================================================
   wishes.js
   Tugas: menampilkan ucapan tamu (nama, tanggal, isi) dengan
   tombol suka seperti kolom komentar. Diperbarui otomatis
   tiap 30 detik dan setelah tamu mengirim RSVP.
   Penanda ucapan yang sudah disukai disimpan di perangkat
   tamu (localStorage), sehingga satu perangkat satu suka.
   ========================================================== */

window.WeddingWishes = (function () {
  "use strict";

  const REFRESH_INTERVAL_MS = 30000;
  const LIKED_STORAGE_KEY = "wedding-liked-wishes";

  let endpoint = "";
  let likedIds = new Set();
  const pendingIds = new Set();
  let lastSignature = "";

  /* ---------- Penyimpanan suka di perangkat ---------- */
  function loadLiked() {
    try {
      const saved = JSON.parse(localStorage.getItem(LIKED_STORAGE_KEY) || "[]");
      likedIds = new Set(Array.isArray(saved) ? saved : []);
    } catch (error) {
      likedIds = new Set();
    }
  }

  function saveLiked() {
    try {
      localStorage.setItem(LIKED_STORAGE_KEY, JSON.stringify(Array.from(likedIds)));
    } catch (error) {
      /* penyimpanan tidak tersedia; suka tetap berfungsi selama halaman terbuka */
    }
  }

  /* ---------- Format tanggal ---------- */
  function formatDate(iso) {
    const date = new Date(iso);
    if (!iso || Number.isNaN(date.getTime())) return "";

    const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
    if (minutes < 1) return "baru saja";
    if (minutes < 60) return minutes + " menit lalu";

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return hours + " jam lalu";

    const days = Math.floor(hours / 24);
    if (days < 7) return days + " hari lalu";

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    }).format(date);
  }

  /* ---------- Tombol suka ---------- */
  function paintLike(button, wish) {
    const isLiked = likedIds.has(wish.id);
    const count = button.querySelector(".wish__count");

    button.setAttribute("aria-pressed", String(isLiked));
    button.setAttribute("aria-label", (isLiked ? "Batal suka ucapan dari " : "Suka ucapan dari ") + wish.name);
    count.textContent = wish.likes > 0 ? String(wish.likes) : "";
    count.hidden = wish.likes <= 0;
  }

  function sendLike(id, delta) {
    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ action: "like", id: id, delta: delta })
    }).then(function (response) { return response.json(); });
  }

  function toggleLike(wish, button) {
    if (pendingIds.has(wish.id)) return;

    const wasLiked = likedIds.has(wish.id);
    const delta = wasLiked ? -1 : 1;

    // Tampilan langsung berubah; dikembalikan jika server gagal
    if (wasLiked) likedIds.delete(wish.id); else likedIds.add(wish.id);
    wish.likes = Math.max(0, wish.likes + delta);
    saveLiked();
    paintLike(button, wish);

    pendingIds.add(wish.id);
    sendLike(wish.id, delta).then(function (result) {
      if (!result.ok) throw new Error(result.error || "Gagal");
      wish.likes = result.likes;
      paintLike(button, wish);
    }).catch(function () {
      if (wasLiked) likedIds.add(wish.id); else likedIds.delete(wish.id);
      wish.likes = Math.max(0, wish.likes - delta);
      saveLiked();
      paintLike(button, wish);
    }).finally(function () {
      pendingIds.delete(wish.id);
    });
  }

  /* ---------- Tampilkan daftar ---------- */
  function buildItem(template, wish) {
    const item = template.content.cloneNode(true);

    item.querySelector(".wish__avatar").textContent = wish.name.charAt(0).toUpperCase();
    item.querySelector(".wish__name").textContent = wish.name;
    item.querySelector(".wish__message").textContent = wish.message;

    const date = item.querySelector(".wish__date");
    const text = formatDate(wish.time);
    date.textContent = text;
    date.hidden = !text;
    if (wish.time) date.setAttribute("datetime", wish.time);

    const button = item.querySelector(".wish__like");
    paintLike(button, wish);
    button.addEventListener("click", function () { toggleLike(wish, button); });

    return item;
  }

  function render(wishes) {
    const list = document.getElementById("wishesList");
    const template = document.getElementById("wishTemplate");
    if (!list || !template || !wishes.length) return; // pertahankan pesan "Belum ada ucapan"

    list.replaceChildren.apply(list, wishes.map(function (wish) {
      return buildItem(template, wish);
    }));
  }

  function refresh() {
    return fetch(endpoint)
      .then(function (response) { return response.json(); })
      .then(function (result) {
        if (!result.ok) return;

        // Hanya menggambar ulang jika datanya berubah, agar daftar tidak melompat saat dibaca
        const signature = JSON.stringify(result.wishes);
        if (signature === lastSignature) return;
        lastSignature = signature;
        render(result.wishes);
      })
      .catch(function () {
        /* gagal memuat ucapan tidak perlu mengganggu tamu */
      });
  }

  /* ---------- Inisialisasi ---------- */
  function init(wishesEndpoint) {
    if (!wishesEndpoint) return;

    endpoint = wishesEndpoint;
    loadLiked();
    refresh();

    setInterval(function () {
      if (!document.hidden) refresh();
    }, REFRESH_INTERVAL_MS);

    // Ucapan baru muncul segera setelah tamu mengirim RSVP
    document.addEventListener("rsvp:submitted", refresh);
  }

  return { init: init };
})();