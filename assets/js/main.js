/* ============ MOCRO — Main JavaScript (production, DB-driven) ============ */
(function () {
  'use strict';

  // Theme is intentionally hard-locked to light (القالب نهار/أبيض فقط).

  var burger = document.querySelector('[data-burger]');
  var menu = document.getElementById('mobile-menu');
  var lastFocused = null;
  function openMenu() { if (!menu) return; lastFocused = document.activeElement; menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); if (burger) { burger.classList.add('is-active'); burger.setAttribute('aria-expanded', 'true'); } document.addEventListener('keydown', handleEscape); }
  function closeMenu() { if (!menu) return; menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); if (burger) { burger.classList.remove('is-active'); burger.setAttribute('aria-expanded', 'false'); } document.removeEventListener('keydown', handleEscape); if (lastFocused) { lastFocused.focus(); lastFocused = null; } }
  function handleEscape(e) { if (e.key === 'Escape') closeMenu(); }
  if (burger) burger.addEventListener('click', function (e) { e.stopPropagation(); menu && menu.classList.contains('is-open') ? closeMenu() : openMenu(); });
  if (menu) {
    menu.addEventListener('click', function (e) {
      e.stopPropagation();
      var link = e.target && e.target.closest ? e.target.closest('a') : null;
      if (link) closeMenu();
    });
    document.addEventListener('click', function (e) { if (menu.classList.contains('is-open') && !menu.contains(e.target) && e.target !== burger) closeMenu(); });
  }

  var sliderAuto = null;
  function initSlider() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-slider-dot]'));
    if (!slides.length) return;
    var current = 0;
    var sliderRoot = slides[0].parentElement || null;
    function showSlide(i) { current = (i + slides.length) % slides.length; slides.forEach(function (s, x) { s.classList.toggle('is-active', x === current); }); dots.forEach(function (d, x) { d.classList.toggle('is-active', x === current); }); }
    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }
    showSlide(0);
    dots.forEach(function (dot) { dot.onclick = function () { showSlide(parseInt(dot.getAttribute('data-slider-dot'), 10)); restartAuto(); }; });
    function startAuto() { if (slides.length <= 1) return; if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; sliderAuto = setInterval(nextSlide, 6000); }
    function restartAuto() { clearInterval(sliderAuto); startAuto(); }
    startAuto();

    // Touch / pointer swipe for the featured slider (RTL aware).
    if (sliderRoot) {
      var sx = null, sy = null, swiping = false, lock = false;
      sliderRoot.style.touchAction = 'pan-y';
      sliderRoot.addEventListener('pointerdown', function (ev) {
        if (ev.pointerType === 'mouse' && ev.button !== 0) return;
        swiping = true; lock = false; sx = ev.clientX; sy = ev.clientY;
        clearInterval(sliderAuto);
        try { sliderRoot.setPointerCapture(ev.pointerId); } catch (e) {}
      });
      sliderRoot.addEventListener('pointermove', function (ev) {
        if (!swiping || sx === null) return;
        var dx = ev.clientX - sx; var dy = ev.clientY - sy;
        if (!lock && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (Math.abs(dy) > Math.abs(dx)) { swiping = false; lock = false; sx = null; sy = null; restartAuto(); return; }
        lock = true;
      });
      sliderRoot.addEventListener('pointerup', function (ev) {
        if (!swiping || sx === null) { restartAuto(); return; }
        swiping = false;
        var dx = ev.clientX - sx;
        var isRTL = (document.documentElement.getAttribute('dir') === 'rtl') || (getComputedStyle && getComputedStyle(document.body).direction === 'rtl');
        if (Math.abs(dx) > 50) {
          // In RTL, swiping left (negative dx) advances to the next slide.
          if ((dx < 0 && !isRTL) || (dx > 0 && isRTL)) nextSlide();
          else prevSlide();
        }
        sx = null; sy = null; lock = false;
        restartAuto();
      });
      sliderRoot.addEventListener('pointercancel', function () { swiping = false; sx = null; sy = null; lock = false; restartAuto(); });
    }
  }
  initSlider();
  window.MocroInitSlider = initSlider;

  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var id = link.getAttribute('href');
      if (id && id.length > 1) { var target = document.querySelector(id); if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); closeMenu(); } }
    });
  });

  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) { entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in-view'); ro.unobserve(en.target); } }); }, { threshold: 0.12 });
    revealEls.forEach(function (e) { ro.observe(e); });
  } else { revealEls.forEach(function (e) { e.classList.add('in-view'); }); }

  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item.has-sub'));
  function closeAllDropdowns() { navItems.forEach(function (item) { item.classList.remove('open'); var t = item.querySelector('.nav-trigger'); if (t) t.setAttribute('aria-expanded', 'false'); }); }
  navItems.forEach(function (item) {
    var trigger = item.querySelector('.nav-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) { e.stopPropagation(); var isOpen = item.classList.contains('open'); closeAllDropdowns(); if (!isOpen) { item.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); } });
    item.addEventListener('mouseenter', function () { closeAllDropdowns(); item.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); });
    item.addEventListener('mouseleave', function () { item.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('click', closeAllDropdowns);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAllDropdowns(); });
})();
