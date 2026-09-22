/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

selects.js
----------
Vanilla replacement for select2 usage, backed by Choices.js
(assets/plugins/choices/choices.min.js).

Original usage in script.js:
  $(".select2").select2();
  $(".select").select2({ minimumResultsForSearch: -1, width: '100%' });

`.select2` -> search enabled (default select2 behaviour).
`.select`  -> minimumResultsForSearch:-1 means "never show the search box",
              translated to Choices' `searchEnabled:false`.

Dynamically-added markup (highlight rows, service rows, timeslot rows, etc.)
re-runs `.select` init after insertion in script.js; `initSelects()` is
therefore exported and safe to call repeatedly - it skips elements that
already have a Choices instance (tracked via a WeakSet).
*/

(function () {
  "use strict";

  if (typeof Choices === "undefined") {
    return;
  }

  const initialized = new WeakSet();

  function initOne(el, options) {
    if (initialized.has(el)) return;
    try {
      new Choices(el, options);
      initialized.add(el);
    } catch (err) {
      // Choices throws if element was already converted (e.g. re-run after
      // dynamic insertion of a *different* new element with the same class).
      console.warn("Choices init skipped:", err);
    }
  }

  function initSelects() {
    document.querySelectorAll(".select2").forEach((el) => {
      initOne(el, {
        searchEnabled: true,
        itemSelectText: "",
        shouldSort: false,
      });
    });

    document.querySelectorAll(".select").forEach((el) => {
      initOne(el, {
        searchEnabled: false,
        itemSelectText: "",
        shouldSort: false,
      });
    });
  }

  document.addEventListener("DOMContentLoaded", initSelects);

  window.initSelects = initSelects;
})();
