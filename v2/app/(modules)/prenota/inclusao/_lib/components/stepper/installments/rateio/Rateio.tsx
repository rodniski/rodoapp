// _lib/components/stepper/header/RateioCard.tsx (Final com Z10_*)
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "ui";
import { useAuxStore as useLoginAuxStore } from "@login/stores";
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
// Importa RateioForm, RateioTable (simplificada), RateioChartView
import { RateioTable, RateioChartView, RateioForm } from ".";
// Importa o tipo Rateio ATUALIZADO
import type { Rateio as RateioType } from "@inclusao/types"; // Ajuste path se necessário

// Interface para opções do Combobox
interface ComboboxOption {
  value: string;
  label: string;
}

export function RateioCard() {
  // --- Stores ---
  const filiais = useLoginAuxStore((state) => state.filiais);
  const centroCusto = useLoginAuxStore((state) => state.centroCusto);
  const rateios = usePreNotaStore((state) => state.draft.rateios);
  const addRateio = usePreNotaStore((state) => state.addRateio);
  const totalGeralXml = useValorTotalXml();

  // --- Estados Locais para o Formulário ---
  const [selectedFilial, setSelectedFilial] = useState<string | null>(null);
  const [selectedCentroCusto, setSelectedCentroCusto] = useState<string | null>(
    null
  );
  const [valor, setValor] = useState<number>(0);
  const [porcentagem, setPorcentagem] = useState<number>(0);

  // --- Cálculos ---
  const totalGeral = useMemo(() => totalGeralXml ?? 0, [totalGeralXml]);
  // <<< Usa Z10_VALOR
  const totalDivisaoSalva = useMemo(
    () => rateios.reduce((acc, row) => acc + (row.Z10_VALOR || 0), 0),
    [rateios]
  );
  const maxValorDisponivel = useMemo(
    () => Math.max(0, parseFloat((totalGeral - totalDivisaoSalva).toFixed(2))),
    [totalGeral, totalDivisaoSalva]
  );
  const maxPercentualDisponivel = useMemo(
    () =>
      totalGeral > 0
        ? Math.max(
            0,
            parseFloat(((maxValorDisponivel / totalGeral) * 100).toFixed(2))
          )
        : 0,
    [totalGeral, maxValorDisponivel]
  );

  // --- Opções para Comboboxes ---
  const filiaisOptions = useMemo(
    (): ComboboxOption[] =>
      filiais.map((f) => ({
        value: f.numero ?? "",
        label: `${f.numero ?? ""} - ${f.filial ?? "Nome Indisponível"}`,
      })),
    [filiais]
  );
  const centroCustoOptions = useMemo(
    (): ComboboxOption[] =>
      centroCusto.map((c) => ({
        value: c.CTT_CUSTO ?? "",
        label: `${c.CTT_CUSTO ?? ""} - ${
          c.CTT_DESC01 ?? "Descrição Indisponível"
        }`,
      })),
    [centroCusto]
  );

  // --- Handlers do Formulário ---
  const handleValorChange = useCallback(
    (value: number | undefined) => {
      const numValue = value ?? 0;
      const cappedValor = Math.min(numValue, maxValorDisponivel + 0.001);
      const finalValor = parseFloat(cappedValor.toFixed(2));
      setValor(finalValor);
      if (totalGeral > 0) {
        const perc = (finalValor / totalGeral) * 100;
        setPorcentagem(
          Math.min(maxPercentualDisponivel, parseFloat(perc.toFixed(2)))
        );
      } else {
        setPorcentagem(0);
      }
    },
    [maxValorDisponivel, totalGeral, maxPercentualDisponivel]
  );

  const handlePorcentagemChange = useCallback(
    (values: number[]) => {
      let p = values[0] ?? 0;
      p = Math.min(p, maxPercentualDisponivel);
      const finalPerc = parseFloat(p.toFixed(2));
      setPorcentagem(finalPerc);
      const v = parseFloat(((finalPerc / 100) * totalGeral).toFixed(2));
      setValor(Math.min(v, maxValorDisponivel));
    },
    [maxPercentualDisponivel, totalGeral, maxValorDisponivel]
  );

  // <<< ATUALIZADO handleAddRateio para usar Z10_* >>>
  const handleAddRateio = useCallback(() => {
    if (!selectedFilial || !selectedCentroCusto || !(valor > 0.005)) {
      console.warn(
        "Selecione Filial, Centro de Custo e informe um Valor válido."
      );
      return;
    }
    if (valor > maxValorDisponivel + 0.001) {
      console.warn("Valor excede o restante disponível.");
      return;
    }

    // Cria o objeto com a nova estrutura Z10_*
    const novoRateio = {
      // Não precisa de tipo explícito aqui se o addRateio for tipado
      // Gera Z10_ITEM sequencial simples (backend/store podem fazer melhor)
      Z10_ITEM: String(rateios.length + 1).padStart(3, "0"),
      Z10_FILRAT: selectedFilial,
      Z10_CC: selectedCentroCusto,
      Z10_PERC: parseFloat(porcentagem.toFixed(2)),
      Z10_VALOR: parseFloat(valor.toFixed(2)),
      REC: 0, // Valor padrão
    };

    addRateio(novoRateio as RateioType); // Chama addRateio

    // Limpa os campos do formulário
    setSelectedFilial(null);
    setSelectedCentroCusto(null);
    setValor(0);
    setPorcentagem(0);
    // Removido filiais das dependências, não é usado diretamente no corpo
  }, [
    selectedFilial,
    selectedCentroCusto,
    valor,
    porcentagem,
    addRateio,
    rateios.length,
    maxValorDisponivel,
  ]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* --- Componente de Abas --- */}
      <Tabs
        defaultValue="table"
        className="flex flex-col flex-1 overflow-hidden pt-2"
      >
        <TabsList className="mx-4 bg-card shadow-md border">
          <TabsTrigger value="table" className="text-base flex-1">
            {" "}
            Tabela de Rateios{" "}
          </TabsTrigger>
          <TabsTrigger value="chart" className="text-base flex-1">
            {" "}
            Gráfico de Distribuição{" "}
          </TabsTrigger>
        </TabsList>

        {/* --- Conteúdo das Abas --- */}
        <TabsContent
          value="table"
          className="flex-1 flex flex-col overflow-y-auto mt-0 p-2"
        >
          {/* --- Renderiza o Formulário --- */}
          <RateioForm
            filiaisOptions={filiaisOptions}
            centroCustoOptions={centroCustoOptions}
            selectedFilial={selectedFilial}
            selectedCentroCusto={selectedCentroCusto}
            valor={valor}
            porcentagem={porcentagem}
            setSelectedFilial={setSelectedFilial}
            setSelectedCentroCusto={setSelectedCentroCusto}
            handleValorChange={handleValorChange}
            handlePorcentagemChange={handlePorcentagemChange}
            handleAddRateio={handleAddRateio}
            maxValorDisponivel={maxValorDisponivel}
            maxPercentualDisponivel={maxPercentualDisponivel}
            totalGeral={totalGeral}
          />
          <RateioTable /> {/* Tabela simplificada */}
        </TabsContent>
        <TabsContent value="chart" className="flex-1 overflow-y-auto p-2 mt-0">
          <RateioChartView />
        </TabsContent>
      </Tabs>
    </div>
  );
}
