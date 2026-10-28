/**
 * CYBERPULSE ARENA - Main Global Scripts & Motion Engine
 * Motion / Scroll Reveal, Cursor Spotlight Glow, Number Counters,
 * Pure Vector SVGs (Zero Emojis), Navigation & Toast System
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initFaqAccordions();
  initCurrentYear();
  initMotionEngine();
  initMouseSpotlights();
  initStatCounters();
});

/**
 * 1. Motion & Scroll Reveal Observer
 */
function initMotionEngine() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .section-header, .feature-card, .hardware-card, .price-card, .game-card, .tournament-card');

  const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  revealElements.forEach((el, index) => {
    el.classList.add('reveal-on-scroll');
    // Stagger delay for adjacent cards
    const delay = (index % 4) * 0.08;
    el.style.transitionDelay = `${delay}s`;
    revealObserver.observe(el);
  });
}

/**
 * 2. Real-Time Mouse Spotlight Glow on Glass Cards
 */
function initMouseSpotlights() {
  const cards = document.querySelectorAll('.glass-card, .hero-card-visual');
  if (!cards.length) return;

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * 3. Animated Numbers / Counters on Scroll
 */
function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-counter');
  if (!statNumbers.length) return;

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetValue = parseInt(el.getAttribute('data-target'), 10);
        const suffix = el.getAttribute('data-suffix') || '';
        animateValue(el, 0, targetValue, 1600, suffix);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  statNumbers.forEach(num => counterObserver.observe(num));
}

function animateValue(element, start, end, duration, suffix = '') {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * (end - start) + start);
    element.textContent = current + suffix;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = end + suffix;
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * 4. Navbar Scroll Effect & Active Page Link
 */
function initNavbar() {
  const header = document.querySelector('.header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * 5. Mobile Menu (Burger)
 */
function initMobileMenu() {
  const burgerBtn = document.querySelector('.burger-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (!burgerBtn || !navMenu) return;

  burgerBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    burgerBtn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burgerBtn.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

/**
 * 6. FAQ Accordion functionality
 */
function initFaqAccordions() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * 7. Toast Notification System (Zero Emojis / Pure Vector SVGs)
 */
function showToast(title, message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  // Clean SVG Icons without emojis
  let svgIcon = '';
  if (type === 'success') {
    svgIcon = `
      <svg class="svg-icon icon-sm" viewBox="0 0 24 24">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>`;
  } else if (type === 'error') {
    svgIcon = `
      <svg class="svg-icon icon-sm" viewBox="0 0 24 24">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>`;
  } else {
    svgIcon = `
      <svg class="svg-icon icon-sm" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>`;
  }

  toast.innerHTML = `
    <div class="toast-icon-wrap">${svgIcon}</div>
    <div class="toast-content">
      <h4>${title}</h4>
      <p>${message}</p>
    </div>
  `;

  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      toast.remove();
    }, 400);
  }, 4500);
}

/**
 * 8. Modal Window Helpers
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.matches('.modal-overlay') || e.target.closest('.modal-close-btn')) {
    const activeModal = document.querySelector('.modal-overlay.active');
    if (activeModal) {
      closeModal(activeModal.id);
    }
  }
});

/**
 * 9. Set current year in footer
 */
function initCurrentYear() {
  const yearSpans = document.querySelectorAll('.current-year');
  const nowYear = new Date().getFullYear();
  yearSpans.forEach(el => el.textContent = nowYear);
}

// Global exposures
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
