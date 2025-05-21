"use client";

import React, { useMemo, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent, ScrollArea } from "ui";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
import { RateioTable, RateioChartView } from ".";
import { CondicaoPagamentoForm } from "../condicao/Condicao";
import { useCondicaoPagamento } from "@inclusao/hooks";
import { Parcela } from "@inclusao/types";
import { AttachmentsDialog } from "../AttachmentsCard";

interface PagamentoAPI {
  Parcela: string;
  Vencimento: string;
  Valor: number;
}

function formatApiDateToParcelaDate(
  apiDate: string | undefined | null
): Parcela["Vencimento"] {
  if (!apiDate || apiDate.length !== 8) return "";
  const [year, month, day] = [
    apiDate.substring(0, 4),
    apiDate.substring(4, 6),
    apiDate.substring(6, 8),
  ];
  if ([year, month, day].some((s) => isNaN(parseInt(s)))) return "";
  return `${day}/${month}/${year}` as Parcela["Vencimento"];
}

export function RateioCard() {
  const rateios = usePreNotaStore((s) => s.draft.RATEIOS);
  const setParcelas = usePreNotaStore((s) => s.setParcelas);
  const totalGeralXml = useValorTotalXml();

  const {
    data: condicaoData,
    isLoading: condicaoIsLoading,
    error: condicaoError,
  } = useCondicaoPagamento();

  useEffect(() => {
    if (!condicaoData) return;
    const pagamentos = condicaoData.Pagamentos ?? [];
    const parcelasFormatadas = pagamentos.map(
      (p): Parcela => ({
        Parcela: p.Parcela,
        Vencimento: formatApiDateToParcelaDate(p.Vencimento),
        Valor: p.Valor,
      })
    );
    setParcelas(parcelasFormatadas);
  }, [condicaoData, setParcelas]);

  const totalGeral = useMemo(() => totalGeralXml ?? 0, [totalGeralXml]);
  const totalDivisaoSalva = useMemo(
    () => (rateios || []).reduce((acc, r) => acc + (r.valor || 0), 0),
    [rateios]
  );
  const totalPercentualSalvo = useMemo(
    () => (rateios || []).reduce((acc, r) => acc + (r.percent || 0), 0),
    [rateios]
  );
  const isTotalPercentualValid = Math.abs(totalPercentualSalvo - 100) < 0.01;
  const isTotalValorValid = Math.abs(totalDivisaoSalva - totalGeral) < 0.01;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Tabs
        defaultValue="table"
        className="flex flex-col flex-1 overflow-hidden pt-2"
      >
        <div className="flex justify-between items-center w-full px-4 mb-2">
          <AttachmentsDialog />
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
          <ScrollArea className="h-full overflow-auto">
            <div className="px-2 text-sm text-muted-foreground flex gap-1">
              <p>
                Total Alocado:{" "}
                <strong>R$ {totalDivisaoSalva.toFixed(2)}</strong> de R${" "}
                {totalGeral.toFixed(2)}
              </p>
              <p
                className={
                  isTotalPercentualValid && isTotalValorValid
                    ? "text-green-600 font-medium"
                    : "text-amber-600 font-medium"
                }
              >
                / (<strong>{totalPercentualSalvo.toFixed(2)}%</strong> de 100%
                {totalGeral > 0 &&
                  !(isTotalPercentualValid && isTotalValorValid) &&
                  ")"}
              </p>
            </div>
            <RateioTable />
          </ScrollArea>
        </TabsContent>

        <TabsContent value="chart" className="flex-1 overflow-y-auto p-2 mt-0">
          <ScrollArea className="h-full overflow-auto">
            <RateioChartView />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
