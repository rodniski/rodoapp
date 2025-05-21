// @inclusao/stores/pre-nota-aux-store.ts
import { create } from "zustand";
import type {
  Fornecedor,
  CondicaoPagamentoResponse,
  Pedido,
} from "@inclusao/api"; // Ajuste o caminho se necessário
import type { PreNotaItem } from "@inclusao/types"; // Importar o tipo do Item

/* ───────────────────────── Interfaces das Slices ───────────────────────── */
interface PedidosSelecionadosAuxState {
  pedidosSelecionados: string[];
  addPedidoSelecionado: (codigo: string) => void;
  removePedidoSelecionado: (codigo: string) => void;
  clearPedidosSelecionados: () => void;
}

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
  selectedPedido: Pedido | null;
  selectedFornecedor: Omit<Fornecedor, "PEDIDOS"> | null;
  setSelectedPedido: (pedido: Pedido | null) => void;
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
  setData: (d: CondicaoPagamentoResponse | null) => void; // Permitir null para limpar
  clearData: () => void;
}

// Interface para a nova Slice de Edição de Itens
interface ItemEditingState {
  editableItems: PreNotaItem[] | null; // Cópia dos itens para edição
  initializeEditableItems: (items: PreNotaItem[] | null) => void; // Permitir null para limpar
  updateEditableItemQuantity: (itemIdentifier: string, newQuantity: number) => void;
  clearEditableItems: () => void;
  updateEditableItem: (itemIdentifier: string, patch: Partial<PreNotaItem>) => void;
}

/* ───────────────── Interface Principal da Store Auxiliar ───────────────── */
export interface PreNotaAuxState {
  pedidosSelecionadosAux: PedidosSelecionadosAuxState;
  loadStatus: XmlLoadStatusState;
  fornecedorSearch: FornecedorSearchState;
  selection: SelectionState;
  totalNf: TotalNfState;
  condicaoPagamento: CondicaoPagamentoState;
  itemEditing: ItemEditingState; // <<< Nova slice adicionada
}

/* ──────────────────────── Criação da Store Zustand ────────────────────────── */
export const usePreNotaAuxStore = create<PreNotaAuxState>((set) => ({
  /* --- Slice: pedidosSelecionadosAux --- */
  pedidosSelecionadosAux: {
    pedidosSelecionados: [],
    addPedidoSelecionado: (codigo) =>
      set((state) => ({ pedidosSelecionadosAux: { ...state.pedidosSelecionadosAux, pedidosSelecionados: [...state.pedidosSelecionadosAux.pedidosSelecionados, codigo] } })),
    removePedidoSelecionado: (codigo) =>
      set((state) => ({ pedidosSelecionadosAux: { ...state.pedidosSelecionadosAux, pedidosSelecionados: state.pedidosSelecionadosAux.pedidosSelecionados.filter((c) => c !== codigo) } })),
    clearPedidosSelecionados: () =>
      set((state) => ({ pedidosSelecionadosAux: { ...state.pedidosSelecionadosAux, pedidosSelecionados: [] } })),
  },

  /* --- Slice: loadStatus --- */
  loadStatus: {
    xmlDataLoaded: false,
    setXmlDataLoadedSuccess: () =>
      set((state) => ({ loadStatus: { ...state.loadStatus, xmlDataLoaded: true } })),
    clearXmlDataLoadedFlag: () =>
      set((state) => ({ loadStatus: { ...state.loadStatus, xmlDataLoaded: false } })),
  },

  /* --- Slice: fornecedorSearch --- */
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

  /* --- Slice: selection --- */
  selection: {
    selectedPedido: null,
    selectedFornecedor: null,
    setSelectedPedido: (pedido) =>
      set((state) => ({ selection: { ...state.selection, selectedPedido: pedido } })),
    clearSelectedPedido: () =>
      set((state) => ({ selection: { ...state.selection, selectedPedido: null } })),
    setSelectedFornecedor: (fornecedor) =>
      set((state) => ({ selection: { ...state.selection, selectedFornecedor: fornecedor } })),
    clearSelectedFornecedor: () =>
      set((state) => ({ selection: { ...state.selection, selectedFornecedor: null } })),
  },

  /* --- Slice: totalNf --- */
  totalNf: {
    valorTotalXml: null,
    setValorTotalXml: (valor) =>
      set((state) => ({ totalNf: { ...state.totalNf, valorTotalXml: valor } })),
    clearValorTotalXml: () =>
      set((state) => ({ totalNf: { ...state.totalNf, valorTotalXml: null } })),
  },

  /* --- Slice: condicaoPagamento --- */
  condicaoPagamento: {
    data: null,
    setData: (condData) =>
      set((state) => ({ condicaoPagamento: { ...state.condicaoPagamento, data: condData } })),
    clearData: () =>
      set((state) => ({
        condicaoPagamento: { ...state.condicaoPagamento, data: null },
      })),
  },

  /* --- Slice: itemEditing (NOVA) --- */
  itemEditing: {
    editableItems: null, // Inicia como nulo

    // Inicializa/substitui a lista de itens editáveis com uma cópia
    initializeEditableItems: (items) =>
      set((state) => ({
        itemEditing: {
          ...state.itemEditing,
          // Usar structuredClone para cópia profunda mais moderna, ou JSON.parse/stringify
          editableItems: items ? structuredClone(items) : null,
        },
      })),

    // Atualiza a quantidade de um item específico na lista editável
    updateEditableItemQuantity: (itemIdentifier, newQuantity) =>
      set((state) => {
        if (!state.itemEditing.editableItems) {
            console.warn("Tentativa de atualizar quantidade sem itens editáveis inicializados.");
            return state; // Não faz nada se a lista não existe
        }
        const updatedItems = state.itemEditing.editableItems.map((item) => {
          // <<< CONFIRME SE 'ITEM' é o campo identificador único correto >>>
          if (item.ITEM === itemIdentifier) {
            // Retorna um novo objeto item com a quantidade atualizada
            return { ...item, QUANTIDADE: newQuantity };
          }
          return item; // Mantém os outros itens inalterados
        });
        // Retorna o novo estado da slice com a lista atualizada
        return {
          itemEditing: { ...state.itemEditing, editableItems: updatedItems },
        };
      }),

    // Limpa a lista de itens editáveis (define como null)
    clearEditableItems: () =>
      set((state) => ({
        itemEditing: { ...state.itemEditing, editableItems: null },
      })),

    // Action genérica para aplicar um patch a um item editável
    updateEditableItem: (itemIdentifier, patch) =>
      set((state) => {
        if (!state.itemEditing.editableItems) {
            console.warn("Tentativa de aplicar patch sem itens editáveis inicializados.");
            return state;
        }
        const updatedItems = state.itemEditing.editableItems.map((item) => {
          // <<< CONFIRME SE 'ITEM' é o campo identificador único correto >>>
          if (item.ITEM === itemIdentifier) {
            // Retorna um novo objeto item com o patch aplicado
            return { ...item, ...patch };
          }
          return item;
        });
        return {
          itemEditing: { ...state.itemEditing, editableItems: updatedItems },
        };
      }),
  },
})); // Fim do create

