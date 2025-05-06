// src/hooks/useLikeProdutoQuery.ts
import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { fetchLikeProduto, Produto } from "../api/produto";

/**
 * Hook para buscar produtos via likeprod
 * @param termo - termo de busca
 */
export function useLikeProdutoQuery(
  termo: string
): UseQueryResult<Produto[], Error> {
  return useQuery<Produto[], Error>(
    ["likeProduto", termo],
    () => fetchLikeProduto(termo),
  );
}
