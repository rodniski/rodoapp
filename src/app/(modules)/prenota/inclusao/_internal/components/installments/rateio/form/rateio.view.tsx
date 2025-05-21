"use client";

import React, { useState, useEffect } from "react";
import {
  Label,
  Combobox,
  Input,
  Slider,
  Button,
  type ComboboxItem,
} from "ui";
import { formatCurrency, parseInputToNumber } from "utils";
import { Controller, FormProvider } from "react-hook-form";
import { useRateioForm } from "./rateio.hook";

interface RateioFormViewProps {
  filiaisOptions: ComboboxItem[];
  centroCustoOptions: ComboboxItem[];
  maxValorDisp: number;         // quanto RESTA globalmente
  maxPercentDisp: number;       // idem em %
  totalGeral: number;           // total da NF ─ usado no cálculo real
  form: ReturnType<typeof useRateioForm>["form"];
  onSubmit: ReturnType<typeof useRateioForm>["onSubmit"];
  isValid: boolean;
  className?: string;
}

export function RateioFormView({
  filiaisOptions,
  centroCustoOptions,
  maxValorDisp,
  maxPercentDisp,
  totalGeral,
  form,
  onSubmit,
  isValid,
  className = "",
}: RateioFormViewProps) {
  const {
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = form;

  /* visual do campo Valor (R$) */
  const [displayValor, setDisplayValor] = useState("");
  const [isValorFocused, setIsValorFocused] = useState(false);
  const watchedValor = watch("valor");

  useEffect(() => {
    if (!isValorFocused) {
      setDisplayValor(watchedValor > 0 ? formatCurrency(watchedValor) : "");
    }
  }, [watchedValor, isValorFocused]);

  const isAddingDisabled = !isValid || maxValorDisp < 0.01;

  /* ------------------------------------------------------------------ */
  return (
    <div className={`flex h-full flex-col ${className}`}>
      <FormProvider {...form}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-6 overflow-auto"
          noValidate
        >
          {/* FILIAL -------------------------------------------------- */}
          <Controller
            name="FIL"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label required className="text-sm font-medium">Filial</Label>
                <Combobox
                  items={filiaisOptions}
                  placeholder="Selecione a filial"
                  onSelect={(v) => field.onChange(v ?? "")}
                  selectedValue={field.value ?? ""}
                />
                {errors.FIL && (
                  <p className="pt-1 text-xs text-destructive">{errors.FIL.message}</p>
                )}
              </div>
            )}
          />

          {/* CENTRO DE CUSTO -------------------------------------- */}
          <Controller
            name="cc"
            control={control}
            render={({ field }) => (
              <div className="flex flex-col gap-1.5">
                <Label required className="text-sm font-medium">Centro de Custo</Label>
                <Combobox
                  items={centroCustoOptions}
                  placeholder="Centro de custo"
                  onSelect={(v) => field.onChange(v ?? "")}
                  selectedValue={field.value ?? ""}
                />
                {errors.cc && (
                  <p className="pt-1 text-xs text-destructive">{errors.cc.message}</p>
                )}
              </div>
            )}
          />

          {/* VALOR -------------------------------------------------- */}
          <Controller
            name="valor"
            control={control}
            render={({ field, fieldState }) => {
              const focusIn = () => {
                setIsValorFocused(true);
                const v = getValues("valor") ?? 0;
                setDisplayValor(v > 0 ? v.toFixed(2).replace(".", ",") : "");
              };
              const blur = () => {
                setIsValorFocused(false);
                const v = getValues("valor") ?? 0;
                setDisplayValor(v > 0 ? formatCurrency(v) : "");
              };
              const change = (e: React.ChangeEvent<HTMLInputElement>) => {
                const raw = e.target.value;
                setDisplayValor(raw);

                let num = parseInputToNumber(raw);
                if (isNaN(num)) num = 0;

                /* respeita o restante disponível */
                num = Math.min(Math.max(0, num), maxValorDisp);

                setValue("valor", num, { shouldValidate: true });

                /* percentual real = valor / totalGeral */
                const pRaw = totalGeral
                  ? (num / totalGeral) * 100
                  : 0;

                const p = Math.min(pRaw, maxPercentDisp);
                setValue("percent", parseFloat(p.toFixed(2)), { shouldValidate: true });
              };

              return (
                <div className="flex flex-col gap-1.5">
                  <Label required className="text-sm font-medium">Valor (R$)</Label>
                  <span className="text-xs text-muted-foreground">
                    Disponível: {formatCurrency(maxValorDisp)}
                  </span>
                  <Input
                    inputMode="decimal"
                    value={displayValor}
                    onFocus={focusIn}
                    onBlur={blur}
                    onChange={change}
                    placeholder={isValorFocused ? "0,00" : "R$ 0,00"}
                    disabled={maxValorDisp < 0.01}
                    className={`h-9 w-full rounded-md border text-right ${fieldState.error ? "border-destructive" : "border-input"}`}
                  />
                  {fieldState.error && (
                    <p className="pt-1 text-xs text-destructive">{fieldState.error.message}</p>
                  )}
                </div>
              );
            }}
          />

          {/* PORCENTAGEM ------------------------------------------- */}
          <Controller
            name="percent"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <Label required className="text-sm font-medium">Porcentagem (%)</Label>
                <span className="text-xs text-muted-foreground">
                  Máx: {maxPercentDisp.toFixed(2)}%
                </span>

                <div className="flex items-center gap-3">
                  <Slider
                    value={[field.value ?? 0]}
                    onValueChange={(v) => {
                      let n = Math.min(v[0] ?? 0, maxPercentDisp, 100);
                      setValue("percent", n, { shouldValidate: true });

                      /* novo valor baseado no total da NF */
                      let val = (n / 100) * totalGeral;
                      val = Math.min(val, maxValorDisp);
                      setValue("valor", parseFloat(val.toFixed(2)), { shouldValidate: true });
                    }}
                    max={100}
                    step={0.01}
                    disabled={maxPercentDisp < 0.01}
                    className="flex-grow"
                  />
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max={maxPercentDisp}
                    value={field.value ?? 0}
                    onChange={(e) => {
                      let n = parseFloat(e.target.value);
                      if (isNaN(n)) n = 0;
                      n = Math.min(Math.max(0, n), maxPercentDisp, 100);
                      setValue("percent", n, { shouldValidate: true });

                      let val = (n / 100) * totalGeral;
                      val = Math.min(val, maxValorDisp);
                      setValue("valor", parseFloat(val.toFixed(2)), { shouldValidate: true });
                    }}
                    className={`h-9 w-24 rounded-md border text-right ${fieldState.error ? "border-destructive" : "border-input"}`}
                    disabled={maxPercentDisp < 0.01}
                  />
                </div>

                {fieldState.error && (
                  <p className="pt-1 text-xs text-destructive">{fieldState.error.message}</p>
                )}
              </div>
            )}
          />

          {/* BOTÃO -------------------------------------------------- */}
          <Button
            type="submit"
            variant="default"
            disabled={isAddingDisabled}
            className="mt-4 w-full sm:w-auto self-center"
          >
            {isAddingDisabled && maxValorDisp < 0.01
              ? "Valor Total Alocado"
              : "Adicionar/Atualizar Rateio"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}
