import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "./components/layout.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
   <App />
  </ThemeProvider>
 </React.StrictMode>
);
