/**
 * MOCRO — admin.js | Auth-guarded admin dashboard (full CRUD + storage upload).
 */
(function () {
  'use strict';
  if (!window.Mocro) return;
  var M = window.Mocro;
  var sb = null; var currentUser = null;

  function uid() { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8); return v.toString(16); }); }
  function slugify(t) { return (t || '').trim().toLowerCase().replace(/[^\w\u0600-\u06FF\s-]/g, '').replace(/[\s_]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, ''); }
  function el(t, c, x) { var e = document.createElement(t); if (c) e.className = c; if (x != null) e.textContent = x; return e; }

  var cache = { categories: [], authors: [], tags: [], articles: [] };

  async function init() {
    sb = M.client();
    var res = await sb.auth.getSession();
    currentUser = res.data && res.data.session ? res.data.session.user : null;
    if (!currentUser) { window.location.href = 'login.html'; return; }
    document.getElementById('admin-user').textContent = currentUser.email || 'مشرف';
    wireTabs(); wireGlobalActions(); wireEditor();
    await loadAll();
  }

  async function loadAll() {
    var r = await Promise.all([
      sb.from('categories').select('*').order('sort_order'),
      sb.from('authors').select('*'),
      sb.from('tags').select('*').order('name'),
      sb.from('articles').select('*').order('created_at', { ascending: false })
    ]);
    cache.categories = r[0].data || []; cache.authors = r[1].data || []; cache.tags = r[2].data || []; cache.articles = r[3].data || [];
    renderCategories(); renderAuthors(); renderTags(); renderArticles(); populateSelects();
  }

  function renderArticles(filter, status) {
    filter = filter || ''; status = status || '';
    var tbody = document.querySelector('#articles-table tbody');
    tbody.innerHTML = '';
    var list = cache.articles.filter(function (a) {
      if (filter && a.title.toLowerCase().indexOf(filter.toLowerCase()) === -1 && (a.slug || '').toLowerCase().indexOf(filter.toLowerCase()) === -1) return false;
      if (status && a.status !== status) return false; return true;
    });
    list.forEach(function (a) {
      var cat = cache.categories.find(function (c) { return c.id === a.category_id; });
      var tr = document.createElement('tr');
      var td1 = el('td', null); td1.appendChild(el('strong', null, a.title)); td1.appendChild(document.createElement('br')); td1.appendChild(el('small', null, a.slug));
      tr.appendChild(td1);
      tr.appendChild(el('td', null, cat ? cat.name : '—'));
      var b = el('span', 'badge badge-' + a.status); b.textContent = { published: 'منشور', draft: 'مسودة', archived: 'مؤرشف' }[a.status] || a.status;
      var tds = el('td', null); tds.appendChild(b); tr.appendChild(tds);
      tr.appendChild(el('td', null, a.is_featured ? '★' : '—'));
      tr.appendChild(el('td', null, a.is_breaking ? '⚡' : '—'));
      tr.appendChild(el('td', null, String(a.views)));
      var td = el('td', null); var acts = el('div', 'admin-actions');
      acts.appendChild(btn('تعديل', function () { openArticleEditor(a); }));
      acts.appendChild(btn('حذف', function () { deleteArticle(a); }, 'danger'));
      acts.appendChild(btn(a.status === 'published' ? 'أرشفة' : 'نشر', function () { togglePublish(a); }));
      td.appendChild(acts); tr.appendChild(td);
      tbody.appendChild(tr);
    });
    if (!list.length) tbody.innerHTML = '<tr><td colspan="7" class="empty-state">لا توجد مقالات.</td></tr>';
  }
  function btn(t, fn, c) { var b = el('button', 'admin-btn ' + (c || ''), t); b.addEventListener('click', fn); return b; }

  function renderCategories() {
    var tbody = document.querySelector('#categories-table tbody'); tbody.innerHTML = '';
    cache.categories.forEach(function (c) {
      var tr = document.createElement('tr');
      tr.appendChild(el('td', null, c.name)); tr.appendChild(el('td', null, c.slug));
      tr.appendChild(el('td', null, String(c.sort_order))); tr.appendChild(el('td', null, c.is_active ? 'نعم' : 'لا'));
      var td = el('td', null); var acts = el('div', 'admin-actions');
      acts.appendChild(btn('تعديل', function () { openCategoryEditor(c); }));
      acts.appendChild(btn(c.is_active ? 'تعطيل' : 'تفعيل', function () { toggleCategory(c); }));
      acts.appendChild(btn('حذف', function () { deleteCategory(c); }, 'danger'));
      td.appendChild(acts); tr.appendChild(td); tbody.appendChild(tr);
    });
  }
  function renderAuthors() {
    var tbody = document.querySelector('#authors-table tbody'); tbody.innerHTML = '';
    cache.authors.forEach(function (a) {
      var tr = document.createElement('tr');
      tr.appendChild(el('td', null, a.name)); tr.appendChild(el('td', null, a.slug));
      var td = el('td', null); var acts = el('div', 'admin-actions');
      acts.appendChild(btn('تعديل', function () { openAuthorEditor(a); }));
      acts.appendChild(btn('حذف', function () { deleteAuthor(a); }, 'danger'));
      td.appendChild(acts); tr.appendChild(td); tbody.appendChild(tr);
    });
  }
  function renderTags() {
    var box = document.getElementById('tags-list'); box.innerHTML = '';
    cache.tags.forEach(function (t) {
      var chip = el('span', 'tag-chip', t.name); chip.title = 'حذف'; chip.style.cursor = 'pointer';
      chip.addEventListener('click', function () { deleteTag(t); }); box.appendChild(chip);
    });
  }
  function populateSelects() {
    var catSel = document.getElementById('art-category'); var authSel = document.getElementById('art-author');
    catSel.innerHTML = '<option value="">— بدون قسم —</option>';
    cache.categories.forEach(function (c) { var o = el('option', null, c.name); o.value = c.id; catSel.appendChild(o); });
    authSel.innerHTML = '<option value="">— بدون كاتب —</option>';
    cache.authors.forEach(function (a) { var o = el('option', null, a.name); o.value = a.id; authSel.appendChild(o); });
    renderTagCheckboxes([]);
  }
  function renderTagCheckboxes(selected) {
    selected = selected || []; var box = document.getElementById('art-tags'); box.innerHTML = '';
    cache.tags.forEach(function (t) {
      var wrap = el('span', 'checkbox-row'); wrap.style.marginLeft = '1rem';
      var cb = document.createElement('input'); cb.type = 'checkbox'; cb.value = t.id; cb.checked = selected.indexOf(t.id) !== -1;
      wrap.appendChild(cb); wrap.appendChild(document.createTextNode(t.name)); box.appendChild(wrap);
    });
  }

  function wireTabs() {
    document.querySelectorAll('.admin-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('.admin-tab').forEach(function (t) { t.classList.remove('is-active'); });
        document.querySelectorAll('.admin-panel').forEach(function (p) { p.classList.remove('is-active'); });
        tab.classList.add('is-active'); document.querySelector('[data-panel="' + tab.dataset.tab + '"]').classList.add('is-active');
      });
    });
    var f = document.getElementById('articles-filter'); var sf = document.getElementById('articles-status-filter');
    if (f) f.addEventListener('input', function () { renderArticles(f.value, sf.value); });
    if (sf) sf.addEventListener('change', function () { renderArticles(f.value, sf.value); });
  }
  function wireGlobalActions() {
    document.getElementById('logout-btn').addEventListener('click', async function () { await sb.auth.signOut(); window.location.href = 'login.html'; });
    document.querySelector('[data-action="new-article"]').addEventListener('click', function () { openArticleEditor(null); });
    document.querySelector('[data-action="new-category"]').addEventListener('click', function () { openCategoryEditor(null); });
    document.querySelector('[data-action="new-author"]').addEventListener('click', function () { openAuthorEditor(null); });
    document.querySelector('[data-action="new-tag"]').addEventListener('click', function () { openTagEditor(); });
  }

  var editingArticle = null;
  function openArticleEditor(a) {
    editingArticle = a;
    document.getElementById('editor-title').textContent = a ? 'تعديل المقال' : 'مقال جديد';
    document.getElementById('art-title').value = a ? a.title : '';
    document.getElementById('art-slug').value = a ? a.slug : '';
    document.getElementById('art-excerpt').value = a ? (a.excerpt || '') : '';
    document.getElementById('art-content').value = a ? (a.content || '') : '';
    document.getElementById('art-status').value = a ? a.status : 'draft';
    document.getElementById('art-category').value = a ? (a.category_id || '') : '';
    document.getElementById('art-author').value = a ? (a.author_id || '') : '';
    document.getElementById('art-featured').checked = a ? !!a.is_featured : false;
    document.getElementById('art-breaking').checked = a ? !!a.is_breaking : false;
    document.getElementById('art-published').value = a && a.published_at ? a.published_at.slice(0, 16) : '';
    var prev = document.getElementById('art-image-preview');
    if (a && a.featured_image) { prev.src = a.featured_image; prev.style.display = 'block'; } else { prev.style.display = 'none'; }
    if (a) {
      sb.from('article_tags').select('tag_id').eq('article_id', a.id).then(function (res) { renderTagCheckboxes((res.data || []).map(function (r) { return r.tag_id; })); });
    } else { renderTagCheckboxes([]); }
    openOverlay('editor-overlay');
  }

  async function saveArticle(statusOverride) {
    var msg = document.getElementById('editor-msg'); msg.textContent = 'جارٍ الحفظ…'; msg.className = 'login-msg';
    var title = document.getElementById('art-title').value.trim();
    if (!title) { msg.className = 'login-msg err'; msg.textContent = 'العنوان مطلوب.'; return; }
    var slug = document.getElementById('art-slug').value.trim() || slugify(title) || uid().slice(0, 8);
    var payload = {
      title: title, slug: slug,
      excerpt: document.getElementById('art-excerpt').value.trim(),
      content: document.getElementById('art-content').value,
      category_id: document.getElementById('art-category').value || null,
      author_id: document.getElementById('art-author').value || null,
      status: statusOverride || document.getElementById('art-status').value,
      is_featured: document.getElementById('art-featured').checked,
      is_breaking: document.getElementById('art-breaking').checked,
      published_at: document.getElementById('art-published').value ? new Date(document.getElementById('art-published').value).toISOString() : new Date().toISOString()
    };
    var fileInput = document.getElementById('art-image');
    var imageUrl = editingArticle ? editingArticle.featured_image : null;
    if (fileInput.files && fileInput.files[0]) { var up = await uploadImage(fileInput.files[0]); if (up) imageUrl = up; }
    payload.featured_image = imageUrl;
    var tags = Array.prototype.map.call(document.querySelectorAll('#art-tags input:checked'), function (c) { return c.value; });

    var result;
    if (editingArticle) { result = await sb.from('articles').update(payload).eq('id', editingArticle.id); await syncTags(editingArticle.id, tags); }
    else { result = await sb.from('articles').insert(payload).select().single(); if (result.data) await syncTags(result.data.id, tags); }

    if (result.error) { msg.className = 'login-msg err'; msg.textContent = 'خطأ: ' + result.error.message; return; }
    msg.className = 'login-msg ok'; msg.textContent = 'تم الحفظ بنجاح ✓';
    closeOverlay('editor-overlay'); await loadAll();
  }

  async function syncTags(articleId, tagIds) {
    await sb.from('article_tags').delete().eq('article_id', articleId);
    if (tagIds.length) await sb.from('article_tags').insert(tagIds.map(function (t) { return { article_id: articleId, tag_id: t }; }));
  }
  async function uploadImage(file) {
    var bucket = window.MOCRO_CONFIG.STORAGE_BUCKET || 'images';
    var ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    var path = 'articles/' + uid() + '.' + ext;
    var res = await sb.storage.from(bucket).upload(path, file, { upsert: false });
    if (res.error) { console.error(res.error); return null; }
    return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
  async function deleteArticle(a) { if (!confirm('حذف المقال «' + a.title + '» نهائياً؟')) return; await sb.from('articles').delete().eq('id', a.id); await loadAll(); }
  async function togglePublish(a) { var next = a.status === 'published' ? 'archived' : 'published'; var upd = { status: next }; if (next === 'published' && !a.published_at) upd.published_at = new Date().toISOString(); await sb.from('articles').update(upd).eq('id', a.id); await loadAll(); }

  var genType = null, genEditing = null;
  function openCategoryEditor(c) {
    genType = 'category'; genEditing = c;
    document.getElementById('gen-title').textContent = c ? 'تعديل قسم' : 'قسم جديد';
    var f = document.getElementById('gen-fields'); f.innerHTML = '';
    f.appendChild(field('الاسم', 'gen-name', c ? c.name : ''));
    f.appendChild(field('Slug', 'gen-slug', c ? c.slug : ''));
    f.appendChild(field('الترتيب', 'gen-order', c ? String(c.sort_order) : '0'));
    f.appendChild(fieldArea('الوصف', 'gen-desc', c ? c.description : ''));
    openOverlay('gen-overlay');
  }
  function openAuthorEditor(a) {
    genType = 'author'; genEditing = a;
    document.getElementById('gen-title').textContent = a ? 'تعديل كاتب' : 'كاتب جديد';
    var f = document.getElementById('gen-fields'); f.innerHTML = '';
    f.appendChild(field('الاسم', 'gen-name', a ? a.name : ''));
    f.appendChild(field('Slug', 'gen-slug', a ? a.slug : ''));
    f.appendChild(fieldArea('السيرة الذاتية', 'gen-bio', a ? a.bio : ''));
    f.appendChild(field('الصورة (URL)', 'gen-avatar', a ? a.avatar : ''));
    openOverlay('gen-overlay');
  }
  function openTagEditor() {
    genType = 'tag'; genEditing = null;
    document.getElementById('gen-title').textContent = 'وسم جديد';
    var f = document.getElementById('gen-fields'); f.innerHTML = '';
    f.appendChild(field('الاسم', 'gen-name', ''));
    openOverlay('gen-overlay');
  }
  function field(label, id, val) { var w = el('div', 'admin-field full'); var lb = el('label', null, label); lb.setAttribute('for', id); var i = document.createElement('input'); i.id = id; i.value = val || ''; w.appendChild(lb); w.appendChild(i); return w; }
  function fieldArea(label, id, val) { var w = el('div', 'admin-field full'); var lb = el('label', null, label); var t = document.createElement('textarea'); t.id = id; t.value = val || ''; w.appendChild(lb); w.appendChild(t); return w; }

  async function saveGeneric() {
    var msg = document.getElementById('gen-msg'); msg.className = 'login-msg'; msg.textContent = 'جارٍ الحفظ…';
    var name = document.getElementById('gen-name').value.trim();
    var slug = (document.getElementById('gen-slug') ? document.getElementById('gen-slug').value.trim() : '') || slugify(name);
    if (!name) { msg.className = 'login-msg err'; msg.textContent = 'الاسم مطلوب.'; return; }
    var payload = { name: name, slug: slug }; var res;
    if (genType === 'category') {
      payload.description = document.getElementById('gen-desc').value.trim();
      payload.sort_order = parseInt(document.getElementById('gen-order').value || '0', 10); payload.is_active = true;
      res = genEditing ? await sb.from('categories').update(payload).eq('id', genEditing.id) : await sb.from('categories').insert(payload);
    } else if (genType === 'author') {
      payload.bio = document.getElementById('gen-bio').value.trim(); payload.avatar = document.getElementById('gen-avatar').value.trim();
      res = genEditing ? await sb.from('authors').update(payload).eq('id', genEditing.id) : await sb.from('authors').insert(payload);
    } else {
      res = await sb.from('tags').insert(payload);
    }
    if (res.error) { msg.className = 'login-msg err'; msg.textContent = res.error.message; return; }
    msg.className = 'login-msg ok'; msg.textContent = 'تم الحفظ ✓';
    closeOverlay('gen-overlay'); await loadAll();
  }

  async function deleteCategory(c) { if (!confirm('حذف القسم «' + c.name + '»؟')) return; await sb.from('categories').delete().eq('id', c.id); await loadAll(); }
  async function toggleCategory(c) { await sb.from('categories').update({ is_active: !c.is_active }).eq('id', c.id); await loadAll(); }
  async function deleteAuthor(a) { if (!confirm('حذف الكاتب «' + a.name + '»؟')) return; await sb.from('authors').delete().eq('id', a.id); await loadAll(); }
  async function deleteTag(t) { if (!confirm('حذف الوسم «' + t.name + '»؟')) return; await sb.from('tags').delete().eq('id', t.id); await loadAll(); }

  function wireEditor() {
    document.getElementById('art-save-publish').addEventListener('click', function () { saveArticle('published'); });
    document.getElementById('art-save-draft').addEventListener('click', function () { saveArticle('draft'); });
    document.querySelectorAll('[data-editor-close]').forEach(function (b) { b.addEventListener('click', function () { closeOverlay('editor-overlay'); }); });
    document.getElementById('gen-save').addEventListener('click', saveGeneric);
    document.querySelectorAll('[data-gen-close]').forEach(function (b) { b.addEventListener('click', function () { closeOverlay('gen-overlay'); }); });
    document.getElementById('art-image').addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) { var r = new FileReader(); r.onload = function (ev) { var p = document.getElementById('art-image-preview'); p.src = ev.target.result; p.style.display = 'block'; }; r.readAsDataURL(e.target.files[0]); }
    });
  }

  function openOverlay(id) { var ov = document.getElementById(id); ov.classList.add('is-open'); ov.setAttribute('aria-hidden', 'false'); }
  function closeOverlay(id) { var ov = document.getElementById(id); ov.classList.remove('is-open'); ov.setAttribute('aria-hidden', 'true'); }

  document.addEventListener('DOMContentLoaded', init);
})();