/*
Author       : DreamsTechnologies
Template Name: DreamsTour - Bootstrap Template

Vanilla-JS rewrite of script.js (jQuery removed). Plugin-driven sections
(carousels, selects, lightbox, datepickers, range sliders, mobile menu,
sticky sidebar, counters) have been moved to their own modules:
  carousels.js, selects.js, lightbox.js, datepickers.js, range-slider.js,
  mobile-menu.js, sticky-sidebar.js, counter.js
and are initialized below via their exported init*() functions. Everything
else (custom UI toggles, scroll effects, form logic, dynamic row
insertion, chat UI, etc.) is preserved here as plain DOM code.
*/

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    // ---------------------------------------------------------------
    // Plugin module initializers (see assets/js/*.js companions)
    // ---------------------------------------------------------------
    if (typeof initMobileMenu === "function") initMobileMenu();
    if (typeof initCarousels === "function") initCarousels();
    if (typeof initSelects === "function") initSelects();
    if (typeof initLightbox === "function") initLightbox();
    if (typeof initDatepickers === "function") initDatepickers();
    if (typeof initRangeSliders === "function") initRangeSliders();
    if (typeof initStickySidebar === "function") initStickySidebar();
    if (typeof initCounters === "function") initCounters();

    // ---------------------------------------------------------------
    // Sidebar / offcanvas toggles
    // ---------------------------------------------------------------
    document.querySelectorAll(".offcanvas-close, .offcanvas-overlay").forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelectorAll(".offcanvas-info").forEach((n) => n.classList.remove("show"));
        document.querySelectorAll(".offcanvas-overlay").forEach((n) => n.classList.remove("overlay-open"));
        document.body.classList.remove("overflow-hidden");
      });
    });

    document.querySelectorAll(".sidebar-menu").forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelectorAll(".offcanvas-info").forEach((n) => n.classList.add("show"));
        document.querySelectorAll(".offcanvas-overlay").forEach((n) => n.classList.add("overlay-open"));
        document.body.classList.add("overflow-hidden");
      });
    });

    document.querySelectorAll(".body-overlay").forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelectorAll(".offcanvas__area").forEach((n) => n.classList.remove("offcanvas-opened"));
        document.querySelectorAll(".df-search-area").forEach((n) => n.classList.remove("opened"));
        document.querySelectorAll(".body-overlay").forEach((n) => n.classList.remove("opened"));
      });
    });

    // ---------------------------------------------------------------
    // Sticky header + back-to-top + scroll progress
    // ---------------------------------------------------------------
    window.addEventListener("scroll", () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      document.querySelectorAll("header").forEach((h) => h.classList.toggle("fixed", scrollTop > 130));

      document.querySelectorAll(".back-to-top-icon").forEach((el) => el.classList.toggle("show", scrollTop >= 500));
    });

    if (typeof WOW !== "undefined") {
      new WOW().init();
    }

    // ---------------------------------------------------------------
    // Toggle password visibility
    // ---------------------------------------------------------------
    document.querySelectorAll(".toggle-password").forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const icon = toggle.querySelector("i");
        if (icon) icon.classList.toggle("isax-eye-slash"), icon.classList.toggle("isax-eye");
        const input = toggle.parentElement && toggle.parentElement.querySelector(".pass-input");
        if (input) {
          input.type = input.type === "password" ? "text" : "password";
        }
      });
    });

    // ---------------------------------------------------------------
    // "Show more / Show less" expandable content blocks
    // ---------------------------------------------------------------
    function initShowMore(buttonSelector, containerSelector, collapsedHeight) {
      const buttons = document.querySelectorAll(buttonSelector);
      const containers = document.querySelectorAll(containerSelector);
      buttons.forEach((button, index) => {
        let isLess = true;
        const container = containers[index];
        if (!container) return;
        button.addEventListener("click", () => {
          if (isLess) {
            isLess = false;
            container.style.height = container.scrollHeight + "px";
            button.innerHTML = "Show Less";
          } else {
            isLess = true;
            container.style.height = collapsedHeight;
            button.innerHTML = "Show More";
          }
        });
      });
    }
    initShowMore(".more-view", ".more-content", "148px");
    initShowMore(".more-btn", ".more-info", "70px");

    // ---------------------------------------------------------------
    // Flight search: trip-type radio toggles
    // ---------------------------------------------------------------
    document.querySelectorAll(".banner-form .form-check-input").forEach((radio) => {
      radio.addEventListener("change", () => {
        const val = radio.value;

        // Roundtrip/multiway/oneway sections
        if (val === "roundtrip" || val === "multiway" || val === "oneway" || !["different-drop", "airport", "hourly-drop"].includes(val)) {
          const showEl = (sel, show) => document.querySelectorAll(sel).forEach((n) => (n.style.display = show ? "" : "none"));
          if (val === "roundtrip") {
            showEl(".round-drip", true);
            showEl(".multi-trip", false);
            showEl(".normal-trip", true);
          } else if (val === "multiway") {
            showEl(".round-drip", false);
            showEl(".multi-trip", true);
            showEl(".normal-trip", false);
          } else if (!["different-drop", "airport", "hourly-drop"].includes(val)) {
            showEl(".round-drip", false);
            showEl(".multi-trip", false);
            showEl(".normal-trip", true);
          }
        }

        // Car/transfer drop-off type sections
        const showEl = (sel, show) => document.querySelectorAll(sel).forEach((n) => (n.style.display = show ? "" : "none"));
        if (val === "different-drop") {
          showEl(".return-drop", true);
          showEl(".dropoff-time", true);
          showEl(".hourly-time", false);
          showEl(".pickup-airport", false);
          showEl(".from-location", true);
        } else if (val === "airport") {
          showEl(".return-drop", false);
          showEl(".dropoff-time", false);
          showEl(".hourly-time", false);
          showEl(".to-location", true);
          showEl(".pickup-airport", true);
          showEl(".from-location", false);
        } else if (val === "hourly-drop") {
          showEl(".return-drop", false);
          showEl(".dropoff-time", false);
          showEl(".to-location", false);
          showEl(".hourly-time", true);
          showEl(".pickup-airport", false);
          showEl(".from-location", true);
        }
      });
    });

    // ---------------------------------------------------------------
    // Favourite icon toggle
    // ---------------------------------------------------------------
    document.querySelectorAll(".fav-icon").forEach((el) => {
      el.addEventListener("click", () => el.classList.toggle("selected"));
    });

    // ---------------------------------------------------------------
    // Increment / decrement quantity inputs
    // ---------------------------------------------------------------
    document.querySelectorAll(".quantity-right-plus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const input = btn.closest(".custom-increment") && btn.closest(".custom-increment").querySelector(".input-number");
        if (!input) return;
        input.value = (parseInt(input.value) || 0) + 1;
      });
    });
    document.querySelectorAll(".quantity-left-minus").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const input = btn.closest(".custom-increment") && btn.closest(".custom-increment").querySelector(".input-number");
        if (!input) return;
        const qty = parseInt(input.value) || 0;
        if (qty > 0) input.value = qty - 1;
      });
    });

    // ---------------------------------------------------------------
    // Policy toggle
    // ---------------------------------------------------------------
    document.querySelectorAll(".toggle-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const policyWrap = btn.closest(".policy-wrap");
        if (!policyWrap) return;
        const policyInfo = policyWrap.querySelector(".policy-info");
        if (policyInfo) {
          const hidden = getComputedStyle(policyInfo).display === "none";
          policyInfo.style.display = hidden ? "" : "none";
        }
        policyWrap.classList.toggle("expanded");
        btn.textContent = policyInfo && policyInfo.classList.contains("hide") ? "Show More" : "Show Less";
      });
    });

    // ---------------------------------------------------------------
    // Bootstrap accordion "show" class bookkeeping
    // ---------------------------------------------------------------
    ["faq-accordion", "faq-cards-six", "faq-four"].forEach((wrapperClass) => {
      const wrapper = document.querySelector("." + wrapperClass);
      if (!wrapper) return;
      wrapper.querySelectorAll(".accordion-item .collapse, .accordion-item").forEach((collapseEl) => {
        collapseEl.addEventListener("show.bs.collapse", () => {
          if (collapseEl.parentElement) collapseEl.parentElement.classList.add("show");
        });
        collapseEl.addEventListener("hide.bs.collapse", () => {
          if (collapseEl.parentElement) collapseEl.parentElement.classList.remove("show");
        });
      });
    });

    // ---------------------------------------------------------------
    // Add Credit Card: hidden file input triggers
    // ---------------------------------------------------------------
    const openFolderBtn = document.getElementById("open-folder");
    const folderInput = document.getElementById("folder-input");
    if (openFolderBtn && folderInput) {
      openFolderBtn.addEventListener("click", () => folderInput.click());
      folderInput.addEventListener("change", (event) => {
        console.log("Selected files:", event.target.files);
      });
    }

    // ---------------------------------------------------------------
    // Dynamic row builders (highlights / services / timeslots / requirements)
    // ---------------------------------------------------------------
    function addRow(triggerSelector, containerSelector, rowClass, label, reinitSelects) {
      document.querySelectorAll(triggerSelector).forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();
          const container = document.querySelector(containerSelector);
          if (!container) return false;
          const wrapper = document.createElement("div");
          wrapper.innerHTML =
            '<div class="col-md-12 ' + rowClass + '">' +
              '<div class="mb-3">' +
                '<label class="form-label">' + label + "</label>" +
                '<div class="d-flex align-items-center">' +
                  '<input type="text" class="form-control">' +
                  '<a class="text-danger trash-icon d-flex align-items-center justify-content-center ms-3"><i class="isax isax-trash"></i></a>' +
                "</div>" +
              "</div>" +
            "</div>";
          container.appendChild(wrapper.firstElementChild);
          if (reinitSelects && typeof initSelects === "function") initSelects();
          return false;
        });
      });
    }
    addRow(".add-highlight", ".add-highlight-info", "highlight-info", "Highlights", true);
    addRow(".add-requirement", ".add-requirement-info", "requirement-info", "Requirement", true);
    addRow(".add-additional-requirement", ".add-additional-requirement-info", "additional-requirement-info", "Additional Requirement", true);
    addRow(".add-conditional-requirement", ".add-conditional-requirement-info", "conditional-requirement-info", "Conditional Requirement", true);
    addRow(".add-important-note", ".add-important-note-info", "important-note-info", "Important Note", true);
    addRow(".add-common-reasons-for-rejection", ".add-common-reasons-for-rejection-info", "common-reasons-for-rejection-info", "Common Reasons for Rejection", true);

    // Delegated trash-icon removal for all the row containers above.
    [
      ".add-highlight-info",
      ".add-requirement-info",
      ".add-additional-requirement-info",
      ".add-conditional-requirement-info",
      ".add-important-note-info",
      ".add-common-reasons-for-rejection-info",
      ".add-service-info",
    ].forEach((containerSelector) => {
      const container = document.querySelector(containerSelector);
      if (!container) return;
      container.addEventListener("click", (e) => {
        const trash = e.target.closest(".trash-icon");
        if (!trash) return;
        e.preventDefault();
        const row = trash.closest(".highlight-info, .requirement-info, .additional-requirement-info, .conditional-requirement-info, .important-note-info, .common-reasons-for-rejection-info, .service-info");
        if (row) row.remove();
        return false;
      });
    });

    // Remove Gallery item
    document.addEventListener("click", (e) => {
      const trash = e.target.closest(".gallery-trash");
      if (!trash) return;
      const parent = trash.parentElement;
      if (parent) parent.style.display = "none";
    });

    // Restore active state on user-sidebar submenu links marked active
    document.querySelectorAll(".user-sidebar ul li.submenu a.active").forEach((activeLink) => {
      let li = activeLink;
      while (li.parentElement && !(li.parentElement.tagName === "UL" && li.parentElement === document.body)) {
        if (li.tagName === "LI") {
          // find the outermost LI ancestor (mirrors parents('li:last'))
        }
        li = li.parentElement;
        if (!li) break;
      }
      const outerLi = activeLink.closest("li");
      if (outerLi) {
        let topLi = outerLi;
        let parentLi = topLi.parentElement && topLi.parentElement.closest("li");
        while (parentLi) {
          topLi = parentLi;
          parentLi = topLi.parentElement && topLi.parentElement.closest("li");
        }
        const firstLink = topLi.querySelector(":scope > a");
        if (firstLink) {
          firstLink.classList.add("active");
          firstLink.click();
        }
      }
    });

    // Image file upload preview (#imgInp -> #blah)
    const imgInp = document.getElementById("imgInp");
    if (imgInp) {
      imgInp.addEventListener("change", function () {
        if (this.files && this.files[0]) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const blah = document.getElementById("blah");
            if (blah) blah.src = e.target.result;
          };
          reader.readAsDataURL(this.files[0]);
        }
      });
    }

    // ---------------------------------------------------------------
    // Dashboard sidebar accordion navigation
    // ---------------------------------------------------------------
    document.querySelectorAll(".user-sidebar a").forEach((link) => {
      link.addEventListener("click", function (e) {
        const parentLi = this.parentElement;
        if (parentLi && parentLi.classList.contains("submenu")) {
          e.preventDefault();
        }
        const closestUl = this.closest("ul");
        const nextUl = this.nextElementSibling && this.nextElementSibling.tagName === "UL" ? this.nextElementSibling : null;

        if (!this.classList.contains("subdrop")) {
          if (closestUl) {
            closestUl.querySelectorAll("ul").forEach((ul) => (ul.style.display = "none"));
            closestUl.querySelectorAll("a").forEach((a) => a.classList.remove("subdrop"));
          }
          if (nextUl) nextUl.style.display = "";
          this.classList.add("subdrop");
        } else {
          this.classList.remove("subdrop");
          if (nextUl) nextUl.style.display = "none";
        }
      });
    });

    // Link Account cards
    document.querySelectorAll(".link-account .integration-card").forEach((card) => {
      card.addEventListener("click", () => card.classList.toggle("selected"));
    });

    // File upload name display
    const fileUpload = document.getElementById("fileUpload");
    const fileNameDisplay = document.getElementById("fileName");
    if (fileUpload && fileNameDisplay) {
      fileUpload.addEventListener("change", () => {
        fileNameDisplay.textContent = fileUpload.files.length > 0 ? fileUpload.files[0].name : "No file chosen";
      });
    }
    document.querySelectorAll(".upload-btn").forEach((btn) => {
      btn.addEventListener("click", () => fileUpload && fileUpload.click());
    });

    // ---------------------------------------------------------------
    // Tab-list smooth scroll (add-tab-list / active-tab-list)
    // ---------------------------------------------------------------
    function smoothScrollTo(targetTop, duration) {
      const startY = window.scrollY;
      const distance = targetTop - startY;
      const startTime = performance.now();
      function step(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
        window.scrollTo(0, startY + distance * eased);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    function initTabScroll(listSelector) {
      document.querySelectorAll(listSelector + " li a").forEach((link) => {
        link.addEventListener("click", (e) => {
          document.querySelectorAll(listSelector + " li a").forEach((a) => a.classList.remove("active"));
          link.classList.add("active");
          e.preventDefault();
          const targetSel = link.getAttribute("href");
          const target = targetSel && document.querySelector(targetSel);
          if (target) {
            const top = target.getBoundingClientRect().top + window.scrollY - 90;
            smoothScrollTo(top, 500);
          }
        });
      });
    }
    initTabScroll("ul.add-tab-list");
    initTabScroll("ul.active-tab-list");

    // ---------------------------------------------------------------
    // Add Class to Menu (megamenu hover)
    // ---------------------------------------------------------------
    const megamenuItem = document.querySelector(".megamenu");
    const megamenuContent = document.querySelector(".main-nav");
    if (megamenuItem && megamenuContent) {
      megamenuItem.addEventListener("mouseenter", () => megamenuContent.classList.add("active"));
      megamenuItem.addEventListener("mouseleave", () => megamenuContent.classList.remove("active"));
    }

    // ---------------------------------------------------------------
    // Horizontal / vertical infinite marquee slides (duplicate for loop)
    // ---------------------------------------------------------------
    function initMarquee(selector) {
      document.querySelectorAll(selector).forEach((scroller) => {
        scroller.setAttribute("data-animated", "true");
        const scrollerInner = scroller.querySelector(".slide-list");
        if (!scrollerInner) return;
        Array.from(scrollerInner.children).forEach((item) => {
          const clone = item.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          scrollerInner.appendChild(clone);
        });
      });
    }
    initMarquee(".horizontal-slide");
    initMarquee(".vertical-slide");

    // ---------------------------------------------------------------
    // Chat / messaging UI (dashboard chat pages)
    // ---------------------------------------------------------------
    document.querySelectorAll(".chat-close").forEach((el) => {
      el.addEventListener("click", () => document.querySelectorAll(".chat").forEach((c) => c.classList.remove("show")));
    });

    const searchContact = document.getElementById("search-contact");
    if (searchContact) {
      searchContact.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll("#chatsidebar ul li").forEach((li) => {
          li.style.display = li.textContent.toLowerCase().indexOf(value) > -1 ? "" : "none";
        });
      });
    }

    document.querySelectorAll(".left_sides").forEach((el) => {
      el.addEventListener("click", () => {
        if (window.innerWidth <= 991) {
          document.querySelectorAll(".sidebar-group").forEach((n) => n.classList.remove("hide-left-sidebar"));
          document.querySelectorAll(".sidebar-menu").forEach((n) => n.classList.remove("d-none"));
        }
      });
    });
    document.querySelectorAll(".chat-user-list").forEach((el) => {
      el.addEventListener("click", () => {
        if (window.innerWidth <= 767) {
          document.querySelectorAll(".left-sidebar").forEach((n) => n.classList.add("hide-left-sidebar"));
          document.querySelectorAll(".sidebar-menu").forEach((n) => n.classList.add("d-none"));
        }
      });
    });

    function onChatLayoutEvent() {
      const chatBar = document.querySelector(".chat");
      const chatBarWidth = chatBar ? chatBar.offsetWidth : 0;

      document.querySelectorAll(".user-list-item").forEach((el) => {
        if (el.closest("body.status-page") || el.closest("body.voice-call-page")) return;
        el.addEventListener("click", () => {
          if (window.innerWidth < 992) {
            document.querySelectorAll(".left-sidebar").forEach((n) => n.classList.add("hide-left-sidebar"));
            document.querySelectorAll(".chat").forEach((n) => n.classList.add("show-chatbar"));
          }
        });
      });

      document.querySelectorAll(".group-left-setting").forEach((el) => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".right_side_group").forEach((n) => {
            n.classList.add("show-right-sidebar");
            n.classList.remove("hide-right-sidebar");
          });
          document.querySelectorAll(".right-side-contact").forEach((n) => n.classList.add("hide-right-sidebar"));
          document.querySelectorAll(".chat-options").forEach((n) => n.classList.add("chat-small"));
        });
      });
      document.querySelectorAll(".remove-group-message").forEach((el) => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".right_side_group").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".chat-options").forEach((n) => n.classList.remove("chat-small"));
          if (window.innerWidth > 991 && window.innerWidth < 1201) {
            document.querySelectorAll(".chat").forEach((n) => (n.style.marginLeft = "0"));
          }
          if (window.innerWidth < 992) {
            document.querySelectorAll(".chat").forEach((n) => n.classList.remove("hide-chatbar"));
          }
        });
      });

      document.querySelectorAll(".star-message-left").forEach((el) => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".right_side_star").forEach((n) => {
            n.classList.add("show-right-sidebar");
            n.classList.remove("hide-right-sidebar");
          });
          document.querySelectorAll(".right-side-contact").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".chat-options").forEach((n) => n.classList.add("chat-small"));
        });
      });
      document.querySelectorAll(".remove-star-message").forEach((el) => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".right_side_star").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".chat-options").forEach((n) => n.classList.remove("chat-small"));
          if (window.innerWidth > 991 && window.innerWidth < 1201) {
            document.querySelectorAll(".chat").forEach((n) => (n.style.marginLeft = "0"));
          }
          if (window.innerWidth < 992) {
            document.querySelectorAll(".chat").forEach((n) => n.classList.remove("hide-chatbar"));
          }
        });
      });

      document.querySelectorAll(".message-info-left").forEach((el) => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".right_sidebar_info").forEach((n) => {
            n.classList.add("show-right-sidebar");
            n.classList.remove("hide-right-sidebar");
          });
          document.querySelectorAll(".right-side-contact").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".right_side_star").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".right_side_group").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".chat-options").forEach((n) => n.classList.add("chat-small"));
          if (window.innerWidth > 991 && window.innerWidth < 1201) {
            document.querySelectorAll(".chat").forEach((n) => {
              if (!n.closest(".right_sidebar_info")) n.style.marginLeft = -chatBarWidth + "px";
            });
          }
          if (window.innerWidth < 992) {
            document.querySelectorAll(".chat").forEach((n) => {
              if (!n.closest(".right_sidebar_info")) n.classList.add("hide-chatbar");
            });
          }
        });
      });
      document.querySelectorAll(".remove-message-info").forEach((el) => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".right_sidebar_info").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".chat-options").forEach((n) => n.classList.remove("chat-small"));
          if (window.innerWidth > 991 && window.innerWidth < 1201) {
            document.querySelectorAll(".chat").forEach((n) => (n.style.marginLeft = "0"));
          }
          if (window.innerWidth < 992) {
            document.querySelectorAll(".chat").forEach((n) => n.classList.remove("hide-chatbar"));
          }
        });
      });

      document.querySelectorAll(".dream_profile_menu").forEach((el) => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".right-side-contact").forEach((n) => {
            n.classList.add("show-right-sidebar");
            n.classList.remove("hide-right-sidebar");
          });
          document.querySelectorAll(".right_sidebar_info").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".right_side_star").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".video-right-sidebar").forEach((n) => {
            n.classList.add("show-right-sidebar");
            n.classList.remove("hide-right-sidebar");
          });
          document.querySelectorAll(".chat-options").forEach((n) => n.classList.add("chat-small"));
          if (window.innerWidth > 991 && window.innerWidth < 1201) {
            document.querySelectorAll(".chat").forEach((n) => {
              if (!n.closest(".right-side-contact")) n.style.marginLeft = -chatBarWidth + "px";
              if (!n.closest(".right_side_star")) n.style.marginLeft = -chatBarWidth + "px";
            });
            document.querySelectorAll(".left-sidebar").forEach((n) => (n.style.display = "none"));
            document.querySelectorAll(".chat").forEach((n) => (n.style.marginLeft = "0"));
          }
          if (window.innerWidth < 992) {
            document.querySelectorAll(".chat").forEach((n) => {
              if (!n.closest(".right-side-contact")) n.classList.add("hide-chatbar");
              if (!n.closest(".right_side_star")) n.classList.add("hide-chatbar");
            });
          }
        });
      });

      document.querySelectorAll(".close_profile").forEach((el) => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".right-side-contact").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".video-right-sidebar").forEach((n) => {
            n.classList.add("hide-right-sidebar");
            n.classList.remove("show-right-sidebar");
          });
          document.querySelectorAll(".chat-options").forEach((n) => n.classList.remove("chat-small"));
          if (window.innerWidth > 991 && window.innerWidth < 1201) {
            document.querySelectorAll(".chat").forEach((n) => (n.style.marginLeft = "0"));
          }
          if (window.innerWidth < 992) {
            document.querySelectorAll(".chat").forEach((n) => n.classList.remove("hide-chatbar"));
          }
        });
      });

      document.querySelectorAll(".nav-tabs a").forEach((tabLink) => {
        tabLink.addEventListener("click", () => {
          if (typeof bootstrap !== "undefined" && bootstrap.Tab) {
            bootstrap.Tab.getOrCreateInstance(tabLink).show();
          }
        });
      });

      document.querySelectorAll(".chat-header .left_side i, .page-header .left_side i").forEach((el) => {
        el.addEventListener("click", () => {
          document.querySelectorAll(".left-sidebar").forEach((n) => n.classList.remove("hide-left-sidebar"));
          document.querySelectorAll(".chat").forEach((n) => n.classList.remove("show-chatbar"));
          document.querySelectorAll(".sidebar-menu").forEach((n) => n.classList.remove("d-none"));
        });
      });
    }
    onChatLayoutEvent();
    window.addEventListener("resize", onChatLayoutEvent);

    // Emoji panels
    document.querySelectorAll(".emoj-action").forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelectorAll(".emoj-group-list").forEach((n) => (n.style.display = getComputedStyle(n).display === "none" ? "" : "none"));
      });
    });
    document.querySelectorAll(".emoj-action-foot").forEach((el) => {
      el.addEventListener("click", () => {
        document.querySelectorAll(".emoj-group-list-foot").forEach((n) => (n.style.display = getComputedStyle(n).display === "none" ? "" : "none"));
      });
    });

    // Right-side accordion
    document.querySelectorAll(".accordion-col .accordion-title").forEach((title) => {
      title.addEventListener("click", function () {
        const next = this.nextElementSibling;
        if (next) {
          const hidden = getComputedStyle(next).display === "none";
          next.style.display = hidden ? "" : "none";
        }
        this.classList.toggle("active");
      });
    });

    // Bootstrap tooltips
    if (typeof bootstrap !== "undefined" && bootstrap.Tooltip) {
      document.querySelectorAll('[data-bs-toggle="tooltip"]').forEach((el) => new bootstrap.Tooltip(el));
    }

    // Chat search visibility
    document.querySelectorAll(".chat-search-btn").forEach((el) => {
      el.addEventListener("click", () => document.querySelectorAll(".chat-search").forEach((n) => n.classList.toggle("visible-chat")));
    });
    document.querySelectorAll(".close-btn-chat").forEach((el) => {
      el.addEventListener("click", () => document.querySelectorAll(".chat-search").forEach((n) => n.classList.remove("visible-chat")));
    });
    document.querySelectorAll(".chat-search .form-control").forEach((input) => {
      input.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        document.querySelectorAll(".chat .chat-body .messages .chats").forEach((chat) => {
          chat.style.display = chat.textContent.toLowerCase().indexOf(value) > -1 ? "" : "none";
        });
      });
    });

    document.querySelectorAll(".user-chat-search-btn").forEach((el) => {
      el.addEventListener("click", () => document.querySelectorAll(".user-chat-search").forEach((n) => n.classList.add("visible-chat")));
    });
    document.querySelectorAll(".user-close-btn-chat").forEach((el) => {
      el.addEventListener("click", () => document.querySelectorAll(".user-chat-search").forEach((n) => n.classList.remove("visible-chat")));
    });

    // ---------------------------------------------------------------
    // OTP digit-group inputs
    // ---------------------------------------------------------------
    document.querySelectorAll(".digit-group input").forEach((input) => {
      input.setAttribute("maxlength", "1");
      input.addEventListener("keyup", function (e) {
        const parent = this.parentElement;
        if (e.keyCode === 8 || e.keyCode === 37) {
          const prevId = this.dataset.previous;
          const prev = prevId && parent && parent.querySelector("#" + prevId);
          if (prev) prev.select();
        } else if ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode === 39) {
          const nextId = this.dataset.next;
          const next = nextId && parent && parent.querySelector("#" + nextId);
          if (next) {
            next.select();
          } else if (parent && parent.dataset.autosubmit) {
            const form = parent.closest("form") || parent;
            if (form.submit) form.submit();
          }
        }

        this.classList.toggle("active", this.value !== "");
      });
    });

    // ---------------------------------------------------------------
    // Video/audio call mute toggles
    // ---------------------------------------------------------------
    document.querySelectorAll(".mute-bt").forEach((btn) => {
      btn.addEventListener("click", function () {
        const micIcons = document.querySelectorAll(".mute-bt i, .action-info.vid-view li .mute-mic i");
        if (this.classList.contains("stop")) {
          this.classList.remove("stop");
          micIcons.forEach((i) => {
            i.classList.remove("ti-microphone-off");
            i.classList.add("ti-microphone");
          });
          this.setAttribute("data-bs-original-title", "Mute Audio");
          document.querySelectorAll(".join-video.user-active .more-icon").forEach((n) => n.classList.remove("mic-view"));
        } else {
          this.classList.add("stop");
          micIcons.forEach((i) => {
            i.classList.remove("ti-microphone");
            i.classList.add("ti-microphone-off");
          });
          this.setAttribute("data-bs-original-title", "Unmute Audio");
          document.querySelectorAll(".join-video.user-active .more-icon").forEach((n) => n.classList.add("mic-view"));
          document.querySelectorAll(".add-list .user-active .action-info").forEach((n) => n.classList.add("vid-view"));
        }
      });
    });

    document.querySelectorAll(".mute-video").forEach((btn) => {
      btn.addEventListener("click", function () {
        if (this.classList.contains("stop")) {
          this.classList.remove("stop");
          document.querySelectorAll(".mute-video i").forEach((i) => {
            i.classList.remove("ti-video-off");
            i.classList.add("ti-video");
          });
          document.querySelectorAll(".mini-video-view").forEach((n) => n.classList.remove("no-video"));
          document.querySelectorAll(".join-call .join-video").forEach((n) => n.classList.remove("video-hide"));
          document.querySelectorAll(".video-avatar").forEach((n) => n.classList.remove("active"));
          this.setAttribute("data-bs-original-title", "Stop Camera");
          document.querySelectorAll(".meeting .join-video.user-active").forEach((n) => n.classList.remove("video-hide"));
          document.querySelectorAll(".join-video.user-active .more-icon").forEach((n) => n.classList.remove("vid-view"));
          document.querySelectorAll(".action-info.vid-view li .mute-vid i").forEach((i) => {
            i.classList.remove("feather-video-off");
            i.classList.add("feather-video");
          });
        } else {
          this.classList.add("stop");
          document.querySelectorAll(".mute-video i").forEach((i) => {
            i.classList.remove("ti-video");
            i.classList.add("ti-video-off");
          });
          document.querySelectorAll(".mini-video-view").forEach((n) => n.classList.add("no-video"));
          document.querySelectorAll(".join-call .join-video").forEach((n) => n.classList.add("video-hide"));
          document.querySelectorAll(".video-avatar").forEach((n) => n.classList.add("active"));
          this.setAttribute("data-bs-original-title", "Start Camera");
          document.querySelectorAll(".meeting .join-video.user-active").forEach((n) => n.classList.add("video-hide"));
          document.querySelectorAll(".add-list .user-active .action-info").forEach((n) => n.classList.add("vid-view"));
          document.querySelectorAll(".action-info.vid-view li .mute-vid i").forEach((i) => {
            i.classList.remove("ti-video");
            i.classList.add("ti-video-off");
          });
        }
      });
    });

    document.querySelectorAll(".main-wrapper").forEach((el) => (el.style.visibility = "visible"));

    // Reply button
    const replyButtons = document.querySelectorAll(".reply-button");
    const replyContent = document.querySelector(".reply-content");
    const replyDiv = document.querySelector(".reply-chat");
    const closeReplay = document.querySelector(".close-replay");
    if (replyButtons.length && replyDiv) {
      if (closeReplay) {
        closeReplay.onclick = () => {
          replyDiv.classList.remove("d-flex");
          replyDiv.classList.add("d-none");
        };
      }
      replyButtons.forEach((button) => {
        button.addEventListener("click", () => {
          replyDiv.classList.add("d-flex");
          replyDiv.classList.remove("d-none");
          if (replyContent) replyContent.innerHTML = "Thank you for your support";
        });
      });
    }

    // ---------------------------------------------------------------
    // Coming Soon countdown
    // ---------------------------------------------------------------
    if (document.querySelector(".comming-soon-pg")) {
      const day = document.querySelector(".days");
      const hour = document.querySelector(".hours");
      const minute = document.querySelector(".minutes");
      const second = document.querySelector(".seconds");
      const countdownDate = new Date("Dec 30, 2024 16:00:00").getTime();
      const updateCount = setInterval(function () {
        const distance = countdownDate - new Date().getTime();
        if (day) day.textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
        if (hour) hour.textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if (minute) minute.textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        if (second) second.textContent = Math.floor((distance % (1000 * 60)) / 1000);
        if (distance < 0) {
          clearInterval(updateCount);
          const pg = document.querySelector(".comming-soon-pg");
          if (pg) pg.innerHTML = "<h1>EXPIRED</h1>";
        }
      }, 1000);
    }

    // Read more toggle
    if (document.querySelector(".read-more")) {
      document.querySelectorAll(".more-text").forEach((n) => (n.style.display = "none"));
      document.querySelectorAll(".more-link").forEach((link) => {
        link.addEventListener("click", function () {
          this.classList.add("less");
          this.textContent = this.textContent === "Show Less" ? "Show More" : "Show Less";
          document.querySelectorAll(".more-text").forEach((n) => {
            n.style.display = getComputedStyle(n).display === "none" ? "" : "none";
          });
        });
      });
    }

    // ---------------------------------------------------------------
    // Add Additional Service / Timeslot / Extra Service dynamic rows
    // ---------------------------------------------------------------
    document.querySelectorAll(".add-service").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const container = document.querySelector(".add-service-info");
        if (!container) return false;
        const wrapper = document.createElement("div");
        wrapper.innerHTML =
          '<div class="row service-info">' +
            '<div class="col-md-6"><div class="mb-3"><label class="form-label">Name of the Service</label><input type="text" class="form-control"></div></div>' +
            '<div class="col-md-6"><div class="mb-3"><label class="form-label">Price</label><div class="d-flex align-items-center"><input type="text" class="form-control"><a class="text-danger trash-icon d-flex align-items-center justify-content-center ms-3"><i class="isax isax-trash"></i></a></div></div></div>' +
          "</div>";
        container.appendChild(wrapper.firstElementChild);
        if (typeof initSelects === "function") initSelects();
        return false;
      });
    });

    document.querySelectorAll(".add-timeslot").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const container = document.querySelector(".timeslots");
        if (!container) return false;
        const wrapper = document.createElement("div");
        wrapper.innerHTML =
          '<div class="row service-info">' +
            '<div class="col-xl-4 col-md-6"><div class="mb-3"><label class="form-label">Timeslots Name</label><select class="select"><option>Select</option><option>Newyork</option><option>Boston</option><option>Northern Virginia</option></select></div></div>' +
            '<div class="col-xl-4 col-md-6"><div class="mb-3"><label class="form-label">From</label><div class="input-icon-end position-relative"><input type="text" class="form-control timepicker" placeholder="-- : -- : -- "><span class="input-icon-addon"><i class="ti ti-clock-hour-10 text-gray-7"></i></span></div></div></div>' +
            '<div class="col-xl-4 col-md-6"><div class="mb-3"><label class="form-label">To</label><div class="d-flex align-items-center"><div class="input-icon-end position-relative"><input type="text" class="form-control timepicker" placeholder="-- : -- : -- "><span class="input-icon-addon"><i class="ti ti-clock-hour-10 text-gray-7"></i></span></div><a class="text-danger trash-icon d-flex align-items-center justify-content-center ms-3"><i class="isax isax-trash"></i></a></div></div></div>' +
          "</div>";
        container.appendChild(wrapper.firstElementChild);
        if (typeof initDatepickers === "function") initDatepickers();
        if (typeof initSelects === "function") initSelects();
        return false;
      });
    });

    document.querySelectorAll(".add-extraservice").forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const container = document.querySelector(".extra-service");
        if (!container) return false;
        const wrapper = document.createElement("div");
        wrapper.innerHTML =
          '<div class="row service-info">' +
            '<div class="col-xl-4 col-md-6"><div class="mb-3"><label class="form-label">Service Name</label><input type="text" class="form-control"></div></div>' +
            '<div class="col-xl-4 col-md-6"><div class="mb-3"><label class="form-label">Price Type</label><select class="select"><option>Select</option><option>COD</option><option>Online</option></select></div></div>' +
            '<div class="col-xl-4 col-md-6"><div class="mb-3"><label class="form-label">Offer Price (USD)</label><div class="d-flex align-items-center"><input type="text" class="form-control"><a class="text-danger trash-icon d-flex align-items-center justify-content-center ms-3"><i class="isax isax-trash"></i></a></div></div></div>' +
          "</div>";
        container.appendChild(wrapper.firstElementChild);
        if (typeof initSelects === "function") initSelects();
        return false;
      });
    });

    // ---------------------------------------------------------------
    // Loader
    // ---------------------------------------------------------------
    const loader = document.getElementById("loader-wrapper");
    if (loader) {
      loader.style.display = "";
      setTimeout(() => (loader.style.display = "none"), 300);
    }

    // Chat window responsive visibility
    if (window.innerWidth <= 991) {
      document.querySelectorAll(".chat-window-long").forEach((n) => (n.style.display = "none"));
    }
    document.querySelectorAll(".chat-member").forEach((member) => {
      member.addEventListener("click", function () {
        if (window.innerWidth <= 991) {
          document.querySelectorAll(".chat-window-long").forEach((n) => {
            n.style.display = getComputedStyle(n).display === "none" ? "" : "none";
          });
          document.querySelectorAll(".chat-cont-left").forEach((n) => {
            n.style.display = getComputedStyle(n).display === "none" ? "" : "none";
          });
          const longVisible = document.querySelector(".chat-window-long") && getComputedStyle(document.querySelector(".chat-window-long")).display !== "none";
          document.querySelectorAll(".chat-member").forEach((m) => {
            if (m !== this) m.style.display = longVisible ? "none" : "";
          });
        }
      });
    });
    const backUserList = document.getElementById("back_user_list");
    if (backUserList) {
      backUserList.addEventListener("click", () => {
        if (window.innerWidth < 991) {
          document.querySelectorAll(".chat-window-long").forEach((n) => {
            n.style.display = getComputedStyle(n).display === "none" ? "" : "none";
          });
          document.querySelectorAll(".chat-cont-left").forEach((n) => {
            n.style.display = getComputedStyle(n).display === "none" ? "" : "none";
          });
          document.querySelectorAll(".chat-member").forEach((m) => (m.style.display = ""));
        }
      });
    }

    // Country code selectors (intlTelInput - unrelated to jQuery, untouched)
    ["#phone", "#phone1"].forEach((sel) => {
      const input = document.querySelector(sel);
      if (input && typeof window.intlTelInput === "function") {
        window.intlTelInput(input, {
          utilsScript: "assets/plugins/intltelinput/js/utils.js",
        });
      }
    });

    // ---------------------------------------------------------------
    // Scroll-spy for .add-tab-list sidebar (card sections)
    // ---------------------------------------------------------------
    if (document.querySelector(".add-tab-list")) {
      const sections = document.querySelectorAll(".card");
      const sidebarLinks = document.querySelectorAll(".add-tab-list a");
      window.addEventListener("scroll", () => {
        const scrollPosition = window.scrollY;
        sections.forEach((section) => {
          const sectionTop = section.getBoundingClientRect().top + window.scrollY - 60;
          const sectionBottom = sectionTop + section.offsetHeight;
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const currentId = section.id;
            sidebarLinks.forEach((a) => a.classList.remove("active"));
            const match = document.querySelector('.add-tab-list a[href="#' + currentId + '"]');
            if (match) match.classList.add("active");
          }
        });
      });
      sidebarLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href");
          const target = document.querySelector(targetId);
          if (!target) return;
          const targetOffset = target.getBoundingClientRect().top + window.scrollY - 50;
          const startY = window.scrollY;
          const distance = targetOffset - startY;
          const duration = 500;
          const startTime = performance.now();
          function step(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 0.5 - Math.cos(progress * Math.PI) / 2;
            window.scrollTo(0, startY + distance * eased);
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              sidebarLinks.forEach((a) => a.classList.remove("active"));
              const match = document.querySelector('.add-tab-list a[href="' + targetId + '"]');
              if (match) match.classList.add("active");
            }
          }
          requestAnimationFrame(step);
        });
      });
    }

    // ---------------------------------------------------------------
    // Payment method toggle
    // ---------------------------------------------------------------
    document.querySelectorAll(".payment-form .form-check-input").forEach((radio) => {
      radio.addEventListener("change", function () {
        const showEl = (sel, show) => document.querySelectorAll(sel).forEach((n) => (n.style.display = show ? "" : "none"));
        if (this.value === "credit-card") {
          showEl(".credit-card-details", true);
          showEl(".paypal-details", false);
          showEl(".stripe-details", false);
        } else if (this.value === "paypal") {
          showEl(".credit-card-details", false);
          showEl(".paypal-details", true);
          showEl(".stripe-details", false);
        } else {
          showEl(".credit-card-details", false);
          showEl(".paypal-details", false);
          showEl(".stripe-details", true);
        }
      });
    });

    // Add comment / review reply toggle
    document.querySelectorAll(".add-reply").forEach((btn) => {
      btn.addEventListener("click", () => document.querySelectorAll(".review-reply").forEach((n) => n.classList.toggle("show")));
    });

    // Quill rich-text editors
    if (typeof Quill !== "undefined") {
      document.querySelectorAll(".snow-editor").forEach((el) => {
        new Quill(el, {
          theme: "snow",
          modules: {
            toolbar: [
              ["bold", "italic", "underline"],
              [{ header: [null, 1, 2, 3, 4, 5, 6] }],
              [{ list: "ordered" }, { list: "bullet" }],
              ["link", "image", "video"],
            ],
          },
        });
      });
    }

    // Animated letter-by-letter button text
    document.querySelectorAll(".animate-button").forEach((el) => {
      const text = el.getAttribute("data-text");
      const textEl = el.querySelector(".button-text");
      if (!text || !textEl) return;
      textEl.innerHTML = "";
      const chars = text.split("");
      const angleStep = 360 / chars.length;
      chars.forEach((ch, i) => {
        const span = document.createElement("span");
        span.textContent = ch;
        span.style.setProperty("--index", i);
        span.style.setProperty("--angle", angleStep);
        textEl.appendChild(span);
      });
    });

    // ---------------------------------------------------------------
    // Booking wizard steps
    // ---------------------------------------------------------------
    (function () {
      const steps = document.querySelectorAll(".step");
      const stepContents = document.querySelectorAll(".step-content");
      if (!steps.length) return;

      function goToStep(step) {
        steps.forEach((s) => s.classList.remove("active", "completed"));
        stepContents.forEach((c) => c.classList.remove("active"));

        const activeContent = document.querySelector('.step-content[data-step="' + step + '"]');
        if (activeContent) activeContent.classList.add("active");

        steps.forEach((s) => {
          const stepIndex = Number(s.dataset.step);
          if (stepIndex <= step) s.classList.add("active");
          if (stepIndex < step) s.classList.add("completed");
        });
      }

      document.querySelectorAll(".next-step").forEach((btn) => btn.addEventListener("click", () => goToStep(2)));
      document.querySelectorAll(".prev-step").forEach((btn) => btn.addEventListener("click", () => goToStep(1)));
      steps.forEach((s) => s.addEventListener("click", () => goToStep(Number(s.dataset.step))));

      document.querySelectorAll(".card").forEach((card) => {
        card.addEventListener("click", () => {
          document.querySelectorAll(".card").forEach((c) => c.classList.remove("active"));
          card.classList.add("active");
        });
      });
    })();

    // Tag buttons toggle
    document.querySelectorAll(".tag-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        this.classList.toggle("active");
      });
    });

    // ---------------------------------------------------------------
    // Scroll progress indicator
    // ---------------------------------------------------------------
    window.addEventListener("scroll", () => {
      const scrollProgress = document.getElementById("scroll-progress");
      const progressValue = document.getElementById("progress-value");
      if (scrollProgress && progressValue) {
        const pos = document.documentElement.scrollTop;
        const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        if (calcHeight > 0) {
          progressValue.textContent = Math.round((pos * 100) / calcHeight) + "%";
        }
      }
    });

    // ---------------------------------------------------------------
    // Image trail (GSAP-driven cursor-follow images)
    // ---------------------------------------------------------------
    if (typeof gsap !== "undefined") {
      const trailImages = document.querySelectorAll(".content-img");
      const interactionArea = document.querySelector(".support-content");
      let mouseStopTimer;
      const HIDE_DELAY = 400;

      function hideTrail() {
        gsap.to(trailImages, { opacity: 0, duration: 0.5, stagger: 0.05 });
      }
      function showTrail() {
        gsap.to(trailImages, { opacity: 1, duration: 0.1 });
      }

      if (interactionArea) {
        interactionArea.addEventListener("mousemove", (e) => {
          clearTimeout(mouseStopTimer);
          showTrail();
          gsap.to(trailImages, {
            x: e.clientX,
            y: e.clientY,
            stagger: 0.08,
            duration: 0.7,
            ease: "power3.out",
            overwrite: "auto",
          });
          mouseStopTimer = setTimeout(hideTrail, HIDE_DELAY);
        });
        interactionArea.addEventListener("mouseleave", hideTrail);
        interactionArea.addEventListener("mouseenter", showTrail);
      }
      hideTrail();
    }

    // ---------------------------------------------------------------
    // Booking dropdown live search + selection
    // ---------------------------------------------------------------
    document.querySelectorAll(".booking-dropdown .input-search input").forEach((input) => {
      input.addEventListener("keyup", function () {
        const value = this.value.toLowerCase();
        const dropdown = this.closest(".dropdown-menu");
        if (!dropdown) return;
        const items = dropdown.querySelectorAll("ul li");
        let visibleCount = 0;
        items.forEach((item) => {
          const match = item.textContent.toLowerCase().indexOf(value) > -1;
          item.style.display = match ? "" : "none";
          if (match) visibleCount++;
        });
        const existingNoResult = dropdown.querySelector(".no-result");
        if (existingNoResult) existingNoResult.remove();
        if (visibleCount === 0) {
          const ul = dropdown.querySelector("ul");
          if (ul) {
            const li = document.createElement("li");
            li.className = "no-result text-center p-3 text-muted";
            li.textContent = "No results found";
            ul.appendChild(li);
          }
        }
      });
    });

    document.querySelectorAll(".booking-dropdown .dropdown-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const cityEl = item.querySelector(".dropdown-name");
        const propsEl = item.querySelector(".dropdown-sub-name");
        const city = cityEl ? cityEl.textContent : "";
        const properties = propsEl ? propsEl.textContent : "";
        const parent = item.closest(".booking-dropdown");
        if (!parent) return;
        const valueInput = parent.querySelector(".value-input");
        const subnameResult = parent.querySelector(".subname-result");
        if (valueInput) valueInput.value = city;
        if (subnameResult) subnameResult.textContent = properties;
      });
    });

    // ---------------------------------------------------------------
    // Member/passenger count dropdown summary (adult/children/infant/room)
    // ---------------------------------------------------------------
    document.addEventListener("click", (e) => {
      if (!e.target || !e.target.classList.contains("apply-btn")) return;
      const dropdown = e.target.closest(".form-item.dropdown");
      if (!dropdown) return;

      const summaryPersons = dropdown.querySelector(".member-count");
      const adultSpan = dropdown.querySelector(".adult");
      const childrenSpan = dropdown.querySelector(".children");
      const infantSpan = dropdown.querySelector(".infant");
      const classSpan = dropdown.querySelector(".class-name");
      const roomSpan = dropdown.querySelector(".room");

      const adultInput = dropdown.querySelector('.input-number[data-type="adult"]');
      const childrenInput = dropdown.querySelector('.input-number[data-type="children"]');
      const infantInput = dropdown.querySelector('.input-number[data-type="infant"]');
      const roomInput = dropdown.querySelector('.input-number[data-type="room"]');

      const adults = adultInput ? Number(adultInput.value) : 0;
      const children = childrenInput ? Number(childrenInput.value) : 0;
      const infants = infantInput ? Number(infantInput.value) : 0;
      const room = roomInput ? Number(roomInput.value) : 0;
      const total = adults + children + infants + room;

      const cabinClassInput = dropdown.querySelector('input[name="cabin-class"]:checked');
      const cabinClass = cabinClassInput ? cabinClassInput.value : "Economy";

      if (summaryPersons) summaryPersons.innerHTML = total + ' <span class="fw-normal fs-14">Persons</span>';
      if (adultSpan) adultSpan.textContent = adults;
      if (childrenSpan) childrenSpan.textContent = children;
      if (infantSpan) infantSpan.textContent = infants;
      if (classSpan) classSpan.textContent = cabinClass;
      if (roomSpan) roomSpan.textContent = room;

      const dropdownToggle = dropdown.querySelector('[data-bs-toggle="dropdown"]');
      if (dropdownToggle && typeof bootstrap !== "undefined" && bootstrap.Dropdown) {
        bootstrap.Dropdown.getOrCreateInstance(dropdownToggle).hide();
      }
    });

    // Swap "from"/"to" locations (way-icon swap button)
    document.addEventListener("click", (e) => {
      const icon = e.target.closest(".way-icon");
      if (!icon) return;
      e.preventDefault();

      const formInfo = icon.closest(".form-info");
      if (!formInfo) return;

      const dropdowns = Array.from(formInfo.querySelectorAll(".change-drop")).filter(
        (el) => el.offsetParent !== null
      );
      if (dropdowns.length < 2) return;

      const [first, second] = dropdowns;
      const firstInput = first.querySelector(".value-input");
      const secondInput = second.querySelector(".value-input");
      const firstDesc = first.querySelector("p");
      const secondDesc = second.querySelector("p");

      if (firstInput && secondInput) {
        [firstInput.value, secondInput.value] = [secondInput.value, firstInput.value];
      }
      if (firstDesc && secondDesc) {
        [firstDesc.textContent, secondDesc.textContent] = [secondDesc.textContent, firstDesc.textContent];
      }
    });
  });

   document.addEventListener("DOMContentLoaded", function () {
      var slider = document.getElementById("range_03");
      var amount = document.getElementById("range_03-amount");
      if (slider && amount) {
          slider.addEventListener("rangechange", function (e) {
              amount.textContent = "$" + e.detail.from + " - $" + e.detail.to;
          });
      }
  });

  document.addEventListener("DOMContentLoaded", function () {
      var slider = document.getElementById("range_04");
      var amount = document.getElementById("range_04-amount");
      if (slider && amount) {
          slider.addEventListener("rangechange", function (e) {
              amount.textContent = e.detail.from + " Km - " + e.detail.to + " Km";
          });
      }
  });

  document.addEventListener("DOMContentLoaded", function () {
    var slider = document.getElementById("range_01");
    var amount = document.getElementById("range_01-amount");
    if (slider && amount) {
        slider.addEventListener("rangechange", function (e) {
            amount.textContent = e.detail.from + "km";
        });
    }
});

 document.addEventListener("DOMContentLoaded", function () {
     var slider = document.getElementById("range_15");
     var amount = document.getElementById("range_15-amount");
     if (slider && amount) {
         slider.addEventListener("rangechange", function (e) {
             amount.textContent = e.detail.from + " KM";
         });
     }
 });

})();
