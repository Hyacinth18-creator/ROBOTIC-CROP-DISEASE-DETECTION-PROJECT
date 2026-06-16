// Handles temporary SmartAI login until backend authentication is ready.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-login-form]");
  const message = document.querySelector("[data-form-message]");

  if (!form) {
    return;
  }

  const validEmail = "smarttest@gmail.com";
  const validPassword = "@smartai";

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = window.SmartAIUtils.getFormData(form);
    const email = (data.email || "").trim().toLowerCase();
    const password = data.password || "";

    if (!window.SmartAIUtils.isEmail(email)) {
      window.SmartAIUtils.setMessage(message, "Enter a valid email address.", "error");
      return;
    }

    if (email !== validEmail || password !== validPassword) {
      window.SmartAIUtils.setMessage(message, "Invalid email or password.", "error");
      return;
    }

    window.SmartAIUtils.setMessage(message, "Login successful. Preparing your dashboard...", "success");
    showAppLoader(
      "Preparing your dashboard",
      "SmartAI is gathering your farm insights, recent detections, and treatment priorities."
    );
    window.setTimeout(() => {
      window.location.href = form.dataset.dashboardUrl || "../dashboard/dashboard.html";
    }, 1000);
  });
});

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
