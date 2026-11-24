window.WeddingViewport = (function () {
  "use strict";

  function block(event) {
    event.preventDefault();
  }

  function init() {
    ["gesturestart", "gesturechange", "gestureend"].forEach(function (name) {
      document.addEventListener(name, block, { passive: false });
    });
  }

  return { init: init };
})();