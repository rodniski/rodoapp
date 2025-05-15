/**
 * @inclusao/hooks/useSearchFornecedorPedidos.ts
 *
 * Hook para buscar fornecedores + pedidos e persistir
 * o array resultante no slice `fornecedorSearch` do
 * `usePreNotaAuxStore`.
 */
import { useState, useCallback } from "react";
import { usePreNotaAuxStore } from "@inclusao/stores"; // Ajuste o caminho se necessário
import { searchFornecedoresPedidosSimples } from "@inclusao/api"; // Ajuste o caminho se necessário

import type {
  Fornecedor,
  FornecedorPedidoError,
  FornecedorPedidoResponse,
} from "@inclusao/api"; // Ajuste o caminho se necessário

/* ─────────────── types locais ─────────────── */
interface SearchFornecedorParams {
  /** termo de busca (nome / CNPJ / código) */
  busca: string;
}
interface UseSearchFornecedorPedidosReturn {
  searchFornecedor: (p: SearchFornecedorParams) => Promise<Fornecedor[] | null>;
  isLoading: boolean;
  error: string | null;
  // data: Fornecedor[] | null; // Opcional: se quiser expor os dados diretamente do hook
}

/* ───────────────── hook ───────────────── */
export function useSearchFornecedorPedidos(): UseSearchFornecedorPedidosReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [data, setData] = useState<Fornecedor[] | null>(null); // Opcional

  /** ações do slice auxiliar */
  const { setSearchResult, clearSearchResult } =
    usePreNotaAuxStore.getState().fornecedorSearch;

  const searchFornecedor = useCallback(
    async ({
      busca,
    }: SearchFornecedorParams): Promise<Fornecedor[] | null> => {
      if (!busca?.trim()) {
        // Não define erro aqui, pois pode ser uma limpeza intencional
        // Apenas retorna null ou array vazio e limpa o resultado.
        clearSearchResult();
        // setData(null); // Opcional
        return null;
      }

      setIsLoading(true);
      setError(null);
      // setData(null); // Opcional: Limpa dados anteriores ao iniciar nova busca
      clearSearchResult(); // Limpa resultado no store auxiliar

      try {
        /* ➊ chama API */
        const rawResp: FornecedorPedidoResponse | string | null | undefined =
          await searchFornecedoresPedidosSimples(busca);

        let parsedResp: Fornecedor[] = []; // Default para array vazio

        /* ➋ garante array e trata respostas vazias/inválidas antes do parse */
        if (Array.isArray(rawResp)) {
          parsedResp = rawResp;
        } else if (typeof rawResp === 'string' && rawResp !== '') {
          // Só tenta parsear se for uma string não vazia
          try {
            const jsonData = JSON.parse(rawResp);
            // Verifica se o resultado do parse é um array
            if (Array.isArray(jsonData)) {
              parsedResp = jsonData;
            } else {
              // Se parseou mas não é array (ex: um objeto de erro da API em formato JSON)
              console.warn("[useSearchFornecedorPedidos] API retornou um JSON que não é um array:", jsonData);
              // Tentar extrair uma mensagem de erro se for um objeto de erro conhecido
              const apiError = jsonData as FornecedorPedidoError;
              if (apiError && (apiError.message || apiError.error)) {
                throw new Error(apiError.message || apiError.error || "Resposta JSON inesperada da API.");
              }
              // Se não for um erro conhecido, mas ainda assim um JSON não array, trata como erro.
              throw new Error("Formato de resposta JSON inesperado da API.");
            }
          } catch (parseError) {
            // Se o JSON.parse falhar (ex: rawResp é uma string não-JSON como "Nenhum resultado")
            console.error("[useSearchFornecedorPedidos] Erro ao parsear resposta da API:", parseError);
            console.error("[useSearchFornecedorPedidos] Resposta recebida que causou o erro:", rawResp);
            throw new Error("Resposta inválida recebida da API. Não foi possível processar os dados.");
          }
        } else if (rawResp === null || rawResp === undefined || rawResp === "") {
          // Se a API retornar explicitamente null, undefined ou string vazia, considera como sem resultados.
          console.log(`[useSearchFornecedorPedidos] API retornou resposta vazia para '${busca}'.`);
          parsedResp = [];
        }
        // Se rawResp for outro tipo inesperado, parsedResp permanecerá []

        /* ➌ persiste no store */
        setSearchResult(parsedResp);
        // setData(parsedResp); // Opcional

        console.log(
          `[useSearchFornecedorPedidos] 🔍 '${busca}' ⇒ ${parsedResp.length} fornecedor(es).`
        );
        return parsedResp;
      } catch (err) {
        clearSearchResult();
        // setData(null); // Opcional

        const friendlyMessage =
          err instanceof Error
            ? err.message
            : "Erro desconhecido ao processar a busca.";

        console.error("[useSearchFornecedorPedidos] erro na busca ou processamento:", err);
        setError(`Erro: ${friendlyMessage}`);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [setSearchResult, clearSearchResult] // setData não precisa ser dependência se for só local
  );

  return { searchFornecedor, isLoading, error /*, data */ }; // Opcional: retornar data
}
