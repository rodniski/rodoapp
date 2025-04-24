// _lib/components/stepper/header/RateioChartView.tsx
"use client";

import React, { useMemo, useCallback } from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  CardFooter,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "ui";
import { usePreNotaStore } from "@inclusao/stores";
import { useAuxStore as useLoginAuxStore } from "@login/stores";
import { formatCurrency } from "utils";
import type { Rateio as RateioType } from "@inclusao/types";
import type { FilialGeral, CentroCusto } from "@login/types";
import { Divide } from "lucide-react";

// --- Constantes e Tipos ---
const GREEN_PALETTE = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
  "hsl(var(--chart-9))",
  "hsl(var(--chart-10))",
];

const BLUE_PALETTE = [
  "hsl(var(--chart-11))",
  "hsl(var(--chart-12))",
  "hsl(var(--chart-13))",
  "hsl(var(--chart-14))",
  "hsl(var(--chart-15))",
  "hsl(var(--chart-16))",
  "hsl(var(--chart-17))",
  "hsl(var(--chart-18))",
  "hsl(var(--chart-19))",
  "hsl(var(--chart-20))",
];

function getGreenColor(idx: number): string {
  return GREEN_PALETTE[idx % GREEN_PALETTE.length];
}
function getBlueColor(idx: number): string {
  return BLUE_PALETTE[idx % BLUE_PALETTE.length];
}

interface ChartDataPoint {
  code: string;
  name: string;
  value: number;
  fill: string;
  tipo: "Filial" | "Centro de Custo";
}

