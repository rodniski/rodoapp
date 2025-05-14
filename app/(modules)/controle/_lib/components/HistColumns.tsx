"use client";

import { ColumnDef } from "@tanstack/react-table";
import { HistoricoItem } from "../types";
import React from "react";
import { ProductDetailsDialog } from "./ProductDetailsDialog";

// 📅 **Função auxiliar para formatação de data**
const formatDate = (date?: string): string => {
  if (!date) return "Data Inválida";
  const [day, month, year] = date.split("/");
  return day && month && year ? `${day}-${month}-${year}` : "Data Inválida";
};

// ⏰ **Função auxiliar para formatação de hora**
const formatTime = (time?: string): string => time || "--:--";

// 📝 **Definição das colunas**
export const HistColumns: ColumnDef<HistoricoItem>[] = [
  {
    accessorKey: "NFLabel",
    header: "Nota Fiscal",
    cell: ({ row }) => (
      <div className="flex flex-col">
        <span className="font-medium">{row.getValue("NFLabel")}</span>
        <span className="text-xs text-muted-foreground">
          Qtd. Itens: {row.original.QtdNF}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "ClienteLabel",
    header: "Cliente",
    cell: ({ row }) => (
      <div className="flex flex-1 flex-col">
        <span className="truncate">{row.getValue("ClienteLabel")}</span>
        <span className="text-xs text-muted-foreground">
          Vendedor: {row.original.VendedorLabel}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "DataFatu",
    header: "Faturamento",
    cell: ({ row }) => {
      const data = formatDate(row.getValue("DataFatu"));
      const hora = formatTime(row.original.HoraFatu);

      return (
        <div className="flex flex-col">
          <span>{data}</span>
          <span className="text-xs text-muted-foreground">{hora}</span>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: "Ver Historico",
    cell: ({ row }) => {
      const produtos = row.original.Produtos;

      return (
        <div className="w-10">
          <ProductDetailsDialog produtos={produtos} />
        </div>
      );
    },
  },
];
