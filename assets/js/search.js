/**
 * MOCRO — search.js | live search inside the mobile menu.
 * Clean B&W search field with a search icon inside; results appear below as you type.
 */
(function () {
  'use strict';
  if (!window.Mocro) return;
  var M = window.Mocro;

  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function url(p) { var b = window.MOCRO_CONFIG.SITE_BASE; if (b.slice(-1) !== '/') b += '/'; return b + p; }

  function renderInto(results, container) {
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

  function bind(input, results) {
    if (!input || !results) return;
    var debounce = null;
    input.addEventListener('input', function () {
      clearTimeout(debounce);
      var q = input.value.trim();
      if (!q) { results.innerHTML = ''; return; }
      debounce = setTimeout(function () {
        results.innerHTML = '<div class="search-empty">جارٍ البحث…</div>';
        M.search(q, 30).then(function (res) { renderInto(res.data || [], results); })
          .catch(function () { results.innerHTML = '<div class="search-empty">حدث خطأ.</div>'; });
      }, 300);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    var menuInput = document.getElementById('menu-search-input');
    var menuResults = document.getElementById('menu-search-results');
    bind(menuInput, menuResults);
  });
})();
