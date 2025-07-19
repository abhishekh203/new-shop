import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@material-tailwind/react";
import { store } from "./redux/store";
import { Provider } from "react-redux";

// Import utilities for initialization
import { initializeA11y } from "./utils/accessibility";
import { securityChecks } from "./utils/security";

// Initialize accessibility features
initializeA11y();

// Perform security checks
if (!securityChecks.checkBrowserSecurity()) {
  console.warn("Some browser security features are missing");
}

// Check for secure context in production
if (import.meta.env.PROD && !securityChecks.isSecureContext()) {
  console.warn("Application should be served over HTTPS in production");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);