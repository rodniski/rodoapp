"use client";
import React, { useEffect, useState, useMemo } from "react";
import { CalendarDays } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ScrollArea,
  Alert,
  AlertTitle,
  AlertDescription,
} from "ui";
import { NumericFormat } from "react-number-format";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useCondicaoPagamento } from "@inclusao/hooks";
import { usePreNotaStore, usePreNotaAuxStore } from "@inclusao/stores";
import type { Parcela } from "@inclusao/types";

/* helpers dd/MM/yyyy ↔ Date */
const parseDatePt = (s: string) =>
  parse(s, "dd/MM/yyyy", new Date(), { locale: ptBR });
const fmtDatePt = (d: Date) => format(d, "dd/MM/yyyy", { locale: ptBR });

export function CondicaoPagamentoForm() {
  const valorNF = usePreNotaAuxStore((s) => s.totalNf.valorTotalXml);

  /* ── hook TanStack (sem parâmetros explícitos) ────────────── */
  const { data, isLoading, error } = useCondicaoPagamento();

  /* ── estado local editável ────────────────────────────────── */
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [pixFields, setPixFields] = useState({
    chave_pix: "",
    cpf_cnpj_destinatario: "",
  });
  const setParcelasStore = usePreNotaStore((s) => s.setParcelas);

  useEffect(() => {
    if (data?.Pagamentos) {
      const mapped: Parcela[] = data.Pagamentos.map((p) => ({
        Parcela: p.Parcela,
        Vencimento: p.Vencimento,
        Valor: p.Valor,
      }));
      setParcelas(mapped);
      setParcelasStore(mapped);
    }
    if (data?.dados) {
      setPixFields({
        chave_pix: data.dados.chave_pix ?? "",
        cpf_cnpj_destinatario: data.dados.cpf_cnpj_destinatario ?? "",
      });
    }
  }, [data, setParcelasStore]);

  /* ── handlers para edição das parcelas ────────────────────────── */
  const updateParcela = (idx: number, patch: Partial<Parcela>) =>
    setParcelas((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch } as Parcela;
      setParcelasStore(next);
      return next;
    });

  /* ── validação do total das parcelas ──────────────────────────── */
  const parcelasTotal = useMemo(
    () => parcelas.reduce((sum, p) => sum + p.Valor, 0),
    [parcelas]
  );

  const isValorValido = useMemo(
    () => valorNF !== null && parcelasTotal === valorNF,
    [parcelasTotal, valorNF]
  );

  /* ── render ───────────────────────────────────────────────────── */
  if (isLoading)
    return <p className="text-sm">Carregando condição…</p>;

  if (error)
    return <p className="text-destructive text-sm">{error.message}</p>;

  if (!data)
    return <p className="text-sm">Condição de pagamento ainda não carregada.</p>;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Condição de Pagamento</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ScrollArea className="max-h-[250px] pr-2">
          {parcelas.map((p, idx) => (
            <div key={p.Parcela} className="grid grid-cols-10 gap-2 items-end py-1">
              <div className="col-span-2">
                <Label>Parc.</Label>
                <Input
                  value={p.Parcela}
                  disabled
                  className="h-8 text-center"
                />
              </div>
              <div className="col-span-4">
                <Label>Vencimento</Label>
                <Input
                  type="date"
                  className="h-8"
                  value={format(parseDatePt(p.Vencimento), "yyyy-MM-dd")}
                  onChange={(e) =>
                    updateParcela(idx, {
                      Vencimento: fmtDatePt(new Date(e.target.value)),
                    })
                  }
                />
              </div>
              <div className="col-span-4">
                <Label>Valor</Label>
                <NumericFormat
                  value={p.Valor}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  prefix="R$ "
                  className="h-8 w-full rounded-md border border-input px-3"
                  onValueChange={(v) =>
                    updateParcela(idx, { Valor: v.floatValue ?? 0 })
                  }
                />
              </div>
            </div>
          ))}
        </ScrollArea>

        {/* Validador da soma das parcelas */}
        {!isValorValido && (
          <Alert variant="destructive">
            <AlertTitle>Atenção!</AlertTitle>
            <AlertDescription>
              O valor total das parcelas (R$ {parcelasTotal.toFixed(2)}) não corresponde ao valor total da nota fiscal (R$ {valorNF?.toFixed(2)}).
            </AlertDescription>
          </Alert>
        )}

        {/* Dados PIX */}
        <details className="mt-4">
          <summary className="cursor-pointer select-none text-sm font-medium flex items-center gap-1">
            <CalendarDays className="h-4 w-4" /> Dados PIX (opcional)
          </summary>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <Label>Chave PIX</Label>
              <Input
                value={pixFields.chave_pix}
                onChange={(e) =>
                  setPixFields({ ...pixFields, chave_pix: e.target.value })
                }
                placeholder="Chave PIX"
              />
            </div>
            <div>
              <Label>CPF/CNPJ Destinatário</Label>
              <Input
                value={pixFields.cpf_cnpj_destinatario}
                onChange={(e) =>
                  setPixFields({
                    ...pixFields,
                    cpf_cnpj_destinatario: e.target.value,
                  })
                }
                placeholder="Somente números"
              />
            </div>
          </div>
        </details>
      </CardContent>
    </Card>
  );
}
