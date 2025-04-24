"use client";

import React, { useMemo } from "react";
// Imports do TanStack Table e DataTable
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "ui/data-table"; // Assumindo que DataTable está em ui/data-table
// Imports de UI para células e footer
import {
  Input,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  ScrollArea,
} from "ui";
import { Trash2 } from "lucide-react";
// Stores e Seletores
import { useAuxStore as useLoginAuxStore } from "@login/stores";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
// Tipos
import type { Rateio as RateioType } from "@inclusao/types";
import type { FilialGeral, CentroCusto } from "@login/types";
import { cn } from "utils"; // Ou lib/utils

// Props (mantido)
interface RateioTableProps {
  totalNf?: number | null;
}

// Função de formatação (fora do componente para referência estável)
const formatCurrency = (value: number) =>
  (value ?? 0).toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const formatPercent = (value: number) => (value ?? 0).toFixed(2);

export function RateioTable({ totalNf }: RateioTableProps) {
  // --- Stores ---
  const filiais = useLoginAuxStore((state) => state.filiais);
  const centroCusto = useLoginAuxStore((state) => state.centroCusto);
  const rateios = usePreNotaStore((state) => state.draft.rateios);
  const updateRateio = usePreNotaStore((state) => state.updateRateio);
  const removeRateio = usePreNotaStore((state) => state.removeRateio);
  const totalGeralXml = useValorTotalXml();

  // --- Cálculos (movidos para useMemo para melhor performance se necessário) ---
  const totalGeral = useMemo(
    () => totalNf ?? totalGeralXml ?? 0,
    [totalNf, totalGeralXml]
  );
  const totalDivisao = useMemo(
    () =>
      rateios.reduce(
        (acc: number, row: RateioType) => acc + (row.valor || 0),
        0
      ),
    [rateios]
  );
  const porcentagemDivisao = useMemo(
    () =>
      totalGeral > 0
        ? parseFloat(((totalDivisao / totalGeral) * 100).toFixed(2))
        : 0,
    [totalGeral, totalDivisao]
  );
  const totalRestante = useMemo(
    () => Math.max(0, parseFloat((totalGeral - totalDivisao).toFixed(2))),
    [totalGeral, totalDivisao]
  );

  // --- Handler para Mudança de Valor/Percentual na Tabela ---
  // Definido aqui para ser acessível pelas definições de coluna
  const handleTableValueChange = (
    id: string,
    field: "valor" | "percent",
    rawValue: string
  ) => {
    const numeric =
      parseFloat(rawValue.replace(/[^0-9,.-]/g, "").replace(",", ".")) || 0;
    let valorAtualizado: number;
    let percentAtualizado: number;

    if (field === "valor") {
      valorAtualizado = numeric;
      percentAtualizado =
        totalGeral > 0
          ? parseFloat(((valorAtualizado / totalGeral) * 100).toFixed(2))
          : 0;
    } else {
      // field === "percent"
      percentAtualizado = numeric;
      valorAtualizado =
        totalGeral > 0
          ? parseFloat(((percentAtualizado / 100) * totalGeral).toFixed(2))
          : 0;
    }

    // TODO: Validar soma total antes de atualizar?
    if (updateRateio) {
      updateRateio(id, { valor: valorAtualizado, percent: percentAtualizado });
    } else {
      console.error("Ação updateRateio não encontrada!");
    }
  };

  // --- Definição das Colunas para TanStack Table ---
  // Usamos useMemo para evitar recriar as colunas a cada renderização
  const columns = useMemo(
    (): ColumnDef<RateioType>[] => [
      {
        accessorKey: "FIL", // ou 'filial' se for esse o campo principal
        header: "Filial",
        cell: ({ row }) => {
          const rateio = row.original;
          return (
            <Select
              value={rateio.FIL} // Valor atual da linha
              onValueChange={(val) => {
                if (updateRateio)
                  updateRateio(rateio.id, { FIL: val, filial: val }); // Atualiza no store
              }}
            >
              <SelectTrigger className="text-xs h-8 w-[180px]">
                {" "}
                {/* Ajustar largura */}
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {filiais.map((f: FilialGeral) => (
                  // AJUSTE: nomes numero, filial/nomeFilial
                  <SelectItem
                    key={f.numero}
                    value={f.numero}
                    className="text-xs"
                  >
                    {f.numero} - {f.filial}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
        size: 200, // Exemplo de definição de tamanho (verificar se DataTable usa)
      },
      {
        accessorKey: "cc",
        header: "Centro de Custo",
        cell: ({ row }) => {
          const rateio = row.original;
          return (
            <Select
              value={rateio.cc}
              onValueChange={(val) => {
                if (updateRateio) updateRateio(rateio.id, { cc: val });
              }}
            >
              <SelectTrigger className="text-xs h-8 w-[230px]">
                {" "}
                {/* Ajustar largura */}
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {/* AJUSTE: nomes CTT_CUSTO, CTT_DESC01 */}
                {centroCusto.map((cc: CentroCusto) => (
                  <SelectItem
                    key={cc.CTT_CUSTO}
                    value={cc.CTT_CUSTO}
                    className="text-xs"
                  >
                    {cc.CTT_CUSTO} - {cc.CTT_DESC01}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
        size: 250,
      },
      {
        accessorKey: "valor",
        header: () => <div className="text-right">Valor (R$)</div>, // Header alinhado
        cell: ({ row }) => {
          const rateio = row.original;
          return (
            <Input
              type="text"
              value={formatCurrency(rateio.valor)}
              onChange={(e) =>
                handleTableValueChange(rateio.id, "valor", e.target.value)
              }
              className="text-right text-xs h-8"
            />
          );
        },
        size: 150,
        meta: {
          // Exemplo se precisar de meta para alinhamento ou tipo
          align: "right",
        },
      },
      {
        accessorKey: "percent",
        header: () => <div className="text-right">Porcentagem (%)</div>, // Header alinhado
        cell: ({ row }) => {
          const rateio = row.original;
          return (
            <Input
              type="text"
              value={`${formatPercent(rateio.percent)}%`}
              onChange={(e) =>
                handleTableValueChange(
                  rateio.id,
                  "percent",
                  e.target.value.replace("%", "")
                )
              }
              className="text-right text-xs h-8"
            />
          );
        },
        size: 150,
        meta: {
          align: "right",
        },
      },
      {
        id: "actions", // ID único para a coluna de ações
        header: () => <div className="text-center">Ações</div>, // Header alinhado
        cell: ({ row }) => {
          const rateio = row.original;
          return (
            <div className="flex justify-center">
              {" "}
              {/* Centraliza botão */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  if (removeRateio) removeRateio(rateio.id);
                }} // Chama removeRateio
                aria-label="Remover rateio"
              >
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          );
        },
        size: 80,
        meta: {
          align: "center",
        },
      },
    ],
    [filiais, centroCusto, updateRateio, removeRateio, totalGeral]
  ); // Dependências para recriar colunas

  return (
    // Usa o componente DataTable, passando colunas e dados
    <ScrollArea className="max-h-[500px] overflow-auto">
      <DataTable
        columns={columns}
        data={rateios} // Os dados vêm do store principal
        isLoading={false} // Defina como true se houver carregamento assíncrono dos rateios
        enableSorting={false} // Habilitar ordenação? (Provavelmente não necessário aqui)
        // className="max-h-[400px]" // Limitar altura se necessário
      >
        {(rateios.length > 0 || totalGeral > 0) && (
          <div className="p-2 text-sm border-t bg-muted/30 w-full">
            <div className="flex justify-between items-center divide-x divide-border">
              <div className="flex w-1/2 justify-evenly">
                <div className="px-4 py-1.5 font-medium text-right flex flex-col">
                  <span>Total Geral NF:</span>
                  {formatCurrency(totalGeral)}
                </div>
                <div className="px-4 py-1.5 font-medium text-right flex flex-col">
                  <span>Valor Restante:</span>
                  <span
                    className={`${
                      totalRestante > 0.005
                        ? "text-destructive"
                        : "text-green-600"
                    }`}
                  >
                    {formatCurrency(totalRestante)}
                  </span>
                </div>
              </div>
              <div className="flex w-1/2 justify-evenly">
                <div className="px-4 py-1.5 font-medium text-right flex flex-col">
                  <span>Totais Rateados:</span>
                  {formatCurrency(totalDivisao)}
                </div>
                <div className="px-4 py-1.5 font-medium text-right flex flex-col">
                  <span>Porcentagem Rateados:</span>
                  <span
                    className={`${
                      totalRestante > 0.005
                        ? "text-destructive"
                        : "text-green-600"
                    }`}
                  >
                    {formatPercent(porcentagemDivisao)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </DataTable>
    </ScrollArea>
  );
}
