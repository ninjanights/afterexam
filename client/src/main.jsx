import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { AsCollegeProvider } from "./contexts/AsCollegeContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <AsCollegeProvider>
        <App />
      </AsCollegeProvider>
    </UserProvider>
  </StrictMode>
);
