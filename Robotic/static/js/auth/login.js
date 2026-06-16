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

    window.SmartAIUtils.setMessage(message, "Login successful. Redirecting to dashboard...", "success");
    window.setTimeout(() => {
      window.location.href = form.dataset.dashboardUrl || "/dashboard/";
    }, 500);
  });
});
