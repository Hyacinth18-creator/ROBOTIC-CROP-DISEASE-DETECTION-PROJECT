const detections = [
  ["Tomato", "North Block", "Early Blight", "94%", "Review"],
  ["Maize", "River Plot", "Leaf Rust", "89%", "Treat"],
  ["Pepper", "Greenhouse 2", "Bacterial Spot", "81%", "Monitor"],
  ["Tomato", "South Row", "Late Blight", "97%", "Critical"],
];

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  renderDetections(detections);

  document.querySelector("[data-run-scan]")?.addEventListener("click", () => {
    document.querySelector("[data-result-status]").textContent = "Scanning";
    window.setTimeout(() => {
      document.querySelector("[data-result-status]").textContent = "Result Ready";
      showToast("New crop scan completed with 94% confidence.");
    }, 700);
  });

  document.querySelector("[data-upload-zone]")?.addEventListener("click", () => {
    document.querySelector("[data-upload-zone]").classList.toggle("is-active");
    showToast("Upload zone selected. Backend file picker can attach here.");
  });

  document.querySelector("[data-filter-critical]")?.addEventListener("click", () => {
    renderDetections(detections.filter((item) => item[4] === "Critical" || item[4] === "Treat"));
  });
});

function renderDetections(rows) {
  const table = document.querySelector("[data-detection-table]");
  if (!table) return;
  table.innerHTML = rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("");
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
    showToast("Disease detection search is ready for backend filtering.");
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
