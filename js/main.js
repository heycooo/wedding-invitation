(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    WeddingViewport.init();
    const config = window.WEDDING_CONFIG;

    WeddingBindings.init(config);
    WeddingCountdown.init(config.event.start);
    WeddingLinks.init(config.event);
    WeddingMusic.init(config.assets.music, config.musicFadeMs);
    WeddingReveal.init();
    WeddingParallax.init();
    WeddingOpening.init(config);
    WeddingRsvp.init(config.rsvpEndpoint);
    WeddingWishes.init(config.rsvpEndpoint);
  });
})();