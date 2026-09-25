// Сборка страниц сайта Люмен. Запуск: node _build/build.mjs (из папки Работа/Люмен).
// Шапка, меню и подвал общие: правьте их здесь, затем пересоберите.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const BOOK = 'https://n207666.yclients.com/company/207418/personal/menu?o=';
const PHONE = '+7 (977) 497-26-26';
const TEL = 'tel:+79774972626';
const WA = 'https://wa.me/79774972626';
const VK = 'https://vk.ru/Lumensalon';
const TG = 'https://t.me/salonSundex';
const MAPS = 'https://yandex.ru/maps/org/lyumen/181692772645/';
const REVIEWS_URL = 'https://yandex.ru/maps/org/lyumen/181692772645/reviews/';
const ADDRESS = 'Троицк, Городская ул., 20';
const HOURS = 'Ежедневно 9:00–21:00';

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, 'assets/js/services-data.js'), 'utf8'), ctx);
const SVC = ctx.window.LUMEN_SERVICES;
const count = (...ids) => ids.reduce((a, id) => a + SVC.find((c) => c.id === id).items.length, 0);
const plural = (n) => { const a = n % 10, b = n % 100; return n + ' ' + (a === 1 && b !== 11 ? 'услуга' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'услуги' : 'услуг'); };
const total = SVC.reduce((a, c) => a + c.items.length, 0);
const size = JSON.parse(fs.readFileSync(path.join(ROOT, 'assets/img/sizes.json'), 'utf8'));
const img = (src, alt, extra = '') => {
  const [w, h] = size[src] || [800, 1000];
  return `<img src="assets/img/${src}" alt="${alt}" width="${w}" height="${h}" loading="lazy" decoding="async"${extra}>`;
};
const glow = (src, alt, cls = '') => `<div class="glow ${cls}">${img(src, alt)}</div>`;

const I = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3L2.8 9.5l6.4-.9z"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
};
const stars = `<span class="stars" aria-hidden="true">${I.star.repeat(5)}</span>`;

const NAV = [
  ['uslugi.html', 'Услуги', 'цены'],
  ['raboty.html', 'Работы', 'фото'],
  ['salon.html', 'Салон', 'интерьер'],
  ['otzyvy.html', 'Отзывы', '5,0'],
  ['kontakty.html', 'Контакты', 'адрес'],
];

