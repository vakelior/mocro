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
  const sidebar = document.querySelector('[data-sidebar]');
  const backdrop = document.querySelector('[data-backdrop]');
  const closeBtn = document.querySelector('[data-sidebar-close]');
  let lastFocused = null;
  function openSidebar() {
    if (!sidebar) return;
    lastFocused = document.activeElement;
    sidebar.classList.add('is-open');
    backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    sidebar.setAttribute('aria-hidden', 'false');
    closeBtn && closeBtn.focus();
    document.addEventListener('keydown', handleEscape);
  }
  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('is-open');
    backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
    sidebar.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleEscape);
    if (lastFocused) lastFocused.focus();
  }
  function handleEscape(e) { if (e.key === 'Escape') closeSidebar(); }
  burger && burger.addEventListener('click', openSidebar);
  closeBtn && closeBtn.addEventListener('click', closeSidebar);
  backdrop && backdrop.addEventListener('click', closeSidebar);
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
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); closeSidebar(); }
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
})();