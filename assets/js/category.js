/**
 * MOCRO — category.js | dynamic category page (/category.html?slug=…)
 */
(function () {
  'use strict';
  if (!window.Mocro) return;
  var M = window.Mocro;
  function url(p) { var b = window.MOCRO_CONFIG.SITE_BASE; if (b.slice(-1) !== '/') b += '/'; return b + p; }
  function qs(n) { return new URLSearchParams(window.location.search).get(n); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function dateStr(iso) { if (!iso) return ''; try { return new Date(iso).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return iso.slice(0, 10); } }
  function readingTime(content) { var w = (content || '').trim().split(/\s+/).length; var m = Math.max(1, Math.round(w / 180)); return m + (m === 1 ? ' دقيقة' : ' دقائق'); }

  async function render() {
    var slug = qs('slug');
    var grid = document.getElementById('listing-grid');
    var head = document.getElementById('page-head');
    if (!slug) { grid.innerHTML = '<div class="empty-state">لم يتم تحديد قسم.</div>'; return; }

    var cr = await M.categoryBySlug(slug);
    var cat = cr.data;
    if (!cat) { grid.innerHTML = '<div class="empty-state">القسم غير موجود.</div>'; return; }

    document.title = cat.name + ' — مُوكْرُو';
    head.innerHTML = '';
    head.appendChild(el('h1', null, cat.name));
    if (cat.description) head.appendChild(el('div', 'page-desc', cat.description));

    var ar = await M.articlesByCategory(slug);
    var articles = (ar.data || []).map(M.normalize);
    grid.innerHTML = '';
    if (!articles.length) { grid.innerHTML = '<div class="empty-state">لا توجد مقالات منشورة في هذا القسم بعد.</div>'; return; }

    var list = el('div', 'journal-list');
    articles.forEach(function (a) {
      var item = el('article', 'journal-item');
      var href = url('article.html?slug=' + encodeURIComponent(a.slug));
      item.setAttribute('data-href', href);
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'link');
      item.setAttribute('aria-label', a.title);
      var body = el('div', 'journal-body');
      body.appendChild(el('h3', null, a.title));
      body.appendChild(el('p', null, a.excerpt));
      body.appendChild(el('span', 'cat', dateStr(a.published_at) + ' · قراءة ' + readingTime(a.content)));
      var arrow = el('a', 'journal-arrow material-symbols-outlined', 'arrow_back');
      arrow.href = href; arrow.setAttribute('aria-hidden', 'true'); arrow.setAttribute('tabindex', '-1');
      item.appendChild(body); item.appendChild(arrow);
      item.addEventListener('click', function () { window.location.href = href; });
      item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = href; } });
      list.appendChild(item);
    });
    grid.appendChild(list);
  }

  document.addEventListener('DOMContentLoaded', render);
})();
