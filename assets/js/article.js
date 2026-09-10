/**
 * MOCRO — article.js | dynamic article page (/article.html?slug=…)
 */
(function () {
  'use strict';
  if (!window.Mocro) return;
  var M = window.Mocro;
  function url(p) { var b = window.MOCRO_CONFIG.SITE_BASE; if (b.slice(-1) !== '/') b += '/'; return b + p; }
  function qs(n) { return new URLSearchParams(window.location.search).get(n); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function dateStr(iso) { if (!iso) return ''; try { return new Date(iso).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return iso.slice(0, 10); } }

  function renderContent(md) {
    if (!md) return '';
    var lines = md.split(/\r?\n/); var html = ''; var listOpen = null;
    lines.forEach(function (line) {
      var t = line.trim();
      if (!t) { if (listOpen) { html += '</' + listOpen + '>'; listOpen = null; } return; }
      var h = t.match(/^###\s+(.*)/); if (h) { if (listOpen) { html += '</' + listOpen + '>'; listOpen = null; } html += '<h3>' + h[1] + '</h3>'; return; }
      var h2 = t.match(/^##\s+(.*)/); if (h2) { if (listOpen) { html += '</' + listOpen + '>'; listOpen = null; } html += '<h2>' + h2[1] + '</h2>'; return; }
      var li = t.match(/^[-*]\s+(.*)/); if (li) { if (listOpen !== 'ul') { if (listOpen) html += '</' + listOpen + '>'; listOpen = 'ul'; html += '<ul>'; } html += '<li>' + li[1] + '</li>'; return; }
      var ol = t.match(/^\d+[.)]\s+(.*)/); if (ol) { if (listOpen !== 'ol') { if (listOpen) html += '</' + listOpen + '>'; listOpen = 'ol'; html += '<ol>'; } html += '<li>' + ol[1] + '</li>'; return; }
      var bq = t.match(/^>\s?(.*)/); if (bq) { if (listOpen) { html += '</' + listOpen + '>'; listOpen = null; } html += '<blockquote>' + bq[1] + '</blockquote>'; return; }
      if (listOpen) { html += '</' + listOpen + '>'; listOpen = null; }
      html += '<p>' + t + '</p>';
    });
    if (listOpen) html += '</' + listOpen + '>';
    return html;
  }

  function renderRelated(articles) {
    var grid = document.getElementById('related-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!articles.length) { grid.innerHTML = '<div class="empty-state">لا توجد مقالات ذات صلة بعد.</div>'; return; }
    articles.forEach(function (a) {
      var card = el('article', 'post');
      card.setAttribute('data-href', url('article.html?slug=' + encodeURIComponent(a.slug)));
      var thumb = el('div', 'post-thumb');
      if (a.featured_image) { var img = document.createElement('img'); img.src = a.featured_image; img.alt = a.title; img.loading = 'lazy'; thumb.appendChild(img); }
      var body = el('div', 'post-body');
      body.appendChild(el('h3', null, a.title));
      body.appendChild(el('p', null, a.excerpt));
      body.appendChild(el('time', 'meta', dateStr(a.published_at)));
      card.appendChild(thumb); card.appendChild(body);
      card.addEventListener('click', function () { window.location.href = url('article.html?slug=' + encodeURIComponent(a.slug)); });
      grid.appendChild(card);
    });
  }

  function registerView(slug) {
    try {
      var key = 'mocro-viewed:' + slug; var last = localStorage.getItem(key); var now = Date.now();
      if (last && (now - parseInt(last, 10)) < 30 * 60 * 1000) return;
      localStorage.setItem(key, String(now));
      M.incrementView(slug).then(function () {}).catch(function () {});
    } catch (e) {}
  }

  async function render() {
    var slug = qs('slug'); var root = document.getElementById('article-root');
    if (!slug) { root.innerHTML = '<div class="container empty-state">لم يتم تحديد مقال.</div>'; return; }
    var res = await M.articleBySlug(slug);
    var a = M.normalize(res.data);
    if (!a) { root.innerHTML = '<div class="container empty-state">المقال غير موجود أو غير منشور.</div>'; return; }

    document.title = a.title + ' — مُوكْرُو';
    root.innerHTML = '';

    var hero = el('div', 'article-hero container');
    var media = el('div', 'article-hero-media');
    if (a.featured_image) { var img = document.createElement('img'); img.src = a.featured_image; img.alt = a.title; media.appendChild(img); }
    hero.appendChild(media);

    var head = el('div', 'article-head container');
    if (a.category) head.appendChild(el('span', 'cat', a.category.name));
    head.appendChild(el('h1', null, a.title));
    var metaRow = el('div', 'article-meta-row');
    if (a.author) {
      var chip = el('span', 'author-chip');
      if (a.author.avatar) { var av = document.createElement('img'); av.src = a.author.avatar; av.alt = a.author.name; chip.appendChild(av); }
      var al = el('a', null, a.author.name); al.href = url('author.html?slug=' + encodeURIComponent(a.author.slug)); chip.appendChild(al);
      metaRow.appendChild(chip);
    }
    metaRow.appendChild(el('span', null, dateStr(a.published_at)));
    metaRow.appendChild(el('span', null, '👁 ' + (a.views || 0) + ' مشاهدة'));
    head.appendChild(metaRow);

    var body = el('div', 'article-body container');
    var content = el('div', 'article-content');
    content.innerHTML = renderContent(a.content);
    body.appendChild(content);

    var tags = a.tags || [];
    if (tags.length) {
      var tagWrap = el('div', 'article-tags');
      tags.forEach(function (t) { if (t) tagWrap.appendChild(el('span', 'tag-chip', t.name)); });
      body.appendChild(tagWrap);
    }
    var share = el('div', 'article-share');
    share.appendChild(document.createTextNode('شارك: '));
    var enc = encodeURIComponent; var pageUrl = window.location.href;
    var tw = el('a', 'tag-chip', 'X'); tw.href = 'https://twitter.com/intent/tweet?url=' + enc(pageUrl) + '&text=' + enc(a.title); tw.target = '_blank';
    var fb = el('a', 'tag-chip', 'فيسبوك'); fb.href = 'https://www.facebook.com/sharer/sharer.php?u=' + enc(pageUrl); fb.target = '_blank';
    share.appendChild(tw); share.appendChild(fb);
    body.appendChild(share);

    root.appendChild(hero); root.appendChild(head); root.appendChild(body);

    var rel = await M.relatedArticles(a, 4);
    renderRelated((rel.data || []).map(M.normalize));

    var cats = await M.listCategories();
    var fc = document.getElementById('footer-categories');
    if (fc) { fc.innerHTML = ''; (cats.data || []).forEach(function (c) { var x = document.createElement('a'); x.href = url('category.html?slug=' + encodeURIComponent(c.slug)); x.textContent = c.name; fc.appendChild(x); }); }

    registerView(a.slug);
  }

  document.addEventListener('DOMContentLoaded', render);
})();