// _lib/components/stepper/header/RateioForm.tsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Label, Combobox, Input, Slider, Button } from "ui";
import { formatCurrency, parseInputToNumber } from "utils";
import { toast } from "sonner";
import type { Rateio as RateioType } from "@inclusao/types";

// --- RHF + Zod Imports ---
import {
  useForm,
  FormProvider,
  Controller,
  Control,
  FieldErrors,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  rateioInputSchema,
  RateioInputSchemaParsed,
} from "@inclusao/validation/prenota.schema";

// --- Tipos ---
interface ComboboxOption {
  value: string;
  label: string;
}
interface RateioFormProps {
  filiaisOptions: ComboboxOption[];
  centroCustoOptions: ComboboxOption[];
  totalGeral: number;
  rateios: RateioType[];
  addRateio: (rateio: RateioType) => void;
}

export function RateioForm({
  filiaisOptions,
  centroCustoOptions,
  totalGeral,
  rateios,
  addRateio,
}: RateioFormProps) {
  // --- Cálculos de Contexto Interno ---
  const totalDivisaoSalva = useMemo(
    () => rateios.reduce((acc, row) => acc + (row.valor || 0), 0), // Atualizado para valor
    [rateios]
  );
  const maxValorDisponivel = useMemo(
    () => Math.max(0, parseFloat((totalGeral - totalDivisaoSalva).toFixed(2))),
    [totalGeral, totalDivisaoSalva]
  );
  const maxPercentualDisponivel = useMemo(
    () =>
      totalGeral > 0
        ? Math.max(
            0,
            parseFloat(((maxValorDisponivel / totalGeral) * 100).toFixed(2))
          )
        : 100,
    [totalGeral, maxValorDisponivel]
  );

  // --- RHF Setup ---
  const methods = useForm<RateioInputSchemaParsed>({
    resolver: zodResolver(rateioInputSchema),
    mode: "onChange",
    defaultValues: { FIL: "", cc: "", valor: 0, percent: 0 }, // Atualizado para campos corretos
  });

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = methods;

  // --- Observador (APENAS para percent) ---
  const watchedPerc = watch("percent");

  // --- Efeito ADICIONADO (APENAS Percentual -> Valor) ---
  useEffect(() => {
    const currentPerc = typeof watchedPerc === "number" ? watchedPerc : 0;
    const calculatedValor = (currentPerc / 100) * totalGeral;
    const limitedValor = Math.min(calculatedValor, maxValorDisponivel);
    const finalValor = parseFloat(limitedValor.toFixed(2));

    const currentRHFValor = methods.getValues("valor") ?? 0;

    if (!isNaN(finalValor) && Math.abs(finalValor - currentRHFValor) > 0.005) {
      setValue("valor", finalValor, { shouldValidate: true });
    }
  }, [watchedPerc, totalGeral, maxValorDisponivel, setValue, methods]);

  // --- Handler de Submissão (calcula % final a partir do valor submetido) ---
  const handleAddRateioSubmit = useCallback(
    (data: RateioInputSchemaParsed) => {
      if (data.valor > maxValorDisponivel + 0.001) {
        toast.error("Valor excede o disponível");
        return;
      }
      const valorFinal = Math.min(data.valor, maxValorDisponivel);
      const percFinal =
        totalGeral > 0
          ? parseFloat(((valorFinal / totalGeral) * 100).toFixed(2))
          : 0;
      const novoRateio: RateioType = {
        seq: String(rateios.length + 1).padStart(3, "0"),
        id: `rateio-${Date.now()}`,
        FIL: data.FIL,
        cc: data.cc,
        percent: percFinal,
        valor: valorFinal,
        REC: 0,
      };
      addRateio(novoRateio);
      toast.success("Rateio adicionado!");
      reset();
    },
    [addRateio, rateios, maxValorDisponivel, totalGeral, reset]
  );

  // --- Estado local para formatação do Input de Valor ---
  const [displayValor, setDisplayValor] = useState<string>("");
  const [isValorFocused, setIsValorFocused] = useState<boolean>(false);

  // --- Desabilitar botão ---
  const isAddingDisabled = !isValid || maxValorDisponivel < 0.01;

  // --- Renderização ---
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleAddRateioSubmit)}
        className="p-4 border-b bg-card"
        noValidate
      >
        {/* Comboboxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Filial */}
          <div className="flex flex-col gap-1.5">
            <Label required className="font-medium text-sm" htmlFor="FIL">
              Filial
            </Label>
            <Controller
              name="FIL"
              control={control}
              render={({ field }) => (
                <Combobox
                  items={filiaisOptions}
                  placeholder="Selecione a filial"
                  onSelect={(v) => field.onChange(v ?? "")}
                  selectedValue={field.value ?? ""}
                />
              )}
            />
            {errors.FIL && (
              <p className="text-xs text-destructive pt-1">
                {errors.FIL.message}
              </p>
            )}
          </div>
          {/* Centro de Custo */}
          <div className="flex flex-col gap-1.5">
            <Label required className="font-medium text-sm" htmlFor="cc">
              Centro de Custo
            </Label>
            <Controller
              name="cc"
              control={control}
              render={({ field }) => (
                <Combobox
                  items={centroCustoOptions}
                  placeholder="Centro de custo"
                  onSelect={(v) => field.onChange(v ?? "")}
                  selectedValue={field.value ?? ""}
                />
              )}
            />
            {errors.cc && (
              <p className="text-xs text-destructive pt-1">
                {errors.cc.message}
              </p>
            )}
          </div>
        </div>

        {/* Inputs Valor e Percentual */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Input Valor */}
          <Controller
            name="valor"
            control={control}
            render={({ field, fieldState }) => {
              useEffect(() => {
                const numericValue = field.value ?? 0;
                if (!isValorFocused) {
                  setDisplayValor(
                    numericValue > 0 ? formatCurrency(numericValue) : ""
                  );
                }
              }, [field.value, isValorFocused]);

              const handleFocus = () => {
                setIsValorFocused(true);
                const v = field.value ?? 0;
                setDisplayValor(
                  v > 0 ? String(v.toFixed(2)).replace(".", ",") : ""
                );
              };
              const handleInputChange = (
                e: React.ChangeEvent<HTMLInputElement>
              ) => {
                setDisplayValor(e.target.value);
              };
              const handleBlur = () => {
                setIsValorFocused(false);
                const parsedValue = parseInputToNumber(displayValor);
                const finalValue = parseFloat(parsedValue.toFixed(2));
                field.onChange(isNaN(finalValue) ? 0 : finalValue);
              };
              return (
                <div className="flex flex-col gap-1.5">
                  <div className="w-full flex justify-between">
                    <Label
                      required
                      className="font-medium"
                      htmlFor={field.name}
                    >
                      Valor
                    </Label>
                    <span className="text-muted-foreground text-xs font-normal">
                      Restante:{" "}
                      {maxValorDisponivel.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                  <Input
                    id={field.name}
                    type="text"
                    inputMode="decimal"
                    value={displayValor}
                    onChange={handleInputChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    className={`text-right text-xs h-9 w-full rounded-md border bg-background px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      fieldState.error ? "border-destructive" : "border-input"
                    }`}
                    placeholder={isValorFocused ? "0,00" : "R$ 0,00"}
                    disabled={totalGeral <= 0 || maxValorDisponivel < 0.01}
                    aria-invalid={!!fieldState.error}
                  />
                  {fieldState.error && (
                    <p className="text-xs text-destructive pt-1">
                      {fieldState.error.message}
                    </p>
                  )}
                </div>
              );
            }}
          />
          {/* Slider e Input Percentual */}
          <Controller
            name="percent"
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <div className="w-full flex justify-between">
                  <Label
                    required
                    className="font-medium text-sm"
                    htmlFor={field.name}
                  >
                    Porcentagem
                  </Label>
                  <span className="text-muted-foreground text-xs font-normal">
                    Máx: {maxPercentualDisponivel.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Slider
                    value={[field.value ?? 0]}
                    onValueChange={(v) => field.onChange(v[0] ?? 0)}
                    max={100}
                    step={0.01}
                    className="flex-grow"
                    disabled={totalGeral <= 0 || maxPercentualDisponivel < 0.01}
                    aria-label="Porcentagem Slider"
                  />
                  <Input
                    id={field.name}
                    type="number"
                    step="0.01"
                    min="0"
                    max={maxPercentualDisponivel}
                    value={field.value ?? 0}
                    onChange={(e) => {
                      const n = parseFloat(e.target.value);
                      field.onChange(isNaN(n) ? 0 : n);
                    }}
                    className={`h-9 w-24 text-right text-xs rounded-md border bg-background px-2 py-1 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                      fieldState.error ? "border-destructive" : "border-input"
                    }`}
                    placeholder="0.00"
                    disabled={totalGeral <= 0 || maxPercentualDisponivel < 0.01}
                    aria-invalid={!!fieldState.error}
                  />
                </div>
                {fieldState.error && (
                  <p className="text-xs text-destructive pt-1">
                    {fieldState.error.message}
                  </p>
                )}
              </div>
            )}
          />
        </div>

        {/* Botão Adicionar */}
        <div className="flex justify-center sm:justify-end">
          <Button
            type="submit"
            variant="default"
            disabled={isAddingDisabled}
            className="w-full sm:w-auto"
          >
            {isAddingDisabled && maxValorDisponivel < 0.01
              ? "Valor Total Alocado"
              : "Adicionar Rateio"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
