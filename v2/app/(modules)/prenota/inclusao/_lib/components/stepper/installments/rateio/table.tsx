// _lib/components/stepper/header/RateioTable.tsx (Versão Simplificada ATUALIZADA com Z10_*)
"use client";

import React, { useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  ScrollArea,
} from "ui";
import { NumericFormat } from "react-number-format";
import { Trash2 } from "lucide-react";
import { useAuxStore as useLoginAuxStore } from "@login/stores";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
// Importa o tipo Rateio ATUALIZADO
import type {
  Rateio as RateioType,
} from "@inclusao/types";

// Funções de formatação
const formatCurrency = (value: number): string =>
  (value ?? 0).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const formatPercent = (value: number): string => `${(value ?? 0).toFixed(2)}%`;

interface RateioTableProps {
  // Props podem não ser mais necessárias se tudo vier do store/contexto
}

export function RateioTable({}: RateioTableProps) {
  // Stores
  const filiais = useLoginAuxStore((state) => state.filiais);
  const centroCusto = useLoginAuxStore((state) => state.centroCusto);
  const rateios = usePreNotaStore((state) => state.draft.rateios);
  const updateRateio = usePreNotaStore((state) => state.updateRateio);
  const removeRateio = usePreNotaStore((state) => state.removeRateio);
  const totalGeralXml = useValorTotalXml();

  const totalGeral = useMemo(() => totalGeralXml ?? 0, [totalGeralXml]);

  // Cálculos de Totais (usando Z10_VALOR)
  const totalDivisao = useMemo(
    () => rateios.reduce((acc, row) => acc + (row.Z10_VALOR || 0), 0), // <<< USA Z10_VALOR
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

  // Handler para mudanças nas linhas existentes (usando Z10_*)
  const handleChange = useCallback(
    (
      id: string, // ID da linha existente (deve vir do store ou ser gerado)
      field: "Z10_FILRAT" | "Z10_CC" | "Z10_VALOR" | "Z10_PERC", // <<< Campos Atualizados
      value: string | number
    ) => {
      const existingRateio = rateios.find((r) => r.id === id); // Assume que rateios do store tem 'id'
      if (!existingRateio) return;

      let finalUpdates: Partial<RateioType> = {};

      if (field === "Z10_FILRAT") {
        finalUpdates = { Z10_FILRAT: value as string };
      } else if (field === "Z10_CC") {
        finalUpdates = { Z10_CC: value as string };
      } else if (field === "Z10_VALOR") {
        const numericValue = typeof value === "number" ? value : 0;
        // Validação de edição inline (simplificada)
        const outrosValores = rateios
          .filter((r) => r.Z10_ITEM !== id)
          .reduce((sum, r) => sum + (r.Z10_VALOR || 0), 0);
        const maxEditValor = Math.max(
          0,
          parseFloat((totalGeral - outrosValores).toFixed(2))
        );
        const cappedValor = Math.min(numericValue, maxEditValor + 0.001);

        const percentAtualizado =
          totalGeral > 0
            ? parseFloat(((cappedValor / totalGeral) * 100).toFixed(2))
            : 0;
        // <<< Atualiza Z10_VALOR e Z10_PERC
        finalUpdates = {
          Z10_VALOR: parseFloat(cappedValor.toFixed(2)),
          Z10_PERC: percentAtualizado,
        };
      } else if (field === "Z10_PERC") {
        const numericPercent = typeof value === "number" ? value : 0;
        const cappedPercent = Math.min(numericPercent, 100);
        const valorCalculado = parseFloat(
          ((cappedPercent / 100) * totalGeral).toFixed(2)
        );

        // Validação de edição inline (simplificada)
        const outrosValores = rateios
          .filter((r) => r.Z10_ITEM !== id)
          .reduce((sum, r) => sum + (r.Z10_VALOR || 0), 0);
        const maxEditValor = Math.max(
          0,
          parseFloat((totalGeral - outrosValores).toFixed(2))
        );

        if (valorCalculado > maxEditValor + 0.001) {
          console.warn("Percentual excede valor restante ao editar.");
          return;
        }
        // <<< Atualiza Z10_PERC e Z10_VALOR
        finalUpdates = {
          Z10_PERC: parseFloat(cappedPercent.toFixed(2)),
          Z10_VALOR: valorCalculado,
        };
      }

      if (id && Object.keys(finalUpdates).length > 0) {
        // Garante que ID existe
        updateRateio(id, finalUpdates);
      }
    },
    [rateios, updateRateio, totalGeral]
  );

  // Handler para remoção (direto ao store)
  const handleRemove = useCallback(
    (id: string) => {
      if (id) removeRateio(id); // Garante que ID existe
    },
    [removeRateio]
  );

  return (
    <div className="flex flex-col border rounded bg-input/30 overflow-hidden h-full">
      <ScrollArea className="flex-1 relative">
        <Table className="border-b">
          <TableHeader className="py-2 bg-background sticky top-0 z-10">
            <TableRow>
              <TableHead className="px-2" style={{ width: "200px" }}>
                Filial
              </TableHead>
              <TableHead className="px-2" style={{ width: "250px" }}>
                Centro de Custo
              </TableHead>
              <TableHead className="px-2 text-right" style={{ width: "150px" }}>
                Valor (R$)
              </TableHead>
              <TableHead className="px-2 text-right" style={{ width: "150px" }}>
                Porcentagem (%)
              </TableHead>
              <TableHead className="px-2 text-center" style={{ width: "80px" }}>
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Renderiza apenas os rateios existentes do store */}
            {rateios.map((row) => (
              // <<< Usa ID ou Z10_ITEM como chave
              <TableRow key={row.Z10_ITEM}>
                {/* Célula Filial */}
                <TableCell className="px-2 py-1">
                  <Select
                    // <<< Usa Z10_FILRAT
                    value={row.Z10_FILRAT || ""}
                    // <<< Passa Z10_FILRAT para o handler
                    onValueChange={(val) =>
                      handleChange(row.Z10_ITEM!, "Z10_FILRAT", val)
                    }
                  >
                    <SelectTrigger className="text-xs h-8">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {filiais.map((f) => (
                        // <<< Usa M0_CODFIL ou numero como value
                        <SelectItem
                          key={f.numero}
                          value={f.numero}
                          className="text-xs"
                        >
                          {/* <<< Usa numero e filial para label */}
                          {f.numero} - {f.filial}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                {/* Célula Centro de Custo */}
                <TableCell className="px-2 py-1">
                  <Select
                    // <<< Usa Z10_CC
                    value={row.Z10_CC || ""}
                    // <<< Passa Z10_CC para o handler
                    onValueChange={(val) =>
                      handleChange(row.id!, "Z10_CC", val)
                    }
                  >
                    <SelectTrigger className="text-xs h-8">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {centroCusto.map((cc) => (
                        // <<< Usa CTT_CUSTO como value e key
                        <SelectItem
                          key={cc.CTT_CUSTO}
                          value={cc.CTT_CUSTO}
                          className="text-xs"
                        >
                          {/* <<< Usa CTT_CUSTO e CTT_DESC01 para label */}
                          {cc.CTT_CUSTO} - {cc.CTT_DESC01}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                {/* Célula Valor */}
                <TableCell className="px-2 py-1 text-right">
                  <NumericFormat
                    // <<< Usa Z10_VALOR
                    value={row.Z10_VALOR ?? 0}
                    // <<< Passa Z10_VALOR para o handler
                    onValueChange={(values) =>
                      handleChange(row.Z10_ITEM!, "Z10_VALOR", values.floatValue ?? 0)
                    }
                    decimalScale={2}
                    allowNegative={false}
                    thousandSeparator="."
                    decimalSeparator=","
                    prefix="R$ "
                    className="text-right text-xs h-8 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="R$ 0,00"
                    disabled={totalGeral <= 0}
                  />
                </TableCell>
                {/* Célula Percentual */}
                <TableCell className="px-2 py-1 text-right">
                  <NumericFormat
                    // <<< Usa Z10_PERC
                    value={row.Z10_PERC ?? 0}
                    onValueChange={(values) => {
                      const limitedPercent = Math.min(
                        values.floatValue ?? 0,
                        100
                      );
                      // <<< Passa Z10_PERC para o handler
                      handleChange(row.Z10_ITEM!, "Z10_PERC", limitedPercent);
                    }}
                    decimalScale={2}
                    allowNegative={false}
                    thousandSeparator="."
                    decimalSeparator=","
                    suffix=" %"
                    className="text-right text-xs h-8 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="0,00 %"
                    disabled={totalGeral <= 0}
                  />
                </TableCell>
                {/* Célula Ações */}
                <TableCell className="px-2 py-1 text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleRemove(row.Z10_ITEM!)} // Usa ID (assumindo que existe)
                    aria-label="Remover rateio"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* Footer (usando totais calculados com Z10_VALOR) */}
      {(rateios.length > 0 || totalGeral > 0) && (
        <div className="flex flex-wrap justify-between border-t p-2 px-4 text-sm bg-background gap-x-4 gap-y-1">
          <div className="flex gap-4">
            <div className="flex flex-col items-start">
              <span>Total NF:</span>
              <span className="font-medium">{formatCurrency(totalGeral)}</span>
            </div>
            <div className="flex flex-col items-start">
              <span>Rateado:</span>
              <span className="font-medium">
                {formatCurrency(totalDivisao)} (
                {formatPercent(porcentagemDivisao)})
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span>Restante:</span>
            <span
              className={`font-medium ${
                totalRestante < 0.01 ? "text-green-600" : ""
              }`}
            >
              {formatCurrency(totalRestante)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
