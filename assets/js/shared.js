/**
 * MOCRO — shared.js | Cross-page ticker (carousel) + category nav filler.
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
  function artUrl(slug) { return base('article.html?slug=' + encodeURIComponent(slug)); }

  function ensureTicker() {
    if (document.querySelector('.news-ticker')) return;
    var ticker = document.createElement('div');
    ticker.className = 'news-ticker';
    ticker.setAttribute('aria-label', 'شريط الأخبار');
    ticker.innerHTML =
      '<div class="ticker-inner">' +
        '<span class="ticker-label"><span class="material-symbols-outlined" aria-hidden="true">trending_up</span>الآن</span>' +
        '<div class="ticker-viewport" tabindex="0" role="region" aria-roledescription="شريط تمرير" aria-label="عناوين الأخبار العاجلة">' +
          '<div class="ticker-track"><span class="ticker-item">جارٍ تحميل الأخبار…</span></div>' +
        '</div>' +
        '<div class="ticker-dots" aria-hidden="true"></div>' +
      '</div>';
    var header = document.querySelector('.mocro-header');
    if (header && header.parentNode) header.parentNode.insertBefore(ticker, header);
    else document.body.insertBefore(ticker, document.body.firstChild);
  }

  function buildTicker(items) {
    var root = document.querySelector('.news-ticker');
    if (!root) return;
    var track = root.querySelector('.ticker-track');
    var viewport = root.querySelector('.ticker-viewport');
    var dots = root.querySelector('.ticker-dots');
    var prevBtn = root.querySelector('.ticker-prev');
    var nextBtn = root.querySelector('.ticker-next');
    var playBtn = root.querySelector('.ticker-play');
    var playIcon = root.querySelector('.ticker-play-icon');
    if (!track) return;

    track.innerHTML = '';
    items.forEach(function (a) {
      var s = document.createElement('span');
      s.className = 'ticker-item';
      if (a.slug) {
        var link = document.createElement('a');
        link.href = artUrl(a.slug);
        link.appendChild(document.createTextNode(a.title));
        s.appendChild(link);
      } else {
        s.textContent = a.title;
      }
      track.appendChild(s);
    });
    if (dots) {
      dots.innerHTML = '';
      items.forEach(function (_, i) {
        var d = document.createElement('button');
        d.type = 'button'; d.className = 'ticker-dot' + (i === 0 ? ' is-active' : '');
        d.setAttribute('aria-hidden', 'true'); d.setAttribute('tabindex', '-1');
        d.setAttribute('data-index', String(i));
        d.addEventListener('click', function () { goTo(i, true); });
        dots.appendChild(d);
      });
    }

    var count = items.length;
    var index = 0;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var paused = false;
    var timer = null;

    var isRTL = (document.documentElement.getAttribute('dir') === 'rtl') ||
                (document.body && document.body.getAttribute('dir') === 'rtl') ||
                (getComputedStyle && getComputedStyle(viewport).direction === 'rtl');
    var NEXT_SIGN = isRTL ? -1 : 1;

    function posFor(i) { return ((i - index) * 100 * NEXT_SIGN) + '%'; }
    function slides() { return Array.prototype.slice.call(track.children); }

    function apply() {
      var list = slides();
      list.forEach(function (el, i) {
        el.style.transform = 'translateX(' + posFor(i) + ')';
        el.style.opacity = i === index ? '1' : '0';
      });
      if (dots) {
        Array.prototype.forEach.call(dots.children, function (d, i) {
          d.classList.toggle('is-active', i === index);
        });
      }
    }

    function goTo(i, withUser) {
      if (count === 0) return;
      index = ((i % count) + count) % count;
      apply();
      if (withUser) restart();
    }

    function next() { goTo(index + 1, true); }
    function prev() { goTo(index - 1, true); }

    function stop() { if (timer) { clearInterval(timer); timer = null; } }
    function start() {
      stop();
      if (count <= 1 || reduced || paused) return;
      timer = setInterval(function () { goTo(index + 1, false); }, 5000);
    }
    function restart() { stop(); start(); }

    function setPlayIcon() {
      if (playIcon) playIcon.textContent = paused ? 'play_arrow' : 'pause';
      if (playBtn) playBtn.setAttribute('aria-label', paused ? 'تشغيل' : 'إيقاف مؤقت');
    }
    function togglePause() { paused = !paused; setPlayIcon(); restart(); }
    function pause() { if (!paused && !reduced) { paused = true; setPlayIcon(); stop(); } }
    function resume() { if (paused) { paused = false; setPlayIcon(); start(); } }

    if (prevBtn) prevBtn.addEventListener('click', prev);
    if (nextBtn) nextBtn.addEventListener('click', next);
    if (playBtn) playBtn.addEventListener('click', togglePause);
    if (viewport) {
      viewport.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); next(); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); prev(); }
        else if (e.key === ' ' || e.key === 'Spacebar') { e.preventDefault(); togglePause(); }
      });
      viewport.addEventListener('mouseenter', pause);
      viewport.addEventListener('mouseleave', resume);
      viewport.addEventListener('focusin', pause);
      viewport.addEventListener('focusout', resume);

      var startX = null, startY = null, dragging = false, dragLocked = false, prevSlide = 0;
      function commitDrag(dx) {
        track.style.transform = '';
        track.classList.remove('dragging');
        if (Math.abs(dx) > 60) { goTo(prevSlide + (dx < 0 ? 1 : -1), false); }
        else { goTo(prevSlide, false); }
      }
      viewport.addEventListener('pointerdown', function (ev) {
        if (ev.pointerType === 'mouse' && ev.button !== 0) return;
        dragging = true; dragLocked = false; startX = ev.clientX; startY = ev.clientY; prevSlide = index;
        pause();
        try { viewport.setPointerCapture(ev.pointerId); } catch (e) {}
      });
      viewport.addEventListener('pointermove', function (ev) {
        if (!dragging || startX === null) return;
        var dx = ev.clientX - startX;
        var dy = ev.clientY - startY;
        if (!dragLocked && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
        if (!dragLocked) {
          if (Math.abs(dy) > Math.abs(dx)) { dragging = false; startX = null; startY = null; track.style.transform = ''; resume(); return; }
          dragLocked = true; track.classList.add('dragging');
        }
        track.style.transform = 'translateX(' + dx + 'px)';
      });
      viewport.addEventListener('pointerup', function (ev) {
        if (!dragging) return;
        dragging = false;
        var dx = ev.clientX - startX;
        commitDrag(dragLocked ? dx : 0);
        startX = null; startY = null; dragLocked = false;
        resume();
      });
      viewport.addEventListener('pointercancel', function () {
        dragging = false; dragLocked = false; startX = null; startY = null;
        track.style.transform = ''; track.classList.remove('dragging');
        goTo(prevSlide, false); resume();
      });
    }

    apply();
    setPlayIcon();
    start();
  }

  function populateTicker(items) {
    if (!items || !items.length) {
      buildTicker([{ title: 'لحظة بلحظة — تابع آخر الأخبار.' }]);
      return;
    }
    buildTicker(items.map(function (a) { return { title: a.title, slug: a.slug }; }));
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

    var isHome = !!document.querySelector('#latest, .featured-slider');
    if (isHome) return;

    var categories = [];
    try { var cr = await M.listCategories(); categories = cr.data || []; populateCategoryNav(categories); } catch (e) {}

    try {
      var br = await M.breakingArticles(8);
      var breaking = br.data || [];
      if (breaking.length) {
        populateTicker(breaking.map(function (a) { return { title: a.title, slug: a.slug }; }));
      } else {
        var lr = await M.latestArticles(6);
        populateTicker((lr.data || []).map(function (a) { return { title: a.title, slug: a.slug }; }));
      }
    } catch (e) {
      populateTicker([]);
    }
  }

  document.addEventListener('DOMContentLoaded', init);
  window.MocroShared = {
    populateTicker: populateTicker,
    buildTicker: buildTicker,
    populateCategoryNav: populateCategoryNav,
    base: base
  };
})();
