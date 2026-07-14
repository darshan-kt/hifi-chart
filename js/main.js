/* ====================================
   main.js – Global interactions
   ==================================== */

// ── Page Transition ──────────────────
const transition = document.querySelector('.page-transition');

function navigateTo(url) {
  if (transition) {
    transition.classList.add('entering');
    setTimeout(() => {
      window.location.href = url;
    }, 400);
  } else {
    window.location.href = url;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Animate page in
  if (transition) {
    transition.classList.add('leaving');
    setTimeout(() => transition.classList.remove('leaving'), 500);
  }

  initNavbar();
  initScrollReveal();
  initFAB();
  initChatWidget();
  initCounters();
  initDemoForms();
  setActiveNavLink();
});

// ── Demo Forms ────────────────────────
// Forms with a data-success attribute show an inline confirmation
// instead of posting anywhere (this site has no backend).
function initDemoForms() {
  document.querySelectorAll('form[data-success]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let note = form.querySelector('.form-success');
      if (!note) {
        note = document.createElement('p');
        note.className = 'form-success';
        note.setAttribute('role', 'status');
        form.appendChild(note);
      }
      note.textContent = form.dataset.success;
      form.reset();
      note.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}

// ── Navbar ────────────────────────────
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobile-nav');

  if (!navbar) return;

  // Scroll effect
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Intercept nav links for transitions
  document.querySelectorAll('a[data-nav]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('mailto') && !href.startsWith('tel')) {
        e.preventDefault();
        navigateTo(href);
      }
    });
  });
}

function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ── Scroll Reveal ─────────────────────
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .stagger').forEach(el => {
    observer.observe(el);
  });
}

// ── Floating Action Button ─────────────
function initFAB() {
  const fab = document.querySelector('.fab-order');
  if (!fab) return;

  window.addEventListener('scroll', () => {
    fab.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
}

// ── Chat Widget ───────────────────────
function initChatWidget() {
  const widgetBtn = document.getElementById('chat-widget-btn');
  const chatPopup = document.getElementById('chat-popup');
  if (!widgetBtn || !chatPopup) return;

  let isOpen = false;
  widgetBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    chatPopup.classList.toggle('open', isOpen);
    widgetBtn.style.transform = isOpen ? 'scale(1.1) rotate(-15deg)' : '';
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!widgetBtn.contains(e.target) && !chatPopup.contains(e.target)) {
      isOpen = false;
      chatPopup.classList.remove('open');
      widgetBtn.style.transform = '';
    }
  });
}

// ── Animated Counters ─────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const duration = 2000;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(eased * target).toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

// ── Smooth anchor scroll ──────────────
document.addEventListener('click', (e) => {
  const anchor = e.target.closest('a[href^="#"]');
  if (!anchor) return;
  const target = document.querySelector(anchor.getAttribute('href'));
  if (target) {
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
});
