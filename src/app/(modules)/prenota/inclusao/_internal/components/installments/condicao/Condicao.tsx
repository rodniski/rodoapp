/* ───────────────────────────  CondicaoPagamentoForm.tsx  ───────────────────────────
 * Formulário para edição de condições de pagamento de Pré-notas.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Permite editar parcelas (número, vencimento, valor) e
 *  ├────────────┤  dados PIX opcionais, validando que o total das parcelas
 *  │  FUNCIONAL │  corresponda ao valor da NF. Exibe a condição de pagamento
 *  │            │  (E4_DESCRI) estabelecida no pedido, cruzando CONDFIN
 *  │            │  com E4_CODIGO da tabela de condições de pagamento.
 *  └────────────┘
 *  Melhores práticas adotadas:
 *  • Tipos explícitos e normalização de código (trim/upper) para comparação.
 *  • Funções utilitárias fora do componente para evitar recriação.
 *  • useCallback em mutadores de estado.
 *  • Separação clara entre UI e lógica.
 *  -----------------------------------------------------------------------*/

"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { CalendarDays, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "ui";
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
import { useAuxStore } from "@login/stores";
import type { Parcela } from "@inclusao/types";
import type { Condicao } from "@login/types";
import type { CondicaoPagamentoResponse } from "@inclusao/api";
import { toast } from "sonner";

/* ───────────────────────────  Utils  ─────────────────────────── */
const parseDatePt = (s: string): Date => {
  const parsed = parse(s, "dd/MM/yyyy", new Date(), { locale: ptBR });
  return isNaN(parsed.getTime()) ? new Date(NaN) : parsed;
};

const fmtDatePt = (d: Date): string =>
  !isNaN(d.getTime()) ? format(d, "dd/MM/yyyy", { locale: ptBR }) : "";

const ensureValidVencimento = (venc?: string | null): string => {
  if (!venc) return "";
  const parsed = parseDatePt(venc);
  return fmtDatePt(parsed);
};

/* Normaliza strings (remove espaços e torna maiúsculo) */
const normalize = (s?: string | null) => s?.trim().toUpperCase() ?? "";

/* Retorna a descrição da condição de pagamento dado o código */
const getCondicaoDescricao = (
  condicoes: Condicao[] | undefined,
  cod: string | null
): string => {
  const code = normalize(cod);
  if (!code || !condicoes?.length) return "Desconhecida";
  const match = condicoes.find((c) => normalize(c.E4_CODIGO) === code);
  return match?.E4_DESCRI || match?.Desc || "Desconhecida";
};

