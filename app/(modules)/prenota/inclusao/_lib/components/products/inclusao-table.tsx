"use client";

import * as React from "react";
import {
    type ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    ScrollArea,
    ScrollBar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "ui";
import { cn } from "utils"; 

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

    const tableData = React.useMemo(() => data ?? [], [data]);

    const table = useReactTable({
        data: tableData, 
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    const columnCount = table.getAllColumns().length;

    return (
        <div className="flex flex-col h-full overflow-hidden shadow-lg"> 
            <ScrollArea className="flex-1 rounded-md border relative bg-card"> 
                <Table className={cn("w-full border-collapse")}>
                    <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur"> 
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id} className="border-b">
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        colSpan={header.colSpan}
                                        style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
                                        className="px-4 py-2 h-10 text-center font-semibold border-x first:border-l-0 last:border-r-0" 
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
                    <TableBody>
                        {isLoading ? (
                             <TableRow>
                                <TableCell colSpan={columnCount} className="h-32 text-center text-muted-foreground"> 
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ): table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    className="border-b hover:bg-muted/50" 
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            style={{ width: cell.column.getSize() !== 150 ? cell.column.getSize() : undefined }}
                                            className="px-4 py-2 h-10 text-center border-x first:border-l-0 last:border-r-0" 
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columnCount} className="h-32 text-center text-muted-foreground"> 
                                    Busque a XML para aparecer os dados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    );
}