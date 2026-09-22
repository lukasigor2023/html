/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

range-slider.js
----------------
Hand-rolled vanilla dual-range slider, replacing ionRangeSlider
(assets/plugins/ion-rangeslider). No live call sites for ionRangeSlider
were found wired into the current page markup (only the plugin's own demo
initializer, assets/plugins/ion-rangeslider/js/custom-rangeslider.js,
targeting #range_01.. #range_16 demo IDs) - this module implements a
general-purpose reusable replacement matching ionRangeSlider's typical
price-range behaviour (min/max/from/to/step, draggable handles, connecting
bar, on-change callback) so it is ready to wire up wherever a price-range
filter is added to the HTML.

Usage (element-driven config via data attributes):
  <div class="range-slider"
       data-range-slider
       data-min="0" data-max="1000"
       data-from="200" data-to="800"
       data-step="10"
       data-prefix="$"
       data-from-input="#price-from"
       data-to-input="#price-to"
       data-from-display="#price-from-display"
       data-to-display="#price-to-display">
  </div>

initRangeSliders() builds, for every `[data-range-slider]` element:
  - a track + filled connecting bar
  - two draggable handles (single-handle mode if data-to is omitted)
  - optional linked <input>/display elements kept in sync
  - a CustomEvent('rangechange', { detail: { from, to } }) dispatched on the
    slider element itself on every change, as the "on-change callback".
*/

(function () {
  "use strict";

  function clamp(v, min, max) {
    return Math.min(Math.max(v, min), max);
  }

  function snap(value, min, step) {
    return Math.round((value - min) / step) * step + min;
  }

  function buildSlider(root) {
    const min = parseFloat(root.dataset.min || "0");
    const max = parseFloat(root.dataset.max || "100");
    const step = parseFloat(root.dataset.step || "1");
    const prefix = root.dataset.prefix || "";
    const postfix = root.dataset.postfix || "";
    const isRange = root.dataset.to !== undefined;
    let from = parseFloat(root.dataset.from !== undefined ? root.dataset.from : min);
    let to = parseFloat(isRange ? root.dataset.to : max);

    const fromInput = root.dataset.fromInput ? document.querySelector(root.dataset.fromInput) : null;
    const toInput = root.dataset.toInput ? document.querySelector(root.dataset.toInput) : null;
    const fromDisplay = root.dataset.fromDisplay ? document.querySelector(root.dataset.fromDisplay) : null;
    const toDisplay = root.dataset.toDisplay ? document.querySelector(root.dataset.toDisplay) : null;

    root.classList.add("range-slider-track");
    root.innerHTML = "";

    const bar = document.createElement("div");
    bar.className = "range-slider-bar";
    root.appendChild(bar);

    const fromHandle = document.createElement("span");
    fromHandle.className = "range-slider-handle range-slider-handle-from";
    fromHandle.setAttribute("role", "slider");
    fromHandle.setAttribute("tabindex", "0");
    root.appendChild(fromHandle);

    let toHandle = null;
    if (isRange) {
      toHandle = document.createElement("span");
      toHandle.className = "range-slider-handle range-slider-handle-to";
      toHandle.setAttribute("role", "slider");
      toHandle.setAttribute("tabindex", "0");
      root.appendChild(toHandle);
    }

    function valueToPercent(v) {
      return ((v - min) / (max - min)) * 100;
    }

    function render() {
      const fromPct = valueToPercent(from);
      const toPct = isRange ? valueToPercent(to) : 100;
      fromHandle.style.left = fromPct + "%";
      if (toHandle) toHandle.style.left = toPct + "%";
      bar.style.left = (isRange ? fromPct : 0) + "%";
      bar.style.width = (isRange ? toPct - fromPct : fromPct) + "%";

      fromHandle.setAttribute("aria-valuenow", from);
      fromHandle.setAttribute("aria-valuemin", min);
      fromHandle.setAttribute("aria-valuemax", max);

      if (fromInput) fromInput.value = from;
      if (toInput && isRange) toInput.value = to;
      if (fromDisplay) fromDisplay.textContent = prefix + from + postfix;
      if (toDisplay && isRange) toDisplay.textContent = prefix + to + postfix;

      root.dispatchEvent(
        new CustomEvent("rangechange", { detail: isRange ? { from, to } : { from } })
      );
    }

    function positionToValue(clientX) {
      const rect = root.getBoundingClientRect();
      const pct = clamp((clientX - rect.left) / rect.width, 0, 1);
      return clamp(snap(min + pct * (max - min), min, step), min, max);
    }

    function startDrag(handle, which) {
      function onMove(e) {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let value = positionToValue(clientX);
        if (which === "from") {
          from = isRange ? Math.min(value, to) : value;
        } else {
          to = Math.max(value, from);
        }
        render();
      }
      function onUp() {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
        document.removeEventListener("touchmove", onMove);
        document.removeEventListener("touchend", onUp);
      }
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      document.addEventListener("touchmove", onMove, { passive: true });
      document.addEventListener("touchend", onUp);
    }

    fromHandle.addEventListener("mousedown", () => startDrag(fromHandle, "from"));
    fromHandle.addEventListener("touchstart", () => startDrag(fromHandle, "from"), { passive: true });
    fromHandle.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { from = clamp(from - step, min, isRange ? to : max); render(); }
      if (e.key === "ArrowRight") { from = clamp(from + step, min, isRange ? to : max); render(); }
    });

    if (toHandle) {
      toHandle.addEventListener("mousedown", () => startDrag(toHandle, "to"));
      toHandle.addEventListener("touchstart", () => startDrag(toHandle, "to"), { passive: true });
      toHandle.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") { to = clamp(to - step, from, max); render(); }
        if (e.key === "ArrowRight") { to = clamp(to + step, from, max); render(); }
      });
    }

    // Clicking directly on the track jumps the nearest handle to that point.
    root.addEventListener("mousedown", (e) => {
      if (e.target === fromHandle || e.target === toHandle) return;
      const value = positionToValue(e.clientX);
      if (!isRange || Math.abs(value - from) <= Math.abs(value - to)) {
        from = isRange ? Math.min(value, to) : value;
        startDrag(fromHandle, "from");
      } else {
        to = Math.max(value, from);
        startDrag(toHandle, "to");
      }
      render();
    });

    render();
    root.rangeSliderApi = {
      getValue: () => (isRange ? { from, to } : { from }),
      setValue: (f, t) => {
        from = clamp(f, min, max);
        if (isRange && t !== undefined) to = clamp(t, from, max);
        render();
      },
    };
  }

  function initRangeSliders() {
    document.querySelectorAll("[data-range-slider]").forEach((root) => {
      if (root.rangeSliderApi) return;
      buildSlider(root);
    });
  }

  document.addEventListener("DOMContentLoaded", initRangeSliders);

  window.initRangeSliders = initRangeSliders;
})();
