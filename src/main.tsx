// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import { MsalProvider } from '@azure/msal-react'
import { PublicClientApplication } from '@azure/msal-browser'
import { msalConfig } from './auth/authConfig.ts'

const msalInstance = new PublicClientApplication(msalConfig);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MsalProvider instance={msalInstance}>
        <App />
    </MsalProvider>
  </StrictMode>
);