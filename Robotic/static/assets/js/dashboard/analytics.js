const accuracy = [
  ["Tomato", 96],
  ["Maize", 92],
  ["Pepper", 89],
  ["Potato", 94],
];

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  renderAccuracy();
  renderTrend();
  renderInsights();

  document.querySelector("[data-analytics-range]")?.addEventListener("change", () => {
    showToast("Analytics range updated.");
  });
});

function renderAccuracy() {
  const chart = document.querySelector("[data-accuracy-chart]");
  if (!chart) return;
  chart.innerHTML = accuracy.map(([crop, value]) => `
    <div class="accuracy-row">
      <span>${crop}</span>
      <progress class="accuracy-track" max="100" value="${value}">${value}%</progress>
      <strong>${value}%</strong>
    </div>
  `).join("");
}

function renderTrend() {
  const svg = document.querySelector("[data-analytics-line]");
  if (!svg) return;
  svg.innerHTML = '<polyline points="24,168 118,132 212,146 306,88 400,102 494,62 588,76"></polyline>';
}

function renderInsights() {
  const list = document.querySelector("[data-insights-list]");
  if (!list) return;
  list.innerHTML = ["Tomato accuracy improved by 3.2%.", "Maize rust risk is concentrated near River Plot.", "Treatment response time dropped to 1.8 days."].map((item) => `<li>${item}</li>`).join("");
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
    showToast("Analytics search is ready for backend filtering.");
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