function layout({ file, title, description, body, scripts = '', bodyClass = '' }) {
  const nav = NAV.map(([h, t]) => `<li><a href="${h}"${h === file ? ' aria-current="page"' : ''}>${t}</a></li>`).join('');
  const mnav = [['index.html', 'Главная', 'люмен'], ...NAV].map(([h, t, s], i) => `<li><a href="${h}" style="--i:${i}"${h === file ? ' aria-current="page"' : ''}>${t} <small>${s}</small></a></li>`).join('');
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="theme-color" content="#3a2e27">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="assets/img/salon/salon-03.jpg">
<link rel="icon" href="assets/img/favicon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,500&family=Forum&family=Manrope:wght@400;500;600&display=swap&subset=cyrillic" rel="stylesheet">
<link rel="stylesheet" href="assets/css/site.css">
<script>document.documentElement.classList.add('js')</script>
</head>
<body class="has-hero${bodyClass ? ' ' + bodyClass : ''}">
<div class="curtain" aria-hidden="true"><img src="assets/img/mark.png" alt="" width="311" height="312"></div>
<script>try{if(sessionStorage.getItem('lnav')){document.querySelector('.curtain').classList.add('is-enter');sessionStorage.removeItem('lnav')}}catch(e){}</script>
<a class="skip" href="#main">К содержанию</a>
<header class="header">
  <div class="wrap">
    <a class="brand" href="index.html" aria-label="Люмен, на главную">
      <img src="assets/img/mark.png" alt="" width="311" height="312">
      <span><span class="brand__name">ЛЮМЕН</span><span class="brand__sub">салон красоты</span></span>
    </a>
    <nav class="nav" aria-label="Основное меню"><ul>${nav}</ul></nav>
    <a class="btn btn--gold header__cta" href="${BOOK}" target="_blank" rel="noopener">Записаться</a>
    <button class="burger" type="button" aria-expanded="false" aria-controls="menu" aria-label="Открыть меню"><span></span><span></span></button>
  </div>
</header>
<div class="menu" id="menu" aria-hidden="true">
  <nav aria-label="Меню"><ul>${mnav}</ul></nav>
  <div class="menu__foot">
    <a class="btn btn--gold" href="${BOOK}" target="_blank" rel="noopener">Записаться онлайн</a>
    <a href="${TEL}">${PHONE}</a>
    <span>${ADDRESS}. ${HOURS}</span>
  </div>
</div>
<main id="main">
${body}
</main>
<footer class="footer">
  <div class="wrap">
    <div class="footer__cta">
      <h2 class="h2" data-reveal>Выберите <em>удобное</em> время</h2>
      <div class="footer__actions" data-reveal style="--i:1">
        <a class="btn btn--gold" href="${BOOK}" target="_blank" rel="noopener">Записаться онлайн ${I.arrow}</a>
        <a class="btn btn--glass" href="${TEL}">${I.phone} Позвонить</a>
      </div>
    </div>
    <div class="footer__grid">
      <div class="footer__brand">
        <a class="brand" href="index.html" aria-label="Люмен, на главную">
          <img src="assets/img/mark.png" alt="" width="311" height="312" loading="lazy">
          <span><span class="brand__name">ЛЮМЕН</span><span class="brand__sub">сияй как солнце</span></span>
        </a>
        <p>Салон красоты в Троицке: волосы, ногти, косметология, брови и ресницы, эпиляция, пирсинг.</p>
      </div>
      <div><h3>Разделы</h3><ul>${NAV.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul></div>
      <div><h3>Адрес</h3><p>${ADDRESS}<br>Ежедневно <span class="nowrap">9:00–21:00</span></p></div>
      <div><h3>Связь</h3><ul><li><a href="${TEL}">${PHONE}</a></li><li><a href="${WA}" target="_blank" rel="noopener">WhatsApp</a></li><li><a href="${TG}" target="_blank" rel="noopener">Telegram</a></li><li><a href="${VK}" target="_blank" rel="noopener">ВКонтакте</a></li></ul></div>
    </div>
    <div class="footer__bottom">© 2026 Люмен, салон красоты</div>
  </div>
</footer>
<div class="booking-bar">
  <a class="btn btn--gold" href="${BOOK}" target="_blank" rel="noopener">Записаться онлайн</a>
  <a class="call" href="${TEL}" aria-label="Позвонить ${PHONE}">${I.phone}</a>
</div>
<script src="assets/js/site.js" defer></script>
${scripts}
</body>
</html>
`;
}

const pageHero = (crumb, title, lead, src, extra = '') => `
<section class="page-hero">
  <div class="page-hero__media">${img(src, '', ' data-parallax="0.12" fetchpriority="high"').replace(' loading="lazy"', '')}</div>
  <div class="wrap">
    <p class="crumbs"><a href="index.html">Главная</a> / ${crumb}</p>
    <h1 class="h1"><span class="hero__line"><span style="--i:0">${title}</span></span></h1>
    ${lead ? `<p class="lead hero__fade" style="--i:0">${lead}</p>` : ''}
    ${extra}
  </div>
</section>`;

// ---------- Отзывы (Яндекс.Карты, без дат) ----------
const REVIEWS = JSON.parse(fs.readFileSync(path.join(ROOT, '_build/reviews.json'), 'utf8'));
const reviewCard = (r, i, full) => `<figure class="review"${full ? ` data-reveal style="--i:${i % 3}"` : ''}>
  ${full ? `<span class="review__tag">${r.tag}</span>` : '<span class="review__q" aria-hidden="true">“</span>'}
  <blockquote class="review__text">${r.text}</blockquote>
  <figcaption><b>${r.name}</b>${stars}</figcaption>
</figure>`;

// ---------- Главная ----------
const sunRays = Array.from({ length: 72 }, (_, k) => {
  const a = (k / 72) * Math.PI * 2, r1 = 101, r2 = k % 6 === 0 ? 111 : 106;
  const f = (n) => n.toFixed(2);
  return `M${f(100 + r1 * Math.cos(a))} ${f(100 + r1 * Math.sin(a))}L${f(100 + r2 * Math.cos(a))} ${f(100 + r2 * Math.sin(a))}`;
}).join('');

const DIRS = [
  ['hair', 'Волосы', 'dir-hair.jpg', count('hair', 'men'), 'Мелированные волосы после окрашивания в салоне'],
  ['manicure', 'Маникюр и педикюр', 'dir-nails.jpg', count('manicure', 'pedicure'), 'Нюдовый маникюр'],
  ['aesth', 'Косметология', 'dir-cosmo.jpg', count('aesth', 'apparatus', 'doctor'), 'Кабинет косметолога с креслом'],
  ['brows', 'Брови и ресницы', 'dir-brows.jpg', count('brows'), 'Ресницы после ламинирования'],
  ['epil-f', 'Эпиляция', 'dir-epil.jpg', count('epil-f', 'epil-m'), 'Гранулы воска для эпиляции'],
  ['piercing', 'Пирсинг', 'dir-piercing.jpg', count('piercing'), 'Серьги в хрящике и мочке уха'],
];
const marqueeWords = ['Волосы', 'Маникюр', 'Педикюр', 'Косметология', 'Брови и ресницы', 'Эпиляция', 'Пирсинг', 'Макияж'];
const marqueeGroup = (hidden) => `<div class="marquee__group"${hidden ? ' aria-hidden="true"' : ''}>${marqueeWords.map((w) => `<span>${w}</span><i>сияй</i>`).join('')}</div>`;
const COLS = [
  [['works/hair-01.jpg', 'Светлое каре'], ['works/nails-04.jpg', 'Маникюр с цветочной росписью'], ['works/piercing-02.jpg', 'Несколько проколов в ухе']],
  [['works/hair-long.jpg', 'Длинные светлые волосы на фоне стены с мхом'], ['works/brows-04.jpg', 'Ресницы после ламинирования'], ['works/nails-08.jpg', 'Бордовый маникюр']],
  [['works/nails-05.jpg', 'Розовый френч'], ['works/hair-09.jpg', 'Длинные волосы после тонирования'], ['works/hair-03.jpg', 'Высокая вечерняя причёска']],
];
const teaserReviews = REVIEWS.filter((r) => r.teaser || r.text.length < 560);

const home = `
<section class="hero hero--plain" aria-label="Люмен">
  <!-- Фото первого экрана: ждём выбор Евгении (варианты: varianty.html). Вернуть блок .hero__media + .hero__shade. -->
  <div class="sun" aria-hidden="true">
    <svg viewBox="0 0 200 200"><g class="sun__spin"><circle class="sun__ring" cx="100" cy="100" r="96" pathLength="1"/><path class="sun__rays" d="${sunRays}" pathLength="1"/></g></svg>
  </div>
  <div class="wrap hero__inner">
    <p class="kicker hero__fade" style="--i:0">Салон красоты в Троицке</p>
    <h1 class="h1"><span class="hero__line"><span style="--i:0">Сияй</span></span><span class="hero__line"><span style="--i:1">как <em>солнце</em></span></span></h1>
    <p class="lead hero__fade" style="--i:1">Стрижки и окрашивание, маникюр и педикюр, косметология, брови и ресницы, эпиляция и пирсинг в одном салоне на Городской, 20.</p>
    <div class="hero__actions hero__fade" style="--i:2">
      <a class="btn btn--gold" href="${BOOK}" target="_blank" rel="noopener">Записаться онлайн ${I.arrow}</a>
      <a class="btn btn--line" href="uslugi.html">Услуги и цены</a>
    </div>
    <a class="hero__rating hero__fade" style="--i:3" href="${REVIEWS_URL}" target="_blank" rel="noopener">${stars}<span><b>5,0</b> на Яндекс Картах · 240 отзывов</span></a>
  </div>
  <div class="hero__scroll" aria-hidden="true"><i></i>Листайте</div>
</section>

<div class="marquee" aria-label="Направления салона"><div class="marquee__track">${marqueeGroup(false)}${marqueeGroup(true)}</div></div>

<section class="section section--glow" aria-labelledby="dirs-title">
  <div class="wrap">
    <div class="section__head">
      <div data-reveal>
        <p class="kicker">всё в одном месте</p>
        <h2 class="h2" id="dirs-title">Шесть <em>направлений</em></h2>
        <p class="lead">${total} услуг в прайсе. Выберите направление, чтобы увидеть цены и фото.</p>
      </div>
      <a class="link-arrow" href="uslugi.html" data-reveal>Весь прайс ${I.arrow}</a>
    </div>
    <ul class="dirs">
      ${DIRS.map(([id, t, src, n, alt], i) => `<li data-reveal style="--i:${i % 3}"><a class="dir" href="uslugi.html#${id}">${`<div class="glow">${img(src, alt)}<div class="dir__over"><span class="dir__name">${t}</span><span class="dir__count">${plural(n)}</span></div></div>`}</a></li>`).join('\n      ')}
    </ul>
  </div>
</section>

<section class="section section--moss" aria-labelledby="salon-title">
  <div class="wrap">
    <div class="salon-head">
      <div data-reveal>
        <p class="kicker">наш салон</p>
        <h2 class="h2" id="salon-title">Троицк, <em>Городская, 20</em></h2>
        <p class="lead" style="margin-top:18px">Светлый салон в Троицке. Отдельный кабинет косметолога, мойка для волос, места для маникюра и педикюра.</p>
        <a class="link-arrow" href="salon.html" style="margin-top:28px;color:var(--paper)">Посмотреть салон ${I.arrow}</a>
      </div>
      <div data-reveal style="--i:1">
        <ul class="facts" style="margin-top:0">
          <li><span>Часы работы</span><span>${HOURS}</span></li>
          <li><span>Парковка</span><span>рядом с домом</span></li>
          <li><span>Оплата</span><span>картой и наличными</span></li>
          <li><span>Wi‑Fi</span><span>для гостей</span></li>
        </ul>
        <p class="brands"><span>DAVINES</span><span>LEBEL</span><span>REVLON</span><span>JANSSEN</span><span>JULIETTE ARMAND</span><span>CIMEL</span><span>LVL</span><span>STUDEX</span></p>
      </div>
    </div>
    <div class="trio">
      ${[['salon/salon-03.jpg', 'Зал с мойкой для волос', 'Зона для волос'], ['salon/salon-07.jpg', 'Столы мастеров маникюра', 'Маникюр и педикюр'], ['salon/salon-04.jpg', 'Кабинет косметолога с кушеткой', 'Кабинет косметолога']].map(([s, a, cap], i) => `<figure data-reveal style="--i:${i}">${glow(s, a)}<figcaption>${cap}</figcaption></figure>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--espresso" aria-labelledby="works-title">
  <div class="wrap">
    <div class="section__head">
      <div data-reveal>
        <p class="kicker">снято в салоне</p>
        <h2 class="h2" id="works-title">Работы <em>мастеров</em></h2>
        <p class="lead">Окрашивание, стрижки, маникюр, пирсинг, брови и ресницы.</p>
      </div>
      <a class="btn btn--gold" href="raboty.html" data-reveal>Все работы ${I.arrow}</a>
    </div>
    <div class="float-cols">
      ${COLS.map((col, c) => `<div class="float-col"${c ? ` data-parallax="${c === 1 ? 0.06 : -0.04}"` : ''}>${col.map(([s, a]) => `<a href="raboty.html" aria-label="${a}">${glow(s, a)}</a>`).join('')}</div>`).join('\n      ')}
    </div>
  </div>
</section>

<section class="section section--oat" aria-labelledby="rev-title">
  <div class="wrap">
    <div class="section__head">
      <div class="rating-big" data-reveal>
        <span class="rating-big__num">5,0</span>
        <div><h2 class="h2" id="rev-title" style="font-size:clamp(32px,5vw,52px)">Что пишут <em>гости</em></h2><p>${stars} 240 отзывов на Яндекс Картах</p></div>
      </div>
      <a class="link-arrow" href="otzyvy.html" data-reveal>Все отзывы ${I.arrow}</a>
    </div>
  </div>
  <div class="rev-marquee">
    <div class="rev-marquee__track">
      ${teaserReviews.map((r) => reviewCard(r, 0, false)).join('')}
      <div style="display:contents" aria-hidden="true">${teaserReviews.map((r) => reviewCard(r, 0, false)).join('')}</div>
    </div>
  </div>
</section>
`;

// ---------- Услуги ----------
const BANNER = {
  hair: 'dir-hair.jpg', men: 'works/hair-08.jpg', manicure: 'dir-nails.jpg', pedicure: 'works/nails-10.jpg', brows: 'dir-brows.jpg',
  makeup: 'banner-makeup.jpg', aesth: 'salon/salon-04.jpg', apparatus: 'salon/salon-02.jpg', doctor: 'salon/salon-09.jpg',
  'epil-f': 'dir-epil.jpg', 'epil-m': 'salon/salon-11.jpg', piercing: 'dir-piercing.jpg',
};
const uslugi = pageHero('Услуги', 'Услуги <em>и цены</em>', `${total} услуг в двенадцати разделах. У каждой услуги фото и цена.`, 'salon/salon-03.jpg') + `
<div class="svc-tools">
  <div class="wrap">
    <div class="search" role="search">
      <label class="visually-hidden" for="svc-q">Найти услугу</label>
      ${I.search}
      <input id="svc-q" type="search" placeholder="Например, окрашивание или педикюр" autocomplete="off" enterkeyhint="search">
      <button class="search__clear" type="button" aria-label="Очистить поиск">${I.close}</button>
    </div>
    <nav class="chips" aria-label="Разделы прайса">
      ${SVC.map((c) => `<a class="chip" href="#${c.id}" data-cat="${c.id}">${c.title} <small>${c.items.length}</small></a>`).join('')}
    </nav>
  </div>
</div>
<section class="wrap svc-layout" aria-label="Прайс">
  <div id="svc-root"></div>
  <p class="price-note">Цены взяты из карточки салона на Яндекс Картах, фото услуг из каталога салона. Точную стоимость назовёт администратор: ${PHONE}.</p>
</section>`;

const uslugiScript = `<script src="assets/js/services-data.js"></script>
<script>
(function () {
  var BANNER = ${JSON.stringify(BANNER)};
  var GS = ${JSON.stringify(Object.fromEntries(Object.entries(size).filter(([k]) => k.startsWith('svc-full/') || !k.includes('/') || k.startsWith('salon/') || k.startsWith('works/'))))};
  var SMALL = ${JSON.stringify(Object.keys(size).filter((k) => k.startsWith('svc-full/') && size[k][0] < 500))};
  var data = window.LUMEN_SERVICES, root = document.getElementById('svc-root');
  var input = document.getElementById('svc-q'), search = input.closest('.search');
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var norm = function (s) { return s.toLowerCase().replace(/ё/g, 'е'); };
  var esc = function (s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };
  function mark(name, q) {
    if (!q) return esc(name);
    var i = norm(name).indexOf(q);
    return i < 0 ? esc(name) : esc(name.slice(0, i)) + '<mark>' + esc(name.slice(i, i + q.length)) + '</mark>' + esc(name.slice(i + q.length));
  }
  function word(n) { var a = n % 10, b = n % 100; return n + ' ' + (a === 1 && b !== 11 ? 'услуга' : a >= 2 && a <= 4 && (b < 12 || b > 14) ? 'услуги' : 'услуг'); }
  var BOOK = '${BOOK}';
  var CLOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
  function full(src) { return src.replace('svc/', 'svc-full/'); }
  function meta(s) {
    var out = '';
    if (s.t) out += '<span>' + CLOCK + esc(s.t) + '</span>';
    if (s.d) out += '<span>' + esc(s.d) + '</span>';
    return out ? '<span class="svc__meta">' + out + '</span>' : '';
  }
  function card(s, c, q) {
    return '<li class="svc"><span class="svc__img"><img src="assets/img/' + (s.i || BANNER[c.id]) + '" alt="" width="72" height="72" loading="lazy" decoding="async"></span>' +
      '<span class="svc__name">' + mark(s.n, q) + '</span>' + meta(s) +
      '<span class="svc__side"><span class="svc__price">' + s.p + '</span><a class="svc__go" href="' + BOOK + '" target="_blank" rel="noopener" aria-label="Записаться: ' + esc(s.n) + '">' + ARROW + '</a></span></li>';
  }
  function group(img, list, c, q) {
    var big = SMALL.indexOf(full(img)) >= 0 ? BANNER[c.id] : full(img);
    var wh = GS[big] || [4, 5], r = wh[0] / wh[1], wide = r > 1.6;
    var ratio = wide ? 1.4 : Math.max(0.8, Math.min(1.5, r));
    return '<li class="svc-group"><div class="glow svc-group__photo' + (wide ? ' svc-group__photo--contain' : '') + '" style="aspect-ratio:' + ratio.toFixed(3) + '"><img src="assets/img/' + big + '" alt="" loading="lazy" decoding="async"><span class="svc-group__tag">' + word(list.length) + '</span></div>' +
      '<ul class="svc-group__list">' + list.map(function (s) {
        return '<li class="svc-row"><span class="svc__name">' + mark(s.n, q) + '</span>' + meta(s) + '<span class="svc__price">' + s.p + '</span></li>';
      }).join('') + '</ul></li>';
  }
  function render(q) {
    var html = '', found = 0;
    data.forEach(function (c) {
      var items = c.items.filter(function (s) { return !q || norm(s.n + ' ' + c.title).indexOf(q) >= 0; });
      if (!items.length) return;
      found += items.length;
      // услуги с одинаковым фото (3 и больше) показываем одним блоком: большое фото + список
      var byImg = {};
      items.forEach(function (s) { if (s.i) (byImg[s.i] = byImg[s.i] || []).push(s); });
      var done = {}, body = '';
      items.forEach(function (s) {
        var g = s.i && byImg[s.i];
        if (g && g.length >= 3) { if (!done[s.i]) { done[s.i] = 1; body += group(s.i, g, c, q); } }
        else body += card(s, c, q);
      });
      html += '<section class="svc-cat" id="' + c.id + '"><div class="svc-cat__banner"><div class="svc-cat__text"><span class="svc-cat__count">' + word(items.length) + '</span><h2 class="h2">' + c.title + '</h2>' + (c.note ? '<p>' + esc(c.note) + '</p>' : '') + '</div><div class="svc-cat__photo"><img src="assets/img/' + BANNER[c.id] + '" alt="" loading="lazy" decoding="async"></div></div><ul class="svc-list">' + body + '</ul></section>';
    });
    root.innerHTML = found ? html : '<div class="svc-empty"><p class="h3">Ничего не нашлось</p><p>Попробуйте другое слово или спросите администратора: <a href="${TEL}">${PHONE}</a></p></div>';
    chips.forEach(function (ch) { ch.hidden = !!q && !document.getElementById(ch.dataset.cat); });
    observe();
  }
  var io, current = '';
  function observe() {
    current = '';
    if (io) io.disconnect();
    if (!('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting || en.target.id === current) return;
        current = en.target.id;
        chips.forEach(function (ch) {
          var on = ch.dataset.cat === en.target.id;
          ch.classList.toggle('is-active', on);
          if (on) { var bar = ch.parentElement; bar.scrollTo({ left: ch.offsetLeft - bar.clientWidth / 2 + ch.offsetWidth / 2, behavior: 'smooth' }); }
        });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    root.querySelectorAll('.svc-cat').forEach(function (s) { io.observe(s); });
  }
  var t;
  input.addEventListener('input', function () {
    search.classList.toggle('has-value', !!input.value);
    clearTimeout(t);
    t = setTimeout(function () { render(norm(input.value.trim())); }, 120);
  });
  search.querySelector('.search__clear').addEventListener('click', function () { input.value = ''; search.classList.remove('has-value'); render(''); input.focus(); });
  render('');
  if (location.hash) { var el = document.getElementById(location.hash.slice(1)); el && setTimeout(function () { el.scrollIntoView(); }, 60); }
})();
</script>`;

// ---------- Работы ----------
const WORKS = [
  ['hair', 'Волосы', ['Светлое каре', 'Каре после окрашивания', 'Высокая вечерняя причёска', 'Мелирование на средние волосы', 'Скрытое окрашивание в красный', 'Короткая стрижка с ярким окрашиванием', 'Осветление: до и после', 'Короткая стрижка, пепельный блонд', 'Длинные волосы после тонирования', 'Собранная причёска']],
  ['nails', 'Ногти', ['Нюдовый маникюр', 'Красный маникюр с рисунком', 'Маникюр с синей росписью', 'Маникюр с цветочной росписью', 'Розовый френч', 'Маникюр с блёстками', 'Маникюр в горошек', 'Бордовый маникюр', 'Оливковый маникюр', 'Педикюр, тёмно-зелёный лак']],
  ['piercing', 'Пирсинг', ['Проколы в хрящике и мочке', 'Несколько проколов в ухе', 'Хеликс и мочка', 'Проколы по краю уха', 'Прокол конча', 'Хеликс и две мочки', 'Серьги в мочке', 'Серьги-гвоздики в мочке', 'Две серьги в мочке', 'Несколько проколов с серьгами']],
  ['brows', 'Брови и ресницы', ['Ресницы: до и после ламинирования', 'Ламинирование ресниц в процессе', 'Брови: до и после', 'Ресницы после ламинирования', 'Брови после оформления']],
];
const raboty = pageHero('Работы', 'Наши <em>работы</em>', 'Фото работ мастеров, снятые в салоне.', 'works/hair-09.jpg') + `
<section class="section section--glow" style="padding-top:48px">
  <div class="wrap">
    <div class="tabs" role="tablist" aria-label="Категории работ">
      ${WORKS.map(([id, t, alts], i) => `<button class="chip" role="tab" id="tab-${id}" aria-controls="panel-${id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${t} <small>${alts.length}</small></button>`).join('')}
    </div>
    ${WORKS.map(([id, t, alts], i) => `<div role="tabpanel" id="panel-${id}" aria-labelledby="tab-${id}"${i ? ' hidden' : ''}><ul class="gallery">${alts.map((a, k) => `<li style="--i:${k}"><button class="glow" type="button" aria-label="Открыть фото: ${a}">${img(`works/${id}-${String(k + 1).padStart(2, '0')}.jpg`, a)}</button></li>`).join('')}</ul></div>`).join('\n    ')}
  </div>
</section>
<dialog class="lightbox" aria-label="Просмотр фото">
  <img class="lightbox__img" alt="">
  <button class="lightbox__btn lightbox__close" type="button" aria-label="Закрыть">${I.close}</button>
  <button class="lightbox__btn lightbox__prev" type="button" aria-label="Предыдущее фото">${I.left}</button>
  <button class="lightbox__btn lightbox__next" type="button" aria-label="Следующее фото">${I.right}</button>
  <span class="lightbox__count" aria-live="polite"></span>
</dialog>`;

const rabotyScript = `<script>
(function () {
  var tabs = [].slice.call(document.querySelectorAll('[role=tab]'));
  function select(tab) {
    tabs.forEach(function (t) {
      var on = t === tab;
      t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { select(t); });
    t.addEventListener('keydown', function (e) {
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!d) return;
      var n = tabs[(i + d + tabs.length) % tabs.length]; n.focus(); select(n);
    });
  });
  var box = document.querySelector('.lightbox'), big = box.querySelector('.lightbox__img'), cnt = box.querySelector('.lightbox__count');
  var list = [], pos = 0, opener;
  function show(i) {
    pos = (i + list.length) % list.length;
    var im = list[pos];
    big.src = im.src; big.alt = im.alt;
    big.style.animation = 'none'; big.offsetHeight; big.style.animation = '';
    cnt.textContent = (pos + 1) + ' из ' + list.length;
  }
  document.querySelectorAll('.gallery button').forEach(function (b) {
    b.addEventListener('click', function () {
      opener = b;
      list = [].slice.call(b.closest('.gallery').querySelectorAll('img'));
      show(list.indexOf(b.querySelector('img')));
      box.showModal();
    });
  });
  box.querySelector('.lightbox__close').addEventListener('click', function () { box.close(); });
  box.querySelector('.lightbox__prev').addEventListener('click', function () { show(pos - 1); });
  box.querySelector('.lightbox__next').addEventListener('click', function () { show(pos + 1); });
  box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
  box.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') show(pos + 1); if (e.key === 'ArrowLeft') show(pos - 1); });
  box.addEventListener('close', function () { opener && opener.focus(); });
  var sx = 0;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) show(pos + (dx < 0 ? 1 : -1)); });
})();
</script>`;

// ---------- Салон ----------
const SALON = [
  ['salon-01.jpg', 'Кабинет косметолога с логотипом Люмен'], ['salon-02.jpg', 'Аппарат для микротоковой терапии'], ['salon-03.jpg', 'Мойка для волос с креслом'],
  ['salon-04.jpg', 'Кабинет косметолога'], ['salon-05.jpg', 'Место мастера маникюра с лампой'], ['salon-06.jpg', 'Стеллаж с уходовой косметикой'],
  ['salon-07.jpg', 'Столы для маникюра'], ['salon-08.jpg', 'Полки с лаками'], ['salon-09.jpg', 'Кресло для процедур'],
  ['salon-10.jpg', 'Вход в салон с улицы'], ['salon-11.jpg', 'Расходные материалы в стеклянных банках'], ['salon-12.jpg', 'Профессиональная косметика для волос'],
];
const salon = pageHero('Салон', 'Наш <em>салон</em>', 'Троицк, Городская улица, 20. Светлые залы, отдельный кабинет косметолога, мойка для волос и места для маникюра.', 'salon/salon-01.jpg') + `
<section class="section section--glow" style="padding-top:48px">
  <div class="wrap masonry">
    ${SALON.map(([s, a], i) => `<div class="glow" data-reveal style="--i:${i % 3}">${img('salon/' + s, a)}</div>`).join('\n    ')}
  </div>
