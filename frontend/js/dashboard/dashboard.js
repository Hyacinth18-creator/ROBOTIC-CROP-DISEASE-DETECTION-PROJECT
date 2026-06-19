const dashboardState = {
  period: "month",
  healthView: "all",
  taskExpanded: false,
};

const kpiData = [
  {
    label: "Healthy Crops",
    value: "8,420",
    change: "+12.8% from last month",
    tone: "green",
  },
  {
    label: "Diseased Crops",
    value: "312",
    change: "-8.4% from last month",
    tone: "red",
  },
  {
    label: "Detection Accuracy",
    value: "96.7%",
    change: "+2.1% model improvement",
    tone: "blue",
  },
  {
    label: "Robot Missions",
    value: "18",
    change: "6 active precision routes",
    tone: "purple",
  },
  {
    label: "Area Covered",
    value: "412 ha",
    change: "+38 ha autonomous coverage",
    tone: "green",
  },
  {
    label: "Battery Health",
    value: "87%",
    change: "2h 45m field endurance",
    tone: "blue",
  },
];

const healthData = {
  all: [
    { label: "Healthy", value: 68, color: "#18b86b" },
    { label: "Watch", value: 18, color: "#48b9f2" },
    { label: "Diseased", value: 9, color: "#f6b23c" },
    { label: "Critical", value: 5, color: "#ef5b5b" },
  ],
  tomatoes: [
    { label: "Healthy", value: 72, color: "#18b86b" },
    { label: "Watch", value: 16, color: "#48b9f2" },
    { label: "Diseased", value: 8, color: "#f6b23c" },
    { label: "Critical", value: 4, color: "#ef5b5b" },
  ],
  maize: [
    { label: "Healthy", value: 64, color: "#18b86b" },
    { label: "Watch", value: 21, color: "#48b9f2" },
    { label: "Diseased", value: 10, color: "#f6b23c" },
    { label: "Critical", value: 5, color: "#ef5b5b" },
  ],
  pepper: [
    { label: "Healthy", value: 59, color: "#18b86b" },
    { label: "Watch", value: 24, color: "#48b9f2" },
    { label: "Diseased", value: 11, color: "#f6b23c" },
    { label: "Critical", value: 6, color: "#ef5b5b" },
  ],
};

const diseaseSeries = {
  month: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"],
    values: [280, 220, 320, 235, 240, 188, 258, 292, 378],
  },
  year: {
    labels: ["2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026"],
    values: [540, 505, 490, 430, 390, 335, 300, 258],
  },
};

const tasks = [
  {
    name: "Apply Fungicide to Corn",
    assignee: "Jane Smith",
    due: "29-Aug-26",
    status: "Pending",
  },
  {
    name: "Review Tomato Leaf Scans",
    assignee: "Tom Richards",
    due: "02-Sep-26",
    status: "In Progress",
  },
  {
    name: "Inspect Pepper Hotspot",
    assignee: "Maria Lopez",
    due: "04-Sep-26",
    status: "Scheduled",
  },
  {
    name: "Calibrate Drone Route",
    assignee: "Albert Flores",
    due: "08-Sep-26",
    status: "Pending",
  },
];

const summaryItems = [
  { crop: "Tomatoes", amount: "510 tons", tone: "green" },
  { crop: "Carrots", amount: "120 tons", tone: "blue" },
  { crop: "Corn", amount: "200 tons", tone: "yellow" },
  { crop: "Pepper", amount: "86 tons", tone: "red" },
];

const selectors = {
  mobileNav: "[data-mobile-nav]",
  mobileToggle: "[data-mobile-nav-toggle]",
  mobileLabel: "[data-mobile-nav-label]",
  sidebarToggle: "[data-sidebar-toggle]",
  sidebarLabel: "[data-sidebar-toggle-label]",
};

document.addEventListener("DOMContentLoaded", () => {
  renderMobileNav();
  renderKpis();
  renderHealthChart();
  renderLineChart("month");
  renderTasks();
  renderSummary();
  bindDashboardEvents();
});

