/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

Vanilla rewrite of the RTL-page owlCarousel instances, using Swiper with
`dir: "rtl"` (Swiper's built-in RTL support - the direct analogue of
owlCarousel's `rtl: true` option). Shares the same markup-normalization
helpers pattern as assets/js/carousels.js (kept self-contained here since
this file only ever loads on RTL page variants).
*/

(function () {
  "use strict";

  if (typeof Swiper === "undefined") {
    return;
  }

  function ensureSwiperMarkup(root) {
    root.classList.add("swiper");
    let wrapper = root.querySelector(":scope > .swiper-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "swiper-wrapper";
      Array.from(root.children).forEach((child) => {
        child.classList.add("swiper-slide");
        wrapper.appendChild(child);
      });
      root.appendChild(wrapper);
    } else {
      Array.from(wrapper.children).forEach((child) => child.classList.add("swiper-slide"));
    }
  }

  function addNav(root, navText) {
    let prevEl = root.querySelector(".swiper-button-prev");
    let nextEl = root.querySelector(".swiper-button-next");
    if (!prevEl) {
      prevEl = document.createElement("div");
      prevEl.className = "swiper-button-prev";
      prevEl.innerHTML = (navText && navText[0]) || "";
      root.appendChild(prevEl);
    }
    if (!nextEl) {
      nextEl = document.createElement("div");
      nextEl.className = "swiper-button-next";
      nextEl.innerHTML = (navText && navText[1]) || "";
      root.appendChild(nextEl);
    }
    return { prevEl, nextEl };
  }

  function addPagination(root) {
    let el = root.querySelector(".swiper-pagination");
    if (!el) {
      el = document.createElement("div");
      el.className = "swiper-pagination";
      root.appendChild(el);
    }
    return el;
  }

  function responsiveToBreakpoints(responsive, spaceBetween) {
    const breakpoints = {};
    let base = { slidesPerView: 1, spaceBetween: spaceBetween };
    Object.keys(responsive || {})
      .map(Number)
      .sort((a, b) => a - b)
      .forEach((bp) => {
        const items = responsive[bp].items;
        if (bp === 0) {
          base.slidesPerView = items;
        } else {
          breakpoints[bp] = { slidesPerView: items, spaceBetween: spaceBetween };
        }
      });
    return { base, breakpoints };
  }

  function initRtlSwiper(selector, opts) {
    document.querySelectorAll(selector).forEach((root) => {
      if (root.swiper) return;
      ensureSwiperMarkup(root);

      const { base, breakpoints } = responsiveToBreakpoints(opts.responsive, opts.margin || 0);

      const config = {
        dir: "rtl",
        loop: !!opts.loop,
        slidesPerView: base.slidesPerView,
        spaceBetween: base.spaceBetween,
        speed: opts.smartSpeed || 300,
        breakpoints: breakpoints,
        autoplay: opts.autoplay
          ? { delay: opts.autoplayDelay || 3000, disableOnInteraction: false }
          : false,
      };
      if (opts.direction) {
        config.direction = opts.direction;
      }

      if (opts.nav) {
        const { prevEl, nextEl } = addNav(root, opts.navText);
        config.navigation = { prevEl, nextEl };
      }
      if (opts.dots) {
        const el = addPagination(root);
        config.pagination = { el, clickable: true };
      }

      new Swiper(root, config);
    });
  }

  function initRtlCarousels() {
    initRtlSwiper(".banner-slider-rtl", {
      loop: true, margin: 0, nav: false, dots: true, autoplay: false, smartSpeed: 2000,direction: "vertical",
      navText: ["<i class='fa-solid fa-arrow-left'></i>", "<i class='fa-solid fa-arrow-right'></i>"],
      responsive: { 0: { items: 1 }, 550: { items: 1 }, 1200: { items: 1 } },
    });

    initRtlSwiper(".destination-sliders", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 }, 1200: { items: 4 } },
    });

    initRtlSwiper(".place-slider-rtl", {
      loop: false, margin: 24, nav: true, dots: false, smartSpeed: 2000, autoplay: false,
      navText: ["<i class='isax isax-arrow-left-2'></i>", "<i class='isax isax-arrow-right-3'></i>"],
      responsive: { 0: { items: 1 }, 550: { items: 1 }, 768: { items: 2 }, 992: { items: 3 }, 1200: { items: 3 }, 1400: { items: 4 } },
    });

    initRtlSwiper(".img-slider-rtl", {
      loop: true, margin: 20, nav: true, dots: true, smartSpeed: 2000, autoplay: false,
      navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],
      responsive: { 0: { items: 1 }, 550: { items: 1 }, 768: { items: 1 }, 1000: { items: 1 } },
    });

    initRtlSwiper(".experts-slider-rtl", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 }, 1200: { items: 4 } },
    });

    initRtlSwiper(".client-slider-rtl", {
      loop: true, margin: 24, nav: false, dots: false, autoplay: true, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 2 }, 576: { items: 3 }, 992: { items: 4 }, 1200: { items: 5 }, 1400: { items: 7 } },
    });

    initRtlSwiper(".testimonial-slider-rtl", {
      loop: true, margin: 24, nav: false, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='isax isax-arrow-left-2'></i>", "<i class='isax isax-arrow-right-3'></i>"],
      responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 3 } },
    });
  }

  document.addEventListener("DOMContentLoaded", initRtlCarousels);

  window.initRtlCarousels = initRtlCarousels;
})();
