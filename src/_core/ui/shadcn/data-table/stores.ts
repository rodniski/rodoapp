import { create, StateCreator } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface DataTableState {
  pageIndex: number;
  pageSize: number;
  sorting: { id: string; desc: boolean }[];
  searchTerm: string;
  filters: Record<string, string | string[] | { from: string; to: string }>;
  pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
  filials: string[];
  setPagination: (pagination: {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }) => void;
  setPageIndex: (pageIndex: number) => void;
  setPageSize: (pageSize: number) => void;
  setSearchTerm: (searchTerm: string) => void;
  setFilters: (filters: Record<string, string | string[] | { from: string; to: string }>) => void;
  setFilials: (filials: string[]) => void;
  clearFilters: () => void;
  setSorting: (sorting: { id: string; desc: boolean }[]) => void;
}

// Definir o StateCreator com tipagem explícita
const createDataTableStore: StateCreator<
  DataTableState,
  [["zustand/persist", unknown]]
> = (set, get) => ({
  pageIndex: 0,
  pageSize: 10,
  sorting: [],
  searchTerm: "",
  filters: {},
  pagination: { page: 1, pageSize: 10, totalCount: 0, totalPages: 0 },
  filials: [],
  setPagination: (pagination) =>
    set({
      pagination,
      pageIndex: pagination.page - 1,
      pageSize: pagination.pageSize,
    }),
  setPageIndex: (pageIndex) =>
    set({
      pageIndex,
      pagination: { ...get().pagination, page: pageIndex + 1 },
    }),
  setPageSize: (pageSize) =>
    set({
      pageSize,
      pageIndex: 0,
      pagination: { ...get().pagination, pageSize, page: 1 },
    }),
  setSearchTerm: (searchTerm) =>
    set({
      searchTerm,
      pageIndex: 0,
      pagination: { ...get().pagination, page: 1 },
    }),
  setFilters: (filters) =>
    set({
      filters,
      pageIndex: 0,
      pagination: { ...get().pagination, page: 1 },
    }),
  setFilials: (filials) =>
    set({
      filials,
      pageIndex: 0,
      pagination: { ...get().pagination, page: 1 },
    }),
  clearFilters: () =>
    set({
      filters: {},
      searchTerm: "",
      filials: [],
      pageIndex: 0,
      pagination: { ...get().pagination, page: 1 },
    }),
  setSorting: (sorting) => set({ sorting }),
});

export const useDataTableStore = create<DataTableState>()(
  persist(createDataTableStore, {
    name: "data-table-state",
    storage: createJSONStorage(() => localStorage),
  })
);