function bindDashboardEvents() {
  document.querySelector(selectors.mobileToggle)?.addEventListener("click", toggleMobileNav);
  document.querySelector(selectors.sidebarToggle)?.addEventListener("click", toggleSidebar);

  document.querySelector("[data-period-filter]")?.addEventListener("change", (event) => {
    dashboardState.period = event.target.value;
    showToast(`Dashboard updated for ${event.target.options[event.target.selectedIndex].text}.`);
  });

  document.querySelector("[data-health-view]")?.addEventListener("change", (event) => {
    dashboardState.healthView = event.target.value;
    renderHealthChart();
  });

  document.querySelectorAll("[data-chart-range]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-chart-range]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      renderLineChart(button.dataset.chartRange);
    });
  });

  document.querySelector("[data-add-task]")?.addEventListener("click", () => {
    tasks.unshift({
      name: "Scout New Disease Alert",
      assignee: "SmartAI Team",
      due: "Today",
      status: "Scheduled",
    });
    dashboardState.taskExpanded = true;
    renderTasks();
    showToast("New treatment task added to the workflow.");
  });

  document.querySelector("[data-toggle-tasks]")?.addEventListener("click", (event) => {
    dashboardState.taskExpanded = !dashboardState.taskExpanded;
    event.currentTarget.textContent = dashboardState.taskExpanded ? "Show Less" : "View All";
    renderTasks();
  });

  document.querySelector("[data-export-dashboard]")?.addEventListener("click", exportDashboard);

  document.querySelector("[data-search-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query")?.toString().trim();
    showToast(query ? `Searching dashboard for "${query}".` : "Type a search term to filter farm intelligence.");
  });

  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });
}

function renderMobileNav() {
  const mobileList = document.querySelector(".mobile-nav-list");
  const desktopButtons = Array.from(document.querySelectorAll(".dashboard-sidebar .dashboard-nav-link"));

  if (!mobileList) {
    return;
  }

  mobileList.innerHTML = "";
  desktopButtons.forEach((button) => {
    const clone = button.cloneNode(true);
    clone.addEventListener("click", closeMobileNav);
    mobileList.append(clone);
  });
}

function renderKpis() {
  const grid = document.querySelector("[data-kpi-grid]");

  if (!grid) {
    return;
  }

  grid.innerHTML = "";
  kpiData.forEach((item) => {
    const card = document.createElement("article");
    card.className = `kpi-card kpi-card-${item.tone}`;
    card.tabIndex = 0;
    card.innerHTML = `
      <div class="kpi-icon" aria-hidden="true"></div>
      <div>
        <h2>${item.label}</h2>
        <strong>${item.value}</strong>
        <span>${item.change}</span>
      </div>
    `;
    card.addEventListener("click", () => showToast(`${item.label} details are ready for backend data drilldown.`));
    grid.append(card);
  });
}

function renderHealthChart() {
  const mount = document.querySelector("[data-health-chart]");
  const legend = document.querySelector("[data-health-legend]");
  const data = healthData[dashboardState.healthView] || healthData.all;

  if (!mount || !legend) {
    return;
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  let offset = 0;
  const rings = data.map((item, index) => {
    const radius = 86 - index * 15;
    const circumference = 2 * Math.PI * radius;
    const segment = (item.value / total) * circumference;
    const gap = circumference - segment;
    const dashOffset = -offset;
    offset += segment * 0.22;
    return `<circle class="health-ring" cx="120" cy="120" r="${radius}" stroke="${item.color}" stroke-dasharray="${segment.toFixed(2)} ${gap.toFixed(2)}" stroke-dashoffset="${dashOffset.toFixed(2)}"></circle>`;
  }).join("");

  mount.innerHTML = `
    <svg class="radial-chart" viewBox="0 0 240 240" role="img" aria-label="Crop health monitoring chart">
      <circle class="radial-bg" cx="120" cy="120" r="94"></circle>
      ${rings}
      <text class="radial-value" x="120" y="114">${data[0].value}%</text>
      <text class="radial-label" x="120" y="139">healthy</text>
    </svg>
  `;

  legend.innerHTML = data.map((item) => `
    <button class="legend-item" type="button" data-toast="${item.label}: ${item.value}% of monitored crops.">
      <span class="legend-dot legend-dot-${item.label.toLowerCase()}" aria-hidden="true"></span>
      <span>${item.label}</span>
    </button>
  `).join("");

  legend.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });
}

