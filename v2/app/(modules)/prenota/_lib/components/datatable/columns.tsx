"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  FilialHoverCard,
  PriorityBadge,
  VencimentoBadge,
  StatusBadge,
  Actions,
} from "@prenota/components";
import { DataTableColumnHeader } from "ui/data-table";
import { formatCurrency, formatDateForCell } from "utils";
import { PrenotaRow } from "@prenota/types";
import AnexoDownload from "./columns/anexoDownload";

const NotaFiscalCell = ({ data }: { data: any }) => (
  <div className="flex flex-col">
    <span className="text-xs uw:text-base">{`${data.F1_DOC || "-"} / ${
      data.F1_SERIE || "-"
    }`}</span>
    <span className="text-muted-foreground text-xs uw:text-base">
      Emitido: {formatDateForCell(data.F1_EMISSAO)}
    </span>
  </div>
);

export const columns: ColumnDef<PrenotaRow>[] = [
  {
    accessorKey: "F1_FILIAL",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Filial" />
    ),
    cell: ({ row }) => (
      <FilialHoverCard
        filialNumero={row.original.F1_FILIAL}
        observation={row.original.F1_XOBS}
      />
    ),
  },
  {
    accessorKey: "F1_XTIPO",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => (
      <div className="capitalize text-xs uw:text-base">
        {row.original.F1_XTIPO}
        <div className="text-xs uw:text-base text-muted-foreground">
          {row.original.F1_XUSRRA}
        </div>
      </div>
    ),
  },
  {
    id: "documento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nota Fiscal" />
    ),
    cell: ({ row }) => <NotaFiscalCell data={row.original} />,
  },
  {
    accessorKey: "A2_NOME",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fornecedor" />
    ),
    cell: ({ row }) => (
      <div className="capitalize text-xs qhd:text-base break-words inline-block max-w-[300px] qhd:max-w-[350px] whitespace-normal">
        {row.original.A2_NOME}
        <div className="text-xs qhd:text-base text-muted-foreground">
          {row.original.A2_COD} - {row.original.A2_LOJA}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "F1_DTDIGIT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inclusão" />
    ),
    cell: ({ getValue }) => formatDateForCell(getValue() as string),
  },
  {
    accessorKey: "VENCIMENTO",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vencimento" />
    ),
    cell: ({ row }) => <VencimentoBadge vencimento={row.original.VENCIMENTO} />,
  },
  {
    accessorKey: "F1_VALBRUT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor (R$)" />
    ),
    cell: ({ getValue }) => (
      <span className="text-xs uw:text-base block">
        {formatCurrency(getValue() as number)}
      </span>
    ),
  },

  {
    accessorKey: "F1_XPRIOR",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }) => <PriorityBadge priority={row.original.F1_XPRIOR} />,
  },
  {
    accessorKey: "Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusBadge prenota={row.original} />,
  },
  {
    accessorKey: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Actions preNota={row.original} />
      </div>
    ),
  },
];
