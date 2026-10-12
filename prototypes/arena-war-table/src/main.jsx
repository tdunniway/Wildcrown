import React from "react";
import { createRoot } from "react-dom/client";
import "@wildcrown/ui/theme.css";
import { App } from "./App.jsx";
import "./styles.css";
import "./arena-interface.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
