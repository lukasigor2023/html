/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

lightbox.js
-----------
Vanilla replacement for $.fancybox, backed by GLightbox
(assets/plugins/glightbox/glightbox.min.js).

The template markup that triggers fancybox typically uses
`data-fancybox` / `data-fancybox="gallery"` attributes on anchor tags
wrapping images (gallery grids, tour/hotel/car photo popups, etc).
GLightbox's default selector is `.glightbox`, so this module normalizes
both by binding GLightbox to any element carrying either a `data-fancybox`
attribute or a `.glightbox`/`.fancybox` class, grouping by the
`data-fancybox` value (or `data-gallery`) exactly like fancybox grouped by
its `data-fancybox="groupName"` value.
*/

(function () {
  "use strict";

  if (typeof GLightbox === "undefined") {
    return;
  }

  function initLightbox() {
    const triggers = document.querySelectorAll(
      "[data-fancybox], .glightbox, .fancybox"
    );
    if (!triggers.length) return;

    triggers.forEach((el) => {
      el.classList.add("glightbox");
      const group = el.getAttribute("data-fancybox");
      if (group && !el.getAttribute("data-gallery")) {
        el.setAttribute("data-gallery", group);
      }
    });

    window.dreamsLightbox = GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      loop: false,
      autoplayVideos: true,
    });
  }

  document.addEventListener("DOMContentLoaded", initLightbox);

  window.initLightbox = initLightbox;
})();
