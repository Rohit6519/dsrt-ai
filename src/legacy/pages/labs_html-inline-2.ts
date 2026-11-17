// @ts-nocheck
(function () {
      'use strict';

      /* ===================================================================
         HELPERS
         =================================================================== */

      const $ = (s, c = document) => c.querySelector(s);
      const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
      const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
      const smoothstep = (t) => t * t * (3 - 2 * t);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const nav = $('#nav');

      $$('[data-year]').forEach(el => {
        el.textContent = new Date().getFullYear();
      });

      /* ===================================================================
         NAV STATE
         =================================================================== */

      function updateNav() {
        nav.classList.toggle('scrolled', window.scrollY > 40);
      }

      /* ===================================================================
         REVEALS
         =================================================================== */

      const revealObserver = new IntersectionObserver((entries) => {
        let order = 0;

        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const el = entry.target;

          setTimeout(() => el.classList.add('in'), order++ * 110);
          revealObserver.unobserve(el);
        });
      }, { threshold: 0.15 });

      $$('.reveal').forEach(el => revealObserver.observe(el));

      /* ===================================================================
         ENVIRONMENT ENGINE
         One smoothed position drives every environment component.
         =================================================================== */

      const HOLD = 0.62;
      const SMOOTH = 9;
      const WHEEL_STEP = 19;
      const COMPACT_QUERY = window.matchMedia('(max-width: 1080px)');

      let compact = COMPACT_QUERY.matches;

      const envs = $$('.env').map((el) => {
        const chapter = document.getElementById(el.dataset.env);

        return {
          el,
          key: el.dataset.env,
          name: el.dataset.name,
          side: el.dataset.side,
          chapter,
          blurb: chapter
            ? $('.chapter-copy', chapter).textContent.replace(/\s+/g, ' ').trim()
            : '',
          stage: $('.env-stage', el),
          slides: $$('.bg-slide', el),
          panels: $$('.topic-panel', el),
          items: $$('.wheel-item', el),
          segs: $$('.seg', el),
          counter: $('[data-count]', el),
          n: $$('.bg-slide', el).length,
          pos: 0,
          target: 0,
          rendered: -1,
          active: -1,
          dirty: true,
          R: 320
        };
      });

      /* Scroll progress to topic position, including dwell plateaus. */

      function toPos(progress, n) {
        const u = clamp(progress, 0, 1) * n;
        const i = Math.min(Math.floor(u), n - 1);

        if (i >= n - 1) return n - 1;

        const f = u - i;
        const t = clamp((f - HOLD) / (1 - HOLD), 0, 1);

        return i + smoothstep(t);
      }

      /* Middle of the selected topic's dwell plateau. */

      function dwellProgress(i, n) {
        return (i + HOLD * 0.5) / n;
      }

      function measureEnv(e) {
        const rect = e.el.getBoundingClientRect();
        const range = Math.max(rect.height - e.stage.offsetHeight, 1);

        return {
          rect,
          range,
          progress: clamp(-rect.top / range, 0, 1)
        };
      }

      function jumpTo(e, i) {
        const { rect, range } = measureEnv(e);
        const y = window.scrollY + rect.top + dwellProgress(i, e.n) * range;

        window.scrollTo({
          top: y,
          behavior: reduceMotion ? 'auto' : 'smooth'
        });
      }

      /* Render: every component is a function of e.pos. */

      function render(e) {
        const { pos, n } = e;
        const k = Math.min(Math.floor(pos), n - 1);
        const f = k >= n - 1 ? 0 : pos - k;

        /* 1. Background cross-dissolve. */

        for (let i = 0; i < n; i++) {
          const d = clamp(i - pos, -1, 1);
          const o = i === k ? 1 : (i === k + 1 ? f : 0);
          const s = e.slides[i].style;

          s.opacity = o.toFixed(3);
          s.zIndex = i;
          s.transform =
            'translate3d(0,' +
            (d * 26).toFixed(2) +
            'px,0) scale(' +
            (1.06 + 0.05 * Math.abs(d)).toFixed(4) +
            ')';
        }

        /* 2. Text-panel fade and staggered rise. */

        for (let i = 0; i < n; i++) {
          const d = i - pos;
          const o = clamp(1 - Math.abs(d) * 1.9, 0, 1);
          const p = e.panels[i];

          p.style.opacity = o.toFixed(3);
          p.style.visibility = o < 0.01 ? 'hidden' : 'visible';
          p.style.pointerEvents = o > 0.6 ? 'auto' : 'none';
          p.style.setProperty('--d', clamp(d, -1, 1).toFixed(4));
        }

        /* 3. Desktop wheel / compact selector. */

        const dir = e.side === 'left' ? 1 : -1;
        const R = e.R;

        for (let i = 0; i < n; i++) {
          const d = i - pos;
          const ad = Math.abs(d);
          const opacity = clamp(1 - ad * 0.66, 0.14, 1);
          const scale = 1 - 0.13 * Math.min(ad, 1.4);

          let tx = 0;
          let ty;
          let rot = 0;

          if (compact) {
            ty = d * 48;
          } else {
            const th = d * WHEEL_STEP * Math.PI / 180;

            tx = dir * R * (Math.cos(th) - 1);
            ty = R * Math.sin(th);
            rot = dir * d * WHEEL_STEP;
          }

          const s = e.items[i].style;

          s.opacity = opacity.toFixed(3);
          s.transform =
            'translate3d(' +
            tx.toFixed(2) +
            'px, calc(-50% + ' +
            ty.toFixed(2) +
            'px), 0) ' +
            'rotate(' +
            rot.toFixed(3) +
            'deg) scale(' +
            scale.toFixed(4) +
            ')';
        }

        /* 4. Progress segments. */

        for (let i = 0; i < n; i++) {
          const fill = clamp(pos - i + 1, 0, 1);

          e.segs[i].style.setProperty('--fill', fill.toFixed(4));
        }

        /* 5. Discrete state. */

        const act = clamp(Math.round(pos), 0, n - 1);

        if (act !== e.active) {
          e.active = act;

          e.items.forEach((it, i) => {
            it.classList.toggle('is-active', i === act);

            if (i === act) {
              it.setAttribute('aria-current', 'true');
            } else {
              it.removeAttribute('aria-current');
            }
          });

          e.segs.forEach((sg, i) => {
            sg.classList.toggle('is-active', i === act);
          });

          e.panels.forEach((p, i) => {
            p.setAttribute('aria-hidden', i === act ? 'false' : 'true');
          });

          if (e.counter) {
            e.counter.textContent = String(act + 1).padStart(2, '0');
          }
        }
      }

      /* Animation runs only while a component is moving. */

      let raf = 0;
      let lastTime = 0;

      function tick(now) {
        raf = 0;

        const dt = Math.min((now - lastTime) / 1000, 0.05);

        lastTime = now;

        const vh = window.innerHeight;

        let busy = false;

        for (const e of envs) {
          const m = measureEnv(e);

          e.target = toPos(m.progress, e.n);

          const near =
            m.rect.top < vh * 1.2 &&
            m.rect.bottom > -vh * 0.2;

          if (!near || reduceMotion) {
            e.pos = e.target;
          } else {
            const diff = e.target - e.pos;

            if (Math.abs(diff) < 0.0008) {
              e.pos = e.target;
            } else {
              e.pos += diff * (1 - Math.exp(-dt * SMOOTH));
              busy = true;
            }
          }

          if (e.dirty || e.pos !== e.rendered) {
            render(e);
            e.rendered = e.pos;
            e.dirty = false;
          }
        }

        if (busy) {
          raf = requestAnimationFrame(tick);
        }
      }

      function kick() {
        if (raf) return;

        lastTime = performance.now();
        raf = requestAnimationFrame(tick);
      }

      function layout() {
        compact = COMPACT_QUERY.matches;

        const w = window.innerWidth;
        const h = window.innerHeight;
        const R = clamp(Math.min(h * 0.33, w * 0.24), 230, 360);

        envs.forEach((e) => {
          e.R = R;
          e.el.style.setProperty('--R', R + 'px');
          e.dirty = true;
        });

        kick();
      }

      /* Wheel and progress-button navigation. */

      envs.forEach((e) => {
        $$('[data-goto]', e.el).forEach((btn) => {
          btn.addEventListener('click', () => {
            jumpTo(e, parseInt(btn.dataset.goto, 10));
          });
        });
      });

      window.addEventListener('scroll', () => {
        updateNav();
        kick();
      }, { passive: true });

      window.addEventListener('resize', layout);
      COMPACT_QUERY.addEventListener('change', layout);
      window.addEventListener('load', layout);

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(layout);
      }

      updateNav();
      layout();

      /* ===================================================================
         OVERLAYS — ONE OPEN AT A TIME
         =================================================================== */

      const layers = {
        menu: {
          el: $('#menu'),
          btn: $('#menuBtn')
        },
        search: {
          el: $('#search'),
          btn: $('#searchBtn')
        },
        cookie: {
          el: $('#cookie'),
          btn: null
        }
      };

      Object.values(layers).forEach(L => {
        L.el.inert = true;
      });

      let openLayer = null;
      let lastFocus = null;

      function openL(name) {
        if (openLayer === name) return;

        closeL(true);

        const L = layers[name];

        openLayer = name;
        lastFocus = document.activeElement;

        L.el.inert = false;
        L.el.classList.add('open');
        L.el.setAttribute('aria-hidden', 'false');

        document.body.classList.add('is-locked');
        nav.classList.toggle('layer-open', name === 'menu');

        if (L.btn) {
          L.btn.setAttribute('aria-expanded', 'true');
        }

        const focusTarget = $('[data-autofocus]', L.el);

        if (focusTarget) {
          setTimeout(() => focusTarget.focus(), 80);
        }

        if (name === 'search') {
          renderResults('');
        }
      }

      function closeL(silent) {
        if (!openLayer) return;

        const L = layers[openLayer];

        L.el.classList.remove('open');
        L.el.setAttribute('aria-hidden', 'true');
        L.el.inert = true;

        document.body.classList.remove('is-locked');
        nav.classList.remove('layer-open');

        if (L.btn) {
          L.btn.setAttribute('aria-expanded', 'false');
        }

        openLayer = null;

        if (!silent && lastFocus && lastFocus.focus) {
          lastFocus.focus();
        }
      }

      $('#menuBtn').addEventListener('click', () => {
        if (openLayer === 'menu') {
          closeL();
        } else {
          openL('menu');
        }
      });

      $('#searchBtn').addEventListener('click', () => {
        if (openLayer === 'search') {
          closeL();
        } else {
          openL('search');
        }
      });

      $$('[data-open]').forEach(b => {
        b.addEventListener('click', () => openL(b.dataset.open));
      });

      $$('[data-close]').forEach(b => {
        b.addEventListener('click', () => closeL());
      });

      $$('.menu-link').forEach(a => {
        a.addEventListener('click', () => closeL(true));
      });

      document.addEventListener('keydown', (ev) => {
        if (ev.key === 'Escape') {
          closeL();
        }

        if (
          ev.key === '/' &&
          !openLayer &&
          !/input|textarea/i.test(document.activeElement.tagName)
        ) {
          ev.preventDefault();
          openL('search');
        }
      });

      /* ===================================================================
         SEARCH
         =================================================================== */

      const sInput = $('#searchInput');
      const sList = $('#searchResults');
      const entries = [];

      envs.forEach((e) => {
        entries.push({
          kind: 'Environment',
          title: e.name,
          text: e.blurb,
          go: () => {
            if (e.chapter) {
              e.chapter.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'start'
              });
            }
          }
        });

        e.panels.forEach((p, i) => {
          entries.push({
            kind: e.name,
            title: $('.topic-title', p).textContent.trim(),
            text: $('.topic-lead', p).textContent.replace(/\s+/g, ' ').trim(),
            go: () => jumpTo(e, i)
          });
        });
      });

      let results = [];
      let selected = 0;

      function renderResults(q) {
        const words = q.toLowerCase().split(/\s+/).filter(Boolean);

        results = entries.filter((en) => {
          const hay = (
            en.kind + ' ' +
            en.title + ' ' +
            en.text
          ).toLowerCase();

          return words.every(w => hay.includes(w));
        });

        selected = 0;
        sList.innerHTML = '';

        if (!results.length) {
          const div = document.createElement('div');

          div.className = 'search-empty';
          div.textContent = 'No matching topics.';

          sList.appendChild(div);

          return;
        }

        results.forEach((r, idx) => {
          const b = document.createElement('button');

          b.type = 'button';
          b.setAttribute('role', 'option');
          b.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');

          const a = document.createElement('span');

          a.className = 'sr-env';
          a.textContent = r.kind;

          const t = document.createElement('span');

          t.className = 'sr-title';
          t.textContent = r.title;

          const x = document.createElement('span');

          x.className = 'sr-text';
          x.textContent = r.text;

          b.append(a, t, x);
          b.addEventListener('mouseenter', () => select(idx));
          b.addEventListener('click', () => choose(idx));

          sList.appendChild(b);
        });
      }

      function select(idx) {
        const btns = $$('button', sList);

        if (!btns.length) return;

        selected = (idx + btns.length) % btns.length;

        btns.forEach((b, i) => {
          b.setAttribute('aria-selected', i === selected ? 'true' : 'false');
        });

        btns[selected].scrollIntoView({
          block: 'nearest'
        });
      }

      function choose(idx) {
        const r = results[idx];

        if (!r) return;

        closeL(true);
        setTimeout(r.go, 60);
      }

      sInput.addEventListener('input', () => {
        renderResults(sInput.value);
      });

      sInput.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowDown') {
          ev.preventDefault();
          select(selected + 1);
        } else if (ev.key === 'ArrowUp') {
          ev.preventDefault();
          select(selected - 1);
        } else if (ev.key === 'Enter') {
          ev.preventDefault();
          choose(selected);
        }
      });

      /* ===================================================================
         COOKIE SETTINGS — STORED LOCALLY
         =================================================================== */

      const COOKIE_KEY = 'dsrt-cookie-prefs';
      const boxes = $$('#cookie input[data-pref]');

      function loadPrefs() {
        try {
          return JSON.parse(localStorage.getItem(COOKIE_KEY)) || null;
        } catch (err) {
          return null;
        }
      }

      function savePrefs(p) {
        try {
          localStorage.setItem(COOKIE_KEY, JSON.stringify(p));
        } catch (err) {
          /* Storage may be unavailable in restricted browser contexts. */
        }
      }

      function applyPrefs(p) {
        boxes.forEach((b) => {
          b.checked = b.disabled ? true : !!(p && p[b.dataset.pref]);
        });
      }

      function collectPrefs() {
        const p = {};

        boxes.forEach((b) => {
          p[b.dataset.pref] = b.checked;
        });

        p.essential = true;

        return p;
      }

      applyPrefs(loadPrefs());

      $$('[data-cookie]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const action = btn.dataset.cookie;

          if (action === 'accept') {
            boxes.forEach(b => {
              b.checked = true;
            });
          }

          if (action === 'reject') {
            boxes.forEach(b => {
              b.checked = b.disabled;
            });
          }

          savePrefs(collectPrefs());
          closeL();
        });
      });

    })();
