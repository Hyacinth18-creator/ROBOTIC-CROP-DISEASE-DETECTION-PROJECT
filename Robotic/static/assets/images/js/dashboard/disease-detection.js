const supportedImageTypes = ["image/jpeg", "image/png", "image/webp"];
const maxImageSize = 8 * 1024 * 1024;

const diseaseProfiles = {
  Tomato: [
    {
      disease: "Early Blight",
      confidence: 94,
      severity: "Medium",
      treatment: "Apply a copper-based fungicide and remove infected lower leaves within 24 hours.",
      monitoring: "Rescan the affected row every 48 hours until lesion spread is stable.",
      prevention: "Rotate crops, mulch soil splash zones, and avoid overhead irrigation.",
      priority: "High",
      status: "Treatment Planned",
    },
    {
      disease: "Late Blight",
      confidence: 97,
      severity: "Critical",
      treatment: "Isolate the affected block and begin urgent fungicide treatment today.",
      monitoring: "Inspect neighboring plants twice daily for water-soaked leaf lesions.",
      prevention: "Increase airflow, remove plant debris, and sanitize tools between rows.",
      priority: "Critical",
      status: "Urgent Review",
    },
  ],
  Maize: [
    {
      disease: "Leaf Rust",
      confidence: 89,
      severity: "High",
      treatment: "Apply registered rust fungicide and prioritize high-density planting zones.",
      monitoring: "Track pustule spread across upper leaves for the next three inspections.",
      prevention: "Use resistant varieties and reduce crop residue carryover after harvest.",
      priority: "High",
      status: "Treatment Planned",
    },
  ],
  Pepper: [
    {
      disease: "Bacterial Spot",
      confidence: 86,
      severity: "Medium",
      treatment: "Remove heavily affected foliage and apply copper-mancozeb protection.",
      monitoring: "Check young leaves after rainfall and high-humidity periods.",
      prevention: "Use certified seed, keep leaves dry, and clean pruning equipment.",
      priority: "Medium",
      status: "Monitoring",
    },
  ],
  Potato: [
    {
      disease: "Powdery Mildew",
      confidence: 82,
      severity: "Low",
      treatment: "Apply sulfur-based control if symptoms expand beyond isolated leaves.",
      monitoring: "Repeat image scan in 72 hours to confirm whether powdery patches expand.",
      prevention: "Space plants for airflow and avoid excess nitrogen application.",
      priority: "Low",
      status: "Monitoring",
    },
  ],
};

const detectionState = {
  activeTab: "upload",
  selectedFile: null,
  selectedFileUrl: "",
  cameraStream: null,
  capturedFrame: "",
  lastResult: null,
  history: [
    createHistoryRecord("Tomato", "North Block", diseaseProfiles.Tomato[0], -1),
    createHistoryRecord("Maize", "River Plot", diseaseProfiles.Maize[0], -2),
    createHistoryRecord("Pepper", "Greenhouse 2", diseaseProfiles.Pepper[0], -4),
    createHistoryRecord("Tomato", "South Row", diseaseProfiles.Tomato[1], -6),
    createHistoryRecord("Potato", "North Block", diseaseProfiles.Potato[0], -8),
  ],
};

const selectors = {
  mobileNav: "[data-mobile-nav]",
  mobileToggle: "[data-mobile-nav-toggle]",
  mobileLabel: "[data-mobile-nav-label]",
  sidebarToggle: "[data-sidebar-toggle]",
  sidebarLabel: "[data-sidebar-toggle-label]",
};

document.addEventListener("DOMContentLoaded", () => {
  renderMobileNav();
  bindShellEvents();
  bindTabs();
  bindUpload();
  bindCamera();
  bindHistoryFilters();
  populateHistoryFilters();
  renderHistory();
});

function bindShellEvents() {
  document.querySelector(selectors.mobileToggle)?.addEventListener("click", toggleMobileNav);
  document.querySelector(selectors.sidebarToggle)?.addEventListener("click", toggleSidebar);
  document.querySelector("[data-search-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get("query")?.toString().trim();
    switchTab("history");
    const historySearch = document.querySelector("[data-history-search]");
    if (historySearch && query) {
      historySearch.value = query;
      renderHistory();
    }
  });
  document.querySelector("[data-focus-upload]")?.addEventListener("click", () => {
    switchTab("upload");
    document.querySelector("[data-upload-zone]")?.focus();
  });
  document.querySelectorAll("[data-toast]").forEach((button) => {
    button.addEventListener("click", () => showToast(button.dataset.toast));
  });
}

