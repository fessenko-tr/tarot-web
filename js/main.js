// Nav scroll class
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
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