</section>
<section class="section section--oat">
  <div class="wrap two-col">
    <div data-reveal>
      <p class="kicker">внутри</p>
      <h2 class="h2">Что есть <em>в салоне</em></h2>
      <p class="lead" style="margin-top:18px">Всё, что нужно, чтобы спокойно провести у нас пару часов.</p>
    </div>
    <ul class="feature-list" data-reveal style="--i:1">
      <li><b>Кабинет косметолога</b><span>Отдельная комната с кушеткой и аппаратами для ухода.</span></li>
      <li><b>Зона для волос</b><span>Кресла мастеров и мойка с креслом для головы.</span></li>
      <li><b>Маникюр и педикюр</b><span>Места мастеров с лампами и удобное кресло для педикюра.</span></li>
      <li><b>Для гостей</b><span>Парковка рядом с домом, оплата картой, Wi‑Fi.</span></li>
    </ul>
  </div>
</section>
<section class="section section--moss">
  <div class="wrap two-col">
    <div data-reveal><p class="kicker">косметика</p><h2 class="h2">С чем мы <em>работаем</em></h2></div>
    <div data-reveal style="--i:1">
      <p class="brands" style="margin-top:0;font-size:20px"><span>DAVINES</span><span>LEBEL</span><span>REVLON</span><span>JANSSEN</span><span>JULIETTE ARMAND</span><span>MEDIC CONTROL PEEL</span><span>CIMEL</span><span>LVL</span><span>STUDEX</span></p>
      <a class="link-arrow" href="uslugi.html" style="margin-top:28px">Смотреть услуги ${I.arrow}</a>
    </div>
  </div>
