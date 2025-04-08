"use client";

import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    type PaginationState,
    type SortingState,
    useReactTable
} from "@tanstack/react-table";
import {ArrowDownIcon, ArrowUpDown, ArrowUpIcon} from "lucide-react";
import React, {useEffect, useState} from 'react';
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
import {DataTableToolbar} from "./toolbar"; // Sua toolbar
import {MultiStepLoader} from "components/aceternity"; // Seu loader

// Interface para metadados da coluna (mantida)
interface ColumnMeta {
    width?: string;
    className?: string;
}

// Props do DataTable MODIFICADAS para Paginação Server-Side
interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[]; // Dados da página atual
    isLoading?: boolean; // Estado de carregamento inicial/principal
    onExport?: () => void; // Função de exportação (opcional)
    onRefetch?: () => void; // Função para rebuscar dados
    isRefetching?: boolean; // Estado de re-busca (ex: após refresh manual)

    // --- Props para Paginação Server-Side ---
    pageCount: number; // Número total de páginas (calculado no pai)
    pagination: PaginationState; // Estado atual de paginação ({ pageIndex, pageSize })
    onPaginationChange: React.Dispatch<React.SetStateAction<PaginationState>>; // Função para atualizar o estado no pai
    // --- Fim das Props de Paginação ---

    // Props para Ordenação/Filtragem (se fossem server-side, viriam aqui também)
    // sorting?: SortingState;
    // onSortingChange?: React.Dispatch<React.SetStateAction<SortingState>>;
    // columnFilters?: ColumnFiltersState;
    // onColumnFiltersChange?: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
    // globalFilter?: string;
    // onGlobalFilterChange?: (value: string) => void;
}

// Estados do loading (mantido)
const loadingSteps = [
    {text: "Conectando ao servidor..."},
    {text: "Carregando pré-notas..."},
];

// Hook para gerenciar estado LOCAL de filtros/ordenação e localStorage (mantido)
// ATENÇÃO: Este hook agora só gerencia estados que NÃO são controlados pelo servidor.
const useTableState = () => {
    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
    const [globalFilter, setGlobalFilter] = useState<string>("");

    useEffect(() => {
        try {
            const storedSorting = localStorage.getItem("tableSorting");
            if (storedSorting) setSorting(JSON.parse(storedSorting));
        } catch (error) {
            console.error("Failed to parse tableSorting", error);
        }

        try {
            const storedColumnFilters = localStorage.getItem("tableColumnFilters");
            if (storedColumnFilters) setColumnFilters(JSON.parse(storedColumnFilters));
        } catch (error) {
            console.error("Failed to parse tableColumnFilters", error);
        }

        const storedGlobalFilter = localStorage.getItem("tableGlobalFilter");
        if (storedGlobalFilter !== null) setGlobalFilter(storedGlobalFilter);
    }, []);

    useEffect(() => {
        localStorage.setItem("tableSorting", JSON.stringify(sorting));
    }, [sorting]);
    useEffect(() => {
        localStorage.setItem("tableColumnFilters", JSON.stringify(columnFilters));
    }, [columnFilters]);
    useEffect(() => {
        localStorage.setItem("tableGlobalFilter", globalFilter);
    }, [globalFilter]);

    return {sorting, setSorting, columnFilters, setColumnFilters, globalFilter, setGlobalFilter};
};


