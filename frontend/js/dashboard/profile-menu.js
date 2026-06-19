(() => {
  const selector = ".profile-button";
  const signOutSelector = ".dashboard-logout";
  const dashboardNavigation = [
    { label: "Dashboard", href: "dashboard.html", route: "/dashboard/", page: "dashboard", icon: '<path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z"></path>' },
    { label: "Disease Detection", href: "diseasedetection.html", route: "/diseasedetection/", page: "diseasedetection", icon: '<circle cx="12" cy="12" r="8"></circle>' },
    { label: "Robotic Operations", href: "robotic-operations.html", route: "/robotic-operations/", page: "robotic-operations", stroke: true, icon: '<path d="M7 14h10l2 4H5l2-4zM9 10h6v4H9zM10 6h4v4h-4zM8 18v2M16 18v2"></path>' },
    { label: "Farm Simulation", href: "farmsimulation.html", route: "/farmsimulation/", page: "farmsimulation", icon: '<path d="M12 3 21 12 12 21 3 12z"></path>' },
    { label: "Treatment Missions", href: "treatment-missions.html", route: "/treatment-missions/", page: "treatment-missions", stroke: true, icon: '<path d="M5 12h14M12 5v14M7 7l10 10"></path>' },
    { label: "Experiments", href: "experiments.html", route: "/experiments/", page: "experiments", stroke: true, icon: '<path d="M7 4v6a5 5 0 1 0 10 0V4M9 4h6M8 16h8"></path>' },
    { label: "Analytics", href: "analytics.html", route: "/analytics/", page: "analytics", stroke: true, icon: '<path d="M6 20V12M12 20V5M18 20v-9"></path>' },
    { label: "Reports", href: "reports.html", route: "/reports/", page: "reports", icon: '<path d="M6 3h8l4 4v14H6z"></path>' },
    { label: "Profile", href: "profile.html", route: "/profile/", page: "profile", icon: '<path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm-8 9a8 8 0 0 1 16 0z"></path>' },
    { label: "Settings", href: "settings.html", route: "/settings/", page: "settings", icon: '<path d="m12 2 2 4 4-1-1 4 4 3-4 3 1 4-4-1-2 4-2-4-4 1 1-4-4-3 4-3-1-4 4 1z"></path>' },
  ];
  let activeMenu = null;
  let logoutModal = null;
  let lastFocusedElement = null;

  document.addEventListener("DOMContentLoaded", () => {
    normalizeDashboardNavigation();
    window.setTimeout(ensureMobileLogoutButton, 0);
  });

  document.addEventListener("click", (event) => {
    const toggle = event.target.closest(selector);
    const signOutButton = event.target.closest(signOutSelector);

    if (toggle) {
      event.preventDefault();
      event.stopPropagation();
      toggleProfileMenu(toggle);
      return;
    }

    if (signOutButton) {
      event.preventDefault();
      event.stopPropagation();
      showLogoutConfirmation();
      return;
    }

    if (activeMenu && !activeMenu.contains(event.target)) {
      closeProfileMenu();
    }
  }, true);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && logoutModal && !logoutModal.hidden) {
      closeLogoutModal();
      return;
    }

    if (event.key === "Escape") {
      closeProfileMenu();
    }
  });

  function toggleProfileMenu(toggle) {
    const menu = getProfileMenu(toggle);
    const isOpen = toggle.getAttribute("aria-expanded") === "true";

    closeProfileMenu();

    if (isOpen) {
      return;
    }

    toggle.setAttribute("aria-expanded", "true");
    menu.hidden = false;
    activeMenu = menu;
  }

  function normalizeDashboardNavigation() {
    const nav = document.querySelector(".dashboard-sidebar .dashboard-nav");
    if (!nav) {
      return;
    }

    const currentPage = window.location.pathname.split("/").pop() || "dashboard.html";
    const isStaticHtml = currentPage.endsWith(".html");
    const bodyPage = document.body.dataset.page;
    nav.innerHTML = "";

    dashboardNavigation.forEach((item) => {
      const link = document.createElement("a");
      link.className = "dashboard-nav-link";
      link.href = isStaticHtml ? item.href : item.route;
      if (currentPage === item.href || bodyPage === item.page) {
        link.classList.add("is-active");
      }

      const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      icon.setAttribute("class", item.stroke ? "nav-svg nav-svg-stroke" : "nav-svg");
      icon.setAttribute("aria-hidden", "true");
      icon.setAttribute("viewBox", "0 0 24 24");
      icon.innerHTML = item.icon;

      const label = document.createElement("span");
      label.textContent = item.label;

      link.append(icon, label);
      nav.append(link);
    });
  }

  function ensureMobileLogoutButton() {
    const mobileList = document.querySelector(".mobile-nav-list");
    if (!mobileList || mobileList.querySelector("[data-mobile-logout]")) {
      return;
    }

    const button = document.createElement("button");
    button.className = "dashboard-nav-link dashboard-logout mobile-logout-button";
    button.type = "button";
    button.dataset.mobileLogout = "";

    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    icon.setAttribute("class", "nav-svg nav-svg-stroke");
    icon.setAttribute("aria-hidden", "true");
    icon.setAttribute("viewBox", "0 0 24 24");
    icon.innerHTML = '<path d="M10 6H5v12h5M13 8l4 4-4 4M17 12H9"></path>';

    const label = document.createElement("span");
    label.textContent = "Log Out";

    button.append(icon, label);
    mobileList.append(button);
  }

  function closeProfileMenu() {
    document.querySelectorAll(selector).forEach((toggle) => {
      toggle.setAttribute("aria-expanded", "false");
    });

    document.querySelectorAll("[data-profile-menu]").forEach((menu) => {
      menu.hidden = true;
    });

    activeMenu = null;
  }

  function getProfileMenu(toggle) {
    let menu = toggle.parentElement?.querySelector("[data-profile-menu]");

    if (menu) {
      return menu;
    }

    const id = `profile-menu-${Date.now()}`;
    toggle.setAttribute("aria-controls", id);
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-haspopup", "menu");

    menu = document.createElement("div");
    menu.id = id;
    menu.className = "profile-menu";
    menu.hidden = true;
    menu.dataset.profileMenu = "";

    const settingsLink = document.createElement("a");
    settingsLink.className = "profile-menu-item";
    settingsLink.href = "settings.html";
    settingsLink.setAttribute("role", "menuitem");
    settingsLink.textContent = "Settings";

    const signOutButton = document.createElement("button");
    signOutButton.className = "profile-menu-item profile-menu-signout";
    signOutButton.type = "button";
    signOutButton.setAttribute("role", "menuitem");
    signOutButton.dataset.profileSignout = "";
    signOutButton.textContent = "Sign Out";
    signOutButton.addEventListener("click", showLogoutConfirmation);

    menu.append(settingsLink, signOutButton);
    toggle.parentElement?.append(menu);

    return menu;
  }

  function showLogoutConfirmation() {
    closeProfileMenu();
    closeMobileNavigationPanel();
    lastFocusedElement = document.activeElement;
    logoutModal = getLogoutModal();
    logoutModal.hidden = false;
    document.body.classList.add("menu-open");
    logoutModal.querySelector("[data-logout-cancel]")?.focus();
  }

  function closeMobileNavigationPanel() {
    const panel = document.querySelector("[data-mobile-nav]");
    const toggle = document.querySelector("[data-mobile-nav-toggle]");
    const label = document.querySelector("[data-mobile-nav-label]");

    toggle?.setAttribute("aria-expanded", "false");
    if (panel) {
      panel.hidden = true;
    }
    if (label) {
      label.textContent = "Open dashboard navigation";
    }
  }

  function closeLogoutModal() {
    if (!logoutModal) {
      return;
    }

    logoutModal.hidden = true;
    document.body.classList.remove("menu-open");
    lastFocusedElement?.focus();
  }

  function confirmLogout() {
    showAppLoader(
      "Logging you out",
      "See you next time, farmer. Your fields, insights, and SmartAI recommendations will be ready when you return."
    );

    ["smartaiSession", "smartaiUser", "authToken", "token"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    window.setTimeout(() => {
      window.location.href = "{% url 'logout' %}";
    }, 1600);
  }

  function getLogoutModal() {
    const existingModal = document.querySelector("[data-logout-modal]");

    if (existingModal) {
      return existingModal;
    }

    const modal = document.createElement("section");
    modal.className = "logout-modal";
    modal.hidden = true;
    modal.dataset.logoutModal = "";
    modal.setAttribute("role", "presentation");

    const dialog = document.createElement("div");
    dialog.className = "logout-dialog";
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "logout-dialog-title");
    dialog.setAttribute("aria-describedby", "logout-dialog-description");

    const icon = document.createElement("span");
    icon.className = "logout-dialog-icon";
    icon.setAttribute("aria-hidden", "true");

    const title = document.createElement("h2");
    title.id = "logout-dialog-title";
    title.textContent = "Log out of SmartAI?";

    const description = document.createElement("p");
    description.id = "logout-dialog-description";
    description.textContent = "Confirm before ending this session. Any saved dashboard data will stay ready for your next visit.";

    const actions = document.createElement("div");
    actions.className = "logout-dialog-actions";

    const cancelButton = document.createElement("button");
    cancelButton.className = "logout-cancel-button";
    cancelButton.type = "button";
    cancelButton.dataset.logoutCancel = "";
    cancelButton.textContent = "Stay Logged In";
    cancelButton.addEventListener("click", closeLogoutModal);

    const confirmButton = document.createElement("button");
    confirmButton.className = "logout-confirm-button";
    confirmButton.type = "button";
    confirmButton.dataset.logoutConfirm = "";
    confirmButton.textContent = "Log Out";
    confirmButton.addEventListener("click", confirmLogout);

    actions.append(cancelButton, confirmButton);
    dialog.append(icon, title, description, actions);
    modal.append(dialog);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeLogoutModal();
      }
    });
    document.body.append(modal);

    return modal;
  }

  function showAppLoader(title, copy) {
    let loader = document.querySelector("[data-app-loader]");

    if (!loader) {
      loader = document.createElement("section");
      loader.className = "app-loader";
      loader.dataset.appLoader = "";
      loader.setAttribute("role", "status");
      loader.setAttribute("aria-live", "polite");

      const panel = document.createElement("div");
      panel.className = "app-loader-panel";

      const mark = document.createElement("span");
      mark.className = "app-loader-mark";
      mark.setAttribute("aria-hidden", "true");

      const heading = document.createElement("h2");
      heading.className = "app-loader-title";
      heading.dataset.appLoaderTitle = "";

      const text = document.createElement("p");
      text.className = "app-loader-copy";
      text.dataset.appLoaderCopy = "";

      panel.append(mark, heading, text);
      loader.append(panel);
      document.body.append(loader);
    }

    loader.querySelector("[data-app-loader-title]").textContent = title;
    loader.querySelector("[data-app-loader-copy]").textContent = copy;
    loader.hidden = false;
    document.body.classList.add("menu-open");
  }
})();
