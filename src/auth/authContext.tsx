// src/context/authContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isManualAuth: boolean;
  loginManual: () => void;
  logoutManual: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isManualAuth, setIsManualAuth] = useState(false);

  // ⚡️ Leer el valor guardado al cargar
  useEffect(() => {
    const storedAuth = localStorage.getItem("isManualAuth");
    setIsManualAuth(storedAuth === "true");
  }, []);

  const loginManual = () => {
    localStorage.setItem("isManualAuth", "true");
    setIsManualAuth(true);
  };

  const logoutManual = () => {
    localStorage.removeItem("isManualAuth");
    setIsManualAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isManualAuth, loginManual, logoutManual }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useManualAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useManualAuth debe usarse dentro de AuthProvider");
  return context;
};