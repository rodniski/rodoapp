// useHistoricoPreNota.ts
"use client";

import {
  useQuery,
  // QueryKey, // Não usado diretamente aqui, mas bom para referência
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";
// Supondo que estas importações estejam corretas:
import { fetchHistoricoPreNota } from "../api"; // Ajuste o caminho conforme necessário
import type { HistoricoEntry } from "../types"; // Ajuste o caminho conforme necessário

// Opções padrão para este hook
const defaultQueryOptions = {
  staleTime: 5 * 60 * 1000, // 5 minutos
  cacheTime: 10 * 60 * 1000, // 10 minutos
  retry: 1,
  refetchOnWindowFocus: false,
};

/**
 * Define o tipo específico para a query key deste hook.
 */
type HistoricoPreNotaQueryKey = readonly [
  "historicoPreNota",
  string | null | undefined
];

/**
 * Hook para buscar e gerenciar o estado do histórico de uma Pré-Nota.
 * @param recsf1 - O RECSF1 da Pré-Nota. A query é desabilitada se for nulo/undefined.
 * @param hookOptions - Opções adicionais para sobrescrever ou adicionar ao useQuery.
 */
export function useHistoricoPreNota(
  recsf1: string | undefined | null,
  hookOptions?: Partial<
    Omit<
      UseQueryOptions<
        HistoricoEntry[],
        Error,
        HistoricoEntry[], // TData (tipo do dado após select, se houver)
        HistoricoPreNotaQueryKey
      >,
      "queryKey" | "queryFn"
    >
    // Se você usar `select` para transformar os dados para um tipo diferente,
    // o tipo de retorno de UseQueryResult e TData precisariam ser ajustados.
    // Ex: & { select?: (data: HistoricoEntry[]) => OutroTipo[] }
    // E o retorno seria UseQueryResult<OutroTipo[], Error>
  >
): UseQueryResult<HistoricoEntry[], Error> {
  const hookName = "useHistoricoPreNota";

  const queryKey: HistoricoPreNotaQueryKey = [
    "historicoPreNota",
    recsf1,
  ] as const; // `as const` é bom para ajudar na inferência de tuplas

  const combinedQueryOptions: UseQueryOptions<
    HistoricoEntry[], // TQueryFnData
    Error,            // TError
    HistoricoEntry[], // TData
    HistoricoPreNotaQueryKey // TQueryKey
  > = {
    queryKey: queryKey,
    queryFn: async ({ queryKey: contextQueryKey }) => {
      const currentRecsf1 = contextQueryKey[1]; // Já tipado por HistoricoPreNotaQueryKey

      console.log(
        `%c[${hookName}]%c Executando queryFn para RECSF1: ${currentRecsf1}`,
        "color: purple; font-weight: bold;",
        "color: blue;"
      );
      if (!currentRecsf1) {
        console.warn(
          `%c[${hookName}]%c queryFn chamado sem RECSF1. Retornando array vazio.`,
          "color: purple; font-weight: bold;",
          "color: orange;"
        );
        return []; // Retorna array vazio ou lança erro, conforme sua lógica de API
      }
      return fetchHistoricoPreNota(currentRecsf1);
    },
    ...defaultQueryOptions,
    enabled: !!recsf1, // Habilita a query somente se recsf1 tiver valor
    ...(hookOptions || {}),
  };

  // O useQuery aqui pode inferir TData e TQueryKey de combinedQueryOptions.
  // Especificar <HistoricoEntry[], Error> foca em TQueryFnData e TError.
  return useQuery<
    HistoricoEntry[], // TQueryFnData - O que a queryFn retorna
    Error,            // TError
    HistoricoEntry[], // TData - O tipo de 'data' no resultado (pode ser diferente se 'select' for usado)
    HistoricoPreNotaQueryKey // TQueryKey
  >(combinedQueryOptions);
}