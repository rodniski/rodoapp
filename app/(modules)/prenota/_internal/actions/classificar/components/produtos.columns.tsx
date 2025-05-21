// src/features/classificar/produtos.columns.ts
import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { useNaturezaOptions, useTipoOperacaoOptions, type ProdutoClassificacao } from "@prenota/actions";
import { Combobox } from "ui";

export function useProdutosColumns(): ColumnDef<ProdutoClassificacao>[] {
  const naturezaOpts = useNaturezaOptions();
  const tipoOperOpts = useTipoOperacaoOptions();
  // memoiza só as definições das colunas
  return React.useMemo<ColumnDef<ProdutoClassificacao>[]>(
    () => [
      { header: "#", accessorKey: "ITEM", size: 48 },
      { header: "Código", accessorKey: "COD" },
      { header: "Descrição", accessorKey: "DESCRICAO", size: 260 },
      { header: "UM", accessorKey: "UM", size: 56 },
      { header: "Qtde", accessorKey: "QTDE", size: 70 },

      /* —— Natureza ————————————————————— */
      {
        header: "Natureza",
        accessorKey: "NATUREZA",
        size: 120,
        cell: ({ row }) => (
          <Combobox
            items={naturezaOpts}
            selectedValue={row.original.NATUREZA ?? null}
            onSelect={(v) => { row.original.NATUREZA = v ?? undefined; }}
            disabled={row.original._locked}
            placeholder="Selecione…"
            className="w-full"
          />
        ),
      },
      {
        header: "Tipo Op.",
        accessorKey: "TIPO_OP",
        size: 120,
        cell: ({ row }) => (
          <Combobox
            items={tipoOperOpts}
            selectedValue={row.original.TIPO_OP ?? null}
            onSelect={(v) => { row.original.TIPO_OP = v ?? undefined; }}
            disabled={row.original._locked}
            placeholder="Selecione…"
            className="w-full"
          />
        ),
      },

      /* —— Total ———————————————————— */
      {
        header: "Total",
        accessorKey: "TOTAL",
        size: 110,
        cell: (info) =>
          (info.getValue<number>() ?? 0).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          }),
      },
    ],
    [naturezaOpts, tipoOperOpts]
  );
}
