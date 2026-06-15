(() => {
  const selector = '.icon-button[aria-label="View notifications"]';
  let activePanel = null;

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(selector);

    if (toggle) {
      event.preventDefault();
      event.stopPropagation();
      toggleNotificationPanel(toggle);
      return;
    }

    if (activePanel && !activePanel.contains(event.target)) {
      closeNotificationPanel();
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeNotificationPanel();
    }
  });

  function toggleNotificationPanel(toggle) {
    const panel = getNotificationPanel(toggle);
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    closeNotificationPanel();

    if (isOpen) {
      return;
    }

    toggle.setAttribute("aria-expanded", "true");
    panel.hidden = false;
    activePanel = panel;
  }

  function closeNotificationPanel() {
    document.querySelectorAll(selector).forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
    });

    document.querySelectorAll("[data-notification-panel]").forEach((panel) => {
      panel.hidden = true;
    });

    activePanel = null;
  }

  function getNotificationPanel(toggle) {
    let panel = toggle.parentElement?.querySelector("[data-notification-panel]");

    if (panel) {
      return panel;
    }

    const id = `notification-panel-${Date.now()}`;
    const message = toggle.dataset.toast || "No new notifications right now.";
    toggle.setAttribute("aria-controls", id);
    toggle.setAttribute("aria-expanded", "false");

    panel = document.createElement("section");
    panel.id = id;
    panel.className = "notification-panel";
    panel.hidden = true;
    panel.dataset.notificationPanel = "";
    panel.innerHTML = `
      <h2>Notifications</h2>
      <div class="notification-item">
        <span class="notification-item-dot" aria-hidden="true"></span>
        <p>${escapeHtml(message)}</p>
      </div>
    `;
    toggle.parentElement?.append(panel);

    return panel;
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    })[character]);
  }
})();
