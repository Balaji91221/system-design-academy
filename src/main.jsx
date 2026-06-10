import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App.jsx";
import { ProgressProvider } from "./context/ProgressContext.jsx";

// HashRouter keeps deep links working on any static host (no server rewrites).
createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </HashRouter>
  </React.StrictMode>
);
