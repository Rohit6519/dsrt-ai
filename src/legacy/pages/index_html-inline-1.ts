// @ts-nocheck
/* =========================================================
   ASSET PATHS
   ========================================================= */

const ASSET_PATHS = {
    backgrounds: {
        'BG 1 · page 1 (hero + dashboard)': 'assets/images/backgrounds/bg-1-hero.jpg',
        'BG 2 · pages 2–5 (shared, native 1920×1020)': 'assets/images/backgrounds/bg-2-story.jpg',
        'BG 3 · footer (raw, no filter)': 'assets/images/backgrounds/bg-3-footer.jpg'
    },
    sections: {
        'Page 2 · build': 'assets/images/sections/build.png',
        'Page 4 · principle': 'assets/images/sections/principle.png',
        'Page 5 · intelligence': 'assets/images/sections/intelligence.png',
        'Page 6 · verification': 'assets/images/sections/verification.png'
    },
    logos: {
        'Dsrt AI logo (nav, footer, dashboard, panels, core)': 'assets/dsrt-logo.png'
    },
    site: {
        'Favicon + apple touch icon': 'assets/dsrt-logo.png',
        'Icon placeholder': 'assets/icons/placeholder.svg',
        'Social preview': 'assets/images/og-image.png'
    }
};

/* =========================================================
   DSRT AI LOGO
   ========================================================= */

const DSRT_LOGO = 'assets/dsrt-logo.png';

function dsrtLogoImgHtml(altText = 'Dsrt AI') {
    return `<img class="icon-img dsrt-logo-img" src="${DSRT_LOGO}" alt="${escapeHtml(altText)}" onerror="this.style.visibility='hidden'">`;
}

/* =========================================================
   ICON CONFIGURATION
   ========================================================= */

const ICON_BASE = 'assets/icons';
const PLACEHOLDER_ICON_BASE = `${ICON_BASE}/placeholder`;

