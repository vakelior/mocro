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
      var first = mobileMenu.querySelector('a[href="#latest"]');
      Array.prototype.forEach.call(mobileMenu.querySelectorAll('a[data-cat]'), function (a) { a.remove(); });
      categories.forEach(function (c) {
        var a = document.createElement('a');
        a.href = catUrl(c); a.setAttribute('data-cat', '');
        a.appendChild(el('span', null, c.name));
        var arrow = el('span', 'material-symbols-outlined menu-arrow', 'arrow_back');
        arrow.setAttribute('aria-hidden', 'true');
        a.appendChild(arrow);
        if (first && first.nextSibling) mobileMenu.insertBefore(a, first.nextSibling);
        else mobileMenu.appendChild(a);
      });
    }

    if (footerCats) {
      footerCats.innerHTML = '';
      categories.forEach(function (c) {
        var a = document.createElement('a'); a.href = catUrl(c); a.textContent = c.name; footerCats.appendChild(a);
      });
    }
  }

  function renderTicker(breaking) {
    var box = document.querySelector('.ticker-text');
    if (!box) return;
    var items = breaking && breaking.length ? breaking : [];
    if (!items.length) return;
    box.innerHTML = '';
    items.forEach(function (a) {
      var s = el('span', 'ticker-item'); s.textContent = a.title; box.appendChild(s);
    });
    box.innerHTML = box.innerHTML + box.innerHTML;
    var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) { box.style.whiteSpace = 'nowrap'; box.style.animation = 'tickerScroll 40s linear infinite'; }
  }

  function renderSlider(featured) {
    var slider = document.querySelector('.featured-slider');
    var nav = document.querySelector('.slider-nav');
    if (!slider) return;
    slider.innerHTML = '';
    var dotsHtml = '';
    featured.forEach(function (a, i) {
      var slide = el('div', 'slide' + (i === 0 ? ' is-active' : ''));
      slide.setAttribute('data-slide', '');
      var media = el('div', 'slide-media');
      if (a.featured_image) { var img = document.createElement('img'); img.src = a.featured_image; img.alt = a.title; img.loading = i === 0 ? 'eager' : 'lazy'; media.appendChild(img); }
      var body = el('div', 'slide-body');
      body.appendChild(el('span', 'cat', a.category ? a.category.name : 'مقال'));
      body.appendChild(el('h2', null, a.title));
      body.appendChild(el('p', null, a.excerpt));
      var link = document.createElement('a');
      link.href = artUrl(a); link.className = 'slide-link';
      link.appendChild(document.createTextNode('اقرأ المقال '));
      var ar = el('span', 'material-symbols-outlined', 'arrow_back'); ar.setAttribute('aria-hidden', 'true');
      link.appendChild(ar);
      body.appendChild(link);
      slide.appendChild(media); slide.appendChild(body);
      slider.appendChild(slide);
      dotsHtml += '<button class="slider-dot' + (i === 0 ? ' is-active' : '') + '" data-slider-dot="' + i + '" aria-label="المقال ' + (i + 1) + '"></button>';
    });
    if (nav) nav.innerHTML = dotsHtml;
  }

  function renderPosts(posts) {
    var grid = document.querySelector('#latest .post-grid');
    if (!grid) return;
    grid.innerHTML = '';
    posts.forEach(function (a) {
      var article = el('article', 'post');
      var href = artUrl(a);
      article.setAttribute('data-href', href);
      article.setAttribute('tabindex', '0');
      article.setAttribute('role', 'link');
      article.setAttribute('aria-label', a.title);
      var thumb = el('div', 'post-thumb');
      if (a.featured_image) { var img = document.createElement('img'); img.src = a.featured_image; img.alt = a.title; img.loading = 'lazy'; thumb.appendChild(img); }
      var body = el('div', 'post-body');
      body.appendChild(el('span', 'cat', a.category ? a.category.name : ''));
      body.appendChild(el('h3', null, a.title));
      body.appendChild(el('p', null, a.excerpt));
      body.appendChild(el('time', 'meta', (a.published_at ? dateStr(a.published_at) + ' · ' : '') + 'قراءة ' + readingTime(a.content)));
      article.appendChild(thumb); article.appendChild(body);
      article.addEventListener('click', function () { window.location.href = href; });
      article.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = href; } });
      grid.appendChild(article);
    });
  }

  function renderJournal(articles) {
    var list = document.querySelector('#journal .journal-list');
    if (!list) return;
    list.innerHTML = '';
    articles.forEach(function (a) {
      var item = el('article', 'journal-item');
      var href = artUrl(a);
      item.setAttribute('data-href', href);
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'link');
      item.setAttribute('aria-label', a.title);
      var thumb = el('div', 'journal-thumb');
      if (a.featured_image) { var img = document.createElement('img'); img.src = a.featured_image; img.alt = a.title; img.loading = 'lazy'; thumb.appendChild(img); }
      var body = el('div', 'journal-body');
      body.appendChild(el('h3', null, a.title));
      body.appendChild(el('p', null, a.excerpt));
      body.appendChild(el('span', 'cat', (a.category ? a.category.name + ' · ' : '') + readingTime(a.content)));
      var arrow = document.createElement('a');
      arrow.className = 'journal-arrow material-symbols-outlined';
      arrow.href = href; arrow.textContent = 'arrow_back'; arrow.setAttribute('aria-hidden', 'true'); arrow.setAttribute('tabindex', '-1');
      item.appendChild(thumb); item.appendChild(body); item.appendChild(arrow);
      item.addEventListener('click', function () { window.location.href = href; });
      item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = href; } });
      list.appendChild(item);
    });
  }

  function renderWidgets(categories, popular) {
    var catUl = document.getElementById('widget-categories');
    var popUl = document.getElementById('widget-popular');
    if (catUl) {
      catUl.innerHTML = '';
      categories.forEach(function (c) {
        var li = document.createElement('li'); var a = document.createElement('a'); a.href = catUrl(c); a.textContent = c.name; li.appendChild(a); catUl.appendChild(li);
      });
    }
    if (popUl) {
      popUl.innerHTML = '';
      popular.slice(0, 5).forEach(function (a) {
        var li = document.createElement('li'); var a = document.createElement('a'); a.href = artUrl(a); a.textContent = a.title; li.appendChild(a); popUl.appendChild(li);
      });
    }
  }

  function renderCatBlocks(categories) {
    var wrap = document.querySelector('.cat-blocks');
    if (!wrap) return;
    wrap.innerHTML = '';
    categories.slice(0, 3).forEach(function (c, i) {
      var sec = el('section', 'cat-block');
      var head = el('div', 'cat-block-head');
      head.appendChild(el('span', 'cat-block-tag', String(i + 1).padStart(2, '0')));
      head.appendChild(el('h3', null, c.name));
      sec.appendChild(head);
      sec.appendChild(el('p', null, c.description || ''));
      var link = document.createElement('a'); link.href = catUrl(c); link.className = 'slide-link'; link.textContent = 'تصفح القسم'; sec.appendChild(link);
      wrap.appendChild(sec);
    });
  }

  async function renderHome() {
    try {
      var results = await Promise.all([
        M.listCategories(), M.featuredArticles(), M.latestArticles(), M.popularArticles(), M.breakingArticles()
      ]);
      var categories = results[0].data || [];
      var featured = (results[1].data || []).map(M.normalize);
      var latest = (results[2].data || []).map(M.normalize);
      var popular = (results[3].data || []).map(M.normalize);
      var breaking = results[4].data || [];

      if (!featured.length) featured = latest.slice(0, 3);
      if (!popular.length) popular = latest;

      renderNav(categories);
      renderSlider(featured);
      renderPosts(latest.slice(0, 6));
      renderJournal(latest.slice(0, 5));
      renderWidgets(categories, popular);
      renderCatBlocks(categories);
      renderTicker(breaking.length ? breaking : latest);

      if (typeof window.MocroInitSlider === 'function') window.MocroInitSlider();
    } catch (err) {
      console.error('MOCRO home render error:', err);
    }
  }

  document.addEventListener('DOMContentLoaded', renderHome);
})();
