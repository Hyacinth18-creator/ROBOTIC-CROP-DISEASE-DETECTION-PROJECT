// Handles password reset requests.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-forgot-form]");
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

    try {
      window.SmartAIUtils.setMessage(message, "Sending reset instructions...", "");
      await window.SmartAIApi.forgotPassword(data);
      window.SmartAIUtils.setMessage(message, "Reset instructions sent if the email exists.", "success");
      form.reset();
    } catch (error) {
      window.SmartAIUtils.setMessage(message, error.message, "error");
    }
  });
});
