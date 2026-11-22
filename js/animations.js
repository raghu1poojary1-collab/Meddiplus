/**
 * MediPulse — Unified Animation & Interaction Engine
 * Features:
 *  1. Lenis Smooth Inertia Scroll (lerp: 0.08, cinematic momentum physics)
 *  2. 3D Scroll Perspective Spline (Cards tilt and settle along scroll timeline 0 to 1)
 *  3. Seamless Page Navigation Transitions (Eliminating white flashes)
 *  4. High-Performance IntersectionObserver Scroll Reveals & Staggers
 *  5. Dynamic Number Counter Animations for Hospital Statistics & Telemetry
 *  6. Top Scroll Progress Indicator driven by scroll timeline
 *  7. Interactive Micro-Haptic Click Feedback & Ripple
 *  8. Floating Back-to-Top Button Controller with smooth inertia glide
 *  9. Full Accessibility (prefers-reduced-motion) Respect
 */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lenisInstance = null;

  /* ==========================================================================
     1. LENIS SMOOTH INERTIA SCROLL (lerp: 0.08) & 3D SCROLL TIMELINE
     ========================================================================== */
  function initLenis() {
    if (isReducedMotion || typeof Lenis === 'undefined') return;

    try {
      lenisInstance = new Lenis({
        lerp: 0.08,             // Exact smooth scroll value from the YouTube reference
        smoothWheel: true,      // Smooth inertia on mouse wheel & trackpad
        wheelMultiplier: 0.95,  // Controlled, elegant speed
        touchMultiplier: 1.2,
        infinite: false,
      });

      // Expose globally for page actions
      window.lenis = lenisInstance;

      // Handle map and modal scroll isolation so maps can be zoomed without whole page jumping
      const preventLenisElements = () => {
        document.querySelectorAll('#leaflet-map, .leaflet-container, .modal-backdrop, .admin-table-container, .search-mode-tabs').forEach(el => {
          el.setAttribute('data-lenis-prevent', '');
        });
      };
      preventLenisElements();
      setTimeout(preventLenisElements, 1000);

      // RAF loop
      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);

      // Scroll-driven 3D Perspective Timeline
      initScrollTimeline3D(lenisInstance);
    } catch (e) {
      console.warn('Lenis smooth scroll initialization skipped:', e);
    }
  }

  /* ==========================================================================
     2. 3D SCROLL PERSPECTIVE TIMELINE (Cards act as 3D planes along camera spline)
     ========================================================================== */
  function initScrollTimeline3D(lenis) {
    const cardSelectors = '.hospital-card, .step-card, .a11y-feature-card, .admin-stat-card';
    const cards = Array.from(document.querySelectorAll(cardSelectors));

    // Tag cards for 3D perspective
    cards.forEach(card => card.classList.add('scroll-3d-plane'));

    const update3DPlanes = ({ scroll, velocity }) => {
      const vh = window.innerHeight;
      const tiltVelocity = Math.max(-12, Math.min(12, velocity || 0)) * 0.12;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        // Progress: 0 when top enters viewport, 1 when bottom leaves viewport
        const cardProgress = 1 - (rect.bottom / (vh + rect.height));

        if (cardProgress > -0.15 && cardProgress < 1.15) {
          // Spline pitch: starts slightly tilted at bottom, flattens to 0 at center, tilts gently as leaving
          const enterFactor = Math.max(0, 1 - cardProgress * 2.2); // 1 to 0
          const rotX = (enterFactor * 9) + tiltVelocity;
          const translateY = enterFactor * 18;
          const scale = 0.98 + (1 - enterFactor) * 0.02;

          card.style.transform = `perspective(1200px) rotateX(${rotX.toFixed(2)}deg) translateY(${translateY.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        }
      });
    };

    if (lenis) {
      lenis.on('scroll', update3DPlanes);
    } else {
      window.addEventListener('scroll', () => {
        update3DPlanes({ scroll: window.scrollY, velocity: 0 });
      }, { passive: true });
    }
  }

  /* ==========================================================================
     3. SEAMLESS PAGE TRANSITIONS & TOP PROGRESS BAR
     ========================================================================== */
  function initPageTransitions() {
    let loadingBar = document.getElementById('page-loading-bar');
    if (!loadingBar) {
      loadingBar = document.createElement('div');
      loadingBar.id = 'page-loading-bar';
      loadingBar.className = 'page-loading-bar';
      loadingBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(loadingBar);
    }

    document.body.classList.add('page-entering');
    if (loadingBar && !isReducedMotion) {
      loadingBar.style.width = '40%';
      setTimeout(() => {
        loadingBar.style.width = '100%';
        setTimeout(() => {
          loadingBar.style.opacity = '0';
          setTimeout(() => {
            loadingBar.style.width = '0%';
            loadingBar.style.opacity = '1';
          }, 300);
        }, 150);
      }, 100);
    }

    requestAnimationFrame(() => {
      document.body.classList.remove('page-entering');
      document.body.classList.add('page-entered');
    });

    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('#') ||
        href.startsWith('javascript:') ||
        href.startsWith('mailto:') ||
        href.startsWith('tel:') ||
        link.target === '_blank' ||
        link.hasAttribute('download') ||
        e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
      ) {
        return;
      }

      try {
        const targetUrl = new URL(link.href, window.location.href);
        if (targetUrl.origin !== window.location.origin) return;
        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
          return;
        }
      } catch (err) {
        return;
      }

      if (isReducedMotion) return;

      e.preventDefault();
      const dest = link.href;

      if (loadingBar) {
        loadingBar.style.transition = 'width 0.22s cubic-bezier(0.16, 1, 0.3, 1)';
        loadingBar.style.width = '75%';
      }

      document.body.classList.add('page-exiting');

      setTimeout(() => {
        if (loadingBar) loadingBar.style.width = '100%';
        window.location.href = dest;
      }, 180);
    });

    window.addEventListener('pageshow', function (event) {
      if (event.persisted) {
        document.body.classList.remove('page-exiting');
        document.body.classList.add('page-entered');
        if (loadingBar) {
          loadingBar.style.width = '0%';
          loadingBar.style.opacity = '1';
        }
      }
    });
  }

  /* ==========================================================================
     4. SCROLL PROGRESS & HEADER ELEVATION & BACK-TO-TOP
     ========================================================================== */
  function initScrollProgress() {
    let progressBar = document.getElementById('scroll-progress-bar');
    if (!progressBar) {
      progressBar = document.createElement('div');
      progressBar.id = 'scroll-progress-bar';
      progressBar.className = 'scroll-progress-bar';
      progressBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(progressBar);
    }

    const header = document.querySelector('.app-header') || document.querySelector('.admin-page-header');

    let backToTopBtn = document.getElementById('btn-back-to-top');
    if (!backToTopBtn) {
      backToTopBtn = document.createElement('button');
      backToTopBtn.type = 'button';
      backToTopBtn.id = 'btn-back-to-top';
      backToTopBtn.className = 'back-to-top-btn';
      backToTopBtn.setAttribute('aria-label', 'Scroll back to top');
      backToTopBtn.setAttribute('title', 'Scroll back to top');
      backToTopBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>';
      document.body.appendChild(backToTopBtn);
    }

    backToTopBtn.onclick = () => {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    const handleScrollUpdate = (scrollY, progress) => {
      // 1. Top progress bar
      if (progressBar) {
        const pct = progress !== undefined ? progress * 100 : Math.min(100, Math.max(0, (scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100));
        progressBar.style.width = pct + '%';
      }

      // 2. Compact header elevation
      if (header) {
        if (scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // 3. Floating back-to-top button
      if (backToTopBtn) {
        if (scrollY > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    };

    if (lenisInstance) {
      lenisInstance.on('scroll', ({ scroll, progress }) => {
        handleScrollUpdate(scroll, progress);
      });
    } else {
      window.addEventListener('scroll', () => {
        handleScrollUpdate(window.scrollY || window.pageYOffset);
      }, { passive: true });
    }
    handleScrollUpdate(window.scrollY || 0);
  }

  /* ==========================================================================
     5. INTERSECTION OBSERVER FOR SCROLL REVEAL & NUMBER COUNTERS
     ========================================================================== */
  function initScrollReveals() {
    if (isReducedMotion) {
      document.querySelectorAll('.reveal-on-scroll, .scroll-fade-up, .scroll-slide-left, .scroll-slide-right').forEach(el => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const autoRevealSelectors = [
      '.section-head-center',
      '.how-it-works-section',
      '.a11y-strip-section',
      '.app-footer',
      '.admin-stats-grid',
      '.admin-facility-selector-card',
      '.admin-card-section',
      '.hospital-hero',
      '.doctor-cards-grid',
      '.medicine-inventory-grid'
    ];

    autoRevealSelectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!el.classList.contains('reveal-on-scroll')) {
          el.classList.add('reveal-on-scroll');
        }
      });
    });

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          entry.target.querySelectorAll('[data-counter], .stat-counter').forEach(runNumberCounter);
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('.reveal-on-scroll, .scroll-fade-up, .scroll-slide-left, .scroll-slide-right').forEach(el => {
      observer.observe(el);
    });
  }

  /* ==========================================================================
     6. STATISTIC & METRIC NUMBER COUNTER ANIMATION
     ========================================================================== */
  function runNumberCounter(el) {
    if (!el || el.dataset.counterDone) return;
    el.dataset.counterDone = 'true';

    const raw = el.innerText.trim();
    const match = raw.match(/^([^\d]*)([\d,.]+)([^\d]*)$/);
    if (!match) return;

    const prefix = match[1] || '';
    const numericStr = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const targetVal = parseFloat(numericStr);
    if (isNaN(targetVal)) return;

    const isFloat = numericStr.includes('.');
    const decimals = isFloat ? numericStr.split('.')[1].length : 0;
    const duration = 1200;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = targetVal * ease;

      el.innerText = prefix + (isFloat ? current.toFixed(decimals) : Math.round(current).toLocaleString()) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = raw;
      }
    }

    requestAnimationFrame(update);
  }

  /* ==========================================================================
     7. TACTILE CLICK FEEDBACK (Subtle Button & Card Press Interaction)
     ========================================================================== */
  function initClickFeedback() {
    const clickableSelectors = 'button, .btn, .chip-btn, .pill-btn, .hospital-card, .admin-stat-card';

    document.addEventListener('pointerdown', (e) => {
      const target = e.target.closest(clickableSelectors);
      if (!target) return;
      target.classList.add('is-pressed');
    }, { passive: true });

    document.addEventListener('pointerup', () => {
      document.querySelectorAll('.is-pressed').forEach(el => el.classList.remove('is-pressed'));
    }, { passive: true });

    document.addEventListener('pointercancel', () => {
      document.querySelectorAll('.is-pressed').forEach(el => el.classList.remove('is-pressed'));
    }, { passive: true });
  }

  /* ==========================================================================
     INITIALIZATION ON DOM READY
     ========================================================================== */
  function init() {
    initLenis();
    initPageTransitions();
    initScrollProgress();
    initScrollReveals();
    initClickFeedback();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.MediPulseAnimations = {
    initScrollReveals,
    runNumberCounter,
    getLenis: () => lenisInstance
  };
})();
