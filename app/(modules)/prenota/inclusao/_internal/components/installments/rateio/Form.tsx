"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Label, Combobox, Input, Slider, Button, ComboboxItem } from "ui";
import { formatCurrency, parseInputToNumber } from "utils";
import { toast } from "sonner";
import type { Rateio as RateioType } from "@inclusao/types";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, Controller } from "react-hook-form";
import {
  rateioInputSchema,
  type RateioInputSchemaParsed,
} from "@inclusao/validation/prenota.schema";

interface RateioFormProps {
  filiaisOptions: ComboboxItem[];
  centroCustoOptions: ComboboxItem[];
  totalGeral: number;
  rateios: RateioType[];
  addRateio: (rateio: RateioType) => void;
  updateRateio: (idOuSeq: string, rateioPatch: Partial<RateioType>) => void;
}

export function RateioForm({
  filiaisOptions,
  centroCustoOptions,
  totalGeral,
  rateios,
  addRateio,
  updateRateio,
}: RateioFormProps) {
  const totalJaRateadoNoStore = useMemo(
    () => rateios.reduce((acc, row) => acc + (row.valor || 0), 0),
    [rateios]
  );
  const maxValorDisponivelGlobalmente = useMemo(
    () => Math.max(0, parseFloat((totalGeral - totalJaRateadoNoStore).toFixed(2))),
    [totalGeral, totalJaRateadoNoStore]
  );
  // maxPercentualDisponivelGlobalmente é o percentual do que resta globalmente
  const maxPercentualParaNovoOuIncremento = useMemo(
    () =>
      totalGeral > 0
        ? Math.min(100, parseFloat(((maxValorDisponivelGlobalmente / totalGeral) * 100).toFixed(2)))
        : (maxValorDisponivelGlobalmente > 0 ? 100 : 0),
    [totalGeral, maxValorDisponivelGlobalmente]
  );


  const methods = useForm<RateioInputSchemaParsed>({
    resolver: zodResolver(rateioInputSchema),
    mode: "onChange",
    defaultValues: { FIL: "", cc: "", valor: 0, percent: 0 },
  });

  const {
    handleSubmit,
    control,
    watch, // Usado para observar FIL e cc para resetar valor/percent
    setValue,
    reset,
    formState: { errors, isValid, touchedFields },
    getValues,
  } = methods;

  const watchedFilial = watch("FIL");
  const watchedCc = watch("cc");

  // Efeito para resetar valor/percent se FIL ou CC mudarem,
  // pois os limites e a lógica de add/update dependem dessa combinação.
  useEffect(() => {
    if (touchedFields.FIL || touchedFields.cc) {
      setValue("valor", 0, { shouldValidate: true, shouldTouch: false });
      setValue("percent", 0, { shouldValidate: true, shouldTouch: false });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFilial, watchedCc]); // Não incluir setValue para evitar loops

  const handleAddRateioSubmit = useCallback(
    (data: RateioInputSchemaParsed) => {
      // data.valor e data.percent do formulário representam o INCREMENTO
      // que o utilizador quer adicionar, já limitado pelo maxValorDisponivelGlobalmente
      // através dos handlers onChange dos inputs.

      let valorIncremento = data.valor; // Este é o valor do formulário
      let percentIncremento = data.percent; // Este é o percentual do formulário

      // Segurança final: recalcula o percentual do incremento com base no valor do incremento
      // para garantir consistência se o utilizador mexeu em ambos os campos de forma estranha.
      if (touchedFields.valor && !touchedFields.percent) { // Se valor foi o último tocado
        percentIncremento = totalGeral > 0 ? parseFloat(((valorIncremento / totalGeral) * 100).toFixed(2)) : (valorIncremento > 0 ? 100 :0);
      } else if (touchedFields.percent && !touchedFields.valor) { // Se percentual foi o último tocado
         valorIncremento = parseFloat(((percentIncremento / 100) * totalGeral).toFixed(2));
      }
      // Se ambos foram tocados, assume que o último `setValue` nos `onChange` deixou-os consistentes.

      // Garante que o incremento não seja negativo e não exceda o disponível globalmente
      valorIncremento = Math.max(0, Math.min(valorIncremento, maxValorDisponivelGlobalmente));
      percentIncremento = totalGeral > 0 ? parseFloat(((valorIncremento / totalGeral) * 100).toFixed(2)) : (valorIncremento > 0 ? 100 :0);


      const existingRateio = rateios.find(
        (r) => r.FIL === data.FIL && r.cc === data.cc
      );

      if (existingRateio) {
        const valorOriginalExistente = existingRateio.valor || 0;
        
        const novoValorTotalParaRateio = parseFloat((valorOriginalExistente + valorIncremento).toFixed(2));
        
        // Recalcula o percentual total com base no NOVO VALOR TOTAL do rateio
        const novoPercentualTotalParaRateio = totalGeral > 0
            ? parseFloat(((novoValorTotalParaRateio / totalGeral) * 100).toFixed(2))
            : (novoValorTotalParaRateio > 0 ? 100 : 0);

        // Validação para o valor total do rateio atualizado
        const maxValorAbsolutoPermitidoParaEsteRateio = parseFloat((valorOriginalExistente + maxValorDisponivelGlobalmente).toFixed(2));

        if (novoValorTotalParaRateio > maxValorAbsolutoPermitidoParaEsteRateio + 0.001) { // 0.001 de tolerância
             toast.error(`A soma para ${data.FIL}/${data.cc} (${formatCurrency(novoValorTotalParaRateio)}) excederia o valor máximo permitido para este rateio (${formatCurrency(maxValorAbsolutoPermitidoParaEsteRateio)}). O incremento máximo seria ${formatCurrency(maxValorDisponivelGlobalmente)}.`);
             return;
        }
        
        updateRateio(existingRateio.id || existingRateio.seq, {
          valor: novoValorTotalParaRateio,
          percent: novoPercentualTotalParaRateio,
        });
        toast.success(`Rateio para ${data.FIL}/${data.cc} atualizado! Novo total: ${formatCurrency(novoValorTotalParaRateio)} (${novoPercentualTotalParaRateio.toFixed(2)}%)`);
      } else {
        // Adiciona novo rateio
        if (valorIncremento <= 0 && percentIncremento <=0) {
            toast.info("Valor ou percentual deve ser maior que zero para adicionar novo rateio.");
            return;
        }
        const novoRateio: RateioType = {
          seq: String(rateios.length + 1).padStart(3, "0"),
          id: `rateio-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          FIL: data.FIL,
          cc: data.cc,
          percent: percentIncremento,
          valor: valorIncremento,
          REC: 0,
        };
        addRateio(novoRateio);
        toast.success("Novo rateio adicionado!");
      }

      reset({ FIL: data.FIL, cc: data.cc, valor: 0, percent: 0 });
    },
    [
      addRateio, updateRateio, rateios,
      maxValorDisponivelGlobalmente, totalGeral,
      reset, touchedFields // Adicionado touchedFields
    ]
  );

  const [displayValor, setDisplayValor] = useState<string>("");
  const [isValorFocused, setIsValorFocused] = useState<boolean>(false);
  
  // Watch valor field for formatting display
  const watchedValor = watch("valor");
  
  // Effect to update displayValor when field.value changes (moved from inside render)
  useEffect(() => {
    const rhfValue = watchedValor ?? 0;
    if (!isValorFocused) {
      setDisplayValor(rhfValue > 0 ? formatCurrency(rhfValue) : "");
    }
  }, [watchedValor, isValorFocused]);

  // Desabilitar botão se o formulário não for válido ou se não houver mais valor/percentual para alocar
  const isAddingDisabled = !isValid || maxValorDisponivelGlobalmente < 0.01;

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(handleAddRateioSubmit)}
        className="p-4 border-b bg-card"
        noValidate
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Filial */}
          <div>
            <Label required className="font-medium text-sm" htmlFor="FIL">Filial</Label>
            <Controller
              name="FIL" control={control}
              render={({ field }) => (
                <Combobox
                  items={filiaisOptions} placeholder="Selecione a filial"
                  onSelect={(v) => field.onChange(v ?? "")}
                  selectedValue={field.value ?? ""}
                />
              )}
            />
            {errors.FIL && <p className="text-xs text-destructive pt-1">{errors.FIL.message}</p>}
          </div>
          {/* Centro de Custo */}
          <div>
            <Label required className="font-medium text-sm" htmlFor="cc">Centro de Custo</Label>
            <Controller
              name="cc" control={control}
              render={({ field }) => (
                <Combobox
                  items={centroCustoOptions} placeholder="Centro de custo"
                  onSelect={(v) => field.onChange(v ?? "")}
                  selectedValue={field.value ?? ""}
                />
              )}
            />
            {errors.cc && <p className="text-xs text-destructive pt-1">{errors.cc.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Input Valor */}
          <Controller
            name="valor" control={control}
            render={({ field, fieldState }) => {

              const handleValorFocus = () => {
                setIsValorFocused(true);
                const rhfValue = getValues("valor") ?? 0;
                setDisplayValor(rhfValue > 0 ? String(rhfValue.toFixed(2)).replace(".", ",") : "");
              };

              const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const rawValue = e.target.value;
                setDisplayValor(rawValue); // Atualiza o display imediatamente

                const parsedNum = parseInputToNumber(rawValue);
                let numericValue = parseFloat(parsedNum.toFixed(2));

                if (isNaN(numericValue)) numericValue = 0;
                
                numericValue = Math.min(numericValue, maxValorDisponivelGlobalmente);
                numericValue = Math.max(0, numericValue);

                setValue("valor", numericValue, { shouldValidate: true }); // Atualiza RHF 'valor'

                let correspondingPercent = totalGeral > 0 ? (numericValue / totalGeral) * 100 : 0;
                if (totalGeral === 0 && numericValue > 0) correspondingPercent = 100;
                correspondingPercent = Math.min(100, Math.max(0, correspondingPercent));
                // Limita o percentual também pelo máximo disponível globalmente para um novo incremento
                correspondingPercent = Math.min(correspondingPercent, maxPercentualParaNovoOuIncremento);

                setValue("percent", parseFloat(correspondingPercent.toFixed(2)), { shouldValidate: true });
              };

              const handleValorBlur = () => {
                setIsValorFocused(false);
                // No blur, o valor do RHF já deve estar correto devido ao onChange.
                // Apenas reformatamos o display.
                const currentRHFValue = getValues("valor") ?? 0;
                setDisplayValor(currentRHFValue > 0 ? formatCurrency(currentRHFValue) : "");
              };

              return (
                <div className="flex flex-col gap-1.5">
                  <div className="w-full flex justify-between items-baseline">
                    <Label required className="font-medium text-sm" htmlFor={field.name}>Valor (R$)</Label>
                    <span className="text-muted-foreground text-xs font-normal">
                      Disponível: {formatCurrency(maxValorDisponivelGlobalmente)}
                    </span>
                  </div>
                  <Input
                    id={field.name} type="text" inputMode="decimal"
                    value={displayValor}
                    onChange={handleValorChange}
                    onFocus={handleValorFocus} onBlur={handleValorBlur}
                    className={`text-right text-sm h-9 w-full rounded-md border bg-background px-3 py-2 ${fieldState.error ? "border-destructive" : "border-input"}`}
                    placeholder={isValorFocused ? "0,00" : "R$ 0,00"}
                    disabled={totalGeral <= 0 || maxValorDisponivelGlobalmente < 0.01}
                    aria-invalid={!!fieldState.error}
                  />
                  {fieldState.error && <p className="text-xs text-destructive pt-1">{fieldState.error.message}</p>}
                </div>
              );
            }}
          />
          {/* Slider e Input Percentual */}
          <Controller
            name="percent" control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col gap-1.5">
                <div className="w-full flex justify-between items-baseline">
                  <Label required className="font-medium text-sm" htmlFor={field.name}>Porcentagem (%)</Label>
                  <span className="text-muted-foreground text-xs font-normal">
                    Máx (novo/incr.): {maxPercentualParaNovoOuIncremento.toFixed(2)}%
                  </span>
                </div>
                <div className="flex items-center gap-3 pt-1">
                  <Slider
                    value={[field.value ?? 0]}
                    onValueChange={(v) => {
                      let newValue = v[0] ?? 0;
                      newValue = Math.min(newValue, maxPercentualParaNovoOuIncremento);
                      newValue = Math.min(100, Math.max(0, newValue));
                      
                      setValue("percent", newValue, { shouldValidate: true }); // Atualiza RHF 'percent'

                      let correspondingValor = (newValue / 100) * totalGeral;
                      correspondingValor = Math.min(correspondingValor, maxValorDisponivelGlobalmente);
                      correspondingValor = Math.max(0, correspondingValor);
                      setValue("valor", parseFloat(correspondingValor.toFixed(2)), { shouldValidate: true });
                    }}
                    max={100} step={0.01}
                    className="flex-grow"
                    disabled={totalGeral <= 0 || maxPercentualParaNovoOuIncremento < 0.01}
                    aria-label="Porcentagem Slider"
                  />
                  <Input
                    id={field.name} type="number" step="0.01" min="0"
                    max={maxPercentualParaNovoOuIncremento}
                    value={field.value ?? 0}
                    onChange={(e) => {
                      let n = parseFloat(e.target.value);
                      if (isNaN(n)) n = 0;
                      
                      n = Math.min(n, maxPercentualParaNovoOuIncremento);
                      n = Math.min(100, Math.max(0, n)); // Garante 0-100 e o limite

                      setValue("percent", n, { shouldValidate: true }); // Atualiza RHF 'percent'

                      let correspondingValor = (n / 100) * totalGeral;
                      correspondingValor = Math.min(correspondingValor, maxValorDisponivelGlobalmente);
                      correspondingValor = Math.max(0, correspondingValor);
                      setValue("valor", parseFloat(correspondingValor.toFixed(2)), { shouldValidate: true });
                    }}
                    className={`h-9 w-24 text-right text-sm rounded-md border bg-background px-2 py-1 ${fieldState.error ? "border-destructive" : "border-input"}`}
                    placeholder="0.00"
                    disabled={totalGeral <= 0 || maxPercentualParaNovoOuIncremento < 0.01}
                    aria-invalid={!!fieldState.error}
                  />
                </div>
                {fieldState.error && <p className="text-xs text-destructive pt-1">{fieldState.error.message}</p>}
              </div>
            )}
          />
        </div>

        <div className="flex justify-center sm:justify-end mt-6">
          <Button type="submit" variant="default" disabled={isAddingDisabled} className="w-full sm:w-auto">
            {isAddingDisabled && maxValorDisponivelGlobalmente < 0.01 ? "Valor Total Alocado" : "Adicionar/Atualizar Rateio"}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
