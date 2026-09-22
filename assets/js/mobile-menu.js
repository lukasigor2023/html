/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

mobile-menu.js
--------------
Hand-rolled vanilla replacement for jquery.meanmenu.min.js.

Original call:
  $("#mobile-menu").meanmenu({
    meanMenuContainer: ".mobile-menu",
    meanScreenWidth: "991",
    meanExpand: ['<i class="ti ti-plus"></i>'],
  });

meanmenu, at that config, does the following at runtime:
  - Clones the source nav (#mobile-menu) into `.mobile-menu` as an
    off-canvas/dropdown mobile menu, below the `meanScreenWidth` (991px)
    breakpoint.
  - Adds a hamburger trigger toggling the whole menu open/closed.
  - Adds an expand icon (`meanExpand` markup) next to any item that has
    a submenu, toggling that submenu open/closed (accordion-style, only
    one submenu open at a time is NOT enforced by meanmenu itself).
  - Above the breakpoint, the mobile menu is hidden and the desktop nav
    shows normally (handled entirely by existing CSS media queries here,
    so this module only concerns itself with interaction, not visibility).

The `.mobile-menu` div that ships in the HTML (inside `.offcanvas-info`,
opened/closed by the already-working `.sidebar-menu`/`.offcanvas-info.show`
logic in script.js) is empty - the real meanmenu plugin populates it at
runtime by cloning the source nav (`#mobile-menu > ul.main-nav`) into a
`.mean-container > .mean-bar + .mean-nav` structure, which is what
assets/scss/vendors/meanmenu.scss and the `.mean-container` rules in
_header.scss/theme.scss actually style. Without that clone step the panel
opens but shows nothing, so this module builds it:
  1. buildMeanMenu() clones `#mobile-menu`'s nav into `.mobile-menu` as
     `.mean-container > .mean-bar (a.meanmenu-reveal) + .mean-nav > ul.main-nav`,
     matching real meanmenu's output markup. `.mean-nav > ul` is forced
     visible via `!important` in meanmenu.scss, so no open/close toggle is
     needed here beyond the existing offcanvas panel toggle.
  2. Each `.has-submenu` in the clone gets a `.mean-expand` sibling anchor
     (mirrors the original `meanExpand: ['<i class="ti ti-plus"></i>']`
     config) - required for the plus icon to render at all, since
     meanmenu.scss hides every other `<i>` inside `.mean-nav` links.
  3. Submenu accordion expand/collapse for `.has-submenu` items (this
     duplicates/replaces the `.has-submenu > a:first-child` click handler
     that used to live directly in script.js via slideToggle), extended to
     also trigger from a `.mean-expand` click.
*/

(function () {
  "use strict";

  function slideToggle(el, duration) {
    if (!el) return;
    const isHidden =
      getComputedStyle(el).display === "none" || el.style.maxHeight === "0px";
    if (isHidden) {
      slideDown(el, duration);
    } else {
      slideUp(el, duration);
    }
  }

  function slideUp(el, duration) {
    el.style.overflow = "hidden";
    el.style.transitionProperty = "height, margin, padding";
    el.style.transitionDuration = duration + "ms";
    el.style.height = el.offsetHeight + "px";
    el.offsetHeight; // reflow
    el.style.height = "0";
    el.style.paddingTop = "0";
    el.style.paddingBottom = "0";
    el.style.marginTop = "0";
    el.style.marginBottom = "0";
    window.setTimeout(() => {
      el.style.display = "none";
      el.classList.remove("submenu-open");
    }, duration);
  }

  function slideDown(el, duration) {
    el.style.removeProperty("display");
    let display = getComputedStyle(el).display;
    if (display === "none") display = "block";
    el.style.display = display;
    const height = el.offsetHeight;
    el.style.overflow = "hidden";
    el.style.height = "0";
    el.style.paddingTop = "0";
    el.style.paddingBottom = "0";
    el.style.marginTop = "0";
    el.style.marginBottom = "0";
    el.offsetHeight; // reflow
    el.style.transitionProperty = "height, margin, padding";
    el.style.transitionDuration = duration + "ms";
    el.style.height = height + "px";
    el.style.removeProperty("padding-top");
    el.style.removeProperty("padding-bottom");
    el.style.removeProperty("margin-top");
    el.style.removeProperty("margin-bottom");
    window.setTimeout(() => {
      el.style.removeProperty("height");
      el.style.removeProperty("overflow");
      el.style.removeProperty("transition-duration");
      el.style.removeProperty("transition-property");
      el.classList.add("submenu-open");
    }, duration);
  }

  function initSubmenuAccordion() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest(
        ".has-submenu > a:first-child, .has-submenu > .mean-expand"
      );
      if (!link) return;
      e.preventDefault();

      const parent = link.closest(".has-submenu");
      const submenu = parent.querySelector(":scope > ul.submenu");
      if (!submenu) return;

      // Close all other open submenus (mirrors the old
      // `.has-submenu`.not(parent).children('ul.submenu:visible').slideUp)
      document.querySelectorAll(".has-submenu").forEach((other) => {
        if (other === parent) return;
        const otherSubmenu = other.querySelector(":scope > ul.submenu");
        if (
          otherSubmenu &&
          getComputedStyle(otherSubmenu).display !== "none"
        ) {
          slideUp(otherSubmenu, 300);
        }
      });

      slideToggle(submenu, 300);
    });
  }

  // Some nav items (the "Pages" megamenu tab) carry ids consumed by
  // Bootstrap's tab data-api (id, href="#id", data-bs-target, aria-
  // labelledby). Cloning the nav verbatim would duplicate those ids in the
  // live DOM; document.querySelector always resolves the *first* match, so
  // clicking a tab in the real desktop nav could end up toggling the
  // (hidden) clone's pane instead of its own - looking like only the
  // pane already marked "active" in the HTML ever shows. Suffix every id
  // in the clone and rewrite the references that point at them so the
  // clone is fully self-contained.
  function dedupeIds(root, suffix) {
    const idMap = {};
    root.querySelectorAll("[id]").forEach((el) => {
      const newId = el.id + suffix;
      idMap[el.id] = newId;
      el.id = newId;
    });
    root.querySelectorAll('a[href^="#"]').forEach((el) => {
      const target = el.getAttribute("href").slice(1);
      if (idMap[target]) el.setAttribute("href", "#" + idMap[target]);
    });
    root.querySelectorAll("[data-bs-target]").forEach((el) => {
      const target = el.getAttribute("data-bs-target");
      if (target && target[0] === "#" && idMap[target.slice(1)]) {
        el.setAttribute("data-bs-target", "#" + idMap[target.slice(1)]);
      }
    });
    root.querySelectorAll("[aria-labelledby]").forEach((el) => {
      const target = el.getAttribute("aria-labelledby");
      if (idMap[target]) el.setAttribute("aria-labelledby", idMap[target]);
    });
    root.querySelectorAll("[aria-controls]").forEach((el) => {
      const target = el.getAttribute("aria-controls");
      if (idMap[target]) el.setAttribute("aria-controls", idMap[target]);
    });
  }

  // Clones #mobile-menu's nav into the empty `.mobile-menu` off-canvas
  // container as real meanmenu-shaped markup (see file header comment).
  function buildMeanMenu() {
    const source = document.getElementById("mobile-menu");
    const container = document.querySelector(".mobile-menu");
    if (!source || !container || container.querySelector(".mean-container")) {
      return;
    }
    const sourceNav = source.querySelector("ul.main-nav");
    if (!sourceNav) return;

    const meanContainer = document.createElement("div");
    meanContainer.className = "mean-container";

    const meanBar = document.createElement("div");
    meanBar.className = "mean-bar";
    const reveal = document.createElement("a");
    reveal.href = "#";
    reveal.className = "meanmenu-reveal";
    reveal.innerHTML = "<span></span><span></span><span></span>";
    meanBar.appendChild(reveal);

    const meanNav = document.createElement("div");
    meanNav.className = "mean-nav";
    const clonedNav = sourceNav.cloneNode(true);
    dedupeIds(clonedNav, "-mean");
    meanNav.appendChild(clonedNav);

    meanContainer.appendChild(meanBar);
    meanContainer.appendChild(meanNav);
    container.appendChild(meanContainer);

    // meanExpand: add the plus-icon toggle next to every item that has a
    // submenu, and start every submenu collapsed in this cloned copy only.
    clonedNav.querySelectorAll(".has-submenu").forEach((item) => {
      const link = item.querySelector(":scope > a:first-child");
      const submenu = item.querySelector(":scope > ul.submenu");
      if (!link || !submenu) return;
      const expand = document.createElement("a");
      expand.href = "#";
      expand.className = "mean-expand";
      expand.innerHTML = '<i class="ti ti-plus"></i>';
      link.insertAdjacentElement("afterend", expand);
      submenu.style.display = "none";
    });
  }

  // script.js also calls window.initMobileMenu() explicitly on
  // DOMContentLoaded (its own generic plugin-init pass), in addition to the
  // listener registered below - guard against running twice, since
  // initSubmenuAccordion() has no other way to avoid double-registering its
  // document click listener, which made every submenu toggle open and then
  // immediately re-close within the same click.
  let initialized = false;

  function initMobileMenu() {
    if (initialized) return;
    initialized = true;
    buildMeanMenu();
    initSubmenuAccordion();
  }

  document.addEventListener("DOMContentLoaded", initMobileMenu);

  window.initMobileMenu = initMobileMenu;
})();
