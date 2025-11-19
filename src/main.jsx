import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Import utilities for initialization
import { initializeA11y } from "./utils/accessibility";
import { securityChecks } from "./utils/security";
import logger from "./utils/logger";

// Initialize accessibility features
initializeA11y();

// Perform security checks
if (!securityChecks.checkBrowserSecurity()) {
  logger.warn("Some browser security features are missing");
}

// Check for secure context in production
if (import.meta.env.PROD && !securityChecks.isSecureContext()) {
  logger.warn("Application should be served over HTTPS in production");
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);