// --- Componente ---
export function RateioChartView() {
  // --- Leitura dos Stores ---
  const rateios = usePreNotaStore((state) => state.draft.rateios);
  const filiais = useLoginAuxStore((state) => state.filiais);
  const centrosCusto = useLoginAuxStore((state) => state.centroCusto);

  // --- Funções de Busca de Label (Revisadas) ---
  const getFilialLabel = useCallback(
    (code: string | undefined): string => {
      if (!code) return "N/A";
      const trimmedCode = code.trim();
      const f = filiais.find(
        (filial: FilialGeral) => filial.numero?.trim() === trimmedCode
      );
      const name = f?.filial?.trim() || "Desconhecida";
      return `${trimmedCode} - ${name}`; // Garante formato correto
    },
    [filiais]
  );

  const getCentroCustoLabel = useCallback(
    (code: string | undefined): string => {
      if (!code) return "N/A";
      const trimmedCode = code.trim();
      const cc = centrosCusto.find(
        (centro: CentroCusto) => centro.CTT_CUSTO?.trim() === trimmedCode
      );
      const name = cc?.CTT_DESC01?.trim() || "Desconhecido";
      return `${trimmedCode} - ${name}`; // Garante formato correto
    },
    [centrosCusto]
  );

  // --- Processamento e Agrupamento dos Dados ---
  const { dataFilial, dataCc } = useMemo(() => {
    const groupData = (
      keyField: keyof RateioType,
      labelResolver: (code: string | undefined) => string
    ): ChartDataPoint[] => {
      const groupedValues = rateios.reduce<Map<string, number>>(
        (map, rateio) => {
          const code = (rateio[keyField] as string | undefined)?.trim();
          const valor = rateio.valor || 0;
          if (code && valor > 0) {
            map.set(code, (map.get(code) || 0) + valor);
          }
          return map;
        },
        new Map<string, number>()
      );

      const isFilial = keyField === "FIL";
      const colorGetter = isFilial ? getGreenColor : getBlueColor;

      return Array.from(groupedValues.entries()).map(([code, value], index) => {
        const dataPoint = {
          code,
          name: labelResolver(code),
          value,
          fill: colorGetter(index),
          tipo: isFilial ? "Filial" : "Centro de Custo",
        };
        // Depuração para verificar rótulos
        console.log("DataPoint:", dataPoint);
        return dataPoint;
      });
    };

    const dFilial = groupData("FIL", getFilialLabel);
    const dCc = groupData("cc", getCentroCustoLabel);
    return { dataFilial: dFilial, dataCc: dCc };
  }, [rateios, getFilialLabel, getCentroCustoLabel]);

  // --- Cálculo do Total Rateado ---
  const totalRateio = useMemo(() => {
    return rateios.reduce((sum, rateio) => sum + (rateio.valor || 0), 0);
  }, [rateios]);

  // --- Configuração do Gráfico ---
  const chartConfig = useMemo((): ChartConfig => {
    const configEntries = [...dataFilial, ...dataCc].map((d) => [
      d.code,
      { label: d.name, color: d.fill },
    ]);
    configEntries.push([
      "Filial",
      { label: "Filial", color: "hsl(var(--chart-1))" },
    ]);
    configEntries.push([
      "Centro de Custo",
      { label: "Centro de Custo", color: "hsl(var(--chart-11))" },
    ]);
    return Object.fromEntries(configEntries);
  }, [dataFilial, dataCc]);

  // Verifica se há dados para exibir
  const hasData = dataFilial.length > 0 || dataCc.length > 0;

  // --- Renderização ---
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Distribuição do Rateio</CardTitle>
        <CardDescription>
          Valor por Filial (verde) e Centro de Custo (azul)
        </CardDescription>
      </CardHeader>
      <CardContent
        className={`flex-1 ${
          hasData ? "p-0" : "flex items-center justify-center p-4"
        }`}
      >
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-full max-h-[400px] w-full max-w-[400px]"
          >
            <PieChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideIndicator
                    labelFormatter={(label, payload) => {
                      if (!payload?.[0]?.payload) return label;
                      const data = payload[0].payload as ChartDataPoint;
                      const percent = (
                        (data.value / totalRateio) *
                        100
                      ).toFixed(2);
                      return (
                        <div className="flex gap-3">
                          <div
                            className="w-1 rounded-2xl"
                            style={{ backgroundColor: data.fill }}
                          />
                          <div className="flex flex-col">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold text-muted-foreground">
                                {data.tipo}
                              </span>
                            </div>
                            <div className="text-sm text-primary">
                              {data.name}
                            </div>
                            <div className="w-full flex justify-between items-center">
                              <span> {formatCurrency(data.value)} </span>
                              <span> ({percent}%)</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    formatter={() => <></>} // Impede renderização padrão de name/value
                    className="min-w-[200px] p-3"
                  />
                }
              />
              {/* Pie EXTERNO: Filiais (Verde) */}
              <Pie
                data={dataFilial}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={160}
                innerRadius={110}
                strokeWidth={1}
                stroke="hsl(0,0,0)"
              >
                {dataFilial.map((entry) => (
                  <Cell
                    key={`filial-${entry.code}`}
                    fill={entry.fill}
                    name={entry.name}
                  />
                ))}
              </Pie>
              {/* Pie INTERNO: Centros de Custo (Azul) */}
              <Pie
                data={dataCc}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                innerRadius={40}
                strokeWidth={1}
                stroke="hsl(0,0,0)"
              >
                {dataCc.map((entry) => (
                  <Cell
                    key={`cc-${entry.code}`}
                    fill={entry.fill}
                    name={entry.name}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="text-center text-muted-foreground text-sm italic">
            Sem dados de rateio para exibir gráfico.
          </div>
        )}
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm pt-3 pb-3">
        <div className="flex items-center gap-2 font-semibold">
          <span>Total Rateado:</span>
          <span>{formatCurrency(totalRateio)}</span>
        </div>
        <div className="text-muted-foreground">
          Distribuído entre {dataFilial.length} Filia
          {dataFilial.length === 1 ? "l" : "is"} e {dataCc.length} Centro
          {dataCc.length === 1 ? "" : "s"} de Custo.
        </div>
      </CardFooter>
    </Card>
  );
}
