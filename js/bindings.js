/* ==========================================================
   bindings.js
   Tugas: mengisi elemen [data-bind] dan foto dari konfigurasi.
   Tidak mengubah struktur HTML atau gaya.
   ========================================================== */

window.WeddingBindings = (function () {
  "use strict";

  function formatDate(date, timeZone) {
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: timeZone
    }).format(date);
  }

  function formatClock(date, timeZone) {
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: timeZone
    }).format(date);
  }

  // Contoh hasil: "16.00 WIB - selesai"
  function formatTimeRange(event) {
    const start = formatClock(new Date(event.start), event.timeZone) + " " + event.timeZoneLabel;
    const end = event.endLabel || formatClock(new Date(event.end), event.timeZone) + " " + event.timeZoneLabel;
    return start + " - " + end;
  }

  const MAX_GUEST_NAME_LENGTH = 60;

  // Nama tamu dari link, contoh: index.html?to=Budi%20Santoso
  // Hanya dipakai sebagai teks (textContent), spasi dirapikan, panjang dibatasi
  function readGuestName() {
    const name = new URLSearchParams(window.location.search).get("to");
    if (!name) return "";
    return name.replace(/\s+/g, " ").trim().slice(0, MAX_GUEST_NAME_LENGTH);
  }

  function buildValues(config) {
    const start = new Date(config.event.start);
    const guestName = readGuestName();

    const values = Object.assign({}, config.couple, {
      venueName: config.event.venueName,
      venueAddress: config.event.venueAddress,
      dateText: formatDate(start, config.event.timeZone),
      timeText: formatTimeRange(config.event),
      quote: config.quote
    });

    if (guestName) values.guestName = guestName;
    return values;
  }

  function fillText(values) {
    document.querySelectorAll("[data-bind]").forEach(function (element) {
      const key = element.dataset.bind;
      if (values[key] !== undefined) element.textContent = values[key];
    });
  }

  function fillPhotos(assets) {
    const photos = { bride: assets.bridePhoto, groom: assets.groomPhoto };
    document.querySelectorAll("[data-bind-photo]").forEach(function (element) {
      const path = photos[element.dataset.bindPhoto];
      if (path) element.style.backgroundImage = "url('" + path + "')";
    });
  }

  function init(config) {
    const values = buildValues(config);
    fillText(values);
    fillPhotos(config.assets);
    document.title = "Undangan Pernikahan " + config.couple.groomNickname + " & " + config.couple.brideNickname;
    return values;
  }

  return { init: init, buildValues: buildValues };
})();