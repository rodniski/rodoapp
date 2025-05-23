"use client";

import { fetchHistoricoPreNota } from "@prenota/actions";
import type { HistoricoEntry } from "@prenota/actions";
import { defaultQueryOptions } from "@prenota/config";
import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

/**
 * Hook para obter histórico de Pré-Nota usando RECSF1.
 * @param recsf1 - Identificador obrigatório da Pré-Nota.
 * @param options - Opções adicionais do useQuery.
 */
export function useHistoricoPreNota(
  recsf1: string | undefined | null,
  options?: Partial<
    Omit<UseQueryOptions<HistoricoEntry[], Error>, "queryKey" | "queryFn">
  >
): UseQueryResult<HistoricoEntry[], Error> {
  return useQuery({
    queryKey: ["historicoPreNota", recsf1],
    queryFn: () => fetchHistoricoPreNota(recsf1!),
    enabled: Boolean(recsf1),
    ...defaultQueryOptions,
    ...options,
  });
}
