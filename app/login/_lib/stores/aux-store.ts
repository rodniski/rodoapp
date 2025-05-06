// "@login/stores/aux-store.ts" (Atualizado com Persistência)

"use client";

import { create } from "zustand";
// Importa o middleware de persistência e o storage helper
import { persist, createJSONStorage } from 'zustand/middleware';
import type { AuxState } from "@/app/login/_lib/types"; // Seus tipos

// Define a interface AuxState com persistência (nenhuma mudança necessária na interface em si)
// export interface AuxState { ... }

export const useAuxStore = create<AuxState>()( // Note o () extra aqui
  // Envolve toda a definição com o middleware 'persist'
  persist(
    // A função original de criação do store (set, get) => ({...})
    (set, get) => ({
      // Estado inicial (será sobrescrito pela reidratação, se houver dados salvos)
      filiais: [],
      unidadeMedida: [],
      condicoes: [],
      centroCusto: [],

      // Ações (sem alterações na lógica interna delas)
      setFiliais: (filiais) => set({ filiais }),
      setUnidadeMedida: (unidadeMedida) => set({ unidadeMedida }),
      setCondicoes: (condicoes) => set({ condicoes }),
      setCentroCusto: (centroCusto) => set({ centroCusto }),

      loadInitialData: ({ filiais, unidadeMedida, condicoes, centroCusto }) =>
        set((state) => {
            // Lógica para carregar dados apenas se não existirem ou para forçar atualização
            // Você pode querer verificar state.filiais.length === 0 antes de setar,
            // dependendo se loadInitialData deve sobrescrever dados persistidos.
            // Exemplo simples que sobrescreve se vierem dados novos:
             console.log("loadInitialData chamado em aux-store");
             return {
                filiais: filiais ?? state.filiais,
                unidadeMedida: unidadeMedida ?? state.unidadeMedida,
                condicoes: condicoes ?? state.condicoes,
                centroCusto: centroCusto ?? state.centroCusto,
             };
        }),
    }),
    // Opções de configuração do middleware 'persist'
    {
      /**
       * Nome único para identificar este store no storage.
       * Mude isso se tiver outros stores persistidos para evitar colisões.
       */
      name: 'login-aux-storage', // OBRIGATÓRIO

      /**
       * Define onde salvar.
       * - localStorage: Persiste "para sempre" no navegador (até limpeza manual). Bom para dados de "cache".
       * - sessionStorage: Persiste apenas enquanto a aba/janela do navegador estiver aberta.
       * Default é localStorage.
       */
      storage: createJSONStorage(() => localStorage), // ou sessionStorage
      // storage: createJSONStorage(() => sessionStorage),

      /**
       * Opcional: Especifica quais partes do estado persistir.
       * Se omitido, persiste TUDO. Neste caso, queremos tudo.
       */
      // partialize: (state) => ({
      //   filiais: state.filiais,
      //   unidadeMedida: state.unidadeMedida,
      //   condicoes: state.condicoes,
      //   centroCusto: state.centroCusto,
      // }),

      /**
       * Opcional: Callback executado após o estado ser reidratado do storage.
       * Útil para logs ou migrações.
       */
      onRehydrateStorage: (state) => {
        console.log("useAuxStore: Estado reidratado do storage!", state);
        // Pode retornar um erro para cancelar a reidratação se necessário
        return (state, error) => {
          if (error) {
            console.error("useAuxStore: Falha ao reidratar!", error);
          }
        };
      },
      /**
       * Opcional: Versão do estado, útil para migrações futuras se a estrutura mudar.
       */
      // version: 1,
      // migrate: (persistedState, version) => { ... } // Função de migração
    }
  )
);