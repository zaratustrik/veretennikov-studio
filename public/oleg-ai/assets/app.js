// Кнопки "Скопировать" + мобильное меню + подсветка активного раздела
(function(){
  // Копирование промптов
  document.querySelectorAll('.copy-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      var pre = btn.closest('.prompt').querySelector('pre');
      var text = pre.innerText;
      navigator.clipboard.writeText(text).then(function(){
        var old = btn.textContent;
        btn.textContent = '✓ Скопировано';
        btn.classList.add('done');
        setTimeout(function(){ btn.textContent = old; btn.classList.remove('done'); }, 1600);
      });
    });
  });
  // Мобильное меню
  var toggle = document.querySelector('.nav-toggle');
  var side = document.querySelector('.side');
  if(toggle && side){
    toggle.addEventListener('click', function(){ side.classList.toggle('open'); });
    side.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ side.classList.remove('open'); });
    });
  }
  // Прогресс чтения
  var pb = document.createElement('div'); pb.id = 'pbar'; document.body.appendChild(pb);
  function prog(){
    var h = document.documentElement;
    var max = h.scrollHeight - h.clientHeight;
    pb.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
  }
  window.addEventListener('scroll', prog, {passive:true});
  prog();
  // Появление блоков при скролле
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!reduced && 'IntersectionObserver' in window){
    var els = document.querySelectorAll(
      'main .card, main .callout, main .prompt, main .step, main .table-wrap, main .ba > .box, main .pager a');
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.1, rootMargin:'0px 0px -28px 0px'});
    els.forEach(function(el, i){
      el.classList.add('rv');
      var sib = el.parentElement ? Array.prototype.indexOf.call(el.parentElement.children, el) : 0;
      el.style.transitionDelay = Math.min(sib, 5) * 70 + 'ms';
      io.observe(el);
    });
  }
})();
