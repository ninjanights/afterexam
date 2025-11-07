import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./contexts/UserContext.jsx";
import { AsCollegeProvider } from "./contexts/AsCollegeContext.jsx";
import { StudentSubjectProvider } from "./contexts/AsStudentContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <StudentSubjectProvider>
        <AsCollegeProvider>
          <App />
        </AsCollegeProvider>
      </StudentSubjectProvider>
    </UserProvider>
  </StrictMode>
);