function slugify(value) {
    return String(value)
        .toLowerCase()
        .replace(/\+/g, ' plus ')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function providerIconBase(key) {
    return `${ICON_BASE}/providers/${slugify(key)}`;
}

function iconImgHtml(basePath, altText) {
    return `<img class="icon-img"
                 src="${escapeHtml(basePath)}.svg"
                 data-base="${escapeHtml(basePath)}"
                 data-step="0"
                 alt="${escapeHtml(altText)}"
                 onerror="iconFallback(this)">`;
}

function providerIconInner(providerKey, altText) {
    if (providerKey === 'dsrt') return dsrtLogoImgHtml(altText || 'Dsrt AI');
    return iconImgHtml(providerIconBase(providerKey), altText);
}

function iconFallback(img) {
    const base = img.dataset.base;
    const chain = [
        `${base}.svg`,
        `${base}.png`,
        `${PLACEHOLDER_ICON_BASE}.svg`,
        `${PLACEHOLDER_ICON_BASE}.png`
    ];

    const next = Number(img.dataset.step || 0) + 1;

    if (next < chain.length) {
        img.dataset.step = next;
        img.src = chain[next];
    } else {
        img.onerror = null;
        img.style.visibility = 'hidden';
    }
}

window.iconFallback = iconFallback;

/* =========================================================
   SECTION IMAGE FALLBACK
   ========================================================= */

const SECTION_IMG_EXTS = ['png', 'webp', 'jpg', 'jpeg'];

function sectionImgFallback(img) {
    const base = img.dataset.base;
    const next = Number(img.dataset.step || 0) + 1;

    if (next < SECTION_IMG_EXTS.length) {
        img.dataset.step = next;
        img.src = `${base}.${SECTION_IMG_EXTS[next]}`;
    } else {
        img.onerror = null;
        img.remove();
    }
}

window.sectionImgFallback = sectionImgFallback;

/* =========================================================
   PROVIDER REGISTRY (providers only — no model names)
   ========================================================= */

const providerRegistry = {
    dsrt:       { label: 'Dsrt AI' },
    openai:     { label: 'OpenAI' },
    anthropic:  { label: 'Anthropic' },
    google:     { label: 'Google' },
    deepseek:   { label: 'DeepSeek' },
    xai:        { label: 'xAI' },
    mistral:    { label: 'Mistral AI' },
    meta:       { label: 'Meta' },
    cohere:     { label: 'Cohere' },
    qwen:       { label: 'Qwen' },
    moonshot:   { label: 'Moonshot AI' },
    zai:        { label: 'Z.ai' },
    minimax:    { label: 'MiniMax' },
    nvidia:     { label: 'NVIDIA' },
    ai21:       { label: 'AI21 Labs' },
    aws:        { label: 'AWS Bedrock' },
    azure:      { label: 'Azure AI Foundry' },
    gcloud:     { label: 'Google Vertex AI' },
    groq:       { label: 'Groq' },
    together:   { label: 'Together AI' },
    fireworks:  { label: 'Fireworks AI' },
    openrouter: { label: 'OpenRouter' },
    perplexity: { label: 'Perplexity' }
};

/* =========================================================
   ROUTING MODES (replaces specific model names in the demo)
   ========================================================= */

const routeModes = {
    auto:     { label: 'Auto-route',         short: 'Auto-route' },
    premium:  { label: 'Premium reasoning',  short: 'Premium reasoning' },
    balanced: { label: 'Balanced',           short: 'Balanced' },
    economy:  { label: 'Economy',            short: 'Economy' }
};

/* =========================================================
   RAW PANEL — provider per scenario (no model names)
   ========================================================= */

const rawScenarioProviders = {
    ev:         'openai',
    earnings:   'anthropic',
    saas:       'google',
    competitor: 'mistral',
    inference:  'aws'
};

/* =========================================================
   ASSET LISTING HELPER
   ========================================================= */

function listAssetPaths() {
    const rows = [];
    const add = (group, slot, path) => rows.push({ group, slot, path });

    Object.entries(ASSET_PATHS.backgrounds).forEach(([slot, path]) => add('background', slot, path));
    Object.entries(ASSET_PATHS.sections).forEach(([slot, path]) => add('section image', slot, path));
    Object.entries(ASSET_PATHS.logos).forEach(([slot, path]) => add('logo', slot, path));
    Object.entries(ASSET_PATHS.site).forEach(([slot, path]) => add('site', slot, path));

    Object.keys(providerRegistry).forEach(key => {
        const path = key === 'dsrt' ? DSRT_LOGO : `${providerIconBase(key)}.svg  (or .png)`;
        add('provider icon', providerRegistry[key].label, path);
    });

    console.table(rows);
    return rows;
}

window.listAssetPaths = listAssetPaths;

/* =========================================================
   SCENARIO DATA
   ========================================================= */

const scenarios = {
    ev: {
        title: 'The Future of Electric Vehicles',
        meta: 'Market analysis · Same task · Paired comparison',
        quality: '91.4',
        qualityChange: '+18.7 pts',
        efficiency: '+32%',
        completion: '100%',
        rawTokens: '612 tokens',
        ampTokens: '824 tokens',

        raw: `<h3>The Future of Electric Vehicles (2019–2024)</h3>
<p>The global electric vehicle (EV) market has seen steady growth over the past five years, driven by rising environmental awareness, government incentives, and improvements in battery technology. In 2019, the market was relatively small, with around 2.1 million units sold. By 2024, sales are expected to reach approximately 17.1 million units, representing a CAGR of about 51%.</p>
<h4>Key Growth Drivers</h4>
<ul><li>Government incentives and subsidies</li><li>Declining battery costs</li><li>Expanding charging infrastructure</li><li>Growing environmental awareness</li></ul>
<h4>Challenges</h4>
<ul><li>High upfront costs</li><li>Supply chain constraints (e.g., battery materials)</li><li>Limited charging infrastructure in some regions</li><li>Policy and regulatory uncertainty</li></ul>
<h4>Outlook</h4>
<p>The EV market is expected to continue growing, with projections reaching 25–30 million units by 2030. Growth will be driven by improved battery technology, expanded charging networks, and stronger government policies.</p>
<p>As automakers commit hundreds of billions to electrification, the internal combustion engine is slowly being phased out in key markets. Several countries have already announced bans on new ICE vehicle sales by 2030–2035.</p>
<p>However, challenges remain including raw material supply, grid capacity, and consumer adoption in developing markets.</p>`,

        amp: `<h3>Global EV Market: 2019–2024</h3>
<h4>1. Executive Assessment</h4>
<p>Global EV sales increased substantially over the period. Using the supplied figures:</p>
<table><thead><tr><th>Metric</th><th>2019</th><th>2024</th></tr></thead>
<tbody><tr><td>EV sales</td><td class="mono-val">2.1M</td><td class="mono-val">17.1M</td></tr>
<tr><td>Absolute increase</td><td>—</td><td class="mono-val">15.0M</td></tr>
<tr><td>Growth multiple</td><td>—</td><td class="mono-val">8.14×</td></tr></tbody></table>
<div class="calc-block">Five-year CAGR: (17.1 / 2.1)^(1/5) − 1 ≈ <strong style="color:white;">52.1%</strong></div>
<h4>2. Structural Growth Drivers</h4>
<ol><li><strong>Policy support:</strong> Purchase incentives, tax credits and emissions requirements</li>
<li><strong>Battery economics:</strong> Declining battery costs improve affordability</li>
<li><strong>Infrastructure:</strong> Charging availability reduces adoption friction</li>
<li><strong>Product economics:</strong> Broader product selection and improved vehicle performance</li></ol>
<h4>3. Key Economic Risks</h4>
<table><thead><tr><th>Risk</th><th>Economic Consequence</th></tr></thead>
<tbody><tr><td>Battery material volatility</td><td>Higher production costs</td></tr>
<tr><td>Subsidy withdrawal</td><td>Demand sensitivity</td></tr>
<tr><td>Charging gaps</td><td>Slower adoption</td></tr>
<tr><td>Price competition</td><td>Margin compression</td></tr>
<tr><td>Grid constraints</td><td>Infrastructure investment</td></tr></tbody></table>
<div class="callout"><strong>📊 Note:</strong> Regional sales should only be displayed when a consistent source and definition are provided. Separate BEVs from PHEVs, and avoid mixing regional registration data with global sales.</div>
<h4>4. 2030 Outlook</h4>
<p>Present conservative, base and optimistic scenarios using explicit assumptions about adoption, battery prices, infrastructure and policy support.</p>
<h4>5. Decision Conclusion</h4>
<p>EV market expansion is a strong structural trend, but market growth alone does not establish automaker profitability. Investors should evaluate <strong>unit margins, capital expenditure, market share and pricing pressure</strong> separately.</p>
<div class="callout-warning">⚠️ The original output's unsupported regional breakdown and speculative battery technology claims have been flagged. Only traceable data or explicitly labelled assumptions are included.</div>`
    },

    earnings: {
        title: 'Q3 Earnings — Northstar Components',
        meta: 'Financial reasoning · Performance analysis · Paired comparison',
        quality: '88.6',
        qualityChange: '+22.1 pts',
        efficiency: '+41%',
        completion: '100%',
        rawTokens: '487 tokens',
        ampTokens: '892 tokens',

        raw: `<h3>Northstar Components Q3 Results</h3>
<p>Revenue increased from $108 million to $120 million, showing positive growth.</p>
<p>EBITDA increased from $13 million to $14.4 million, indicating improved operating earnings.</p>
<p>Gross margin decreased from 40% to 38%, suggesting some cost pressure.</p>
<p>Backlog increased to $410 million, which may indicate stronger future demand.</p>
<p>However, free cash flow became negative at -$3.2 million.</p>
<p>Overall, the company demonstrated strong revenue growth, but profitability and cash flow should be monitored.</p>`,

        amp: `<h3>Northstar Components — Q3 Financial Assessment</h3>
<h4>1. Revenue Performance</h4>
<div class="calc-block">(120 − 108) / 108 × 100 = <strong style="color:white;">11.11%</strong> quarter-over-quarter growth</div>
<p>Revenue increased by <strong>$12M</strong>, or 11.11% QoQ.</p>
<h4>2. Margin Deterioration</h4>
<table><thead><tr><th>Metric</th><th>Q2</th><th>Q3</th><th>Change</th></tr></thead>
<tbody><tr><td>Revenue</td><td class="mono-val">$108M</td><td class="mono-val">$120M</td><td class="mono-val">+11.1%</td></tr>
<tr><td>Gross margin</td><td class="mono-val">40%</td><td class="mono-val">38%</td><td class="mono-val">-200 bps</td></tr>
<tr><td>Gross profit</td><td class="mono-val">$43.2M</td><td class="mono-val">$45.6M</td><td class="mono-val">+5.56%</td></tr>
<tr><td>EBITDA</td><td class="mono-val">$13M</td><td class="mono-val">$14.4M</td><td class="mono-val">+10.77%</td></tr>
<tr><td>EBITDA margin</td><td class="mono-val">12.04%</td><td class="mono-val">12.00%</td><td class="mono-val">-4 bps</td></tr></tbody></table>
<p><strong>Interpretation:</strong> The business generated more gross profit in absolute terms, but incremental revenue came with weaker gross profitability.</p>
<h4>3. Cash Flow Warning</h4>
<div class="callout-red">⚠️ <strong>Material Warning:</strong> Free cash flow changed from <strong>+$4.1M to -$3.2M</strong>. This represents a <strong>$7.3M negative swing</strong> despite higher reported revenue and EBITDA.</div>
<h4>4. Backlog</h4>
<div class="calc-block">Backlog increase: (410 − 360) / 360 × 100 = <strong style="color:white;">13.89%</strong></div>
<p>Increased pipeline, but does not independently establish future revenue recognition or collection.</p>
<h4>5. Management Questions</h4>
<ol><li>Why did gross margin contract by 200 basis points?</li>
<li>What drove the negative free cash flow?</li>
<li>Is backlog conversion improving?</li>
<li>Are inventory and receivables growing faster than revenue?</li></ol>
<h4>6. Final Assessment</h4>
<p>The quarter shows positive revenue momentum, but the combination of <strong>gross margin compression and negative free cash flow</strong> prevents an unqualified positive assessment.</p>`
    },

    saas: {
        title: 'SaaS Unit Economics Assessment',
        meta: 'Calculations · Business decision-making · Paired comparison',
        quality: '93.2',
        qualityChange: '+26.8 pts',
        efficiency: '+38%',
        completion: '100%',
        rawTokens: '341 tokens',
        ampTokens: '756 tokens',

        raw: `<h3>SaaS Unit Economics</h3>
<p>The SaaS company has recurring revenue of $550,000 per month and a gross margin of 78%.</p>
<p>CAC is $1,200 and monthly churn is 2.5%.</p>
<p>The company should improve customer retention, reduce acquisition costs and increase average revenue per customer.</p>
<p>It should also focus on upselling and expanding existing accounts to improve profitability.</p>`,

        amp: `<h3>SaaS Unit Economics Assessment</h3>
<h4>1. Gross Profit per Customer</h4>
<div class="calc-block">$100 × 78% = <strong style="color:white;">$78/month</strong></div>
<h4>2. Simplified Customer Lifetime</h4>
<div class="calc-block">L = 1 / 0.025 = <strong style="color:white;">40 months</strong></div>
<p>Using constant monthly churn and a simplified geometric lifetime assumption.</p>
<h4>3. Gross-Profit LTV</h4>
<div class="calc-block">LTV = $78 × 40 = <strong style="color:white;">$3,120</strong></div>
<h4>4. LTV:CAC Ratio</h4>
<div class="calc-block">3,120 / 1,200 = <strong style="color:white;">2.6×</strong></div>
<h4>5. CAC Payback Period</h4>
<div class="calc-block">1,200 / 78 = <strong style="color:white;">15.38 months</strong></div>
<div class="metrics-row">
<div class="metric-highlight"><div class="mh-label-sm">LTV:CAC</div><div class="mh-val-lg blue">2.6×</div></div>
<div class="metric-highlight"><div class="mh-label-sm">CAC Payback</div><div class="mh-val-lg">15.4 mo</div></div>
<div class="metric-highlight"><div class="mh-label-sm">Monthly Churn</div><div class="mh-val-lg red">2.5%</div></div>
</div>
<h4>6. Financial Interpretation</h4>
<p>The company generates <strong>$3,120</strong> of simplified gross-profit lifetime value against <strong>$1,200</strong> in acquisition cost.</p>
<h4>7. Biggest Weaknesses</h4>
<ul><li><strong>2.5% monthly churn</strong> creates a short implied customer lifetime</li>
<li><strong>15.4-month CAC payback</strong> creates a relatively long capital recovery period</li>
<li>Acquisition economics are sensitive to churn and gross margin</li></ul>
<h4>8. Recommended Priorities</h4>
<ol><li>Reduce monthly churn</li><li>Increase gross profit per account</li><li>Reduce CAC through improved acquisition efficiency</li><li>Measure cohort retention rather than relying only on average churn</li></ol>
<div class="callout-warning">⚠️ <strong>Important:</strong> This simplified LTV formula excludes expansion revenue, discounting, cohort differences, fixed operating costs and variation in churn. It should not be treated as a complete valuation model.</div>`
    },

    competitor: {
        title: 'Competitive Pricing & Value Analysis',
        meta: 'Strategic reasoning · Comparison · Paired comparison',
        quality: '89.7',
        qualityChange: '+24.3 pts',
        efficiency: '+35%',
        completion: '100%',
        rawTokens: '298 tokens',
        ampTokens: '671 tokens',

        raw: `<h3>Competitor Comparison</h3>
<p>Alpha is the cheapest product at $29 per month.</p>
<p>Beta costs $49 and provides more features.</p>
<p>Gamma costs $79 and has the most features.</p>
<p>Alpha may be suitable for budget-conscious customers, Beta for customers needing additional functionality and Gamma for customers who require the most features.</p>
<p>The best choice depends on the user's needs and budget.</p>`,

        amp: `<h3>Competitive Pricing & Value Analysis</h3>
<h4>1. Price-to-Feature Comparison</h4>
<table><thead><tr><th>Product</th><th>Price</th><th>Features</th><th>Cost/Feature</th></tr></thead>
<tbody><tr><td>Alpha</td><td class="mono-val">$29</td><td class="mono-val">5</td><td class="mono-val">$5.80</td></tr>
<tr><td>Beta</td><td class="mono-val">$49</td><td class="mono-val">8</td><td class="mono-val">$6.13</td></tr>
<tr><td>Gamma</td><td class="mono-val">$79</td><td class="mono-val">10</td><td class="mono-val">$7.90</td></tr></tbody></table>
<h4>2. Relative Pricing</h4>
<ul><li>Beta costs <strong>69%</strong> more than Alpha</li>
<li>Gamma costs <strong>62%</strong> more than Beta</li>
<li>Gamma costs <strong>172%</strong> more than Alpha</li></ul>
<h4>3. Feature Expansion Efficiency</h4>
<div class="calc-block">Alpha → Beta: 3 features for $20 additional = <strong style="color:white;">$6.67/feature</strong>
Beta → Gamma: 2 features for $30 additional = <strong style="color:white;">$15.00/feature</strong></div>
<p><strong>Beta delivers the largest incremental feature count per additional dollar</strong> in this dataset.</p>
<h4>4. Commercial Interpretation</h4>
<ul><li><strong>Alpha:</strong> Strongest entry-price positioning</li>
<li><strong>Beta:</strong> Potentially attractive middle-tier positioning</li>
<li><strong>Gamma:</strong> Premium pricing, requiring stronger differentiation</li></ul>
<h4>5. Recommendation</h4>
<p>Beta appears to offer the most balanced feature expansion relative to the next lower tier.</p>
<div class="callout">📊 <strong>Important:</strong> Feature count alone does not measure product value. The importance, quality, usability and differentiation of each feature must also be evaluated.</div>
<h4>6. Information Still Needed</h4>
<ul><li>Feature-level comparison</li><li>Target customer segment</li><li>Usage limits</li><li>Customer retention data</li><li>Actual conversion and willingness-to-pay data</li></ul>`
    },

    inference: {
        title: 'AI Inference Cost Optimization',
        meta: 'Token economics · Cost optimization · Paired comparison',
        quality: '95.1',
        qualityChange: '+29.6 pts',
        efficiency: '+67%',
        completion: '100%',
        rawTokens: '267 tokens',
        ampTokens: '943 tokens',

        raw: `<h3>AI Inference Cost Reduction</h3>
<p>AI inference costs can be reduced by using cheaper tiers, optimizing prompts, caching repeated queries and routing simpler tasks to smaller models.</p>
<p>Companies should evaluate output quality before switching to cheaper alternatives.</p>
<p>A hybrid architecture can help balance cost and quality.</p>
<p>The company should monitor latency, accuracy and customer satisfaction after implementation.</p>`,

        amp: `<h3>Enterprise AI Inference Economics</h3>
<h4>1. Baseline: Premium Tier for Every Request</h4>
<table><thead><tr><th>Parameter</th><th>Value</th></tr></thead>
<tbody><tr><td>Monthly requests</td><td class="mono-val">1,000,000</td></tr>
<tr><td>Avg input tokens</td><td class="mono-val">1,500</td></tr>
<tr><td>Avg output tokens</td><td class="mono-val">500</td></tr>
<tr><td>Premium input price</td><td class="mono-val">$2/M tokens</td></tr>
<tr><td>Premium output price</td><td class="mono-val">$8/M tokens</td></tr></tbody></table>
<div class="calc-block">Input cost: 1,500M × $2/M = <strong style="color:white;">$3,000</strong>
Output cost: 500M × $8/M = <strong style="color:white;">$4,000</strong>
Total baseline: <strong style="color:white;">$7,000/month</strong></div>
<div class="metric-highlight"><div class="mh-label-sm">Baseline Monthly Cost</div><div class="mh-val-lg">$7,000</div></div>
<h4>2. Hybrid Routing Scenario</h4>
<p>Assume 80% of requests use an economy path, 20% use premium:</p>
<div class="calc-block">Economy path: 800K × $0.0007/req = <strong style="color:white;">$560</strong>
Premium path: 200K × $0.007/req = <strong style="color:white;">$1,400</strong>
Total inference: <strong style="color:white;">$1,960</strong></div>
<h4>3. Include DSRT Operating Overhead</h4>
<div class="calc-block">Amplification overhead: <strong style="color:white;">$300</strong>
Total: $1,960 + $300 = <strong style="color:white;">$2,260</strong></div>
<h4>4. Economic Outcome</h4>
<div class="metrics-row">
<div class="metric-highlight"><div class="mh-label-sm">Baseline</div><div class="mh-val-lg">$7,000</div></div>
<div class="metric-highlight"><div class="mh-label-sm">Hybrid + Overhead</div><div class="mh-val-lg hi">$2,260</div></div>
<div class="metric-highlight"><div class="mh-label-sm">Cost Reduction</div><div class="mh-val-lg hi">67.7%</div></div>
</div>
<div class="calc-block">Savings: $7,000 − $2,260 = <strong style="color:white;">$4,740/month</strong></div>
<h4>5. The Quality Constraint</h4>
<p>Cost reduction is not sufficient by itself. The hybrid architecture should only be accepted if it maintains the required task-quality threshold.</p>
<table><thead><tr><th>Criteria</th><th>Target</th></tr></thead>
<tbody><tr><td>Premium-only quality</td><td class="mono-val">92/100</td></tr>
<tr><td>Hybrid amplified target</td><td class="mono-val">≥ 90/100</td></tr>
<tr><td>Task completion</td><td class="mono-val">≥ 95%</td></tr>
<tr><td>Critical error rate</td><td class="mono-val">≤ agreed tolerance</td></tr></tbody></table>
<div class="callout-warning">⚠️ These are proposed evaluation thresholds, not measured results.</div>
<h4>6. Strategic Conclusion</h4>
<p>The opportunity is not simply replacing expensive tiers with cheaper ones. It is allocating the <strong>least expensive adequate inference path</strong> to each task while retaining sufficient reasoning, verification and task completion quality.</p>
<p>DSRT's economic value must be established through <strong>actual task-level quality and cost measurements</strong>, including all amplification overhead.</p>`
    }
};

/* =========================================================
   STATE
   ========================================================= */

let currentScenario = 'ev';
let isRecording = false;
let attachedFilesList = [];
let selectedProviderKey = 'openai';
let selectedRoute = 'auto';
let activeModal = null;

/* =========================================================
   UI HELPERS
   ========================================================= */

function scrollToDemo() {
    document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

function activateSidebarItem(element) {
    const modeItems = Array.from(document.querySelectorAll('.sidebar-item'))
        .filter(item => item.textContent.includes('Mode'));

    modeItems.forEach(item => item.classList.remove('active'));
    element.classList.add('active');

    showToast(`${element.textContent.trim()} selected`);
}

let toastTimer;

function showToast(message) {
    const toast = document.getElementById('toastMsg');
    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/* =========================================================
   ICON SLOT RENDERING
   ========================================================= */

function getProviderMeta(providerKey) {
    return providerRegistry[providerKey] || { label: providerKey };
}

function renderProviderIconSlot(providerKey, size = 'medium') {
    const provider = getProviderMeta(providerKey);
    return `<div class="provider-icon-slot ${size}" data-icon-slot="provider-${escapeHtml(slugify(providerKey))}">${providerIconInner(providerKey, provider.label)}</div>`;
}

function setIconSlot(elementId, innerHtml, size) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.className = `provider-icon-slot ${size}`;
    el.innerHTML = innerHtml;
}

function hydrateStaticProviderIcons() {
    const map = {
        'sys-openai': 'openai',
        'sys-anthropic': 'anthropic',
        'sys-aws': 'aws'
    };

    document.querySelectorAll('[data-icon-slot^="sys-"]').forEach(slot => {
        const key = map[slot.dataset.iconSlot];
        if (!key) return;
        slot.innerHTML = providerIconInner(key, getProviderMeta(key).label);
    });
}

/* =========================================================
   DROPDOWNS
   ========================================================= */

function toggleDropdown(id, event) {
    if (event) {
        if (event.target.closest && event.target.closest('.dropdown-menu')) return;
        event.stopPropagation();
    }

    const menu = document.getElementById(id);
    const isOpen = menu.classList.contains('show');

    closeAllDropdowns();

    if (!isOpen) {
        menu.classList.add('show');
        activeModal = id;
    }
}

function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu, .attachment-menu').forEach(menu => menu.classList.remove('show'));
    activeModal = null;
}

/* =========================================================
   PROVIDER DROPDOWN
   ========================================================= */

const providerSections = [
    {
        label: 'Direct Model Providers',
        keys: ['openai', 'anthropic', 'google', 'deepseek', 'xai', 'mistral', 'meta', 'cohere',
               'qwen', 'moonshot', 'zai', 'minimax', 'nvidia', 'ai21']
    },
    {
        label: 'Cloud AI Platforms',
        keys: ['aws', 'azure', 'gcloud']
    },
    {
        label: 'Inference Platforms',
        keys: ['groq', 'together', 'fireworks', 'openrouter', 'perplexity']
    },
    {
        label: 'Dsrt AI',
        keys: ['dsrt']
    }
];

function renderProviderDropdown() {
    const container = document.getElementById('providerDropdownItems');
    const parts = [];

    providerSections.forEach((section, idx) => {
        if (idx > 0) parts.push('<div class="dropdown-divider"></div>');
        parts.push(`<div class="dropdown-section-label">${escapeHtml(section.label)}</div>`);

        section.keys.forEach(key => {
            const provider = getProviderMeta(key);
            const selected = key === selectedProviderKey;

            parts.push(`
                <div class="dropdown-item ${selected ? 'selected' : ''}" data-provider="${escapeHtml(key)}">
                    <div class="di-icon">${renderProviderIconSlot(key, 'medium')}</div>
                    <span class="di-name">${escapeHtml(provider.label)}</span>
                </div>
            `);
        });
    });

    container.innerHTML = parts.join('');
}

function selectProvider(key) {
    selectedProviderKey = key;

    const provider = getProviderMeta(key);
    document.getElementById('selectedProviderName').textContent = provider.label;
    setIconSlot('selectedProviderIcon', providerIconInner(key, provider.label), 'small');

    renderProviderDropdown();
    closeAllDropdowns();

    showToast(`🔗 Provider: ${provider.label}`);
}

/* =========================================================
   ROUTE DROPDOWN (routing modes — no model names)
   ========================================================= */

function selectRoute(id) {
    if (!routeModes[id]) return;

    selectedRoute = id;
    const mode = routeModes[id];

    document.getElementById('selectedRouteName').textContent = mode.short;
    document.getElementById('promptRouteName').textContent = mode.short;

    const dot = document.getElementById('selectedRouteDot');
    if (dot) dot.classList.toggle('off', id !== 'auto');

    document.querySelectorAll('#routeDropdown .dropdown-item').forEach(item => {
        item.classList.toggle('selected', item.dataset.route === id);
        const d = item.querySelector('.route-dot');
        if (d) d.classList.toggle('off', item.dataset.route !== id);
    });

    closeAllDropdowns();
    showToast(`⚡ Routing: ${mode.label}`);
}

/* =========================================================
   RAW PANEL — provider fixed per scenario, no model names
   ========================================================= */

function applyRawPanelForScenario(scenarioId) {
    const providerKey = rawScenarioProviders[scenarioId];
    if (!providerKey) return;

    const provider = getProviderMeta(providerKey);

    document.getElementById('rawModelName').textContent = provider.label;
    document.getElementById('rawModelSub').textContent = 'Single-provider baseline · Native output';

    setIconSlot('rawPanelIcon', providerIconInner(providerKey, provider.label), 'large');
}

/* =========================================================
   SCENARIOS
   ========================================================= */

function loadScenario(id) {
    currentScenario = id;

    const scenario = scenarios[id];
    if (!scenario) return;

    document.querySelectorAll('.scenario-item').forEach(item => item.classList.remove('active'));

    const activeItem = document.querySelector(`[data-scenario="${id}"]`);
    if (activeItem) activeItem.classList.add('active');

    document.getElementById('scenarioTitle').textContent = scenario.title;
    document.getElementById('scenarioMeta').textContent = scenario.meta;
    document.getElementById('metricQuality').textContent = scenario.quality;
    document.getElementById('metricQualityChange').textContent = scenario.qualityChange;
    document.getElementById('metricEfficiency').textContent = scenario.efficiency;
    document.getElementById('metricCompletion').textContent = scenario.completion;

    document.getElementById('rawTokens').textContent = scenario.rawTokens;
    document.getElementById('ampTokens').textContent = scenario.ampTokens;

    document.getElementById('rawContent').innerHTML = scenario.raw;
    document.getElementById('ampContent').innerHTML = scenario.amp;

    applyRawPanelForScenario(id);

    document.querySelectorAll('.panel-scroll-area').forEach(area => { area.scrollTop = 0; });
}

/* =========================================================
   TABS
   ========================================================= */

document.getElementById('appTabs').addEventListener('click', event => {
    if (!event.target.classList.contains('app-tab')) return;

    document.querySelectorAll('.app-tab').forEach(tab => tab.classList.remove('active'));
    event.target.classList.add('active');

    const tab = event.target.dataset.tab;
    document.getElementById('outputView').style.display = 'grid';

    if (tab !== 'output') {
        showToast(`📑 ${event.target.textContent} tab — available in full product`);
    }
});

/* =========================================================
   COPY
   ========================================================= */

function copyPanel(type) {
    const id = type === 'raw' ? 'rawContent' : 'ampContent';
    const text = document.getElementById(id).innerText;

    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => showToast('📋 Copied to clipboard'))
            .catch(() => fallbackCopy(text));
    } else {
        fallbackCopy(text);
    }
}

