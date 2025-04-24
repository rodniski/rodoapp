/* --------------------------------------------------------------------------
 *  _lib/stores/store-prenota.ts
 *  Zustand store principal do domínio Pré-Nota
 * --------------------------------------------------------------------------*/

import { create } from "zustand";
import type { PreNotaState } from "@inclusao/types";
import { preNotaInitial } from "@inclusao/types";

export const usePreNotaStore = create<PreNotaState>((set) => ({
  // estado inicial
  draft: { ...preNotaInitial },
  mode: "manual",

  /* Header */
  setHeader: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        header: { ...state.draft.header, ...patch },
      },
    })),

  /* Alias para compatibilidade */
  setHeaderPatch: (patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        header: { ...state.draft.header, ...patch },
      },
    })),

  /**
   * Define o valor total da nota diretamente no header
   */
  setHeaderTotal: (valor: number) =>
    set((state) => ({
      draft: {
        ...state.draft,
        header: { ...state.draft.header, valorTotalDaNota: valor },
      },
    })),

  /* Itens */
  setItens: (list) =>
    set((state) => ({ draft: { ...state.draft, itens: [...list] } })),
  addItem: (it) =>
    set((state) => ({
      draft: { ...state.draft, itens: [...state.draft.itens, it] },
    })),
  updateItem: (idx, patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        itens: state.draft.itens.map((i, iIdx) =>
          iIdx === idx ? { ...i, ...patch } : i
        ),
      },
    })),
  removeItem: (idx) =>
    set((state) => ({
      draft: {
        ...state.draft,
        itens: state.draft.itens.filter((_, i) => i !== idx),
      },
    })),

  /* Anexos */
  addAnexo: (a) =>
    set((state) => ({
      draft: { ...state.draft, anexos: [...state.draft.anexos, a] },
    })),
  removeAnexo: (seq) =>
    set((state) => ({
      draft: {
        ...state.draft,
        anexos: state.draft.anexos.filter((x) => x.seq !== seq),
      },
    })),
  updateAnexoDesc: (seq: string, description: string) =>
    set((state) => ({
      draft: {
        ...state.draft,
        anexos: state.draft.anexos.map((anexo) =>
          anexo.seq === seq ? { ...anexo, desc: description } : anexo
        ),
      },
    })),

  clearAnexos: () =>
    set((state) => ({
      draft: {
        ...state.draft,
        anexos: [], // Define a lista de anexos como vazia
      },
    })),
  /* Parcelas */
  setParcelas: (p) =>
    set((state) => ({ draft: { ...state.draft, parcelas: [...p] } })),

  /* Rateios */
  addRateio: (r) =>
    set((state) => ({
      draft: { ...state.draft, rateios: [...state.draft.rateios, r] },
    })),
  updateRateio: (id, patch) =>
    set((state) => ({
      draft: {
        ...state.draft,
        rateios: state.draft.rateios.map((r) =>
          r.id === id ? { ...r, ...patch } : r
        ),
      },
    })),
  removeRateio: (id) =>
    set((state) => ({
      draft: {
        ...state.draft,
        rateios: state.draft.rateios.filter((r) => r.id !== id),
      },
    })),

  /* Modo de edição */
  setModoXml: () => set({ mode: "xml" }),
  setModoManual: () => set({ mode: "manual" }),

  /* Reset completo */
  reset: () => set({ draft: { ...preNotaInitial }, mode: "manual" }),
}));
