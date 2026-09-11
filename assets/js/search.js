/**
 * MOCRO — search.js | search inside the mobile menu.
 * On submit (Enter) redirects to the search results page.
 */
(function () {
  'use strict';
  if (!window.Mocro) return;

  function url(p) { var b = window.MOCRO_CONFIG.SITE_BASE; if (b.slice(-1) !== '/') b += '/'; return b + p; }

  function bind(input) {
    if (!input) return;
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        var q = input.value.trim();
        if (!q) return;
        window.location.href = url('search.html?q=' + encodeURIComponent(q));
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bind(document.getElementById('menu-search-input'));
  });
})();
