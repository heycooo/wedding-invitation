/* ==========================================================
   rsvp.js
   Tugas: validasi dan pengiriman form RSVP ke Google Apps Script.
   Setelah berhasil, mengumumkan event "rsvp:submitted" agar
   daftar ucapan (wishes.js) memperbarui diri.
   ========================================================== */

window.WeddingRsvp = (function () {
  "use strict";

  const MAX_GUESTS = 10;

  let endpoint = "";

  /* ---------- Status pesan ---------- */
  function setStatus(message, type) {
    const status = document.getElementById("rsvpStatus");
    if (!status) return;
    status.textContent = message;
    status.classList.toggle("is-error", type === "error");
    status.classList.toggle("is-success", type === "success");
  }

  /* ---------- Validasi form ---------- */
  function readForm(form) {
    const data = new FormData(form);
    return {
      name: String(data.get("name") || "").trim(),
      attendance: data.get("attendance"),
      guests: Number(data.get("guests")),
      message: String(data.get("message") || "").trim()
    };
  }

  function validate(values) {
    if (!values.name) return "Nama wajib diisi.";
    if (!values.attendance) return "Pilih Hadir atau Tidak hadir.";
    if (!Number.isInteger(values.guests) || values.guests < 1 || values.guests > MAX_GUESTS) {
      return "Jumlah tamu harus antara 1 dan " + MAX_GUESTS + ".";
    }
    return null;
  }

  /* ---------- Kirim RSVP ---------- */
  function sendRsvp(values) {
    return fetch(endpoint, {
      method: "POST",
      // text/plain menghindari preflight CORS pada Apps Script
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(values)
    }).then(function (response) {
      return response.json();
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const button = document.getElementById("rsvpSubmit");
    const values = readForm(form);
    const error = validate(values);

    if (error) {
      setStatus(error, "error");
      return;
    }

    button.disabled = true;
    setStatus("Mengirim...", null);

    sendRsvp(values).then(function (result) {
      if (!result.ok) throw new Error(result.error || "Gagal mengirim.");
      form.reset();
      setStatus("Terima kasih, konfirmasi Anda sudah tercatat.", "success");
      document.dispatchEvent(new CustomEvent("rsvp:submitted"));
    }).catch(function (err) {
      setStatus(err.message || "Gagal mengirim. Periksa koneksi dan coba lagi.", "error");
    }).finally(function () {
      button.disabled = false;
    });
  }

  /* ---------- Inisialisasi ---------- */
  function init(rsvpEndpoint) {
    const form = document.getElementById("rsvpForm");
    if (!form) return;

    if (!rsvpEndpoint) {
      setStatus("Form RSVP belum dihubungkan.", "error");
      return;
    }

    endpoint = rsvpEndpoint;
    form.addEventListener("submit", handleSubmit);
  }

  return { init: init };
})();