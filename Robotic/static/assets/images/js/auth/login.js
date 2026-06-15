// Handles login validation and backend-ready submission.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-login-form]");
  const message = document.querySelector("[data-form-message]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = window.SmartAIUtils.getFormData(form);

    if (!window.SmartAIUtils.isEmail(data.email || "")) {
      window.SmartAIUtils.setMessage(message, "Enter a valid email address.", "error");
      return;
    }

    if (!data.password || data.password.length < 8) {
      window.SmartAIUtils.setMessage(message, "Password must be at least 8 characters.", "error");
      return;
    }

    try {
      window.SmartAIUtils.setMessage(message, "Signing in...", "");
      await window.SmartAIApi.login(data);
      window.SmartAIUtils.setMessage(message, "Login successful. Preparing your dashboard...", "success");
      showAppLoader(
        "Preparing your dashboard",
        "SmartAI is gathering your farm insights, recent detections, and treatment priorities."
      );
      window.setTimeout(() => {
        window.location.href = "../dashboard/dashboard.html";
      }, 2000);
    } catch (error) {
      window.SmartAIUtils.setMessage(message, error.message, "error");
    }
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
