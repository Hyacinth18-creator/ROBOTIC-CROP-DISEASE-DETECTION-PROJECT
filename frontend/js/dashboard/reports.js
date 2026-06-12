const reports = [
  ["Disease Summary", "Generated 12 Jun 2026", "Ready"],
  ["Treatment Audit", "Generated 11 Jun 2026", "Ready"],
  ["Farm Performance", "Draft updated today", "Draft"],
];

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  renderReports();
  document.querySelector("[data-create-report]")?.addEventListener("click", () => {
    reports.unshift(["Custom Farm Report", "Generated now", "Ready"]);
    renderReports();
    showToast("New report created.");
  });
  document.querySelector("[data-preview-report]")?.addEventListener("click", () => showToast("Report preview opened."));
});

function renderReports() {
  const list = document.querySelector("[data-report-list]");
  if (!list) return;
  list.innerHTML = reports.map(([name, date, status]) => `<li>${name}<span>${date} - ${status}</span></li>`).join("");
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
    showToast("Report search is ready for backend filtering.");
  });
  document.querySelectorAll("[data-toast]").forEach((button) => button.addEventListener("click", () => showToast(button.dataset.toast)));
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
