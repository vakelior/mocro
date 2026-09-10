/* ============ MOCRO — Main JavaScript (production, DB-driven) ============ */
(function () {
  'use strict';
  var THEME_KEY = 'mocro-theme';
  var root = document.documentElement;
  function getStoredTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function storeTheme(v) { try { localStorage.setItem(THEME_KEY, v); } catch (e) {} }
  function resolveTheme() {
    var s = getStoredTheme();
    if (s === 'dark' || s === 'light') return s;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    var tg = document.querySelector('[data-theme-toggle]');
    if (tg) tg.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
  }
  applyTheme(resolveTheme());

  var toggleBtn = document.querySelector('[data-theme-toggle]');
  if (toggleBtn) toggleBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next); storeTheme(next);
  });

  var burger = document.querySelector('[data-burger]');
  var menu = document.getElementById('mobile-menu');
  var lastFocused = null;
  function openMenu() { if (!menu) return; lastFocused = document.activeElement; menu.classList.add('is-open'); menu.setAttribute('aria-hidden', 'false'); if (burger) { burger.classList.add('is-active'); burger.setAttribute('aria-expanded', 'true'); } document.addEventListener('keydown', handleEscape); }
  function closeMenu() { if (!menu) return; menu.classList.remove('is-open'); menu.setAttribute('aria-hidden', 'true'); if (burger) { burger.classList.remove('is-active'); burger.setAttribute('aria-expanded', 'false'); } document.removeEventListener('keydown', handleEscape); if (lastFocused) lastFocused.focus(); }
  function handleEscape(e) { if (e.key === 'Escape') closeMenu(); }
  if (burger) burger.addEventListener('click', function () { menu && menu.classList.contains('is-open') ? closeMenu() : openMenu(); });

  var sliderAuto = null;
  function initSlider() {
    var slides = Array.prototype.slice.call(document.querySelectorAll('[data-slide]'));
    var dots = Array.prototype.slice.call(document.querySelectorAll('[data-slider-dot]'));
    if (!slides.length) return;
    var current = 0;
    function showSlide(i) { current = (i + slides.length) % slides.length; slides.forEach(function (s, x) { s.classList.toggle('is-active', x === current); }); dots.forEach(function (d, x) { d.classList.toggle('is-active', x === current); }); }
    function nextSlide() { showSlide(current + 1); }
    showSlide(0);
    dots.forEach(function (dot) { dot.onclick = function () { showSlide(parseInt(dot.getAttribute('data-slider-dot'), 10)); restartAuto(); }; });
    function startAuto() { if (slides.length <= 1) return; if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; sliderAuto = setInterval(nextSlide, 6000); }
    function restartAuto() { clearInterval(sliderAuto); startAuto(); }
    startAuto();
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