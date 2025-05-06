// Dentro do seu componente DataTable.tsx

import * as React from "react";
import {
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  Table as TanStackTable, // Renomeia para evitar conflito com Table de UI
  Header, // Importa Header para tipar
  Cell,   // Importa Cell para tipar
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
} from "ui"; // Seus componentes UI
import { cn } from "utils";
import { DataTableProps } from "."; // Sua interface de Props

// CONTEXT (Mantido igual)
const TableContext = React.createContext<TanStackTable<any> | null>(null);
export const useReactTableContext = () => {
  const context = React.useContext(TableContext);
  if (!context) throw new Error("useReactTableContext must be used inside <DataTable>");
  return context;
};

// Componente DataTable Refatorado
export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  enableSorting = true, // Habilita sorting por padrão talvez?
  sortingConfig = { allowMultiSort: false },
  className,
  children,
}: DataTableProps<TData, TValue>) {

  // Lógica de sorting (mantida, mas agora os tamanhos vêm das colunas)
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
    manualSorting: true, // Mantém manual se a API faz a ordenação
    // Habilita resize se quiser que o usuário redimensione (requer mais setup)
    // enableColumnResizing: true,
    // columnResizeMode: 'onChange',
  });

  // Calcula o tamanho total da tabela com base nos tamanhos definidos nas colunas
  // Útil se você NÃO quiser que a tabela ocupe 100% da largura sempre.
  // const tableTotalSize = table.getTotalSize(); // Retorna a soma dos sizes das colunas

  return (
    <TableContext.Provider value={table}>
      {/* Container principal */}
      <div className={cn("rounded-md border", className)}> {/* Removido max-w-full daqui */}
        {/* Container com scroll */}
        <div className="max-h-[calc(100vh-200px)] w-full overflow-auto rounded-xl scroll-smooth"> {/* Garante w-full aqui */}
          {/* Tabela com layout fixo */}
          <Table
            className="w-full table-fixed rounded-xl"
            // Aplica o tamanho total calculado se quiser que a tabela não estique 100%
            // style={{ width: tableTotalSize }}
          >
            <TableHeader className="sticky top-0 z-10 bg-background shadow-sm hover:bg-muted/50">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header: Header<TData, TValue>) => ( // Tipagem explícita
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      // --- APLICA O TAMANHO DA COLUNA AQUI ---
                      // Usa header.getSize() que retorna o valor de 'size' da ColumnDef
                      style={{
                        width: header.isPlaceholder ? undefined : `${header.getSize()}px`,
                      }}
                      // Adiciona classes para resize se habilitado
                      // className={cn(header.column.getCanResize() && "cursor-col-resize")}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      {/* Handle de resize (se habilitado) */}
                      {/* {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className="absolute top-0 right-0 h-full w-1 cursor-col-resize select-none touch-none bg-border opacity-0 hover:opacity-100"
                        />
                      )} */}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="bg-card/90">
              {isLoading ? (
                // Skeleton Loading (pode melhorar pegando o número de colunas de table.getAllColumns())
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={`skeleton-${index}`}>
                    {table.getAllColumns().map((column) => ( // Usa colunas da tabela
                      <TableCell
                          key={column.id}
                          // --- APLICA O TAMANHO NA CÉLULA DO SKELETON ---
                          style={{ width: `${column.getSize()}px` }}
                      >
                        <Skeleton className="h-6 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"} // Para estilos de linha selecionada
                  >
                    {row.getVisibleCells().map((cell: Cell<TData, TValue>) => ( // Tipagem explícita
                      <TableCell
                        key={cell.id}
                        // --- APLICA O TAMANHO DA COLUNA AQUI ---
                        style={{
                          width: `${cell.column.getSize()}px`,
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                // Mensagem "Sem resultados"
                <TableRow>
                  <TableCell
                    colSpan={columns.length} // Ou table.getAllColumns().length
                    className="h-24 text-center"
                  >
                    Sem resultados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Renderiza componentes filhos (ex: Paginação) */}
        {children}
      </div>
    </TableContext.Provider>
  );
}