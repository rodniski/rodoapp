"use client";

import { ColumnDef } from "@tanstack/react-table";

import {
  FilialHoverCard,
  PriorityBadge,
  VencimentoBadge,
  StatusBadge,
} from "@prenota/components";
import { DataTableColumnHeader } from "ui/data-table";
import { formatCurrency } from "utils";
import { PrenotaRow } from "../types";

const formatDateForCell = (dateString: string | undefined | null): string => {
  if (!dateString || dateString.length !== 8 || !/^\d{8}$/.test(dateString)) {
    return "-";
  }
  const year = dateString.substring(0, 4);
  const month = dateString.substring(4, 6);
  const day = dateString.substring(6, 8);
  return `${day}/${month}/${year}`;
};

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
        username={row.original.USUARIO}
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
    id: "derivedStatus",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => <StatusBadge prenota={row.original} />,
  },
];
