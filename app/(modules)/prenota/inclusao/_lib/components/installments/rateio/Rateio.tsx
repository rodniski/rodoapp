// _lib/components/stepper/header/RateioCard.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, ComboboxItem } from "ui";
import { useAuxStore as useLoginAuxStore } from "@/app/login/_lib/stores";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
import { RateioTable, RateioChartView, RateioForm } from ".";
import { CondicaoPagamentoForm } from "../condicao/Condicao";
import { useCondicaoPagamento } from "@inclusao/hooks";

export function RateioCard() {
  // Stores de contexto
  const filiais = useLoginAuxStore((s) => s.filiais);
  const centroCusto = useLoginAuxStore((s) => s.centroCusto);

  // Store principal de pré-nota
  const rateios = usePreNotaStore((s) => s.draft.RATEIOS); // Atualizado para RATEIOS
  const addRateio = usePreNotaStore((s) => s.addRateio);
  const setParcelas = usePreNotaStore((s) => s.setParcelas); // Nome ajustado para setParcelas
  const totalGeralXml = useValorTotalXml();

  // Hook que busca a condição de pagamento
  const {
    data: condicaoData,
    isLoading: condicaoIsLoading,
    error: condicaoError,
  } = useCondicaoPagamento();

  // Toda vez que condicaoData mudar, salva na store
  useEffect(() => {
    if (condicaoData) {
      setParcelas(condicaoData.Pagamentos ?? []);
    }
  }, [condicaoData, setParcelas]);

  // Cálculos para o Rateio
  const totalGeral = useMemo(() => totalGeralXml ?? 0, [totalGeralXml]);
  const totalDivisaoSalva = useMemo(
    () => rateios.reduce((acc, r) => acc + (r.valor || 0), 0), // Atualizado para valor
    [rateios]
  );
  const totalPercentualSalvo = useMemo(
    () => rateios.reduce((acc, r) => acc + (r.percent || 0), 0), // Atualizado para percent
    [rateios]
  );
  const isTotalPercentualValid = Math.abs(totalPercentualSalvo - 100) < 0.01;
  const isTotalValorValid = Math.abs(totalDivisaoSalva - totalGeral) < 0.01;

  // Options para Comboboxes
  const filiaisOptions = useMemo<ComboboxItem[]>(
    () =>
      filiais.map((f) => ({
        value: f.numero ?? "",
        label: `${f.numero ?? "??"} – ${f.filial ?? "Nome Indisponível"}`,
      })),
    [filiais]
  );
  const centroCustoOptions = useMemo<ComboboxItem[]>(
    () =>
      centroCusto.map((c) => ({
        value: c.CTT_CUSTO ?? "",
        label: `${c.CTT_CUSTO ?? "??"} – ${
          c.CTT_DESC01 ?? "Descrição Indisponível"
        }`,
      })),
    [centroCusto]
  );

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Tabs
        defaultValue="table"
        className="flex flex-col flex-1 overflow-hidden pt-2"
      >
        <div className="flex justify-between items-center w-full px-4 mb-2">
          <TabsList className="bg-card shadow-md border">
            <TabsTrigger value="table" className="text-base flex-1">
              Tabela de Rateios
            </TabsTrigger>
            <TabsTrigger value="chart" className="text-base flex-1">
              Gráfico de Distribuição
            </TabsTrigger>
          </TabsList>

          <CondicaoPagamentoForm
            data={condicaoData}
            isLoading={condicaoIsLoading}
            error={condicaoError}
          />
        </div>

        <TabsContent
          value="table"
          className="flex-1 flex flex-col overflow-y-auto mt-0 p-2 gap-4"
        >
          <RateioForm
            filiaisOptions={filiaisOptions}
            centroCustoOptions={centroCustoOptions}
            totalGeral={totalGeral}
            rateios={rateios}
            addRateio={addRateio}
          />

          <div className="px-2 text-sm text-muted-foreground flex gap-1">
            <p>
              Total Alocado: <strong>R$ {totalDivisaoSalva.toFixed(2)}</strong>{" "}
              de R$ {totalGeral.toFixed(2)}
            </p>
            <p
              className={
                isTotalPercentualValid && isTotalValorValid
                  ? "text-green-600 font-medium"
                  : "text-amber-600 font-medium"
              }
            >
              / (<strong>{totalPercentualSalvo.toFixed(2)}%</strong> de 100%
              {totalGeral > 0 && !(isTotalPercentualValid && isTotalValorValid)}
              )
            </p>
          </div>

          <RateioTable />
        </TabsContent>

        <TabsContent value="chart" className="flex-1 overflow-y-auto p-2 mt-0">
          <RateioChartView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
