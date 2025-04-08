import type React from "react"
import type { Table } from "@tanstack/react-table"
import { X } from "lucide-react"
import { Button, Input } from "ui"
import { DataTableViewOptions } from "."

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    globalFilter: string
    setGlobalFilter: (value: string) => void
    extraContent?: React.ReactNode
}

export function DataTableToolbar<TData>({
                                            table,
                                            globalFilter,
                                            setGlobalFilter,
                                            extraContent,
                                        }: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                <Input
                    placeholder="Buscar na Tabela..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="h-10 pt-2 w-[150px] lg:w-[250px]"
                />
                {extraContent}
                {isFiltered && (
                    <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
                        Reiniciar Colunas
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table} />
        </div>
    )
}

