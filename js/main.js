// Inline logo SVGs so CSS hover animation works across the DOM
(async function () {
  try {
    const res = await fetch('brand_assets/Logo.svg');
    const src = await res.text();
    let n = 0;
    function spawnLogoSparks(wrap) {
      const w = wrap.offsetWidth;
      const h = wrap.offsetHeight;
      const purples = ['#D4B5FF', '#E0CAFB', '#C4A0F8'];
      const golds   = ['#F2C94C', '#FFDF2A'];
      // [card x-center fraction, spawn window start ms, spawn window end ms]
      const bands = [[0.33, 0, 650], [0.50, 800, 1450], [0.67, 1600, 2250]];
      const perCard = 8;
      bands.forEach(([cx, t0, t1]) => {
        for (let i = 0; i < perCard; i++) {
          const at = t0 + (i / perCard) * (t1 - t0) + Math.random() * ((t1 - t0) / perCard * 0.5);
          setTimeout(() => {
            const el  = document.createElement('span');
            el.className = 'logo-spark';
            const x   = w * (cx + (Math.random() - 0.5) * 0.30);
            const y   = h * (0.36 + Math.random() * 0.56);
            // bimodal sizes: fine dust (60 %) vs hero star (40 %)
            const isHero = Math.random() > 0.60;
            const sz  = isHero
              ? h * (0.12 + Math.random() * 0.10)   // hero:  12–22 % of h
              : h * (0.04 + Math.random() * 0.07);  // dust:   4–11 % of h
            const pal = Math.random() > 0.35 ? purples : golds;
            const col = pal[Math.floor(Math.random() * pal.length)];
            const dur = (isHero ? 1100 : 850) + Math.random() * 700;
            const dx  = (Math.random() - 0.5) * w * 0.36;
            const dy  = -(h * (0.38 + Math.random() * 0.55));
            const rot = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 100);
            el.style.cssText = `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;color:${col};--s-dur:${dur}ms;--s-dx:${dx}px;--s-dy:${dy}px;--s-rot:${rot}deg;`;
            wrap.appendChild(el);
            setTimeout(() => el.remove(), dur + 100);
          }, at);
        }
      });
    }

    document.querySelectorAll('img[data-logo]').forEach(img => {
      const uid = `lf${n++}`;
      const svg = src
        .replace(/\bid="(filter[^"]+)"/g, `id="${uid}$1"`)
        .replace(/url\(#(filter[^)]+)\)/g, `url(#${uid}$1)`);
      const wrap = document.createElement('span');
      wrap.className = 'logo-wrap ' + img.className;
      wrap.innerHTML = svg;
      wrap.addEventListener('mouseenter', () => {
        if (wrap.dataset.logoPlaying) return;
        wrap.dataset.logoPlaying = '1';
        const lift = Math.round(wrap.offsetHeight * 0.16);
        wrap.style.setProperty('--logo-lift', `-${lift}px`);

        // logo-cr is drawn before the final arc letters in the SVG, so those
        // letters paint on top of it when it lifts. Move it to the end of the
        // SVG's draw order so it always renders above the text during animation.
        const svgEl   = wrap.querySelector('svg');
        const cr      = svgEl.querySelector('.logo-cr');
        const defs    = svgEl.querySelector('defs');
        const crAfter = cr.nextSibling; // remember original position
        svgEl.insertBefore(cr, defs);

        wrap.classList.add('logo-anim-active');
        spawnLogoSparks(wrap);
        setTimeout(() => {
          wrap.classList.remove('logo-anim-active');
          svgEl.insertBefore(cr, crAfter); // restore original paint order
          delete wrap.dataset.logoPlaying;
        }, 2500);
      });
      img.replaceWith(wrap);
    });
  } catch (_) {}
})();

// Nav scroll class
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Active nav link tracking
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

function setActiveLink(id) {
  navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
  mobileNavLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + id));
}

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) setActiveLink(e.target.id); });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => sectionObserver.observe(s));

// Star hamburger menu
const navToggle   = document.getElementById('nav-toggle');
const mobileMenu  = document.getElementById('mobile-menu');

function openMenu() {
  navToggle.classList.add('open');
  mobileMenu.classList.add('open');
  navToggle.setAttribute('aria-expanded', 'true');
  mobileMenu.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  navToggle.classList.remove('open');
  mobileMenu.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  mobileMenu.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

navToggle.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});

// Close on nav link click
mobileMenu.querySelectorAll('[data-close]').forEach(el => {
  el.addEventListener('click', closeMenu);
});

// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
});

// Close when viewport expands to md (768px)
window.addEventListener('resize', () => {
  if (window.innerWidth >= 768 && mobileMenu.classList.contains('open')) closeMenu();
}, { passive: true });

