/**
 * MOCRO — home.js | Homepage renderer (all data from Supabase).
 */
(function () {
  'use strict';
  if (!window.Mocro) return;
  var M = window.Mocro;

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function url(path) { var b = M.client !== undefined ? window.MOCRO_CONFIG.SITE_BASE : ''; if (b && b.slice(-1) !== '/') b += '/'; return b + path; }
  function dateStr(iso) { if (!iso) return ''; try { return new Date(iso).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return iso.slice(0, 10); } }
  function readingTime(content) { var w = (content || '').trim().split(/\s+/).length; var m = Math.max(1, Math.round(w / 180)); return m + (m === 1 ? ' دقيقة' : ' دقائق'); }
  function artUrl(a) { return url('article.html?slug=' + encodeURIComponent(a.slug)); }
  function catUrl(c) { return url('category.html?slug=' + encodeURIComponent(c.slug)); }

  function chevron(cls) {
    var s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('class', 'icon' + (cls ? ' ' + cls : ''));
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = '<polyline points="15 18 9 12 15 6"/>';
    return s;
  }

  function renderNav(categories) {
    var desktopSub = document.getElementById('nav-categories-desktop');
    var mobileMenu = document.getElementById('mobile-menu');
    var footerCats = document.getElementById('footer-categories');

    if (desktopSub) {
      desktopSub.innerHTML = '';
      categories.forEach(function (c, i) {
        var a = document.createElement('a');
        a.href = catUrl(c); a.setAttribute('role', 'menuitem');
        a.appendChild(el('span', null, c.name));
        var num = el('span', 'sub-num', String(i + 1).padStart(2, '0'));
        a.appendChild(num);
        desktopSub.appendChild(a);
      });
    }

    if (mobileMenu) {
      var catBox = mobileMenu.querySelector('#menu-categories');
      var menuSearch = mobileMenu.querySelector('.menu-search');
      if (!catBox) {
        catBox = document.createElement('div');
        catBox.id = 'menu-categories';
        catBox.className = 'menu-categories';
        if (menuSearch && menuSearch.nextSibling) mobileMenu.insertBefore(catBox, menuSearch.nextSibling);
        else mobileMenu.appendChild(catBox);
      }
      catBox.innerHTML = '';
      categories.forEach(function (c) {
        var a = document.createElement('a');
        a.href = catUrl(c); a.setAttribute('data-cat', '');
        a.appendChild(el('span', null, c.name));
        a.appendChild(chevron('menu-arrow'));
        catBox.appendChild(a);
      });
    }

    if (footerCats) {
      footerCats.innerHTML = '';
      categories.forEach(function (c) {
        var a = document.createElement('a'); a.href = catUrl(c); a.textContent = c.name; footerCats.appendChild(a);
      });
    }
  }

  function renderCategorySections(categories, articles) {
    var host = document.getElementById('home-categories');
    if (!host) return;
    host.innerHTML = '';
    categories.forEach(function (c) {
      var items = articles.filter(function (a) { return a && a.category_id === c.id; }).slice(0, 6);
      if (!items.length) return;

      var section = el('section', 'home-cat');

      var title = document.createElement('a');
      title.href = catUrl(c);
      title.className = 'section-title';
      title.textContent = c.name;
      section.appendChild(title);

      var list = el('div', 'home-cat-list');
      items.forEach(function (a) {
        var item = el('article', 'search-result');
        var href = artUrl(a);
        item.setAttribute('data-href', href);
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'link');
        item.setAttribute('aria-label', a.title);
        var body = el('div', 'sr-body');
        body.appendChild(el('div', 'sr-title', a.title));
        body.appendChild(el('div', 'sr-meta', dateStr(a.published_at) + ' · قراءة ' + readingTime(a.content)));
        item.appendChild(body);
        item.addEventListener('click', function () { window.location.href = href; });
        item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = href; } });
        list.appendChild(item);
      });
      section.appendChild(list);
      host.appendChild(section);
    });
  }

  function renderJournal(articles) {
    var list = document.querySelector('#journal .journal-list');
    var nav = document.querySelector('#journal .journal-nav');
    if (!list) return;
    list.innerHTML = '';
    var dotsHtml = '';
    articles.forEach(function (a, i) {
      var item = el('article', 'journal-item' + (i === 0 ? ' is-active' : ''));
      item.setAttribute('data-jslide', '');
      var href = artUrl(a);
      item.setAttribute('data-href', href);
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'link');
      item.setAttribute('aria-label', a.title);
      if (a.featured_image) {
        var thumb = el('div', 'journal-thumb');
        var img = document.createElement('img');
        img.src = a.featured_image; img.alt = a.title; img.loading = i === 0 ? 'eager' : 'lazy';
        thumb.appendChild(img);
        item.appendChild(thumb);
      }
      var body = el('div', 'journal-body');
      body.appendChild(el('h3', null, a.title));
      body.appendChild(el('p', null, a.excerpt));
      body.appendChild(el('span', 'cat', readingTime(a.content)));
      item.appendChild(body);
      item.addEventListener('click', function () { window.location.href = href; });
      item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = href; } });
      list.appendChild(item);
      dotsHtml += '<button class="journal-dot' + (i === 0 ? ' is-active' : '') + '" data-jdot="' + i + '" aria-label="خبر ' + (i + 1) + '"></button>';
    });
    if (nav) nav.innerHTML = dotsHtml;
  }

  function initJournalSlider() {
    var section = document.getElementById('journal');
    if (!section) return;
    var list = section.querySelector('.journal-list');
    if (!list) return;
    var slides = Array.prototype.slice.call(list.querySelectorAll('[data-jslide]'));
    var dots = Array.prototype.slice.call(section.querySelectorAll('[data-jdot]'));
    if (!slides.length) return;

    var current = 0;
    function showSlide(i) {
      current = (i + slides.length) % slides.length;
      slides.forEach(function (s, x) { s.classList.toggle('is-active', x === current); });
      dots.forEach(function (d, x) { d.classList.toggle('is-active', x === current); });
    }
    function nextSlide() { showSlide(current + 1); }
    function prevSlide() { showSlide(current - 1); }
    showSlide(0);
    dots.forEach(function (dot) {
      dot.onclick = function () { showSlide(parseInt(dot.getAttribute('data-jdot'), 10)); };
    });

    var sx = null, sy = null, swiping = false, lock = false;
    list.style.touchAction = 'pan-y';
    list.addEventListener('pointerdown', function (ev) {
      if (ev.pointerType === 'mouse' && ev.button !== 0) return;
      swiping = true; lock = false; sx = ev.clientX; sy = ev.clientY;
      try { list.setPointerCapture(ev.pointerId); } catch (e) {}
    });
    list.addEventListener('pointermove', function (ev) {
      if (!swiping || sx === null) return;
      var dx = ev.clientX - sx; var dy = ev.clientY - sy;
      if (!lock && Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      if (Math.abs(dy) > Math.abs(dx)) { swiping = false; lock = false; sx = null; sy = null; return; }
      lock = true;
    });
    list.addEventListener('pointerup', function (ev) {
      if (!swiping || sx === null) { swiping = false; sx = null; sy = null; return; }
      swiping = false;
      var dx = ev.clientX - sx;
      var isRTL = document.documentElement.getAttribute('dir') === 'rtl' || (getComputedStyle && getComputedStyle(document.body).direction === 'rtl');
      if (Math.abs(dx) > 50) {
        if ((dx < 0 && !isRTL) || (dx > 0 && isRTL)) nextSlide();
        else prevSlide();
      }
      sx = null; sy = null; lock = false;
    });
    list.addEventListener('pointercancel', function () { swiping = false; sx = null; sy = null; lock = false; });
  }

  async function renderHome() {
    try {
      var results = await Promise.all([
        M.listCategories(), M.latestArticles(200)
      ]);
      var categories = results[0].data || [];
      var latest = (results[1].data || []).map(M.normalize);

      renderNav(categories);
      renderCategorySections(categories, latest);
    } catch (err) {
      console.error('MOCRO home render error:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', renderHome);
})();
