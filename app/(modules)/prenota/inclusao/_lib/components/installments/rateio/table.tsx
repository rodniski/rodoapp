"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  ScrollArea,
} from "ui";
import { NumericFormat, type NumberFormatValues } from "react-number-format";
import { Trash2, Save } from "lucide-react";
import { useAuxStore as useLoginAuxStore } from "@/app/login/_lib/stores";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
import type { Rateio as RateioType } from "@inclusao/types";
import { Combobox, ComboboxItem } from "ui";
import { formatCurrency } from "utils";
import { toast } from "sonner";

const formatPercent = (value: number): string => `${(value ?? 0).toFixed(2)}%`;

interface RateioTableProps {}

export function RateioTable({}: RateioTableProps) {
  const filiais = useLoginAuxStore((state) => state.filiais);
  const centroCusto = useLoginAuxStore((state) => state.centroCusto);
  const storeRateios = usePreNotaStore((state) => state.draft.RATEIOS);
  const updateRateio = usePreNotaStore((state) => state.updateRateio);
  const removeRateio = usePreNotaStore((state) => state.removeRateio);
  const totalGeralXml = useValorTotalXml();

  const [editingRateios, setEditingRateios] = useState<RateioType[]>([]);
  const [dirtyRows, setDirtyRows] = useState<Set<string>>(new Set());

  const getRateioId = useCallback((rateio: RateioType): string => {
    if (typeof rateio.id !== "string" || !rateio.id) {
      console.warn("Rateio sem 'id' válido encontrado, usando fallback:", rateio);
      return `fallback_${rateio.seq || Math.random().toString(36).substring(2)}`;
    }
    return rateio.id;
  }, []);

  const storeRateiosMap = useMemo(() => {
    const map = new Map<string, RateioType>();
    (storeRateios || []).forEach((item) => {
      const id = getRateioId(item);
      map.set(id, item);
    });
    return map;
  }, [storeRateios, getRateioId]);

  useEffect(() => {
    setEditingRateios(structuredClone(storeRateios || []));
    setDirtyRows(new Set());
  }, [storeRateios]);

  const totalGeral = useMemo(() => totalGeralXml ?? 0, [totalGeralXml]);

  const totalDivisaoSalvaNoStore = useMemo(
    () => (storeRateios || []).reduce((acc, row) => acc + (row.valor || 0), 0),
    [storeRateios]
  );
  const porcentagemDivisaoSalvaNoStore = useMemo(
    () =>
      totalGeral > 0
        ? parseFloat(((totalDivisaoSalvaNoStore / totalGeral) * 100).toFixed(2))
        : 0,
    [totalGeral, totalDivisaoSalvaNoStore]
  );
  const totalRestanteGlobal = useMemo(
    () => Math.max(0, parseFloat((totalGeral - totalDivisaoSalvaNoStore).toFixed(2))),
    [totalGeral, totalDivisaoSalvaNoStore]
  );

  const filialItems: ComboboxItem[] = useMemo(
    () =>
      filiais.map((f) => ({
        value: f.numero ?? "",
        label: `${f.numero ?? "??"} - ${f.filial ?? "Nome Indisponível"}`,
      })),
    [filiais]
  );

  const centroCustoItems: ComboboxItem[] = useMemo(
    () =>
      centroCusto.map((c) => ({
        value: c.CTT_CUSTO ?? "",
        label: `${c.CTT_CUSTO ?? "??"} - ${
          c.CTT_DESC01 ?? "Descrição Indisponível"
        }`,
      })),
    [centroCusto]
  );

  const handleLocalChange = useCallback(
    (
      id: string,
      field: "FIL" | "cc" | "valor" | "percent",
      value: string | number | null // Agora aceita null
    ) => {
      setEditingRateios((currentEditingRateios) => {
        const index = currentEditingRateios.findIndex((r) => getRateioId(r) === id);
        if (index === -1) return currentEditingRateios;

        const rateiosEditados = [...currentEditingRateios];
        const rateioParaAtualizar = { ...rateiosEditados[index] };
        let atualizacoesFinais: Partial<RateioType> = {};

        const rateioOriginalDoStore = storeRateiosMap.get(id);
        const valorOriginalNoStore = rateioOriginalDoStore?.valor ?? 0;

        if (field === "FIL" || field === "cc") {
          atualizacoesFinais = { [field]: (value as string | null) ?? "" };
        } else if (field === "valor") {
          // Se value for null (vindo do NumericFormat quando undefined), trata como 0
          let valorNumerico = typeof value === "number" ? parseFloat(value.toFixed(2)) : 0;
          valorNumerico = Math.max(0, valorNumerico);

          const percentualCalculado = totalGeral > 0 ? parseFloat(((valorNumerico / totalGeral) * 100).toFixed(2)) : 0;
          atualizacoesFinais = {
            valor: valorNumerico,
            percent: Math.min(100, Math.max(0, percentualCalculado)),
          };
        } else if (field === "percent") {
          let percentualNumerico = typeof value === "number" ? parseFloat(value.toFixed(2)) : 0;
          percentualNumerico = Math.min(100, Math.max(0, percentualNumerico));

          let valorCalculado = parseFloat(((percentualNumerico / 100) * totalGeral).toFixed(2));
          const maxValorParaEsteItemComBaseNoPercentual = parseFloat((valorOriginalNoStore + totalRestanteGlobal).toFixed(2));
          valorCalculado = Math.min(valorCalculado, maxValorParaEsteItemComBaseNoPercentual);
          valorCalculado = Math.max(0, valorCalculado);

          atualizacoesFinais = {
            percent: percentualNumerico,
            valor: valorCalculado,
          };
        }
        rateiosEditados[index] = { ...rateioParaAtualizar, ...atualizacoesFinais };
        return rateiosEditados;
      });
      setDirtyRows((prev) => new Set(prev).add(id));
    },
    [totalGeral, getRateioId, storeRateiosMap, totalRestanteGlobal]
  );

  const handleSaveChanges = useCallback(
    (id: string) => {
      const rateioParaSalvar = editingRateios.find((r) => getRateioId(r) === id);
      if (rateioParaSalvar) {
        const valorFinal = parseFloat((rateioParaSalvar.valor ?? 0).toFixed(2));
        const percentFinal = parseFloat((rateioParaSalvar.percent ?? 0).toFixed(2));

        const rateioOriginalDoStore = storeRateiosMap.get(id);
        const valorOriginalNoStore = rateioOriginalDoStore?.valor ?? 0;
        const maxValorPossivelParaEsteItem = parseFloat((valorOriginalNoStore + totalRestanteGlobal).toFixed(2));

        if (valorFinal > maxValorPossivelParaEsteItem + 0.001) {
            toast.error(`Erro ao salvar: O valor ${formatCurrency(valorFinal)} excede o máximo permitido para este item (${formatCurrency(maxValorPossivelParaEsteItem)}).`);
            return;
        }

        updateRateio(id, {
          FIL: rateioParaSalvar.FIL,
          cc: rateioParaSalvar.cc,
          valor: valorFinal,
          percent: percentFinal,
        });
        setDirtyRows((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success("Rateio atualizado com sucesso!");
      } else {
        toast.error("Erro ao encontrar rateio para salvar.");
      }
    },
    [editingRateios, updateRateio, getRateioId, storeRateiosMap, totalRestanteGlobal]
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeRateio(id);
      toast.success("Rateio removido.");
    },
    [removeRateio]
  );

  return (
    <div className="flex flex-col border rounded bg-input/30 overflow-hidden h-full">
      <ScrollArea className="flex-1 bg-background relative">
        <Table className="border-b">
          <TableHeader className="py-2 bg-card sticky top-0 z-10">
            <TableRow>
              <TableHead className="px-2 text-center" style={{ width: "200px" }}>Filial</TableHead>
              <TableHead className="px-2 text-center" style={{ width: "250px" }}>Centro de Custo</TableHead>
              <TableHead className="px-2 text-center" style={{ width: "150px" }}>Valor (R$)</TableHead>
              <TableHead className="px-2 text-center" style={{ width: "150px" }}>Porcentagem (%)</TableHead>
              <TableHead className="px-2 text-center" style={{ width: "100px" }}>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(editingRateios || []).map((localRow) => {
              const rowId = getRateioId(localRow);
              const isDirty = dirtyRows.has(rowId);
              
              const rateioOriginalDoStore = storeRateiosMap.get(rowId);
              const valorOriginalNoStore = rateioOriginalDoStore?.valor ?? 0;

              const maxValorEditavelParaEsteItem = parseFloat((valorOriginalNoStore + totalRestanteGlobal).toFixed(2));
              const maxPercentualEditavelParaEsteItem = totalGeral > 0 
                ? parseFloat(Math.min(100, ((maxValorEditavelParaEsteItem / totalGeral) * 100)).toFixed(2))
                : (maxValorEditavelParaEsteItem > 0 ? 100 : 0);

              return (
                <TableRow key={rowId}>
                  <TableCell className="px-2 py-1 text-center align-middle">
                    <Combobox
                      items={filialItems}
                      selectedValue={localRow.FIL || null}
                      onSelect={(selectedValue) =>
                        handleLocalChange(rowId, "FIL", selectedValue)
                      }
                      placeholder="Filial..."
                      className="text-xs h-8"
                    />
                  </TableCell>
                  <TableCell className="px-2 py-1 text-center align-middle">
                    <Combobox
                      items={centroCustoItems}
                      selectedValue={localRow.cc || null}
                      onSelect={(selectedValue) =>
                        handleLocalChange(rowId, "cc", selectedValue)
                      }
                      placeholder="Centro Custo..."
                      className="text-xs h-8"
                    />
                  </TableCell>
                  <TableCell className="px-2 py-1 text-center align-middle">
                    <NumericFormat
                      value={localRow.valor ?? 0}
                      onValueChange={(values) =>
                        // CORREÇÃO: Passar null se floatValue for undefined
                        handleLocalChange(rowId, "valor", values.floatValue === undefined ? null : values.floatValue)
                      }
                      isAllowed={(values: NumberFormatValues) => {
                        const { floatValue } = values;
                        if (floatValue === undefined) return true;
                        return floatValue >= 0 && floatValue <= maxValorEditavelParaEsteItem;
                      }}
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      className="text-center text-xs h-8 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="R$ 0,00"
                      disabled={totalGeral <= 0 && valorOriginalNoStore <= 0}
                    />
                  </TableCell>
                  <TableCell className="px-2 py-1 text-center align-middle">
                    <NumericFormat
                      value={localRow.percent ?? 0}
                      onValueChange={(values) => {
                        // CORREÇÃO: Passar null se floatValue for undefined
                        handleLocalChange(rowId, "percent", values.floatValue === undefined ? null : values.floatValue);
                      }}
                      isAllowed={(values: NumberFormatValues) => {
                        const { floatValue } = values;
                        if (floatValue === undefined) return true;
                        return floatValue >= 0 && floatValue <= maxPercentualEditavelParaEsteItem;
                      }}
                      decimalScale={2}
                      fixedDecimalScale
                      allowNegative={false}
                      decimalSeparator=","
                      suffix=" %"
                      className="text-center text-xs h-8 w-full rounded-md border border-input bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="0,00 %"
                      disabled={totalGeral <= 0 && valorOriginalNoStore <= 0}
                    />
                  </TableCell>
                  <TableCell className="px-2 py-1 text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      {isDirty && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-100"
                          onClick={() => handleSaveChanges(rowId)}
                          aria-label="Salvar alterações do rateio"
                          title="Salvar alterações"
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive-foreground hover:bg-destructive/10"
                        onClick={() => handleRemove(rowId)}
                        aria-label="Remover rateio"
                        title="Remover rateio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {(storeRateios.length > 0 || totalGeral > 0) && (
        <div className="flex flex-wrap justify-between border-t p-2 px-4 text-sm bg-card gap-x-4 gap-y-1">
          <div className="flex gap-4">
            <div className="flex flex-col items-start">
              <span>Total NF:</span>
              <span className="font-medium">{formatCurrency(totalGeral)}</span>
            </div>
            <div className="flex flex-col items-start">
              <span>Rateado (Store):</span>
              <span className="font-medium">
                {formatCurrency(totalDivisaoSalvaNoStore)} (
                {formatPercent(porcentagemDivisaoSalvaNoStore)})
              </span>
            </div>
          </div>
          <div className="flex flex-col items-start">
            <span>Restante (Global):</span>
            <span
              className={`font-medium ${
                totalRestanteGlobal < 0.01 && totalRestanteGlobal >= 0
                  ? "text-green-600"
                  : totalRestanteGlobal < 0 ? "text-red-600" : ""
              }`}
            >
              {formatCurrency(totalRestanteGlobal)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
