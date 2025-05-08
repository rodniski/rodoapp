"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { solicitarRevisaoPreNota } from "@prenota/actions";
import { defaultQueryOptions } from "@prenota/config";
import { toast } from "sonner";
import type {
  RevisaoPreNotaPayload,
  RevisaoPreNotaApiResponse,
} from "@prenota/actions";

/**
 * Hook para solicitar revisão de Pré-Notas.
 */
export function useRevisaoPreNota() {
  const queryClient = useQueryClient();

  return useMutation<
    RevisaoPreNotaApiResponse,
    Error,
    RevisaoPreNotaPayload
  >({
    mutationFn: async (payload) => {
      const response = await solicitarRevisaoPreNota(payload);

      if (!response.Sucesso) {
        const error = new Error(
          response.Mensagem || "Erro ao solicitar revisão."
        ) as Error;
        error.cause = "api_logic";
        throw error;
      }

      return response;
    },

    onSuccess: (data, variables) => {
      toast.success(data.Mensagem || "Revisão solicitada com sucesso!");

      // Atualiza lista e detalhes após sucesso
      queryClient.invalidateQueries({ queryKey: ["prenotas-lista"] });

      const recsf1 = variables.RECSF1 || (data as any).REC;
      if (recsf1) {
        queryClient.invalidateQueries({
          queryKey: ["prenota-detalhe", recsf1],
        });
        queryClient.invalidateQueries({
          queryKey: ["historicoPreNota", recsf1],
        });
      }
    },

    onError: (error) => {
      toast.error(error.message || "Erro ao solicitar revisão.");
    },

    ...defaultQueryOptions, // Aplica configurações padrão
  });
}
