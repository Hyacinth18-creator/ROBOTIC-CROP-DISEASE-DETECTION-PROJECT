// Lightweight API client used by page scripts.
window.SmartAIApi = {
  async request(path, options = {}) {
    const baseUrl = window.SmartAIConfig.API_URL;
    const response = await fetch(`${baseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(payload.message || "Request failed. Please try again.");
    }

    return payload;
  },

  login(data) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  register(data) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  forgotPassword(data) {
    return this.request("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};
