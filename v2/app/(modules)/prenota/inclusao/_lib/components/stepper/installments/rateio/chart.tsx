// _lib/components/stepper/header/RateioChartView.tsx (Final - Cores Opostas na Mesma Paleta)
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
import { formatCurrency } from "utils"; // Ajuste o path se necessário
// Importa tipos corretos
import type { Rateio as RateioType, FilialGeral, CentroCusto } from "@inclusao/types"; // Ajuste path se necessário

// --- Constantes e Tipos ---

// Paleta ÚNICA de 10 cores vivas (baseada na sua última definição)
const VIVID_PALETTE = [
  "hsl(var(--chart-1))",  // Cor 1
  "hsl(var(--chart-2))",  // Cor 2
  "hsl(var(--chart-3))",  // Cor 3
  "hsl(var(--chart-4))",  // Cor 4
  "hsl(var(--chart-5))",  // Cor 5
  "hsl(var(--chart-6))",  // Cor 6
  "hsl(var(--chart-7))",  // Cor 7
  "hsl(var(--chart-8))",  // Cor 8
  "hsl(var(--chart-9))",  // Cor 9
  "hsl(var(--chart-10))", // Cor 10
];

// Função para obter cor na ordem normal (índice 0 -> 9)
function getColorForward(idx: number): string {
  return VIVID_PALETTE[idx % VIVID_PALETTE.length];
}
// Função para obter cor na ordem reversa (índice 9 -> 0)
function getColorReverse(idx: number): string {
    const paletteLength = VIVID_PALETTE.length;
    // Calcula índice reverso de forma segura (lida com wrap around)
    const reverseIndex = (paletteLength - 1) - (idx % paletteLength);
    return VIVID_PALETTE[reverseIndex];
}

// Estrutura de dados INTERNA para o gráfico
interface ChartDataPoint {
  code: string; // Código original (Z10_FILRAT ou Z10_CC)
  name: string; // Label formatado "COD - NOME"
  value: number; // Valor numérico (Z10_VALOR)
  fill: string; // Cor HSL da paleta correta
  tipo: "Filial" | "Centro de Custo"; // Para tooltip
}

