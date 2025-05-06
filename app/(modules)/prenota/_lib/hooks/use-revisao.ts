// src/hooks/use-revisao.ts
"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { solicitarRevisaoPreNota } from "@prenota/api";
import type {
  RevisaoPreNotaPayload,
  RevisaoPreNotaApiResponse,
} from "@prenota/types";

/**
 * Tipagem para erros específicos lançados pelo hook de revisão.
 */
interface UseRevisaoPreNotaError extends Error {
  cause?: "api_logic" | "network" | "unknown";
}

/**
 * Hook para solicitar a revisão de uma Pré-Nota.
 */
export function useRevisaoPreNota() {
  const queryClient = useQueryClient();
  const hookName = "useRevisaoPreNota";

  return useMutation<
    RevisaoPreNotaApiResponse, // Tipo do dado retornado por mutationFn em caso de SUCESSO LÓGICO da API
    UseRevisaoPreNotaError, // Tipo do erro que o hook pode lançar
    RevisaoPreNotaPayload // Tipo das variáveis passadas para a função `mutate`
  >({
    mutationFn: async (
      payload: RevisaoPreNotaPayload
    ): Promise<RevisaoPreNotaApiResponse> => {
      const logPrefix = `[${hookName}]`;
      console.log(`${logPrefix} Iniciando solicitação de revisão...`, payload);

      const response = await solicitarRevisaoPreNota(payload);

      // Checagem crucial do sucesso LÓGICO da API Protheus
      if (!response.Sucesso) {
        console.error(
          `${logPrefix} Erro lógico da API:`,
          response.Mensagem,
          response
        );
        const error = new Error(
          response.Mensagem || "Falha ao solicitar revisão (API indicou erro)."
        ) as UseRevisaoPreNotaError;
        error.cause = "api_logic";
        throw error; // Lança o erro para ser pego pelo onError da mutação
      }

      console.log(
        `${logPrefix} Solicitação de revisão bem-sucedida (API).`,
        response
      );
      return response; // Retorna a resposta de sucesso completa
    },

    onSuccess: (data, variables) => {
      // data aqui é RevisaoPreNotaSuccessResponse
      const successMessage =
        data.Mensagem || "Solicitação de revisão enviada com sucesso!";
      toast.success(successMessage);
      console.log(`[${hookName}] Mutação onSuccess:`, successMessage, data);

      // Invalida queries para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ["prenotas-lista"] }); // Atualiza lista geral
      // Se 'REC' estiver na resposta ou nas variáveis, use-o para invalidar o detalhe
      const recsf1 = variables.RECSF1 || (data as any).REC; // Tenta pegar o REC
      if (recsf1) {
        queryClient.invalidateQueries({
          queryKey: ["prenota-detalhe", recsf1],
        });
        queryClient.invalidateQueries({
          queryKey: ["historicoPreNota", recsf1],
        }); // Invalida histórico também
      }
    },

    onError: (error: UseRevisaoPreNotaError, variables) => {
      console.error(
        `[${hookName}] Mutação onError para RECSF1 ${variables.RECSF1}:`,
        error
      );
      toast.error(error.message || "Ocorreu um erro ao solicitar a revisão.");
    },
  });
}
