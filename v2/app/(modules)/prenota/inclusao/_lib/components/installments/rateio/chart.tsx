// _lib/components/stepper/header/RateioChartView.tsx (Final - Filtro Interativo "Power BI")
"use client";

import React, { useMemo, useCallback, useState } from "react";
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
} from "ui"; // Seu UI Kit
import { usePreNotaStore } from "@inclusao/stores";
import { useAuxStore as useLoginAuxStore } from "@/app/login/_lib/stores";
import { formatCurrency } from "utils"; // Seu utilitário de formatação
// Tipos atualizados com Z10_*
import type { Rateio as RateioType } from "@inclusao/types";

// --- Constantes e Tipos ---

// Paleta ÚNICA de 10 cores
const VIVID_PALETTE = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  "var(--chart-4)", "var(--chart-5)", "var(--chart-6)",
  "var(--chart-7)", "var(--chart-8)", "var(--chart-9)",
  "var(--chart-10)",
];

// Funções de cores (forward/reverse)
function getColorForward(idx: number): string {
  return VIVID_PALETTE[idx % VIVID_PALETTE.length];
}
function getColorReverse(idx: number): string {
    const paletteLength = VIVID_PALETTE.length;
    const reverseIndex = (paletteLength - 1) - (idx % paletteLength);
    return VIVID_PALETTE[reverseIndex];
}

// Estrutura interna para o gráfico
interface ChartDataPoint {
  code: string;
  name: string;
  value: number;
  fill: string;
  tipo: "Filial" | "Centro de Custo";
}

