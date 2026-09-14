// ==========================================================================
// CrystalCool - main.js (vanilla JS, no dependencies, kept lightweight)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // === PRELOADER ===
  const preloader = document.querySelector('.preloader');
  const hidePreloader = () => preloader && preloader.classList.add('hide');
  if (document.readyState === 'complete') {
    setTimeout(hidePreloader, 300);
  } else {
    window.addEventListener('load', () => setTimeout(hidePreloader, 300));
  }
  // Safety net: never trap a user behind the preloader
  setTimeout(hidePreloader, 3000);

  // === NAVBAR SCROLL STATE ===
  const navbar = document.querySelector('.navbar');
  const onScrollNav = () => {
    if (!navbar) return;
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  };
  onScrollNav();
  window.addEventListener('scroll', onScrollNav, { passive: true });

  // === MOBILE MENU ===
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  // === HERO ENTRANCE ANIMATION ===
  document.querySelectorAll('.hero-content > *').forEach((el, i) => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px)';
    setTimeout(() => {
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }, 200 + i * 130);
  });

  // === 3D SCROLL REVEAL (cards, sections) ===
  const revealTargets = document.querySelectorAll('.reveal-3d, .reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealTargets.forEach((el, i) => {
    el.style.setProperty('--i', i % 8);
    revealObserver.observe(el);
  });

  // === HERO PARALLAX (subtle 3D depth on scroll) ===
  const heroMedia = document.querySelector('.hero-media');
  if (heroMedia) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight * 1.2) {
        heroMedia.style.transform = `translateY(${y * 0.28}px) scale(${1 + y * 0.0003})`;
      }
    }, { passive: true });
  }

  // === ANIMATED COUNTERS ===
  const counters = document.querySelectorAll('.num[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const duration = 1400;
      const start = performance.now();
      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target % 1 === 0 ? Math.floor(eased * target) : (eased * target).toFixed(1);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  // === BACK TO TOP ===
  const toTop = document.querySelector('.to-top');
  if (toTop) {
    window.addEventListener('scroll', () => {
      toTop.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  // === DATA-SAVER AWARE HERO VIDEO ===
  // On slow connections or when the visitor has Data Saver on, skip autoplay video
  // and keep the poster image only. This keeps the site fast and light on mobile data.
  const heroVideo = document.querySelector('.hero video');
  if (heroVideo) {
    const conn = navigator.connection || navigator.webkitConnection || navigator.mozConnection;
    const slow = conn && (conn.saveData || /2g/.test(conn.effectiveType || ''));
    if (slow) {
      heroVideo.remove();
    } else {
      heroVideo.play().catch(() => {});
    }
  }

  // === FOOTER YEAR ===
  const yearEl = document.querySelector('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // === CONTACT FORM -> WHATSAPP HANDOFF ===
  const form = document.querySelector('#quote-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || '';
      const business = data.get('business') || '';
      const phone = data.get('phone') || '';
      const iceType = data.get('ice_type') || '';
      const quantity = data.get('quantity') || '';
      const message = data.get('message') || '';

      const text = `Hello CrystalCool, I would like to request ice supply.%0A%0A`
        + `Name: ${encodeURIComponent(name)}%0A`
        + `Business: ${encodeURIComponent(business)}%0A`
        + `Phone: ${encodeURIComponent(phone)}%0A`
        + `Ice type needed: ${encodeURIComponent(iceType)}%0A`
        + `Quantity: ${encodeURIComponent(quantity)}%0A`
        + `Message: ${encodeURIComponent(message)}`;

      const waNumber = '2348000000000'; // TODO: replace with real WhatsApp business number
      window.open(`https://wa.me/${waNumber}?text=${text}`, '_blank');

      const successEl = document.querySelector('.form-success');
      if (successEl) successEl.classList.add('show');
      form.reset();
    });
  }

});
