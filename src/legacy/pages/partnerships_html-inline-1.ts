// @ts-nocheck
(function () {
      'use strict';

      /* ----------------------------------------------------------------------
         MODULE 1: enterprise-content.js equivalent
         Keeps structured data separate from UI interaction logic
         ---------------------------------------------------------------------- */
      const EnterpriseContent = {
        architectureNodes: {
          env: {
            title: 'Existing Enterprise Environment',
            detail: 'Evaluates internal AI applications, business workflows, stakeholder access permissions and organizational governance boundaries before proposing integration points.'
          },
          dsrt: {
            title: 'DSRT AI (Contracted Scope)',
            detail: 'Applies in-house LLM Amplification and agreed configuration rules within the scoped environment to improve computational efficiency while preserving required output quality.'
          },
          providers: {
            title: 'Supported External Providers',
            detail: 'Connects to supported commercial AI providers and model endpoints verified during Phase 02 technical assessment, respecting applicable provider data-handling terms.'
          },
          measurement: {
            title: 'Measurement and Reporting Layer',
            detail: 'Records comparable baseline vs. post-deployment metrics across provider expenditure, token volume, output quality, reliability, amplification overhead and net financial impact.'
          }
        },

        measurementScenarios: {
          research: {
            label: 'SAMPLE A',
            rows: [
              { metric: 'Provider expenditure', method: 'Measured', baseline: '$42,000 / period', deployment: '$27,800 / period' },
              { metric: 'Token consumption', method: 'Measured', baseline: '1.84B tokens', deployment: '1.19B tokens' },
              { metric: 'Output quality', method: 'Evaluated', baseline: '94.2% rubric score', deployment: '94.5% (Threshold ≥ 94.0%)' },
              { metric: 'Reliability', method: 'Evaluated', baseline: '98.8% completion', deployment: '98.9% (Agreed parity)' },
              { metric: 'Additional processing', method: 'Recorded', baseline: '$0', deployment: '$1,650 amplification + $4,200 scope fee' },
              { metric: 'Total relevant cost', method: 'Calculated', baseline: '$42,000', deployment: '$33,650 (Net -$8,350 / period)', positive: true }
            ],
            ledger: {
              grossReduction: '$14,200',
              processingOverhead: '− $1,650',
              contractCost: '− $4,200',
              netBenefit: '$8,350 / period'
            }
          },
          engineering: {
            label: 'SAMPLE B',
            rows: [
              { metric: 'Provider expenditure', method: 'Measured', baseline: '$68,500 / period', deployment: '$46,900 / period' },
              { metric: 'Token consumption', method: 'Measured', baseline: '2.95B tokens', deployment: '1.98B tokens' },
              { metric: 'Output quality', method: 'Evaluated', baseline: '91.6% pass rate', deployment: '91.8% (Threshold ≥ 91.5%)' },
              { metric: 'Reliability', method: 'Evaluated', baseline: '99.1% completion', deployment: '99.1% (Agreed parity)' },
              { metric: 'Additional processing', method: 'Recorded', baseline: '$0', deployment: '$2,400 amplification + $6,500 scope fee' },
              { metric: 'Total relevant cost', method: 'Calculated', baseline: '$68,500', deployment: '$55,800 (Net -$12,700 / period)', positive: true }
            ],
            ledger: {
              grossReduction: '$21,600',
              processingOverhead: '− $2,400',
              contractCost: '− $6,500',
              netBenefit: '$12,700 / period'
            }
          },
          operations: {
            label: 'SAMPLE C',
            rows: [
              { metric: 'Provider expenditure', method: 'Measured', baseline: '$24,400 / period', deployment: '$16,900 / period' },
              { metric: 'Token consumption', method: 'Measured', baseline: '1.12B tokens', deployment: '760M tokens' },
              { metric: 'Output quality', method: 'Evaluated', baseline: '96.0% accuracy', deployment: '96.1% (Threshold ≥ 96.0%)' },
              { metric: 'Reliability', method: 'Evaluated', baseline: '99.3% completion', deployment: '99.4% (Agreed parity)' },
              { metric: 'Additional processing', method: 'Recorded', baseline: '$0', deployment: '$950 amplification + $2,800 scope fee' },
              { metric: 'Total relevant cost', method: 'Calculated', baseline: '$24,400', deployment: '$20,650 (Net -$3,750 / period)', positive: true }
            ],
            ledger: {
              grossReduction: '$7,500',
              processingOverhead: '− $950',
              contractCost: '− $2,800',
              netBenefit: '$3,750 / period'
            }
          }
        }
      };

      /* ----------------------------------------------------------------------
         MODULE 2: Analytics & Event Telemetry Helper (Section 21)
         ---------------------------------------------------------------------- */
      function trackEnterpriseEvent(eventName, properties) {
        const eventPayload = {
          event: eventName,
          route: '/enterprise',
          timestamp: new Date().toISOString(),
          ...(properties || {})
        };
        if (typeof window.dispatchEvent === 'function') {
          window.dispatchEvent(new CustomEvent('dsrt:enterprise_event', { detail: eventPayload }));
        }
      }

      /* ----------------------------------------------------------------------
         MODULE 3: enterprise-validation.js equivalent (Section 17 & 22)
         Validates required fields, business email domains, URLs & spam signals
         ---------------------------------------------------------------------- */
      const FREE_EMAIL_DOMAINS = new Set([
        'gmail.com', 'googlemail.com', 'yahoo.com', 'yahoo.co.uk', 'hotmail.com',
        'outlook.com', 'live.com', 'msn.com', 'icloud.com', 'me.com', 'aol.com',
        'proton.me', 'protonmail.com', 'mail.com', 'gmx.com', 'yandex.com'
      ]);

      const EnterpriseValidation = {
        isBusinessEmail(email) {
          if (!email) return { valid: false, message: 'Enter your business email address.' };
          const trimmed = email.trim().toLowerCase();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
          if (!emailRegex.test(trimmed)) {
            return { valid: false, message: 'Enter a valid email address format.' };
          }
          const domain = trimmed.split('@')[1];
          if (FREE_EMAIL_DOMAINS.has(domain)) {
            return { valid: false, message: 'Please use your organizational business email address rather than a personal email provider.' };
          }
          return { valid: true };
        },

        normalizeWebsite(rawUrl) {
          if (!rawUrl || !rawUrl.trim()) {
            return { valid: false, message: 'Enter your organization website.' };
          }
          let candidate = rawUrl.trim();
          if (!/^https?:\/\//i.test(candidate)) {
            candidate = 'https://' + candidate;
          }
          try {
            const parsed = new URL(candidate);
            if (!parsed.hostname || !parsed.hostname.includes('.') || parsed.hostname.length < 4) {
              return { valid: false, message: 'Enter a valid organization domain (e.g., https://organization.com).' };
            }
            return { valid: true, normalized: parsed.href };
          } catch (_) {
            return { valid: false, message: 'Enter a valid organization website URL.' };
          }
        },

        validatePayload(rawForm, formLoadedAt) {
          const errors = {};

          // Spam check: Honeypot or instantaneous bot submission (< 1.2s)
          if (rawForm.honeypot && rawForm.honeypot.trim() !== '') {
            return { isSpam: true, isValid: false, errors: {} };
          }
          if (Date.now() - formLoadedAt < 1200) {
            return { isSpam: true, isValid: false, errors: {} };
          }

          if (!rawForm.fullName || rawForm.fullName.trim().length < 2) {
            errors.fullName = 'Enter your full name.';
          }

          const emailCheck = this.isBusinessEmail(rawForm.businessEmail);
          if (!emailCheck.valid) {
            errors.businessEmail = emailCheck.message;
          }

          if (!rawForm.organization || rawForm.organization.trim().length < 2) {
            errors.organization = 'Enter your organization name.';
          }

          if (!rawForm.jobTitle || rawForm.jobTitle.trim().length < 2) {
            errors.jobTitle = 'Enter your job title or role.';
          }

          const urlCheck = this.normalizeWebsite(rawForm.website);
          if (!urlCheck.valid) {
            errors.website = urlCheck.message;
          }

          if (!rawForm.country || rawForm.country.trim().length < 2) {
            errors.country = 'Enter your country or operating region.';
          }

          if (!rawForm.engagementObjective) {
            errors.engagementObjective = 'Select a primary engagement objective.';
          }

          if (!rawForm.requirements || rawForm.requirements.trim().length < 20) {
            errors.requirements = 'Provide a brief description of the requirement (minimum 20 characters).';
          }

          if (!rawForm.privacyConsent) {
            errors.privacyConsent = 'Confirmation is required to submit an enterprise enquiry.';
          }

          const isValid = Object.keys(errors).length === 0;

          // Construct exact EnterpriseEnquiry data model (Section 22)
          const enquiryModel = isValid ? {
            fullName: rawForm.fullName.trim(),
            businessEmail: rawForm.businessEmail.trim().toLowerCase(),
            organization: rawForm.organization.trim(),
            jobTitle: rawForm.jobTitle.trim(),
            website: urlCheck.normalized,
            country: rawForm.country.trim(),
            engagementObjective: rawForm.engagementObjective,
            requirements: rawForm.requirements.trim(),
            ...(rawForm.monthlyAISpend ? { monthlyAISpend: rawForm.monthlyAISpend } : {}),
            ...(rawForm.approximateUsers ? { approximateUsers: rawForm.approximateUsers } : {}),
            ...(rawForm.currentProviders && rawForm.currentProviders.length > 0 ? { currentProviders: rawForm.currentProviders } : {}),
            ...(rawForm.deploymentEnvironment && rawForm.deploymentEnvironment.trim() ? { deploymentEnvironment: rawForm.deploymentEnvironment.trim() } : {}),
            ...(rawForm.expectedTimeline ? { expectedTimeline: rawForm.expectedTimeline } : {}),
            ...(rawForm.additionalRequirements && rawForm.additionalRequirements.trim() ? { additionalRequirements: rawForm.additionalRequirements.trim() } : {}),
            submittedAt: new Date().toISOString()
          } : null;

          return {
            isSpam: false,
            isValid,
            errors,
            enquiryModel
          };
        }
      };

      /* ----------------------------------------------------------------------
         MODULE 4: enterprise-enquiry.js equivalent (DATABASE ADAPTER LAYER)
         Ready to connect to whichever database / backend endpoint you specify
         ---------------------------------------------------------------------- */
      const EnterpriseEnquiryService = {
        /**
         * Replace or configure this method once the target database
         * (e.g., Supabase, PostgreSQL API, Firebase, MongoDB, Appwrite) is specified.
         * Never expose private database credentials on the client; route through a
         * secure server endpoint or RLS-protected insert policy.
         */
        async saveToDatabase(enquiryPayload) {
          // Hook point for custom external adapter if injected globally
          if (typeof window.DSRT_DB_CONNECTOR === 'function') {
            return await window.DSRT_DB_CONNECTOR(enquiryPayload);
          }

          // Default ready-state simulation until database target is configured
          await new Promise((resolve) => setTimeout(resolve, 550));

          const referenceId = 'DSRT-ENT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
          return {
            ok: true,
            referenceId,
            storedPayload: enquiryPayload
          };
        }
      };

      // Expose service cleanly on window so database integration can be inspected or wired seamlessly
      window.DSRTEnterpriseEnquiryService = EnterpriseEnquiryService;

      /* ----------------------------------------------------------------------
         MODULE 5: UI Interactions & Component Controllers (Section 20)
         ---------------------------------------------------------------------- */
      document.addEventListener('DOMContentLoaded', function () {
        const formLoadedAt = Date.now();

        // Dynamic Footer Year
        const yearEl = document.getElementById('footerYear');
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());

        // 1. Mobile Navigation Toggle
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mobileNavDrawer = document.getElementById('mobileNavDrawer');
        if (mobileMenuBtn && mobileNavDrawer) {
          mobileMenuBtn.addEventListener('click', function () {
            const isOpen = mobileNavDrawer.classList.toggle('is-open');
            mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
          });

          mobileNavDrawer.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
              mobileNavDrawer.classList.remove('is-open');
              mobileMenuBtn.setAttribute('aria-expanded', 'false');
            });
          });
        }

        // 2. CTA Click Tracking
        document.querySelectorAll('[data-track]').forEach(function (cta) {
          cta.addEventListener('click', function () {
            trackEnterpriseEvent('cta_clicked', { target: cta.getAttribute('data-track') });
          });
        });

        // 3. Section 05: Deployment Timeline Active State Inspection
        const phaseCols = document.querySelectorAll('.phase-col');
        phaseCols.forEach(function (col) {
          col.addEventListener('click', function () {
            phaseCols.forEach(function (c) { c.classList.remove('is-active'); });
            col.classList.add('is-active');
            trackEnterpriseEvent('deployment_phase_inspected', { phase: col.getAttribute('data-phase') });
          });
        });

        // 4. Section 06: Interactive Architecture Diagram Inspector
        const archNodes = document.querySelectorAll('.arch-interactive-node');
        const archInspectorText = document.getElementById('archInspectorText');

        function activateArchNode(nodeEl) {
          const key = nodeEl.getAttribute('data-arch-node');
          const info = EnterpriseContent.architectureNodes[key];
          if (!info || !archInspectorText) return;

          archInspectorText.innerHTML = '';
          const strong = document.createElement('strong');
          strong.textContent = info.title + ': ';
          archInspectorText.appendChild(strong);
          archInspectorText.appendChild(document.createTextNode(info.detail));

          trackEnterpriseEvent('architecture_node_inspected', { layer: key });
        }

        archNodes.forEach(function (node) {
          node.addEventListener('click', function () { activateArchNode(node); });
          node.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              activateArchNode(node);
            }
          });
        });

        // 5. Section 07: Sample Measurement Scenario Switcher
        const scenarioTabs = document.querySelectorAll('.scenario-tab');
        const evalTableBody = document.getElementById('evalTableBody');
        const evalScenarioName = document.getElementById('evalScenarioName');
        const evalLedger = document.getElementById('evalLedger');

        function renderScenario(scenarioKey) {
          const data = EnterpriseContent.measurementScenarios[scenarioKey];
          if (!data || !evalTableBody || !evalLedger) return;

          evalScenarioName.textContent = data.label;

          evalTableBody.innerHTML = data.rows.map(function (r) {
            return (
              '<tr>' +
                '<td>' + r.metric + '</td>' +
                '<td><span class="eval-status-tag">' + r.method + '</span></td>' +
                '<td class="eval-val-mono">' + r.baseline + '</td>' +
                '<td class="eval-val-mono ' + (r.positive ? 'eval-val-positive' : '') + '">' + r.deployment + '</td>' +
              '</tr>'
            );
          }).join('');

          evalLedger.innerHTML =
            '<div class="eval-ledger__row"><span>Gross provider cost reduction</span><span>' + data.ledger.grossReduction + '</span></div>' +
            '<div class="eval-ledger__row"><span>Less: Additional processing costs</span><span>' + data.ledger.processingOverhead + '</span></div>' +
            '<div class="eval-ledger__row"><span>Less: Illustrative DSRT contract cost</span><span>' + data.ledger.contractCost + '</span></div>' +
            '<div class="eval-ledger__row eval-ledger__row--net"><span>Net financial benefit (Sample)</span><span>' + data.ledger.netBenefit + '</span></div>';

          trackEnterpriseEvent('measurement_scenario_selected', { scenario: scenarioKey });
        }

        scenarioTabs.forEach(function (tab) {
          tab.addEventListener('click', function () {
            scenarioTabs.forEach(function (t) {
              t.classList.remove('is-active');
              t.setAttribute('aria-selected', 'false');
            });
            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');
            renderScenario(tab.getAttribute('data-scenario'));
          });
        });

        // 6. Section 13: Accessible FAQ Accordion + Expand/Collapse All
        const faqTriggers = document.querySelectorAll('.faq-trigger');
        const faqToggleAllBtn = document.getElementById('faqToggleAllBtn');

        function setFaqItemState(trigger, expand) {
          const panelId = trigger.getAttribute('aria-controls');
          const panel = document.getElementById(panelId);
          const icon = trigger.querySelector('.faq-trigger__icon');
          trigger.setAttribute('aria-expanded', String(expand));
          if (panel) panel.classList.toggle('is-open', expand);
          if (icon) icon.textContent = expand ? '−' : '+';
        }

        faqTriggers.forEach(function (trigger) {
          trigger.addEventListener('click', function () {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            setFaqItemState(trigger, !isExpanded);
            trackEnterpriseEvent('faq_toggled', { question: trigger.querySelector('.faq-trigger__question').textContent });
          });
        });

        if (faqToggleAllBtn) {
          faqToggleAllBtn.addEventListener('click', function () {
            const currentlyAllExpanded = faqToggleAllBtn.getAttribute('data-expanded') === 'true';
            const nextState = !currentlyAllExpanded;
            faqTriggers.forEach(function (t) { setFaqItemState(t, nextState); });
            faqToggleAllBtn.setAttribute('data-expanded', String(nextState));
            faqToggleAllBtn.textContent = nextState ? 'Collapse all answers' : 'Expand all answers';
          });
        }

        // 7. Section 14: Enterprise Enquiry Form Validation, Submission & Retry
        const form = document.getElementById('enterpriseEnquiryForm');
        const submitBtn = document.getElementById('submitEnquiryBtn');
        const formAlert = document.getElementById('formAlert');
        const formAlertText = document.getElementById('formAlertText');
        const formRetryBtn = document.getElementById('formRetryBtn');
        const confirmationBox = document.getElementById('enquiryConfirmation');
        const confirmationSummary = document.getElementById('confirmationSummary');
        const newEnquiryBtn = document.getElementById('newEnquiryBtn');

        let lastValidatedModel = null;

        const requiredFieldIds = [
          'fullName', 'businessEmail', 'organization', 'jobTitle',
          'website', 'country', 'engagementObjective', 'requirements', 'privacyConsent'
        ];

        function clearFieldErrors() {
          requiredFieldIds.forEach(function (id) {
            const input = document.getElementById(id);
            const errEl = document.getElementById('err-' + id);
            if (input) input.classList.remove('has-error');
            if (errEl) errEl.classList.remove('is-visible');
          });
          formAlert.classList.remove('is-visible');
          formRetryBtn.style.display = 'none';
        }

        // Live clear error on user input
        requiredFieldIds.forEach(function (id) {
          const input = document.getElementById(id);
          if (!input) return;
          const evtName = (input.tagName === 'SELECT' || input.type === 'checkbox') ? 'change' : 'input';
          input.addEventListener(evtName, function () {
            input.classList.remove('has-error');
            const errEl = document.getElementById('err-' + id);
            if (errEl) errEl.classList.remove('is-visible');
          });
        });

        function collectFormData() {
          const selectedProviders = Array.from(
            form.querySelectorAll('input[name="currentProviders"]:checked')
          ).map(function (cb) { return cb.value; });

          return {
            honeypot: document.getElementById('org_fax_extension').value,
            fullName: document.getElementById('fullName').value,
            businessEmail: document.getElementById('businessEmail').value,
            organization: document.getElementById('organization').value,
            jobTitle: document.getElementById('jobTitle').value,
            website: document.getElementById('website').value,
            country: document.getElementById('country').value,
            engagementObjective: document.getElementById('engagementObjective').value,
            requirements: document.getElementById('requirements').value,
            monthlyAISpend: document.getElementById('monthlyAISpend').value,
            approximateUsers: document.getElementById('approximateUsers').value,
            currentProviders: selectedProviders,
            deploymentEnvironment: document.getElementById('deploymentEnvironment').value,
            expectedTimeline: document.getElementById('expectedTimeline').value,
            additionalRequirements: document.getElementById('additionalRequirements').value,
            privacyConsent: document.getElementById('privacyConsent').checked
          };
        }

        async function executeSubmission(enquiryModel) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Submitting Enterprise Enquiry...';
          formAlert.classList.remove('is-visible');
          formRetryBtn.style.display = 'none';

          try {
            const response = await EnterpriseEnquiryService.saveToDatabase(enquiryModel);
            if (!response || !response.ok) {
              throw new Error((response && response.error) || 'Unable to record enquiry at this moment.');
            }

            trackEnterpriseEvent('enterprise_enquiry_submitted', {
              objective: enquiryModel.engagementObjective,
              referenceId: response.referenceId
            });

            // Safely render summary fields using textContent
            confirmationSummary.innerHTML = '';
            const summaryItems = [
              ['Reference', response.referenceId],
              ['Organization', enquiryModel.organization],
              ['Contact', enquiryModel.fullName + ' (' + enquiryModel.businessEmail + ')'],
              ['Primary Objective', enquiryModel.engagementObjective]
            ];

            summaryItems.forEach(function (pair) {
              const div = document.createElement('div');
              const label = document.createElement('span');
              label.textContent = pair[0] + ': ';
              const val = document.createElement('strong');
              val.textContent = pair[1];
              div.appendChild(label);
              div.appendChild(val);
              confirmationSummary.appendChild(div);
            });

            form.style.display = 'none';
            confirmationBox.classList.add('is-visible');
            confirmationBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          } catch (err) {
            formAlertText.textContent = err.message || 'A transmission error occurred while recording your enquiry. Your entries have been preserved.';
            formRetryBtn.style.display = 'inline-flex';
            formAlert.classList.add('is-visible');
            trackEnterpriseEvent('enterprise_enquiry_error', { message: err.message });
          } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Enterprise Enquiry';
          }
        }

        if (form) {
          form.addEventListener('submit', function (e) {
            e.preventDefault();
            clearFieldErrors();

            const rawData = collectFormData();
            const validation = EnterpriseValidation.validatePayload(rawData, formLoadedAt);

            if (validation.isSpam) {
              // Silently drop automated bot submissions without revealing honeypot mechanics
              form.style.display = 'none';
              confirmationBox.classList.add('is-visible');
              return;
            }

            if (!validation.isValid) {
              let firstInvalidInput = null;
              Object.keys(validation.errors).forEach(function (fieldId) {
                const input = document.getElementById(fieldId);
                const errEl = document.getElementById('err-' + fieldId);
                if (input) {
                  input.classList.add('has-error');
                  if (!firstInvalidInput) firstInvalidInput = input;
                }
                if (errEl) {
                  errEl.textContent = validation.errors[fieldId];
                  errEl.classList.add('is-visible');
                }
              });

              formAlertText.textContent = 'Please complete all required organizational fields highlighted below.';
              formAlert.classList.add('is-visible');
              if (firstInvalidInput) firstInvalidInput.focus();

              trackEnterpriseEvent('enterprise_enquiry_validation_failed', {
                fields: Object.keys(validation.errors)
              });
              return;
            }

            lastValidatedModel = validation.enquiryModel;
            executeSubmission(lastValidatedModel);
          });
        }

        if (formRetryBtn) {
          formRetryBtn.addEventListener('click', function () {
            if (lastValidatedModel) {
              executeSubmission(lastValidatedModel);
            }
          });
        }

        if (newEnquiryBtn) {
          newEnquiryBtn.addEventListener('click', function () {
            form.reset();
            lastValidatedModel = null;
            clearFieldErrors();
            confirmationBox.classList.remove('is-visible');
            form.style.display = 'block';
          });
        }
      });
    })();
