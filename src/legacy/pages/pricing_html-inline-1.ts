// @ts-nocheck
(function() {
  'use strict';

  /* ==========================================================
     CENTRAL PRICING CONFIGURATION
     Single source of truth for client-side calculations.
     Backend must independently validate all amounts.
     ========================================================== */
  const PRICING = {
    currency: 'USD',
    interval: 'month',
    work: {
      standard: 19.99,
      founding: 9.99
    },
    team: {
      standardPerSeat: 20,
      foundingPerSeat: 12,
      minimumSeats: 3
    },
    enterprise: {
      type: 'custom'
    }
  };

  /* ==========================================================
     NAVIGATION — MOBILE MENU
     ========================================================== */
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function() {
      const isOpen = mobileMenu.classList.toggle('is-open');
      hamburgerBtn.setAttribute('aria-expanded', String(isOpen));
      hamburgerBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    });
  }

  /* ==========================================================
     TEAM SEAT CALCULATOR
     ========================================================== */
  const seatCountEl = document.getElementById('seatCount');
  const seatIncrement = document.getElementById('seatIncrement');
  const seatDecrement = document.getElementById('seatDecrement');
  const teamFoundingTotal = document.getElementById('teamFoundingTotal');
  const teamStandardTotal = document.getElementById('teamStandardTotal');
  const teamCta = document.getElementById('teamCta');

  let seats = PRICING.team.minimumSeats;

  function formatCurrency(amount) {
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    });
  }

  function updateSeatCalculator() {
    const foundingTotal = seats * PRICING.team.foundingPerSeat;
    const standardTotal = seats * PRICING.team.standardPerSeat;

    seatCountEl.textContent = String(seats);
    teamFoundingTotal.textContent = formatCurrency(foundingTotal);
    teamStandardTotal.textContent = formatCurrency(standardTotal);

    seatDecrement.disabled = seats <= PRICING.team.minimumSeats;

    // Update Team CTA checkout payload
    if (teamCta) {
      const total = seats * PRICING.team.foundingPerSeat;
      teamCta.href = '/registration.html?plan=team&seats=' + seats +
                     '&pricePerSeat=' + PRICING.team.foundingPerSeat +
                     '&total=' + total +
                     '&pricing=founding_partner';
      teamCta.dataset.seats = String(seats);
    }

    // Announce for screen readers
    teamFoundingTotal.setAttribute('aria-label',
      formatCurrency(foundingTotal) + ' per month, ' + seats + ' seats');
  }

  if (seatIncrement && seatDecrement && seatCountEl) {
    seatIncrement.addEventListener('click', function() {
      seats += 1;
      updateSeatCalculator();
    });

    seatDecrement.addEventListener('click', function() {
      if (seats > PRICING.team.minimumSeats) {
        seats -= 1;
        updateSeatCalculator();
      }
    });

    updateSeatCalculator();
  }

  /* ==========================================================
     WORK CTA — ensure correct payload
     ========================================================== */
  const workCta = document.querySelector('[data-plan="work"]');
  if (workCta) {
    workCta.addEventListener('click', function(e) {
      // Navigation is handled by href; we just ensure the href is correct.
      // The link already points to registration.html with plan=work.
    });
  }

  /* ==========================================================
     SAVINGS / ECONOMIC VALUE CALCULATOR
     ========================================================== */
  const monthlySpendInput = document.getElementById('monthlySpend');
  const reductionSlider = document.getElementById('reductionSlider');
  const reductionValue = document.getElementById('reductionValue');
  const resultCurrent = document.getElementById('resultCurrent');
  const resultReduction = document.getElementById('resultReduction');
  const resultRemaining = document.getElementById('resultRemaining');
  const resultDsrt = document.getElementById('resultDsrt');
  const resultNet = document.getElementById('resultNet');

  // Illustrative DSRT subscription cost for the savings model (10 Team seats at founding pricing).
  const ILLUSTRATIVE_DSRT_SEATS = 10;
  const ILLUSTRATIVE_DSRT_COST = ILLUSTRATIVE_DSRT_SEATS * PRICING.team.foundingPerSeat; // $120

  function formatSavingsCurrency(amount) {
    return '$' + Math.round(amount).toLocaleString('en-US');
  }

  function updateSavingsCalculator() {
    if (!monthlySpendInput || !reductionSlider) return;

    const monthlySpend = parseFloat(monthlySpendInput.value) || 0;
    const reductionPercent = parseFloat(reductionSlider.value) || 0;

    const reduction = monthlySpend * (reductionPercent / 100);
    const remaining = monthlySpend - reduction;
    const netDifference = reduction - ILLUSTRATIVE_DSRT_COST;

    resultCurrent.textContent = formatSavingsCurrency(monthlySpend);
    resultReduction.textContent = '−' + formatSavingsCurrency(reduction);
    resultRemaining.textContent = formatSavingsCurrency(remaining);
    resultDsrt.textContent = '−' + formatSavingsCurrency(ILLUSTRATIVE_DSRT_COST);
    resultNet.textContent = formatSavingsCurrency(netDifference);

    reductionValue.textContent = reductionPercent + '%';
    reductionSlider.setAttribute('aria-valuetext', reductionPercent + ' percent');
  }

  if (monthlySpendInput && reductionSlider) {
    monthlySpendInput.addEventListener('input', updateSavingsCalculator);
    reductionSlider.addEventListener('input', updateSavingsCalculator);
    updateSavingsCalculator();
  }

  /* ==========================================================
     ENTERPRISE ENQUIRY MODAL
     ========================================================== */
  const enterpriseModal = document.getElementById('enterpriseModal');
  const modalClose = document.getElementById('modalClose');
  const enterpriseForm = document.getElementById('enterpriseForm');
  const formError = document.getElementById('formError');
  const formSuccess = document.getElementById('formSuccess');
  const formSubmit = document.getElementById('formSubmit');
  let lastFocusedElement = null;

  function openEnterpriseModal() {
    lastFocusedElement = document.activeElement;
    enterpriseModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    // Focus first input
    const firstInput = document.getElementById('fullName');
    if (firstInput) {
      setTimeout(function() { firstInput.focus(); }, 60);
    }
  }

  function closeEnterpriseModal() {
    enterpriseModal.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  const enterpriseButtons = [
    document.getElementById('enterpriseCta'),
    document.getElementById('enterpriseCtaDark'),
    document.getElementById('finalEnterpriseCta')
  ];

  enterpriseButtons.forEach(function(btn) {
    if (btn) {
      btn.addEventListener('click', openEnterpriseModal);
    }
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeEnterpriseModal);
  }

  if (enterpriseModal) {
    enterpriseModal.addEventListener('click', function(e) {
      if (e.target === enterpriseModal) {
        closeEnterpriseModal();
      }
    });
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && enterpriseModal && enterpriseModal.classList.contains('is-open')) {
      closeEnterpriseModal();
    }
  });

  // Enterprise form submission
  if (enterpriseForm) {
    enterpriseForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Basic validation
      const requiredFields = enterpriseForm.querySelectorAll('[required]');
      let valid = true;

      requiredFields.forEach(function(field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#b42318';
        } else {
          field.style.borderColor = '';
        }
      });

      // Email validation
      const emailField = document.getElementById('workEmail');
      if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
        valid = false;
        emailField.style.borderColor = '#b42318';
      }

      if (!valid) {
        formError.classList.add('is-visible');
        formError.textContent = 'Please complete all required fields with valid information.';
        return;
      }

      formError.classList.remove('is-visible');

      // Simulate submission
      formSubmit.disabled = true;
      formSubmit.textContent = 'Submitting…';

      setTimeout(function() {
        enterpriseForm.style.display = 'none';
        formSuccess.classList.add('is-visible');
        formSubmit.disabled = false;
        formSubmit.textContent = 'Submit enquiry';

        // In production, this is where the actual backend submission would occur.
      }, 700);
    });
  }

  /* ==========================================================
     FAQ ACCORDION
     ========================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', function() {
      const isOpen = item.classList.contains('is-open');

      // Close all (single-open accordion pattern)
      faqItems.forEach(function(other) {
        other.classList.remove('is-open');
        const otherBtn = other.querySelector('.faq-question');
        if (otherBtn) {
          otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Open this one if it was closed
      if (!isOpen) {
        item.classList.add('is-open');
        question.setAttribute('aria-expanded', 'true');
      }
    });

    // Keyboard support (native button supports Enter/Space)
  });

  /* ==========================================================
     REVEAL ANIMATIONS (IntersectionObserver)
     ========================================================== */
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.reveal').forEach(function(el) {
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show everything
    document.querySelectorAll('.reveal').forEach(function(el) {
      el.classList.add('is-visible');
    });
  }

  /* ==========================================================
     ANALYTICS EVENTS (conceptual hooks)
     ========================================================== */
  function trackEvent(name, data) {
    // In production, wire this to your analytics provider.
    // Example: window.dataLayer.push({ event: name, ...data });
    if (window.console && window.console.debug) {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', name, data || {});
    }
  }

  trackEvent('pricing_page_viewed');

  // Plan view tracking on card visibility
  if ('IntersectionObserver' in window) {
    const planObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          const planName = entry.target.querySelector('.pricing-card__name');
          trackEvent('pricing_plan_viewed', {
            plan: planName ? planName.textContent.trim().toLowerCase() : 'unknown'
          });
          planObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    document.querySelectorAll('.pricing-card').forEach(function(card) {
      planObserver.observe(card);
    });
  }

  // Seat count change tracking
  if (seatIncrement && seatDecrement) {
    seatIncrement.addEventListener('click', function() {
      trackEvent('team_seat_count_changed', { seats: seats });
    });
    seatDecrement.addEventListener('click', function() {
      trackEvent('team_seat_count_changed', { seats: seats });
    });
  }

  // Checkout start tracking
  if (workCta) {
    workCta.addEventListener('click', function() {
      trackEvent('work_checkout_started', { plan: 'work', price: PRICING.work.founding });
    });
  }
  if (teamCta) {
    teamCta.addEventListener('click', function() {
      trackEvent('team_checkout_started', {
        plan: 'team',
        seats: seats,
        pricePerSeat: PRICING.team.foundingPerSeat,
        total: seats * PRICING.team.foundingPerSeat
      });
    });
  }

  enterpriseButtons.forEach(function(btn) {
    if (btn) {
      btn.addEventListener('click', function() {
        trackEvent('enterprise_enquiry_started');
      });
    }
  });

  if (enterpriseForm) {
    enterpriseForm.addEventListener('submit', function() {
      // Fired before validation completes; success tracking is below.
    });
  }

  // Track successful enterprise enquiry (when success message shows)
  const originalSetTimeout = window.setTimeout;
  // (Analytics for successful submission is handled inside the form handler in production.)

  // FAQ open tracking
  faqItems.forEach(function(item) {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', function() {
        if (item.classList.contains('is-open')) {
          trackEvent('pricing_faq_opened', {
            question: question.textContent.trim().split('\n')[0]
          });
        }
      });
    }
  });

  /* ==========================================================
     REFRESH TEAM CTA ON LOAD
     ========================================================== */
  updateSeatCalculator();

})();
