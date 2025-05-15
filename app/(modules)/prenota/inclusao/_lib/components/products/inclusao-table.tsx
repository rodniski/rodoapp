"use client";

import React, { useState, useMemo, useEffect } from "react";
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
import { useValorTotalXml, usePreNotaAuxStore } from "@inclusao/stores";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
}

export function InclusaoTable<
  TData extends { VALUNIT?: number; TOTAL?: number; QUANTIDADE?: number },
  TValue
>({ columns, data, isLoading }: DataTableProps<TData, TValue>) {
  const setValorTotalXml = usePreNotaAuxStore(
    (state) => state.totalNf.setValorTotalXml
  );

  const tableData = useMemo(() => data ?? [], [data]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const columnCount = table.getAllColumns().length;

  const totalItens = tableData.length;
  const somaValorUnit = tableData.reduce(
    (acc, item) => acc + (item.VALUNIT || 0) * (item.QUANTIDADE || 0),
    0
  );
  const somaTotal = tableData.reduce((acc, item) => acc + (item.TOTAL || 0), 0);

  useEffect(() => {
    setValorTotalXml(somaTotal);
  }, [somaTotal, setValorTotalXml]);

  return (
    <div className="flex-1 w-full my-6">
      <div className="flex flex-col h-full overflow-hidden shadow-lg rounded-md border bg-card">
        <div className="sticky top-0 z-10">
          <Table className={cn("w-full border-collapse")}> 
            <TableHeader className="bg-muted/80 backdrop-blur">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width:
                          header.getSize() !== 150
                            ? header.getSize()
                            : undefined,
                      }}
                      className="px-4 py-2 h-10 text-center font-semibold border-x first:border-l-0 last:border-r-0"
                    >
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
          </Table>
        </div>
        <ScrollArea className="flex-1 max-h-[calc(100vh-350px)] overflow-auto">
          <Table className={cn("w-full border-collapse")}> 
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Carregando...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          width:
                            cell.column.getSize() !== 150
                              ? cell.column.getSize()
                              : undefined,
                        }}
                        className="px-4 py-2 h-10 text-center border-x first:border-l-0 last:border-r-0"
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
                <TableRow>
                  <TableCell
                    colSpan={columnCount}
                    className="h-32 text-center text-muted-foreground"
                  >
                    Busque a XML para aparecer os dados
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="sticky bottom-0 z-10 bg-muted/80 backdrop-blur border-t">
          <Table className={cn("w-full border-collapse")}> 
            <tfoot>
              <tr>
                <td
                  colSpan={columnCount}
                  className="px-4 py-2 h-10 text-center font-semibold"
                >
                  <div className="flex justify-between w-full">
                    <span>{`Itens: ${totalItens}`}</span>
                    <span>{`Soma Valor Unitário: ${somaValorUnit.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`}</span>
                    <span>{`Total: ${somaTotal.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`}</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </Table>
        </div>
      </div>
    </div>
  );
}