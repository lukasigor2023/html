/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

carousels.js
-------------
Vanilla replacement for every owlCarousel / slick instance previously
initialized in script.js. Uses Swiper 11 (assets/plugins/swiper/swiper-bundle.min.js).

IMPORTANT MARKUP NOTE (for the later HTML-rollout step):
Swiper expects the following DOM structure inside each carousel root:
  <div class="my-slider swiper">
    <div class="swiper-wrapper">
      <div class="swiper-slide"> ... one item ... </div>
      <div class="swiper-slide"> ... </div>
    </div>
  </div>
Current markup was built for owlCarousel/slick (flat list of item divs with
no wrapper). This module is defensive: on init it will look for an existing
`.swiper-wrapper` inside the root; if none is found it will auto-wrap the
root's direct children in a `.swiper-wrapper` and tag each child
`.swiper-slide` at runtime, so it keeps working even before the HTML pass
rewrites markup. Once the HTML step adds proper Swiper markup by hand,
the auto-wrap branch below simply becomes a no-op.

Navigation/pagination elements (`.swiper-button-next/prev`, `.swiper-pagination`)
are also created on the fly, matching the nav/dots options that each
original owlCarousel/slick instance used, and re-using the same icon
markup (navText) that was passed to owlCarousel.
*/

(function () {
  "use strict";

  if (typeof Swiper === "undefined") {
    return;
  }

  // Ensure a Swiper-compatible structure exists inside `root`.
  // Returns true if the structure was already Swiper-shaped or was fixed up.
  function ensureSwiperMarkup(root) {
    root.classList.add("swiper");
    let wrapper = root.querySelector(":scope > .swiper-wrapper");
    if (!wrapper) {
      wrapper = document.createElement("div");
      wrapper.className = "swiper-wrapper";
      const children = Array.from(root.children);
      children.forEach((child) => {
        // Wrap in a dedicated slide div instead of adding the swiper-slide
        // class straight onto `child` - the original element usually already
        // carries its own layout classes (e.g. "place-item mb-4 flex-fill"),
        // and merging swiper-slide's box-model onto the same element fights
        // those and collapses the design.
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        child.replaceWith(slide);
        slide.appendChild(child);
        wrapper.appendChild(slide);
      });
      root.appendChild(wrapper);
    } else {
      Array.from(wrapper.children).forEach((child) =>
        child.classList.add("swiper-slide")
      );
    }
    return wrapper;
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

  // Convert an owlCarousel-style `responsive: {0:{items:n}, 576:{items:n}, ...}`
  // map into Swiper's `breakpoints: {576:{slidesPerView:n}, ...}` map.
  // owlCarousel's `0` breakpoint === Swiper's base config (slidesPerView at root).
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

  // Generic owlCarousel -> Swiper initializer.
  // opts: { loop, margin, nav, dots, autoplay, smartSpeed, navText, responsive }
  function initOwlLikeSwiper(selector, opts) {
    document.querySelectorAll(selector).forEach((root) => {
      if (root.swiper) return; // already initialized
      ensureSwiperMarkup(root);

      const { base, breakpoints } = responsiveToBreakpoints(
        opts.responsive,
        opts.margin || 0
      );

      const config = {
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

  // Generic slick -> Swiper initializer (non-thumb-synced sliders).
  function initSlickLikeSwiper(selector, opts) {
    document.querySelectorAll(selector).forEach((root) => {
      if (root.swiper) return;
      ensureSwiperMarkup(root);

      const config = {
        loop: !!opts.infinite,
        slidesPerView: opts.slidesToShow || 1,
        slidesPerGroup: opts.slidesToScroll || 1,
        spaceBetween: opts.margin || 0,
        speed: opts.speed || 300,
        centeredSlides: !!opts.centerMode,
        autoplay: opts.autoplay
          ? { delay: opts.autoplayDelay || 3000, disableOnInteraction: false }
          : false,
        breakpoints: opts.breakpoints || {},
      };

      if (opts.arrows) {
        let prevEl =
          (opts.prevSelector && document.querySelector(opts.prevSelector)) ||
          null;
        let nextEl =
          (opts.nextSelector && document.querySelector(opts.nextSelector)) ||
          null;
        if (!prevEl || !nextEl) {
          const nav = addNav(root, null);
          prevEl = prevEl || nav.prevEl;
          nextEl = nextEl || nav.nextEl;
        }
        config.navigation = { prevEl, nextEl };
      }
      if (opts.dots) {
        const el = addPagination(root);
        config.pagination = { el, clickable: true };
      }

      new Swiper(root, config);
    });
  }

  // slick "responsive" array -> Swiper breakpoints map.
  // slick breakpoints are "max-width" style (apply below breakpoint), Swiper's
  // are "min-width" style, so we translate the settings to the nearest
  // equivalent min-width tiers, preserving the smallest (breakpoint:0) as base.
  function slickResponsiveToBreakpoints(responsiveArr, baseSlidesToShow, spaceBetween) {
    const breakpoints = {};
    (responsiveArr || [])
      .slice()
      .sort((a, b) => a.breakpoint - b.breakpoint)
      .forEach((entry) => {
        if (entry.breakpoint === 0) return; // handled as base already
        const settings = entry.settings === "unslick" ? {} : entry.settings || {};
        breakpoints[entry.breakpoint] = {
          slidesPerView: settings.slidesToShow || baseSlidesToShow,
          slidesPerGroup: settings.slidesToScroll || 1,
          spaceBetween: spaceBetween || 0,
        };
      });
    return breakpoints;
  }

  function initCarousels() {
    // ---- owlCarousel-derived sliders (main site, script.js) ----
    initOwlLikeSwiper(".banner-slider", {
      loop: true, margin: 0, nav: false, dots: true, autoplay: false, smartSpeed: 2000, direction: "vertical",
      navText: ["<i class='fa-solid fa-arrow-left'></i>", "<i class='fa-solid fa-arrow-right'></i>"],
      responsive: { 0: { items: 1 }, 550: { items: 1 }, 1200: { items: 1 } },
    });

    initOwlLikeSwiper(".destination-slider", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 }, 1200: { items: 4 } },
    });

    initOwlLikeSwiper(".cruise-slider", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 2 }, 576: { items: 3 }, 992: { items: 3 }, 1200: { items: 6 } },
    });

    initOwlLikeSwiper(".experts-slider", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 }, 1200: { items: 4 } },
    });

    initOwlLikeSwiper(".client-slider", {
      loop: true, margin: 24, nav: false, dots: false, autoplay: true, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 2 }, 576: { items: 3 }, 992: { items: 4 }, 1200: { items: 5 }, 1400: { items: 7 } },
    });

    initOwlLikeSwiper(".testimonial-slider", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='isax isax-arrow-left-2'></i>", "<i class='isax isax-arrow-right-3'></i>"],
      responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 3 } },
    });

    initOwlLikeSwiper(".tour-gallery-slider", {
      loop: false, margin: 8, nav: false, dots: false, autoplay: false,
      responsive: { 0: { items: 2 }, 550: { items: 4 }, 992: { items: 4 }, 1200: { items: 5 }, 1400: { items: 6 } },
    });

    initOwlLikeSwiper(".tours-slider", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 }, 576: { items: 3 }, 992: { items: 4 }, 1200: { items: 5 } },
    });

    initOwlLikeSwiper(".cars-slider", {
      loop: false, margin: 24, nav: false, dots: true, smartSpeed: 2000, autoplay: false,
      navText: ["<i class='isax isax-arrow-left-2'></i>", "<i class='isax isax-arrow-right-3'></i>"],
      responsive: { 0: { items: 1 }, 550: { items: 1 }, 769: { items: 2 }, 993: { items: 3 }, 1200: { items: 3 }, 1400: { items: 4 } },
    });

    initOwlLikeSwiper(".activity-slider", {
      loop: false, margin: 12, nav: false, dots: false, smartSpeed: 2000, autoplay: false,
      navText: ["<i class='isax isax-arrow-left-2'></i>", "<i class='isax isax-arrow-right-3'></i>"],
      responsive: { 0: { items: 1.5 }, 550: { items: 1.5 }, 769: { items: 2.5 }, 993: { items: 4.5 }, 1200: { items: 4.5 }, 1400: { items: 5.5 } },
    });

    initOwlLikeSwiper(".place-slider", {
      loop: false, margin: 24, nav: true, dots: false, smartSpeed: 2000, autoplay: false,
      navText: ["<i class='isax isax-arrow-left-2'></i>", "<i class='isax isax-arrow-right-3'></i>"],
      responsive: { 0: { items: 1 }, 550: { items: 1 }, 768: { items: 2 }, 992: { items: 3 }, 1200: { items: 3 }, 1400: { items: 4 } },
    });

    initOwlLikeSwiper(".img-slider", {
      loop: true, margin: 20, nav: true, dots: true, smartSpeed: 2000, autoplay: false,
      navText: ['<i class="fa-solid fa-chevron-left"></i>', '<i class="fa-solid fa-chevron-right"></i>'],
      responsive: { 0: { items: 1 }, 550: { items: 1 }, 768: { items: 1 }, 1000: { items: 1 } },
    });

    initOwlLikeSwiper(".blog-slider", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 }, 1200: { items: 3 } },
    });

    initOwlLikeSwiper(".travelers-slider", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 }, 1300: { items: 4 }, 1400: { items: 5 } },
    });

    initOwlLikeSwiper(".client-slider-two", {
      loop: true, margin: 24, nav: false, dots: false, autoplay: true, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 2 }, 576: { items: 3 }, 992: { items: 4 }, 1200: { items: 5 }, 1400: { items: 6 } },
    });

    // NOTE: original used navContainer:'.slide-nav' (external nav) - kept as
    // internally-generated nav buttons since no `.slide-nav` markup audit was
    // done here; adjust selector in HTML step if a dedicated nav container exists.
    initOwlLikeSwiper(".offer-slider", {
      loop: true, margin: 24, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 }, 576: { items: 1 }, 1400: { items: 1 } },
    });

    initOwlLikeSwiper(".location-slider", {
      loop: true, margin: 24, nav: false, dots: true, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 }, 576: { items: 2 }, 992: { items: 3 }, 1200: { items: 5 } },
    });

    initOwlLikeSwiper(".testimonial-slider-three", {
      loop: true, margin: 24, nav: false, dots: true, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='isax isax-arrow-left-2'></i>", "<i class='isax isax-arrow-right-3'></i>"],
      responsive: { 0: { items: 1 }, 768: { items: 2 }, 1200: { items: 3.5 } },
    });

    initOwlLikeSwiper(".popular-hotel-slider", {
      loop: true, margin: 24, nav: false, dots: false, autoplay: false, smartSpeed: 2000,
      responsive: { 0: { items: 1 }, 576: { items: 1 }, 991: { items: 3 }, 1300: { items: 3 }, 1400: { items: 4 } },
    });

    initOwlLikeSwiper(".room-slider", {
      loop: true, margin: 0, nav: true, dots: false, autoplay: false, smartSpeed: 2000,
      navText: ["<i class='fa-solid fa-chevron-left'></i>", "<i class='fa-solid fa-chevron-right'></i>"],
      responsive: { 0: { items: 1 } },
    });

    initOwlLikeSwiper(".categories-slider-six", {
      loop: true, margin: 24, nav: false, dots: true, autoplay: false, smartSpeed: 2000,
      responsive: { 0: { items: 1 }, 768: { items: 2 }, 1300: { items: 4 }, 1400: { items: 5 } },
    });

    initOwlLikeSwiper(".providers-slider", {
      loop: true, margin: 24, nav: false, dots: true, autoplay: false, smartSpeed: 2000,
      responsive: { 0: { items: 1 }, 768: { items: 2 }, 1300: { items: 3 }, 1400: { items: 4 } },
    });

    // ---- Thumbnail-synced sliders (owlCarousel main+thumbs) ----
    // Scoped by class, not the #large-img/#small-img ids: those ids are
    // reused on the unrelated .vertical-slider/.home-vertical-slider pages
    // (car-details, tour-details, index-4, index-9) for a structurally
    // different vertical thumb rail. A bare id selector here would grab
    // those elements first (since this call runs before
    // initVerticalThumbSwiper below) and wrongly turn them into this
    // horizontal fade+arrows carousel instead.
    initSyncedThumbSwiper(".service-carousel", ".slider-nav-thumbnails", { slidesPerViewThumbs: 5 });

    // ---- Vertical slider (slick .slider-for / .slider-nav, thumbs synced, vertical) ----
    initVerticalThumbSwiper(".vertical-slider", ".slider-for", ".slider-nav", { thumbsToShow: 4, navArrows: true });
    initVerticalThumbSwiper(".home-vertical-slider", ".slider-fors", ".slider-nav", { thumbsToShow: 3, mainSelectorIsAlt: true });

    // ---- slick-derived sliders ----
    initSlickLikeSwiper(".partners-slider", {
      infinite: true, speed: 2000, slidesToShow: 5, slidesToScroll: 1, autoplay: true, arrows: false, margin: 24,
      breakpoints: slickResponsiveToBreakpoints([
        { breakpoint: 1400, settings: { slidesToShow: 5, slidesToScroll: 1 } },
        { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 1 } },
        { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 768, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      ], 5, 24),
    });

    initSlickLikeSwiper(".blog-ten-slider", {
      infinite: true, speed: 2000, slidesToShow: 3, slidesToScroll: 1, autoplay: false, arrows: true, margin: 24,
      prevSelector: ".blog-ten-prev", nextSelector: ".blog-ten-next",
      breakpoints: slickResponsiveToBreakpoints([
        { breakpoint: 1400, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      ], 3, 24),
    });

    initSlickLikeSwiper(".activities-slider-twelve", {
      infinite: true, speed: 2000, slidesToShow: 1, slidesToScroll: 1, autoplay: false, arrows: true, margin: 24,
      prevSelector: ".activities-twelve-prev", nextSelector: ".activities-twelve-next",
      breakpoints: slickResponsiveToBreakpoints([
        { breakpoint: 1400, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      ], 4, 24),
    });

    initSlickLikeSwiper(".trending-list-slider", {
      infinite: true, speed: 2000, slidesToShow: 4, slidesToScroll: 1, autoplay: false, arrows: true, margin: 24,
      prevSelector: ".restaurant-prev", nextSelector: ".restaurant-next",
      breakpoints: slickResponsiveToBreakpoints([
        { breakpoint: 1400, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 1200, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 768, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      ], 4, 24),
    });

    initSlickLikeSwiper(".explore-slider", {
      infinite: true, speed: 2000, slidesToShow: 4, slidesToScroll: 1, autoplay: false, arrows: true, margin: 24,
      prevSelector: ".restaurant-prev", nextSelector: ".restaurant-next",
      breakpoints: slickResponsiveToBreakpoints([
        { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 1 } },
        { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
        { breakpoint: 576, settings: { slidesToShow: 1, slidesToScroll: 1 } },
      ], 4, 24),
    });

    initSlickLikeSwiper(".destinations-slider", {
      infinite: true, speed: 2000, slidesToShow: 4, slidesToScroll: 1, autoplay: false, arrows: true, margin: 24,
      prevSelector: ".destinations-sec-nine .restaurant-prev", nextSelector: ".destinations-sec-nine .restaurant-next",
      breakpoints: slickResponsiveToBreakpoints([
        { breakpoint: 1200, settings: { slidesToShow: 4 } },
        { breakpoint: 992, settings: { slidesToShow: 3 } },
        { breakpoint: 700, settings: { slidesToShow: 2 } },
        { breakpoint: 400, settings: { slidesToShow: 1 } },
      ], 4, 24),
    });

    initSlickLikeSwiper(".testimonial-slider-nine", {
      infinite: true, speed: 2000, slidesToShow: 2, slidesToScroll: 1, autoplay: false, arrows: true,  margin: 24,
      prevSelector: ".testimonials-nine .restaurant-prev", nextSelector: ".testimonials-nine .restaurant-next",
      breakpoints: slickResponsiveToBreakpoints([
        { breakpoint: 0, settings: { slidesToShow: 2 } },
        { breakpoint: 992, settings: { slidesToShow: 2 } },
      ], 2, 24),
    });

    initSlickLikeSwiper(".blog-nine-slider", {
      infinite: true, speed: 2000, slidesToShow: 2, slidesToScroll: 1, autoplay: false, arrows: false,margin: 24,
      breakpoints: slickResponsiveToBreakpoints([
        { breakpoint: 0, settings: { slidesToShow: 1 } },
        { breakpoint: 992, settings: { slidesToShow: 2} },
      ], 2, 24),
    });

    initSlickLikeSwiper(".clients-slider", {
      infinite: true, speed: 2000, slidesToShow: 6, slidesToScroll: 1, autoplay: false, arrows: false, margin: 24,
      breakpoints: slickResponsiveToBreakpoints([
        { breakpoint: 1400, settings: { slidesToShow: 5, slidesToScroll: 1 } },
        { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 1 } },
        { breakpoint: 991, settings: { slidesToShow: 3, slidesToScroll: 1 } },
        { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      ], 6, 24),
    });
  }

  // Service carousel: main image gallery (.service-carousel) synced with a
  // thumbnail strip (.slider-nav-thumbnails), replicating the owlCarousel
  // changed.owl.carousel sync behaviour via Swiper's built-in Thumbs module.
  function initSyncedThumbSwiper(mainSelector, thumbsSelector, opts) {
    const mainEl = document.querySelector(mainSelector);
    const thumbsEl = document.querySelector(thumbsSelector);
    if (!mainEl || !thumbsEl) return;

    ensureSwiperMarkup(thumbsEl);
    ensureSwiperMarkup(mainEl);

    const thumbsSwiper = new Swiper(thumbsEl, {
      slidesPerView: opts.slidesPerViewThumbs || 5,
      spaceBetween: 10,
      speed: 2000,
      watchSlidesProgress: true,
      navigation: (() => {
        const { prevEl, nextEl } = addNav(thumbsEl, [
          '<i class="fa-solid fa-chevron-left"></i>',
          '<i class="fa-solid fa-chevron-right"></i>',
        ]);
        return { prevEl, nextEl };
      })(),
    });

    new Swiper(mainEl, {
      loop: true,
      speed: 2000,
      navigation: (() => {
        const { prevEl, nextEl } = addNav(mainEl, [
          '<i class="fa-solid fa-chevron-left"></i>',
          '<i class="fa-solid fa-chevron-right"></i>',
        ]);
        return { prevEl, nextEl };
      })(),
      thumbs: { swiper: thumbsSwiper },
    });
  }

  // Vertical slider: a single big "for" slide, synced with a vertical
  // "nav" thumbnail rail (asNavFor in slick). Uses Swiper Thumbs + a
  // `direction:'vertical'` nav swiper, collapsing to horizontal on mobile
  // like the original responsive config did (breakpoint:0 => vertical:false).
  function initVerticalThumbSwiper(wrapSelector, forSelector, navSelector, opts) {
    const wraps = document.querySelectorAll(wrapSelector);
    if (!wraps.length) return;

    wraps.forEach((wrap) => {
      const forEl = wrap.querySelector(forSelector) || document.querySelector(forSelector);
      const navEl = wrap.querySelector(navSelector) || document.querySelector(navSelector);
      if (!forEl || !navEl || forEl.swiper || navEl.swiper) return;

      ensureSwiperMarkup(forEl);
      ensureSwiperMarkup(navEl);

      // FIX 1: Read the option value safely with a fallback default configuration
      const maxThumbs = opts && opts.thumbsToShow ? opts.thumbsToShow : 3;

      const navConfig = {
        direction: window.innerWidth > 0 && window.innerWidth < 580 ? "horizontal" : "vertical",
        slidesPerView: maxThumbs, // Sets desktop view
        watchSlidesProgress: true,
        speed: 300,
        breakpoints: {
          0: { direction: "horizontal", slidesPerView: 1 },
          // FIX 2: Ensure the responsive layout steps never exceed your custom ceiling rule
          580: { direction: "vertical", slidesPerView: Math.min(2, maxThumbs) },
          768: { direction: "vertical", slidesPerView: Math.min(3, maxThumbs) },
          992: { direction: "vertical", slidesPerView: maxThumbs },
        },
      };

      // .vertical-slider (car/tour-details) ships its own up/down scroll
      // arrows styled in tour-details.scss (.slider-nav .swiper-button-prev/
      // -next) - create them here, since without navigation config Swiper
      // never builds prev/next elements and those styles matched nothing.
      if (opts.navArrows) {
        const { prevEl, nextEl } = addNav(navEl, opts.navText || [
          '<i class="fa-solid fa-chevron-up"></i>',
          '<i class="fa-solid fa-chevron-down"></i>',
        ]);
        navConfig.navigation = { prevEl, nextEl };
      }

      const navSwiper = new Swiper(navEl, navConfig);

      new Swiper(forEl, {
        effect: "fade",
        speed: 300,
        thumbs: { swiper: navSwiper },
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initCarousels);

  window.initCarousels = initCarousels;
})();
