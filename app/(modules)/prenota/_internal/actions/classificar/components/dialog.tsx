/* app/(prenota)/classificar/ClassificarDialog.tsx ------------------*/
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  Button,
  Field,
  DataTable,
} from "ui";
import { PrenotaRow } from "@prenota/tabela";
import { formatDateForCell as fmtDate } from "utils";

import { applyCombustivelDefaults, useClassificacaoOptions, useProdutosPrenota } from "@prenota/actions";
import {
  useProdutosColumns,
  type ProdutoClassificacao,
} from "@prenota/actions";

/* --------------------------------------------------------------- */
interface Props {
  row: PrenotaRow;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ClassificarDialog({ row, isOpen, onOpenChange }: Props) {
  /* 1. Itens da pré-nota ------------------------------------------- */
  const {
    data: itens,
    isLoading: isLoadingItens,
    isError: isErroItens,
  } = useProdutosPrenota(row.REC, { enabled: isOpen });

  /* 2. Metadados (naturezas + tipos de operação) -------------------- */
  const {
    data: meta,
    isLoading: isLoadingMeta,
    isError: isErroMeta,
  } = useClassificacaoOptions({ enabled: isOpen });

  /* 3. Colunas com Combobox embutido (HOOK NO TOPO!) ---------------- */
  const columns = useProdutosColumns();

  /* 4. Dados da tabela (adiciona campos editáveis) ------------------ */
  const data = React.useMemo(() => {
    const base = (itens ?? []) as ProdutoClassificacao[];
    return applyCombustivelDefaults(base); // ⬅️  aplique aqui
  }, [itens]);

  /* --------------------------------------------------------------- */
  const isLoading = isLoadingItens || isLoadingMeta;
  const isError = isErroItens || isErroMeta;
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="flex flex-col min-w-[80vw] bg-card">
        <DialogHeader>
          <DialogTitle>Classificar Pré-Nota • REC {row.REC}</DialogTitle>
        </DialogHeader>

        {/* —— Resumo da NF ——————————————————————————— */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-lg border">
          <Field label="Documento" value={`${row.F1_DOC}/${row.F1_SERIE}`} />
          <Field label="Filial" value={row.F1_FILIAL} />
          <Field label="Emissão" value={fmtDate(row.F1_EMISSAO)} />
          <Field
            label="Valor Bruto"
            value={row.F1_VALBRUT.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          />
          <Field
            label="Fornecedor"
            value={`${row.A2_COD}-${row.A2_LOJA} • ${row.A2_NOME}`}
            className="sm:col-span-2"
          />
        </section>

        {/* —— Tabela de Itens ———————————————————— */}
        <section className="mt-6 flex-1 flex flex-col">
          <h4 className="font-semibold text-sm mb-2">Itens da Pré-Nota</h4>

          {isError ? (
            <p className="text-destructive">Erro ao carregar dados.</p>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              isLoading={isLoading}
              className="rounded-lg flex-1"
            />
          )}
        </section>

        <DialogFooter className="pt-6">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button disabled>Classificar Pré-Nota</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
