// src/authConfig.ts
import type { Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "4e214bdf-180f-4933-992d-dafa93682346", // Pega el Application (client) ID aquí
    authority: "https://login.microsoftonline.com/common",
    //     redirectUri: "/", // Asegúrate que coincida con lo registrado en Azure
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ["user.read"],
};