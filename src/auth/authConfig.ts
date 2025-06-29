// src/authConfig.ts

export const msalConfig = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID, // ID de la aplicación registrada en Azure
    authority: import.meta.env.VITE_AUTHORITY_URL,
    redirectUri: import.meta.env.VITE_REDIRECT_URI, // o según tu app
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["User.Read", "openid", "profile", "email"],
};