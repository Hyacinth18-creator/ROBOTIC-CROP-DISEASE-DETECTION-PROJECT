(() => {
  const selector = ".profile-button";
  const signOutSelector = ".dashboard-logout";
  let activeMenu = null;
  let logoutModal = null;
  let lastFocusedElement = null;

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
    lastFocusedElement = document.activeElement;
    logoutModal = getLogoutModal();
    logoutModal.hidden = false;
    document.body.classList.add("menu-open");
    logoutModal.querySelector("[data-logout-cancel]")?.focus();
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
      window.location.href = "../auth/login.html";
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
