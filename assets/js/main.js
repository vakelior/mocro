/* ============ MOCRO — Main JavaScript (production) ============ */
(function () {
  'use strict';
  var THEME_KEY = 'mocro-theme';
  var root = document.documentElement;
  function getStoredTheme() { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } }
  function storeTheme(value) { try { localStorage.setItem(THEME_KEY, value); } catch (e) { } }
  function resolveTheme() {
    var stored = getStoredTheme();
    if (stored === 'dark' || stored === 'light') return stored;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    return 'light';
  }
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var toggle = document.querySelector('[data-theme-toggle]');
    if (toggle) toggle.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }
  applyTheme(resolveTheme());
  var toggleBtn = document.querySelector('[data-theme-toggle]');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      storeTheme(next);
    });
  }
  const burger = document.querySelector('[data-burger]');
  const menu = document.querySelector('#mobile-menu');
  let lastFocused = null;
  function openMenu() {
    if (!menu) return;
    lastFocused = document.activeElement;
    menu.classList.add('is-open');
    menu.setAttribute('aria-hidden', 'false');
    burger && burger.classList.add('is-active');
    burger && burger.setAttribute('aria-expanded', 'true');
    document.addEventListener('keydown', handleEscape);
  }
  function closeMenu() {
    if (!menu) return;
    menu.classList.remove('is-open');
    menu.setAttribute('aria-hidden', 'true');
    burger && burger.classList.remove('is-active');
    burger && burger.setAttribute('aria-expanded', 'false');
    document.removeEventListener('keydown', handleEscape);
    if (lastFocused) lastFocused.focus();
  }
  function handleEscape(e) { if (e.key === 'Escape') closeMenu(); }
  burger && burger.addEventListener('click', function () {
    var isOpen = menu && menu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });
  var slides = Array.prototype.slice.call(document.querySelectorAll('[data-slide]'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-slider-dot]'));
  var current = 0;
  var sliderAuto = null;
  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (s, i) { s.classList.toggle('is-active', i === current); });
    dots.forEach(function (d, i) { d.classList.toggle('is-active', i === current); });
  }
  function nextSlide() { showSlide(current + 1); }
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () { showSlide(parseInt(dot.getAttribute('data-slider-dot'), 10)); restartAuto(); });
  });
  function startAuto() {
    if (slides.length <= 1) return;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;
    sliderAuto = setInterval(nextSlide, 6000);
  }
  function restartAuto() { clearInterval(sliderAuto); startAuto(); }
  startAuto();
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const id = link.getAttribute('href');
      if (id && id.length > 1) {
        const target = document.querySelector(id);
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); closeMenu(); }
      }
    });
  });
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('in-view'); revealObserver.unobserve(entry.target); } });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else { revealEls.forEach(function (el) { el.classList.add('in-view'); }); }
  // ===== Dropdown navigation =====
  var navItems = Array.prototype.slice.call(document.querySelectorAll('.nav-item.has-sub'));
  function closeAllDropdowns() {
    navItems.forEach(function (item) {
      item.classList.remove('open');
      var trigger = item.querySelector('.nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }
  navItems.forEach(function (item) {
    var trigger = item.querySelector('.nav-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = item.classList.contains('open');
      closeAllDropdowns();
      if (!isOpen) {
        item.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
    item.addEventListener('mouseenter', function () { closeAllDropdowns(); item.classList.add('open'); trigger.setAttribute('aria-expanded', 'true'); });
    item.addEventListener('mouseleave', function () { item.classList.remove('open'); trigger.setAttribute('aria-expanded', 'false'); });
  });
  document.addEventListener('click', closeAllDropdowns);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAllDropdowns(); });
})();