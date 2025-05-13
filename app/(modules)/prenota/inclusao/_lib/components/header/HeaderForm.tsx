/**
 * HeaderForm.tsx
 */
"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Combobox,
  Input,
  DatePicker,
  Textarea,
  Label,
} from "ui";
import {
  PrioridadePopover,
  FornecedorDialog,
  XmlSearchInput,
  PedidoDialog,
} from "@inclusao/components";

import { usePreNotaStore } from "@inclusao/stores";
import type { FilialGeral } from "@login/types";
import { useAuxStore } from "@login/stores";
import { TIPOS_NF_OPTIONS } from "@prenota/config";
import type { PreNotaHeader } from "@inclusao/types";
import { toast } from "sonner";
import { isValid, isDate } from "date-fns";
import { formatDateBR, parseDateBR } from "utils";  

/* ---------- RHF + Zod ------------------------------------------------*/
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  headerSchema,
  type HeaderSchemaParsed,
} from "@inclusao/validation/prenota.schema";

// Tipo para o DatePicker
interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}
function isDateRange(date: any): date is DateRange {
  return typeof date === "object" && date !== null && "from" in date;
}

// Helper para garantir que o valor seja compatível com PreNotaHeader['DTINC']
function ensurePreNotaDateStringType(
  value: string | undefined
): PreNotaHeader["DTINC"] {
  if (value === "") {
    return ""; // Retorna string vazia se a entrada for string vazia
  }
  if (value && /^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
    // Se já for uma string no formato correto, faz o cast para o tipo específico.
    return value as `${number}/${number}/${number}`;
  }
  // Se for undefined ou uma string em formato inválido, retorna ""
  // para alinhar com PreNotaHeader['DTINC'] que permite string vazia.
  // Se PreNotaHeader['DTINC'] permitisse undefined, poderíamos retornar undefined aqui.
  // Como permite "", "" é um fallback seguro.
  return "";
}

