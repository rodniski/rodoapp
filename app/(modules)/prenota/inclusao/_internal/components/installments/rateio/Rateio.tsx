// _lib/components/stepper/header/RateioCard.tsx
"use client";

import React, { useMemo, useEffect } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ComboboxItem,
  ScrollArea,
} from "ui";
import { useAuxStore as useLoginAuxStore } from "@login/stores";
// Importar o tipo Parcela para o mapeamento
import { usePreNotaStore, useValorTotalXml } from "@inclusao/stores";
import { RateioTable, RateioChartView, RateioForm } from ".";
import { CondicaoPagamentoForm } from "../condicao/Condicao";
// Assumir que useCondicaoPagamento retorna um tipo CondicaoPagamentoResponse
// que tem uma propriedade Pagamentos: PagamentoAPI[]
import { useCondicaoPagamento } from "@inclusao/hooks";
import { Parcela } from "@inclusao/types";

// Tipo para o objeto Pagamento como ele vem da API (exemplo)
// Ajuste este tipo para corresponder à estrutura real de condicaoData.Pagamentos
interface PagamentoAPI {
  Parcela: string; // Ou o nome do campo que a sua API retorna para o número da parcela
  Vencimento: string; // Assumindo formato YYYYMMDD da API
  Valor: number; // Ou o nome do campo que a sua API retorna para o valor
  // Outros campos que podem vir da API...
}

// Função helper para converter data de YYYYMMDD para DD/MM/YYYY
function formatApiDateToParcelaDate(
  apiDate: string | undefined | null
): Parcela["Vencimento"] {
  if (!apiDate || apiDate.length !== 8) {
    return ""; // Retorna string vazia se a data for inválida ou não tiver 8 caracteres
  }
  const year = apiDate.substring(0, 4);
  const month = apiDate.substring(4, 6);
  const day = apiDate.substring(6, 8);
  // Validação simples dos componentes (se são números)
  if (isNaN(parseInt(year)) || isNaN(parseInt(month)) || isNaN(parseInt(day))) {
    return "";
  }
  return `${day}/${month}/${year}` as Parcela["Vencimento"];
}

export function RateioCard() {
  // Stores de contexto
  const filiais = useLoginAuxStore((s) => s.filiais);
  const centroCusto = useLoginAuxStore((s) => s.centroCusto);

  // Store principal de pré-nota
  const rateios = usePreNotaStore((s) => s.draft.RATEIOS);
  const addRateio = usePreNotaStore((s) => s.addRateio);
  const updateRateio = usePreNotaStore((s) => s.updateRateio);
  const setParcelas = usePreNotaStore((s) => s.setParcelas);
  const totalGeralXml = useValorTotalXml();

  // Hook que busca a condição de pagamento
  const {
    data: condicaoData,
    isLoading: condicaoIsLoading,
    error: condicaoError,
  } = useCondicaoPagamento();

  // Toda vez que condicaoData mudar, transforma e salva na store
  useEffect(() => {
    if (condicaoData && condicaoData.Pagamentos) {
      // Mapeia os Pagamentos da API para o tipo Parcela esperado pelo store
      const parcelasFormatadas: Parcela[] = condicaoData.Pagamentos.map(
        (pagamentoApi: PagamentoAPI): Parcela => {
          return {
            Parcela: pagamentoApi.Parcela, // Assumindo que o nome do campo é o mesmo
            Vencimento: formatApiDateToParcelaDate(pagamentoApi.Vencimento),
            Valor: pagamentoApi.Valor, // Assumindo que o nome do campo é o mesmo
          };
        }
      );
      setParcelas(parcelasFormatadas ?? []);
    } else if (condicaoData && !condicaoData.Pagamentos) {
      // Se condicaoData existir mas Pagamentos for undefined/null, define como array vazio
      setParcelas([]);
    }
  }, [condicaoData, setParcelas]);

  // Cálculos para o Rateio
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
          <ScrollArea className="h-full overflow-auto">
            <RateioForm
              filiaisOptions={filiaisOptions}
              centroCustoOptions={centroCustoOptions}
              totalGeral={totalGeral}
              rateios={rateios || []} // Garante que rateios seja sempre um array
              addRateio={addRateio}
              updateRateio={updateRateio}
            />

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
