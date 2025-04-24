// @login/stores/auth-store.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { AuthState } from "@login/types";

// Criação do store com Zustand e persistência
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      filiais: [],
      grupos: [],
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },

      setFiliais: (filiais) => set({ filiais }),
      setGrupos: (grupos) => set({ grupos }),

      logout: async () => {
        // Limpa tudo no estado
        set({
          user: null,
          filiais: [],
          grupos: [],
          isAuthenticated: false,
        });
        localStorage.removeItem("auth");
      },
    }),
    {
      name: "auth", // chave no localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        filiais: state.filiais,
        grupos: state.grupos,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Sincroniza o estado de autenticação com um cookie para uso no middleware
useAuthStore.subscribe((state) => {
  if (typeof window !== "undefined") {
    document.cookie = `auth=${JSON.stringify({
      isAuthenticated: state.isAuthenticated,
    })}; path=/; max-age=86400`; // Cookie expira em 1 dia (86400 segundos)
  }
});