/* DSRT Enterprise — LABS-style reveal motion (robust selectors) */
(() => {
  'use strict';
  const init = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const header = document.querySelector('.site-header, .site-header-wrap, header');
    const updateHeader = () => {
      if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    const selectors = [
      '.hero-content', '.hero-copy', '.hero-visual', '.hero-pillar',
      '.lead-copy', '.section-heading', '.section-header-grid',
      '.section-header-stack', '.section > .container > *',
      '.section > *:not(.container)', '.process-step', '.phase-card',
      '.assessment-cell', '.measurement-area', '.governance-item',
      '.commercial-item', '.faq-item', '.principle-item',
      '.workload-row', '.contribution-row', '.final-cta__grid',
      '.enquiry-form-card', '.enquiry-sidebar__box'
    ];
    const elements = [...new Set(selectors.flatMap(sel =>
      Array.from(document.querySelectorAll(sel))
    ))].filter(el => !el.closest('header, footer, nav'));

    if (reduce || !('IntersectionObserver' in window)) return;

    elements.forEach((el, i) => {
      el.classList.add('reveal');
      if (el.matches('.hero-pillar,.process-step,.phase-card,.assessment-cell,.measurement-area,.governance-item,.commercial-item,.faq-item,.principle-item,.workload-row,.contribution-row')) {
        el.classList.add('reveal-stagger');
        el.style.setProperty('--reveal-delay', `${(i % 4) * 90}ms`);
      }
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    elements.forEach(el => observer.observe(el));
    // Ensure hero content is visible immediately, with a short stagger.
    elements.filter(el => el.getBoundingClientRect().top < window.innerHeight * 0.9)
      .forEach((el, i) => window.setTimeout(() => el.classList.add('in'), i * 90));
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