</section>`;

// ---------- Отзывы ----------
const otzyvy = pageHero('Отзывы', 'Отзывы <em>гостей</em>', '', 'works/nails-01.jpg', `<div class="rating-big hero__fade" style="--i:1;margin-top:24px"><span class="rating-big__num">5,0</span><p>${stars}<br>240 отзывов на Яндекс Картах</p></div>`) + `
<section class="section section--glow" style="padding-top:48px">
  <div class="wrap">
    <div class="reviews--all">
      ${REVIEWS.map((r, i) => reviewCard(r, i, true)).join('\n      ')}
    </div>
    <p style="margin-top:32px"><a class="link-arrow" href="${REVIEWS_URL}" target="_blank" rel="noopener">Все отзывы на Яндекс Картах ${I.arrow}</a></p>
  </div>
</section>`;

// ---------- Контакты ----------
const kontakty = pageHero('Контакты', 'Как нас <em>найти</em>', `${ADDRESS}. ${HOURS}.`, 'salon/salon-10.jpg') + `
<section class="section section--glow" style="padding-top:48px">
  <div class="wrap two-col">
    <div>
      <ul class="contact-list">
        <li><span>Адрес</span><p>${ADDRESS}</p></li>
        <li><span>Часы</span><p>${HOURS}</p></li>
        <li><span>Телефон</span><a href="${TEL}">${PHONE}</a></li>
        <li><span>WhatsApp</span><a href="${WA}" target="_blank" rel="noopener">Написать</a></li>
        <li><span>Telegram</span><a href="${TG}" target="_blank" rel="noopener">Канал салона</a></li>
        <li><span>ВКонтакте</span><a href="${VK}" target="_blank" rel="noopener">vk.ru/Lumensalon</a></li>
      </ul>
      <div class="hero__actions">
        <a class="btn btn--gold" href="${BOOK}" target="_blank" rel="noopener">Записаться онлайн ${I.arrow}</a>
        <a class="btn btn--line" href="${MAPS}" target="_blank" rel="noopener">Построить маршрут</a>
      </div>
    </div>
    <div class="map" data-reveal>
      <iframe src="https://yandex.ru/map-widget/v1/?ll=37.315527%2C55.492158&amp;z=17&amp;mode=search&amp;oid=181692772645&amp;ol=biz" title="Люмен на Яндекс Картах" loading="lazy" allowfullscreen></iframe>
    </div>
  </div>
