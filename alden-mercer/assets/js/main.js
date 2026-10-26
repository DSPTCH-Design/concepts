/* Alden & Mercer — site script by DSPTCH Design
   Header state, mobile menu, scroll reveals. No tracking, no network calls. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.classList.add("js");

  /* ---- Header: solid after scrolling past the top ---- */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- Mobile menu ---- */
  var toggle = document.querySelector("[data-menu-toggle]");
  var menu = document.querySelector("[data-mobile-menu]");
  var label = toggle && toggle.querySelector(".menu-toggle__label");

  function focusables() {
    return [toggle].concat(Array.prototype.slice.call(menu.querySelectorAll("a, button")));
  }
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    if (label) label.textContent = open ? "Close" : "Menu";
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    if (header) header.classList.toggle("menu-is-open", open);
    if (open) {
      var first = menu.querySelector("a");
      if (first) first.focus();
    }
  }
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      setMenu(toggle.getAttribute("aria-expanded") !== "true");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (menu.hidden) return;
      if (e.key === "Escape") { setMenu(false); toggle.focus(); return; }
      if (e.key === "Tab") {
        var items = focusables();
        var i = items.indexOf(document.activeElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); items[items.length - 1].focus(); }
        else if (!e.shiftKey && i === items.length - 1) { e.preventDefault(); items[0].focus(); }
      }
    });
    window.matchMedia("(min-width: 961px)").addEventListener("change", function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---- Scroll reveals ---- */
  var items = Array.prototype.slice.call(document.querySelectorAll("[data-reveal]"));
  function show(el) { el.classList.add("is-in"); }
  if (reduceMotion || !("IntersectionObserver" in window)) {
    items.forEach(show);
  } else {
    // Stagger siblings that share a parent
    items.forEach(function (el) {
      var sibs = Array.prototype.filter.call(el.parentElement.children, function (c) { return c.hasAttribute("data-reveal"); });
      el.style.setProperty("--d", (sibs.indexOf(el) * 0.09).toFixed(2) + "s");
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { show(entry.target); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
    // Safety net: never leave content hidden
    window.setTimeout(function () { items.forEach(show); }, 4000);
  }

  /* ---- Expertise: highlight the practice in view ---- */
  var railLinks = Array.prototype.slice.call(document.querySelectorAll("[data-rail-link]"));
  var railSections = Array.prototype.slice.call(document.querySelectorAll("[data-rail-section]"));
  if (railLinks.length && "IntersectionObserver" in window) {
    var setCurrent = function (id) {
      railLinks.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + id;
        a.classList.toggle("is-current", on);
        if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
      });
    };
    var railIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) setCurrent(e.target.id); });
    }, { rootMargin: "-35% 0px -55% 0px" });
    railSections.forEach(function (s) { railIO.observe(s); });
    setCurrent(railSections[0].id);
  }

  /* ---- Perspectives: article previews ---- */
  var toggles = Array.prototype.slice.call(document.querySelectorAll("[data-essay-toggle]"));
  function setEssay(btn, open) {
    var panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    btn.querySelector("[data-label-closed]").hidden = open;
    btn.querySelector("[data-label-open]").hidden = !open;
  }
  toggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var open = btn.getAttribute("aria-expanded") !== "true";
      setEssay(btn, open);
      if (!open) btn.closest(".essay").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    });
  });
  if (toggles.length && location.hash) {
    var target = document.getElementById(location.hash.slice(1));
    var tBtn = target && target.querySelector("[data-essay-toggle]");
    if (tBtn) setEssay(tBtn, true);
  }

  /* ---- Contact: in-browser validation only. Nothing is sent or stored. ---- */
  var form = document.querySelector("[data-inquiry]");
  if (form) {
    var done = document.querySelector("[data-inquiry-done]");
    var area = new URLSearchParams(location.search).get("area");
    var areaSelect = form.querySelector("#f-area");
    if (area && areaSelect && areaSelect.querySelector('option[value="' + area + '"]')) areaSelect.value = area;

    var rules = {
      "f-name": function (el) { return el.value.trim() ? "" : "Please enter your name."; },
      "f-email": function (el) {
        var v = el.value.trim();
        if (!v) return "Please enter your work email.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Please enter an email address like name@company.com.";
      },
      "f-message": function (el) {
        var v = el.value.trim();
        if (!v) return "Please add a brief message.";
        return v.length < 20 ? "Please add a little more context (at least 20 characters)." : "";
      },
      "f-consent": function (el) { return el.checked ? "" : "Please confirm before sending."; }
    };
    function check(id) {
      var el = document.getElementById(id);
      var msg = rules[id](el);
      var err = form.querySelector('[data-error-for="' + id + '"]');
      if (err) err.textContent = msg;
      if (msg) el.setAttribute("aria-invalid", "true"); else el.removeAttribute("aria-invalid");
      return !msg;
    }
    Object.keys(rules).forEach(function (id) {
      var el = document.getElementById(id);
      el.addEventListener(el.type === "checkbox" ? "change" : "blur", function () {
        if (el.type === "checkbox" || el.value.trim() || el.hasAttribute("aria-invalid")) check(id);
      });
      el.addEventListener("input", function () { if (el.hasAttribute("aria-invalid")) check(id); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var firstBad = null;
      Object.keys(rules).forEach(function (id) { if (!check(id) && !firstBad) firstBad = id; });
      if (firstBad) { document.getElementById(firstBad).focus(); return; }
      form.reset();
      form.hidden = true;
      if (done) { done.hidden = false; done.focus(); }
    });
  }
})();
