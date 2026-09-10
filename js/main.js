/* ==========================================================================
   Dan's Landscaping — site JavaScript
   Handles: mobile nav, footer year, work carousel, contact form.
   No dependencies.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a") && links.classList.contains("is-open")) {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open menu");
      }
    });
  }

  /* ---------- Carousel ---------- */
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var track = root.querySelector("[data-carousel-track]");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".carousel__slide"));
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    var dotsWrap = root.querySelector("[data-carousel-dots]");
    if (!track || slides.length === 0) return;

    var index = 0;
    var count = slides.length;
    var interval = parseInt(root.getAttribute("data-interval"), 10) || 0;
    var timer = null;
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Build dots
    var dots = [];
    if (dotsWrap) {
      for (var i = 0; i < count; i++) {
        var dot = document.createElement("button");
        dot.className = "carousel__dot";
        dot.type = "button";
        dot.setAttribute("aria-label", "Go to slide " + (i + 1));
        (function (n) {
          dot.addEventListener("click", function () { goTo(n); restart(); });
        })(i);
        dotsWrap.appendChild(dot);
        dots.push(dot);
      }
    }

    function goTo(n) {
      index = (n + count) % count;
      track.style.transform = "translateX(-" + index * 100 + "%)";
      var nextI = (index + 1) % count;
      var prevI = (index - 1 + count) % count;
      slides.forEach(function (s, i) {
        s.setAttribute("aria-hidden", String(i !== index));
        // Load each photo only when it's the current, next or previous slide
        var img = s.querySelector("img[data-src]");
        if (img && (i === index || i === nextI || i === prevI)) {
          img.src = img.getAttribute("data-src");
          img.removeAttribute("data-src");
        }
      });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
    }

    function next() { goTo(index + 1); }
    function prev() { goTo(index - 1); }

    function start() {
      if (interval > 0 && !reduceMotion) timer = window.setInterval(next, interval);
    }
    function stop() { if (timer) { window.clearInterval(timer); timer = null; } }
    function restart() { stop(); start(); }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });

    // Pause on hover / focus
    root.addEventListener("mouseenter", stop);
    root.addEventListener("mouseleave", start);
    root.addEventListener("focusin", stop);
    root.addEventListener("focusout", start);

    // Keyboard
    root.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { next(); restart(); }
      else if (e.key === "ArrowLeft") { prev(); restart(); }
    });

    // Touch / swipe
    var startX = 0, deltaX = 0, swiping = false;
    track.addEventListener("touchstart", function (e) {
      startX = e.touches[0].clientX; deltaX = 0; swiping = true; stop();
    }, { passive: true });
    track.addEventListener("touchmove", function (e) {
      if (swiping) deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    track.addEventListener("touchend", function () {
      if (swiping && Math.abs(deltaX) > 45) { deltaX < 0 ? next() : prev(); }
      swiping = false; start();
    });

    // Pause when tab is hidden
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stop() : start();
    });

    goTo(0);
    start();
  });

  /* ---------- Contact form ---------- */
  var form = document.getElementById("booking-form");
  if (form) {
    var statusEl = document.getElementById("form-status");
    var MAILTO = "championsouthernlandscaping@gmail.com"; // recipient for the mailto fallback (no backend configured)
    var PHONE = "(210) 772-9013";

    function setError(field, on) {
      field.classList.toggle("has-error", on);
    }

    function validEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    function validate() {
      var ok = true;
      form.querySelectorAll(".field").forEach(function (field) {
        var input = field.querySelector("input, select, textarea");
        if (!input) return;
        var val = (input.value || "").trim();
        var bad = false;

        if (input.hasAttribute("required") && !val) bad = true;
        if (input.type === "email" && val && !validEmail(val)) bad = true;
        if (input.type === "tel" && val && !/[0-9]{6,}/.test(val.replace(/[^0-9]/g, ""))) bad = true;

        setError(field, bad);
        if (bad && ok) { input.focus(); }
        if (bad) ok = false;
      });
      return ok;
    }

    // Clear a field's error as the user fixes it
    form.addEventListener("input", function (e) {
      var field = e.target.closest(".field");
      if (field && field.classList.contains("has-error")) setError(field, false);
    });

    function showStatus(msg, isError) {
      if (!statusEl) return;
      statusEl.textContent = msg;
      statusEl.classList.add("is-visible");
      statusEl.style.background = isError ? "#fdecea" : "";
      statusEl.style.color = isError ? "#b23b2e" : "";
    }

    function buildMailto() {
      var get = function (n) {
        var el = form.querySelector('[name="' + n + '"]');
        return el ? el.value.trim() : "";
      };
      var lines = [
        "Name: " + get("name"),
        "Email: " + get("email"),
        "Phone: " + get("phone"),
        "Service: " + get("service"),
        "Timing: " + get("timing"),
        "Postcode / area: " + get("postcode"),
        "",
        "About the garden:",
        get("message")
      ];
      return "mailto:" + MAILTO +
        "?subject=" + encodeURIComponent("Garden enquiry from " + get("name")) +
        "&body=" + encodeURIComponent(lines.join("\n"));
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) {
        showStatus("Please check the highlighted fields.", true);
        return;
      }

      var action = form.getAttribute("action") || "";
      var configured = action && action.indexOf("your-form-id") === -1;

      if (!configured) {
        // No backend wired up yet — open the visitor's email client pre-filled.
        window.location.href = buildMailto();
        showStatus("Opening your email app with the details filled in — just hit send. " +
                   "Prefer we set up a proper form? See the README.", false);
        return;
      }

      // Backend configured (e.g. Formspree) — submit in the background.
      var btn = form.querySelector('button[type="submit"]');
      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }

      fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      }).then(function (res) {
        if (res.ok) {
          form.reset();
          showStatus("Thanks — your enquiry is on its way. We'll be in touch within two working days.", false);
        } else {
          showStatus("Something went wrong sending that. Please call us on " + PHONE + ".", true);
        }
      }).catch(function () {
        showStatus("Couldn't send just now. Please email " + MAILTO + " or call " + PHONE + ".", true);
      }).finally(function () {
        if (btn) { btn.disabled = false; btn.textContent = "Send enquiry"; }
      });
    });
  }

  /* ---------- Careers board ---------- */
  var board = document.querySelector("[data-careers]");
  if (board) {
    var jobItems = Array.prototype.slice.call(board.querySelectorAll(".careers__item"));
    var jobPanels = Array.prototype.slice.call(board.querySelectorAll(".careers__panel"));

    function selectJob(id, moveFocus) {
      jobItems.forEach(function (it) {
        var on = it.getAttribute("data-job") === id;
        it.classList.toggle("is-active", on);
        it.setAttribute("aria-current", on ? "true" : "false");
      });
      jobPanels.forEach(function (p) {
        p.hidden = p.getAttribute("data-job") !== id;
      });
      var panel = board.querySelector('.careers__panel[data-job="' + id + '"]');
      if (panel && moveFocus) {
        var h = panel.querySelector("h2");
        if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
      }
      if (panel && moveFocus && window.matchMedia("(max-width: 820px)").matches) {
        panel.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    jobItems.forEach(function (it) {
      it.addEventListener("click", function () { selectJob(it.getAttribute("data-job"), true); });
    });

    // Deep link: careers.html#job-crew-leader
    var wanted = (window.location.hash || "").replace(/^#job-/, "");
    if (wanted && board.querySelector('.careers__item[data-job="' + wanted + '"]')) {
      selectJob(wanted, false);
    }
  }
})();
