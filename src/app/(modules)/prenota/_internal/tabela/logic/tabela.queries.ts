"use client"; //* Hooks que usam APIs do React ou estado global devem ser Client Components.

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { prenotaQueryKeys, fetchPrenotas } from "@prenota/tabela";
import { defaultQueryOptions } from "@prenota/config";
import { useDataTableStore } from "ui";
import { useEffect } from "react";
import { toast } from "sonner";
import { logger } from "utils";
import type {
  UsePrenotasOptions,
  FetchPrenotasApiParams,
  FetchPrenotasResponse,
} from "@prenota/tabela";

/**
 * @hook usePrenotas
 * @description Hook customizado e otimizado para buscar dados paginados, ordenados e
 * filtrados de pré-notas utilizando TanStack Query v5.
 * - Integra-se com `useDataTableStore` para filtros dinâmicos.
 * - Exibe toasts de erro informativos (Sonner) com ação de retry utilizando o `refetch` da query.
 * - Utiliza `placeholderData` para melhor UX em atualizações de dados.
 * - Permite suprimir o handler de erro global do QueryClient via `meta` tag.
 *
 * @param options Opções para paginação, busca por termo, ordenação inicial e filiais.
 * Filtros dinâmicos são primariamente gerenciados pelo `useDataTableStore`.
 * @returns O estado completo da query do TanStack Query, incluindo dados, status, e funções de refetch.
 */
export const usePrenotas = (options: UsePrenotasOptions = {}) => {
  const {
    page = 1,
    pageSize = 10,
    filials = [],
    searchTerm = "",
    sorting = [],
  } = options;

  const { filters } = useDataTableStore();

  const apiParams: FetchPrenotasApiParams = {
    page,
    pageSize,
    filials,
    searchTerm,
    sorting,
    filters,
  };

  const queryKey = prenotaQueryKeys.list(apiParams);

  const queryResult = useQuery<
    // Especificando os tipos para clareza
    FetchPrenotasResponse, // TData
    Error, // TError
    FetchPrenotasResponse, // TQueryData
    ReturnType<typeof prenotaQueryKeys.list> // TQueryKey
  >({
    queryKey,
    queryFn: () => fetchPrenotas(apiParams),
    ...defaultQueryOptions,
    placeholderData: keepPreviousData,
    meta: {
      suppressGlobalErrorHandler: true,
    },
  });

  // Efeito colateral para tratar erros
  useEffect(() => {
    if (queryResult.isError && queryResult.error) {
      const error = queryResult.error;

      logger.warn(
        `Falha na query 'usePrenotas' (tratada localmente via useEffect)`,
        {
          component: "tabela.queries.ts (usePrenotas)",
          queryKey, // Usando a queryKey do escopo do hook para logging
          hookOptionsReceived: options,
          errorMessage: error.message,
        }
      );

      toast.error("Falha ao Carregar Pré-Notas", {
        description:
          error.message ||
          "Não foi possível buscar as informações da tabela. Por favor, verifique sua conexão e tente novamente.",
        action: {
          label: "Tentar Novamente",
          onClick: () => {
            toast.dismiss(); // Fecha o toast atual antes de tentar novamente
            queryResult.refetch(); //* USA A FUNÇÃO REFETCH DO RESULTADO DA QUERY
          },
        },
      });
    }
    //? Array de dependências do useEffect para o tratamento de erro.
    //   queryResult.refetch tem uma identidade estável.
    //   Incluímos 'options' e 'queryKey' porque são usados dentro do logger ou na ação do toast.
  }, [
    queryResult.isError,
    queryResult.error,
    queryResult.refetch, // Adicionado refetch como dependência
    queryKey, // queryKey do escopo externo
    options, // options do hook
  ]);

  // Efeito colateral para logar sucesso (opcional)
  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data) {
      logger.info(`'usePrenotas' carregou dados com sucesso (via useEffect)`, {
        queryKey, // Usando a queryKey do escopo do hook para logging
        itemsCount: queryResult.data.data.length,
        currentPage: queryResult.data.currentPage,
        totalPages: queryResult.data.totalPages,
      });
    }
  }, [queryResult.isSuccess, queryResult.data, queryKey]); // queryKey do escopo externo

  return queryResult;
};
