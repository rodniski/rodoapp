// interfaces.ts

import { ColumnDef } from "@tanstack/react-table";

/**
 * Representa o estado de ordenação de uma coluna da tabela.
 */
export type SortingState = {
    id: string;
    desc: boolean;
  }[];
  
  /**
   * Representa um conjunto genérico de filtros aplicados.
   */
  export type Filters = Record<string, unknown>;
  
  /**
   * Informações de paginação vindas da API.
   */
  export interface PaginationInfo {
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  }
  
  /**
   * Estado geral armazenado para o DataTable
   */
  export interface DataTableStore {
    pageIndex: number;
    pageSize: number;
    filters: Filters;
    sorting: SortingState;
    pagination: PaginationInfo;
  
    setPageIndex: (index: number) => void;
    setPageSize: (size: number) => void;
    setFilters: (filters: Filters) => void;
    setSorting: (sorting: SortingState) => void;
    setPagination: (pagination: PaginationInfo) => void;
  }
  
  /**
   * Propriedades para o componente DataTablePagination
   */
  export interface DataTablePaginationProps {
    pageSizeOptions?: number[];
  }

  /**
   * Propriedades para o componente DataTable
   */
  export type DataTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
    enableSorting?: boolean;
    sortingConfig?: {
      allowMultiSort?: boolean;
      defaultSort?: { field: string; direction: "asc" | "desc" }[];
    };
    className?: string;
    children?: React.ReactNode;
  };