/* ────────────────────────── Selectors / Hooks ─────────────────────────── */

// Hooks existentes...
export const useXmlDataLoadedStatus = () => usePreNotaAuxStore((s) => s.loadStatus.xmlDataLoaded);
export const useFornecedorSearchResult = () => usePreNotaAuxStore((s) => s.fornecedorSearch.searchResult);
export const useSelectedPedido = () => usePreNotaAuxStore((s) => s.selection.selectedPedido);
export const useSelectedFornecedor = () => usePreNotaAuxStore((s) => s.selection.selectedFornecedor);
export const useValorTotalXml = () => usePreNotaAuxStore((s) => s.totalNf.valorTotalXml);
export const useCondicaoPagamentoData = () => usePreNotaAuxStore((s) => s.condicaoPagamento.data);

// --- NOVOS Hooks/Selectors para a Slice de Edição ---
export const useEditableItems = () => usePreNotaAuxStore((s) => s.itemEditing.editableItems);
export const useInitializeEditableItems = () => usePreNotaAuxStore((s) => s.itemEditing.initializeEditableItems);
export const useUpdateEditableItemQuantity = () => usePreNotaAuxStore((s) => s.itemEditing.updateEditableItemQuantity);
export const useUpdateEditableItem = () => usePreNotaAuxStore((s) => s.itemEditing.updateEditableItem);
export const useClearEditableItems = () => usePreNotaAuxStore((s) => s.itemEditing.clearEditableItems);

// --- Hooks/Selectors para a Slice de Pedidos Selecionados ---
export const usePedidosSelecionadosAux = () => usePreNotaAuxStore((s) => s.pedidosSelecionadosAux);
export const useAddPedidoSelecionadoAux = () => usePreNotaAuxStore((s) => s.pedidosSelecionadosAux.addPedidoSelecionado);
export const useRemovePedidoSelecionadoAux = () => usePreNotaAuxStore((s) => s.pedidosSelecionadosAux.removePedidoSelecionado);
export const useClearPedidosSelecionadosAux = () => usePreNotaAuxStore((s) => s.pedidosSelecionadosAux.clearPedidosSelecionados);
