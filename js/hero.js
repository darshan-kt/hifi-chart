/* ====================================
   hero.js – Hero slideshow & parallax
   ==================================== */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlider();
  initParallax();
  initTypewriter();
});

// ── Hero Slideshow ─────────────────────
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  const prevBtn = document.getElementById('hero-prev');
  const nextBtn = document.getElementById('hero-next');

  if (!slides.length) return;

  let current = 0;
  let timer;
  const INTERVAL = 5000;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    updateSlideContent(current);
  }

  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  function startTimer() {
    clearInterval(timer);
    timer = setInterval(next, INTERVAL);
  }

  function updateSlideContent(idx) {
    // Trigger re-animation of hero text
    const content = document.querySelector('.hero-content');
    if (content) {
      content.style.animation = 'none';
      content.offsetHeight; // reflow
      content.style.animation = '';
    }
  }

  prevBtn?.addEventListener('click', () => { prev(); startTimer(); });
  nextBtn?.addEventListener('click', () => { next(); startTimer(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); startTimer(); });
  });

  // Touch / swipe
  let touchStartX = 0;
  const heroSection = document.querySelector('.hero-section');
  heroSection?.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  heroSection?.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? next() : prev(); startTimer(); }
  });

  // Init
  slides[0]?.classList.add('active');
  dots[0]?.classList.add('active');
  startTimer();
}

// ── Parallax ──────────────────────────
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const offset = scrollY * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });
}

// ── Typewriter ────────────────────────
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = ['Burgers', 'Wraps', 'Bowls', 'Fries', 'Shakes', 'Good Times'];
  let wordIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const word = words[wordIdx];
    if (!isDeleting) {
      el.textContent = word.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        isDeleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      el.textContent = word.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        wordIdx = (wordIdx + 1) % words.length;
      }
    }
    setTimeout(type, isDeleting ? 60 : 100);
  }

  setTimeout(type, 800);
}