// Sparkles
const sparkWrap = document.getElementById('sparkles');
function mkSparkle() {
  const el = document.createElement('div');
  el.className = 'spk';
  const size = 2 + Math.random() * 3;
  el.style.cssText = `
    left:${Math.random() * 100}%;
    bottom:-8px;
    width:${size}px;
    height:${size}px;
    animation-duration:${7 + Math.random() * 10}s;
    animation-delay:${Math.random() * 6}s;
    opacity:${0.25 + Math.random() * 0.5};
  `;
  sparkWrap.appendChild(el);
  const totalMs = (parseFloat(el.style.animationDuration) + parseFloat(el.style.animationDelay)) * 1000 + 500;
  setTimeout(() => el.remove(), totalMs);
}
for (let i = 0; i < 22; i++) mkSparkle();
setInterval(mkSparkle, 1100);

// Hero card sparkle animation
(function () {
  const cardWrap = document.querySelector('.hero-card-wrap');
  if (!cardWrap) return;

  function spawnCardSparks(wrap) {
    const w = wrap.offsetWidth;
    const h = wrap.offsetHeight;
    const purples = ['#D4B5FF', '#E0CAFB', '#C4A0F8'];
    const golds   = ['#F2C94C', '#FFDF2A'];
    const total   = 28;
    for (let i = 0; i < total; i++) {
      const at = Math.random() * 1800;
      setTimeout(() => {
        const el = document.createElement('span');
        el.className = 'logo-spark';
        const x = w * (0.08 + Math.random() * 0.84);
        const y = h * (0.10 + Math.random() * 0.75);
        const isHero = Math.random() > 0.60;
        const sz = isHero
          ? h * (0.07 + Math.random() * 0.07)
          : h * (0.022 + Math.random() * 0.04);
        const pal = Math.random() > 0.35 ? purples : golds;
        const col = pal[Math.floor(Math.random() * pal.length)];
        const dur = (isHero ? 1100 : 850) + Math.random() * 700;
        const dx  = (Math.random() - 0.5) * w * 0.55;
        const dy  = -(h * (0.22 + Math.random() * 0.50));
        const rot = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 100);
        el.style.cssText = `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;color:${col};--s-dur:${dur}ms;--s-dx:${dx}px;--s-dy:${dy}px;--s-rot:${rot}deg;`;
        wrap.appendChild(el);
        setTimeout(() => el.remove(), dur + 100);
      }, at);
    }
  }

  cardWrap.addEventListener('mouseenter', () => {
    if (cardWrap.dataset.cardPlaying) return;
    cardWrap.dataset.cardPlaying = '1';
    spawnCardSparks(cardWrap);
    setTimeout(() => delete cardWrap.dataset.cardPlaying, 2000);
  });
})();

// Scroll reveal
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  });
}, { threshold: 0.10 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Carousel
const ct    = document.getElementById('ct');
const cards = ct.querySelectorAll('.rcard');
const dotsEl = document.getElementById('cdots');
let cur = 0;

function visCount() { return window.innerWidth >= 900 ? 3 : window.innerWidth >= 600 ? 2 : 1; }
function maxCur()   { return Math.max(0, cards.length - visCount()); }

function setCardWidths() {
  const vc  = visCount();
  const gap = 20;
  const containerW = document.getElementById('cv').offsetWidth;
  const w = Math.floor((containerW - (vc - 1) * gap) / vc);
  cards.forEach(c => { c.style.width = w + 'px'; c.style.minWidth = w + 'px'; });
}

function buildDots() {
  dotsEl.innerHTML = '';
  const max = maxCur();
  for (let i = 0; i <= max; i++) {
    const b = document.createElement('button');
    b.style.cssText = `height:8px;border-radius:4px;border:none;cursor:pointer;transition:width 0.3s ease,background 0.3s ease;`;
    b.setAttribute('aria-label', `Слайд ${i + 1}`);
    b.addEventListener('click', () => goTo(i));
    dotsEl.appendChild(b);
  }
  renderDots();
}

function renderDots() {
  Array.from(dotsEl.children).forEach((b, i) => {
    b.style.width = i === cur ? '20px' : '8px';
    b.style.background = i === cur ? '#8648E8' : '#D9C8FF';
  });
}

function goTo(idx) {
  cur = Math.max(0, Math.min(idx, maxCur()));
  const gap = 20;
  const w   = cards[0].offsetWidth + gap;
  ct.style.transform = `translateX(-${cur * w}px)`;
  renderDots();
}

document.getElementById('cprev').addEventListener('click', () => goTo(cur - 1));
document.getElementById('cnext').addEventListener('click', () => goTo(cur + 1));

let auto = setInterval(() => goTo(cur >= maxCur() ? 0 : cur + 1), 5000);
ct.addEventListener('mouseenter', () => clearInterval(auto));
ct.addEventListener('mouseleave', () => { auto = setInterval(() => goTo(cur >= maxCur() ? 0 : cur + 1), 5000); });

window.addEventListener('resize', () => { setCardWidths(); buildDots(); goTo(0); });
setCardWidths();
buildDots();