function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';

    document.body.appendChild(textarea);
    textarea.select();

    try {
        document.execCommand('copy');
        showToast('📋 Copied to clipboard');
    } catch (error) {
        showToast('Copy is not available in this browser');
    }

    document.body.removeChild(textarea);
}

/* =========================================================
   RUN COMPARISON
   ========================================================= */

function runComparison() {
    const input = document.getElementById('promptInput').value.trim();

    if (input) {
        showToast(`▶ Running comparison: ${input.substring(0, 40)}...`);
        document.getElementById('promptInput').value = '';
    } else {
        showToast('▶ Enter a task to run comparison');
    }
}

/* =========================================================
   VOICE INPUT
   ========================================================= */

let mediaRecorder = null;
let recordingStream = null;

const MIC_ICON = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
    </svg>`;

const STOP_ICON = `
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <rect x="6" y="6" width="12" height="12" rx="2"/>
    </svg>`;

function toggleVoice() {
    const button = document.getElementById('voiceBtn');

    if (!isRecording) {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            showToast('🎤 Voice input not supported in this browser');
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                recordingStream = stream;

                try {
                    mediaRecorder = new MediaRecorder(stream);
                } catch (error) {
                    mediaRecorder = null;
                }

                if (mediaRecorder && mediaRecorder.state === 'inactive') mediaRecorder.start();

                isRecording = true;
                button.classList.add('recording');
                button.innerHTML = STOP_ICON;
                showToast('🎤 Recording... click again to stop');
            })
            .catch(() => showToast('🎤 Microphone permission denied'));

        return;
    }

    isRecording = false;
    button.classList.remove('recording');
    button.innerHTML = MIC_ICON;

    if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
    if (recordingStream) recordingStream.getTracks().forEach(track => track.stop());

    document.getElementById('promptInput').value =
        'Analyze the competitive landscape for our Q4 product launch...';

    showToast('🎤 Transcription complete — review and submit');
}

/* =========================================================
   ATTACHMENTS
   ========================================================= */

function toggleAttachMenu(event) {
    event.stopPropagation();

    const menu = document.getElementById('attachMenu');
    const isOpen = menu.classList.contains('show');

    closeAllDropdowns();

    if (!isOpen) {
        menu.classList.add('show');
        activeModal = 'attachMenu';
    }
}

function triggerUpload(type) {
    closeAllDropdowns();

    const input = document.getElementById('fileInput');
    const acceptMap = {
        doc: '.pdf,.docx,.doc,.txt',
        img: 'image/*',
        data: '.csv,.xlsx,.xls',
        code: '.py,.js,.ts,.json,.yaml,.yml,.html,.css'
    };

    input.accept = acceptMap[type] || '*';
    input.click();
}

function handleFileUpload(input) {
    for (const file of input.files) {
        addAttachedFile(file.name, getFileType(file.name));
    }
    input.value = '';
}

function addUrlAttachment() {
    closeAllDropdowns();
    addAttachedFile('https://example.com/report', 'URL');
}

function addAttachedFile(name, type) {
    attachedFilesList.push({ name, type });
    renderAttachedFiles();
    showToast(`📎 Attached: ${name}`);
}

function removeAttachedFile(index) {
    attachedFilesList.splice(index, 1);
    renderAttachedFiles();
}

function renderAttachedFiles() {
    const container = document.getElementById('attachedFiles');

    if (attachedFilesList.length === 0) {
        container.style.display = 'none';
        container.innerHTML = '';
        return;
    }

    container.style.display = 'flex';

    container.innerHTML = attachedFilesList.map((file, index) => `
        <div class="attached-chip">
            <svg class="ac-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
            </svg>
            <span>${escapeHtml(file.name.length > 25 ? file.name.substring(0, 22) + '...' : file.name)}</span>
            <span style="font-size:9px;color:var(--app-text-dim);">${escapeHtml(file.type)}</span>
            <div class="ac-status"></div>
            <svg class="ac-remove" onclick="removeAttachedFile(${index})" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
        </div>
    `).join('');
}

function getFileType(name) {
    const extension = name.split('.').pop().toUpperCase();
    return extension || 'FILE';
}

/* =========================================================
   SCROLL-SYNCED MANIFESTO STATEMENT
   ========================================================= */

const scrollTextEl = document.getElementById('scrollText');
let scrollWords = [];

function buildScrollWords() {
    if (!scrollTextEl) return;

    const raw = scrollTextEl.textContent.trim();
    scrollTextEl.innerHTML = raw
        .split(/\s+/)
        .map(word => `<span class="sw">${escapeHtml(word)}</span>`)
        .join(' ');

    scrollWords = Array.from(scrollTextEl.querySelectorAll('.sw'));
}

function updateScrollText() {
    if (!scrollTextEl || !scrollWords.length) return;

    if (prefersReducedMotion()) {
        scrollWords.forEach(w => { w.style.opacity = 1; });
        return;
    }

    const rect = scrollTextEl.getBoundingClientRect();
    const vh = window.innerHeight;

    const startLine = vh * 0.9;
    const travel = rect.height + vh * 0.55;
    const progress = Math.min(Math.max((startLine - rect.top) / travel, 0), 1);

    const span = 0.14;
    const N = scrollWords.length;

    for (let i = 0; i < N; i++) {
        const start = (i / N) * (1 - span);
        const wordProgress = Math.min(Math.max((progress - start) / span, 0), 1);
        scrollWords[i].style.opacity = (0.12 + 0.88 * wordProgress).toFixed(3);
    }
}

/* =========================================================
   DYNAMIC PAGE SCROLL
   ========================================================= */

const pageBgEl = document.getElementById('pageBg');
const storyWrapEl = document.getElementById('storyWrap');
const storyBgImgEl = document.getElementById('storyBgImg');
const navEl = document.getElementById('siteNav');

const pageDotsEl = document.getElementById('pageDots');
const pageDotLinks = pageDotsEl ? Array.from(pageDotsEl.querySelectorAll('a')) : [];
const pageDotTargets = pageDotLinks.map(link => document.getElementById(link.dataset.target));

function updateDynamicScroll() {
    const y = window.scrollY || window.pageYOffset;

    if (pageBgEl && !prefersReducedMotion()) {
        const shift = Math.min(y * 0.22, 260);
        pageBgEl.style.transform = `translate3d(0, ${shift}px, 0) scale(${1 + Math.min(y / 6000, 0.06)})`;
    }

    if (navEl) navEl.classList.toggle('scrolled', y > 40);
}

/* BG 2 rises from below as you approach the story wrap, then drifts gently. Never scaled. */
function updateStoryParallax() {
    if (!storyWrapEl || !storyBgImgEl || prefersReducedMotion()) return;

    const rect = storyWrapEl.getBoundingClientRect();
    const vh = window.innerHeight;

    const revealProgress = Math.min(Math.max((vh - rect.top) / vh, 0), 1);
    const scrollRange = Math.max(rect.height - vh, 1);
    const scrollProgress = Math.min(Math.max(-rect.top / scrollRange, 0), 1);

    const revealShiftPx = (1 - revealProgress) * vh;
    const driftPx = (scrollProgress - 0.5) * -90 * revealProgress;

    storyBgImgEl.style.transform = `translate3d(0, ${(revealShiftPx + driftPx).toFixed(1)}px, 0)`;
}

function updatePageDots() {
    if (!pageDotLinks.length) return;

    const probe = window.innerHeight * 0.45;
    let active = 0;

    pageDotTargets.forEach((el, index) => {
        if (el && el.getBoundingClientRect().top <= probe) active = index;
    });

    const atBottom = window.innerHeight + (window.scrollY || window.pageYOffset) >=
        document.documentElement.scrollHeight - 4;

    if (atBottom) active = pageDotLinks.length - 1;

    pageDotLinks.forEach((link, index) => {
        link.classList.toggle('active', index === active);
        if (index === active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
    });
}

let scrollTicking = false;

window.addEventListener('scroll', () => {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
        updateScrollText();
        updateDynamicScroll();
        updateStoryParallax();
        updatePageDots();
        scrollTicking = false;
    });
}, { passive: true });

window.addEventListener('resize', () => {
    updateScrollText();
    updateStoryParallax();
    updatePageDots();
    layoutMarquee(true);
    sizeSysCanvas();
});

/* =========================================================
   REVEAL ON EVERY ENTRY
   ========================================================= */

const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
}, {
    threshold: 0.2,
    rootMargin: '0px 0px -8% 0px'
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* =========================================================
   CTA TICKER
   ========================================================= */

const ctaStackEl = document.getElementById('ctaStack');
const ctaLines = ctaStackEl ? Array.from(ctaStackEl.querySelectorAll('.cta-line')) : [];
const CTA_INTERVAL_MS = 3200;
const CTA_TRANSITION_MS = 950;
let ctaIndex = 0;
let ctaTimer = null;

function advanceCtaTicker() {
    if (ctaLines.length < 2) return;

    const outgoing = ctaLines[ctaIndex];
    ctaIndex = (ctaIndex + 1) % ctaLines.length;
    const incoming = ctaLines[ctaIndex];

    outgoing.classList.remove('is-active');
    outgoing.classList.add('is-out');

    incoming.classList.remove('is-out');
    incoming.classList.add('is-active');

    setTimeout(() => outgoing.classList.remove('is-out'), CTA_TRANSITION_MS);
}

function startCtaTicker() {
    if (ctaLines.length < 2 || prefersReducedMotion()) return;
    clearInterval(ctaTimer);
    ctaTimer = setInterval(advanceCtaTicker, CTA_INTERVAL_MS);
}

/* =========================================================
   SYSTEM — ANIMATED ARCHITECTURE
   Packets travel along the real SVG paths; nodes and paths light up
   in a five-stage cycle; a canvas field of drifting points sits behind.
   ========================================================= */

const SYS_NS = 'http://www.w3.org/2000/svg';

const SYS = {
    stageMs: 2800,
    stages: [
        {
            label: 'Intake',
            caption: 'Task, context and requirements enter one governed pipeline.',
            nodes: ['task', 'ctx', 'req'],
            paths: ['in-task', 'in-ctx', 'in-req']
        },
        {
            label: 'Amplify',
            caption: 'The DSRT core applies per-token intelligence to each request.',
            nodes: ['core'],
            paths: ['in-task', 'in-ctx', 'in-req']
        },
        {
            label: 'Route',
            caption: 'Each task goes to the least expensive provider path that still passes.',
            nodes: ['prov-a', 'prov-b', 'prov-c'],
            paths: ['route-a', 'route-b', 'route-c']
        },
        {
            label: 'Verify',
            caption: 'Outputs are checked for quality, correctness and overhead.',
            nodes: ['eval'],
            paths: ['core-eval']
        },
        {
            label: 'Measure',
            caption: 'Tokens, cost and savings are logged beside every verified output.',
            nodes: ['econ', 'output'],
            paths: ['eval-econ', 'ret-a', 'ret-b', 'ret-c']
        }
    ]
};

const sysBoardEl = document.getElementById('sysBoard');
const sysSection = document.getElementById('pageSystem');
const sysPacketLayer = document.getElementById('sysPackets');
const sysCanvasEl = document.getElementById('sysCanvas');
const sysCaptionEl = document.getElementById('sysCaption');
const sysStageEls = Array.from(document.querySelectorAll('.sys-stage'));

let sysPackets = [];
let sysStage = -1;
let activePaths = new Set();
let sysVisible = false;
let sysRunning = false;
let sysLast = 0;
let sysStageTimer = null;
let sysCounterTimer = null;

const sysCounters = [
    { id: 'cntRouted',   value: 12840,   min: 3,   max: 9 },
    { id: 'cntVerified', value: 11972,   min: 2,   max: 7 },
    { id: 'cntTokens',   value: 4812930, min: 800, max: 2600 },
    { id: 'cntCost',     value: 38410,   min: 1,   max: 4 }
];

function buildSysPackets() {
    if (!sysPacketLayer) return;

    sysPacketLayer.innerHTML = '';
    sysPackets = [];

    document.querySelectorAll('[data-flow]').forEach((path, pathIndex) => {
        const len = path.getTotalLength();

        for (let k = 0; k < 2; k++) {
            const dot = document.createElementNS(SYS_NS, 'circle');
            dot.setAttribute('r', k === 0 ? '3.4' : '2.4');
            dot.setAttribute('class', 'sys-packet');
            dot.style.opacity = '0';
            sysPacketLayer.appendChild(dot);

            sysPackets.push({
                el: dot,
                path,
                id: path.dataset.flow,
                len,
                t: ((k * 0.5) + (pathIndex * 0.137)) % 1,
                speed: 0.14 + (pathIndex % 3) * 0.035 + k * 0.02
            });
        }
    });
}

function setSysStage(index) {
    if (!SYS.stages[index]) return;

    sysStage = index;
    const stage = SYS.stages[index];

    document.querySelectorAll('[data-node]').forEach(node => {
        node.classList.toggle('is-live', stage.nodes.includes(node.dataset.node));
    });

    document.querySelectorAll('[data-flow]').forEach(path => {
        path.classList.toggle('lit', stage.paths.includes(path.dataset.flow));
    });

    activePaths = new Set(stage.paths);

    sysStageEls.forEach((el, i) => {
        el.classList.toggle('is-active', i === index);
        el.classList.toggle('is-done', i < index);
    });

    if (sysCaptionEl) {
        sysCaptionEl.classList.add('swap');
        setTimeout(() => {
            sysCaptionEl.innerHTML = `<span>${String(index + 1).padStart(2, '0')}</span> ${escapeHtml(stage.label)} — ${escapeHtml(stage.caption)}`;
            sysCaptionEl.classList.remove('swap');
        }, 220);
    }
}

function advanceSysStage() {
    if (!sysVisible) return;
    setSysStage((sysStage + 1) % SYS.stages.length);
}

function startSysStages() {
    if (sysStageTimer || prefersReducedMotion()) return;

    if (sysBoardEl) sysBoardEl.parentElement.parentElement.parentElement.style.setProperty('--stage-ms', `${SYS.stageMs}ms`);
    document.querySelectorAll('.sys-stage').forEach(el => el.style.setProperty('--stage-ms', `${SYS.stageMs}ms`));

    sysStageTimer = setInterval(advanceSysStage, SYS.stageMs);
}

function tickSysCounters() {
    sysCounters.forEach(counter => {
        counter.value += Math.round(counter.min + Math.random() * (counter.max - counter.min));
        const el = document.getElementById(counter.id);
        if (el) el.textContent = counter.value.toLocaleString('en-US');
    });
}

/* Canvas: drifting monochrome points with faint connecting lines */

let sysPts = [];
let sysW = 0;
let sysH = 0;
let sysCtx = null;

function sizeSysCanvas() {
    if (!sysCanvasEl) return;

    const rect = sysCanvasEl.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    sysW = rect.width;
    sysH = rect.height;

    sysCanvasEl.width = Math.round(sysW * dpr);
    sysCanvasEl.height = Math.round(sysH * dpr);

    sysCtx = sysCanvasEl.getContext('2d');
    sysCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(64, Math.round((sysW * sysH) / 16000));

    sysPts = Array.from({ length: count }, () => ({
        x: Math.random() * sysW,
        y: Math.random() * sysH,
        vx: (Math.random() - 0.5) * 12,
        vy: (Math.random() - 0.5) * 12,
        r: Math.random() * 1.4 + 0.4,
        a: Math.random() * 0.35 + 0.1
    }));
}

function drawSysCanvas(dt) {
    if (!sysCtx || !sysW) return;

    sysCtx.clearRect(0, 0, sysW, sysH);

    for (const p of sysPts) {
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.x < 0) p.x = sysW;
        if (p.x > sysW) p.x = 0;
        if (p.y < 0) p.y = sysH;
        if (p.y > sysH) p.y = 0;

        sysCtx.fillStyle = `rgba(255, 255, 255, ${p.a})`;
        sysCtx.beginPath();
        sysCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        sysCtx.fill();
    }

    for (let i = 0; i < sysPts.length; i++) {
        for (let j = i + 1; j < sysPts.length; j++) {
            const a = sysPts[i];
            const b = sysPts[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);

            if (d < 120) {
                sysCtx.strokeStyle = `rgba(255, 255, 255, ${(1 - d / 120) * 0.09})`;
                sysCtx.lineWidth = 0.6;
                sysCtx.beginPath();
                sysCtx.moveTo(a.x, a.y);
                sysCtx.lineTo(b.x, b.y);
                sysCtx.stroke();
            }
        }
    }
}

function updateSysPackets(dt) {
    for (const p of sysPackets) {
        p.t += p.speed * dt;
        if (p.t > 1) p.t -= 1;

        const pt = p.path.getPointAtLength(p.t * p.len);
        p.el.setAttribute('cx', pt.x.toFixed(2));
        p.el.setAttribute('cy', pt.y.toFixed(2));

        const on = activePaths.has(p.id);
        p.el.style.opacity = on ? '0.95' : '0.16';
    }
}

function sysFrame(ts) {
    if (!sysVisible) {
        sysRunning = false;
        return;
    }

    const dt = sysLast ? Math.min((ts - sysLast) / 1000, 0.05) : 0;
    sysLast = ts;

    updateSysPackets(dt);
    drawSysCanvas(dt);

    requestAnimationFrame(sysFrame);
}

const sysObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        sysVisible = entry.isIntersecting;

        if (sysVisible) {
            if (sysStage < 0) setSysStage(0);

            if (!prefersReducedMotion()) {
                startSysStages();
                if (!sysRunning) {
                    sysRunning = true;
                    sysLast = 0;
                    requestAnimationFrame(sysFrame);
                }
                if (!sysCounterTimer) sysCounterTimer = setInterval(tickSysCounters, 1400);
            } else {
                drawSysCanvas(0);
            }
        }
    });
}, { threshold: 0.12 });

function initSystem() {
    if (!sysBoardEl) return;

    hydrateStaticProviderIcons();
    buildSysPackets();
    sizeSysCanvas();
    setSysStage(0);
    if (sysSection) sysObserver.observe(sysSection);
}

/* =========================================================
   PROVIDER MARQUEE — continuous arc
   ========================================================= */

const marqueeStage = document.getElementById('pmStage');
const marqueeTrack = document.getElementById('pmTrack');

const MARQUEE = {
    spacing: 196,
    speed: 46,
    arcDepth: 0.42,
    maxTilt: 14,
    minScale: 0.72,
    maxBlur: 5
};

let marqueeCards = [];
let marqueeOffset = 0;
let marqueeLast = 0;
let marqueePaused = false;
let marqueeTotalLen = 0;
let marqueeRunning = false;

const marqueeOrder = [
    'openai', 'anthropic', 'google', 'deepseek', 'xai', 'mistral', 'meta', 'cohere',
    'qwen', 'moonshot', 'zai', 'minimax', 'nvidia', 'ai21',
    'aws', 'azure', 'gcloud',
    'groq', 'together', 'fireworks', 'openrouter', 'perplexity',
    'dsrt'
];

function buildMarquee() {
    if (!marqueeStage || !marqueeTrack) return;

    const width = marqueeStage.clientWidth || window.innerWidth;
    const needed = Math.ceil((width + MARQUEE.spacing * 3) / MARQUEE.spacing);
    const total = Math.max(needed, marqueeOrder.length);

    const parts = [];
    for (let i = 0; i < total; i++) {
        const key = marqueeOrder[i % marqueeOrder.length];
        const provider = getProviderMeta(key);
        parts.push(`
            <div class="pm-card" data-provider="${escapeHtml(key)}" data-index="${i}">
                ${renderProviderIconSlot(key, 'xl')}
                <span class="pm-label">${escapeHtml(provider.label)}</span>
            </div>
        `);
    }

    marqueeTrack.innerHTML = parts.join('');
    marqueeCards = Array.from(marqueeTrack.querySelectorAll('.pm-card'));
    marqueeTotalLen = marqueeCards.length * MARQUEE.spacing;
}

function layoutMarquee(rebuild = false) {
    if (!marqueeStage || !marqueeTrack) return;

    if (rebuild || !marqueeCards.length) buildMarquee();

    const W = marqueeStage.clientWidth;
    const H = marqueeStage.clientHeight;
    const half = W / 2;
    const n = marqueeCards.length;

    for (let i = 0; i < n; i++) {
        let x = (i * MARQUEE.spacing + marqueeOffset) % marqueeTotalLen;
        if (x < 0) x += marqueeTotalLen;
        x -= marqueeTotalLen / 2;

        const u = Math.max(-1.15, Math.min(1.15, x / half));
        const uu = u * u;

        const y = MARQUEE.arcDepth * H * uu * 0.5;
        const rot = u * MARQUEE.maxTilt;
        const scale = 1 - (1 - MARQUEE.minScale) * Math.min(uu, 1);
        const opacity = Math.max(0, 1 - Math.pow(Math.abs(u), 3) * 0.9);
        const blur = Math.min(uu * uu * MARQUEE.maxBlur, MARQUEE.maxBlur);

        const card = marqueeCards[i];

        if (Math.abs(x) > half + MARQUEE.spacing) {
            card.style.visibility = 'hidden';
            continue;
        }

        card.style.visibility = 'visible';
        card.style.transform =
            `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${rot.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
        card.style.opacity = opacity.toFixed(3);
        card.style.filter = blur > 0.15 ? `blur(${blur.toFixed(2)}px)` : 'none';
        card.style.zIndex = String(100 - Math.round(Math.abs(u) * 50));
    }
}

