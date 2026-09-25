// Люмен: общий скрипт для всех страниц.
(function () {
  var root = document.documentElement;
  var body = document.body;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Переход между страницами: золотисто-кофейный занавес с логотипом.
  var curtain = document.querySelector('.curtain');
  function liftCurtain() {
    if (!curtain || !curtain.classList.contains('is-enter')) return;
    requestAnimationFrame(function () {
      curtain.classList.add('is-leave');
      curtain.classList.remove('is-enter');
      setTimeout(function () { curtain.classList.remove('is-leave'); }, 750);
    });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a || !curtain || reduce) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (a.target === '_blank' || a.hasAttribute('download')) return;
    var url = new URL(a.href, location.href);
    if (url.origin !== location.origin || !/\.html$|\/$/.test(url.pathname)) return;
    if (url.pathname === location.pathname && url.hash) return; // якорь на этой же странице
    e.preventDefault();
    curtain.classList.remove('is-leave', 'is-enter');
    curtain.classList.add('is-cover-start');
    curtain.offsetHeight; // зафиксировать стартовое положение
    curtain.classList.remove('is-cover-start');
    curtain.classList.add('is-cover');
    try { sessionStorage.setItem('lnav', '1'); } catch (err) {}
    setTimeout(function () { location.href = url.href; }, 560);
  });
  window.addEventListener('pageshow', function (e) {
    if (e.persisted && curtain) curtain.classList.remove('is-cover', 'is-enter', 'is-leave');
  });

  // Первый экран: запуск анимации, когда шрифты готовы (или через 700 мс).
  var started = false;
  function start() {
    if (started) return;
    started = true;
    liftCurtain();
    root.classList.add('is-loaded');
    var cta = document.querySelector('.hero .btn--gold, .page-hero ~ * .btn--gold');
    if (cta && !reduce) setTimeout(function () { cta.classList.add('is-shine'); }, 1700);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(start);
  setTimeout(start, 700);

  // Шапка: прозрачная над фото, плотная после прокрутки.
  var header = document.querySelector('.header');
  var hero = document.querySelector('.hero, .page-hero');
  function headerState() {
    var limit = hero ? hero.offsetHeight - header.offsetHeight - 40 : 8;
    header.classList.toggle('is-scrolled', window.scrollY > Math.max(8, limit));
  }

  // Параллакс: фото движутся медленнее страницы.
  var layers = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var ticking = false;
  function parallax() {
    ticking = false;
    var vh = window.innerHeight;
    layers.forEach(function (el) {
      var box = el.parentElement.getBoundingClientRect();
      if (box.bottom < -100 || box.top > vh + 100) return;
      var speed = parseFloat(el.dataset.parallax) || 0.15;
      var center = box.top + box.height / 2 - vh / 2;
      var y = Math.max(-70, Math.min(70, -center * speed)); // не даём фото заехать на соседние блоки
      el.style.transform = 'translate3d(0,' + y.toFixed(1) + 'px,0)';
    });
  }
  function onScroll() {
    headerState();
    if (!reduce && layers.length && !ticking) { ticking = true; requestAnimationFrame(parallax); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // Мобильное меню.
  var burger = document.querySelector('.burger');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.setAttribute('aria-hidden', String(!open));
    if (open) {
      menu.removeAttribute('inert');
      setTimeout(function () { var a = menu.querySelector('a'); a && a.focus({ preventScroll: true }); }, 350);
    } else {
      menu.setAttribute('inert', '');
    }
  }
  if (burger && menu) {
    menu.setAttribute('inert', '');
    burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && body.classList.contains('menu-open')) { setMenu(false); burger.focus(); }
    });
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (m) { if (m.matches) setMenu(false); });
  }

  // Появление блоков при прокрутке (один раз).
  var items = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.06 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add('is-in'); });
  }

  // «Читать полностью» у длинных отзывов (только на странице отзывов).
  document.querySelectorAll('.reviews--all .review__text').forEach(function (t) {
    if (t.textContent.length < 420) return;
    t.classList.add('is-clamped');
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'review__more';
    b.textContent = 'Читать полностью';
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function () {
      var open = t.classList.toggle('is-clamped') === false;
      b.textContent = open ? 'Свернуть' : 'Читать полностью';
      b.setAttribute('aria-expanded', String(open));
    });
    t.after(b);
  });
})();
