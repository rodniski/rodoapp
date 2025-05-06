import { useMutation, useQueryClient } from '@tanstack/react-query';

interface DeletePrenotaOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useDeletePrenota = ({ onSuccess, onError }: DeletePrenotaOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (rec: number) => {
      const response = await fetch(
        `http://172.16.99.174:8400/rest/PreNota/DeletaPreNota?rec=${rec}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`);
      }

      return response; // Não precisamos do corpo da resposta, apenas do status
    },
    onSuccess: () => {
      // Invalida a query 'prenotas' para atualizar a lista automaticamente
      queryClient.invalidateQueries({ queryKey: ['prenotas'] });
      onSuccess?.();
    },
    onError,
  });
};