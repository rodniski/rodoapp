"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePrenota, DeletePrenotaOptions } from "@/app/(modules)/prenota/_internal/actions";
import { defaultQueryOptions } from "@/app/(modules)/prenota/_internal/config";

/**
 * Hook para exclusão de Pré-Notas utilizando React Query.
 * @param options - Callbacks opcionais para sucesso e erro.
 */
export const useDeletePrenota = ({
  onSuccess,
  onError,
}: DeletePrenotaOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePrenota,
    onSuccess: () => {
      // Invalida o cache de 'prenotas' para atualizar automaticamente a lista após exclusão
      queryClient.invalidateQueries({ queryKey: ["prenotas"] });
      onSuccess?.();
    },
    onError,
    ...defaultQueryOptions, // Aplica as configurações padrão
  });
};
