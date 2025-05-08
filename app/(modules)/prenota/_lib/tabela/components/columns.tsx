"use client";

import { formatCurrency, formatDateForCell } from "utils";
import { DataTableColumnHeader } from "ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { Actions } from "@prenota/actions";
import {
  FilialHoverCard,
  PriorityBadge,
  VencimentoBadge,
  StatusBadge,
  PrenotaRow,
} from "@prenota/tabela";

// --- Definição das Colunas com TAMANHOS ---
export const columns: ColumnDef<PrenotaRow>[] = [
  {
    accessorKey: "F1_FILIAL",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Filial" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <FilialHoverCard
          filialNumero={row.original.F1_FILIAL}
          observation={row.original.F1_XOBS}
        />
      </div>
    ),
    size: 80, // Largura menor para filial (ex: 80px)
    minSize: 70, // Não menor que 70px
  },
  {
    accessorKey: "F1_XTIPO",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tipo" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col items-center justify-center capitalize text-xs uw:text-base">
        {row.original.F1_XTIPO}
        <div className="text-xs uw:text-base text-muted-foreground">
          {row.original.USUARIO /* Mapeado de F1_XUSRRA */}
        </div>
      </div>
    ),
    size: 120, // Um pouco maior para tipo + usuário
  },
  {
    // Usar accessorKey ajuda TanStack Table a associar tamanho, mesmo com ID customizado
    accessorKey: "F1_DOC", // Pode usar um accessor relevante
    id: "documento", // Mantém ID customizado se precisar
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nota Fiscal" />
    ),
    cell: ({ row }) => (
      <div className="flex flex-col justify-center items-center">
        <span className="text-xs uw:text-base">{`${
          row.original.F1_DOC || "-"
        } / ${row.original.F1_SERIE || "-"}`}</span>
        <span className="text-muted-foreground text-xs uw:text-base">
          Emitido: {formatDateForCell(row.original.F1_EMISSAO)}
        </span>
      </div>
    ),
    size: 130, // Tamanho para Doc/Serie + Data
  },
  {
    accessorKey: "A2_NOME",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Fornecedor" />
    ),
    cell: ({ row }) => (
      // Mantém o max-w aqui como um fallback, mas o size da coluna vai ditar
      <div className="flex flex-col items-center text-center justify-center capitalize text-xs qhd:text-base break-words w-full whitespace-normal">
        {row.original.A2_NOME}
        <div className="text-xs qhd:text-base text-muted-foreground">
          Cod: {row.original.A2_COD} - Loja: {row.original.A2_LOJA}
        </div>
      </div>
    ),
    size: 300, // Larga para o nome do fornecedor
    minSize: 200, // Tamanho mínimo
  },
  {
    accessorKey: "F1_DTDIGIT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Inclusão" />
    ),
    cell: ({ getValue }) => (
      <div className="flex items-center justify-center">
        {formatDateForCell(getValue() as string)}
      </div>
    ),
    size: 120, // Tamanho para data
  },
  {
    accessorKey: "VENCIMENTO",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Vencimento" />
    ),
    cell: ({ row }) => <VencimentoBadge vencimento={row.original.VENCIMENTO} />,
    size: 110,
  },
  {
    accessorKey: "F1_VALBRUT",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Valor (R$)" />
    ),
    cell: ({ getValue }) => (
      <div className="flex items-center justify-center text-xs uw:text-base">
        {formatCurrency(getValue() as number)}
      </div>
    ),
    size: 120,
  },
  {
    accessorKey: "F1_XPRIOR",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Prioridade" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <PriorityBadge priority={row.original.F1_XPRIOR} />
      </div>
    ),
    size: 100,
  },
  {
    accessorKey: "Status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <StatusBadge prenota={row.original} />
      </div>
    ),
    size: 100,
  },
  {
    id: "actions",
    header: ({ column }) => (
      <span className="flex items-center justify-center">Ações</span>
    ),
    cell: ({ row }) => (
      <div className="flex items-center gap-1 justify-center">
        <Actions preNota={row.original} />
      </div>
    ),
    size: 90,
    minSize: 80,
    maxSize: 100,
  },
];