/* ───────────────────────────  Componente  ─────────────────────────── */
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
  /* ───────────  Zustand  ─────────── */
  const valorNF = usePreNotaAuxStore((s) => s.totalNf.valorTotalXml);
  const setParcelasStore = usePreNotaStore((s) => s.setParcelas);
  const condfin = usePreNotaStore((s) => s.draft.header.CONDFIN);
  const condicoes = useAuxStore((s) => s.condicoes);

  /* ───────────  Estado local  ─────────── */
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [pixFields, setPixFields] = useState({
    chave_pix: "",
    cpf_cnpj_destinatario: "",
  });
  const [open, setOpen] = useState(false);

  /* ───────────  Memoized  ─────────── */
  const condicaoDescricao = useMemo(
    () => getCondicaoDescricao(condicoes, condfin),
    [condicoes, condfin]
  );

  const parcelasTotal = useMemo(
    () => parcelas.reduce((sum, p) => sum + (p.Valor || 0), 0),
    [parcelas]
  );
  const isValorValido = useMemo(
    () => valorNF !== null && Math.abs(parcelasTotal - valorNF) < 0.01,
    [parcelasTotal, valorNF]
  );

  /* ───────────  Effects  ─────────── */
  useEffect(() => {
    if (data?.Pagamentos) {
      setParcelas(
        data.Pagamentos.map(
          (p): Parcela => ({
            Parcela: p.Parcela ?? "",
            Vencimento: ensureValidVencimento(p.Vencimento),
            Valor: p.Valor ?? 0,
          })
        )
      );
    } else {
      setParcelas([]);
    }

    setPixFields({
      chave_pix: data?.dados?.chave_pix ?? "",
      cpf_cnpj_destinatario: data?.dados?.cpf_cnpj_destinatario ?? "",
    });
  }, [data]);

  /* ───────────  Callbacks  ─────────── */
  const updateLocalParcela = useCallback(
    (idx: number, patch: Partial<Parcela>) => {
      setParcelas((prev) => {
        const next = [...prev];
        next[idx] = { ...next[idx], ...patch } as Parcela;
        return next;
      });
    },
    []
  );

  const handleSaveChanges = useCallback(() => {
    if (!isValorValido) {
      toast.error(
        "Não é possível salvar: O valor total das parcelas não corresponde ao valor da NF."
      );
      return;
    }
    setParcelasStore(parcelas);
    toast.success("Parcelas salvas com sucesso!");
    setOpen(false);
  }, [isValorValido, parcelas, setParcelasStore]);

  /* ───────────  Render  ─────────── */
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={isLoading}>
          <Edit className="mr-2 h-4 w-4" />
          {isLoading ? "Carregando..." : "Condição de Pagamento"}
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
              {/* Descrição */}
              <p className="text-sm text-muted-foreground">
                Condição de pagamento <strong>{condicaoDescricao}</strong>{" "}
                estabelecida no pedido.
              </p>

              {/* Parcelas */}
              <ScrollArea className="max-h-[300px] pr-2">
                {parcelas.map((p, idx) => {
                  const vencDate = parseDatePt(p.Vencimento);
                  return (
                    <div
                      key={p.Parcela || idx}
                      className="grid grid-cols-10 gap-2 items-end py-1"
                    >
                      {/* Nº parcela */}
                      <div className="col-span-2">
                        <Label htmlFor={`parc-${idx}`}>Parc.</Label>
                        <Input
                          id={`parc-${idx}`}
                          value={p.Parcela}
                          disabled
                          className="h-8 text-center"
                        />
                      </div>

                      {/* Vencimento */}
                      <div className="col-span-4 relative">
                        <Label htmlFor={`venc-${idx}`}>Vencimento</Label>
                        <Input
                          id={`venc-${idx}`}
                          type="date"
                          className={`h-8 ${
                            !p.Vencimento ? "border-red-500" : ""
                          }`}
                          value={
                            !isNaN(vencDate.getTime())
                              ? format(vencDate, "yyyy-MM-dd")
                              : ""
                          }
                          onChange={(e) => {
                            const newDate = new Date(
                              `${e.target.value}T00:00:00`
                            );
                            updateLocalParcela(idx, {
                              Vencimento: !isNaN(newDate.getTime())
                                ? fmtDatePt(newDate)
                                : "",
                            });
                          }}
                        />
                        {!p.Vencimento && (
                          <span className="text-red-500 text-xs absolute -bottom-5 left-0">
                            Data obrigatória
                          </span>
                        )}
                      </div>

                      {/* Valor */}
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
                          onValueChange={({ floatValue }) =>
                            updateLocalParcela(idx, { Valor: floatValue ?? 0 })
                          }
                          allowNegative={false}
                          className="h-8 w-full"
                        />
                      </div>
                    </div>
                  );
                })}
              </ScrollArea>

              {/* Validação valor total */}
              {!isValorValido && valorNF !== null && (
                <Alert variant="destructive">
                  <AlertTitle>Atenção!</AlertTitle>
                  <AlertDescription>
                    O valor total das parcelas (
                    <strong>
                      {parcelasTotal.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                    ) não corresponde ao valor total da nota fiscal (
                    <strong>
                      {valorNF.toLocaleString("pt-BR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                    ).
                  </AlertDescription>
                </Alert>
              )}

              {/* Dados PIX */}
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
                            setPixFields((p) => ({
                              ...p,
                              chave_pix: e.target.value,
                            }))
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
                            setPixFields((p) => ({
                              ...p,
                              cpf_cnpj_destinatario: e.target.value.replace(
                                /\D/g,
                                ""
                              ),
                            }))
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
