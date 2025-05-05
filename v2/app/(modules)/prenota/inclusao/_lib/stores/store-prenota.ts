/* --------------------------------------------------------------------------
 *  _lib/stores/store-prenota.ts
 *  Zustand store principal do domínio Pré-Nota
 * --------------------------------------------------------------------------*/

import { create } from "zustand";
import type {
  PreNotaState,
  PreNotaItem,
  Anexo,
  Parcela,
  Rateio,
  PreNotaHeader,
} from "@inclusao/types";
import { preNotaInitial } from "@inclusao/types";

export const usePreNotaStore = create<PreNotaState>((set) => ({
  // Estado inicial
  draft: { ...preNotaInitial },
  mode: "manual",

  /* Header ---------------------------------------------------------------*/
  setHeader: (patch: Partial<PreNotaHeader>) =>
    set((state) => ({
      draft: {
        ...state.draft,
        header: { ...state.draft.header, ...patch },
      },
    })),

  /* Alias para compatibilidade */
  setHeaderPatch: (patch: Partial<PreNotaHeader>) =>
    set((state) => ({
      draft: {
        ...state.draft,
        header: { ...state.draft.header, ...patch },
      },
    })),

  /* Itens ----------------------------------------------------------------*/
  setItens: (list: PreNotaItem[]) =>
    set((state) => ({ draft: { ...state.draft, itens: [...list] } })),

  addItem: (item: PreNotaItem) =>
    set((state) => ({
      draft: { ...state.draft, itens: [...state.draft.itens, item] },
    })),

  updateItem: (idx: number, patch: Partial<PreNotaItem>) =>
    set((state) => ({
      draft: {
        ...state.draft,
        itens: state.draft.itens.map((it, i) =>
          i === idx ? { ...it, ...patch } : it
        ),
      },
    })),

  removeItem: (idx: number) =>
    set((state) => ({
      draft: {
        ...state.draft,
        itens: state.draft.itens.filter((_, i) => i !== idx),
      },
    })),

  /* Anexos (ARQUIVOS) -----------------------------------------------------*/
  addAnexo: (anexo: Anexo) =>
    set((state) => ({
      draft: { ...state.draft, ARQUIVOS: [...state.draft.ARQUIVOS, anexo] },
    })),

  removeAnexo: (seq: string) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ARQUIVOS: state.draft.ARQUIVOS.filter((a) => a.seq !== seq),
      },
    })),

  updateAnexoDesc: (seq: string, description: string) =>
    set((state) => ({
      draft: {
        ...state.draft,
        ARQUIVOS: state.draft.ARQUIVOS.map((a) =>
          a.seq === seq ? { ...a, desc: description } : a
        ),
      },
    })),

  clearAnexos: () =>
    set((state) => ({ draft: { ...state.draft, ARQUIVOS: [] } })),

  /* Parcelas (PAGAMENTOS) -------------------------------------------------*/
  setParcelas: (parcelas: Parcela[]) =>
    set((state) => ({ draft: { ...state.draft, PAGAMENTOS: [...parcelas] } })),

  /* Rateios (RATEIOS) -----------------------------------------------------*/
  addRateio: (rateio: Rateio) =>
    set((state) => ({
      draft: { ...state.draft, RATEIOS: [...state.draft.RATEIOS, rateio] },
    })),

  updateRateio: (id: string, patch: Partial<Rateio>) =>
    set((state) => ({
      draft: {
        ...state.draft,
        RATEIOS: state.draft.RATEIOS.map((r) =>
          r.id === id ? { ...r, ...patch } : r
        ),
      },
    })),

  removeRateio: (id: string) =>
    set((state) => ({
      draft: {
        ...state.draft,
        RATEIOS: state.draft.RATEIOS.filter((r) => r.id !== id),
      },
    })),

  /* Modo de edição -------------------------------------------------------*/
  setModoXml: () => set({ mode: "xml" }),
  setModoManual: () => set({ mode: "manual" }),

  /* Reset completo -------------------------------------------------------*/
  reset: () => set({ draft: { ...preNotaInitial }, mode: "manual" }),
}));