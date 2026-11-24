/* ==========================================================
   links.js
   Tugas: membuat link Google Maps, Google Calendar (Save The
   Date), dan peta embed dari konfigurasi.
   ========================================================== */

window.WeddingLinks = (function () {
  "use strict";

  function toCalendarStamp(isoString) {
    // Contoh hasil: 20261212T090000Z
    return new Date(isoString).toISOString().replace(/[-:]|\.\d{3}/g, "");
  }

  function placeText(event) {
    return event.venueName + ", " + event.venueAddress;
  }

  function hasCoordinates(event) {
    return typeof event.venueLatitude === "number" && typeof event.venueLongitude === "number";
  }

  // Memakai link Google Maps dari konfigurasi; jika kosong, cari berdasarkan nama dan alamat
  function buildMapsUrl(event) {
    if (event.venueMapsUrl) return event.venueMapsUrl;
    return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(placeText(event));
  }

  function buildCalendarUrl(event) {
    const params = new URLSearchParams({
      action: "TEMPLATE",
      text: event.calendarTitle,
      dates: toCalendarStamp(event.start) + "/" + toCalendarStamp(event.end),
      details: event.calendarDescription,
      location: placeText(event)
    });
    return "https://calendar.google.com/calendar/render?" + params.toString();
  }

  function buildEmbedUrl(event) {
    const query = hasCoordinates(event)
      ? event.venueLatitude + "," + event.venueLongitude
      : placeText(event);
    return "https://www.google.com/maps?q=" + encodeURIComponent(query) + "&z=17&output=embed";
  }

  function setLink(name, url) {
    document.querySelectorAll('[data-bind-link="' + name + '"]').forEach(function (element) {
      element.href = url;
    });
  }

  function renderMapEmbed(event) {
    const container = document.querySelector("[data-map-embed]");
    if (!container) return;

    const iframe = document.createElement("iframe");
    iframe.src = buildEmbedUrl(event);
    iframe.title = "Peta lokasi " + event.venueName;
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    container.replaceChildren(iframe);
  }

  function init(event) {
    setLink("maps", buildMapsUrl(event));
    setLink("calendar", buildCalendarUrl(event));
    renderMapEmbed(event);
  }

  return { init: init };
})();