</section>`;


// ---------- Варианты первого экрана (страница для выбора, в меню не входит) ----------
const heroText = (align) => `
    <p class="kicker hero__fade" style="--i:0">Салон красоты в Троицке</p>
    <h1 class="h1"><span class="hero__line"><span style="--i:0">Сияй</span></span><span class="hero__line"><span style="--i:1">как <em>солнце</em></span></span></h1>
    <p class="lead hero__fade" style="--i:1;margin-top:24px">Стрижки и окрашивание, маникюр и педикюр, косметология, брови и ресницы, эпиляция и пирсинг в одном салоне на Городской, 20.</p>
    <div class="hero__actions hero__fade" style="--i:2">
      <a class="btn btn--gold" href="${BOOK}" target="_blank" rel="noopener">Записаться онлайн ${I.arrow}</a>
      <a class="btn btn--line" href="uslugi.html">Услуги и цены</a>
    </div>
    <a class="hero__rating hero__fade" style="--i:3" href="${REVIEWS_URL}" target="_blank" rel="noopener">${stars}<span><b>5,0</b> на Яндекс Картах · 240 отзывов</span></a>`;
const sunSvg = `<div class="sun" aria-hidden="true"><svg viewBox="0 0 200 200"><g class="sun__spin"><circle class="sun__ring" cx="100" cy="100" r="96" pathLength="1"/><path class="sun__rays" d="${sunRays}" pathLength="1"/></g></svg></div>`;
const varianty = `
<section class="hv hv1" id="v1" aria-label="Вариант 1">
  <div class="hv1__media" data-parallax="0.12">${img('works/hair-09.jpg', 'Длинные волосы после тонирования в салоне Люмен').replace(' loading="lazy"', ' fetchpriority="high"')}</div>
  <div class="hv1__shade"></div>
  ${sunSvg}
  <div class="wrap hero__inner">${heroText()}</div>
