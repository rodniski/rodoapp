/**
 * HeaderForm.tsx
 * -------------------------------------------------------------------
 * • RHF (v7) + Zod v4 validam campo-a-campo.
 * • Toda alteração do formulário é refletida no Zustand (`setHeader`),
 *   mas sem loops infinitos: usamos `form.watch()` com subscribe.
 * • Quando o modo muda para **xml** o formulário é recarregado
 *   (cabeçalho veio do arquivo) – apenas nessa transição.
 * ------------------------------------------------------------------*/

"use client";

import React, { useEffect, useMemo, useRef } from "react";
import {
  Card, CardHeader, CardTitle, CardContent,
  Combobox, Input, DatePicker, Textarea,
  Label,
} from "ui";
import {
  PrioridadePopover, FornecedorDialog,
  XmlSearchInput,    PedidoDialog,
} from "@inclusao/components";

import { usePreNotaStore } from "@inclusao/stores";
import { useAuxStore     } from "@login/stores";
import { TIPOS_NF_OPTIONS } from "@prenota/stores";
import type { FilialGeral } from "@login/types";

import { toast } from "sonner";
import { isValid } from "date-fns";
import { formatDateBR, parseDateBR } from "utils";

/* ---------- RHF + Zod ------------------------------------------------*/
import { zodResolver }  from "@hookform/resolvers/zod";
import {
  useForm, Controller, FormProvider,
} from "react-hook-form";
import {
  headerSchema,
  type HeaderSchemaParsed,
} from "@inclusao/validation/prenota.schema";

/* ==================================================================== */
export const HeaderForm = () => {
  /* Zustand ----------------------------------------------------------- */
  const store         = usePreNotaStore.getState();
  const headerDraft   = store.draft.header;     // snapshot
  const mode          = store.mode;
  const isXmlMode     = mode === "xml";

  /* RHF ----------------------------------------------------------------*/
  const methods = useForm<HeaderSchemaParsed>({
    resolver: zodResolver(headerSchema),
    mode    : "onChange",
    defaultValues: headerDraft,
  });

  const { register, control, formState:{ errors }, reset, watch } = methods;

  /* Re-hidrata só quando o modo mudar (ex.: manual → xml) --------------*/
  const prevMode = useRef<typeof mode>(mode);   // 👈 valor inicial obrigatório

  useEffect(() => {
    if (prevMode.current !== mode) {
      /* o draft do Zustand foi alterado (ex.: carregou XML) */
      reset(usePreNotaStore.getState().draft.header);
      prevMode.current = mode;                  // atualiza ref
    }
  }, [mode, reset])

  /* Propaga alterações pro Zustand (sem loop de render) ----------------*/
  useEffect(() => {
    /** inscreve-se nas mudanças do formulário */
    const subscription = watch((vals) => {
      usePreNotaStore.getState().setHeader(vals);
    });
  
    /* clean-up correto (React exige retornar função) */
    return () => subscription.unsubscribe();
  }, [watch]);

  /* Combobox Filial ----------------------------------------------------*/
  const filiais = useAuxStore((s) => s.filiais);
  const filialOptions = useMemo(
    () => filiais.map((f: FilialGeral) => ({
      value: f.numero,
      label: `${f.numero} – ${f.filial ?? `Filial ${f.numero}`}`,
    })), [filiais],
  );

  /* Date helper --------------------------------------------------------*/
  const parsedDate = parseDateBR(watch("DTINC"));
  const dateValue  = parsedDate && isValid(parsedDate) ? parsedDate : undefined;

  /* ------------------------------------------------------------------- */
  return (
    <FormProvider {...methods}>
      <form onSubmit={(e)=>e.preventDefault()}
            className="h-full w-full flex flex-col items-center justify-center gap-5">

        {/* 1 ▸ Importação XML / Fornecedor ------------------------------*/}
        <Card className="w-full max-w-5xl">
          <CardHeader><CardTitle>Importar Nota Fiscal</CardTitle></CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label className="text-sm font-medium">Chave NF-e</Label>
              <XmlSearchInput />
            </div>
            <div className="flex flex-col gap-2">
              <Label required className="text-sm font-medium">Fornecedor</Label>
              <FornecedorDialog />
            </div>
          </CardContent>
        </Card>

        {/* 2 ▸ Demais campos -------------------------------------------*/}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ESQUERDA */}
          <Card>
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Pedido de compra */}
              <div className="flex flex-col gap-2">
                <Label required className="text-sm font-medium">Pedido de Compra</Label>
                <PedidoDialog />
              </div>

              {/* Tipo + Prioridade */}
              <div className="flex gap-3 items-end">
                <div className="flex-1 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">Tipo de NF</Label>
                  <Controller
                    control={control}
                    name="tiporodo"
                    render={({ field }) => (
                      <Combobox
                        items={TIPOS_NF_OPTIONS}
                        selectedValue={field.value}
                        onSelect={field.onChange}
                        placeholder="Selecione o tipo"
                      />
                    )}
                  />
                  {errors.tiporodo && (
                    <p className="text-xs text-destructive">{errors.tiporodo.message}</p>
                  )}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">Prioridade</Label>
                  <PrioridadePopover />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DIREITA */}
          <Card>
            <CardContent className="flex flex-col gap-6 pt-6">
              {/* Documento + Série */}
              <div className="flex gap-3 items-end">
                <div className="flex-1 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">Documento</Label>
                  <Input disabled={isXmlMode} placeholder="Número" {...register("DOC")} />
                  {errors.DOC && <p className="text-xs text-destructive">{errors.DOC.message}</p>}
                </div>
                <div className="w-32 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">Série</Label>
                  <Input disabled={isXmlMode} placeholder="Série" {...register("SERIE")} />
                  {errors.SERIE && <p className="text-xs text-destructive">{errors.SERIE.message}</p>}
                </div>
              </div>

              {/* Emissão + Filial */}
              <div className="flex gap-3 items-end">
                <div className="flex-1 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">Emissão</Label>
                  <Controller
                    control={control}
                    name="DTINC"
                    render={({ field }) => (
                      <DatePicker
                        disabled={isXmlMode}
                        value={dateValue}
                        placeholder="dd/mm/aaaa"
                        onChange={(d)=>
                          field.onChange(d && isValid(d) ? formatDateBR(d as Date) : "")
                        }
                      />
                    )}
                  />
                  {errors.DTINC && <p className="text-xs text-destructive">{errors.DTINC.message}</p>}
                </div>
                <div className="flex-1 flex flex-col gap-2">
                  <Label required className="text-sm font-medium">Filial</Label>
                  <Controller
                    control={control}
                    name="FILIAL"
                    render={({ field }) => (
                      <Combobox
                        items={filialOptions}
                        disabled={isXmlMode}
                        placeholder="Selecione a filial"
                        selectedValue={field.value}
                        onSelect={(v)=>{
                          field.onChange(v);
                          v && toast.success(`Filial alterada → ${v}`);
                        }}
                      />
                    )}
                  />
                  {errors.FILIAL && <p className="text-xs text-destructive">{errors.FILIAL.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 3 ▸ Observações ---------------------------------------------*/}
        <Card className="w-full max-w-5xl">
          <CardContent>
            <Label className="text-sm font-medium pb-3">Observações</Label>
            <Textarea placeholder="Adicione observações…" {...register("OBS")} />
          </CardContent>
        </Card>
      </form>
    </FormProvider>
  );
};
