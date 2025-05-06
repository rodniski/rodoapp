// _lib/components/stepper/header/condicao/Condicao.tsx
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { CalendarDays, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "ui/dialog";
import {
  Button,
  Input,
  Label,
  ScrollArea,
  Alert,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "ui";
import { NumericFormat } from "react-number-format";
import { format, parse } from "date-fns";
import { ptBR } from "date-fns/locale";
import { usePreNotaStore, usePreNotaAuxStore } from "@inclusao/stores";
import type { CondicaoPagamentoResponse } from "@inclusao/api";
import type { Parcela } from "@inclusao/types";
import { toast } from "sonner";

const parseDatePt = (s: string): Date => {
  try {
    const parsed = parse(s, "dd/MM/yyyy", new Date(), { locale: ptBR });
    return isNaN(parsed.getTime()) ? new Date(NaN) : parsed;
  } catch {
    return new Date(NaN);
  }
};

const fmtDatePt = (d: Date): string =>
  !isNaN(d.getTime()) ? format(d, "dd/MM/yyyy", { locale: ptBR }) : "";

interface CondicaoPagamentoFormProps {
  data: CondicaoPagamentoResponse | undefined | null;
  isLoading: boolean;
  error: Error | null;
}

export function CondicaoPagamentoForm({
  data,
  isLoading,
  error,
}: CondicaoPagamentoFormProps) {
  // lê o valor da NF vindo do store auxiliar
  const valorNF = usePreNotaAuxStore((s) => s.totalNf.valorTotalXml);

  // estado local de parcelas e campos PIX
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [pixFields, setPixFields] = useState({
    chave_pix: "",
    cpf_cnpj_destinatario: "",
  });

  // ações da store principal
  const setParcelasStore = usePreNotaStore((s) => s.setParcelas);

  const [open, setOpen] = useState(false);

  // sempre que `data` mudar, mapeia para Parcela[] e preenche campos PIX
  useEffect(() => {
    if (data?.Pagamentos) {
      const mapped = data.Pagamentos.map((p) => ({
        Parcela: p.Parcela ?? "",
        Vencimento: p.Vencimento ?? "",
        Valor: p.Valor ?? 0,
      }));
      setParcelas(mapped);
    } else {
      setParcelas([]);
    }
    if (data?.dados) {
      setPixFields({
        chave_pix: data.dados.chave_pix ?? "",
        cpf_cnpj_destinatario: data.dados.cpf_cnpj_destinatario ?? "",
      });
    } else {
      setPixFields({ chave_pix: "", cpf_cnpj_destinatario: "" });
    }
  }, [data]);

  // atualiza uma parcela localmente
  const updateLocalParcela = (idx: number, patch: Partial<Parcela>) => {
    setParcelas((prev) => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...patch } as Parcela;
      return next;
    });
  };

  // soma valores e validações
  const parcelasTotal = useMemo(
    () => parcelas.reduce((sum, p) => sum + (p.Valor || 0), 0),
    [parcelas]
  );
  const isValorValido = useMemo(
    () => valorNF !== null && Math.abs(parcelasTotal - valorNF) < 0.01,
    [parcelasTotal, valorNF]
  );

  // salva na store principal
  const handleSaveChanges = () => {
    if (isValorValido) {
      setParcelasStore(parcelas);
      toast.success("Parcelas salvas com sucesso!");
      setOpen(false);
    } else {
      toast.error(
        "Não é possível salvar: O valor total das parcelas não corresponde ao valor da NF."
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          <Edit className="mr-2 h-4 w-4" />
          {isLoading ? "Carregando..." : "Editar Condição de Pagamento"}
          <span className="text-destructive">*</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] bg-card">
        <DialogHeader>
          <DialogTitle>Condição de Pagamento</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {isLoading && (
            <p className="text-sm text-center p-4">Carregando condição…</p>
          )}
          {error && (
            <p className="text-destructive text-sm text-center p-4">
              {error.message}
            </p>
          )}
          {!isLoading && !error && !data && (
            <p className="text-sm text-center p-4">Condição não encontrada.</p>
          )}
          {!isLoading && !error && data && (
            <div className="space-y-4">
              <ScrollArea className="max-h-[300px] pr-2">
                {parcelas.map((p, idx) => {
                  const vencimentoDate = parseDatePt(p.Vencimento);
                  return (
                    <div
                      key={p.Parcela || idx}
                      className="grid grid-cols-10 gap-2 items-end py-1"
                    >
                      <div className="col-span-2">
                        <Label htmlFor={`parc-${idx}`}>Parc.</Label>
                        <Input
                          id={`parc-${idx}`}
                          value={p.Parcela}
                          disabled
                          className="h-8 text-center"
                        />
                      </div>
                      <div className="col-span-4">
                        <Label htmlFor={`venc-${idx}`}>Vencimento</Label>
                        <Input
                          id={`venc-${idx}`}
                          type="date"
                          className={`h-8 ${
                            isNaN(vencimentoDate.getTime())
                              ? "border-red-500"
                              : ""
                          }`}
                          value={
                            !isNaN(vencimentoDate.getTime())
                              ? format(vencimentoDate, "yyyy-MM-dd")
                              : ""
                          }
                          onChange={(e) => {
                            const newDate = new Date(
                              e.target.value + "T00:00:00"
                            );
                            if (!isNaN(newDate.getTime())) {
                              updateLocalParcela(idx, {
                                Vencimento: fmtDatePt(newDate),
                              });
                            } else {
                              updateLocalParcela(idx, {
                                Vencimento: "",
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="col-span-4">
                        <Label htmlFor={`val-${idx}`}>Valor</Label>
                        <NumericFormat
                          id={`val-${idx}`}
                          value={p.Valor}
                          thousandSeparator="."
                          decimalSeparator=","
                          decimalScale={2}
                          fixedDecimalScale
                          prefix="R$ "
                          customInput={Input}
                          onValueChange={(vals) =>
                            updateLocalParcela(idx, {
                              Valor: vals.floatValue ?? 0,
                            })
                          }
                          allowNegative={false}
                          className="h-8 w-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>
              {!isValorValido && valorNF !== null && (
                <Alert variant="destructive">
                  <AlertTitle>Atenção!</AlertTitle>
                  <AlertDescription>
                    O valor total das parcelas (R$
                    {parcelasTotal.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    ) não corresponde ao valor total da nota fiscal (R$
                    {valorNF.toLocaleString("pt-BR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    ).
                  </AlertDescription>
                </Alert>
              )}
              <Accordion
                type="single"
                collapsible
                className="w-full border-t pt-4 mt-4"
              >
                <AccordionItem value="item-pix">
                  <AccordionTrigger className="text-sm font-medium hover:no-underline py-2">
                    <div className="flex items-center gap-1">
                      <CalendarDays className="h-4 w-4" /> Dados PIX (opcional)
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <div>
                        <Label htmlFor="chave-pix">Chave PIX</Label>
                        <Input
                          id="chave-pix"
                          value={pixFields.chave_pix}
                          onChange={(e) =>
                            setPixFields({
                              ...pixFields,
                              chave_pix: e.target.value,
                            })
                          }
                          placeholder="E-mail, CPF/CNPJ, Telefone, Aleatória"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cpf-cnpj-pix">
                          CPF/CNPJ Destinatário
                        </Label>
                        <Input
                          id="cpf-cnpj-pix"
                          value={pixFields.cpf_cnpj_destinatario}
                          onChange={(e) =>
                            setPixFields({
                              ...pixFields,
                              cpf_cnpj_destinatario: e.target.value.replace(
                                /\D/g,
                                ""
                              ),
                            })
                          }
                          placeholder="Somente números"
                          maxLength={14}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={handleSaveChanges}
            disabled={!isValorValido || isLoading}
          >
            Gravar Condição de Pagamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
