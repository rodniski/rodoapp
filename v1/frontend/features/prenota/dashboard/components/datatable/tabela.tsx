"use client";

import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";
import {ArrowDownIcon, ArrowUpDown, ArrowUpIcon} from "lucide-react";
import React, {useEffect, useState} from 'react'; // Importado useState e useEffect
import {
    Button,
    DataTablePagination,
    ScrollArea,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "ui"; // Assumindo que 'ui' é seu alias/pacote de componentes UI
import {DataTableToolbar} from "./toolbar";
import {MultiStepLoader} from "components/aceternity"; // Assumindo que 'components' é seu alias/pacote

// Interface para metadados da coluna (já existia)
interface ColumnMeta {
    width?: string;
    className?: string;
}

// Props do DataTable (já existia)
interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    isLoading?: boolean;
    onExport?: () => void;
    onRefetch?: () => void;
    isRefetching?: boolean;
}

// Estados do loading (já existia)
const loadingSteps = [
    {text: "Conectando ao servidor..."},
    {text: "Carregando pré-notas..."},
];

// Hook corrigido para gerenciar estado da tabela e localStorage
const useTableState = () => {
    // 1. Inicializa os estados com valores padrão seguros (sem localStorage aqui)
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");

    // 2. useEffect para carregar dados do localStorage APÓS montagem no cliente
    useEffect(() => {
        // Roda apenas no cliente
        try {
            const storedSorting = localStorage.getItem("tableSorting");
            if (storedSorting) {
                setSorting(JSON.parse(storedSorting));
            }
        } catch (error) {
            console.error("Failed to parse tableSorting from localStorage", error);
            // localStorage.removeItem("tableSorting"); // Opcional: limpar item inválido
        }

        try {
            const storedColumnFilters = localStorage.getItem("tableColumnFilters");
            if (storedColumnFilters) {
                setColumnFilters(JSON.parse(storedColumnFilters));
            }
        } catch (error) {
            console.error("Failed to parse tableColumnFilters from localStorage", error);
            // localStorage.removeItem("tableColumnFilters"); // Opcional: limpar item inválido
        }

        const storedGlobalFilter = localStorage.getItem("tableGlobalFilter");
        if (storedGlobalFilter !== null) { // Verifica se existe
            setGlobalFilter(storedGlobalFilter);
        }

        // Dependência vazia [] garante que rode só uma vez na montagem
    }, []);

    // 3. useEffects para salvar alterações de volta no localStorage
    useEffect(() => {
        // Roda apenas no cliente quando 'sorting' muda
        localStorage.setItem("tableSorting", JSON.stringify(sorting));
    }, [sorting]);

    useEffect(() => {
        // Roda apenas no cliente quando 'columnFilters' muda
        localStorage.setItem("tableColumnFilters", JSON.stringify(columnFilters));
    }, [columnFilters]);

    useEffect(() => {
        // Roda apenas no cliente quando 'globalFilter' muda
        localStorage.setItem("tableGlobalFilter", globalFilter);
    }, [globalFilter]);

    return {sorting, setSorting, columnFilters, setColumnFilters, globalFilter, setGlobalFilter};
};


