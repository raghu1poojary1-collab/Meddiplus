/**
 * MediPulse — Unified Animation & Interaction Engine
 * Features:
 *  1. Smooth Seamless Page Navigation Transitions (Eliminating white flashes)
 *  2. High-Performance IntersectionObserver Scroll Reveals & Staggers
 *  3. Dynamic Number Counter Animations for Hospital Statistics & Telemetry
 *  4. Top Scroll Progress Indicator
 *  5. Interactive Micro-Haptic Click Feedback & Ripple
 *  6. Floating Back to Top Button Controller
 *  7. Full Accessibility (prefers-reduced-motion) Respect
 */

(function () {
  'use strict';

  const isReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. SEAMLESS PAGE TRANSITIONS & TOP PROGRESS BAR
     ========================================================================== */
  function initPageTransitions() {
    // Create top loading indicator if not present
    let loadingBar = document.getElementById('page-loading-bar');
    if (!loadingBar) {
      loadingBar = document.createElement('div');
      loadingBar.id = 'page-loading-bar';
      loadingBar.className = 'page-loading-bar';
      loadingBar.setAttribute('aria-hidden', 'true');
      document.body.prepend(loadingBar);
    }

    // Initial page entrance animation
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

    // Handle internal link navigation clicks for smooth exit
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (!href) return;

      // Ignore anchor jumps, new tabs, javascript, mailto, tel, downloads
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

      // Check same-origin
      try {
        const targetUrl = new URL(link.href, window.location.href);
        if (targetUrl.origin !== window.location.origin) return;
        if (targetUrl.pathname === window.location.pathname && targetUrl.search === window.location.search) {
          return; // same page
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

    // Support browser back/forward cache restore (bfcache)
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
     2. SCROLL PROGRESS & HEADER ELEVATION
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
      backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
      document.body.appendChild(backToTopBtn);
    }

    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;

      // Top progress bar update
      if (progressBar && docHeight > 0) {
        const pct = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
        progressBar.style.width = pct + '%';
      }

      // Header glass elevation
      if (header) {
        if (scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Floating Back-to-Top Button
      if (backToTopBtn) {
        if (scrollY > 300) {
          backToTopBtn.classList.add('visible');
        } else {
          backToTopBtn.classList.remove('visible');
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  /* ==========================================================================
     3. INTERSECTION OBSERVER FOR SCROLL REVEAL & STAGGERS
     ========================================================================== */
  function initScrollReveals() {
    if (isReducedMotion) {
      document.querySelectorAll('.reveal-on-scroll, .scroll-fade-up, .scroll-slide-left, .scroll-slide-right').forEach(el => {
        el.classList.add('is-revealed');
      });
      return;
    }

    // Auto-tag common page containers if not explicitly tagged
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

          // Trigger number counter if target contains counters
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
     4. STATISTIC & METRIC NUMBER COUNTER ANIMATION
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
    const duration = 1200; // ms
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // easeOutExpo
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = targetVal * ease;

      el.innerText = prefix + (isFloat ? current.toFixed(decimals) : Math.round(current).toLocaleString()) + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.innerText = raw; // guarantee exact original formatting at end
      }
    }

    requestAnimationFrame(update);
  }

  /* ==========================================================================
     5. TACTILE CLICK FEEDBACK (Subtle Button & Card Press Interaction)
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

  // Export to window for global access if needed
  window.MediPulseAnimations = {
    initScrollReveals,
    runNumberCounter
  };
})();