</section>
<section class="hv hv2" id="v2" aria-label="Вариант 2" hidden>
  ${sunSvg}
  <div class="hv2__ph hv2__ph--1">${glow('works/nails-04.jpg', 'Маникюр с цветочной росписью')}</div>
  <div class="hv2__ph hv2__ph--2">${glow('works/hair-01.jpg', 'Светлое каре')}</div>
  <div class="hv2__ph hv2__ph--3">${glow('works/piercing-02.jpg', 'Несколько проколов в ухе')}</div>
  <div class="hv2__ph hv2__ph--4">${glow('works/brows-04.jpg', 'Ресницы после ламинирования')}</div>
  <div class="hv2__center">${heroText()}</div>
</section>
<section class="hv hv3" id="v3" aria-label="Вариант 3" hidden>
  <div class="hv3__media" data-parallax="0.12">${img('salon/salon-01.jpg', 'Кабинет косметолога в салоне Люмен')}</div>
  <div class="hv3__card">${heroText()}</div>
</section>
<div class="hv-switch" role="group" aria-label="Варианты первого экрана">
  <button type="button" aria-pressed="true" data-v="v1">1 · Фото работы</button>
  <button type="button" aria-pressed="false" data-v="v2">2 · Типографика</button>
  <button type="button" aria-pressed="false" data-v="v3">3 · Интерьер</button>
