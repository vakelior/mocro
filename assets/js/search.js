/**
 * MOCRO — search.js | shared overlay search (every page).
 */
(function () {
  'use strict';
  if (!window.Mocro) return;
  var M = window.Mocro;
  var debounce = null;
  function url(p) { var b = window.MOCRO_CONFIG.SITE_BASE; if (b.slice(-1) !== '/') b += '/'; return b + p; }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  function openOverlay() { var ov = document.getElementById('search-overlay'); if (!ov) return; ov.classList.add('is-open'); ov.setAttribute('aria-hidden', 'false'); var inp = document.getElementById('search-input'); if (inp) setTimeout(function () { inp.focus(); }, 50); }
  function closeOverlay() { var ov = document.getElementById('search-overlay'); if (!ov) return; ov.classList.remove('is-open'); ov.setAttribute('aria-hidden', 'true'); }

  function render(results, container) {
    container.innerHTML = '';
    if (!results || !results.length) { container.innerHTML = '<div class="search-empty">لا نتائج مطابقة.</div>'; return; }
    results.forEach(function (a) {
      var row = el('a', 'search-result');
      row.href = url('article.html?slug=' + encodeURIComponent(a.slug));
      if (a.featured_image) { var img = document.createElement('img'); img.src = a.featured_image; img.alt = a.title; row.appendChild(img); }
      var body = el('div', 'sr-body');
      body.appendChild(el('div', 'sr-title', a.title));
      body.appendChild(el('div', 'sr-meta', a.categories ? a.categories.name : ''));
      row.appendChild(body);
      container.appendChild(row);
    });
  }

  function run(q) {
    var c = document.getElementById('search-results'); if (!c) return;
    c.innerHTML = '<div class="search-empty">جارٍ البحث…</div>';
    M.search(q, 30).then(function (res) { render(res.data || [], c); }).catch(function () { c.innerHTML = '<div class="search-empty">حدث خطأ.</div>'; });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.querySelector('[data-search-toggle]');
    var close = document.querySelector('[data-search-close]');
    var input = document.getElementById('search-input');
    if (toggle) toggle.addEventListener('click', openOverlay);
    if (close) close.addEventListener('click', closeOverlay);
    var ov = document.getElementById('search-overlay');
    if (ov) ov.addEventListener('click', function (e) { if (e.target === ov) closeOverlay(); });
    if (input) input.addEventListener('input', function () {
      clearTimeout(debounce);
      var q = input.value.trim();
      if (!q) { document.getElementById('search-results').innerHTML = ''; return; }
      debounce = setTimeout(function () { run(q); }, 300);
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeOverlay(); });
    document.addEventListener('keydown', function (e) { if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openOverlay(); } });
  });

  window.MocroSearch = { open: openOverlay, close: closeOverlay };
})();