// Componente DataTable corrigido
export function DataTable<TData>({
                                     columns,
                                     data,
                                     isLoading = false,
                                     onExport,
                                     onRefetch,
                                     isRefetching = false,
                                 }: DataTableProps<TData>) {
    // Usa o hook corrigido
    const {sorting, setSorting, columnFilters, setColumnFilters, globalFilter, setGlobalFilter} =
        useTableState();

    const headerHeight = 50; // Altura fixa para o cabeçalho

    const table = useReactTable({
        data,
        columns,
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        initialState: {pagination: {pageSize: 100, pageIndex: 0}},
        // Simplificado: Apenas atualiza o estado. Os useEffects no hook cuidam do localStorage.
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        // ---
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, _, filterValue) => { // Função de filtro global (já existia)
            const search = filterValue.toLowerCase();
            // Adapte as chaves conforme necessário para suas colunas pesquisáveis
            return ["F1XTipo", "F1XUsrra", "Fornece", "F1Doc"].some(
                (key) => row.getValue(key)?.toString().toLowerCase().includes(search) || false
            );
        },
        // O estado da tabela é gerenciado pelo hook useTableState
        state: {sorting, columnFilters, globalFilter},
    });

    // Cálculo de larguras (já existia)
    const columnWidths = React.useMemo(() => {
        const widths: Record<string, string> = {};
        columns.forEach((col) => {
            const id = col.id || ("accessorKey" in col ? (col.accessorKey as string) : "");
            if (id) {
                const meta = col.meta as ColumnMeta | undefined;
                if (id === "actions") widths[id] = "80px"; // Largura fixa para coluna de ações
                else if (meta?.width) widths[id] = meta.width; // Usa meta.width se definido
                else widths[id] = "auto"; // "auto" para flexibilidade padrão
            }
        });
        return widths;
    }, [columns]);

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="mb-4">
                <DataTableToolbar
                    table={table}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter} // Passa a função do hook
                    onExport={onExport}
                    onRefetch={onRefetch}
                    isRefetching={isRefetching}
                    hasSelection={false} // Ajuste se precisar de seleção
                />
            </div>

            {/* Tabela com Scroll */}
            <div className="rounded-md border shadow flex-1 overflow-hidden flex flex-col">
                {/* Cabeçalho Fixo */}
                <div className="overflow-x-auto">
                    <Table className="min-w-full table-fixed border-collapse">
                        <TableHeader className="shadow-md bg-muted sticky top-0 z-10">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-b border dark:border-background/40" // Estilo da linha do cabeçalho
                                    style={{height: `${headerHeight}px`}} // Aplica altura fixa
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className={`px-4 py-2 text-left text-xs sm:text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap ${(header.column.columnDef.meta as ColumnMeta | undefined)?.className || ""
                                            }`}
                                            style={{
                                                width: columnWidths[header.column.id], // Aplica largura calculada
                                                // minWidth e maxWidth podem ser redundantes com table-fixed, mas não prejudicam
                                                minWidth: columnWidths[header.column.id],
                                                maxWidth: columnWidths[header.column.id],
                                            }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <Button
                                                    variant="ghost"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    disabled={!header.column.getCanSort()} // Desabilita se não puder ordenar
                                                    className="-ml-4 h-8 flex items-center text-xs uw:text-sm p-1" // Ajuste padding/margin
                                                >
                                                    <span className="truncate">
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </span>
                                                    {/* Ícones de ordenação */}
                                                    {header.column.getCanSort() && ( // Mostra ícone só se puder ordenar
                                                        header.column.getIsSorted() === "asc" ? (
                                                            <ArrowUpIcon
                                                                className="ml-1.5 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"/>
                                                        ) : header.column.getIsSorted() === "desc" ? (
                                                            <ArrowDownIcon
                                                                className="ml-1.5 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0"/>
                                                        ) : (
                                                            <ArrowUpDown
                                                                className="ml-1.5 h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground/50 flex-shrink-0"/>
                                                        )
                                                    )}
                                                </Button>
                                            )}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHeader>
                    </Table>
                </div>
                <ScrollArea className="flex-1 relative" style={{height: `calc(100% - ${headerHeight}px)`}}>
                    <Table className="min-w-full table-fixed border-collapse">
                        <TableBody className="divide-y divide-border">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}
                                              className="hover:bg-muted/50">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-2 text-left text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap" // Estilo da célula
                                                style={{
                                                    width: columnWidths[cell.column.id], // Aplica largura calculada
                                                    minWidth: columnWidths[cell.column.id],
                                                    maxWidth: columnWidths[cell.column.id],
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                // Estado de vazio ou carregando
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-[calc(100vh-300px)] text-center">
                                        {isLoading ? (
                                            <MultiStepLoader loadingStates={loadingSteps} loading duration={2400}/>
                                        ) : (
                                            <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
            <div className="pt-4">
                <DataTablePagination table={table}/>
            </div>
        </div>
    );
}