</div>`;
const variantyScript = `<script>
document.querySelectorAll('.hv-switch button').forEach(function (b) {
  b.addEventListener('click', function () {
    document.querySelectorAll('.hv-switch button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    document.querySelectorAll('.hv').forEach(function (s) { s.hidden = s.id !== b.dataset.v; });
    window.scrollTo(0, 0);
  });
});
</script>`;

const PAGES = [
  ['index.html', 'Люмен · салон красоты в Троицке', 'Салон красоты Люмен в Троицке: волосы, ногти, косметология, брови и ресницы, эпиляция, пирсинг. Городская ул., 20. Ежедневно 9:00–21:00.', home, ''],
  ['uslugi.html', 'Услуги и цены · Люмен, Троицк', `Прайс салона Люмен: ${total} услуг. Стрижки, окрашивание, маникюр, педикюр, косметология, эпиляция, пирсинг.`, uslugi, uslugiScript],
  ['raboty.html', 'Работы мастеров · Люмен, Троицк', 'Фото работ мастеров салона Люмен: окрашивание, стрижки, маникюр, пирсинг, брови и ресницы.', raboty, rabotyScript],
  ['salon.html', 'Салон · Люмен, Троицк', 'Как выглядит салон Люмен на Городской улице, 20 в Троицке.', salon, ''],
  ['otzyvy.html', 'Отзывы · Люмен, Троицк', 'Отзывы гостей салона Люмен. Рейтинг 5,0 на Яндекс Картах, 240 отзывов.', otzyvy, ''],
  ['kontakty.html', 'Контакты · Люмен, Троицк', `Салон Люмен: ${ADDRESS}. ${HOURS}. ${PHONE}.`, kontakty, ''],
];
for (const [file, title, description, body, scripts] of PAGES) {
  fs.writeFileSync(path.join(ROOT, file), layout({ file, title, description, body, scripts, bodyClass: file === 'index.html' ? 'hero-light' : '' }));
}
fs.writeFileSync(path.join(ROOT, 'varianty.html'), layout({ file: 'varianty.html', title: 'Варианты первого экрана · Люмен', description: 'Выбор первого экрана', body: varianty, scripts: variantyScript, bodyClass: 'hero-light' }).replace('<meta name="description"', '<meta name="robots" content="noindex">\n<meta name="description"'));
console.log('ok', PAGES.length, 'pages,', total, 'services');
