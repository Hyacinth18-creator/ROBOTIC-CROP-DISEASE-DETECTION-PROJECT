(() => {
  const selector = ".profile-button";
  const signOutSelector = ".dashboard-logout";
  let activeMenu = null;

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
      signOut();
      return;
    }

    if (activeMenu && !activeMenu.contains(event.target)) {
      closeProfileMenu();
    }
  }, true);

  document.addEventListener("keydown", (event) => {
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
    menu.innerHTML = `
      <a class="profile-menu-item" href="settings.html" role="menuitem">Settings</a>
      <button class="profile-menu-item profile-menu-signout" type="button" role="menuitem" data-profile-signout>Sign Out</button>
    `;
    menu.querySelector("[data-profile-signout]")?.addEventListener("click", signOut);
    toggle.parentElement?.append(menu);

    return menu;
  }

  function signOut() {
    ["smartaiSession", "smartaiUser", "authToken", "token"].forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    window.location.href = "../auth/login.html";
  }
})();
