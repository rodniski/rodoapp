/**
 * @inclusao/hooks/useSearchFornecedorPedidos.ts
 *
 * Hook para buscar fornecedores + pedidos e persistir
 * o array resultante no slice `fornecedorSearch` do
 * `usePreNotaAuxStore`.
 */
import { useState, useCallback } from "react";
import { usePreNotaAuxStore } from "@inclusao/stores";
import { searchFornecedoresPedidosSimples } from "@inclusao/api";

import type {
  Fornecedor,
  FornecedorPedidoError,
  FornecedorPedidoResponse,
} from "@inclusao/api";

/* ─────────────── types locais ─────────────── */
interface SearchFornecedorParams {
  /** termo de busca (nome / CNPJ / código) */
  busca: string;
}
interface UseSearchFornecedorPedidosReturn {
  searchFornecedor: (p: SearchFornecedorParams) => Promise<Fornecedor[] | null>;
  isLoading: boolean;
  error: string | null;
}

/* ───────────────── hook ───────────────── */
export function useSearchFornecedorPedidos(): UseSearchFornecedorPedidosReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /** ações do slice auxiliar */
  const { setSearchResult, clearSearchResult } =
    usePreNotaAuxStore.getState().fornecedorSearch;

  const searchFornecedor = useCallback(
    async ({
      busca,
    }: SearchFornecedorParams): Promise<Fornecedor[] | null> => {
      if (!busca?.trim()) {
        setError("Parâmetro 'busca' é obrigatório.");
        return null;
      }

      setIsLoading(true);
      setError(null);
      clearSearchResult();

      try {
        /* ➊ chama API */
        const rawResp: FornecedorPedidoResponse | string =
          await searchFornecedoresPedidosSimples(busca);

        /* ➋ garante array */
        const parsedResp: Fornecedor[] = Array.isArray(rawResp)
          ? rawResp
          : JSON.parse(rawResp); // se vier string JSON

        /* ➌ persiste no store */
        setSearchResult(parsedResp);

        console.log(
          `[useSearchFornecedorPedidos] 🔍 '${busca}' ⇒ ${parsedResp.length} fornecedor(es).`
        );
        return parsedResp;
      } catch (err) {
        clearSearchResult();

        const friendly =
          err instanceof Error
            ? err.message
            : (err as FornecedorPedidoError)?.message ||
              (err as FornecedorPedidoError)?.error ||
              "Erro desconhecido.";

        console.error("[useSearchFornecedorPedidos] erro:", err);
        setError(`Erro ao buscar fornecedor: ${friendly}`);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setSearchResult, clearSearchResult]
  );

  return { searchFornecedor, isLoading, error };
}
