// src/store/authStore.ts
import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  initializeAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isLoading: true,
  isAuthenticated: false,

  login: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authMethod");
    set({ isAuthenticated: false });
  },

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    if (token) {
      set({ isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }

    set({ isLoading: false });
  },
}));
