// Shared UI helpers for components, menus, and forms.
window.SmartAIUtils = {
  async loadComponents() {
    const targets = document.querySelectorAll("[data-component]");

    await Promise.all(Array.from(targets).map(async (target) => {
      const source = target.getAttribute("data-component");
      try {
        const response = await fetch(source);

        if (!response.ok) {
          return;
        }

        target.innerHTML = await response.text();
      } catch (error) {
        // Component loading can fail when the page is opened directly from disk.
      }
    }));

    this.bindNavigation();
  },

  bindNavigation() {
    const header = document.querySelector("[data-site-header]");
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-menu]");
    const openIcon = document.querySelector("[data-menu-open-icon]");
    const closeIcon = document.querySelector("[data-menu-close-icon]");
    const label = document.querySelector("[data-menu-label]");
    const landingPath = "/";
    const sectionLinks = menu?.querySelectorAll('a[href*="#problem"], a[href*="#solution"], a[href*="#features"], a[href*="#how-it-works"]');

    this.bindLandingHeader(header);

    if (!toggle || !menu) {
      return;
    }

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      const nextOpen = !isOpen;

      toggle.setAttribute("aria-expanded", String(nextOpen));
      menu.classList.toggle("hidden", !nextOpen);
      document.body.classList.toggle("menu-open", nextOpen);
      header?.classList.toggle("is-menu-open", nextOpen);
      openIcon?.classList.toggle("hidden", nextOpen);
      closeIcon?.classList.toggle("hidden", !nextOpen);

      if (label) {
        label.textContent = nextOpen ? "Close navigation menu" : "Open navigation menu";
      }
    });

    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.add("hidden");
        document.body.classList.remove("menu-open");
        header?.classList.remove("is-menu-open");
        openIcon?.classList.remove("hidden");
        closeIcon?.classList.add("hidden");

        if (label) {
          label.textContent = "Open navigation menu";
        }
      });
    });

    sectionLinks?.forEach((link) => {
      link.addEventListener("click", (event) => {
        const targetHref = link.getAttribute("href") || "";
        const targetId = targetHref.split("#")[1];

        if (!targetId) {
          return;
        }

        const targetElement = document.getElementById(targetId);
        const isLandingPage = document.body.dataset.page === "landing";

        if (toggle && menu) {
          toggle.setAttribute("aria-expanded", "false");
          menu.classList.add("hidden");
          document.body.classList.remove("menu-open");
          header?.classList.remove("is-menu-open");
          openIcon?.classList.remove("hidden");
          closeIcon?.classList.add("hidden");

          if (label) {
            label.textContent = "Open navigation menu";
          }
        }

        if (isLandingPage && targetElement) {
          event.preventDefault();
          targetElement.scrollIntoView({ behavior: "smooth", block: "start" });
          history.replaceState(null, "", `#${targetId}`);
          return;
        }

        if (!isLandingPage) {
          event.preventDefault();
          window.location.href = `${landingPath}#${targetId}`;
        }
      });
    });
  },

  bindLandingHeader(header) {
    const isLandingPage = document.body.dataset.page === "landing";

    if (!header || !isLandingPage) {
      return;
    }

    const syncHeader = () => {
      header.classList.add("is-landing-nav");
      header.classList.toggle("is-scrolled", window.scrollY > 16);
    };

    syncHeader();
    window.addEventListener("scroll", syncHeader, { passive: true });
  },

  setMessage(element, message, state) {
    if (!element) {
      return;
    }

    element.textContent = message;
    element.dataset.state = state || "";
  },

  getFormData(form) {
    return Object.fromEntries(new FormData(form).entries());
  },

  isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  },
};

document.addEventListener("DOMContentLoaded", () => {
  window.SmartAIUtils.loadComponents();
});
