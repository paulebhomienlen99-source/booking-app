import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import {
  ThemeProvider,
} from "./context/ThemeContext";

ReactDOM.createRoot(
  document.getElementById("app")
).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);