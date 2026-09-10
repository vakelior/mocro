/**
 * MOCRO — shared.js | Cross-page ticker + category nav filler.
 * The static HTML of every inner page already carries the identical header
 * (brand, nav-desktop, masthead actions, mobile-menu) and search overlay as
 * index.html — so this file only needs to:
 *   1. inject the news ticker (same structure as index.html), and
 *   2. populate dynamic categories (nav dropdown, mobile menu, footer) + ticker.
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

  function ensureTicker() {
    if (document.querySelector('.news-ticker')) return;
    var ticker = document.createElement('div');
    ticker.className = 'news-ticker';
    ticker.setAttribute('aria-label', 'شريط الأخبار');
    var inner = document.createElement('div');
    inner.className = 'container ticker-inner';
    var label = document.createElement('span');
    label.className = 'ticker-label';
    var bolt = document.createElement('span');
    bolt.className = 'material-symbols-outlined'; bolt.setAttribute('aria-hidden', 'true'); bolt.textContent = 'bolt';
    label.appendChild(bolt);
    label.appendChild(document.createTextNode('الآن'));
    var text = document.createElement('span');
    text.className = 'ticker-text';
    var ph = document.createElement('span');
    ph.className = 'ticker-item'; ph.textContent = 'جارٍ تحميل الأخبار…';
    text.appendChild(ph);
    inner.appendChild(label); inner.appendChild(text);
    ticker.appendChild(inner);
    var header = document.querySelector('.mocro-header');
    if (header && header.parentNode) header.parentNode.insertBefore(ticker, header);
    else document.body.insertBefore(ticker, document.body.firstChild);
  }

  function populateTicker(items) {
    var box = document.querySelector('.ticker-text');
    if (!box) return;
    box.innerHTML = '';
    if (!items || !items.length) {
      var none = document.createElement('span');
      none.className = 'ticker-item'; none.textContent = 'لحظة بلحظة — تابع آخر مقالات التصميم.';
      box.appendChild(none);
      return;
    }
    items.forEach(function (a) {
      var s = document.createElement('span');
      s.className = 'ticker-item'; s.textContent = a.title;
      box.appendChild(s);
    });
    box.innerHTML += box.innerHTML;
    var reduced = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    box.style.animation = reduced ? 'none' : 'tickerScroll 40s linear infinite';
  }

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
        ar.className = 'material-symbols-outlined menu-arrow'; ar.setAttribute('aria-hidden', 'true'); ar.textContent = 'arrow_back';
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
    ensureTicker();
    if (!M) return;

    var categories = [];
    try { var cr = await M.listCategories(); categories = cr.data || []; populateCategoryNav(categories); } catch (e) {}

    try {
      var br = await M.breakingArticles(8);
      var breaking = br.data || [];
      if (breaking.length) {
        populateTicker(breaking.map(function (a) { return { title: a.title }; }));
      } else {
        var lr = await M.latestArticles(6);
        populateTicker((lr.data || []).map(function (a) { return { title: a.title }; }));
      }
    } catch (e) {
      populateTicker([]);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.MocroShared = { populateTicker: populateTicker, populateCategoryNav: populateCategoryNav, base: base };
})();
