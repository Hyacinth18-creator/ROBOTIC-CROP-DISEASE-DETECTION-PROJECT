// Central configuration for API and environment values.
window.SmartAIConfig = {
  API_URL: window.location.origin.includes('localhost') 
    ? "http://localhost:8000/api" 
    : "/api",
  APP_NAME: "SmartAI",
  ENABLE_LIVE_DETECTION_API: false,
  CHATBOT_ENABLED: true,
};

// Load Groq API Key from environment or localStorage
window.GROQ_API_KEY = window.GROQ_API_KEY || localStorage.getItem('groq_api_key') || '';
