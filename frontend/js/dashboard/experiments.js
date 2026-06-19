const accuracyData = [
  { label: "Tomato Accuracy", value: 96.8 },
  { label: "Maize Accuracy", value: 94.2 },
  { label: "Bean Accuracy", value: 92.9 },
];

const navigationData = [
  { label: "Manual Inspection", distance: 7.8, time: 168, scanned: 1240 },
  { label: "Autonomous Robot Navigation", distance: 6.1, time: 74, scanned: 3180 },
];

const precisionData = [
  { label: "Chemical Usage Reduction", value: 43 },
  { label: "Coverage Accuracy", value: 91 },
  { label: "Response Time Improvement", value: 58 },
];

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  chartRenderer();
  comparisonDataRenderer();
  metricsUpdater();
});

function chartRenderer() {
  const mount = document.querySelector("[data-accuracy-chart]");
  if (!mount) return;
  mount.innerHTML = accuracyData.map((item) => `
    <div class="bar-row">
      <span>${item.label.replace(" Accuracy", "")}</span>
      <span class="bar-track"><span class="bar-fill bar-fill-${Math.round(item.value)}"></span></span>
      <strong>${item.value}%</strong>
    </div>
  `).join("");
}

function comparisonDataRenderer() {
  const mount = document.querySelector("[data-navigation-chart]");
  if (!mount) return;
  mount.innerHTML = navigationData.map((item) => `
    <div class="experiment-stat">
      <span>${item.label}</span>
      <strong>${item.time} min</strong>
      <p>${item.distance} km covered and ${item.scanned.toLocaleString()} plants scanned.</p>
    </div>
  `).join("");
}

function metricsUpdater() {
  const mount = document.querySelector("[data-precision-metrics]");
  if (!mount) return;
  mount.innerHTML = precisionData.map((item) => `
    <article class="experiment-stat">
      <span>${item.label}</span>
      <strong>${item.value}%</strong>
      <p>${item.label} measured against traditional broadcast spraying.</p>
    </article>
  `).join("");
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
    showToast("Experiment search is ready for backend result filtering.");
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
