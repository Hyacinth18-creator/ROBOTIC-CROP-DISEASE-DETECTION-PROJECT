// Handles registration validation and backend-ready submission.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-register-form]");
  const message = document.querySelector("[data-form-message]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = window.SmartAIUtils.getFormData(form);

    if (!data.fullName || data.fullName.trim().length < 3) {
      window.SmartAIUtils.setMessage(message, "Enter your full name.", "error");
      return;
    }

    if (!window.SmartAIUtils.isEmail(data.email || "")) {
      window.SmartAIUtils.setMessage(message, "Enter a valid email address.", "error");
      return;
    }

    if (!data.phone || data.phone.trim().length < 7) {
      window.SmartAIUtils.setMessage(message, "Enter a valid phone number.", "error");
      return;
    }

    if (!data.password || data.password.length < 8) {
      window.SmartAIUtils.setMessage(message, "Password must be at least 8 characters.", "error");
      return;
    }

    if (data.password !== data.confirmPassword) {
      window.SmartAIUtils.setMessage(message, "Passwords do not match.", "error");
      return;
    }

    try {
      window.SmartAIUtils.setMessage(message, "Creating your account...", "");
      await window.SmartAIApi.register(data);
      window.SmartAIUtils.setMessage(message, "Account created. You can now sign in.", "success");
      form.reset();
    } catch (error) {
      window.SmartAIUtils.setMessage(message, error.message, "error");
    }
  });
});