function bindTabs() {
  document.querySelectorAll("[data-tab-target]").forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
  });
}

function bindUpload() {
  const zone = document.querySelector("[data-upload-zone]");
  const input = document.querySelector("[data-file-input]");
  const browse = document.querySelector("[data-browse-file]");
  const form = document.querySelector("[data-upload-form]");

  browse?.addEventListener("click", () => input?.click());
  zone?.addEventListener("click", (event) => {
    if (!event.target.closest("button")) {
      input?.click();
    }
  });
  zone?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      input?.click();
    }
  });
  zone?.addEventListener("dragover", (event) => {
    event.preventDefault();
    zone.classList.add("is-active");
  });
  zone?.addEventListener("dragleave", () => zone.classList.remove("is-active"));
  zone?.addEventListener("drop", (event) => {
    event.preventDefault();
    zone.classList.remove("is-active");
    handleSelectedFile(event.dataTransfer?.files?.[0]);
  });
  input?.addEventListener("change", () => handleSelectedFile(input.files?.[0]));
  document.querySelector("[data-clear-upload]")?.addEventListener("click", clearUpload);
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    runDetection("upload");
  });
}

function bindCamera() {
  document.querySelector("[data-start-camera]")?.addEventListener("click", startCamera);
  document.querySelector("[data-stop-camera]")?.addEventListener("click", stopCamera);
  document.querySelector("[data-capture-frame]")?.addEventListener("click", captureFrame);
  document.querySelector("[data-camera-form]")?.addEventListener("submit", (event) => {
    event.preventDefault();
    runDetection("camera");
  });
}

function bindHistoryFilters() {
  document.querySelector("[data-history-filters]")?.addEventListener("input", renderHistory);
  document.querySelector("[data-history-filters]")?.addEventListener("change", renderHistory);
}

