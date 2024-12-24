import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/theme.scss";
import App from "./App.tsx";
import {AuthProvider} from "components/auth.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
      <AuthProvider>
          <App />
      </AuthProvider>

  </StrictMode>
);
