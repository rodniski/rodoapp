// @login/stores/auth-store.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { UserSession, AuthState } from "@login/types";

// Criação do store com Zustand e persistência
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      filiais: [], 
      grupos: [], 
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Modifique esta ação (ou a que recebe os dados da API de login)
      setUser: (userDataFromApi: UserSession | null) => {
        // Use o tipo correto vindo da API
        if (userDataFromApi) {
          set({
            user: userDataFromApi, // Guarda o objeto user completo se precisar
            // --- ATUALIZA OS ARRAYS NO NÍVEL RAIZ ---
            filiais: userDataFromApi.filiais || [], // Extrai do objeto recebido
            grupos: userDataFromApi.grupos || [], // Extrai do objeto recebido
            // ------------------------------------------
            isAuthenticated: true,
          });
        } else {
          // Se passar null (ex: erro no login), limpa tudo
          set({
            user: null,
            filiais: [],
            grupos: [],
            isAuthenticated: false,
          });
        }
      },

      // setFiliais e setGrupos podem continuar existindo se forem úteis
      // mas a lógica principal de popular após login deve estar acima
      setFiliais: (filiais) => set({ filiais }),
      setGrupos: (grupos) => set({ grupos }),

      logout: async () => {
        set({
          user: null,
          filiais: [], 
          grupos: [], 
          isAuthenticated: false,
        });
        // localStorage.removeItem("auth"); // Redundante, mas ok
      },
    }),
    {
      name: "auth", // chave no localStorage
      storage: createJSONStorage(() => localStorage),
      // Agora 'partialize' salvará os arrays raiz corretamente populados
      partialize: (state) => ({
        user: state.user,
        filiais: state.filiais, 
        grupos: state.grupos, 
        isAuthenticated: state.isAuthenticated,
        error: state.error,
      }),
    }
  )
);
