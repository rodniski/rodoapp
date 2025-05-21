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
import { toast } from "sonner";
import { formatCurrency } from "utils";

import { useAuxStore as useLoginAuxStore } from "@/app/login/_internal/stores";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
import type { Rateio as RateioType } from "@inclusao/types";
import { Combobox, ComboboxItem } from "ui";

/* -------------------------------------------------------------------------- */
/* util */
const formatPercent = (v: number) => `${(v ?? 0).toFixed(2)}%`;

/* -------------------------------------------------------------------------- */

type RateioTableProps = object;

export function RateioTable({}: RateioTableProps) {
  /* ---------------- stores ---------------- */
  const filiais = useLoginAuxStore((s) => s.filiais);
  const centroCusto = useLoginAuxStore((s) => s.centroCusto);

  const {
    draft: { RATEIOS: storeRateios },
    updateRateio,
    removeRateio,
  } = usePreNotaStore();

  const totalGeralXml = useValorTotalXml();

  /* ---------------- helpers ---------------- */
  const getId = useCallback((r: RateioType) => r.id || `fallback_${r.seq}`, []);

  /* ---------------- local state ---------------- */
  const [editing, setEditing] = useState<RateioType[]>([]);
  const [dirty, setDirty] = useState<Set<string>>(new Set());

  useEffect(() => {
    setEditing(structuredClone(storeRateios));
    setDirty(new Set());
  }, [storeRateios]);

  /* ---------------- memo data ---------------- */
  const totalGeral = totalGeralXml ?? 0;

  const totalRateado = useMemo(
    () => storeRateios.reduce((acc, r) => acc + (r.valor || 0), 0),
    [storeRateios]
  );
  const percRateado = useMemo(
    () =>
      totalGeral > 0
        ? parseFloat(((totalRateado / totalGeral) * 100).toFixed(2))
        : 0,
    [totalGeral, totalRateado]
  );
  const restanteGlobal = useMemo(
    () => Math.max(0, parseFloat((totalGeral - totalRateado).toFixed(2))),
    [totalGeral, totalRateado]
  );

  const mapStore = useMemo(() => {
    const m = new Map<string, RateioType>();
    storeRateios.forEach((r) => m.set(getId(r), r));
    return m;
  }, [storeRateios, getId]);

  /* ---------------- options ---------------- */
  const filialItems: ComboboxItem[] = useMemo(
    () =>
      filiais.map((f) => ({
        value: f.numero ?? "",
        label: `${f.numero ?? "??"} - ${f.filial ?? "Nome Indisponível"}`,
      })),
    [filiais]
  );

  const centroItems: ComboboxItem[] = useMemo(
    () =>
      centroCusto.map((c) => ({
        value: c.CTT_CUSTO ?? "",
        label: `${c.CTT_CUSTO ?? "??"} - ${
          c.CTT_DESC01 ?? "Descrição Indisponível"
        }`,
      })),
    [centroCusto]
  );

  /* ---------------- handlers ---------------- */
  const change = useCallback(
    (id: string, field: keyof RateioType, value: string | number | null) => {
      setEditing((prev) =>
        prev.map((r) =>
          getId(r) !== id
            ? r
            : {
                ...r,
                ...(() => {
                  if (field === "valor") {
                    const v = Math.max(0, Number(value ?? 0));
                    const p =
                      totalGeral > 0
                        ? parseFloat(((v / totalGeral) * 100).toFixed(2))
                        : 0;
                    return { valor: v, percent: p };
                  }
                  if (field === "percent") {
                    const p = Math.min(100, Math.max(0, Number(value ?? 0)));
                    const v = parseFloat(((p / 100) * totalGeral).toFixed(2));
                    return { percent: p, valor: v };
                  }
                  return { [field]: value ?? "" };
                })(),
              }
        )
      );
      setDirty((d) => new Set(d).add(id));
    },
    [getId, totalGeral]
  );

  const save = useCallback(
    (id: string) => {
      const local = editing.find((r) => getId(r) === id);
      if (!local) return;

      const valorFinal = parseFloat((local.valor ?? 0).toFixed(2));
      const st = mapStore.get(id);
      const max = parseFloat(((st?.valor ?? 0) + restanteGlobal).toFixed(2));

      if (valorFinal > max + 0.001) {
        toast.error(
          `Valor ${formatCurrency(valorFinal)} > máximo ${formatCurrency(max)}`
        );
        return;
      }

      updateRateio(id, {
        FIL: local.FIL,
        cc: local.cc,
        valor: valorFinal,
        percent: parseFloat((local.percent ?? 0).toFixed(2)),
      });
      setDirty((d) => {
        const n = new Set(d);
        n.delete(id);
        return n;
      });
      toast.success("Rateio atualizado!");
    },
    [editing, mapStore, restanteGlobal, updateRateio, getId]
  );

  const remove = useCallback(
    (id: string) => {
      removeRateio(id);
      toast.success("Rateio removido.");
    },
    [removeRateio]
  );

  /* ---------------------------------------------------------------------- */
  /*                                render                                  */
  /* ---------------------------------------------------------------------- */
  return (
    <div className="flex h-full flex-col overflow-hidden rounded border bg-input/30">
      <ScrollArea className="relative flex-1 bg-background">
        <Table className="border-b w-full">
          {/* ---------- colunas flex ---------- */}
          <colgroup>
            <col style={{ width: "32%" }} />
            <col style={{ width: "32%" }} />
            <col style={{ width: "18%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "4rem" }} />
          </colgroup>

          <TableHeader className="sticky top-0 z-10 bg-card">
            <TableRow>
              <TableHead className="px-2 text-center">Filial</TableHead>
              <TableHead className="px-2 text-center">
                Centro de Custo
              </TableHead>
              <TableHead className="px-2 text-center">Valor (R$)</TableHead>
              <TableHead className="px-2 text-center">
                Porcentagem (%)
              </TableHead>
              <TableHead className="px-2 text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {editing.map((r) => {
              const id = getId(r);
              const isDirty = dirty.has(id);

              const st = mapStore.get(id);
              const maxValor = (st?.valor ?? 0) + restanteGlobal; // limite por item
              const maxPercent =
                totalGeral > 0
                  ? Math.min(100, (maxValor / totalGeral) * 100)
                  : 100;

              return (
                <TableRow key={id}>
                  {/* ---------------- Filial ---------------- */}
                  <TableCell className="align-middle px-2 py-2">
                    <Combobox
                      items={filialItems}
                      selectedValue={r.FIL || null}
                      onSelect={(v) => change(id, "FIL", v)}
                      placeholder="Filial…"
                      triggerClassName="h-10 w-full truncate border-none text-xs"
                    />
                  </TableCell>

                  {/* ---------------- CC ---------------- */}
                  <TableCell className="align-middle px-2 py-2">
                    <Combobox
                      items={centroItems}
                      selectedValue={r.cc || null}
                      onSelect={(v) => change(id, "cc", v)}
                      placeholder="Centro de custo…"
                      triggerClassName="h-10 w-full truncate border-none text-xs"
                    />
                  </TableCell>

                  {/* ---------------- Valor ---------------- */}
                  <TableCell className="align-middle px-2 py-1">
                    <NumericFormat
                      value={r.valor ?? 0}
                      onValueChange={(v) =>
                        change(
                          id,
                          "valor",
                          v.floatValue === undefined ? null : v.floatValue
                        )
                      }
                      isAllowed={(v: NumberFormatValues) =>
                        v.floatValue === undefined ||
                        (v.floatValue >= 0 && v.floatValue <= maxValor)
                      }
                      decimalScale={2}
                      fixedDecimalScale
                      thousandSeparator="."
                      decimalSeparator=","
                      prefix="R$ "
                      className="h-10 w-full rounded-md border-none bg-accent/30 px-3 py-2 text-center text-xs"
                    />
                  </TableCell>

                  {/* ---------------- Percent ---------------- */}
                  <TableCell className="align-middle px-2 py-2">
                    <NumericFormat
                      value={r.percent ?? 0}
                      onValueChange={(v) =>
                        change(
                          id,
                          "percent",
                          v.floatValue === undefined ? null : v.floatValue
                        )
                      }
                      isAllowed={(v: NumberFormatValues) =>
                        v.floatValue === undefined ||
                        (v.floatValue >= 0 && v.floatValue <= maxPercent)
                      }
                      decimalScale={2}
                      fixedDecimalScale
                      decimalSeparator=","
                      suffix=" %"
                      className="h-10 w-full rounded-md border-none bg-accent/30 px-3 py-2 text-center text-xs"
                    />
                  </TableCell>

                  {/* ---------------- Ações ---------------- */}
                  <TableCell className="align-middle px-2 py-2">
                    <div className="flex justify-center gap-1">
                      {isDirty && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-green-600 hover:bg-green-100 hover:text-green-700"
                          onClick={() => save(id)}
                          aria-label="Salvar alterações"
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
                        onClick={() => remove(id)}
                        aria-label="Remover rateio"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      {/* ---------------- rodapé totals ---------------- */}
      {(storeRateios.length > 0 || totalGeral > 0) && (
        <div className="flex flex-wrap justify-between gap-x-4 gap-y-1 border-t bg-card p-2 px-4 text-sm">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span>Total NF:</span>
              <span className="font-medium">{formatCurrency(totalGeral)}</span>
            </div>
            <div className="flex flex-col">
              <span>Rateado (Store):</span>
              <span className="font-medium">
                {formatCurrency(totalRateado)} ({formatPercent(percRateado)})
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span>Restante (Global):</span>
            <span
              className={`font-medium ${
                restanteGlobal < 0.01
                  ? "text-green-600"
                  : restanteGlobal < 0
                  ? "text-red-600"
                  : ""
              }`}
            >
              {formatCurrency(restanteGlobal)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
