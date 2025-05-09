"use client";

import { FilialHoverCard, BadgeWithTooltip, PrenotaRow } from "@prenota/tabela";
import { ColumnDef } from "@tanstack/react-table";
import { cn, formatCurrency, formatDateForCell } from "utils";
import { Badge, DataTableColumnHeader } from "ui";
import { Actions } from "@prenota/actions";

/* presets --------------------------------------------------------------- */
import {
  getPriorityPreset,
  getStatusPreset,
  getVencimentoPreset,
} from "./configs";

/* ───────────────────────── definição das colunas ─────────────────────── */
export const columns: ColumnDef<PrenotaRow>[] = [
  /* FILIAL ---------------------------------------------------------------- */
  {
    accessorKey: "F1_FILIAL",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Filial" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <FilialHoverCard
          filialNumero={row.original.F1_FILIAL}
          observation={row.original.F1_XOBS}
        />
      </div>
    ),
    size: 80,
    minSize: 70,
  },

  /* TIPO + usuário -------------------------------------------------------- */
  {
    accessorKey: "F1_XTIPO",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-center justify-center capitalize text-xs uw:text-base">
        {row.original.F1_XTIPO}
        <div className="text-xs uw:text-base text-muted-foreground">
          {row.original.USUARIO}
        </div>
      </div>
    ),
    size: 120,
  },

  /* NOTA FISCAL ----------------------------------------------------------- */
  {
    accessorKey: "F1_DOC",
    id: "documento",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nota Fiscal" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-center">
        <span className="text-xs uw:text-base">{`${row.original.F1_DOC} / ${row.original.F1_SERIE}`}</span>
        <span className="text-muted-foreground text-xs uw:text-base">
          Emitido: {formatDateForCell(row.original.F1_EMISSAO)}
        </span>
      </div>
    ),
    size: 130,
  },

  /* FORNECEDOR ------------------------------------------------------------ */
  {
    accessorKey: "A2_NOME",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fornecedor" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-center text-center">
        <span className="whitespace-normal break-words leading-snug">
          {row.original.A2_NOME}
        </span>
        <span className="text-xs text-muted-foreground mt-0.5">
          Cod: {row.original.A2_COD}  –  Loja: {row.original.A2_LOJA}
        </span>
      </div>
    ),
    size: 300,
    minSize: 200,
  },

  /* INCLUSÃO -------------------------------------------------------------- */
  {
    accessorKey: "F1_DTDIGIT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inclusão" />
    ),
    cell: ({ getValue }) => (
      <div className="flex justify-center">
        {formatDateForCell(getValue() as string)}
      </div>
    ),
    size: 120,
  },

  /* VENCIMENTO (preset dinâmico) ----------------------------------------- */
  {
    accessorKey: "VENCIMENTO",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vencimento" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <BadgeWithTooltip preset={getVencimentoPreset(row.original.VENCIMENTO)} />
      </div>
    ),
    size: 110,
  },

  /* VALOR BRUTO ----------------------------------------------------------- */
  {
    accessorKey: "F1_VALBRUT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor (R$)" />
    ),
    cell: ({ getValue }) => (
      <div className="flex justify-center text-xs uw:text-base">
        {formatCurrency(getValue() as number)}
      </div>
    ),
    size: 120,
  },

  /* PRIORIDADE ------------------------------------------------------------ */
  {
    accessorKey: "F1_XPRIOR",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <BadgeWithTooltip preset={getPriorityPreset(row.original.F1_XPRIOR.trim())} />
      </div>
    ),
    size: 100,
  },

  /* STATUS ---------------------------------------------------------------- */
  {
    accessorKey: "Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="flex justify-center">
        <BadgeWithTooltip preset={getStatusPreset(row.original.Status.trim())} />
      </div>
    ),
    size: 100,
  },

  /* AÇÕES ----------------------------------------------------------------- */
  {
    id: "actions",
    header: () => <span className="flex justify-center">Ações</span>,
    cell: ({ row }) => (
      <div className="flex justify-center">
        <Actions preNota={row.original} />
      </div>
    ),
    size: 90,
    minSize: 80,
    maxSize: 100,
  },
];