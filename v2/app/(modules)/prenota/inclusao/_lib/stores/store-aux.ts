// @inclusao/stores/pre-nota-aux-store.ts (Valor Total NF agregado e persistência ajustada)
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; // Importa middleware
import type { Fornecedor } from "@inclusao/api"; // Ou @inclusao/types

// --- Interfaces dos Módulos ---

interface XmlLoadStatusState {
  /** Sinalizador: true se o último XML populou o store principal com sucesso */
  xmlDataLoaded: boolean; // <-- ✅ GARANTIR QUE ESTA LINHA EXISTE
  /** Ação para marcar sucesso */
  setXmlDataLoadedSuccess: () => void;
  /** Ação para limpar/resetar o sinalizador */
  clearXmlDataLoadedFlag: () => void;
}

interface FornecedorSearchState {
  searchResult: Fornecedor[] | null;
  setSearchResult: (result: Fornecedor[] | null) => void;
  clearSearchResult: () => void;
}

interface SelectedFornecedorInfo {
  cod: string;
  loja: string;
  nome: string;
}

interface SelectionState {
  selectedPedidoNumero: string | null;
  selectedFornecedor: SelectedFornecedorInfo | null;
  setSelectedPedidoNumero: (pedidoNumero: string | null) => void;
  clearSelectedPedidoNumero: () => void;
  setSelectedFornecedor: (fornecedor: SelectedFornecedorInfo | null) => void;
  clearSelectedFornecedor: () => void;
}

interface TotalNfState {
  valorTotalXml: number | null;
  setValorTotalXml: (valor: number | null) => void;
  clearValorTotalXml: () => void;
}

// --- Interface Principal do Store Auxiliar (SEM xml) ---
export interface PreNotaAuxState {
  // xml: XmlHistoryState; // Removido
  loadStatus: XmlLoadStatusState;
  fornecedorSearch: FornecedorSearchState;
  selection: SelectionState;
  totalNf: TotalNfState;
}

// --- Criação do Store com Persistência Seletiva ---
export const usePreNotaAuxStore = create<PreNotaAuxState>((set) => ({
  // --- Módulos de Estado ---
  loadStatus: {
    xmlDataLoaded: false, // <-- ✅ GARANTIR QUE ESTÁ INICIALIZADO AQUI
    setXmlDataLoadedSuccess: () =>
      set((state) => ({
        loadStatus: { ...state.loadStatus, xmlDataLoaded: true },
      })),
    clearXmlDataLoadedFlag: () =>
      set((state) => ({
        loadStatus: { ...state.loadStatus, xmlDataLoaded: false },
      })),
  },
  fornecedorSearch: {
    searchResult: null,
    setSearchResult: (result) =>
      set((state) => ({
        fornecedorSearch: { ...state.fornecedorSearch, searchResult: result },
      })),
    clearSearchResult: () =>
      set((state) => ({
        fornecedorSearch: { ...state.fornecedorSearch, searchResult: null },
      })),
  },
  selection: {
    selectedPedidoNumero: null,
    selectedFornecedor: null,
    setSelectedPedidoNumero: (pedidoNumero) =>
      set((state) => ({
        selection: { ...state.selection, selectedPedidoNumero: pedidoNumero },
      })),
    clearSelectedPedidoNumero: () =>
      set((state) => ({
        selection: { ...state.selection, selectedPedidoNumero: null },
      })),
    setSelectedFornecedor: (fornecedor) =>
      set((state) => ({
        selection: { ...state.selection, selectedFornecedor: fornecedor },
      })),
    clearSelectedFornecedor: () =>
      set((state) => ({
        selection: { ...state.selection, selectedFornecedor: null },
      })),
  },
  totalNf: {
    valorTotalXml: null,
    setValorTotalXml: (valor) =>
      set((state) => ({ totalNf: { ...state.totalNf, valorTotalXml: valor } })),
    clearValorTotalXml: () =>
      set((state) => ({ totalNf: { ...state.totalNf, valorTotalXml: null } })),
  },
})); // <-- FIM DO CREATE

// --- Seletores (sem useXmlHistory) ---
export const useXmlDataLoadedStatus = () =>
  usePreNotaAuxStore((state) => state.loadStatus.xmlDataLoaded);
export const useFornecedorSearchResult = () =>
  usePreNotaAuxStore((state) => state.fornecedorSearch.searchResult);
export const useSelectedPedidoNumero = () =>
  usePreNotaAuxStore((state) => state.selection.selectedPedidoNumero);
export const useSelectedFornecedor = () =>
  usePreNotaAuxStore((state) => state.selection.selectedFornecedor);
export const useValorTotalXml = () =>
  usePreNotaAuxStore((state) => state.totalNf.valorTotalXml);
