import * as React from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Header,
  Cell,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from "ui";
import { cn } from "utils";
import { DataTableProps } from ".";

const TableContext = React.createContext(null);
export const useReactTableContext = () => {
  const context = React.useContext(TableContext);
  if (!context) throw new Error("useReactTableContext must be used inside <DataTable>");
  return context;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  enableSorting = true,
  sortingConfig = { allowMultiSort: false },
  className,
  children,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>(
    sortingConfig.defaultSort?.map((sort) => ({
      id: sort.field,
      desc: sort.direction === "desc",
    })) || []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    manualSorting: true,
  });

  return (
    <TableContext.Provider value={table}>
      <div className={cn("rounded-t-xl border shadow dark:shadow-bottom-dir overflow-hidden", className)}>
        <div className="max-h-[calc(100vh-200px)] w-full overflow-auto scroll-smooth">
          <Table className="w-full table-fixed rounded-xl">
            <TableHeader className="sticky top-0 z-10 bg-muted/80 shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header: Header<TData, unknown>) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width: header.isPlaceholder ? undefined : `${header.getSize()}px`,
                      }}
                    >
                      {header.isPlaceholder ? null : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody >
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`} className="dark:bg-accent/ hover:bg-background">
                    {table.getAllColumns().map((column) => (
                      <TableCell
                        key={column.id}
                        style={{ width: `${column.getSize()}px` }}
                      >
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="dark:bg-accent/ bg-muted/30 hover:bg-background">
                    {row.getVisibleCells().map((cell: Cell<TData, unknown>) => (
                      <TableCell
                        key={cell.id}
                        style={{ width: `${cell.column.getSize()}px` }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {children}
      </div>
    </TableContext.Provider>
  );
}
