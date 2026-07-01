/**
 * Abdul Majeed — SEO Specialist Portfolio
 * main.js — Navigation, Animations, Form Handler
 */

'use strict';

// ── DOM Ready ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initScrollAnimations();
  initSmoothScroll();
  initContactForm();
  initCounters();
});

// ── 1. Navigation ──────────────────────────────────────────
function initNav() {
  const header     = document.getElementById('header');
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileNav  = document.getElementById('nav-mobile');
  const closeBtn   = document.getElementById('nav-mobile-close');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];
  const navLinks    = document.querySelectorAll('.nav-links a');

  // ── Header scroll effect ───────────────────────────────
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (header) {
          header.classList.toggle('scrolled', window.scrollY > 40);
        }
        updateActiveNavLink();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Hamburger toggle ───────────────────────────────────
  function openMobileNav() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    mobileNav.querySelector('a')?.focus();
  }

  function closeMobileNav() {
    if (!mobileNav || !hamburger) return;
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.contains('open');
    isOpen ? closeMobileNav() : openMobileNav();
  });

  closeBtn?.addEventListener('click', closeMobileNav);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
      closeMobileNav();
    }
  });

  // ── Active nav link on scroll ──────────────────────────
  function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  updateActiveNavLink();
}

// ── 2. Smooth Scroll ───────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// ── 3. Scroll Animations (Intersection Observer) ───────────
function initScrollAnimations() {
  // Hero section animates immediately
  const heroElements = document.querySelectorAll('#hero .fade-up, #hero .fade-in, #hero .slide-left, #hero .slide-right');
  heroElements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('visible');
    }, i * 150);
  });

  // All other animated elements trigger on scroll
  const animatedEls = document.querySelectorAll(
    '.fade-up:not(#hero *), .fade-in:not(#hero *), .slide-left:not(#hero *), .slide-right:not(#hero *)'
  );

  if (!animatedEls.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -60px 0px'
  });

  animatedEls.forEach(el => observer.observe(el));
}

// ── 4. Animated Counters ───────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const startTime = performance.now();

        function update(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }

        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

// ── 5. Contact Form ────────────────────────────────────────
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submitBtn = form?.querySelector('.btn-submit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(el => el.remove());
    form.querySelectorAll('.form-control').forEach(el => el.classList.remove('error'));

    // Validate
    const errors = validateForm(form);
    if (errors.length) {
      errors.forEach(({ field, message }) => {
        const input = form.querySelector(`[name="${field}"]`);
        if (!input) return;
        input.classList.add('error');
        const errEl = document.createElement('span');
        errEl.className = 'form-error';
        errEl.setAttribute('role', 'alert');
        errEl.textContent = message;
        input.parentNode.appendChild(errEl);
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', `error-${field}`);
        errEl.id = `error-${field}`;
      });
      form.querySelector('.form-control.error')?.focus();
      return;
    }

    // Simulate submission
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
    }

    await new Promise(r => setTimeout(r, 1200));

    // Show success
    form.style.display = 'none';
    if (success) {
      success.classList.add('show');
      success.focus();
    }
  });
}

function validateForm(form) {
  const errors = [];
  const name    = form.querySelector('[name="name"]');
  const email   = form.querySelector('[name="email"]');
  const website = form.querySelector('[name="website"]');
  const service = form.querySelector('[name="service"]');
  const message = form.querySelector('[name="message"]');

  if (!name?.value.trim())  errors.push({ field: 'name',  message: 'Please enter your name.' });
  if (!email?.value.trim()) {
    errors.push({ field: 'email', message: 'Please enter your email address.' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    errors.push({ field: 'email', message: 'Please enter a valid email address.' });
  }
  if (website?.value.trim() && !/^https?:\/\/.+\..+/.test(website.value.trim())) {
    errors.push({ field: 'website', message: 'Please enter a valid URL (e.g. https://example.com).' });
  }
  if (!service?.value) errors.push({ field: 'service', message: 'Please select a service.' });
  if (!message?.value.trim()) errors.push({ field: 'message', message: 'Please enter a message.' });

  return errors;
}

// ── Error styles (injected once) ──────────────────────────
(function injectErrorStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .form-control.error {
      border-color: #EF4444;
      box-shadow: 0 0 0 3px rgba(239,68,68,0.12);
    }
    .form-error {
      display: block;
      color: #EF4444;
      font-size: 0.8125rem;
      font-weight: 500;
      margin-top: 0.375rem;
    }
  `;
  document.head.appendChild(style);
})();
