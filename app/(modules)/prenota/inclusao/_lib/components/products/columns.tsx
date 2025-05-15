// columns.tsx - Versão Final com Quantidade Editável via Store Auxiliar

import { ColumnDef } from "@tanstack/react-table";
import { ProdutoSelectionCell } from ".";
import { formatCurrency } from "utils";
import type { PreNotaItem } from "@inclusao/types";
import { EditableQuantityCell } from "./edit-qtd";

export const columns: ColumnDef<PreNotaItem>[] = [
  {
    id: "acao",
    header: "Vincular",
    size: 80,
    cell: ({ row }) =>
      row.original.PRODFOR ? (
        <ProdutoSelectionCell xmlItem={row.original} />
      ) : null,
  },
  {
    header: "PC",
    accessorKey: "PC",
    size: 80,
    cell: ({ row }) => (row.original.PRODUTO ? row.original.PC || "-" : "-"),
  },
  {
    header: "Produto Fornecedor (XML)",
    size: 280,
    id: "xml_produto_fornecedor",
    cell: ({ row }) =>
      row.original.PRODFOR ? (
        <div className="flex flex-col items-start text-left text-xs font-mono">
          <span className="text-muted-foreground">
            Item XML: {row.original.ITEM} - Cod: {row.original.PRODFOR || "-"}
          </span>
          <span>{row.original.DESCFOR || "Sem descrição XML"}</span>
        </div>
      ) : null,
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
  {
    header: "UM",
    id: "unidade_medida_unificada",
    size: 60,
    cell: ({ row }) => {
      const item = row.original;
      const isLinked = !!item.PRODUTO;
      const unidade = item.B1_UM;
      return unidade ?? "-";
    },
  },
  {
    header: "Origem",
    accessorKey: "ORIGEM",
    size: 90,
    cell: ({ row }) =>
      row.original.PRODUTO ? row.original.ORIGEM || "-" : "-",
  },
  {
    header: "Quantidade",
    size: 90,
    id: "quantidade_editavel",
    cell: EditableQuantityCell,
  },
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
