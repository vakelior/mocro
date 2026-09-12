/**
 * MOCRO — article.js | dynamic article page (/article.html?slug=…)
 * Same visual language as home: monochrome + gold, editorial, RTL.
 * No emoji icons — only Material Symbols (monochrome, consistent stroke).
 */
(function () {
  'use strict';
  if (!window.Mocro) return;
  var M = window.Mocro;

  function url(p) { var b = window.MOCRO_CONFIG.SITE_BASE; if (b && b.slice(-1) !== '/') b += '/'; return (b || '') + p; }
  function qs(n) { return new URLSearchParams(window.location.search).get(n); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }
  function icon(name) { var s = document.createElement('span'); s.className = 'material-symbols-outlined'; s.setAttribute('aria-hidden', 'true'); s.textContent = name; return s; }
  function dateStr(iso) { if (!iso) return ''; try { return new Date(iso).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { return iso.slice(0, 10); } }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function inlineMD(text) {
    var t = esc(text);
    t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, function (m, alt, src) {
      return '<img src="' + src + '" alt="' + esc(alt) + '" loading="lazy">';
    });
    t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, function (m, txt, href) {
      var safe = /^https?:\/\//i.test(href) || href.indexOf('javascript:') === -1;
      return safe ? '<a href="' + esc(href) + '"' + (/^https?:/i.test(href) ? ' target="_blank" rel="noopener"' : '') + '>' + txt + '</a>' : txt;
    });
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    t = t.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, '$1<em>$2</em>');
    t = t.replace(/(^|[^_])_([^_\n]+)_(?!_)/g, '$1<em>$2</em>');
    return t;
  }

  function renderContent(md) {
    if (!md) return '';
    var lines = md.split(/\r?\n/);
    var html = '';
    var listOpen = null;
    function closeList() { if (listOpen) { html += '</' + listOpen + '>'; listOpen = null; } }

    lines.forEach(function (line) {
      var t = line.trim();
      if (!t) { closeList(); return; }

      var h3 = t.match(/^###\s+(.*)/);
      if (h3) { closeList(); html += '<h3>' + inlineMD(h3[1]) + '</h3>'; return; }
      var h2 = t.match(/^##\s+(.*)/);
      if (h2) { closeList(); html += '<h2>' + inlineMD(h2[1]) + '</h2>'; return; }
      var h1 = t.match(/^#\s+(.*)/);
      if (h1) { closeList(); html += '<h2>' + inlineMD(h1[1]) + '</h2>'; return; }
      var hr = t.match(/^([-*_])\s*\1\s*\1\s*$/);
      if (hr) { closeList(); html += '<hr>'; return; }
      var ul = t.match(/^[-*]\s+(.*)/);
      if (ul) { if (listOpen !== 'ul') { closeList(); listOpen = 'ul'; html += '<ul>'; } html += '<li>' + inlineMD(ul[1]) + '</li>'; return; }
      var ol = t.match(/^\d+[.)]\s+(.*)/);
      if (ol) { if (listOpen !== 'ol') { closeList(); listOpen = 'ol'; html += '<ol>'; } html += '<li>' + inlineMD(ol[1]) + '</li>'; return; }
      var bq = t.match(/^>\s?(.*)/);
      if (bq) { closeList(); html += '<blockquote>' + inlineMD(bq[1]) + '</blockquote>'; return; }
      closeList();
      html += '<p>' + inlineMD(t) + '</p>';
    });
    closeList();
    return html;
  }

  function renderRelated(articles) {
    var grid = document.getElementById('related-grid');
    if (!grid) return;
    grid.innerHTML = '';
    if (!articles.length) { grid.innerHTML = '<div class="empty-state">لا توجد مقالات ذات صلة بعد.</div>'; return; }
    articles.forEach(function (a) {
      var item = el('article', 'journal-item');
      var href = url('article.html?slug=' + encodeURIComponent(a.slug));
      item.setAttribute('data-href', href);
      item.setAttribute('tabindex', '0');
      item.setAttribute('role', 'link');
      item.setAttribute('aria-label', a.title);
      var body = el('div', 'journal-body');
      if (a.category) body.appendChild(el('span', 'cat', a.category.name));
      body.appendChild(el('h3', null, a.title));
      if (a.excerpt) body.appendChild(el('p', null, a.excerpt));
      var arrow = el('span', 'journal-arrow material-symbols-outlined', 'arrow_back');
      arrow.setAttribute('aria-hidden', 'true');
      item.appendChild(body); item.appendChild(arrow);
      item.addEventListener('click', function () { window.location.href = href; });
      item.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); window.location.href = href; } });
      grid.appendChild(item);
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
    var slug = qs('slug');
    var root = document.getElementById('article-root');
    if (!slug) { root.innerHTML = '<div class="container empty-state">لم يتم تحديد مقال.</div>'; return; }

    var res;
    try { res = await M.articleBySlug(slug); }
    catch (e) { root.innerHTML = '<div class="container empty-state">تعذّر تحميل المقال. حاول مرة أخرى.</div>'; return; }

    var a = M.normalize(res && res.data ? res.data : null);
    if (!a) { root.innerHTML = '<div class="container empty-state">المقال غير موجود أو غير منشور.</div>'; return; }

    document.title = a.title + ' — مُوكْرُو';
    if (a.excerpt) { var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', a.excerpt); }

    root.innerHTML = '';

    var back = el('div', 'article-back container');
    var backBtn = el('button', 'back-btn');
    backBtn.type = 'button';
    backBtn.appendChild(icon('arrow_back'));
    backBtn.appendChild(document.createTextNode('رجوع'));
    backBtn.setAttribute('aria-label', 'الرجوع إلى الصفحة السابقة');
    backBtn.addEventListener('click', function () {
      if (window.history.length > 1 && document.referrer) { window.history.back(); }
      else { window.location.href = url('index.html'); }
    });
    back.appendChild(backBtn);
    root.appendChild(back);

    var hero = el('div', 'article-hero container');
    if (a.featured_image) {
      var media = el('div', 'article-hero-media');
      var himg = document.createElement('img');
      himg.src = a.featured_image; himg.alt = a.title;
      himg.setAttribute('fetchpriority', 'high'); himg.decoding = 'async';
      media.appendChild(himg);
      hero.appendChild(media);
    }
    root.appendChild(hero);

    var head = el('div', 'article-head container');
    if (a.category) {
      var catLink = el('a', 'cat', a.category.name);
      catLink.href = url('category.html?slug=' + encodeURIComponent(a.category.slug));
      head.appendChild(catLink);
    }
    head.appendChild(el('h1', null, a.title));
    if (a.excerpt) head.appendChild(el('p', 'article-deck', a.excerpt));

    var metaRow = el('div', 'article-meta-row');
    if (a.author) {
      var chip = el('span', 'author-chip');
      if (a.author.avatar) { var av = document.createElement('img'); av.src = a.author.avatar; av.alt = a.author.name; chip.appendChild(av); }
      chip.appendChild(icon('person'));
      var al = el('a', null, a.author.name); al.href = url('author.html?slug=' + encodeURIComponent(a.author.slug)); chip.appendChild(al);
      metaRow.appendChild(chip);
    }
    var dt = el('span', 'meta-item');
    dt.appendChild(icon('calendar_today'));
    dt.appendChild(document.createTextNode(dateStr(a.published_at)));
    metaRow.appendChild(dt);
    head.appendChild(metaRow);
    root.appendChild(head);

    var body = el('div', 'article-body container');
    var content = el('div', 'article-content');
    content.innerHTML = renderContent(a.content);
    body.appendChild(content);

    var tags = a.tags || [];
    if (tags.length) {
      var tagWrap = el('div', 'article-tags');
      tags.forEach(function (t) { if (t) tagWrap.appendChild(el('span', 'tag-chip', t.name || t)); });
      body.appendChild(tagWrap);
    }

    var share = el('div', 'article-share');
    share.appendChild(el('span', 'share-label', 'شارك'));
    var pageUrl = window.location.href;
    var enc = encodeURIComponent;

    function brandSvg(pathData) {
      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', '22'); svg.setAttribute('height', '22');
      svg.setAttribute('fill', 'currentColor'); svg.setAttribute('aria-hidden', 'true');
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', pathData);
      svg.appendChild(path);
      return svg;
    }

    var X_PATH = 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z';
    var tw = el('button', 'share-btn');
    tw.type = 'button'; tw.title = 'المشاركة على X'; tw.setAttribute('aria-label', 'المشاركة على X');
    tw.appendChild(brandSvg(X_PATH));
    tw.addEventListener('click', function () { window.open('https://twitter.com/intent/tweet?url=' + enc(pageUrl) + '&text=' + enc(a.title), '_blank', 'noopener'); });
    share.appendChild(tw);

    var FB_PATH = 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z';
    var fb = el('button', 'share-btn');
    fb.type = 'button'; fb.title = 'المشاركة على فيسبوك'; fb.setAttribute('aria-label', 'المشاركة على فيسبوك');
    fb.appendChild(brandSvg(FB_PATH));
    fb.addEventListener('click', function () { window.open('https://www.facebook.com/sharer/sharer.php?u=' + enc(pageUrl), '_blank', 'noopener'); });
    share.appendChild(fb);

    var cp = el('button', 'share-btn');
    cp.type = 'button'; cp.title = 'نسخ الرابط'; cp.setAttribute('aria-label', 'نسخ رابط المقال');
    cp.appendChild(icon('link'));
    cp.addEventListener('click', function () {
      try {
        navigator.clipboard.writeText(pageUrl).then(function () { cp.classList.add('copied'); cp.querySelector('.material-symbols-outlined').textContent = 'check'; setTimeout(function () { cp.classList.remove('copied'); cp.querySelector('.material-symbols-outlined').textContent = 'link'; }, 1800); }).catch(function () {});
      } catch (e) {}
    });
    share.appendChild(cp);

    body.appendChild(share);
    root.appendChild(body);

    var rel;
    try { rel = await M.relatedArticles(a, 6); } catch (e) { rel = { data: [] }; }
    renderRelated((rel.data || []).map(M.normalize));

    registerView(a.slug);
  }

  document.addEventListener('DOMContentLoaded', render);
})();