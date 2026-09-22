/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

sticky-sidebar.js
-----------------
Vanilla replacement for theia-sticky-sidebar.

Original calls (script.js, only above 1199px viewport width, matching
`additionalMarginTop: 30`):
  if ($(window).width() > 1199) {
    $('.theiaStickySidebar').theiaStickySidebar({ additionalMarginTop: 30 });
  }

Modern CSS `position: sticky` covers the bulk of this behaviour. This
module applies a `.sticky-sidebar-active` class (see accompanying CSS,
`position: sticky; top: 30px;`) above the 1199px breakpoint, and does a
lightweight boundary check on scroll so the sidebar never overflows past
the bottom of its parent container (theiaStickySidebar's "additional
margin" + inner-scroll boundary behaviour) by clamping `top` inline once
the sidebar's bottom edge would pass its container's bottom edge.
*/

(function () {
  "use strict";

  const BREAKPOINT = 1199;
  const MARGIN_TOP = 30;

  function applySticky(el) {
    el.classList.add("sticky-sidebar-active");
    el.style.position = "sticky";
    el.style.top = MARGIN_TOP + "px";
  }

  function removeSticky(el) {
    el.classList.remove("sticky-sidebar-active");
    el.style.position = "";
    el.style.top = "";
  }

  function clampToContainer(el) {
    const container = el.parentElement;
    if (!container) return;
    const containerRect = container.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const viewportBottom = window.innerHeight;

    // If the sidebar (stuck at MARGIN_TOP) would overflow the bottom of its
    // container, reduce its "stuck" offset so its bottom edge lines up with
    // the container's bottom edge instead of spilling out of it.
    const overflow = elRect.bottom - containerRect.bottom;
    if (overflow > 0) {
      const newTop = Math.max(MARGIN_TOP - overflow, containerRect.top - viewportBottom + elRect.height);
      el.style.top = Math.min(MARGIN_TOP, Math.max(0, MARGIN_TOP - overflow)) + "px";
    } else {
      el.style.top = MARGIN_TOP + "px";
    }
  }

  function update() {
    const sidebars = document.querySelectorAll(".theiaStickySidebar");
    if (!sidebars.length) return;

    if (window.innerWidth > BREAKPOINT) {
      sidebars.forEach((el) => {
        applySticky(el);
        clampToContainer(el);
      });
    } else {
      sidebars.forEach(removeSticky);
    }
  }

  function initStickySidebar() {
    const sidebars = document.querySelectorAll(".theiaStickySidebar");
    if (!sidebars.length) return;
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
  }

  document.addEventListener("DOMContentLoaded", initStickySidebar);

  window.initStickySidebar = initStickySidebar;
})();
