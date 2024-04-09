import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { ThemeProvider } from "./components/theme-provider.jsx";
import AuthProvider from "react-auth-kit";
import { store as authStore } from "./../Auth/raect-auth.js";
import { persistor, store as reduxStore } from "./redux/store.js";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
 <React.StrictMode>
  <AuthProvider store={authStore}>
   <PersistGate persistor={persistor}>
    <Provider store={reduxStore}>
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter>
       <App />
      </BrowserRouter>
     </ThemeProvider>
    </Provider>
   </PersistGate>
  </AuthProvider>
 </React.StrictMode>
);
