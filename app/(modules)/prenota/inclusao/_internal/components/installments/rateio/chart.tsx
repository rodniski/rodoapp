// _lib/components/stepper/header/RateioChartView.tsx
"use client";

import React, { useMemo, useCallback, useState } from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  ChartContainer,
  ChartConfig, // Este tipo provavelmente define label como React.ReactNode
  ChartTooltip,
  ChartTooltipContent,
  CardFooter,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "ui"; // Seu UI Kit
import { usePreNotaStore } from "@inclusao/stores";
import { useAuxStore as useLoginAuxStore } from "@/app/login/_lib/stores";
import { formatCurrency } from "utils";
import type { Rateio as RateioType } from "@inclusao/types";

// --- Constantes e Tipos ---
const VIVID_PALETTE = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  "var(--chart-4)", "var(--chart-5)", "var(--chart-6)",
  "var(--chart-7)", "var(--chart-8)", "var(--chart-9)",
  "var(--chart-10)",
];

function getColorForward(idx: number): string {
  return VIVID_PALETTE[idx % VIVID_PALETTE.length];
}
function getColorReverse(idx: number): string {
    const paletteLength = VIVID_PALETTE.length;
    const reverseIndex = (paletteLength - 1) - (idx % paletteLength);
    return VIVID_PALETTE[reverseIndex];
}

interface ChartDataPoint {
  code: string;
  name: string;
  value: number;
  fill: string;
  tipo: "Filial" | "Centro de Custo";
}

