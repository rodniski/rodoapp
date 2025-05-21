"use client";

import React, { useMemo } from "react";
import { Card, CardTitle } from "ui";
import { RateioFormView, RateioCard, useRateioForm } from "./rateio";
import { useAuthStore } from "@login/stores";
import { useAuxStore } from "@login/stores";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";

export function Installments() {
  /* --------- stores --------- */
  const filiaisRaw = useAuthStore((s) => s.filiais);
  const centroCustoRaw = useAuxStore((s) => s.centroCusto);

  const rateios = usePreNotaStore((s) => s.draft.RATEIOS);
  const addRateio = usePreNotaStore((s) => s.addRateio);
  const updateRateio = usePreNotaStore((s) => s.updateRateio);

  const totalGeral = useValorTotalXml() ?? 0;

  /* --------- opções combobox --------- */
  const filiaisOptions = useMemo(
    () => filiaisRaw.map((f) => ({ value: f.M0_CODFIL, label: `${f.M0_CODFIL} • ${f.M0_FILIAL}` })),
    [filiaisRaw]
  );

  const ccOptions = useMemo(
    () =>
      centroCustoRaw.map((c) => ({ value: c.CTT_CUSTO, label: `${c.CTT_CUSTO} • ${c.CTT_DESC01}` })),
    [centroCustoRaw]
  );

  /* --------- hook do form --------- */
  const {
    form, // objeto do React-Hook-Form
    onSubmit, // handler de submit
    isValid, // boolean
    maxValorDisp, // calculado no hook
    maxPercentDisp, // idem
  } = useRateioForm({
    rateios,
    addRateio,
    updateRateio,
    totalGeral,
  });

  /* --------- layout --------- */
  return (
    <div className="flex h-full w-full items-start justify-center py-5">
      {/* 1️⃣ – height disponível menos o padding do topo (70 px) */}
      <div
        className="grid h-full w-full gap-4 p-1
                    lg:grid-cols-4 lg:auto-rows-fr"
      >
        {/* ---------- FORM ---------- */}
        <Card className="lg:col-span-1 lg:row-span-2 h-full px-4 flex flex-col">
          <CardTitle className="text-center">Selecione a divisão de Rateio</CardTitle>
          <RateioFormView
            filiaisOptions={filiaisOptions}
            centroCustoOptions={ccOptions}
            maxValorDisp={maxValorDisp}
            maxPercentDisp={maxPercentDisp}
            form={form}
            onSubmit={onSubmit}
            isValid={isValid}
            totalGeral={totalGeral}
          />
        </Card>

        {/* ---------- CARD ---------- */}
        <Card
          className="lg:col-start-2 lg:col-span-3 lg:row-span-2
                       h-full flex flex-col py-0"
        >
          <RateioCard />
        </Card>
      </div>
    </div>
  );
}
