/**
 * MOCRO — shared.js | category nav filler.
 */
(function () {
  'use strict';
  var M = window.Mocro || null;

  function base(path) {
    var b = (window.MOCRO_CONFIG && window.MOCRO_CONFIG.SITE_BASE) || '';
    if (b && b.slice(-1) !== '/') b += '/';
    if (b && path.slice(0, 5) !== 'http:' && path.slice(0, 6) !== 'https:') return b + path;
    return path;
  }
  function catUrl(c) { return base('category.html?slug=' + encodeURIComponent(c.slug)); }

  function populateCategoryNav(categories) {
    var desktopSub = document.getElementById('nav-categories-desktop');
    var mobileMenu = document.getElementById('mobile-menu');
    var footerCats = document.getElementById('footer-categories');

    if (desktopSub) {
      desktopSub.innerHTML = '';
      categories.forEach(function (c, i) {
        var a = document.createElement('a');
        a.href = catUrl(c); a.setAttribute('role', 'menuitem');
        var span = document.createElement('span'); span.textContent = c.name; a.appendChild(span);
        var num = document.createElement('span'); num.className = 'sub-num';
        num.textContent = String(i + 1).padStart(2, '0'); a.appendChild(num);
        desktopSub.appendChild(a);
      });
    }

    if (mobileMenu) {
      Array.prototype.forEach.call(mobileMenu.querySelectorAll('a[data-cat]'), function (a) { a.remove(); });
      var ref = mobileMenu.querySelector('a[href="index.html#latest"], a[href="#latest"]');
      var insertAfter = ref || null;
      categories.forEach(function (c) {
        var a = document.createElement('a');
        a.href = catUrl(c); a.setAttribute('data-cat', '');
        var span = document.createElement('span'); span.textContent = c.name; a.appendChild(span);
        var ar = document.createElement('span');
        ar.className = 'material-symbols-outlined menu-arrow'; ar.setAttribute('aria-hidden', 'true'); ar.textContent = 'chevron_backward';
        a.appendChild(ar);
        if (insertAfter && insertAfter.nextSibling) mobileMenu.insertBefore(a, insertAfter.nextSibling);
        else mobileMenu.appendChild(a);
        insertAfter = a;
      });
    }

    if (footerCats && !footerCats.childElementCount) {
      footerCats.innerHTML = '';
      categories.forEach(function (c) {
        var a = document.createElement('a');
        a.href = catUrl(c); a.textContent = c.name;
        footerCats.appendChild(a);
      });
    }
  }

  async function init() {
    if (!M) return;

    var isHome = !!document.querySelector('#latest, .featured-slider');
    if (isHome) return;

    var categories = [];
    try { var cr = await M.listCategories(); categories = cr.data || []; populateCategoryNav(categories); } catch (e) {}
  }

  document.addEventListener('DOMContentLoaded', init);
  window.MocroShared = {
    populateCategoryNav: populateCategoryNav,
    base: base
  };
})();
