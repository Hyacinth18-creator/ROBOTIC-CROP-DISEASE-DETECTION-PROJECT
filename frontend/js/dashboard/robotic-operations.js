const robotState = {
  robotIndex: 0,
  tick: 0,
  mission: "North Plot Disease Sweep",
};

const robotRoute = [2, 3, 4, 12, 20, 28, 36, 37, 38, 46, 54, 55, 56, 48, 40, 32, 24, 16, 8, 9, 10, 18, 26, 34, 42, 50, 58, 59];

const zonePlan = new Map([
  [5, "inspection"],
  [11, "disease"],
  [18, "treated"],
  [22, "inspection"],
  [30, "disease"],
  [38, "treated"],
  [43, "inspection"],
  [51, "disease"],
]);

const activityMessages = [
  "Scan completed across tomato block A3.",
  "Disease probability exceeded threshold in maize corridor B2.",
  "Precision nozzle armed for targeted copper treatment.",
  "Treatment applied to bean row C6 with 94% coverage.",
  "Mission telemetry synchronized for agronomy review.",
];

document.addEventListener("DOMContentLoaded", () => {
  initShell();
  gridRenderer();
  statusUpdater();
  activityFeedGenerator("Robot online and awaiting mission loop.");
  missionSimulator();
  document.querySelector("[data-start-mission]")?.addEventListener("click", runMissionStep);
});

function gridRenderer() {
  const grid = document.querySelector("[data-farm-grid]");
  if (!grid) return;

  const fragment = document.createDocumentFragment();
  for (let index = 0; index < 64; index += 1) {
    const cell = document.createElement("button");
    const zone = zonePlan.get(index) || "healthy";
    cell.type = "button";
    cell.className = `farm-cell is-${zone}`;
    cell.dataset.index = String(index);
    cell.dataset.zone = zone;
    cell.setAttribute("aria-label", `Farm block ${index + 1}: ${zone.replace("-", " ")}`);
    cell.addEventListener("click", () => {
      activityFeedGenerator(`Manual inspection requested for block ${index + 1}.`);
      showToast(`Block ${index + 1} queued for robot inspection.`);
    });
    fragment.append(cell);
  }
  grid.append(fragment);
  robotMovementEngine();
}

function robotMovementEngine() {
  document.querySelectorAll(".farm-cell.is-robot").forEach((cell) => cell.classList.remove("is-robot"));
  const currentIndex = robotRoute[robotState.robotIndex % robotRoute.length];
  document.querySelector(`[data-index="${currentIndex}"]`)?.classList.add("is-robot");
  const zone = zonePlan.get(currentIndex);
  if (zone === "disease") {
    activityFeedGenerator(`Disease detection event logged at block ${currentIndex + 1}.`);
  }
  if (zone === "treated") {
    activityFeedGenerator(`Treatment execution confirmed at block ${currentIndex + 1}.`);
  }
}

function statusUpdater() {
  const values = {
    "[data-robot-status]": "Autonomous",
    "[data-battery-health]": `${Math.max(61, 92 - robotState.tick)}%`,
    "[data-area-covered]": `${(34.8 + robotState.tick * 1.7).toFixed(1)} ha`,
    "[data-plants-scanned]": (12840 + robotState.tick * 96).toLocaleString(),
    "[data-diseases-detected]": String(24 + Math.floor(robotState.tick / 2)),
    "[data-treatments-applied]": String(17 + Math.floor(robotState.tick / 3)),
    "[data-mission-status]": `${robotState.mission}: block ${robotRoute[robotState.robotIndex % robotRoute.length] + 1}`,
  };

  Object.entries(values).forEach(([selector, value]) => {
    const element = document.querySelector(selector);
    if (element) element.textContent = value;
  });
}

function activityFeedGenerator(message) {
  const feed = document.querySelector("[data-activity-feed]");
  if (!feed) return;

  const item = document.createElement("li");
  const time = document.createElement("time");
  time.dateTime = new Date().toISOString();
  time.textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  item.append(time, document.createTextNode(message));
  feed.prepend(item);

  while (feed.children.length > 8) {
    feed.lastElementChild?.remove();
  }
}

function missionSimulator() {
  window.setInterval(runMissionStep, 2800);
}

function runMissionStep() {
  robotState.tick += 1;
  robotState.robotIndex = (robotState.robotIndex + 1) % robotRoute.length;
  robotMovementEngine();
  statusUpdater();
  activityFeedGenerator(activityMessages[robotState.tick % activityMessages.length]);
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
    showToast("Robot telemetry search is ready for backend filtering.");
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
