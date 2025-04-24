// _lib/components/stepper/header/RateioCard.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Button,
  Input,
  Label,
  Slider,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Combobox,
} from "ui";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
import { useAuxStore as useLoginAuxStore } from "@login/stores";
import { RateioTable, RateioChartView } from ".";
import type { Rateio as RateioType } from "@inclusao/types";
import type { FilialGeral, CentroCusto } from "@login/types";

export function RateioCard() {
  // Stores
  const filiais = useLoginAuxStore((state) => state.filiais);
  const centroCusto = useLoginAuxStore((state) => state.centroCusto);
  const rateios = usePreNotaStore((state) => state.draft.rateios);
  const addRateio = usePreNotaStore((state) => state.addRateio);
  const totalGeralXml = useValorTotalXml();

  // Estados Locais
  const [selectedFilial, setSelectedFilial] = useState<string | null>(null);
  const [selectedCC, setSelectedCC] = useState<string | null>(null);
  const [valor, setValor] = useState<number>(0);
  const [percent, setPercent] = useState<number>(0);

  // Cálculos Derivados
  const totalGeral = totalGeralXml ?? 0;
  const totalRateado = useMemo(
    () => rateios.reduce((sum, r) => sum + (r.valor || 0), 0),
    [rateios]
  );
  const maxValor = useMemo(
    () => Math.max(0, parseFloat((totalGeral - totalRateado).toFixed(2))),
    [totalGeral, totalRateado]
  );
  const maxPercent = useMemo(
    () => (totalGeral > 0 ? Math.max(0, (maxValor / totalGeral) * 100) : 0),
    [totalGeral, maxValor]
  );
  const porcentagemJaRateada = useMemo(
    () =>
      totalGeral > 0
        ? parseFloat(((totalRateado / totalGeral) * 100).toFixed(2))
        : 0,
    [totalGeral, totalRateado]
  );

  // Handlers
  const handleValorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[R$.]/g, "").replace(",", ".");
    let num = Number(raw);
    if (isNaN(num)) num = 0;
    num = Math.min(num, maxValor + 0.001);
    num = Math.max(0, num);
    setValor(parseFloat(num.toFixed(2)));
    if (totalGeral > 0) {
      const calculatedPercent = (num / totalGeral) * 100;
      setPercent(
        Math.min(maxPercent, parseFloat(calculatedPercent.toFixed(2)))
      );
    } else {
      setPercent(0);
    }
  };

  const handlePercentChange = (vals: number[]) => {
    let p = vals[0] ?? 0;
    p = Math.min(p, maxPercent);
    p = Math.max(0, p);
    setPercent(parseFloat(p.toFixed(2)));
    const v = parseFloat(((p / 100) * totalGeral).toFixed(2));
    setValor(v);
  };

  const handleAdd = () => {
    if (!selectedFilial || !selectedCC || valor <= 0.005) {
      console.warn("Seleção inválida ou valor muito baixo.");
      return;
    }
    if (valor > maxValor + 0.001) {
      console.warn("Valor excede o restante.");
      return;
    }
    addRateio({
      id: String(Date.now()),
      seq: String(rateios.length + 1).padStart(3, "0"),
      FIL: selectedFilial,
      filial: selectedFilial,
      cc: selectedCC,
      percent: parseFloat(percent.toFixed(2)),
      valor: parseFloat(valor.toFixed(2)),
      REC: 0,
    });
    setSelectedFilial(null);
    setSelectedCC(null);
    setValor(0);
    setPercent(0);
  };

  // Opções Combobox
  const filialOptions = useMemo(
    () =>
      filiais.map((f) => ({
        value: f.numero ?? "",
        label: `${f.numero ?? ""} - ${f.filial ?? "Nome Indisponível"}`,
      })),
    [filiais]
  );
  const ccOptions = useMemo(
    () =>
      centroCusto.map((c) => ({
        value: c.CTT_CUSTO ?? "",
        label: `${c.CTT_CUSTO ?? ""} - ${c.CTT_DESC01 ?? "Descrição Indisponível"}`,
      })),
    [centroCusto]
  );

  return (
    <div className="flex flex-col h-full w-full">
      <Tabs defaultValue="table" className="flex flex-col flex-1 overflow-hidden">
        <TabsList className="bg-card shadow-md border">
          <TabsTrigger value="table" className="px-4 py-2 text-base">
            Tabela
          </TabsTrigger>
          <TabsTrigger value="chart" className="px-4 py-2 text-base">
            Gráfico
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="table"
          className="flex-1 flex flex-col overflow-hidden mt-0"
        >
          <div className="p-4 border-b shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end mb-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rateio-filial">Filial</Label>
                <Combobox
                  items={filialOptions}
                  selectedValue={selectedFilial}
                  onSelect={setSelectedFilial}
                  placeholder="Selecione Filial..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rateio-cc">Centro de Custo</Label>
                <Combobox
                  items={ccOptions}
                  selectedValue={selectedCC}
                  onSelect={setSelectedCC}
                  placeholder="Selecione CC..."
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rateio-valor">
                  Valor (Restante:{" "}
                  {maxValor.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                  )
                </Label>
                <Input
                  id="rateio-valor"
                  placeholder="R$ 0,00"
                  value={
                    valor === 0
                      ? ""
                      : valor.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })
                  }
                  onChange={handleValorChange}
                  disabled={totalGeral <= 0 || maxValor < 0.01}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>
                  Percentual ({percent.toFixed(2)}% de {maxPercent.toFixed(2)}% disp.)
                </Label>
                <Slider
                  value={[percent]}
                  onValueChange={handlePercentChange}
                  max={100}
                  step={0.01}
                  disabled={totalGeral <= 0 || maxPercent < 0.01}
                />
              </div>
            </div>
            <div className="flex justify-start">
              <Button
                onClick={handleAdd}
                disabled={
                  !selectedFilial ||
                  !selectedCC ||
                  valor < 0.01 ||
                  totalGeral <= 0 ||
                  maxValor < 0.01
                }
              >
                Adicionar Rateio
              </Button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <RateioTable totalNf={totalGeral} />
          </div>
        </TabsContent>
        <TabsContent value="chart" className="flex-1 overflow-auto p-4 mt-0">
          <RateioChartView />
        </TabsContent>
      </Tabs>
    </div>
  );
}