// --- Componente ---
export function RateioChartView() {
  // --- Estado para Filtro ---
  const [filter, setFilter] = useState<{ type: 'Filial' | 'Centro de Custo' | null; code: string | null }>({ type: null, code: null });

  // --- Stores ---
  const rateios = usePreNotaStore((state) => state.draft.rateios);
  const filiais = useLoginAuxStore((state) => state.filiais);
  const centrosCusto = useLoginAuxStore((state) => state.centroCusto);

  // --- Funções de Label ---
  const getFilialLabel = useCallback(
    (code: string | undefined): string => {
      if (!code) return "N/A"; const trimmedCode = code.trim();
      const f = filiais.find((filial) => (filial.numero ?? filial.M0_CODFIL)?.trim() === trimmedCode);
      const name = (f?.filial ?? f?.M0_FILIAL)?.trim() || "Desconhecida";
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

  // --- Processamento de Dados ---

  // Função de Agrupamento (reutilizável)
  const groupData = useCallback((
    keyField: "Z10_FILRAT" | "Z10_CC",
    labelResolver: (code: string | undefined) => string,
    sourceData: RateioType[], // Recebe a fonte de dados (completa ou filtrada)
    colorDirection: 'forward' | 'reverse'
  ): ChartDataPoint[] => {
    const groupedValues = sourceData.reduce<Map<string, number>>(
      (map, rateio) => {
        const code = (rateio[keyField] as string | undefined)?.trim();
        const valor = rateio.Z10_VALOR || 0;
        if (code && valor > 0) map.set(code, (map.get(code) || 0) + valor);
        return map;
      }, new Map<string, number>()
    );
    const isFilial = keyField === "Z10_FILRAT";
    const colorGetter = colorDirection === 'forward' ? getColorForward : getColorReverse;
    return Array.from(groupedValues.entries())
        .sort(([, valueA], [, valueB]) => valueB - valueA) // Ordena por valor desc
        .map(([code, value], index) => ({
            code, name: labelResolver(code), value, fill: colorGetter(index),
            tipo: isFilial ? "Filial" : "Centro de Custo",
          }) as ChartDataPoint
        );
  }, []); // Vazio pois a função em si não depende de estado externo aqui

  // 1. Calcula os dados COMPLETOS primeiro (para cores e referências)
  const { fullDataFilial, fullDataCc } = useMemo(() => {
      const dFilial = groupData("Z10_FILRAT", getFilialLabel, rateios, 'forward');
      const dCc = groupData("Z10_CC", getCentroCustoLabel, rateios, 'reverse');
      return { fullDataFilial: dFilial, fullDataCc: dCc };
  }, [rateios, getFilialLabel, getCentroCustoLabel, groupData]);

  // 2. Calcula os dados para EXIBIÇÃO, aplicando o filtro
  const { dataFilial, dataCc } = useMemo(() => {
      if (filter.type === 'Filial' && filter.code) {
          const selectedFilialData = fullDataFilial.find(d => d.code === filter.code);
          const rateiosFiltrados = rateios.filter(r => r.Z10_FILRAT === filter.code);
          const filteredDataCc = groupData("Z10_CC", getCentroCustoLabel, rateiosFiltrados, 'reverse');
          // Retorna APENAS a filial selecionada e os CCs correspondentes
          return { dataFilial: selectedFilialData ? [selectedFilialData] : [], dataCc: filteredDataCc };
      } else if (filter.type === 'Centro de Custo' && filter.code) {
          const selectedCcData = fullDataCc.find(d => d.code === filter.code);
          const rateiosFiltrados = rateios.filter(r => r.Z10_CC === filter.code);
          const filteredDataFilial = groupData("Z10_FILRAT", getFilialLabel, rateiosFiltrados, 'forward');
           // Retorna APENAS o CC selecionado e as Filiais correspondentes
          return { dataFilial: filteredDataFilial, dataCc: selectedCcData ? [selectedCcData] : [] };
      } else {
          // Sem filtro, retorna os dados completos
          return { dataFilial: fullDataFilial, dataCc: fullDataCc };
      }
  }, [filter, rateios, fullDataFilial, fullDataCc, getFilialLabel, getCentroCustoLabel, groupData]);


  // --- Total Original (para cálculo de %) ---
  const totalRateioOriginal = useMemo(() => {
    return rateios.reduce((sum, rateio) => sum + (rateio.Z10_VALOR || 0), 0);
  }, [rateios]);
  const totalRateioForPercent = totalRateioOriginal === 0 ? 1 : totalRateioOriginal;

  // --- Configuração do Gráfico (baseada nos dados completos) ---
  const chartConfig = useMemo((): ChartConfig => {
    const configEntries = [...fullDataFilial, ...fullDataCc].map((d) => [
      d.code, { label: d.name, color: d.fill },
    ]);
    configEntries.push(["Filial", { label: "Filial", color: getColorForward(0) }]);
    configEntries.push(["Centro de Custo", { label: "Centro de Custo", color: getColorForward(0) }]);
    return Object.fromEntries(configEntries);
  }, [fullDataFilial, fullDataCc]);

  // Verifica se há dados PARA EXIBIR (após filtro)
  const hasDataToShow = dataFilial.length > 0 || dataCc.length > 0;

  // --- Handlers de Interação ---
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
      if (event.target === event.currentTarget) { // Garante clique no fundo
        setFilter({ type: null, code: null });
      }
  }, []);

  // --- Descrição Dinâmica ---
  const cardDescription = useMemo(() => {
      let filterLabel = filter.code;
      if(filter.code) {
          const configEntry = chartConfig[filter.code];
          if (configEntry) filterLabel = configEntry.label; // Pega o nome formatado
      }
      if (filter.type === 'Filial') return `Distribuição de C. Custo para: ${filterLabel}`;
      if (filter.type === 'Centro de Custo') return `Distribuição de Filial para: ${filterLabel}`;
      return "Visão Geral: Filial (exterior) e Centro de Custo (interior)"; // Descrição padrão
  }, [filter, chartConfig]);


  // --- Renderização ---
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
                       // Mostra percentual relativo ao TOTAL ORIGINAL para dar contexto
                      const percentOfOriginalTotal = ( (data.value / totalRateioForPercent) * 100 ).toFixed(2);
                      return (
                        <div className="flex gap-2 items-start">
                          <div className="w-1.5 h-13 shrink-0 rounded-full " style={{ backgroundColor: data.fill }} />
                          <div className="flex flex-col text-xs gap-0.5">
                             <span className="font-medium text-muted-foreground">{data.tipo}</span>
                             <span className="font-semibold text-primary">{data.name}</span>
                            <div className="flex justify-between items-center gap-2 text-foreground">
                              <span>{formatCurrency(data.value)}</span>
                              <span>({percentOfOriginalTotal}% do Total)</span> {/* Indica que % é do total */}
                            </div>
                          </div>
                        </div>
                      );
                    }}
                    formatter={() => <React.Fragment />} // Impede formatter padrão
                    className="min-w-[180px] rounded-md border bg-popover p-2 shadow-md text-popover-foreground h-17"
                  />
                }
              />
              {/* Pie EXTERNO: Filiais */}
              <Pie
                data={dataFilial} // <<< Dados podem ser [itemSelecionado] ou todos
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
                    stroke={'hsl(var(--border))'} // Borda padrão simples
                    // Sem highlight extra, o próprio filtro/colapso é o indicador
                  />
                ))}
              </Pie>
              {/* Pie INTERNO: Centros de Custo */}
              <Pie
                data={dataCc} // <<< Dados podem ser filtrados ou [itemSelecionado] ou todos
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
                    stroke={'hsl(var(--border))'} // Borda padrão simples
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
             {/* Usa os dados COMPLETOS para a contagem total no rodapé */}
            {filter.code
             ? `Exibindo detalhes para: ${chartConfig[filter.code]?.label ?? filter.code}`
             : `Distribuído entre ${fullDataFilial.length} Filia${fullDataFilial.length === 1 ? 'l' : 'is'} e ${fullDataCc.length} Centro${fullDataCc.length === 1 ? '' : 's'} de Custo.`
            }
         </div>
       </CardFooter>
    </Card>
  );
}