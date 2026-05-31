import path from "path"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Agrega esta sección para solucionar el error de MSAL Popup
  server: {
    headers: {
      // Permite que la ventana principal monitoree la popup de login
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      // Opcional: A veces necesario para mantener el contexto seguro
      "Cross-Origin-Embedder-Policy": "unsafe-none" 
    },
  },
})