// Componente DataTable ADAPTADO para Paginação Server-Side
export function DataTable<TData>({
                                     columns,
                                     data,
                                     isLoading = false,
                                     onExport,
                                     onRefetch,
                                     isRefetching = false,
                                     // --- Recebe as props de paginação ---
                                     pageCount,
                                     pagination,
                                     onPaginationChange,
                                 }: DataTableProps<TData>) {

    // Usa o hook para estados LOCAIS (ordenação, filtros)
    const {sorting, setSorting, columnFilters, setColumnFilters, globalFilter, setGlobalFilter} =
        useTableState();

    const headerHeight = 50; // Altura fixa para o cabeçalho (mantido)

    const table = useReactTable({
        data, // Dados da página atual
        columns,
        pageCount: pageCount, // Define o total de páginas vindo do servidor
        manualPagination: true, // Habilita controle externo de paginação
        onPaginationChange: onPaginationChange, // Usa a função do pai para atualizar estado de paginação

        // Configurações para Ordenação/Filtragem LOCAIS (mantidas)
        // Se fossem server-side, seriam configuradas como a paginação (manual*, on*Change, state)
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(), // Mantido para ordenação local
        getFilteredRowModel: getFilteredRowModel(), // Mantido para filtragem local
        globalFilterFn: (row, _, filterValue) => { // Função de filtro global local (mantida)
            const search = filterValue.toLowerCase();
            // Adapte as chaves conforme necessário
            return ["f1_xtipo", "f1_xusrra", "a2_nome", "f1_doc"].some( // Ajustado para nomes de campo mais prováveis
                (key) => {
                    const value = row.getValue(key);
                    return typeof value === 'string' && value.toLowerCase().includes(search);
                }
            );
        },
        // --- Fim Ordenação/Filtragem Locais ---

        // Configurações de Resizing (mantidas)
        enableColumnResizing: true,
        columnResizeMode: "onChange",

        // Define o ESTADO COMPLETO da tabela
        state: {
            sorting,       // Estado local de ordenação
            columnFilters, // Estado local de filtros de coluna
            globalFilter,  // Estado local de filtro global
            pagination,    // Estado CONTROLADO de paginação (vem do pai)
        },
        // debugTable: true, // Descomente para debug no console
    });

    // Cálculo de larguras (mantido)
    const columnWidths = React.useMemo(() => {
        const widths: Record<string, string> = {};
        columns.forEach((col) => {
            const id = col.id || ("accessorKey" in col ? String(col.accessorKey) : ""); // Garante que id seja string
            if (id) {
                const meta = col.meta as ColumnMeta | undefined;
                if (id === "actions") widths[id] = "80px";
                else if (meta?.width) widths[id] = meta.width;
                else widths[id] = "auto";
            }
        });
        return widths;
    }, [columns]);


    // Renderização do Componente (igual à versão anterior, mas agora compatível com paginação server-side)
    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div className="mb-4">
                <DataTableToolbar
                    table={table}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter} // Passa a função do hook local
                    onExport={onExport}
                    onRefetch={onRefetch}
                    isRefetching={isRefetching}
                    hasSelection={false}
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
                                    className="border-b border dark:border-background/40"
                                    style={{height: `${headerHeight}px`}}
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            className={`px-4 py-2 text-left text-xs sm:text-sm font-semibold overflow-hidden text-ellipsis whitespace-nowrap ${(header.column.columnDef.meta as ColumnMeta | undefined)?.className || ""}`}
                                            style={{
                                                width: columnWidths[header.column.id],
                                                minWidth: columnWidths[header.column.id],
                                                maxWidth: columnWidths[header.column.id],
                                            }}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <Button
                                                    variant="ghost"
                                                    onClick={header.column.getToggleSortingHandler()}
                                                    disabled={!header.column.getCanSort()}
                                                    className="-ml-4 h-8 flex items-center text-xs uw:text-sm p-1"
                                                >
                                                    <span className="truncate">
                                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                                    </span>
                                                    {header.column.getCanSort() && (
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
                {/* Corpo da Tabela com Scroll */}
                <ScrollArea className="flex-1 relative" style={{height: `calc(100% - ${headerHeight}px)`}}>
                    <Table className="min-w-full table-fixed border-collapse">
                        <TableBody className="divide-y divide-border">
                            {/* Renderização das linhas ou estado de vazio/carregando */}
                            {isLoading ? ( // Mostra loader principal se isLoading for true
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-[calc(100vh-300px)] text-center">
                                        <MultiStepLoader loadingStates={loadingSteps} loading duration={2400}/>
                                    </TableCell>
                                </TableRow>
                            ) : table.getRowModel().rows?.length ? ( // Se não está carregando e tem linhas
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}
                                              className="hover:bg-muted/50">
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-2 text-left text-xs sm:text-sm overflow-hidden text-ellipsis whitespace-nowrap"
                                                style={{
                                                    width: columnWidths[cell.column.id],
                                                    minWidth: columnWidths[cell.column.id],
                                                    maxWidth: columnWidths[cell.column.id],
                                                }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : ( // Se não está carregando e não tem linhas
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-[calc(100vh-300px)] text-center">
                                        <p className="text-muted-foreground">Nenhum resultado encontrado.</p>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </div>
            {/* Paginação */}
            <div className="pt-4">
                {/* DataTablePagination usará o estado e pageCount do 'table' instance */}
                <DataTablePagination table={table}/>
            </div>
        </div>
    );
}