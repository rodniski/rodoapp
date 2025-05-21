"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { solicitarRevisaoPreNota } from "@prenota/actions";
import { defaultQueryOptions } from "@prenota/config";
import { toast } from "sonner";
import type {
  RevisaoPreNotaPayload,
  RevisaoPreNotaApiResponse,
} from "@prenota/actions";
// Interface para as variáveis da mutação, incluindo o toastId opcional
type MutationVariables = RevisaoPreNotaPayload & { toastId?: string | number };

/**
 * Hook para solicitar revisão de Pré-Notas.
 */
export function useRevisaoPreNota() {
  const queryClient = useQueryClient();

  return useMutation<
    RevisaoPreNotaApiResponse,
    Error, // Tipo do erro
    MutationVariables // Variáveis da mutação (payload + toastId)
  >({
    mutationFn: async (variables) => {
      const { toastId, ...actualPayload } = variables; // Separa toastId do payload real
      // A action 'solicitarRevisaoPreNota' espera 'RevisaoPreNotaPayload'
      const response = await solicitarRevisaoPreNota(
        actualPayload as RevisaoPreNotaPayload
      );

      if (!response.Sucesso) {
        // Anexa a resposta da API ao erro para mais contexto no onError
        const error = new Error(
          response.Mensagem || "Falha na solicitação de revisão pela API."
        ) as Error & {
          cause?: string;
          apiResponse?: RevisaoPreNotaApiResponse;
        };
        error.cause = "api_logic";
        error.apiResponse = response;
        throw error;
      }
      return response;
    },

    onSuccess: (data, variables) => {
      const successMessage =
        data.Mensagem ||
        `Operação para REC ${variables.RECSF1} concluída com sucesso!`;

      if (variables.toastId) {
        toast.success(successMessage, { id: variables.toastId });
      } else {
        toast.success(successMessage);
      }

      queryClient.invalidateQueries({ queryKey: ["prenotas-lista"] });

      const recsf1 = variables.RECSF1; // Vem direto das variáveis da mutação
      if (recsf1) {
        queryClient.invalidateQueries({
          queryKey: ["prenota-detalhe", recsf1],
        });
        queryClient.invalidateQueries({
          queryKey: ["historicoPreNota", recsf1],
        });
      }
    },

    onError: (
      error: Error & { apiResponse?: RevisaoPreNotaApiResponse },
      variables
    ) => {
      let detailedMessage = `REC ${variables.RECSF1}: `;

      // Tenta usar a mensagem da API se disponível e mais específica
      if (error.apiResponse && error.apiResponse.Mensagem) {
        detailedMessage += error.apiResponse.Mensagem;
      } else {
        detailedMessage +=
          error.message || "Erro desconhecido ao processar a solicitação.";
      }

      if (variables.toastId) {
        toast.error(detailedMessage, { id: variables.toastId, duration: 7000 }); // Mais tempo para erros
      } else {
        toast.error(detailedMessage, { duration: 7000 });
      }
    },
    ...defaultQueryOptions,
  });
}
