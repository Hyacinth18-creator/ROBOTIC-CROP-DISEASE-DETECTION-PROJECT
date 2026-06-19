// Central configuration for API and environment values.
window.SmartAIConfig = {
  API_URL: "http://localhost:5000/api",
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
