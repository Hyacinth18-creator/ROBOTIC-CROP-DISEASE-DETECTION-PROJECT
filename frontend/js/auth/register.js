// Handles registration validation and backend submission.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("[data-register-form]");
  const message = document.querySelector("[data-form-message]");

  if (!form) {
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const data = window.SmartAIUtils.getFormData(form);

    // Validation
    if (!data.username || data.username.trim().length < 3) {
      window.SmartAIUtils.setMessage(message, "Username must be at least 3 characters long.", "error");
      return;
    }

    if (!window.SmartAIUtils.isEmail(data.email || "")) {
      window.SmartAIUtils.setMessage(message, "Enter a valid email address.", "error");
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
      
      const response = await window.SmartAIApi.register({
        username: data.username,
        email: data.email,
        password: data.password
      });
      
      window.SmartAIUtils.setMessage(message, "Account created successfully! Redirecting to login...", "success");
      form.reset();
      
      window.setTimeout(() => {
        window.location.href = "login.html";
      }, 2000);
    } catch (error) {
      window.SmartAIUtils.setMessage(message, error.message || "Error creating account. Please try again.", "error");
    }
  });
});
