// Handles SmartAI login with backend authentication support.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-login-form]");
  const message = document.querySelector("[data-form-message]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = window.SmartAIUtils.getFormData(form);
    const emailOrUsername = (data.email || "").trim().toLowerCase();
    const password = data.password || "";

    // Validate inputs
    if (!emailOrUsername) {
      window.SmartAIUtils.setMessage(message, "Please enter your email or username.", "error");
      return;
    }

    if (!password) {
      window.SmartAIUtils.setMessage(message, "Please enter your password.", "error");
      return;
    }

    try {
      window.SmartAIUtils.setMessage(message, "Signing you in...", "");
      
      // Call backend authentication
      const response = await window.SmartAIApi.login({
        username: emailOrUsername,
        email: emailOrUsername,
        password: password
      });

      window.SmartAIUtils.setMessage(message, "Login successful. Preparing your dashboard...", "success");
      showAppLoader(
        "Preparing your dashboard",
        "SmartAI is gathering your farm insights, recent detections, and treatment priorities."
      );
      
      window.setTimeout(() => {
        window.location.href = form.dataset.dashboardUrl || "../dashboard/dashboard.html";
      }, 1500);
    } catch (error) {
      window.SmartAIUtils.setMessage(message, error.message || "Invalid email or password.", "error");
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
