import "../../../core/css/globals.css";
import "../../../core/css/base.css";
import "../../../core/css/pastelcore.css";
import "../../../core/css/dark.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
