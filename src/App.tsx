import { PublicClientApplication } from "@azure/msal-browser"; // <-- Esto faltaba
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./auth/authConfig";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navigation from "@/router/Navigation";

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <MsalProvider instance={msalInstance}>
        <Router>
          <Navigation />
        </Router>
      </MsalProvider>
    </ThemeProvider>
  );
}

export default App;
