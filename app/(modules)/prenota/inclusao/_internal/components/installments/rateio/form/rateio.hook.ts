import { useState, useEffect, useMemo, useCallback } from "react";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, FormProvider } from "react-hook-form";
import {
  rateioInputSchema,
  type RateioInputSchemaParsed,
} from "@inclusao/validation/prenota.schema";
import { formatCurrency, parseInputToNumber } from "utils";
import type { Rateio as RateioType } from "@inclusao/types";

interface UseRateioFormProps {
  totalGeral: number;
  rateios: RateioType[];
  addRateio: (r: RateioType) => void;
  updateRateio: (idOuSeq: string, patch: Partial<RateioType>) => void;
}

export function useRateioForm({
  totalGeral,
  rateios,
  addRateio,
  updateRateio,
}: UseRateioFormProps) {
  /** ------------------ form ------------------ */
  const methods = useForm<RateioInputSchemaParsed>({
    resolver: zodResolver(rateioInputSchema),
    mode: "onChange",
    defaultValues: { FIL: "", cc: "", valor: 0, percent: 0 },
  });
  const {
    watch,
    setValue,
    reset,
    getValues,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
  } = methods;

  /** ------------------ cálculos ------------------ */
  const totalRateado = useMemo(
    () => rateios.reduce((acc, r) => acc + (r.valor || 0), 0),
    [rateios]
  );

  const maxValorDisp = useMemo(
    () => Math.max(0, parseFloat((totalGeral - totalRateado).toFixed(2))),
    [totalGeral, totalRateado]
  );

  const maxPercentDisp = useMemo(
    () =>
      totalGeral > 0
        ? Math.min(100, parseFloat(((maxValorDisp / totalGeral) * 100).toFixed(2)))
        : maxValorDisp > 0
        ? 100
        : 0,
    [totalGeral, maxValorDisp]
  );

  /** ------------------ auto-reset valor/percent se FIL ou CC mudar ------------------ */
  const watchedFilial = watch("FIL");
  const watchedCc = watch("cc");
  useEffect(() => {
    if (touchedFields.FIL || touchedFields.cc) {
      setValue("valor", 0, { shouldValidate: true, shouldTouch: false });
      setValue("percent", 0, { shouldValidate: true, shouldTouch: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedFilial, watchedCc]);

  /** ------------------ submit handler ------------------ */
  const onSubmit = useCallback(
    (data: RateioInputSchemaParsed) => {
      let { valor: incValor, percent: incPercent } = data;

      // Garanta consistência se só um dos campos foi mexido
      if (touchedFields.valor && !touchedFields.percent) {
        incPercent =
          totalGeral > 0
            ? parseFloat(((incValor / totalGeral) * 100).toFixed(2))
            : incValor > 0
            ? 100
            : 0;
      } else if (touchedFields.percent && !touchedFields.valor) {
        incValor = parseFloat(((incPercent / 100) * totalGeral).toFixed(2));
      }

      // Limites globais
      incValor = Math.max(0, Math.min(incValor, maxValorDisp));
      incPercent =
        totalGeral > 0
          ? parseFloat(((incValor / totalGeral) * 100).toFixed(2))
          : incValor > 0
          ? 100
          : 0;

      const existing = rateios.find((r) => r.FIL === data.FIL && r.cc === data.cc);

      if (existing) {
        const novoValor = parseFloat(((existing.valor || 0) + incValor).toFixed(2));
        const novoPercent =
          totalGeral > 0 ? parseFloat(((novoValor / totalGeral) * 100).toFixed(2)) : 100;
        const maxPermitido = parseFloat(((existing.valor || 0) + maxValorDisp).toFixed(2));

        if (novoValor > maxPermitido + 0.001) {
          toast.error(
            `A soma (${formatCurrency(novoValor)}) excede o máximo permitido (${formatCurrency(
              maxPermitido
            )}).`
          );
          return;
        }

        updateRateio(existing.id || existing.seq, { valor: novoValor, percent: novoPercent });
        toast.success(
          `Rateio ${data.FIL}/${data.cc} atualizado para ${formatCurrency(
            novoValor
          )} (${novoPercent.toFixed(2)}%)`
        );
      } else {
        if (incValor <= 0 && incPercent <= 0) {
          toast.info("Informe valor ou percentual maior que zero.");
          return;
        }
        addRateio({
          seq: String(rateios.length + 1).padStart(3, "0"),
          id: `rateio-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          FIL: data.FIL,
          cc: data.cc,
          valor: incValor,
          percent: incPercent,
          REC: 0,
        });
        toast.success("Novo rateio adicionado!");
      }

      reset({ FIL: data.FIL, cc: data.cc, valor: 0, percent: 0 });
    },
    [
      rateios,
      addRateio,
      updateRateio,
      totalGeral,
      maxValorDisp,
      reset,
      touchedFields,
    ]
  );

  return {
    /** expoe tudo que a view precisa */
    form: methods,
    onSubmit,
    maxValorDisp,
    maxPercentDisp,
    errors,
    isValid,
  };
}
