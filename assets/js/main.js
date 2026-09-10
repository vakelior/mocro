(function(){
'use strict';
var burger=document.querySelector('[data-burger]');
var sidebar=document.querySelector('[data-sidebar]');
var backdrop=document.querySelector('[data-backdrop]');
var closeBtn=document.querySelector('[data-sidebar-close]');
var lastFocused=null;
function openSidebar(){if(!sidebar)return;lastFocused=document.activeElement;sidebar.classList.add('is-open');backdrop.classList.add('is-open');document.body.style.overflow='hidden';closeBtn&&closeBtn.focus();}
function closeSidebar(){if(!sidebar)return;sidebar.classList.remove('is-open');backdrop.classList.remove('is-open');document.body.style.overflow='';if(lastFocused)lastFocused.focus();}
burger&&burger.addEventListener('click',openSidebar);
closeBtn&&closeBtn.addEventListener('click',closeSidebar);
backdrop&&backdrop.addEventListener('click',closeSidebar);
document.addEventListener('keydown',function(e){if(e.key==='Escape')closeSidebar();});
var slides=Array.prototype.slice.call(document.querySelectorAll('[data-slide]'));
var dots=Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
var current=0,auto=null;
function show(i){if(!slides.length)return;current=(i+slides.length)%slides.length;slides.forEach(function(s,k){s.classList.toggle('is-active',k===current);});dots.forEach(function(d,k){d.classList.toggle('is-active',k===current);});}
function next(){show(current+1);}
dots.forEach(function(dot){dot.addEventListener('click',function(){show(parseInt(dot.getAttribute('data-hero-dot'),10));restart();});});
function start(){if(slides.length<=1)return;var reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced)return;auto=setInterval(next,5500);}
function restart(){clearInterval(auto);start();}
start();
var tags=document.querySelectorAll('.tag[data-filter]');
var posts=document.querySelectorAll('.post-grid .item[data-cat]');
tags.forEach(function(tag){tag.addEventListener('click',function(){var f=tag.getAttribute('data-filter');tags.forEach(function(t){t.classList.remove('active');});tag.classList.add('active');posts.forEach(function(p){var show=(f==='*'||p.getAttribute('data-cat')===f);p.style.display=show?'':'none';});});});
document.querySelectorAll('a[href^="#"]').forEach(function(link){link.addEventListener('click',function(e){var id=link.getAttribute('href');if(id&&id.length>1){var target=document.querySelector(id);if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});closeSidebar();}}});});
})();
