// @ts-nocheck
/* =====================================================================
   DSRT AI â€” REGISTRATION CLIENT LOGIC
   ===================================================================== */

const SUPABASE_PROJECT_REF = "kwswedsqozbzylbtsnkm";
const SUPABASE_ANON_KEY = "sb_publishable_FP3gkUvVfiBZsDL3HGQCSQ_1aWPT66D";

// Fixed: Correct string interpolation for the endpoint
const ENDPOINT = "https://" + SUPABASE_PROJECT_REF + ".supabase.co/functions/v1/submit-application";

/* ---------- OPTION DATA ---------- */

const INDUSTRIES = [
  "Technology / Software","Artificial Intelligence","Financial Services","Banking",
  "Healthcare","Education","Manufacturing","Retail / E-commerce","Logistics / Transportation",
  "Telecommunications","Media / Entertainment","Marketing / Advertising","Professional Services",
  "Legal Services","Real Estate","Energy","Agriculture","Automotive","Cybersecurity",
  "Government / Public Sector","Other"
];

const PROVIDERS = [
  "OpenAI","Anthropic","Google","DeepSeek","xAI","Meta","Mistral","Qwen",
  "OpenRouter","Amazon Bedrock","Microsoft Azure AI","NVIDIA","Cohere","Other"
];

const USE_CASES = [
  "AI-powered products","Enterprise AI applications","Customer support",
  "AI agents and autonomous workflows","Software development","Research and intelligence",
  "Data analytics","Document processing","Content generation","Sales and marketing",
  "Internal business operations","Decision support","Workflow automation","AI infrastructure","Other"
];

const CHALLENGES = [
  "High AI API expenditure","Excessive token consumption","Poor reasoning performance",
  "Inconsistent output quality","Context management","Complex agent workflows",
  "High inference costs","Model selection and routing","Latency and response times",
  "Verification and reliability","Scaling AI operations","Infrastructure complexity","Other"
];

const EXPECTATIONS = [
  "Reduce AI operating expenditure","Increase useful intelligence per token",
  "Improve reasoning capabilities","Improve output reliability","Reduce unnecessary computation",
  "Improve agent performance","Optimize model utilization","Improve enterprise workflows","All of the above"
];

const INTEREST = [
  "Intelligence amplification technology","Cost reduction on AI workloads",
  "Model orchestration","Work Mode (production workflows)","War Mode (comparative execution)",
  "Enterprise infrastructure","Early access and influence on roadmap","Technical partnership"
];

const PLANNING_FUNCTIONS = [
  "Customer support","Sales","Marketing","Operations","Engineering","HR",
  "Finance","Research","Internal knowledge","Other"
];

/* =====================================================================
   COUNTRIES â€” India first, then all others alphabetically
   ===================================================================== */

const COUNTRIES = [
  "India",
  "Afghanistan","Albania","Algeria","Andorra","Angola","Antigua and Barbuda","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi",
  "Cabo Verde","Cambodia","Cameroon","Canada","Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo (Brazzaville)","Congo (Kinshasa)","Costa Rica","Croatia","Cuba","Cyprus","Czechia",
  "Denmark","Djibouti","Dominica","Dominican Republic",
  "Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Eswatini","Ethiopia",
  "Fiji","Finland","France",
  "Gabon","Gambia","Georgia","Germany","Ghana","Greece","Grenada","Guatemala","Guinea","Guinea-Bissau","Guyana",
  "Haiti","Honduras","Hungary",
  "Iceland","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Ivory Coast",
  "Jamaica","Japan","Jordan",
  "Kazakhstan","Kenya","Kiribati","Kosovo","Kuwait","Kyrgyzstan",
  "Laos","Latvia","Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg",
  "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Mauritania","Mauritius","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Morocco","Mozambique","Myanmar",
  "Namibia","Nauru","Nepal","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","North Macedonia","Norway",
  "Oman",
  "Pakistan","Palau","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal",
  "Qatar",
  "Romania","Russia","Rwanda",
  "Saint Kitts and Nevis","Saint Lucia","Saint Vincent and the Grenadines","Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Korea","South Sudan","Spain","Sri Lanka","Sudan","Suriname","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Timor-Leste","Togo","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Tuvalu",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan",
  "Vanuatu","Vatican City","Venezuela","Vietnam",
  "Yemen",
  "Zambia","Zimbabwe",
  "Other"
];

/* ---------- INIT ---------- */

function buildChips(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(i => `<div class="chip" data-value="${i.replace(/"/g,'&quot;')}">${i}</div>`).join("");
  el.querySelectorAll(".chip").forEach(chip => {
    chip.addEventListener("click", () => {
      chip.classList.toggle("active");
      const field = chip.closest(".field");
      if (field) field.classList.remove("has-error");
    });
  });
}