export function RateioChartView() {
  const [filter, setFilter] = useState<{ type: 'Filial' | 'Centro de Custo' | null; code: string | null }>({ type: null, code: null });

  const rateiosDoStore = usePreNotaStore((state) => state.draft.RATEIOS);
  const filiais = useLoginAuxStore((state) => state.filiais);
  const centrosCusto = useLoginAuxStore((state) => state.centroCusto);

  const rateios = useMemo(() => rateiosDoStore || [], [rateiosDoStore]);

  const getFilialLabel = useCallback(
    (code: string | undefined): string => {
      if (!code) return "N/A"; const trimmedCode = code.trim();
      const f = filiais.find((filial) => (filial.numero ?? filial.filial)?.trim() === trimmedCode);
      const name = (f?.filial ?? "Desconhecida");
      return `${trimmedCode} - ${name}`;
    }, [filiais]
  );
  const getCentroCustoLabel = useCallback(
    (code: string | undefined): string => {
      if (!code) return "N/A"; const trimmedCode = code.trim();
      const cc = centrosCusto.find((centro) => centro.CTT_CUSTO?.trim() === trimmedCode);
      const name = cc?.CTT_DESC01?.trim() || "Desconhecido";
      return `${trimmedCode} - ${name}`;
    }, [centrosCusto]
  );

  const groupData = useCallback((
    keyField: "FIL" | "cc",
    labelResolver: (code: string | undefined) => string,
    sourceData: RateioType[],
    colorDirection: 'forward' | 'reverse'
  ): ChartDataPoint[] => {
    if (!Array.isArray(sourceData)) {
        console.warn("groupData: sourceData não é um array ou é undefined", sourceData);
        return [];
    }
    const groupedValues = sourceData.reduce<Map<string, number>>(
      (map, rateio) => {
        const code = (rateio[keyField] as string | undefined)?.trim();
        const valor = rateio.valor || 0;
        if (code && valor > 0) map.set(code, (map.get(code) || 0) + valor);
        return map;
      }, new Map<string, number>()
    );
    const isFilial = keyField === "FIL";
    const colorGetter = colorDirection === 'forward' ? getColorForward : getColorReverse;
    return Array.from(groupedValues.entries())
        .sort(([, valueA], [, valueB]) => valueB - valueA)
        .map(([code, value], index) => ({
            code, name: labelResolver(code), value, fill: colorGetter(index),
            tipo: isFilial ? "Filial" : "Centro de Custo",
          }) as ChartDataPoint
        );
  }, []);

  const { fullDataFilial, fullDataCc } = useMemo(() => {
      const dFilial = groupData("FIL", getFilialLabel, rateios, 'forward');
      const dCc = groupData("cc", getCentroCustoLabel, rateios, 'reverse');
      return { fullDataFilial: dFilial, fullDataCc: dCc };
  }, [rateios, getFilialLabel, getCentroCustoLabel, groupData]);

  const { dataFilial, dataCc } = useMemo(() => {
      if (filter.type === 'Filial' && filter.code) {
          const selectedFilialData = fullDataFilial.find(d => d.code === filter.code);
          const rateiosFiltrados = rateios.filter(r => r.FIL === filter.code);
          const filteredDataCc = groupData("cc", getCentroCustoLabel, rateiosFiltrados, 'reverse');
          return { dataFilial: selectedFilialData ? [selectedFilialData] : [], dataCc: filteredDataCc };
      } else if (filter.type === 'Centro de Custo' && filter.code) {
          const selectedCcData = fullDataCc.find(d => d.code === filter.code);
          const rateiosFiltrados = rateios.filter(r => r.cc === filter.code);
          const filteredDataFilial = groupData("FIL", getFilialLabel, rateiosFiltrados, 'forward');
          return { dataFilial: filteredDataFilial, dataCc: selectedCcData ? [selectedCcData] : [] };
      } else {
          return { dataFilial: fullDataFilial, dataCc: fullDataCc };
      }
  }, [filter, rateios, fullDataFilial, fullDataCc, getFilialLabel, getCentroCustoLabel, groupData]);

  const totalRateioOriginal = useMemo(() => {
    return rateios.reduce((sum, rateio) => sum + (rateio.valor || 0), 0);
  }, [rateios]);
  const totalRateioForPercent = totalRateioOriginal === 0 ? 1 : totalRateioOriginal;

  const chartConfig = useMemo((): ChartConfig => {
    const configEntries = [...fullDataFilial, ...fullDataCc].map((d) => [
      d.code, { label: d.name, color: d.fill }, // d.name é string
    ]);
    // Adicionando entradas para os tipos de agrupamento principais
    configEntries.push(["Filial", { label: "Filial", color: getColorForward(VIVID_PALETTE.length) }]); // Usa uma cor não usada ou a primeira
    configEntries.push(["Centro de Custo", { label: "Centro de Custo", color: getColorReverse(VIVID_PALETTE.length) }]);
    return Object.fromEntries(configEntries);
  }, [fullDataFilial, fullDataCc]);

  const hasDataToShow = dataFilial.length > 0 || dataCc.length > 0;

  const handleSliceClick = useCallback((data: ChartDataPoint, event: React.MouseEvent) => {
    event.stopPropagation();
    setFilter((currentFilter) => {
      if (currentFilter.type === data.tipo && currentFilter.code === data.code) {
        return { type: null, code: null };
      }
      return { type: data.tipo, code: data.code };
    });
  }, []);

  const handleBackgroundClick = useCallback((event: React.MouseEvent) => {
      if (event.target === event.currentTarget) {
        setFilter({ type: null, code: null });
      }
  }, []);

  // --- Descrição Dinâmica CORRIGIDA ---
  const cardDescription = useMemo(() => {
    let targetDisplayName: string | null = null; // Variável para armazenar o nome formatado para exibição

    if (filter.code) {
      const configEntry = chartConfig[filter.code];
      if (configEntry) {
        // Se configEntry.label for string, usa-o diretamente.
        // Caso contrário (se for outro ReactNode), usa filter.code como fallback.
        if (typeof configEntry.label === 'string') {
          targetDisplayName = configEntry.label;
        } else {
          // Fallback para o código se o label não for uma string simples
          targetDisplayName = filter.code;
          // Opcional: logar um aviso se o label não for string, para debug
          // console.warn(`Label para o código '${filter.code}' não é uma string, usando o código como display name.`);
        }
      } else {
        // Se o código não estiver no chartConfig, usa o próprio código
        targetDisplayName = filter.code;
      }
    }

    if (filter.type === 'Filial') return `Distribuição de C. Custo para: ${targetDisplayName || 'N/A'}`;
    if (filter.type === 'Centro de Custo') return `Distribuição de Filial para: ${targetDisplayName || 'N/A'}`;
    return "Visão Geral: Filial (exterior) e Centro de Custo (interior)";
  }, [filter, chartConfig]);


  return (
    <Card className="flex flex-col h-full bg-input/30" onClick={handleBackgroundClick}>
      <CardHeader className="pb-2 cursor-pointer" onClick={handleBackgroundClick} title="Limpar filtro">
        <CardTitle>Distribuição do Rateio (Interativo)</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className={`flex-1 ${ hasDataToShow ? "p-0" : "flex items-center justify-center p-4" }`} >
        {hasDataToShow ? (
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
                      const percentOfOriginalTotal = ( (data.value / totalRateioForPercent) * 100 ).toFixed(2);
                      return (
                        <div className="flex gap-2 items-start">
                          <div className="w-1.5 h-13 shrink-0 rounded-full " style={{ backgroundColor: data.fill }} />
                          <div className="flex flex-col text-xs gap-0.5">
                             <span className="font-medium text-muted-foreground">{data.tipo}</span>
                             <span className="font-semibold text-primary">{data.name}</span>
                            <div className="flex justify-between items-center gap-2 text-foreground">
                              <span>{formatCurrency(data.value)}</span>
                              <span>({percentOfOriginalTotal}% do Total)</span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    formatter={() => <React.Fragment />}
                    className="min-w-[180px] rounded-md border bg-popover p-2 shadow-md text-popover-foreground h-17"
                  />
                }
              />
              <Pie
                data={dataFilial}
                dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={160} innerRadius={110}
                strokeWidth={1}
              >
                {dataFilial.map((entry) => (
                  <Cell
                    key={`filial-${entry.code}`}
                    fill={entry.fill}
                    onClick={(e) => handleSliceClick(entry, e)}
                    style={{ cursor: 'pointer' }}
                    stroke={'hsl(var(--border))'}
                  />
                ))}
              </Pie>
              <Pie
                data={dataCc}
                dataKey="value" nameKey="name"
                cx="50%" cy="50%" outerRadius={95} innerRadius={40}
                strokeWidth={1}
              >
                {dataCc.map((entry) => (
                   <Cell
                    key={`cc-${entry.code}`}
                    fill={entry.fill}
                    onClick={(e) => handleSliceClick(entry, e)}
                    style={{ cursor: 'pointer' }}
                    stroke={'hsl(var(--border))'}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        ) : (
           <div className="text-center text-muted-foreground text-sm italic">
            {filter.code ? `Sem dados para o filtro aplicado.` : "Sem dados de rateio para exibir gráfico."}
          </div>
        )}
      </CardContent>
       <CardFooter className="flex-col items-start gap-1 text-sm pt-3 pb-3">
         <div className="flex items-center gap-2 font-semibold">
             <span>Total Rateado (Original):</span>
             <span>{formatCurrency(totalRateioOriginal)}</span>
         </div>
         <div className="text-muted-foreground">
            {filter.code && chartConfig[filter.code] // Verifica se filter.code e a entrada em chartConfig existem
             ? `Exibindo detalhes para: ${typeof chartConfig[filter.code]!.label === 'string' ? chartConfig[filter.code]!.label : filter.code}`
             : `Distribuído entre ${fullDataFilial.length} Filia${fullDataFilial.length === 1 ? 'l' : 'is'} e ${fullDataCc.length} Centro${fullDataCc.length === 1 ? '' : 's'} de Custo.`
            }
         </div>
       </CardFooter>
    </Card>
  );
}
