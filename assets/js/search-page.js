/**
 * MOCRO — search-page.js | standalone search page (/search.html?q=…)
 */
(function () {
  'use strict';
  if (!window.Mocro) return;
  var M = window.Mocro;
  var debounce = null;
  function url(p) { var b = window.MOCRO_CONFIG.SITE_BASE; if (b.slice(-1) !== '/') b += '/'; return b + p; }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function render(results, container) {
    container.innerHTML = '';
    if (!results || !results.length) { container.innerHTML = '<div class="search-empty">لا نتائج مطابقة.</div>'; return; }
    results.forEach(function (a) {
      var row = el('a', 'search-result');
      row.href = url('article.html?slug=' + encodeURIComponent(a.slug));
      if (a.featured_image) { var img = document.createElement('img'); img.src = a.featured_image; img.alt = a.title; row.appendChild(img); }
      var body = el('div', 'sr-body');
      body.appendChild(el('div', 'sr-title', a.title));
      if (a.excerpt) body.appendChild(el('div', 'sr-meta', a.excerpt));
      row.appendChild(body);
      container.appendChild(row);
    });
  }
  function run(q) {
    var c = document.getElementById('page-search-results'); if (!c) return;
    c.innerHTML = '<div class="search-empty">جارٍ البحث…</div>';
    M.search(q, 40).then(function (res) { render(res.data || [], c); });
  }
  document.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('page-search-input');
    var q = new URLSearchParams(window.location.search).get('q');
    if (q) { input.value = q; run(q); }
    input.addEventListener('input', function () { clearTimeout(debounce); var v = input.value.trim(); debounce = setTimeout(function () { run(v); }, 300); });
  });
})();