// --- Componente ---
export function RateioChartView() {
  // --- Stores ---
  // Assume que draft.rateios contém RateioType[] com Z10_*
  const rateios = usePreNotaStore((state) => state.draft.rateios);
  const filiais = useLoginAuxStore((state) => state.filiais);
  const centrosCusto = useLoginAuxStore((state) => state.centroCusto);

  // --- Labels ---
  const getFilialLabel = useCallback(
    (code: string | undefined): string => {
      if (!code) return "N/A";
      const trimmedCode = code.trim();
      // Garanta que 'numero' e 'filial' são os campos corretos em FilialGeral
      const f = filiais.find((filial: FilialGeral) => (filial.numero ?? filial.M0_CODFIL)?.trim() === trimmedCode);
      const name = (f?.filial ?? f?.M0_FILIAL)?.trim() || "Desconhecida";
      return `${trimmedCode} - ${name}`;
    },
    [filiais]
  );

  const getCentroCustoLabel = useCallback(
    (code: string | undefined): string => {
      if (!code) return "N/A";
      const trimmedCode = code.trim();
      const cc = centrosCusto.find((centro: CentroCusto) => centro.CTT_CUSTO?.trim() === trimmedCode);
      const name = cc?.CTT_DESC01?.trim() || "Desconhecido";
      return `${trimmedCode} - ${name}`;
    },
    [centrosCusto]
  );

  // --- Processamento e Agrupamento dos Dados (com cores opostas) ---
  const { dataFilial, dataCc } = useMemo(() => {
    const groupData = (
      keyField: "Z10_FILRAT" | "Z10_CC",
      labelResolver: (code: string | undefined) => string
    ): ChartDataPoint[] => {
      const groupedValues = rateios.reduce<Map<string, number>>(
        (map, rateio) => {
          const code = (rateio[keyField] as string | undefined)?.trim();
          const valor = rateio.Z10_VALOR || 0; // Usa Z10_VALOR
          if (code && valor > 0) {
            map.set(code, (map.get(code) || 0) + valor);
          }
          return map;
        },
        new Map<string, number>()
      );

      const isFilial = keyField === "Z10_FILRAT";
      // <<< USA getColorForward para Filial e getColorReverse para CC >>>
      const colorGetter = isFilial ? getColorForward : getColorReverse;

      return Array.from(groupedValues.entries()).map(([code, value], index) => ({
          code,
          name: labelResolver(code),
          value,
          fill: colorGetter(index), // <<< Aplica a função de cor na ordem correta
          tipo: isFilial ? "Filial" : "Centro de Custo",
        }) as ChartDataPoint
      );
    };

    const dFilial = groupData("Z10_FILRAT", getFilialLabel);
    const dCc = groupData("Z10_CC", getCentroCustoLabel);
    return { dataFilial: dFilial, dataCc: dCc };
  }, [rateios, getFilialLabel, getCentroCustoLabel]);

  // --- Cálculo do Total Rateado ---
  const totalRateio = useMemo(() => {
    const total = rateios.reduce((sum, rateio) => sum + (rateio.Z10_VALOR || 0), 0);
    return total === 0 ? 1 : total; // Evita divisão por zero
  }, [rateios]);
  const totalRateioReal = useMemo(() => {
       return rateios.reduce((sum, rateio) => sum + (rateio.Z10_VALOR || 0), 0);
  }, [rateios]);

  // --- Configuração do Gráfico ---
  const chartConfig = useMemo((): ChartConfig => {
    const configEntries = [...dataFilial, ...dataCc].map((d) => [
      d.code,
      { label: d.name, color: d.fill },
    ]);
    // Fallbacks usam a primeira cor da paleta
    configEntries.push(["Filial", { label: "Filial", color: getColorForward(0) }]);
    configEntries.push(["Centro de Custo", { label: "Centro de Custo", color: getColorForward(0) }]); // Poderia usar getColorReverse(0) aqui também se preferir
    return Object.fromEntries(configEntries);
  }, [dataFilial, dataCc]);

  // Verifica se há dados para exibir
  const hasData = dataFilial.length > 0 || dataCc.length > 0;

  // --- Renderização ---
  return (
    <Card className="flex flex-col h-full bg-input/30">
      <CardHeader className="pb-2">
        <CardTitle>Distribuição do Rateio</CardTitle>
        <CardDescription>
          Valor por Filial e Centro de Custo
        </CardDescription>
      </CardHeader>
      <CardContent className={`flex-1 ${ hasData ? "p-0" : "flex items-center justify-center p-4" }`} >
        {hasData ? (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-full max-h-[400px] w-full max-w-[400px]"
          >
            <PieChart margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideIndicator
                    labelFormatter={(label, payload) => {
                      if (!payload?.[0]?.payload) return label;
                      const data = payload[0].payload as ChartDataPoint;
                      const percent = ( (data.value / totalRateio) * 100 ).toFixed(2);
                      return (
                        <div className="flex gap-2 items-start">
                          <div className="w-1.5 h-8 shrink-0 rounded-full mt-1" style={{ backgroundColor: data.fill }} />
                          <div className="flex flex-col text-xs gap-0.5">
                             <span className="font-medium text-muted-foreground">{data.tipo}</span>
                             <span className="font-semibold text-foreground">{data.name}</span>
                            <div className="flex justify-between items-center gap-2 text-muted-foreground">
                              <span>{formatCurrency(data.value)}</span>
                              <span>({percent}%)</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    formatter={() => <React.Fragment />}
                    className="min-w-[180px] rounded-md border bg-popover p-2 shadow-md text-popover-foreground"
                  />
                }
              />
              {/* Pie EXTERNO: Filiais (Cores na ordem 1 -> 10) */}
              <Pie
                data={dataFilial} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={160} innerRadius={110}
                strokeWidth={1} stroke="hsl(var(--border))"
              >
                {dataFilial.map((entry) => (
                  <Cell key={`filial-${entry.code}`} fill={entry.fill} />
                ))}
              </Pie>
              {/* Pie INTERNO: Centros de Custo (Cores na ordem 10 -> 1) */}
              <Pie
                data={dataCc} dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={95} innerRadius={40}
                strokeWidth={1} stroke="hsl(var(--border))"
              >
                {dataCc.map((entry) => (
                  <Cell key={`cc-${entry.code}`} fill={entry.fill} />
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
          <span>{formatCurrency(totalRateioReal)}</span>
        </div>
        <div className="text-muted-foreground">
          Distribuído entre {dataFilial.length} Filia{dataFilial.length === 1 ? 'l' : 'is'}
          {' '}e {dataCc.length} Centro{dataCc.length === 1 ? '' : 's'} de Custo.
        </div>
      </CardFooter>
    </Card>
  );
}