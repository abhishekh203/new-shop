import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@material-tailwind/react";
import { Provider } from "react-redux";

// Context Providers
import MyState from "../context/myState";
import { NotificationProvider } from "../context/NotificationContext";

// Components
import ErrorBoundary from "../components/ErrorBoundary";
import NetworkStatus from "../components/NetworkStatus";
import PerformanceOptimizer from "../components/SEO/PerformanceOptimizer";
import ScrollTop from "../components/scrollTop/ScrollTop";

// Redux Store
import { store } from "../redux/store";

const AppProviders = ({ children }) => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ThemeProvider>
          <ErrorBoundary>
            <HelmetProvider>
              <MyState>
                <NotificationProvider position="bottom-right">
                  <Router>
                    <PerformanceOptimizer />
                    <ScrollTop />
                    <NetworkStatus />
                    {children}
                  </Router>
                </NotificationProvider>
              </MyState>
            </HelmetProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </Provider>
    </React.StrictMode>
  );
};

export default AppProviders;
