/* ==========================================================
   KONFIGURASI UNDANGAN
   Ini satu-satunya file yang perlu diedit untuk mengganti data.
   ========================================================== */

window.WEDDING_CONFIG = {
  couple: {
    groomName: "Suprianto",
    groomNickname: "Pian",
    groomFather: "Alm. Wahyono",
    groomMother: "Alm. Rajinem",

    brideName: "Meigia Nidya Sari",
    brideNickname: "Didis",
    brideFather: "Alm. H. Legino",
    brideMother: "Alm. Hj. Suati"
  },

  event: {
    // Format: YYYY-MM-DDTHH:MM:SS+07:00 (+07:00 = WIB, +08:00 = WITA, +09:00 = WIT)
    start: "2026-12-12T16:00:00+07:00",
    // Jam selesai hanya dipakai untuk Google Calendar. Di halaman tampil sesuai endLabel.
    end: "2026-12-12T19:00:00+07:00",
    endLabel: "selesai",
    timeZone: "Asia/Jakarta",
    timeZoneLabel: "WIB",

    venueName: "Restoran Taman Keraton",
    venueAddress: "Jl. Medan - Binjai Km. 12, Medan, Sumatera Utara",
    // Link tombol Google Maps (dari Google Maps > Bagikan)
    venueMapsUrl: "https://maps.app.goo.gl/XShpUQNax5N3SZMk8",
    // Titik untuk peta di halaman (kosongkan jika tidak ada)
    venueLatitude: 3.5998748,
    venueLongitude: 98.5832315,

    calendarTitle: "Pernikahan Pian & Didis",
    calendarDescription: "Kami mengundang Anda untuk hadir dan memberikan doa restu."
  },

  // Kalimat puitis pada bagian penutup
  quote: "Dua jiwa yang tadinya berjalan sendiri-sendiri, kini memilih melangkah searah. Semoga setiap langkah kami menjadi rumah, dan setiap doa Anda menjadi restu yang menguatkan.",

  // Path file di folder assets. GANTI PLACEHOLDER: letakkan segel.png dan kertas.png
  // di folder assets dengan nama persis seperti di bawah; jika file belum ada, cover memakai placeholder.
  assets: {
    seal: "assets/segel.png",
    paper: "assets/kertas.png",
    groomPhoto: "assets/pria.jpg",
    bridePhoto: "assets/wanita.jpg",
    music: "assets/music.mp3"
  },

  // Durasi fade masuk dan keluar musik (milidetik). 500 = 0,5 detik
  musicFadeMs: 500,

  // URL Web App Google Apps Script (untuk RSVP dan ucapan)
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbxKo_brJuqmIMq1_ys6igu6yI0sYyGdLevTW3tAOjx8ol7OhpRJyYtrFEV_uBcZ27Oajg/exec"
};