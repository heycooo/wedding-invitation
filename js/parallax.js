window.WeddingParallax = (function () {
  "use strict";

  const ROOT_MARGIN = "25% 0px 25% 0px";
  const sections = new Map();
  let scheduled = false;

  function collect() {
    document.querySelectorAll("[data-parallax]").forEach(function (element) {
      const host = element.closest(".section, .closing");
      if (!host) return;

      if (!sections.has(host)) sections.set(host, { visible: false, items: [] });
      sections.get(host).items.push({
        element: element,
        speed: parseFloat(element.dataset.parallax) || 0
      });
    });
  }

  function update() {
    scheduled = false;

    const viewportCenter = window.innerHeight / 2;
    const writes = [];

    sections.forEach(function (state, host) {
      if (!state.visible) return;

      const rect = host.getBoundingClientRect();
      const offset = rect.top + rect.height / 2 - viewportCenter;

      state.items.forEach(function (item) {
        writes.push([item.element, (-offset * item.speed).toFixed(1) + "px"]);
      });
    });

    writes.forEach(function (write) {
      write[0].style.setProperty("--py", write[1]);
    });
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(update);
  }

  function observe() {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        sections.get(entry.target).visible = entry.isIntersecting;
        entry.target.classList.toggle("is-live", entry.isIntersecting);
      });
      schedule();
    }, { rootMargin: ROOT_MARGIN });

    sections.forEach(function (state, host) {
      observer.observe(host);
    });
  }

  function init() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    collect();
    if (!sections.size) return;

    observe();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("invitation:opening", schedule);
  }

  return { init: init };
})();