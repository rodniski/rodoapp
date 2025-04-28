// @inclusao/stores/pre-nota-aux-store.ts
import { create } from "zustand";
import type {
  Fornecedor,
  CondicaoPagamentoResponse,
  Pedido,
} from "@inclusao/api";

/* ───────────────────────── módulos auxiliares ───────────────────────── */
interface XmlLoadStatusState {
  xmlDataLoaded: boolean;
  setXmlDataLoadedSuccess: () => void;
  clearXmlDataLoadedFlag: () => void;
}

interface FornecedorSearchState {
  searchResult: Fornecedor[] | null;
  setSearchResult: (result: Fornecedor[] | null) => void;
  clearSearchResult: () => void;
}

interface SelectionState {
  selectedPedido: Pedido | null; // 👈 alterado para armazenar objeto completo
  selectedFornecedor: Omit<Fornecedor, "PEDIDOS"> | null; // 👈 ignora PEDIDOS
  setSelectedPedido: (pedido: Pedido | null) => void; // 👈 método alterado
  clearSelectedPedido: () => void;
  setSelectedFornecedor: (fornecedor: Omit<Fornecedor, "PEDIDOS"> | null) => void;
  clearSelectedFornecedor: () => void;
}

interface TotalNfState {
  valorTotalXml: number | null;
  setValorTotalXml: (v: number | null) => void;
  clearValorTotalXml: () => void;
}

interface CondicaoPagamentoState {
  data: CondicaoPagamentoResponse | null;
  setData: (d: CondicaoPagamentoResponse) => void;
  clearData: () => void;
}

/* ───────────────────────── interface principal ─────────────────────── */
export interface PreNotaAuxState {
  loadStatus: XmlLoadStatusState;
  fornecedorSearch: FornecedorSearchState;
  selection: SelectionState;
  totalNf: TotalNfState;
  condicaoPagamento: CondicaoPagamentoState;
}

/* ──────────────────────── criação do store ─────────────────────────── */
export const usePreNotaAuxStore = create<PreNotaAuxState>((set) => ({
  /* loadStatus */
  loadStatus: {
    xmlDataLoaded: false,
    setXmlDataLoadedSuccess: () =>
      set((s) => ({ loadStatus: { ...s.loadStatus, xmlDataLoaded: true } })),
    clearXmlDataLoadedFlag: () =>
      set((s) => ({ loadStatus: { ...s.loadStatus, xmlDataLoaded: false } })),
  },

  /* fornecedorSearch */
  fornecedorSearch: {
    searchResult: null,
    setSearchResult: (r) =>
      set((s) => ({
        fornecedorSearch: { ...s.fornecedorSearch, searchResult: r },
      })),
    clearSearchResult: () =>
      set((s) => ({
        fornecedorSearch: { ...s.fornecedorSearch, searchResult: null },
      })),
  },

  /* selection ajustado */
  selection: {
    selectedPedido: null,
    selectedFornecedor: null,
    setSelectedPedido: (pedido: Pedido | null) =>
      set((s) => ({ selection: { ...s.selection, selectedPedido: pedido } })),
    clearSelectedPedido: () =>
      set((s) => ({ selection: { ...s.selection, selectedPedido: null } })),
    setSelectedFornecedor: (f) =>
      set((s) => ({ selection: { ...s.selection, selectedFornecedor: f } })),
    clearSelectedFornecedor: () =>
      set((s) => ({ selection: { ...s.selection, selectedFornecedor: null } })),
  },

  /* totalNf */
  totalNf: {
    valorTotalXml: null,
    setValorTotalXml: (v) =>
      set((s) => ({ totalNf: { ...s.totalNf, valorTotalXml: v } })),
    clearValorTotalXml: () =>
      set((s) => ({ totalNf: { ...s.totalNf, valorTotalXml: null } })),
  },

  /* condicaoPagamento */
  condicaoPagamento: {
    data: null,
    setData: (d) =>
      set((s) => ({ condicaoPagamento: { ...s.condicaoPagamento, data: d } })),
    clearData: () =>
      set((s) => ({
        condicaoPagamento: { ...s.condicaoPagamento, data: null },
      })),
  },
}));

/* ────────────────────────── selectors ─────────────────────────────── */
export const useXmlDataLoadedStatus = () =>
  usePreNotaAuxStore((s) => s.loadStatus.xmlDataLoaded);
export const useFornecedorSearchResult = () =>
  usePreNotaAuxStore((s) => s.fornecedorSearch.searchResult);
export const useSelectedPedido = () =>
  usePreNotaAuxStore((s) => s.selection.selectedPedido); // 👈 alterado
export const useSelectedFornecedor = () =>
  usePreNotaAuxStore((s) => s.selection.selectedFornecedor);
export const useValorTotalXml = () =>
  usePreNotaAuxStore((s) => s.totalNf.valorTotalXml);
export const useCondicaoPagamentoData = () =>
  usePreNotaAuxStore((s) => s.condicaoPagamento.data);
