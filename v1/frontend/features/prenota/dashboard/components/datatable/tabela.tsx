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
import * as React from "react";
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
} from "ui";
import {DataTableToolbar} from "./toolbar";
import {MultiStepLoader} from "components/aceternity";

interface ColumnMeta {
    width?: string;
    className?: string;
}

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    isLoading?: boolean;
    onExport?: () => void;
    onRefetch?: () => void;
    isRefetching?: boolean;
}

const loadingSteps = [
    {text: "Conectando ao servidor..."},
    {text: "Carregando pré-notas..."},
];

const useTableState = () => {
    const getLocalState = <T, >(key: string, defaultValue: T): T => {
        try {
            return JSON.parse(localStorage.getItem(key) || "") || defaultValue;
        } catch {
            return defaultValue;
        }
    };

    const [sorting, setSorting] = React.useState<SortingState>(getLocalState("tableSorting", []));
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        getLocalState("tableColumnFilters", [])
    );
    const [globalFilter, setGlobalFilter] = React.useState(localStorage.getItem("tableGlobalFilter") || "");

    return {sorting, setSorting, columnFilters, setColumnFilters, globalFilter, setGlobalFilter};
};

export function DataTable<TData>({
                                     columns,
                                     data,
                                     isLoading = false,
                                     onExport,
                                     onRefetch,
                                     isRefetching = false,
                                 }: DataTableProps<TData>) {
    const {sorting, setSorting, columnFilters, setColumnFilters, globalFilter, setGlobalFilter} =
        useTableState();

    const debouncedGlobalFilter = globalFilter;
    const headerHeight = 50;

    const table = useReactTable({
        data,
        columns,
        enableColumnResizing: true,
        columnResizeMode: "onChange",
        initialState: {pagination: {pageSize: 100, pageIndex: 0}},
        onSortingChange: (updater) => {
            setSorting(updater);
            localStorage.setItem(
                "tableSorting",
                JSON.stringify(updater instanceof Function ? updater(sorting) : updater)
            );
        },
        onColumnFiltersChange: (updater) => {
            setColumnFilters(updater);
            localStorage.setItem(
                "tableColumnFilters",
                JSON.stringify(updater instanceof Function ? updater(columnFilters) : updater)
            );
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: (row, _, filterValue) => {
            const search = filterValue.toLowerCase();
            return ["F1XTipo", "F1XUsrra", "Fornece", "F1Doc"].some(
                (key) => row.getValue(key)?.toString().toLowerCase().includes(search) || false
            );
        },
        state: {sorting, columnFilters, globalFilter: debouncedGlobalFilter},
    });

    React.useEffect(() => {
        localStorage.setItem("tableGlobalFilter", globalFilter);
    }, [globalFilter]);

    // Cálculo de larguras: se houver meta.width, usa; senão, "auto" para flexibilidade.
    const columnWidths = React.useMemo(() => {
        const widths: Record<string, string> = {};
        columns.forEach((col) => {
            const id = col.id || ("accessorKey" in col ? (col.accessorKey as string) : "");
            if (id) {
                const meta = col.meta as ColumnMeta | undefined;
                if (id === "actions") widths[id] = "80px";
                else if (meta?.width) widths[id] = meta.width;
                else widths[id] = "auto";
            }
        });
        return widths;
    }, [columns]);

    return (
        <div className="flex flex-col h-full">
            <div className="mb-4">
                <DataTableToolbar
                    table={table}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                    onExport={onExport}
                    onRefetch={onRefetch}
                    isRefetching={isRefetching}
                    hasSelection={false}
                />
            </div>

            <div className="rounded-md border shadow flex-1 overflow-hidden">
                {/* Cabeçalho fixo com layout flexível */}
                <Table className="w-full table-auto overflow-visible">
                    <TableHeader className="shadow-lg overflow-visible">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                key={headerGroup.id}
                                className="sticky top-0 bg-muted z-10 border-b border dark:border-background/40 shadow-lg"
                                style={{height: headerHeight}}
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        className={`px-4 py-2 text-start text-base font-semibold ${
                                            (header.column.columnDef.meta as ColumnMeta | undefined)?.className || ""
                                        }`}
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
                                                className="-ml-4 h-8 flex items-center text-xs uw:text-base"
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                                {header.column.getIsSorted() === "asc" ? (
                                                    <ArrowUpIcon className="ml-1.5 h-4 w-4"/>
                                                ) : header.column.getIsSorted() === "desc" ? (
                                                    <ArrowDownIcon className="ml-1.5 h-4 w-4"/>
                                                ) : (
                                                    <ArrowUpDown className="ml-1.5 h-4 w-4"/>
                                                )}
                                            </Button>
                                        )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                </Table>

                {/* Área rolável para o corpo da tabela */}
                <ScrollArea className="h-full rounded-md border bg-background">
                    <Table className="w-full table-auto">
                        <TableBody className="relative h-full">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-2 text-start"
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
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-[calc(100vh-300px)] text-start">
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
