import * as React from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanStackTable,
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

// CONTEXT
const TableContext = React.createContext<TanStackTable<any> | null>(null);
export const useReactTableContext = () => {
  const context = React.useContext(TableContext);
  if (!context)
    throw new Error("useReactTableContext must be used inside <DataTable>");
  return context;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  enableSorting = false,
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
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    manualSorting: true,
  });

  return (
    <TableContext.Provider value={table}>
      <div className={cn("rounded-md border max-w-full ", className)}>
        {/* Tabela com header fixo e largura baseada no conteúdo */}
        <div className="max-h-[calc(100vh-200px)] rounded-xl overflow-auto scroll-smooth">
          <Table className="w-full table-auto rounded-xl">
            <TableHeader className="sticky top-0 z-20 bg-background shadow-sm">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-card/90">
              {isLoading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    {columns.map((_, colIndex) => (
                      <TableCell key={colIndex}>
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Plugáveis como Paginação, Filtros */}
        {children}
      </div>
    </TableContext.Provider>
  );
}
