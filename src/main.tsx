import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import { App } from "./App";
import { applyTheme, initialTheme, themeKey } from "./theme";

const theme = initialTheme(
  () => localStorage.getItem(themeKey),
  matchMedia("(prefers-color-scheme: dark)").matches,
);
applyTheme(theme);
const root = document.getElementById("root");
if (!root) throw new Error("ルート要素がありません");
createRoot(root).render(
  <StrictMode>
    <App initialTheme={theme} />
  </StrictMode>,
);
