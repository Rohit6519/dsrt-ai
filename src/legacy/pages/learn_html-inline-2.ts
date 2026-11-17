// @ts-nocheck
(() => {
      "use strict";

      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

      /* --------------------------------------------------------------------
         HEADER / PROGRESS
         -------------------------------------------------------------------- */

      const header = document.getElementById("site-header");
      const progressBar = document.getElementById("reading-progress-bar");

      function updateScrollState() {
        header.classList.toggle("is-scrolled", window.scrollY > 30);

        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;

        const progress = scrollable > 0
          ? Math.min(1, Math.max(0, window.scrollY / scrollable))
          : 0;

        progressBar.style.transform = `scaleX(${progress})`;
      }

      window.addEventListener("scroll", updateScrollState, { passive: true });
      window.addEventListener("resize", updateScrollState);
      updateScrollState();

      /* --------------------------------------------------------------------
         NAVIGATION DRAWER
         -------------------------------------------------------------------- */

      const drawer = document.getElementById("navigation-drawer");
      const menuOpen = document.getElementById("menu-open");
      const menuClose = document.getElementById("menu-close");

      let drawerReturnFocus = null;

      function openDrawer() {
        drawerReturnFocus = document.activeElement;
        drawer.classList.add("is-open");
        document.body.classList.add("is-locked");
        menuOpen.setAttribute("aria-expanded", "true");
        menuClose.focus();
      }

      function closeDrawer() {
        if (!drawer.classList.contains("is-open")) return;

        drawer.classList.remove("is-open");
        document.body.classList.remove("is-locked");
        menuOpen.setAttribute("aria-expanded", "false");

        if (drawerReturnFocus instanceof HTMLElement) {
          drawerReturnFocus.focus();
        }
      }

      menuOpen.addEventListener("click", openDrawer);
      menuClose.addEventListener("click", closeDrawer);

      drawer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeDrawer);
      });

      drawer.addEventListener("keydown", (event) => {
        if (event.key !== "Tab") return;

        const focusable = [...drawer.querySelectorAll("a, button")]
          .filter((element) => element.offsetParent !== null);

        if (!focusable.length) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeDrawer();
      });

      /* --------------------------------------------------------------------
         HERO VIDEO
         -------------------------------------------------------------------- */

      const heroVideo = document.getElementById("hero-video");
      const heroVideoControl = document.getElementById("hero-video-control");

      function updateVideoControl() {
        const paused = heroVideo.paused;

        heroVideoControl.textContent = paused ? "Play video" : "Pause video";
        heroVideoControl.setAttribute(
          "aria-label",
          paused ? "Play background video" : "Pause background video"
        );
      }

      heroVideo.addEventListener("loadeddata", () => {
        heroVideoControl.classList.add("is-visible");

        if (reducedMotion.matches) {
          heroVideo.pause();
        }

        updateVideoControl();
      });

      heroVideo.addEventListener("play", updateVideoControl);
      heroVideo.addEventListener("pause", updateVideoControl);

      heroVideo.addEventListener("error", () => {
        heroVideoControl.classList.remove("is-visible");
      });

      heroVideoControl.addEventListener("click", async () => {
        if (heroVideo.paused) {
          try {
            await heroVideo.play();
          } catch (error) {
            console.warn("Background video could not be played.", error);
          }
        } else {
          heroVideo.pause();
        }

        updateVideoControl();
      });

      if (reducedMotion.matches) {
        heroVideo.pause();
      }

      /* --------------------------------------------------------------------
         REVEAL ANIMATION
         -------------------------------------------------------------------- */

      const revealElements = [...document.querySelectorAll(".reveal")];

      if ("IntersectionObserver" in window && !reducedMotion.matches) {
        const revealObserver = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;

              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            });
          },
          {
            threshold: 0.08,
            rootMargin: "0px 0px -35px 0px"
          }
        );

        revealElements.forEach((element) => {
          revealObserver.observe(element);
        });
      } else {
        revealElements.forEach((element) => {
          element.classList.add("is-visible");
        });
      }

      /* --------------------------------------------------------------------
         SECTION NAVIGATION SYNC
         -------------------------------------------------------------------- */

      const navLinks = [...document.querySelectorAll("[data-nav]")];

      const observedSections = navLinks
        .map((link) => document.getElementById(link.dataset.nav))
        .filter(Boolean);

      if ("IntersectionObserver" in window) {
        const visibleSections = new Map();

        const navObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                visibleSections.set(entry.target.id, entry.boundingClientRect.top);
              } else {
                visibleSections.delete(entry.target.id);
              }
            });

            const current = [...visibleSections.entries()]
              .sort((a, b) => Math.abs(a[1]) - Math.abs(b[1]))[0];

            if (!current) return;

            navLinks.forEach((link) => {
              const active = link.dataset.nav === current[0];

              link.classList.toggle("is-current", active);

              if (active) {
                link.setAttribute("aria-current", "location");
              } else {
                link.removeAttribute("aria-current");
              }
            });
          },
          {
            rootMargin: "-20% 0px -65% 0px",
            threshold: 0
          }
        );

        observedSections.forEach((section) => navObserver.observe(section));
      }

      /* --------------------------------------------------------------------
         PIPELINE INSPECTOR
         -------------------------------------------------------------------- */

      const stageDetails = [
        {
          code: "Stage 01 / task input",
          title: "Task input",
          description:
            "Accepts task payloads from interactive workspaces, API requests, or structured enterprise workflows, along with available attachments and session metadata.",
          condition: "At task entry",
          output: "Normalized task request"
        },
        {
          code: "Stage 02 / intent analysis",
          title: "Intent analysis",
          description:
            "Identifies the objective, explicit constraints, operational risk, and points of ambiguity before allocating additional resources.",
          condition: "Adaptive to task structure",
          output: "Intent and constraint profile"
        },
        {
          code: "Stage 03 / context engineering",
          title: "Context engineering",
          description:
            "Reconstructs task-relevant context from available history and attached files while filtering repeated or non-pertinent information.",
          condition: "Conditional on context needs",
          output: "Relevant context package"
        },
        {
          code: "Stage 04 / execution strategy",
          title: "Execution strategy",
          description:
            "Determines appropriate reasoning depth, model selection, provider routing, and whether verification checks are required.",
          condition: "According to task criteria",
          output: "Execution route and compute plan"
        },
        {
          code: "Stage 05 / model execution",
          title: "Model execution",
          description:
            "Executes through the designated model and available provider connection, including organization-owned credentials where supported.",
          condition: "Selected model execution",
          output: "Candidate response and telemetry"
        },
        {
          code: "Stage 06 / evaluation and verification",
          title: "Evaluation and verification",
          description:
            "Evaluates candidate output against applicable task constraints, formatting requirements, and available factual anchors.",
          condition: "Conditional on task risk",
          output: "Verification status and checks"
        },
        {
          code: "Stage 07 / final result",
          title: "Final result",
          description:
            "Delivers the task-oriented output alongside available execution status, model selection, token consumption, and cost information.",
          condition: "On completion",
          output: "Output and available telemetry"
        }
      ];

      const stageButtons = [...document.querySelectorAll("[data-stage]")];
      const pipelineModes = [...document.querySelectorAll("[data-pipeline-mode]")];

      function selectStage(index) {
        const stage = stageDetails[index];
        if (!stage) return;

        stageButtons.forEach((button, buttonIndex) => {
          const selected = buttonIndex === index;

          button.classList.toggle("is-selected", selected);
          button.setAttribute("aria-pressed", String(selected));
        });

        document.getElementById("stage-code").textContent = stage.code;
        document.getElementById("stage-title").textContent = stage.title;
        document.getElementById("stage-description").textContent =
          stage.description;
        document.getElementById("stage-condition").textContent =
          stage.condition;
        document.getElementById("stage-output").textContent = stage.output;
      }

      stageButtons.forEach((button) => {
        button.addEventListener("click", () => {
          selectStage(Number(button.dataset.stage));
        });
      });

      pipelineModes.forEach((button) => {
        button.addEventListener("click", () => {
          const direct = button.dataset.pipelineMode === "direct";

          pipelineModes.forEach((modeButton) => {
            const selected = modeButton === button;

            modeButton.classList.toggle("is-active", selected);
            modeButton.setAttribute("aria-pressed", String(selected));
          });

          [2, 5].forEach((index) => {
            stageButtons[index].classList.toggle("is-bypassed", direct);

            const label = document.querySelector(
              `[data-stage-condition="${index}"]`
            );

            label.textContent = direct ? "Bypassed" : "Conditional";
          });

          selectStage(direct ? 3 : 0);
        });
      });

      /* --------------------------------------------------------------------
         PROVIDER REGISTRY

         Replace each local SVG file with the official provider SVG when
         supplied. Missing files fall back to initials automatically.
         -------------------------------------------------------------------- */

      const providerRegistry = {
        dsrt:       { label: "DSRT AI" },
        openai:     { label: "OpenAI" },
        anthropic:  { label: "Anthropic" },
        google:     { label: "Google" },
        deepseek:   { label: "DeepSeek" },
        xai:        { label: "xAI" },
        mistral:    { label: "Mistral AI" },
        meta:       { label: "Meta" },
        cohere:     { label: "Cohere" },
        qwen:       { label: "Qwen" },
        moonshot:   { label: "Moonshot AI" },
        zai:        { label: "Z.ai" },
        minimax:    { label: "MiniMax" },
        nvidia:     { label: "NVIDIA" },
        ai21:       { label: "AI21 Labs" },
        aws:        { label: "AWS Bedrock" },
        azure:      { label: "Azure AI Foundry" },
        gcloud:     { label: "Google Vertex AI" },
        groq:       { label: "Groq" },
        together:   { label: "Together AI" },
        fireworks:  { label: "Fireworks AI" },
        openrouter: { label: "OpenRouter" },
        perplexity: { label: "Perplexity" }
      };

      const providerGrid = document.getElementById("provider-grid");

      function providerInitials(label) {
        return label
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .split(/\s+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((word) => word[0])
          .join("")
          .toUpperCase();
      }

      function selectProvider(key) {
        const provider = providerRegistry[key];
        if (!provider) return;

        providerGrid.querySelectorAll(".provider-button").forEach((button) => {
          const active = button.dataset.provider === key;

          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
        });

        document.getElementById("provider-inspector-label").textContent =
          `Provider registry / ${provider.label}`;

        document.getElementById("provider-inspector-title").textContent =
          provider.label;

        document.getElementById("provider-inspector-description").textContent =
          key === "dsrt"
            ? "The DSRT intelligence layer coordinates task understanding, execution, and available model integrations."
            : `${provider.label} is shown as an illustrative ecosystem entry. Connectivity, credentials, model availability, and telemetry depend on the deployed DSRT registry.`;
      }

      Object.entries(providerRegistry).forEach(([key, provider], index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "provider-button";
        button.dataset.provider = key;
        button.setAttribute("aria-pressed", String(index === 0));

        if (index === 0) {
          button.classList.add("is-active");
        }

        const logoWrap = document.createElement("span");
        logoWrap.className = "provider-logo-wrap";
        logoWrap.setAttribute("aria-hidden", "true");

        const logo = document.createElement("img");
        logo.src = `assets/providers/${key}.svg`;
        logo.alt = "";
        logo.loading = "lazy";

        logo.addEventListener("error", () => {
          logo.remove();
          logoWrap.textContent = providerInitials(provider.label);
        });

        const name = document.createElement("span");
        name.className = "provider-name";
        name.textContent = provider.label;

        logoWrap.appendChild(logo);
        button.append(logoWrap, name);

        button.addEventListener("click", () => selectProvider(key));
        providerGrid.appendChild(button);
      });

      /* --------------------------------------------------------------------
         WAR MODE SCENARIOS
         -------------------------------------------------------------------- */

      const scenarios = [
        {
          nativeOutput:
            "Full prompt and unpruned attachment context sent directly in a single call. The output contains a narrative summary but leaves edge-case clauses unchecked against source bounds.",
          nativeInput: "Full unpruned context",
          nativeFormat: "Unconstrained length",
          nativeCost: "Baseline provider billing",
          nativeQuality: "Unverified baseline response",
          dsrtOutput:
            "Relevant clauses extracted before model execution; reasoning budget aligned to discrepancies; verification checks clause citations against supplied source sections.",
          dsrtTokens: "Scoped context and trace",
          dsrtCost: "Measured per execution",
          dsrtQuality: "Evaluated against criteria",
          dsrtVerification: "Checks recorded"
        },
        {
          nativeOutput:
            "Raw spreadsheet rows are passed without schema isolation. The model produces commentary and variance figures without an automated arithmetic check.",
          nativeInput: "Full raw table context",
          nativeFormat: "Narrative and tables",
          nativeCost: "Selected model rate",
          nativeQuality: "Manual validation required",
          dsrtOutput:
            "Variance fields are normalized before execution; calculation criteria are included in the strategy; output is checked against source totals where applicable.",
          dsrtTokens: "Filtered schema and checks",
          dsrtCost: "Measured per execution",
          dsrtQuality: "Structured criteria",
          dsrtVerification: "Arithmetic checks"
        },
        {
          nativeOutput:
            "A short categorization task is executed directly on the default workspace model. The output provides a baseline for task correctness.",
          nativeInput: "Minimal prompt context",
          nativeFormat: "Brief categorical output",
          nativeCost: "Default model tier rate",
          nativeQuality: "Baseline task result",
          dsrtOutput:
            "Intent analysis identifies low complexity; the example lightweight path bypasses heavy context reconstruction and verification, routing to an appropriately sized model.",
          dsrtTokens: "Minimal overhead allocation",
          dsrtCost: "Measured per execution",
          dsrtQuality: "Compared against baseline",
          dsrtVerification: "Intentionally bypassed"
        }
      ];

      const scenarioButtons = [...document.querySelectorAll("[data-scenario]")];

      function setScenario(index) {
        const scenario = scenarios[index];
        if (!scenario) return;

        scenarioButtons.forEach((button) => {
          const active = Number(button.dataset.scenario) === index;

          button.classList.toggle("is-active", active);
          button.setAttribute("aria-pressed", String(active));
        });

        const fields = {
          "native-output": scenario.nativeOutput,
          "native-input": scenario.nativeInput,
          "native-format": scenario.nativeFormat,
          "native-cost": scenario.nativeCost,
          "native-quality": scenario.nativeQuality,
          "dsrt-output": scenario.dsrtOutput,
          "dsrt-tokens": scenario.dsrtTokens,
          "dsrt-cost": scenario.dsrtCost,
          "dsrt-quality": scenario.dsrtQuality,
          "dsrt-verification": scenario.dsrtVerification
        };

        Object.entries(fields).forEach(([id, value]) => {
          document.getElementById(id).textContent = value;
        });
      }

      scenarioButtons.forEach((button) => {
        button.addEventListener("click", () => {
          setScenario(Number(button.dataset.scenario));
        });
      });

      /* --------------------------------------------------------------------
         INDUSTRY ACCORDIONS
         -------------------------------------------------------------------- */

      document.querySelectorAll(".industry-trigger").forEach((trigger, index) => {
        const article = trigger.closest(".industry");
        const detail = article.querySelector(".industry-detail");
        const icon = trigger.querySelector(".industry-icon");

        detail.id = `industry-detail-${index + 1}`;
        trigger.setAttribute("aria-controls", detail.id);

        trigger.addEventListener("click", () => {
          const open = article.classList.toggle("is-open");

          trigger.setAttribute("aria-expanded", String(open));
          icon.textContent = open ? "−" : "+";
        });
      });

      /* --------------------------------------------------------------------
         DIALOGS
         -------------------------------------------------------------------- */

      const contactDialog = document.getElementById("contact-dialog");
      const workspaceDialog = document.getElementById("workspace-dialog");

      document.querySelectorAll("[data-open-contact]").forEach((button) => {
        button.addEventListener("click", () => {
          closeDrawer();
          contactDialog.showModal();
        });
      });

      document.getElementById("workspace-preview").addEventListener(
        "click",
        () => workspaceDialog.showModal()
      );

      document.querySelectorAll("[data-close-dialog]").forEach((button) => {
        button.addEventListener("click", () => {
          const dialog = button.closest("dialog");
          if (dialog) dialog.close();
        });
      });

      [contactDialog, workspaceDialog].forEach((dialog) => {
        dialog.addEventListener("click", (event) => {
          if (event.target !== dialog) return;

          const rect = dialog.getBoundingClientRect();

          const outside =
            event.clientX < rect.left ||
            event.clientX > rect.right ||
            event.clientY < rect.top ||
            event.clientY > rect.bottom;

          if (outside) dialog.close();
        });
      });

      /* --------------------------------------------------------------------
         FOOTER YEAR
         -------------------------------------------------------------------- */

      document.getElementById("copyright-year").textContent =
        String(new Date().getFullYear());
    })();
