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
import { NumericFormat } from "react-number-format";
import { Trash2, Save } from "lucide-react";
import { useAuxStore as useLoginAuxStore } from "@/app/login/_lib/stores";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
import type { Rateio as RateioType } from "@inclusao/types";
import { Combobox, ComboboxItem } from "ui";
import { formatCurrency } from "utils";

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

  // Helper to get the ID (using 'id' as the primary key)
  const getRateioId = useCallback((rateio: RateioType): string => {
    if (typeof rateio.id !== "string" || !rateio.id) {
      console.warn("Rateio sem 'id' válido encontrado:", rateio);
      return `fallback_${Math.random()}`;
    }
    return rateio.id;
  }, []);

  const storeRateiosMap = useMemo(() => {
    const map = new Map<string, RateioType>();
    storeRateios.forEach((item) => {
      const id = getRateioId(item);
      if (id) {
        map.set(id, item);
      }
    });
    return map;
  }, [storeRateios, getRateioId]);

  useEffect(() => {
    setEditingRateios(structuredClone(storeRateios));
    setDirtyRows(new Set());
  }, [storeRateios]);

  const totalGeral = useMemo(() => totalGeralXml ?? 0, [totalGeralXml]);

  const totalDivisaoSalva = useMemo(
    () => storeRateios.reduce((acc, row) => acc + (row.valor || 0), 0),
    [storeRateios]
  );
  const porcentagemDivisaoSalva = useMemo(
    () =>
      totalGeral > 0
        ? parseFloat(((totalDivisaoSalva / totalGeral) * 100).toFixed(2))
        : 0,
    [totalGeral, totalDivisaoSalva]
  );
  const totalRestante = useMemo(
    () => Math.max(0, parseFloat((totalGeral - totalDivisaoSalva).toFixed(2))),
    [totalGeral, totalDivisaoSalva]
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
      value: string | number | null
    ) => {
      setEditingRateios((currentRateios) => {
        const index = currentRateios.findIndex((r) => getRateioId(r) === id);
        if (index === -1) return currentRateios;

        const updatedRateios = [...currentRateios];
        const rateioToUpdate = { ...updatedRateios[index] };
        let finalUpdates: Partial<RateioType> = {};

        if (field === "FIL" || field === "cc") {
          finalUpdates = { [field]: (value as string | null) ?? "" };
        } else if (field === "valor") {
          const numericValue = typeof value === "number" ? value : 0;
          const calculatedPerc =
            totalGeral > 0
              ? parseFloat(((numericValue / totalGeral) * 100).toFixed(2))
              : 0;
          finalUpdates = {
            valor: parseFloat(numericValue.toFixed(2)),
            percent: Math.min(100, Math.max(0, calculatedPerc)),
          };
        } else if (field === "percent") {
          const numericPercent =
            typeof value === "number" ? Math.min(100, Math.max(0, value)) : 0;
          const calculatedValor = parseFloat(
            ((numericPercent / 100) * totalGeral).toFixed(2)
          );
          finalUpdates = {
            percent: numericPercent,
            valor: calculatedValor,
          };
        }
        updatedRateios[index] = { ...rateioToUpdate, ...finalUpdates };
        return updatedRateios;
      });
      setDirtyRows((prev) => new Set(prev).add(id));
    },
    [totalGeral, getRateioId]
  );

  const handleSaveChanges = useCallback(
    (id: string) => {
      const rateioToSave = editingRateios.find((r) => getRateioId(r) === id);
      if (rateioToSave) {
        updateRateio(id, {
          FIL: rateioToSave.FIL,
          cc: rateioToSave.cc,
          valor: rateioToSave.valor,
          percent: rateioToSave.percent,
        });
        setDirtyRows((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [editingRateios, updateRateio, getRateioId]
  );

  const handleRemove = useCallback(
    (id: string) => {
      removeRateio(id);
      setEditingRateios((prev) => prev.filter((r) => getRateioId(r) !== id));
      setDirtyRows((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    },
    [removeRateio, getRateioId]
  );

  return (
    <div className="flex flex-col border rounded bg-input/30 overflow-hidden h-full">
      <ScrollArea className="flex-1 bg-background relative">
        <Table className="border-b">
          <TableHeader className="py-2 bg-card sticky top-0 z-10">
            <TableRow>
              <TableHead
                className="px-2 text-center"
                style={{ width: "200px" }}
              >
                Filial
              </TableHead>
              <TableHead
                className="px-2 text-center"
                style={{ width: "250px" }}
              >
                Centro de Custo
              </TableHead>
              <TableHead
                className="px-2 text-center"
                style={{ width: "150px" }}
              >
                Valor (R$)
              </TableHead>
              <TableHead
                className="px-2 text-center"
                style={{ width: "150px" }}
              >
                Porcentagem (%)
              </TableHead>
              <TableHead
                className="px-2 text-center"
                style={{ width: "100px" }}
              >
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {editingRateios.map((localRow) => {
              const rowId = getRateioId(localRow);
              const isDirty = dirtyRows.has(rowId);
              const storeRow = storeRateiosMap.get(rowId);

              const displayFilial = isDirty ? localRow.FIL : storeRow?.FIL;
              const displayCC = isDirty ? localRow.cc : storeRow?.cc;
              const displayValor = isDirty ? localRow.valor : storeRow?.valor;
              const displayPerc = isDirty
                ? localRow.percent
                : storeRow?.percent;

              return (
                <TableRow key={rowId}>
                  <TableCell className="px-2 py-1 text-center align-middle">
                    <Combobox
                      items={filialItems}
                      selectedValue={displayFilial || null}
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
                      selectedValue={displayCC || null}
                      onSelect={(selectedValue) =>
                        handleLocalChange(rowId, "cc", selectedValue)
                      }
                      placeholder="Centro Custo..."
                      className="text-xs h-8"
                    />
                  </TableCell>
                  <TableCell className="px-2 py-1 text-center align-middle">
                    <NumericFormat
                      value={displayValor ?? 0}
                      onValueChange={(values) =>
                        handleLocalChange(
                          rowId,
                          "valor",
                          values.floatValue ?? 0
                        )
                      }
                      decimalScale={2}
                      allowNegative={false}
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      className="text-center text-xs h-8 w-full rounded-md border border-input bg-muted px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="R$ 0,00"
                      disabled={totalGeral <= 0 || !storeRow}
                    />
                  </TableCell>
                  <TableCell className="px-2 py-1 text-center align-middle">
                    <NumericFormat
                      value={displayPerc ?? 0}
                      onValueChange={(values) => {
                        const limitedPercent = Math.min(
                          values.floatValue ?? 0,
                          100
                        );
                        handleLocalChange(rowId, "percent", limitedPercent);
                      }}
                      decimalScale={2}
                      allowNegative={false}
                      decimalSeparator=","
                      suffix=" %"
                      className="text-center text-xs h-8 w-full rounded-md border border-input bg-muted px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="0,00 %"
                      disabled={totalGeral <= 0 || !storeRow}
                    />
                  </TableCell>
                  <TableCell className="px-2 py-1 text-center align-middle">
                    <div className="flex items-center justify-center gap-1">
                      {isDirty && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-lime-500 hover:text-lime-600"
                          onClick={() => handleSaveChanges(rowId)}
                          aria-label="Salvar alterações do rateio"
                          disabled={!storeRow}
                        >
                          <Save className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleRemove(rowId)}
                        aria-label="Remover rateio"
                        disabled={!storeRow}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
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
              <span>Rateado:</span>
              <span className="font-medium">
                {formatCurrency(totalDivisaoSalva)} (
                {formatPercent(porcentagemDivisaoSalva)})
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