function renderLineChart(range) {
  const svg = document.querySelector("[data-line-chart]");
  const tooltip = document.querySelector("[data-chart-tooltip]");
  const series = diseaseSeries[range] || diseaseSeries.month;

  if (!svg || !tooltip) {
    return;
  }

  const width = 640;
  const height = 240;
  const padding = 34;
  const max = Math.max(...series.values) + 40;
  const min = Math.min(...series.values) - 40;
  const xStep = (width - padding * 2) / (series.values.length - 1);
  const points = series.values.map((value, index) => {
    const x = padding + index * xStep;
    const y = height - padding - ((value - min) / (max - min)) * (height - padding * 2);
    return { x, y, value, label: series.labels[index] };
  });

  const areaPoints = `${padding},${height - padding} ${points.map((point) => `${point.x},${point.y}`).join(" ")} ${width - padding},${height - padding}`;

  svg.innerHTML = `
    <defs>
      <linearGradient id="lineAreaGradient" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stop-color="#16a34a" stop-opacity="0.22"></stop>
        <stop offset="100%" stop-color="#16a34a" stop-opacity="0"></stop>
      </linearGradient>
    </defs>
    ${[0, 1, 2, 3].map((line) => {
      const y = padding + line * ((height - padding * 2) / 3);
      return `<line class="chart-grid-line" x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}"></line>`;
    }).join("")}
    <polygon class="chart-area" points="${areaPoints}"></polygon>
    <polyline class="chart-line" points="${points.map((point) => `${point.x},${point.y}`).join(" ")}"></polyline>
    ${points.map((point) => `
      <g class="chart-point-group" tabindex="0" data-label="${point.label}" data-value="${point.value}" transform="translate(${point.x} ${point.y})">
        <circle class="chart-point" r="5"></circle>
      </g>
    `).join("")}
    ${points.map((point) => `<text class="chart-axis-label" x="${point.x}" y="${height - 7}">${point.label}</text>`).join("")}
  `;

  svg.querySelectorAll(".chart-point-group").forEach((point) => {
    const syncTooltip = () => {
      const label = point.dataset.label;
      const value = point.dataset.value;
      tooltip.textContent = `${label}: ${value} detections`;
      tooltip.hidden = false;
    };
    point.addEventListener("mouseenter", syncTooltip);
    point.addEventListener("focus", syncTooltip);
    point.addEventListener("mouseleave", () => {
      tooltip.hidden = true;
    });
    point.addEventListener("blur", () => {
      tooltip.hidden = true;
    });
  });
}

function renderTasks() {
  const table = document.querySelector("[data-task-table]");

  if (!table) {
    return;
  }

  const visibleTasks = dashboardState.taskExpanded ? tasks : tasks.slice(0, 3);
  table.innerHTML = visibleTasks.map((task) => `
    <tr>
      <td>${task.name}</td>
      <td>${task.assignee}</td>
      <td>${task.due}</td>
      <td><button class="status-pill" type="button" data-toast="${task.name}: ${task.status}">${task.status}</button></td>
    </tr>
  `).join("");

  table.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });
}

function renderSummary() {
  const list = document.querySelector("[data-summary-list]");

  if (!list) {
    return;
  }

  list.innerHTML = summaryItems.map((item) => `
    <li>
      <span class="summary-crop summary-crop-${item.tone}" aria-hidden="true"></span>
      <span>${item.crop}</span>
      <strong>${item.amount}</strong>
    </li>
  `).join("");
}

function toggleSidebar() {
  const toggle = document.querySelector(selectors.sidebarToggle);
  const label = document.querySelector(selectors.sidebarLabel);
  const willCollapse = !document.body.classList.contains("sidebar-collapsed");

  document.body.classList.toggle("sidebar-collapsed", willCollapse);

  if (toggle) {
    toggle.setAttribute("aria-expanded", String(!willCollapse));
  }

  if (label) {
    label.textContent = willCollapse ? "Open sidebar" : "Close sidebar";
  }
}

function toggleMobileNav() {
  const panel = document.querySelector(selectors.mobileNav);
  const toggle = document.querySelector(selectors.mobileToggle);
  const label = document.querySelector(selectors.mobileLabel);
  const isOpen = toggle?.getAttribute("aria-expanded") === "true";

  if (!panel || !toggle) {
    return;
  }

  toggle.setAttribute("aria-expanded", String(!isOpen));
  panel.hidden = isOpen;
  document.body.classList.toggle("menu-open", !isOpen);

  if (label) {
    label.textContent = isOpen ? "Open dashboard navigation" : "Close dashboard navigation";
  }
}

function closeMobileNav() {
  const panel = document.querySelector(selectors.mobileNav);
  const toggle = document.querySelector(selectors.mobileToggle);
  const label = document.querySelector(selectors.mobileLabel);

  if (!panel || !toggle) {
    return;
  }

  toggle.setAttribute("aria-expanded", "false");
  panel.hidden = true;
  document.body.classList.remove("menu-open");

  if (label) {
    label.textContent = "Open dashboard navigation";
  }
}

function exportDashboard() {
  const payload = {
    exportedAt: new Date().toISOString(),
    section: "dashboard",
    period: dashboardState.period,
    kpis: kpiData,
    cropHealth: healthData[dashboardState.healthView],
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "smartai-dashboard-export.json";
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Dashboard export generated.");
}

function showToast(message) {
  const region = document.querySelector("[data-toast-region]");

  if (!region || !message) {
    return;
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  region.append(toast);

  window.setTimeout(() => {
    toast.classList.add("is-hiding");
  }, 2600);

  window.setTimeout(() => {
    toast.remove();
  }, 3200);
}
