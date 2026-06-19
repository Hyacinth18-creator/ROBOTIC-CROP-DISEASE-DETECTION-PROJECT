const missionState = {
  filter: "all",
  selectedMissionId: "TM-2048",
};

const missions = [
  { id: "TM-2048", crop: "Tomato", disease: "Early blight", severity: "High", action: "Targeted copper fungicide", status: "Active", time: "18 min", zone: "A3", priority: "Urgent" },
  { id: "TM-2049", crop: "Maize", disease: "Leaf rust", severity: "Medium", action: "Micro-dose triazole pass", status: "Pending", time: "24 min", zone: "B2", priority: "High" },
  { id: "TM-2050", crop: "Beans", disease: "Angular leaf spot", severity: "Low", action: "Biological treatment mist", status: "Completed", time: "14 min", zone: "C6", priority: "Normal" },
  { id: "TM-2051", crop: "Pepper", disease: "Bacterial spot", severity: "High", action: "Isolated treatment pass", status: "Active", time: "21 min", zone: "D1", priority: "Urgent" },
  { id: "TM-2052", crop: "Tomato", disease: "Powdery mildew", severity: "Medium", action: "Sulfur precision spray", status: "Completed", time: "16 min", zone: "A5", priority: "High" },
];

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  missionLoader();
  missionStatusUpdater();
  document.querySelector("[data-mission-filter]")?.addEventListener("change", missionFilter);
  document.querySelector("[data-add-mission]")?.addEventListener("click", addMission);
});

function missionLoader() {
  renderMissionSummary();
  renderMissionTable();
  renderMissionDetails();
}

function renderMissionSummary() {
  const counts = {
    active: missions.filter((mission) => mission.status === "Active").length,
    completed: missions.filter((mission) => mission.status === "Completed").length,
    pending: missions.filter((mission) => mission.status === "Pending").length,
  };
  const summary = {
    "[data-active-missions]": counts.active,
    "[data-completed-missions]": counts.completed,
    "[data-pending-missions]": counts.pending,
    "[data-average-time]": "18.6 min",
  };
  Object.entries(summary).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  });
}

function renderMissionTable() {
  const table = document.querySelector("[data-mission-table]");
  if (!table) return;
  const visibleMissions = missionState.filter === "all"
    ? missions
    : missions.filter((mission) => mission.status.toLowerCase() === missionState.filter);

  table.innerHTML = visibleMissions.map((mission) => `
    <tr class="mission-row">
      <td>${mission.id}</td>
      <td>${mission.crop}</td>
      <td>${mission.disease}</td>
      <td>${mission.severity}</td>
      <td>${mission.action}</td>
      <td><span class="mission-status is-${mission.status.toLowerCase()}">${mission.status}</span></td>
      <td>${mission.time}</td>
      <td><button type="button" data-select-mission="${mission.id}">View</button></td>
    </tr>
  `).join("");

  table.querySelectorAll("[data-select-mission]").forEach((button) => {
    button.addEventListener("click", () => {
      missionState.selectedMissionId = button.dataset.selectMission;
      renderMissionDetails();
    });
  });
}

function renderMissionDetails() {
  const mission = missions.find((item) => item.id === missionState.selectedMissionId) || missions[0];
  const panel = document.querySelector("[data-mission-details]");
  if (!panel) return;

  panel.innerHTML = `
    <div><dt>Mission Summary</dt><dd>${mission.id} is treating ${mission.crop} for ${mission.disease}.</dd></div>
    <div><dt>Treatment Recommendation</dt><dd>${mission.action}</dd></div>
    <div><dt>Affected Zone</dt><dd>Field zone ${mission.zone}</dd></div>
    <div><dt>Priority Level</dt><dd>${mission.priority}</dd></div>
    <div><dt>Completion Status</dt><dd>${mission.status} with ${mission.time} estimated execution time.</dd></div>
  `;
}

function missionFilter(event) {
  missionState.filter = event.target.value;
  renderMissionTable();
  showToast(`Mission table filtered to ${event.target.options[event.target.selectedIndex].text}.`);
}

function missionStatusUpdater() {
  window.setInterval(() => {
    const pending = missions.find((mission) => mission.status === "Pending");
    if (!pending) return;
    pending.status = "Active";
    renderMissionSummary();
    renderMissionTable();
    activityToast(`${pending.id} moved to active robot execution.`);
  }, 9000);
}

function addMission() {
  missions.unshift({ id: "TM-2053", crop: "Maize", disease: "Northern leaf blight", severity: "Medium", action: "Localized fungicide pass", status: "Pending", time: "19 min", zone: "B5", priority: "High" });
  missionState.selectedMissionId = "TM-2053";
  missionLoader();
  showToast("AI-generated treatment mission added.");
}

function activityToast(message) {
  showToast(message);
}

function initShell() {
  renderMobileNav();
  bindShellEvents();
}

function renderMobileNav() {
  const mobileList = document.querySelector(".mobile-nav-list");
  const desktopLinks = Array.from(document.querySelectorAll(".dashboard-sidebar .dashboard-nav-link"));
  if (!mobileList) return;
  mobileList.innerHTML = "";
  desktopLinks.forEach((link) => {
    const clone = link.cloneNode(true);
    clone.addEventListener("click", closeMobileNav);
    mobileList.append(clone);
  });
}

function bindShellEvents() {
  document.querySelector("[data-mobile-nav-toggle]")?.addEventListener("click", toggleMobileNav);
  document.querySelector("[data-sidebar-toggle]")?.addEventListener("click", toggleSidebar);
  document.querySelector("[data-search-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Mission search is ready for backend filtering.");
  });
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });
}

function toggleSidebar() {
  const toggle = document.querySelector("[data-sidebar-toggle]");
  const label = document.querySelector("[data-sidebar-toggle-label]");
  const willCollapse = !document.body.classList.contains("sidebar-collapsed");
  document.body.classList.toggle("sidebar-collapsed", willCollapse);
  toggle?.setAttribute("aria-expanded", String(!willCollapse));
  if (label) label.textContent = willCollapse ? "Open sidebar" : "Close sidebar";
}

function toggleMobileNav() {
  const panel = document.querySelector("[data-mobile-nav]");
  const toggle = document.querySelector("[data-mobile-nav-toggle]");
  const label = document.querySelector("[data-mobile-nav-label]");
  const isOpen = toggle?.getAttribute("aria-expanded") === "true";
  toggle?.setAttribute("aria-expanded", String(!isOpen));
  if (panel) panel.hidden = isOpen;
  document.body.classList.toggle("menu-open", !isOpen);
  if (label) label.textContent = isOpen ? "Open dashboard navigation" : "Close dashboard navigation";
}

function closeMobileNav() {
  const panel = document.querySelector("[data-mobile-nav]");
  const toggle = document.querySelector("[data-mobile-nav-toggle]");
  const label = document.querySelector("[data-mobile-nav-label]");
  toggle?.setAttribute("aria-expanded", "false");
  if (panel) panel.hidden = true;
  document.body.classList.remove("menu-open");
  if (label) label.textContent = "Open dashboard navigation";
}

function showToast(message) {
  const region = document.querySelector("[data-toast-region]");
  if (!region || !message) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  region.append(toast);
  window.setTimeout(() => toast.classList.add("is-hiding"), 2600);
  window.setTimeout(() => toast.remove(), 3200);
}
