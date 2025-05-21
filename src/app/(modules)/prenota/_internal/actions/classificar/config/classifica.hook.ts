// src/hooks/classifica.hook.ts
// ----------------------------
import { useQuery, type QueryKey, type UseQueryOptions } from "@tanstack/react-query";
import { fetchProdutosPrenota } from "@prenota/actions";
import type { ProdutoPrenota } from "@prenota/actions";

// chave auxiliar para compor queries                               
const produtosKey = (rec: number): QueryKey => ["prenota", rec, "produtos"];

/**
 * Hook que consulta os itens (produtos) de uma pré-nota.
 *
 * @param rec        RECNO da SF1.
 * @param enabled    se false, não dispara a query.
 * @param options    qualquer opção extra do TanStack useQuery.
 */
export function useProdutosPrenota(
  rec: number,
  {
    enabled = true,
    ...options
  }: Omit<
    UseQueryOptions<ProdutoPrenota[], Error>,
    "queryKey" | "queryFn" | "initialData"
  > & { enabled?: boolean } = {}
) {
  return useQuery<ProdutoPrenota[], Error>({
    queryKey: produtosKey(rec),
    queryFn: ({ signal }) => fetchProdutosPrenota(rec, signal),
    enabled: enabled && Number.isFinite(rec),
    staleTime: 1000 * 60, // 1min – ajuste se quiser
    ...options,
  });
}
