// Central configuration for API and environment values.
window.SmartAIConfig = {
  API_URL: "/api",
  CHAT_API_URL: null, // set to a real backend chat endpoint when available
  APP_NAME: "SmartAI",
  ENABLE_LIVE_DETECTION_API: false,
  ENDPOINTS: {
    robotStatus: "/robot/status",
    robotNavigation: "/robot/navigation",
    robotMissions: "/robot/missions",
    robotTelemetry: "/robot/telemetry",
    experimentResults: "/experiments/results",
  },
};
