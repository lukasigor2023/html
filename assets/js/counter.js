/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

counter.js (rewritten)
-----------------------
Vanilla replacement for jquery.counterup.min.js + jquery.waypoints.min.js.

Original behaviour (script.js + counter.js):
  - `.counter` elements: once scrolled into view, counterUp animates their
    text content from 0 up to the number already in the element, over
    `time: 2000` ms, in `delay: 10` ms steps; `animated fadeInDownBig`
    classes were also added once visible.
  - `.count-digit` elements (legacy counter.js): same idea, animated over
    3000ms with a 'swing' easing via jQuery's `.animate`, gated by a
    scroll-position visibility check + a `counter-loaded` guard class so it
    only ever runs once.

This rewrite uses IntersectionObserver to detect visibility (replacing the
waypoints/scroll-position check) and a requestAnimationFrame-driven
count-up (replacing jQuery.animate), for both `.counter` and `.count-digit`
selectors. Easing approximates jQuery's default 'swing' (ease-in-out).
*/

(function () {
  "use strict";

  function swingEase(t) {
    // Approximation of jQuery UI's default 'swing' easing.
    return 0.5 - Math.cos(t * Math.PI) / 2;
  }

  function animateCount(el, duration) {
    const target = parseFloat((el.textContent || "0").replace(/[^0-9.\-]/g, ""));
    if (isNaN(target)) return;

    const suffix = (el.textContent || "").replace(/^[\s0-9.,\-]+/, "");
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = swingEase(progress);
      const value = Math.ceil(target * eased);
      el.textContent = progress < 1 ? value + (progress < 1 ? "" : suffix) : Math.ceil(target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = Math.ceil(target) + suffix;
      }
    }
    requestAnimationFrame(step);
  }

  function observe(selector, duration, extraClasses) {
    const els = document.querySelectorAll(selector);
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          if (el.dataset.counterLoaded) return;
          el.dataset.counterLoaded = "true";
          if (extraClasses) {
            el.classList.add(...extraClasses);
          }
          animateCount(el, duration);
          obs.unobserve(el);
        });
      },
      { threshold: 0.2 }
    );

    els.forEach((el) => observer.observe(el));
  }

  function initCounters() {
    observe(".counter", 2000, ["animated", "fadeInDownBig"]);
    observe(".count-digit", 3000, ["counter-loaded"]);
  }

  document.addEventListener("DOMContentLoaded", initCounters);

  window.initCounters = initCounters;
})();
