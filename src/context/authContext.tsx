// src/context/authContext.tsx
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("isManualAuth") === "true";
    const token = localStorage.getItem("token"); // Token de MSAL
    setIsAuthenticated(stored || !!token);
  }, []);

  const login = () => {
    localStorage.setItem("isManualAuth", "true");
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("isManualAuth");
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};