function switchTab(tabName) {
  detectionState.activeTab = tabName;
  document.querySelectorAll("[data-tab-target]").forEach((button) => {
    const isActive = button.dataset.tabTarget === tabName;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  document.querySelectorAll("[data-tab-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.tabPanel !== tabName;
  });
}

function handleSelectedFile(file) {
  const message = document.querySelector("[data-upload-message]");
  const detectButton = document.querySelector("[data-upload-detect]");

  if (!file) {
    setMessage(message, "Choose a crop image to begin detection.", "error");
    return;
  }

  if (!supportedImageTypes.includes(file.type)) {
    clearUpload();
    setMessage(message, "Use a supported image format: jpg, jpeg, png, or webp.", "error");
    return;
  }

  if (file.size > maxImageSize) {
    clearUpload();
    setMessage(message, "Image is larger than 8 MB. Choose a smaller file for reliable upload.", "error");
    return;
  }

  if (detectionState.selectedFileUrl) {
    URL.revokeObjectURL(detectionState.selectedFileUrl);
  }

  detectionState.selectedFile = file;
  detectionState.selectedFileUrl = URL.createObjectURL(file);
  document.querySelector("[data-preview-image]").src = detectionState.selectedFileUrl;
  document.querySelector("[data-preview-name]").textContent = `${file.name} selected`;
  document.querySelector("[data-upload-empty]").hidden = true;
  document.querySelector("[data-upload-preview]").hidden = false;
  detectButton.disabled = false;
  setMessage(message, "Image ready. Run detection when the leaf area is visible.", "success");
}

function clearUpload() {
  if (detectionState.selectedFileUrl) {
    URL.revokeObjectURL(detectionState.selectedFileUrl);
  }
  detectionState.selectedFile = null;
  detectionState.selectedFileUrl = "";
  const input = document.querySelector("[data-file-input]");
  if (input) {
    input.value = "";
  }
  document.querySelector("[data-preview-image]").src = "";
  document.querySelector("[data-preview-name]").textContent = "";
  document.querySelector("[data-upload-empty]").hidden = false;
  document.querySelector("[data-upload-preview]").hidden = true;
  document.querySelector("[data-upload-detect]").disabled = true;
  setMessage(document.querySelector("[data-upload-message]"), "", "");
}

async function startCamera() {
  const message = document.querySelector("[data-camera-message]");

  if (!navigator.mediaDevices?.getUserMedia) {
    setMessage(message, "This browser does not support camera access.", "error");
    return;
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
    detectionState.cameraStream = stream;
    const video = document.querySelector("[data-camera-video]");
    video.srcObject = stream;
    await video.play();
    video.hidden = false;
    document.querySelector("[data-camera-empty]").hidden = true;
    document.querySelector("[data-captured-image]").hidden = true;
    document.querySelector("[data-start-camera]").disabled = true;
    document.querySelector("[data-stop-camera]").disabled = false;
    document.querySelector("[data-capture-frame]").disabled = false;
    document.querySelector("[data-camera-status]").textContent = "Camera active";
    setMessage(message, "Camera ready. Capture a clear leaf frame for detection.", "success");
  } catch (error) {
    setMessage(message, getCameraErrorMessage(error), "error");
    document.querySelector("[data-camera-status]").textContent = "Permission needed";
  }
}

function stopCamera() {
  detectionState.cameraStream?.getTracks().forEach((track) => track.stop());
  detectionState.cameraStream = null;
  const video = document.querySelector("[data-camera-video]");
  video.pause();
  video.srcObject = null;
  video.hidden = true;
  document.querySelector("[data-camera-empty]").hidden = detectionState.capturedFrame !== "";
  document.querySelector("[data-start-camera]").disabled = false;
  document.querySelector("[data-stop-camera]").disabled = true;
  document.querySelector("[data-capture-frame]").disabled = true;
  document.querySelector("[data-camera-status]").textContent = "Camera idle";
}

function captureFrame() {
  const video = document.querySelector("[data-camera-video]");
  const canvas = document.querySelector("[data-camera-canvas]");
  const image = document.querySelector("[data-captured-image]");
  const width = video.videoWidth || 1280;
  const height = video.videoHeight || 720;
  canvas.width = width;
  canvas.height = height;
  canvas.getContext("2d").drawImage(video, 0, 0, width, height);
  detectionState.capturedFrame = canvas.toDataURL("image/png");
  image.src = detectionState.capturedFrame;
  image.hidden = false;
  video.hidden = true;
  document.querySelector("[data-camera-empty]").hidden = true;
  document.querySelector("[data-camera-detect]").disabled = false;
  setMessage(document.querySelector("[data-camera-message]"), "Frame captured. Run detection or retake the image.", "success");
}

async function runDetection(source) {
  const cropSelector = source === "camera" ? "[data-camera-crop]" : "[data-upload-crop]";
  const messageSelector = source === "camera" ? "[data-camera-message]" : "[data-upload-message]";
  const buttonSelector = source === "camera" ? "[data-camera-detect]" : "[data-upload-detect]";
  const message = document.querySelector(messageSelector);
  const button = document.querySelector(buttonSelector);

  if (source === "upload" && !detectionState.selectedFile) {
    setMessage(message, "Select an image before running detection.", "error");
    return;
  }

  if (source === "camera" && !detectionState.capturedFrame) {
    setMessage(message, "Capture a camera frame before running detection.", "error");
    return;
  }

  setLoading(button, true);
  setMessage(message, "Analyzing crop image with SmartAI disease model...", "success");

  try {
    const crop = document.querySelector(cropSelector).value;
    const fieldZone = new FormData(document.querySelector(source === "camera" ? "[data-camera-form]" : "[data-upload-form]")).get("fieldZone");
    const result = await detectDisease({ crop, fieldZone, source });
    detectionState.lastResult = result;
    detectionState.history.unshift(result);
    renderResult(result);
    populateHistoryFilters();
    renderHistory();
    setMessage(message, "Detection complete. Review severity and treatment guidance.", "success");
    showToast(`${result.disease} detected on ${result.crop} with ${result.confidence}% confidence.`);
  } catch (error) {
    setMessage(message, error.message || "Detection failed. Please try again.", "error");
  } finally {
    setLoading(button, false);
  }
}

async function detectDisease({ crop, fieldZone, source }) {
  if (window.SmartAIConfig?.ENABLE_LIVE_DETECTION_API && window.SmartAIApi) {
    return requestLiveDetection({ crop, fieldZone, source });
  }

  const profileSet = diseaseProfiles[crop] || diseaseProfiles.Tomato;
  const profile = profileSet[source === "camera" && profileSet.length > 1 ? 1 : 0];

  await new Promise((resolve) => {
    window.setTimeout(resolve, 850);
  });

  return {
    id: `det-${Date.now()}`,
    source,
    crop,
    fieldZone,
    disease: profile.disease,
    confidence: profile.confidence,
    severity: profile.severity,
    timestamp: new Date().toISOString(),
    treatment: profile.treatment,
    monitoring: profile.monitoring,
    prevention: profile.prevention,
    priority: profile.priority,
    status: profile.status,
  };
}

async function requestLiveDetection({ crop, fieldZone, source }) {
  if (source === "upload") {
    const payload = new FormData();
    payload.append("image", detectionState.selectedFile);
    payload.append("cropType", crop);
    payload.append("fieldZone", fieldZone);
    return normalizeApiResult(await window.SmartAIApi.detectImage(payload), source, crop, fieldZone);
  }

  return normalizeApiResult(await window.SmartAIApi.detectCamera({
    image: detectionState.capturedFrame,
    cropType: crop,
    fieldZone,
  }), source, crop, fieldZone);
}

function normalizeApiResult(payload, source, crop, fieldZone) {
  const result = payload.result || payload;
  return {
    id: result.id || `det-${Date.now()}`,
    source,
    crop: result.crop || result.cropType || crop,
    fieldZone: result.fieldZone || fieldZone,
    disease: result.disease || result.diseaseName,
    confidence: Number(result.confidence || result.confidenceScore || 0),
    severity: result.severity || "Low",
    timestamp: result.timestamp || new Date().toISOString(),
    treatment: result.treatment || result.recommendedTreatment,
    monitoring: result.monitoring || result.monitoringRecommendation,
    prevention: result.prevention || result.preventionAdvice,
    priority: result.priority || result.actionPriority || result.severity || "Low",
    status: result.status || result.treatmentStatus || "Review",
  };
}

function renderResult(result) {
  const severityClass = getSeverityClass(result.severity);
  document.querySelector("[data-result-summary]").textContent = `${result.source === "camera" ? "Camera" : "Upload"} detection completed for ${result.fieldZone}.`;
  document.querySelector("[data-confidence-score]").textContent = `${result.confidence}%`;
  document.querySelector("[data-confidence-ring]").style.setProperty("--confidence", `${result.confidence}%`);
  document.querySelector("[data-result-crop]").textContent = result.crop;
  document.querySelector("[data-result-disease]").textContent = result.disease;
  document.querySelector("[data-result-time]").textContent = formatDateTime(result.timestamp);
  setBadge(document.querySelector("[data-result-severity]"), result.severity, severityClass);
  document.querySelector("[data-treatment-recommendation]").textContent = result.treatment;
  document.querySelector("[data-monitoring-recommendation]").textContent = result.monitoring;
  document.querySelector("[data-prevention-advice]").textContent = result.prevention;
  document.querySelector("[data-priority-label]").textContent = `${result.priority} action priority`;
  setBadge(document.querySelector("[data-action-priority]"), result.priority, getSeverityClass(result.priority));
  const indicator = document.querySelector("[data-status-indicator]");
  indicator.className = `status-dot status-dot-${severityClass}`;
  indicator.setAttribute("aria-label", `${result.severity} disease status`);
}

function renderHistory() {
  const table = document.querySelector("[data-history-table]");
  if (!table) {
    return;
  }

  const filtered = getFilteredHistory();
  document.querySelector("[data-history-count]").textContent = `${filtered.length} records`;
  document.querySelector("[data-pagination-status]").textContent = `Showing ${filtered.length} of ${detectionState.history.length} records. Pagination ready for backend datasets.`;

  if (!filtered.length) {
    table.innerHTML = `<tr><td colspan="6">No detection records match the current filters.</td></tr>`;
    return;
  }

  table.innerHTML = filtered.map((item) => `
    <tr>
      <td>${formatDateTime(item.timestamp)}</td>
      <td>${item.crop}</td>
      <td>${item.disease}</td>
      <td>${item.confidence}%</td>
      <td><span class="severity-badge severity-badge-${getSeverityClass(item.severity)}">${item.severity}</span></td>
      <td><button class="status-pill" type="button" data-history-result="${item.id}">${item.status}</button></td>
    </tr>
  `).join("");

  table.querySelectorAll("[data-history-result]").forEach((button) => {
    button.addEventListener("click", () => {
      const result = detectionState.history.find((item) => item.id === button.dataset.historyResult);
      if (result) {
        renderResult(result);
        showToast(`${result.crop} ${result.disease} result loaded.`);
      }
    });
  });
}

function getFilteredHistory() {
  const query = document.querySelector("[data-history-search]")?.value.trim().toLowerCase() || "";
  const disease = document.querySelector("[data-filter-disease]")?.value || "";
  const crop = document.querySelector("[data-filter-crop]")?.value || "";
  const severity = document.querySelector("[data-filter-severity]")?.value || "";

  return detectionState.history.filter((item) => {
    const searchable = `${item.crop} ${item.disease} ${item.fieldZone} ${item.treatment} ${item.status}`.toLowerCase();
    return (!query || searchable.includes(query))
      && (!disease || item.disease === disease)
      && (!crop || item.crop === crop)
      && (!severity || item.severity === severity);
  });
}

function populateHistoryFilters() {
  syncFilterOptions("[data-filter-disease]", [...new Set(detectionState.history.map((item) => item.disease))]);
  syncFilterOptions("[data-filter-crop]", [...new Set(detectionState.history.map((item) => item.crop))]);
}

function syncFilterOptions(selector, values) {
  const select = document.querySelector(selector);
  if (!select) {
    return;
  }
  const currentValue = select.value;
  const firstOption = select.querySelector("option").outerHTML;
  select.innerHTML = firstOption + values.sort().map((value) => `<option value="${value}">${value}</option>`).join("");
  select.value = values.includes(currentValue) ? currentValue : "";
}

function renderMobileNav() {
  const mobileList = document.querySelector(".mobile-nav-list");
  const desktopLinks = Array.from(document.querySelectorAll(".dashboard-sidebar .dashboard-nav-link"));
  if (!mobileList) {
    return;
  }
  mobileList.innerHTML = "";
  desktopLinks.forEach((link) => {
    const clone = link.cloneNode(true);
    clone.addEventListener("click", closeMobileNav);
    mobileList.append(clone);
  });
}

function toggleSidebar() {
  const toggle = document.querySelector(selectors.sidebarToggle);
  const label = document.querySelector(selectors.sidebarLabel);
  const willCollapse = !document.body.classList.contains("sidebar-collapsed");
  document.body.classList.toggle("sidebar-collapsed", willCollapse);
  toggle?.setAttribute("aria-expanded", String(!willCollapse));
  if (label) {
    label.textContent = willCollapse ? "Open sidebar" : "Close sidebar";
  }
}

function toggleMobileNav() {
  const panel = document.querySelector(selectors.mobileNav);
  const toggle = document.querySelector(selectors.mobileToggle);
  const label = document.querySelector(selectors.mobileLabel);
  const isOpen = toggle?.getAttribute("aria-expanded") === "true";
  toggle?.setAttribute("aria-expanded", String(!isOpen));
  if (panel) {
    panel.hidden = isOpen;
  }
  document.body.classList.toggle("menu-open", !isOpen);
  if (label) {
    label.textContent = isOpen ? "Open dashboard navigation" : "Close dashboard navigation";
  }
}

function closeMobileNav() {
  const panel = document.querySelector(selectors.mobileNav);
  const toggle = document.querySelector(selectors.mobileToggle);
  const label = document.querySelector(selectors.mobileLabel);
  toggle?.setAttribute("aria-expanded", "false");
  if (panel) {
    panel.hidden = true;
  }
  document.body.classList.remove("menu-open");
  if (label) {
    label.textContent = "Open dashboard navigation";
  }
}

function createHistoryRecord(crop, fieldZone, profile, daysOffset) {
  const timestamp = new Date();
  timestamp.setDate(timestamp.getDate() + daysOffset);
  return {
    id: `seed-${crop}-${profile.disease}`.toLowerCase().replaceAll(" ", "-"),
    source: "history",
    crop,
    fieldZone,
    disease: profile.disease,
    confidence: profile.confidence,
    severity: profile.severity,
    timestamp: timestamp.toISOString(),
    treatment: profile.treatment,
    monitoring: profile.monitoring,
    prevention: profile.prevention,
    priority: profile.priority,
    status: profile.status,
  };
}

function setBadge(element, text, severityClass) {
  element.textContent = text;
  element.className = `severity-badge severity-badge-${severityClass}`;
}

function getSeverityClass(value) {
  return String(value).toLowerCase();
}

function setLoading(button, isLoading) {
  if (!button) {
    return;
  }
  button.disabled = isLoading;
  button.classList.toggle("is-loading", isLoading);
  button.dataset.originalText = button.dataset.originalText || button.textContent;
  button.textContent = isLoading ? "Analyzing..." : button.dataset.originalText;
}

function setMessage(element, message, state) {
  if (!element) {
    return;
  }
  element.textContent = message;
  element.dataset.state = state;
}

function getCameraErrorMessage(error) {
  if (error?.name === "NotAllowedError") {
    return "Camera permission was denied. Allow camera access in the browser to continue.";
  }
  if (error?.name === "NotFoundError") {
    return "No camera device was found on this device.";
  }
  return "Camera could not start. Check permissions and try again.";
}

function formatDateTime(value) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
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
  window.setTimeout(() => toast.classList.add("is-hiding"), 2600);
  window.setTimeout(() => toast.remove(), 3200);
}
