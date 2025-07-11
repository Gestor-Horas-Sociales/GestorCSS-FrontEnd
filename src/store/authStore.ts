// src/store/authStore.ts
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  initializeAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  login: () => {
    localStorage.setItem("isManualAuth", "true");
    set({ isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ isAuthenticated: false });
  },

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    set({ isAuthenticated: !!token });
  },
}));