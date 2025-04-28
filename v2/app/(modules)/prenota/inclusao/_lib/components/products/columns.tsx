// columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { ProdutoCombobox } from ".";
import { formatCurrency } from "utils";
import { PreNotaItem } from "@inclusao/types";

export const xmlColumns: ColumnDef<PreNotaItem, unknown>[] = [
  {
    header: "Dados da XML",
    columns: [
      {
        header: "Produto (XML)",
        cell: ({ row }) => {
          const { ITEM, PRODFOR, DESCFOR } = row.original;
          return (
            <div className="flex flex-col items-start text-start">
              <span className="text-xs">
                Item: <strong>{ITEM}</strong> - Cod: <strong>{PRODFOR || "-"}</strong>
              </span>
              <strong className="text-sm">{DESCFOR}</strong>
            </div>
          );
        },
      },
      {
        accessorKey: "ORIGEMXML",
        header: "Origem XML",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "VALUNIT",
        header: "Vlr Unit (XML)",
        cell: (info) => formatCurrency(info.getValue()),
      },
      {
        accessorKey: "TOTAL",
        header: "Total (XML)",
        cell: (info) => formatCurrency(info.getValue()),
      },
    ],
  },
  {
    header: "Dados do Pedido",
    columns: [
      {
        accessorKey: "PRODUTO",
        header: "Produto",
        cell: ({ row }) => (
          <ProdutoCombobox
          xmlItem={row.original}
          />
        ),
      },
      {
      accessorKey: "QUANTIDADE",
        header: "Quantidade",
      },
      {
        accessorKey: "ORIGEM",
        header: "Origem",
        cell: ({ getValue }) => getValue() || "-",
      },
      {
        accessorKey: "B1_UM",
        header: "U.Medida",
        cell: ({ row }) => {
          const { B1_UM } = row.original;
          return <span className="text-sm">{`${B1_UM}`}</span>;
        },
      },
    ],
  },
];
