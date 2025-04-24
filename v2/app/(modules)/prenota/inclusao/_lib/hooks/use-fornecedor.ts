/**
 * Hook React para buscar dados de Fornecedores e seus Pedidos Pendentes.
 * Armazena o resultado da busca no store auxiliar `usePreNotaAuxStore`
 * para visualização e seleção posterior.
 */
import { useState, useCallback } from "react";

// Stores
import { usePreNotaAuxStore } from "@inclusao/stores"; // Store auxiliar para guardar o resultado

// API Functions
import { searchFornecedoresPedidosSimples } from "@inclusao/api"; // Função da API

// Types
import type { Fornecedor, FornecedorPedidoError } from "@inclusao/api"; // Tipos de Fornecedor/Pedido e Erro
import type { FornecedorPedidoResponse } from "@inclusao/api"; // Tipo de resposta da API

// --- Interface para os parâmetros da função de busca ---
interface SearchFornecedorParams {
  busca: string;
  reca2: string;
}

// --- Interface para o retorno do Hook ---
interface UseSearchFornecedorPedidosReturn {
  /** Função para disparar a busca do fornecedor/pedidos. */
  searchFornecedor: (params: SearchFornecedorParams) => Promise<Fornecedor[] | null>; // Retorna os dados ou null em erro
  /** Indica se a busca está em andamento. */
  isLoading: boolean;
  /** Mensagem de erro em caso de falha, ou null. */
  error: string | null;
}

// --- Hook Principal ---
export function useSearchFornecedorPedidos(): UseSearchFornecedorPedidosReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Ações do Store Auxiliar para guardar/limpar o resultado da busca
  const { setSearchResult, clearSearchResult } = usePreNotaAuxStore.getState().fornecedorSearch;

  const searchFornecedor = useCallback(
    async (params: SearchFornecedorParams): Promise<Fornecedor[] | null> => {
      // Validação básica dos parâmetros
      if (!params || !params.busca) {
        const errorMsg = "Parâmetro 'busca' é obrigatório para pesquisar fornecedor.";
        console.error("useSearchFornecedorPedidos:", errorMsg);
        setError(errorMsg); // Define o erro no estado do hook
        return null; // Retorna null indicando falha na validação
      }

      setIsLoading(true);
      setError(null);
      clearSearchResult(); // Limpa resultados anteriores no store auxiliar

      try {
        // Chama a API com os parâmetros fornecidos
        const responseData: FornecedorPedidoResponse =
          await searchFornecedoresPedidosSimples(params.busca);

        // Guarda o resultado no Store Auxiliar
        setSearchResult(responseData);

        console.log(`Busca por fornecedor "${params.busca}" concluída. Resultado armazenado.`);
        return responseData; // Retorna os dados buscados

      } catch (err) {
        // Tratamento de Erro
        console.error(`useSearchFornecedorPedidos: Falha ao buscar fornecedor (Busca: ${params.busca}):`, err);
        // Limpa o resultado no store auxiliar em caso de erro
        clearSearchResult();

        if (err instanceof Error) {
          setError(`Erro ao buscar fornecedor: ${err.message}`);
        } else if (
          typeof err === "object" &&
          err !== null &&
          // Tenta acessar a mensagem de erro específica da API (se existir)
          ((err as FornecedorPedidoError).message || (err as FornecedorPedidoError).error)
        ) {
          const apiError = err as FornecedorPedidoError;
          setError(
            `Erro da API: ${apiError.message || apiError.error || JSON.stringify(err)}`
          );
        } else {
          setError("Ocorreu um erro desconhecido ao buscar fornecedor.");
        }
        return null; // Retorna null indicando que a busca falhou
      } finally {
        setIsLoading(false); // Finaliza o carregamento
      }
    },
    [setSearchResult, clearSearchResult] // Depende das ações do store auxiliar
  );

  return {
    searchFornecedor,
    isLoading,
    error,
  };
}