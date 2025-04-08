import type { ColumnDef } from "@tanstack/react-table";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
}

export interface FilterOption {
  value: string;
  label: string;
}
