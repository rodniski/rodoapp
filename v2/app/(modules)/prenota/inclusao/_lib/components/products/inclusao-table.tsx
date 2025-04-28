"use client";

import * as React from "react";
import {type ColumnDef, flexRender, getCoreRowModel, useReactTable,} from "@tanstack/react-table";
import {ScrollArea, ScrollBar, Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "ui";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    isLoading?: boolean;
}

export function InclusaoTable<TData, TValue>({
                                                 columns,
                                                 data,
                                                 isLoading,
                                             }: DataTableProps<TData, TValue>) {
    // Configuração da tabela usando useReactTable
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    if (isLoading) {
        return <div className="flex items-center justify-center h-full">Carregando...</div>;
    }

    return (
        <div className="flex flex-col h-full shadow-lg">
            {/* Área de scroll para a tabela */}
            <ScrollArea className="flex-1 rounded-md border bg-muted/30 overflow-x-auto">
                <div className="w-full overflow-x-auto">
                    <Table className="w-full border-collapse bg-card/30 backdrop-blur-3xl">
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            key={header.id}
                                            colSpan={header.colSpan}
                                            className="border-r border-b border dark:border-background/40 px-4 py-2 text-center text-base last:border-r-0 bg-muted font-semibold"
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
                        <TableBody className="relative h-full">
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-4 py-2 text-center"
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow
                                    className="fixed bottom-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl z-50 text-muted-foreground"
                                >
                                    <TableCell colSpan={columns.length} className="text-center">
                                        Busque a XML para aparecer os dados
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <ScrollBar orientation="horizontal"/>
            </ScrollArea>
        </div>
    );
}