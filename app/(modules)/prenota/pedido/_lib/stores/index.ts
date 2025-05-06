// stores/pedidoCompraStore.ts
import { create } from "zustand";
import type { PedidoCompraRequest } from "..";

interface PedidoCompraState {
  /** Último payload de pedido montado */
  draft: PedidoCompraRequest;
  /** Atualiza campos do draft */
  setDraft: (patch: Partial<PedidoCompraRequest>) => void;
  /** Reseta o draft para vazio */
  clearDraft: () => void;
}

/**
 * Store do Zustand para manter estado de inclusão de Pedido de Compra
 */
export const usePedidoCompraStore = create<PedidoCompraState>((set) => ({
  draft: {
    FILIAL: "",
    FILENTREGA: "",
    OPCAO: 3,
    CONTATO: "",
    OBS: "",
    PC: "",
    FORNECEDOR: "",
    LOJA: "",
    CONDFIN: "",
    TIPOPED: "",
    ITENS: [],
  },
  setDraft: (patch) =>
    set((state) => ({ draft: { ...state.draft, ...patch } })),
  clearDraft: () =>
    set({
      draft: {
        FILIAL: "",
        FILENTREGA: "",
        OPCAO: 3,
        CONTATO: "",
        OBS: "",
        PC: "",
        FORNECEDOR: "",
        LOJA: "",
        CONDFIN: "",
        TIPOPED: "",
        ITENS: [],
      },
    }),
}));