function tickMarquee(ts) {
    if (!marqueeRunning) return;

    if (!marqueeLast) marqueeLast = ts;
    const dt = Math.min((ts - marqueeLast) / 1000, 0.05);
    marqueeLast = ts;

    if (!marqueePaused) {
        marqueeOffset -= MARQUEE.speed * dt;
        if (marqueeOffset < -marqueeTotalLen) marqueeOffset += marqueeTotalLen;
    }

    layoutMarquee(false);
    requestAnimationFrame(tickMarquee);
}

function startMarquee() {
    if (!marqueeStage) return;

    buildMarquee();
    layoutMarquee(false);

    if (prefersReducedMotion()) return;

    marqueeStage.addEventListener('mouseenter', () => { marqueePaused = true; });
    marqueeStage.addEventListener('mouseleave', () => { marqueePaused = false; });

    const visObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !marqueeRunning) {
                marqueeRunning = true;
                marqueeLast = 0;
                requestAnimationFrame(tickMarquee);
            } else if (!entry.isIntersecting) {
                marqueeRunning = false;
            }
        });
    }, { threshold: 0.05 });

    visObserver.observe(marqueeStage);
}

/* =========================================================
   INIT
   ========================================================= */

window.addEventListener('DOMContentLoaded', () => {
    renderProviderDropdown();

    setIconSlot('selectedProviderIcon',
        providerIconInner(selectedProviderKey, getProviderMeta(selectedProviderKey).label), 'small');

    selectRoute(selectedRoute);

    loadScenario('ev');

    const evItem = document.querySelector('[data-scenario="ev"]');
    if (evItem) evItem.classList.add('active');

    buildScrollWords();
    updateScrollText();
    updateDynamicScroll();
    updateStoryParallax();
    updatePageDots();

    initSystem();
    startMarquee();
    startCtaTicker();

    console.info('Dsrt AI: run listAssetPaths() to print every image and icon path the page looks for.');
});

/* Close menus when clicking outside */
document.addEventListener('click', event => {
    if (!activeModal) return;

    if (!event.target.closest('.dropdown-menu, .attachment-menu')) {
        closeAllDropdowns();
    }
});

/* Provider and route selection (delegated) */
document.addEventListener('click', event => {
    const providerItem = event.target.closest('#providerDropdownItems .dropdown-item[data-provider]');
    if (providerItem) {
        event.stopPropagation();
        selectProvider(providerItem.dataset.provider);
        return;
    }

    const routeItem = event.target.closest('#routeDropdown .dropdown-item[data-route]');
    if (routeItem) {
        event.stopPropagation();
        selectRoute(routeItem.dataset.route);
    }
});

/* Keyboard accessibility */
document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeAllDropdowns();
});