function populateCountries() {
  const sel = document.getElementById("f_country");
  if (!sel) return;
  sel.innerHTML = '<option value="">Select country</option>' +
    COUNTRIES.map(c => `<option value="${c.replace(/"/g, '&quot;')}">${c}</option>`).join("");
}

function initRadioGroups() {
  document.querySelectorAll(".radio-group").forEach(group => {
    group.querySelectorAll(".radio-item").forEach(item => {
      item.addEventListener("click", () => {
        group.querySelectorAll(".radio-item").forEach(x => x.classList.remove("active"));
        item.classList.add("active");
        const field = group.closest(".field");
        if (field) field.classList.remove("has-error");

        // Conditional for uses_ai
        if (group.id === "uses_ai_group") {
          const v = item.dataset.value;
          document.getElementById("ai_yes_block").style.display = v === "yes" ? "block" : "none";
          document.getElementById("ai_no_block").style.display = (v === "no" || v === "planning") ? "block" : "none";
        }
      });
    });
  });
}

function getRadioValue(name) {
  const group = document.querySelector(`.radio-group[data-name="${name}"]`);
  if (!group) return null;
  const active = group.querySelector(".radio-item.active");
  return active ? active.dataset.value : null;
}

function getChipValues(name) {
  const group = document.querySelector(`.chips[data-name="${name}"]`);
  if (!group) return [];
  return Array.from(group.querySelectorAll(".chip.active")).map(c => c.dataset.value);
}

/* ---------- STEPPER ---------- */

let currentStep = 1;
const totalSteps = 4;
const STEP_LABELS = {
  1: "Step 01 of 04 â€” Organization Details",
  2: "Step 02 of 04 â€” Authorized Contact",
  3: "Step 03 of 04 â€” AI Infrastructure & Usage",
  4: "Step 04 of 04 â€” Early Access & Participation",
};

function showStep(n) {
  document.querySelectorAll(".step").forEach(s => s.classList.remove("active"));
  document.querySelector(`.step[data-step="${n}"]`).classList.add("active");
  document.querySelectorAll("#stepper .step-item").forEach(it => {
    const d = parseInt(it.dataset.step);
    it.classList.remove("active","done");
    if (d === n) it.classList.add("active");
    else if (d < n) it.classList.add("done");
  });
  document.getElementById("stepLabel").textContent = STEP_LABELS[n];
  document.getElementById("stepProgress").textContent = Math.round((n/totalSteps)*100) + "%";
  document.getElementById("register").scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateStep(n) {
  let ok = true;
  const clear = el => el.classList.remove("has-error");
  const bad = el => { el.classList.add("has-error"); ok = false; };

  if (n === 1) {
    const req = ["f_company","f_type","f_country","f_city","f_employees","f_desc"];
    req.forEach(id => {
      const el = document.getElementById(id); clear(el.closest(".field"));
      if (!el.value.trim()) bad(el.closest(".field"));
    });
    const inds = getChipValues("industries");
    const chipsField = document.getElementById("chips_industry").closest(".field");
    clear(chipsField); if (!inds.length) bad(chipsField);
  }

  if (n === 2) {
    const req = ["f_name","f_email","f_designation"];
    req.forEach(id => {
      const el = document.getElementById(id); clear(el.closest(".field"));
      if (!el.value.trim()) bad(el.closest(".field"));
    });
    const email = document.getElementById("f_email");
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) bad(email.closest(".field"));
    const authGroup = document.querySelector('.radio-group[data-name="is_authorized"]').closest(".field");
    clear(authGroup); if (!getRadioValue("is_authorized")) bad(authGroup);
  }

  if (n === 3) {
    const usesField = document.getElementById("uses_ai_group").closest(".field");
    clear(usesField); if (!getRadioValue("uses_ai")) bad(usesField);

    const useCasesField = document.getElementById("chips_usecases").closest(".field");
    clear(useCasesField); if (!getChipValues("use_cases").length) bad(useCasesField);

    const agentsField = document.querySelector('.radio-group[data-name="uses_agents"]').closest(".field");
    clear(agentsField); if (!getRadioValue("uses_agents")) bad(agentsField);

    const challengesField = document.getElementById("chips_challenges").closest(".field");
    clear(challengesField); if (!getChipValues("challenges").length) bad(challengesField);

    const expField = document.getElementById("chips_expectations").closest(".field");
    clear(expField); if (!getChipValues("dsrt_expectations").length) bad(expField);
  }

  if (n === 4) {
    const interestField = document.getElementById("chips_interest").closest(".field");
    clear(interestField); if (!getChipValues("interest_reason").length) bad(interestField);

    const testField = document.querySelector('.radio-group[data-name="testing_interest"]').closest(".field");
    clear(testField); if (!getRadioValue("testing_interest")) bad(testField);

    const consent = document.getElementById("consent_privacy");
    const consentErr = document.getElementById("consent_err");
    if (!consent.checked) { consentErr.style.display = "block"; ok = false; }
    else consentErr.style.display = "none";
  }

  return ok;
}

