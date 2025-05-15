// @inclusao/stores/xml-history-store.ts (NOVO ARQUIVO)
import { create } from "zustand";
import { persist, createJSONStorage } from 'zustand/middleware';

// Interface do estado e ações deste store
interface XmlHistoryState {
  xmlHistory: string[];
  addToXmlHistory: (chave: string) => void;
  clearXmlHistory: () => void;
}

/**
 * Hook Zustand dedicado para gerenciar e persistir o histórico
 * das últimas chaves XML pesquisadas.
 */
export const useXmlHistoryStore = create<XmlHistoryState>()(
  persist(
    (set) => ({
      // Estado inicial
      xmlHistory: [],

      // Ações
      addToXmlHistory: (chave) => set((state) => {
          // Lógica para adicionar, remover duplicatas e limitar
          const newHistory = [
              chave,
              ...state.xmlHistory.filter(x => x !== chave)
          ].slice(0, 5); // Mantém os últimos 5
          return { xmlHistory: newHistory };
      }),

      clearXmlHistory: () => set({ xmlHistory: [] }), // Limpa o histórico
    }),
    // Opções de Persistência (sem partialize, salva tudo deste store)
    {
      name: 'xml-history-storage', // Nome ÚNICO para este storage
      storage: createJSONStorage(() => localStorage), // Ou sessionStorage
      onRehydrateStorage: (_state) => {
        console.log("useXmlHistoryStore: Hidratação concluída.");
        return (state, error) => {
          if (error) { console.error("useXmlHistoryStore: Falha ao reidratar!", error); }
        }
      },
    }
  )
);

// Seletor (opcional, mas útil)
export const useXmlHistory = () => useXmlHistoryStore((state) => state.xmlHistory);