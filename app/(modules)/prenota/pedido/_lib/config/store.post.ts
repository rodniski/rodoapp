// stores/pedidoCompraStore.ts
import { create } from "zustand";
// Importando os tipos do seu ficheiro @inclusao/types/pedido-compra.ts
// Certifique-se de que o caminho para este ficheiro de tipos está correto.
// Se @inclusao/types/pedido-compra.ts estiver em src/types/pedido-compra.ts, por exemplo,
// o import poderia ser algo como import type { PedidoCompraRequest, PedidoCompraItem } from "@/types/pedido-compra";
// Para este exemplo, vou assumir que os tipos estão acessíveis através de ".." como no seu componente.
import type { PedidoCompraRequest, PedidoCompraState } from ".";


/**
 * Estado inicial para o draft do pedido de compra.
 * Garante que todos os campos de PedidoCompraRequest estejam presentes.
 */
const initialDraftState: PedidoCompraRequest = {
  FILIAL: "",
  FILENTREGA: "",
  OPCAO: 3, // Valor padrão para inclusão
  CONTATO: "",
  OBS: "",
  PC: "", // Geralmente vazio na criação, pode ser preenchido pela API
  FORNECEDOR: "",
  LOJA: "",
  CONDFIN: "",
  TIPOPED: "",
  ITENS: [], // Começa com uma lista de itens vazia
};

/**
 * Store do Zustand para manter estado de inclusão de Pedido de Compra
 */
export const usePedidoCompraStore = create<PedidoCompraState>((set, get) => ({
  draft: { ...initialDraftState },

  setDraft: (patch) =>
    set((state) => ({
      draft: { ...state.draft, ...patch },
    })),

  clearDraft: () =>
    set({
      draft: { ...initialDraftState },
    }),

  generateNextItemCode: () => {
    const currentItens = get().draft.ITENS;
    // Encontra o maior número de ITEM existente, converte para número e incrementa
    const lastItemNumber = currentItens.length > 0
      ? Math.max(...currentItens.map(item => parseInt(item.ITEM, 10)).filter(num => !isNaN(num)), 0)
      : 0;
    return (lastItemNumber + 1).toString().padStart(4, '0'); // Formata para 4 dígitos com zeros à esquerda
  },

  addItem: (itemPayload) => // itemPayload deve ser um PedidoCompraItem completo
    set((state) => ({
      draft: {
        ...state.draft,
        ITENS: [...state.draft.ITENS, itemPayload],
      },
    })),

  updateItem: (index, itemPatch) =>
    set((state) => {
      // Cria uma cópia do array de itens para evitar mutação direta
      const newItens = [...state.draft.ITENS];
      if (newItens[index]) {
        // Atualiza o item no índice especificado com o patch fornecido
        newItens[index] = { ...newItens[index], ...itemPatch };
        return { draft: { ...state.draft, ITENS: newItens } };
      }
      console.warn(`[PedidoCompraStore] Tentativa de atualizar item no índice ${index} que não existe.`);
      return state; // Retorna o estado inalterado se o índice for inválido
    }),

  removeItem: (index) =>
    set((state) => {
      // Filtra o item a ser removido
      const newItensSemItemRemovido = state.draft.ITENS.filter((_, i) => i !== index);
      // Reajusta os códigos "ITEM" dos itens restantes para serem sequenciais
      const reindexedItens = newItensSemItemRemovido.map((item, idx) => ({
        ...item,
        ITEM: (idx + 1).toString().padStart(4, '0'), // Reindexa a partir de "0001"
      }));
      return { draft: { ...state.draft, ITENS: reindexedItens } };
    }),
}));