export const HeaderForm = () => {
  const headerDraftFromStore = usePreNotaStore((state) => state.draft.header);
  const mode = usePreNotaStore((state) => state.mode);
  const setHeaderAction = usePreNotaStore((state) => state.setHeader);
  const isXmlMode = mode === "xml";

  const methods = useForm<HeaderSchemaParsed>({
    resolver: zodResolver(headerSchema),
    mode: "onChange",
    defaultValues: {
      ...headerDraftFromStore,
      // Garante que os campos opcionais no Zod que são strings em PreNotaHeader
      // sejam inicializados com "" se forem null/undefined no store.
      DTINC: headerDraftFromStore.DTINC || "",
      CHVNF: headerDraftFromStore.CHVNF || "",
      OBS: headerDraftFromStore.OBS || "",
      CGCPIX: headerDraftFromStore.CGCPIX || "",
      CHAVEPIX: headerDraftFromStore.CHAVEPIX || "",
      JUSTIFICATIVA: headerDraftFromStore.JUSTIFICATIVA || "",
      tiporodo: headerDraftFromStore.tiporodo || "",
      TIPO: headerDraftFromStore.TIPO || "N",
      prioridade: headerDraftFromStore.prioridade || "",
      OLDSERIE: headerDraftFromStore.OLDSERIE || "",
    },
  });

  const {
    register,
    control,
    formState: { errors },
    reset,
    watch,
    setValue,
    trigger,
  } = methods;

  const prevMode = useRef<typeof mode>(mode);
  useEffect(() => {
    if (prevMode.current !== mode) {
      const newDraftHeader = usePreNotaStore.getState().draft.header;
      console.log(
        "[HeaderForm] Modo mudou. Resetando RHF com header do Zustand:",
        newDraftHeader
      );
      reset({
        ...newDraftHeader,
        DTINC: newDraftHeader.DTINC || "",
        CHVNF: newDraftHeader.CHVNF || "",
        OBS: newDraftHeader.OBS || "",
        CGCPIX: newDraftHeader.CGCPIX || "",
        CHAVEPIX: newDraftHeader.CHAVEPIX || "",
        JUSTIFICATIVA: newDraftHeader.JUSTIFICATIVA || "",
        tiporodo: newDraftHeader.tiporodo || "",
        TIPO: newDraftHeader.TIPO || "N",
        prioridade: newDraftHeader.prioridade || "",
        OLDSERIE: newDraftHeader.OLDSERIE || "",
      });
      prevMode.current = mode;
    }
  }, [mode, reset]);

  /* Sincroniza RHF -> Zustand */
  useEffect(() => {
    const subscription = watch((valuesFromRHF) => {
      // console.log("[HeaderForm] RHF mudou (raw):", valuesFromRHF);

      const headerForStore: Partial<PreNotaHeader> = {
        // Campos obrigatórios que são string em ambos e não mudam de tipo
        FILIAL: valuesFromRHF.FILIAL,
        OPCAO: valuesFromRHF.OPCAO, // Literal 3
        TIPO: valuesFromRHF.TIPO, // Enum "N" | "S"
        FORNECEDOR: valuesFromRHF.FORNECEDOR,
        LOJA: valuesFromRHF.LOJA,
        DOC: valuesFromRHF.DOC,
        SERIE: valuesFromRHF.SERIE,
        ESPECIE: valuesFromRHF.ESPECIE,
        CONDFIN: valuesFromRHF.CONDFIN,
        USERAPP: valuesFromRHF.USERAPP,

        OLDSERIE: valuesFromRHF.OLDSERIE ?? "",
        CHVNF: valuesFromRHF.CHVNF ?? "",
        OBS: valuesFromRHF.OBS ?? "",
        JUSTIFICATIVA: valuesFromRHF.JUSTIFICATIVA ?? "",
        CGCPIX: valuesFromRHF.CGCPIX ?? "",
        CHAVEPIX: valuesFromRHF.CHAVEPIX ?? "",
        tiporodo: valuesFromRHF.tiporodo ?? "",
        prioridade: valuesFromRHF.prioridade ?? "",

        // Campo DTINC com tratamento especial de tipo
        DTINC: ensurePreNotaDateStringType(valuesFromRHF.DTINC), // Usa a função helper corrigida
      };
      // console.log("[HeaderForm] Atualizando Zustand com (mapeado):", headerForStore);
      setHeaderAction(headerForStore);
    });
    return () => subscription.unsubscribe();
  }, [watch, setHeaderAction]);

  const filiais = useAuxStore((s) => s.filiais);
  const filialOptions = useMemo(
    () =>
      filiais.map((f: FilialGeral) => ({
        value: f.numero,
        label: `${f.numero} – ${f.filial ?? `Filial ${f.numero}`}`,
      })),
    [filiais]
  );

  const watchedDtInc = watch("DTINC"); // Este é string "DD/MM/YYYY" ou ""
  const dateValueForPicker = useMemo(() => {
    // Converte para Date | undefined para o DatePicker
    if (!watchedDtInc) return undefined;
    const parsed = parseDateBR(watchedDtInc);
    return parsed && isValid(parsed) ? parsed : undefined;
  }, [watchedDtInc]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="h-full w-full flex flex-col items-center justify-center gap-5 pt-[70px]"
      >
        <Card className="w-full max-w-5xl">
          <CardHeader>
            <CardTitle>Importar Nota Fiscal</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Chave NF-e</Label>
              <XmlSearchInput />
            </div>
            <div className="flex flex-col gap-2">
              <Label required className="text-sm font-medium">
                Fornecedor
              </Label>
              <FornecedorDialog setValueRHF={setValue} triggerRHF={trigger} />
            </div>
          </CardContent>
        </Card>

        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="flex flex-col gap-6 pt-6">
              <div className="flex flex-col gap-2">
                <Label className="text-sm font-medium">Pedido de Compra</Label>
                <Controller
                  control={control}
                  name="PEDIDO"
                  render={({ field }) => (
                    <PedidoDialog
                      value={field.value ?? ""}
                      onChange={(numeroPedido, condicao) => {
                        setValue("PEDIDO", numeroPedido || "", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        if (condicao) {
                          setValue("CONDFIN", condicao, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }
                      }}
                    />
                  )}
                />
                {errors.PEDIDO && (
                  <p className="text-xs text-destructive">
                    {errors.PEDIDO.message}
                  </p>
                )}
              </div>
              <div className="flex gap-3 items-end">
                <div className="flex-1 flex flex-col gap-2">
                  <Label className="text-sm font-medium">
                    Tipo de Operação
                  </Label>
                  <Controller
                    control={control}
                    name="tiporodo"
                    render={({ field }) => (
                      <Combobox
                        items={TIPOS_NF_OPTIONS}
                        selectedValue={field.value ?? ""}
                        onSelect={(value) => field.onChange(value ?? "")}
                        placeholder="Selecione o tipo de operação"
                      />
                    )}
                  />
                  {errors.tiporodo && (
                    <p className="text-xs text-destructive">
                      {errors.tiporodo.message}
                    </p>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <Label className="text-sm font-medium">Prioridade</Label>
                  <Controller
                    control={control}
                    name="prioridade"
                    render={({ field }) => (
                      <PrioridadePopover
                        prioridade={field.value ?? ""}
                        justificativa={watch("JUSTIFICATIVA") ?? ""}
                        onChange={(prioridadeValue, justificativa) => {
                          const prioridadeCorrigida =
                            prioridadeValue === "Média"
                              ? "Media"
                              : prioridadeValue;
                          setValue(
                            "prioridade",
                            prioridadeCorrigida as HeaderSchemaParsed["prioridade"],
                            { shouldValidate: true, shouldDirty: true }
                          );
                          setValue("JUSTIFICATIVA", justificativa || "", {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                        }}
                      />
                    )}
                  />
                  {errors.prioridade && (
                    <p className="text-xs text-destructive">
                      {errors.prioridade.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-col gap-6 pt-6">
              <div className="flex gap-3 items-end">
                <div className="flex-1 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">
                    Documento
                  </Label>
                  <Input
                    disabled={isXmlMode}
                    placeholder="Número"
                    {...register("DOC")}
                  />
                  {errors.DOC && (
                    <p className="text-xs text-destructive">
                      {errors.DOC.message}
                    </p>
                  )}
                </div>
                <div className="w-32 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">
                    Série
                  </Label>
                  <Input
                    disabled={isXmlMode}
                    placeholder="Série"
                    {...register("SERIE")}
                  />
                  {errors.SERIE && (
                    <p className="text-xs text-destructive">
                      {errors.SERIE.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3 items-end">
                <div className="flex-1 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">
                    Emissão
                  </Label>
                  <Controller
                    control={control}
                    name="DTINC" // No RHF, este é string "DD/MM/YYYY" ou "" (validado pelo Zod)
                    render={(
                      { field } // field.value é string "DD/MM/YYYY" ou ""
                    ) => (
                      <DatePicker
                        disabled={isXmlMode}
                        value={dateValueForPicker} // Para o DatePicker, passamos Date | undefined
                        placeholder="dd/mm/aaaa"
                        onChange={(date) => {
                          // date aqui pode ser Date | DateRange | null | undefined
                          let dateToFormat: Date | undefined = undefined;
                          if (isDateRange(date)) {
                            console.warn(
                              "DatePicker retornou DateRange, usando 'from'. Verifique a configuração do DatePicker."
                            );
                            dateToFormat = date.from;
                          } else if (isDate(date)) {
                            dateToFormat = date;
                          }
                          // Atualiza RHF com string formatada "DD/MM/YYYY" ou ""
                          setValue(
                            "DTINC",
                            dateToFormat && isValid(dateToFormat)
                              ? formatDateBR(dateToFormat)
                              : "",
                            { shouldValidate: true, shouldDirty: true }
                          );
                        }}
                      />
                    )}
                  />
                  {errors.DTINC && (
                    <p className="text-xs text-destructive">
                      {errors.DTINC.message}
                    </p>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">
                    Filial
                  </Label>
                  <Controller
                    control={control}
                    name="FILIAL"
                    render={({ field }) => (
                      <Combobox
                        items={filialOptions}
                        disabled={isXmlMode}
                        placeholder="Selecione a filial"
                        selectedValue={field.value ?? ""}
                        onSelect={(value) => {
                          field.onChange(value ?? "");
                          if (value)
                            toast.success(`Filial alterada → ${value}`);
                        }}
                      />
                    )}
                  />
                  {errors.FILIAL && (
                    <p className="text-xs text-destructive">
                      {errors.FILIAL.message}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full max-w-5xl">
          <CardContent className="pt-6">
            <Label className="text-sm font-medium pb-2 block">
              Observações
            </Label>
            <Textarea
              placeholder="Adicione observações…"
              {...register("OBS")}
            />
            {errors.OBS && (
              <p className="text-xs text-destructive pt-1">
                {errors.OBS.message}
              </p>
            )}
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};
