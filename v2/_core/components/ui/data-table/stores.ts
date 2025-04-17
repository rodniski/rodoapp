import { create } from "zustand";
import { DataTableStore, PaginationInfo } from ".";

type SortingState = {
  id: string;
  desc: boolean;
}[];

type Filters = Record<string, unknown>;

export const useDataTableStore = create<DataTableStore>((set) => ({
  pageIndex: 0,
  pageSize: 10,
  filters: {},
  sorting: [],
  pagination: {
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 1,
  },
  setPageIndex: (index: number) => set({ pageIndex: index }),
  setPageSize: (size: number) => set({ pageSize: size }),
  setFilters: (filters: Filters) => set({ filters }),
  setSorting: (sorting: SortingState) => set({ sorting }),
  setPagination: (pagination: PaginationInfo) => set({ pagination }),
}));
