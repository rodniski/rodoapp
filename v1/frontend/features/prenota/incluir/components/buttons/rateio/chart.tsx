"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Pie, PieChart, Cell } from "recharts";
import { useAtomValue } from "jotai";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "ui";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "ui";
import { rateiosAtom } from "#/incluir/atoms";
import { accessFiliaisAtom, centrosCustoAtom } from "$/atoms";
function getColor(index: number) {
    const colors = [
      "hsl(var(--chart-1))",
      "hsl(var(--chart-2))",
      "hsl(var(--chart-3))",
      "hsl(var(--chart-4))",
      "hsl(var(--chart-5))",
      "hsl(var(--chart-6))",
      "hsl(var(--chart-7))",
      "hsl(var(--chart-8))",
    ];
    return colors[index % colors.length];
  }
  
  export function RateioChartView() {
    const rateios = useAtomValue(rateiosAtom);
    const filiais = useAtomValue(accessFiliaisAtom);
    const centrosCusto = useAtomValue(centrosCustoAtom);
  
    const getFilialLabel = (cod: string) => {
      const f = filiais.find((f) => f.M0_CODFIL.trim() === cod.trim());
      return f ? `${f.M0_CODFIL.trim()} - ${f.M0_FILIAL.trim()}` : cod;
    };
  
    const getCentroCustoLabel = (cod: string) => {
      const c = centrosCusto.find((c) => c.CTT_CUSTO.trim() === cod.trim());
      return c ? `${c.CTT_CUSTO.trim()} - ${c.CTT_DESC01.trim()}` : cod;
    };
  
    const groupBy = (
      key: "filial" | "cc",
      labelResolver: (cod: string) => string
    ) => {
      const map = new Map<string, number>();
      for (const item of rateios) {
        map.set(item[key], (map.get(item[key]) || 0) + item.valor);
      }
  
      return Array.from(map.entries()).map(([code, value], i) => ({
        name: labelResolver(code),
        value,
        fill: getColor(i),
      }));
    };
  
    const dataFilial = groupBy("filial", getFilialLabel);
    const dataCc = groupBy("cc", getCentroCustoLabel);
  
    const chartConfig: ChartConfig = {
      // legend config
      ...Object.fromEntries(
        [...dataFilial, ...dataCc].map((item) => [
          item.name,
          {
            label: item.name,
            color: item.fill,
          },
        ])
      ),
      filial: {
        label: "Filial",
      },
      cc: { 
        label: "Centro de Custo",
      },
    };
  
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Distribuição de Rateio</CardTitle>
          <CardDescription>
            Gráfico com agrupamento por Filial e Centro de Custo
          </CardDescription>
        </CardHeader>
  
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[280px]"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelKey="tipo"
                    nameKey="name"
                    indicator="line"
                    labelFormatter={(_, payload) => {
                      const item = payload?.[0];
                      if (!item) return "";
                      const isCC = dataCc.some((d) => d.name === item.name);
                      return isCC ? "Centro de Custo" : "Filial";
                    }}
                  />
                }
              />
              {/* Gráfico interno: Filial */}
              <Pie
                data={dataFilial.map((d) => ({ ...d, tipo: "Filial" }))}
                dataKey="value"
                nameKey="name"
                outerRadius={60}
              >
                {dataFilial.map((entry, index) => (
                  <Cell key={`filial-${index}`} fill={entry.fill} />
                ))}
              </Pie>
  
              {/* Gráfico externo: Centro de Custo */}
              <Pie
                data={dataCc.map((d) => ({ ...d, tipo: "Centro de Custo" }))}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={2}
              >
                {dataCc.map((entry, index) => (
                  <Cell key={`cc-${index}`} fill={entry.fill} />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
  
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium leading-none">
            Crescimento estimado com base no total distribuído
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Visualização detalhada da distribuição por CC e Filial
          </div>
        </CardFooter>
      </Card>
    );
  }