function wireNav() {
  document.querySelectorAll("[data-next]").forEach(btn => {
    btn.addEventListener("click", () => {
      if (!validateStep(currentStep)) return;
      currentStep = Math.min(totalSteps, currentStep + 1);
      showStep(currentStep);
    });
  });
  document.querySelectorAll("[data-prev]").forEach(btn => {
    btn.addEventListener("click", () => {
      currentStep = Math.max(1, currentStep - 1);
      showStep(currentStep);
    });
  });
}

/* ---------- META (utm etc) ---------- */

function getMeta() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
    landing_url: window.location.href,
  };
}

/* ---------- SUBMIT ---------- */

async function submitForm(e) {
  e.preventDefault();
  if (!validateStep(4)) return;

  const btn = document.getElementById("submitBtn");
  const original = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner"></span> Submitting...';

  const payload = {
    company: {
      company_name: document.getElementById("f_company").value.trim(),
      website: document.getElementById("f_website").value.trim() || null,
      company_type: document.getElementById("f_type").value,
      industries: getChipValues("industries"),
      description: document.getElementById("f_desc").value.trim(),
      country: document.getElementById("f_country").value,
      state: document.getElementById("f_state").value.trim() || null,
      city: document.getElementById("f_city").value.trim(),
      founded_year: parseInt(document.getElementById("f_founded").value) || null,
      employee_count: document.getElementById("f_employees").value,
    },
    contact: {
      full_name: document.getElementById("f_name").value.trim(),
      email: document.getElementById("f_email").value.trim(),
      phone: document.getElementById("f_phone").value.trim() || null,
      designation: document.getElementById("f_designation").value,
      department: document.getElementById("f_department").value || null,
      linkedin_url: document.getElementById("f_linkedin").value.trim() || null,
      is_authorized: getRadioValue("is_authorized") === "true",
    },
    ai: {
      uses_ai: getRadioValue("uses_ai"),
      providers: getChipValues("providers"),
      models: [],
      monthly_ai_spend_range: document.getElementById("f_spend").value || null,
      currency: document.getElementById("f_currency").value || "USD",
      use_cases: getChipValues("use_cases"),
      ai_frequency: document.getElementById("f_freq").value || null,
      uses_agents: getRadioValue("uses_agents"),
      ai_user_count: document.getElementById("f_users").value || null,
      challenges: getChipValues("challenges"),
      dsrt_expectations: getChipValues("dsrt_expectations"),
      planning_functions: getChipValues("planning_functions"),
      planning_timeline: getRadioValue("planning_timeline"),
    },
    access: {
      interest_reason: getChipValues("interest_reason"),
      initial_use_case: document.getElementById("f_usecase").value.trim() || null,
      testing_interest: getRadioValue("testing_interest"),
      feedback_interest: getRadioValue("feedback_interest"),
      pilot_interest: getRadioValue("pilot_interest"),
      partnership_interest: getRadioValue("partnership_interest"),
      onboarding_preference: document.getElementById("f_onboarding").value || null,
      heard_from: document.getElementById("f_heard").value || null,
      referral_code: document.getElementById("f_ref").value.trim() || null,
    },
    consent: {
      privacy_consent: document.getElementById("consent_privacy").checked,
      marketing_consent: document.getElementById("consent_marketing").checked,
    },
    meta: getMeta(),
  };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Submission failed");

    document.getElementById("overlayRef").textContent = data.application_reference;
    document.getElementById("successOverlay").classList.add("active");
    document.body.style.overflow = "hidden";

  } catch (err) {
    alert("Submission error: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = original;
  }
}

/* ---------- BOOT ---------- */

document.addEventListener("DOMContentLoaded", () => {
  buildChips("chips_industry", INDUSTRIES);
  buildChips("chips_providers", PROVIDERS);
  buildChips("chips_usecases", USE_CASES);
  buildChips("chips_challenges", CHALLENGES);
  buildChips("chips_expectations", EXPECTATIONS);
  buildChips("chips_interest", INTEREST);
  buildChips("chips_planning_fn", PLANNING_FUNCTIONS);
  populateCountries();
  initRadioGroups();
  wireNav();
  document.getElementById("dsrtForm").addEventListener("submit", submitForm);
});


