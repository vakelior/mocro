/**
 * MOCRO — author.js | dynamic author page (/author.html?slug=…)
 */
(function () {
  'use strict';
  if (!window.Mocro) return;
  var M = window.Mocro;
  function url(p) { var b = window.MOCRO_CONFIG.SITE_BASE; if (b.slice(-1) !== '/') b += '/'; return b + p; }
  function qs(n) { return new URLSearchParams(window.location.search).get(n); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function dateStr(iso) { if (!iso) return ''; try { return new Date(iso).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return iso.slice(0, 10); } }

  async function render() {
    var slug = qs('slug'); var head = document.getElementById('author-head'); var grid = document.getElementById('listing-grid');
    if (!slug) { grid.innerHTML = '<div class="empty-state">لم يتم تحديد كاتب.</div>'; return; }

    var res = await M.authorBySlug(slug);
    var author = res.data;
    if (!author) { grid.innerHTML = '<div class="empty-state">الكاتب غير موجود.</div>'; return; }

    document.title = author.name + ' — مُوكْرُو';
    head.innerHTML = '';
    var hero = el('div', 'author-hero');
    if (author.avatar) { var img = document.createElement('img'); img.className = 'author-avatar'; img.src = author.avatar; img.alt = author.name; hero.appendChild(img); }
    var info = el('div', null);
    info.appendChild(el('h1', null, author.name));
    if (author.bio) info.appendChild(el('div', 'author-bio', author.bio));
    hero.appendChild(info);
    head.appendChild(hero);

    var ar = await M.articlesByAuthor(slug);
    var articles = (ar.data || []).map(M.normalize);
    grid.innerHTML = '';
    if (!articles.length) { grid.innerHTML = '<div class="empty-state">لا توجد مقالات منشورة لهذا الكاتب بعد.</div>'; return; }
    var list = el('div', 'journal-list');
    articles.forEach(function (a) {
      var item = el('article', 'journal-item');
      item.setAttribute('data-href', url('article.html?slug=' + encodeURIComponent(a.slug)));
      var thumb = el('div', 'journal-thumb');
      if (a.featured_image) { var im = document.createElement('img'); im.src = a.featured_image; im.alt = a.title; im.loading = 'lazy'; thumb.appendChild(im); }
      var body = el('div', 'journal-body');
      body.appendChild(el('h3', null, a.title));
      body.appendChild(el('p', null, a.excerpt));
      body.appendChild(el('span', 'cat', dateStr(a.published_at)));
      item.appendChild(thumb); item.appendChild(body);
      item.addEventListener('click', function () { window.location.href = url('article.html?slug=' + encodeURIComponent(a.slug)); });
      list.appendChild(item);
    });
    grid.appendChild(list);
  }

  document.addEventListener('DOMContentLoaded', render);
})();