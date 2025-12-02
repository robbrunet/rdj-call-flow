/* ===============================
   RDJ Modular Call Flow v2
   =============================== */

/* Elements */
const scriptList = document.getElementById("scriptList");
const companyList = document.getElementById("companyList");
const objectionList = document.getElementById("objectionList");

const scriptCoachView = document.getElementById("scriptCoachView");
const companyCoachView = document.getElementById("companyCoachView");
const objectionCoachView = document.getElementById("objectionCoachView");

const coachLineLabel = document.getElementById("coachLineLabel");
const coachTabs = document.querySelectorAll(".coach-tab");
const coachTabContent = document.getElementById("coachTabContent");

const viewTabs = document.querySelectorAll(".view-tab");
const viewSections = document.querySelectorAll(".view-section");

/* Global data store */
let SCRIPT_DATA = [];
let COMPANIES = [];
let OBJECTIONS = [];
let COACHING = {
  truth: {},
  values: {},
  mindset: {},
  habits: {},
  skillset: {}
};

/* ================================
   Load JSON files
   ================================ */

async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

async function initializeApp() {
  SCRIPT_DATA = (await loadJSON("data/script.json")).lines;
  COMPANIES = (await loadJSON("data/companies.json")).companies;
  OBJECTIONS = (await loadJSON("data/objections.json")).objections;

  COACHING.truth = await loadJSON("data/coaching/truth.json");
  COACHING.values = await loadJSON("data/coaching/values.json");
  COACHING.mindset = await loadJSON("data/coaching/mindset.json");
  COACHING.habits = await loadJSON("data/coaching/habits.json");
  COACHING.skillset = await loadJSON("data/coaching/skillset.json");

  renderScript();
  renderCompanies();
  renderObjections();
}

/* ================================
   Render Script Lines
   ================================ */

function renderScript() {
  scriptList.innerHTML = "";

  SCRIPT_DATA.forEach((line, index) => {
    const li = document.createElement("li");
    li.classList.add("script-line");
    li.dataset.index = index;

    if (line.compliance === true) {
      li.classList.add("compliance-line");
    }

    li.textContent = line.text;

    li.addEventListener("click", () => {
      document.querySelectorAll(".script-line").forEach(s => s.classList.remove("active"));
      li.classList.add("active");

      coachLineLabel.textContent = line.text;
      loadCoachingTabs(line);
    });

    scriptList.appendChild(li);
  });
}

/* ================================
   Render Companies
   ================================ */
function renderCompanies() {
  companyList.innerHTML = "";

  COMPANIES.forEach((c, idx) => {
    const li = document.createElement("li");
    li.classList.add("list-item");
    li.dataset.index = idx;

    li.innerHTML = `
      <div class="list-item-title">${c.name}</div>
      <div class="list-item-sub">${c.summary || ""}</div>
    `;

    li.addEventListener("click", () => {
      document.querySelectorAll(".list-item").forEach(s => s.classList.remove("active"));
      li.classList.add("active");

      document.getElementById("companyLabel").textContent = c.name;
      document.getElementById("companyDetail").innerHTML = `
        <h3>${c.name}</h3>
        <p>${c.details || ""}</p>
      `;
    });

    companyList.appendChild(li);
  });
}

/* ================================
   Render Objections
   ================================ */
function renderObjections() {
  objectionList.innerHTML = "";

  OBJECTIONS.forEach((o, idx) => {
    const li = document.createElement("li");
    li.classList.add("list-item");
    li.dataset.index = idx;

    li.innerHTML = `
      <div class="list-item-title">${o.title}</div>
      <div class="list-item-sub">${o.short || ""}</div>
    `;

    li.addEventListener("click", () => {
      document.querySelectorAll(".list-item").forEach(s => s.classList.remove("active"));
      li.classList.add("active");

      document.getElementById("objectionLabel").textContent = o.title;
      document.getElementById("objectionDetail").innerHTML = `
        <h3>${o.title}</h3>
        <p>${o.response || ""}</p>
      `;
    });

    objectionList.appendChild(li);
  });
}

/* ================================
   Load TRUTH Coaching Tabs
   ================================ */
function loadCoachingTabs(line) {
  const { id } = line;

  coachTabs.forEach(tab => {
    tab.onclick = () => {
      coachTabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      const key = tab.dataset.tab;
      const entry = COACHING[key][id] || "No data added yet.";

      coachTabContent.innerHTML = `<p>${entry}</p>`;
    };
  });

  coachTabs[0].click();
}

/* ================================
   Switch Top-Level Views
   ================================ */

viewTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    viewTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");

    const view = tab.dataset.view;

    viewSections.forEach(section => {
      section.classList.toggle("active", section.dataset.view === view);
    });

    scriptCoachView.classList.toggle(
      "active",
      view === "script"
    );
    companyCoachView.classList.toggle(
      "active",
      view === "companies"
    );
    objectionCoachView.classList.toggle(
      "active",
      view === "objections"
    );
  });
});

/* ================================
   Initialize
   ================================ */
initializeApp();
