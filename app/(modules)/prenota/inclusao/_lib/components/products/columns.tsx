// columns.tsx - Versão Final com Quantidade Editável via Store Auxiliar

import { ColumnDef } from "@tanstack/react-table";
import React, { useState, useEffect, useCallback } from "react"; // Importar hooks React
import { toast } from "sonner"; // Para feedback ao usuário
import { ProdutoSelectionCell } from "."; // Componente para vincular produto
import { formatCurrency } from "utils"; // Utilitário de formatação
import type { PreNotaItem } from "@inclusao/types"; // Tipo base do item
import { Badge, Input } from "ui"; // Componentes da UI (Input adicionado)
// <<< IMPORTAR A STORE AUXILIAR >>>
import { usePreNotaAuxStore } from "@inclusao/stores"; // Ajuste o caminho se necessário
import { EditableQuantityCell } from "./edit-qtd";

// --- Definição Final das Colunas ---
export const columns: ColumnDef<PreNotaItem>[] = [
  // --- Coluna de Ação (Vinculação) ---
  {
    id: "acao",
    header: "Vincular",
    size: 80,
    // Passa o item original (da store aux) para a célula de seleção
    cell: ({ row }) => <ProdutoSelectionCell xmlItem={row.original} />,
  },
  {
    header: "PC",
    accessorKey: "PC",
    size: 80,
    cell: ({ row }) => (row.original.PRODUTO ? row.original.PC || "-" : "-"),
  },
  // --- Produto Fornecedor (Info XML) ---
  {
    header: "Produto Fornecedor (XML)",
    size: 280,
    id: "xml_produto_fornecedor",
    cell: ({ row }) => (
      <div className="flex flex-col items-start text-left text-xs font-mono">
        <span className="text-muted-foreground">
          Item XML: {row.original.ITEM} - Cod: {row.original.PRODFOR || "-"}
        </span>
        <span>{row.original.DESCFOR || "Sem descrição XML"}</span>
      </div>
    ),
  },
  {
    header: "Produto (Protheus)",
    size: 280,
    id: "protheus_produto",
    cell: ({ row }) => {
      if (row.original.PRODUTO) {
        return (
          <div className="flex flex-col items-start text-left text-xs">
            <span className="text-muted-foreground">
              Item PC: {row.original.ITEMPC} - Cod: {row.original.PRODUTO}
            </span>
            <span className="font-medium">{row.original.B1_DESC ?? " "}</span>
          </div>
        );
      }
      return "-";
    },
  },
  // --- COLUNA UNIFICADA: Unidade de Medida ---
  {
    header: "UM",
    id: "unidade_medida_unificada",
    size: 60,
    cell: ({ row }) => {
      const item = row.original; // Item da store aux
      const isLinked = !!item.PRODUTO;
      // <<< SUBSTITUA 'UNIDADE_XML' PELO NOME CORRETO >>>
      const xmlUnit = item.UNIDADE_XML;
      const protheusUnit = item.B1_UM;
      return isLinked ? protheusUnit ?? "-" : xmlUnit ?? "-";
    },
  },
  {
    header: "Origem",
    accessorKey: "ORIGEM",
    size: 90,
    cell: ({ row }) =>
      row.original.PRODUTO ? row.original.ORIGEM || "-" : "-",
  },

  // --- COLUNA DE QUANTIDADE EDITÁVEL ---
  {
    header: "Quantidade",
    size: 90,
    id: "quantidade_editavel",
    cell: EditableQuantityCell, // <<< Usa o componente que lê/escreve na Store Auxiliar
  },
  // --- Valores (mantidos) ---
  {
    header: "Vlr. Unitário",
    accessorKey: "VALUNIT",
    size: 120,
    cell: (info) => formatCurrency(info.getValue() as number),
  },
  {
    header: "Vlr. Total",
    accessorKey: "TOTAL",
    size: 120,
    cell: (info) => formatCurrency(info.getValue() as number),
  },
];
