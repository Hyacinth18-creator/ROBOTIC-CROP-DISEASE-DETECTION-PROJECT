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
      window.SmartAIUtils.setMessage(message, "Login successful. Redirecting to dashboard...", "success");
    } catch (error) {
      window.SmartAIUtils.setMessage(message, error.message, "error");
    }
  });
});
