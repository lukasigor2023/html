/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

datepickers.js
--------------
Vanilla replacement for bootstrap-datetimepicker.min.js (+ moment.js) and
daterangepicker.js (+ moment.js), backed by Flatpickr
(assets/plugins/flatpickr/flatpickr.min.js) for single date/time pickers,
and Litepicker (assets/plugins/litepicker/litepicker.js) for date ranges.

Original calls translated here:
  .datetimepicker -> format 'DD-MM-YYYY'                => Flatpickr dateFormat 'd-m-Y'
  .datetoday       -> format 'DD-MM-YYYY', minDate/today => Flatpickr dateFormat 'd-m-Y', minDate:'today', defaultDate:'today'
  .timepicker      -> format 'hh:mm A'                   => Flatpickr enableTime, noCalendar, dateFormat 'h:i K'
  .bookingrange     -> daterangepicker with preset ranges  => Litepicker range picker, singleMode:false,
                        writing "M/D/YYYY - M/D/YYYY" into the trigger's <span>
  .form-info .check-in / .check-out -> per-form daterangepicker duo -> Litepicker range picker per .form-info,
                        writing DD-MM-YYYY into both inputs + weekday text into the sibling p.fs-12

initDatepickers() is exported so it can be re-run after dynamically-inserted
markup (e.g. the "Add Timeslot" rows in script.js, which insert new
`.timepicker` inputs at runtime).
*/

(function () {
  "use strict";

  const initializedFP = new WeakSet();
  const initializedLP = new WeakSet();

  function initFlatpickrDate() {
    if (typeof flatpickr === "undefined") return;
    document.querySelectorAll(".datetimepicker").forEach((el) => {
      if (initializedFP.has(el)) return;
      flatpickr(el, {
        dateFormat: "d-m-Y",
        allowInput: true,
      });
      initializedFP.add(el);
    });
  }

  function initFlatpickrToday() {
    if (typeof flatpickr === "undefined") return;
    document.querySelectorAll(".datetoday").forEach((el) => {
      if (initializedFP.has(el)) return;
      flatpickr(el, {
        dateFormat: "d-m-Y",
        minDate: "today",
        defaultDate: "today",
        allowInput: true,
      });
      initializedFP.add(el);
    });
  }

  function initFlatpickrTime() {
    if (typeof flatpickr === "undefined") return;
    document.querySelectorAll(".timepicker").forEach((el) => {
      if (initializedFP.has(el)) return;
      flatpickr(el, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "h:i K",
        time_24hr: false,
        allowInput: true,
      });
      initializedFP.add(el);
    });
  }

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function formatMDY(date) {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
  }

  function formatDMY(date) {
    return pad(date.getDate()) + "-" + pad(date.getMonth() + 1) + "-" + date.getFullYear();
  }

  const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // .bookingrange: single trigger element with an inner <span> showing the
  // "M/D/YYYY - M/D/YYYY" text, opening a Litepicker range calendar.
  function initBookingRange() {
    if (typeof Litepicker === "undefined") return;
    document.querySelectorAll(".bookingrange").forEach((el) => {
      if (initializedLP.has(el)) return;
      initializedLP.add(el);

      const span = el.querySelector("span") || el;
      const today = new Date();
      const start = new Date();
      start.setDate(today.getDate() - 6);

      function render(s, e) {
        span.innerHTML = formatMDY(s) + " - " + formatMDY(e);
      }
      render(start, today);

      new Litepicker({
        element: el,
        singleMode: false,
        startDate: start,
        endDate: today,
        format: "M/D/YYYY",
        setup: (picker) => {
          picker.on("selected", (date1, date2) => {
            render(date1.toJSDate(), date2.toJSDate());
          });
        },
      });
    });
  }

  // Per-.form-info check-in/check-out duo (flight/hotel/car search widgets).
  function initFormInfoRanges() {
    if (typeof Litepicker === "undefined") return;
    document.querySelectorAll(".form-info").forEach((formInfo) => {
      const checkIn = formInfo.querySelector(".check-in");
      const checkOut = formInfo.querySelector(".check-out");
      if (!checkIn || initializedLP.has(checkIn)) return;
      initializedLP.add(checkIn);

      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      function writeField(input, date) {
        if (!input) return;
        input.value = formatDMY(date);
        const label = input.closest(".form-item");
        const p = label && label.querySelector("p.fs-12");
        if (p) p.textContent = WEEKDAYS[date.getDay()];
      }

      writeField(checkIn, today);
      writeField(checkOut, tomorrow);

      const picker = new Litepicker({
        element: checkIn,
        elementEnd: checkOut || undefined,
        singleMode: !checkOut,
        autoApply: true,
        minDate: today,
        startDate: today,
        endDate: checkOut ? tomorrow : today,
        format: "DD-MM-YYYY",
        dropdowns: { minYear: today.getFullYear() },
        setup: (lp) => {
          lp.on("selected", (date1, date2) => {
            const label = checkIn.closest(".form-item");
            const p = label && label.querySelector("p.fs-12");
            if (p) p.textContent = WEEKDAYS[date1.toJSDate().getDay()];
            if (checkOut && date2) {
              const outLabel = checkOut.closest(".form-item");
              const outP = outLabel && outLabel.querySelector("p.fs-12");
              if (outP) outP.textContent = WEEKDAYS[date2.toJSDate().getDay()];
            }
          });
        },
      });

      if (checkOut) {
        checkOut.addEventListener("click", () => picker.show());
      }
    });
  }

  function initDatepickers() {
    initFlatpickrDate();
    initFlatpickrToday();
    initFlatpickrTime();
    initBookingRange();
    initFormInfoRanges();
  }

  document.addEventListener("DOMContentLoaded", initDatepickers);

  window.initDatepickers = initDatepickers;
})();
