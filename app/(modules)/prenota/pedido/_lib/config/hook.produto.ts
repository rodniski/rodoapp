// Exemplo de localização: src/hooks/queries/useSearchProducts.ts
// ou src/features/products/hooks/useSearchProducts.ts

import { useQuery, UseQueryResult } from '@tanstack/react-query';
// Importa a função de API e o tipo do resultado
import { fetchProductsAPI } from './api.produto'; // Ajuste o caminho conforme sua estrutura
import {type ClientProductSearchResult } from './type.produto';
interface UseSearchProductsOptions {
  searchTerm: string;
  limit?: number;
  enabled?: boolean; // Para controlar se a query deve ser executada
  // Outras opções do useQuery podem ser adicionadas aqui se necessário (staleTime, cacheTime, etc.)
}

// Define o tipo de retorno do hook para melhor clareza
type UseSearchProductsResult = UseQueryResult<ClientProductSearchResult[], Error>;

/**
 * Hook customizado para buscar produtos usando TanStack Query.
 * @param options - Opções para a busca, incluindo searchTerm, limit e enabled.
 * @returns O resultado da query, incluindo dados, estado de carregamento e erro.
 */
export function useSearchProducts(options: UseSearchProductsOptions): UseSearchProductsResult {
  const { searchTerm, limit = 50, enabled = true } = options;

  // A chave da query inclui o searchTerm e o limit para que a query seja
  // refeita e armazenada em cache corretamente quando esses parâmetros mudarem.
  const queryKey = ['products', { searchTerm: searchTerm.trim(), limit }];

  return useQuery<ClientProductSearchResult[], Error, ClientProductSearchResult[], typeof queryKey>({
    queryKey: queryKey,
    // A função da query só será chamada se o searchTerm não estiver vazio.
    // E se 'enabled' for true.
    queryFn: async () => {
      if (!searchTerm || searchTerm.trim() === "") {
        // Retorna array vazio se o termo de busca for inválido,
        // evitando uma chamada desnecessária à API.
        return [];
      }
      return fetchProductsAPI({ searchTerm: searchTerm.trim(), limit });
    },
    // A query só será habilitada se 'enabled' for true E o searchTerm tiver algum valor.
    // Isso previne que a query seja executada automaticamente na montagem se não houver termo.
    enabled: enabled && !!searchTerm && searchTerm.trim().length > 0,
    // Configurações opcionais do React Query:
    // staleTime: 1000 * 60 * 5, // 5 minutos antes de considerar os dados "stale"
    // cacheTime: 1000 * 60 * 10, // 10 minutos para manter os dados em cache após inatividade
    // refetchOnWindowFocus: false, // Evita refetch ao focar na janela
    // retry: 1, // Tenta novamente 1 vez em caso de erro
  });
}