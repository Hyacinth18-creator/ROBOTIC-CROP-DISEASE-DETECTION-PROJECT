// Utility functions for SmartAI application
window.SmartAIUtils = {
  /**
   * Validate email format
   */
  isEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Get form data as object
   */
  getFormData(form) {
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  },

  /**
   * Set form message with optional styling
   */
  setMessage(element, message, type = '') {
    if (!element) return;
    element.textContent = message;
    element.className = 'form-message';
    if (type) {
      element.classList.add(`form-message-${type}`);
    }
  },

  /**
   * Validate password strength
   */
  isStrongPassword(password) {
    return password.length >= 8;
  },

  /**
   * Format date to readable string
   */
  formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
  },

  /**
   * Debounce function for performance optimization
   */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  /**
   * Show loading state on element
   */
  setLoading(element, isLoading) {
    if (isLoading) {
      element.disabled = true;
      element.classList.add('is-loading');
    } else {
      element.disabled = false;
      element.classList.remove('is-loading');
    }
  },
};
