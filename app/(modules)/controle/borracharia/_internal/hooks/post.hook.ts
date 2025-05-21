// /hooks/useCarregaSaida.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { carregaSaida, CarregaSaidaParams, fetchMovEstornoSaida } from "@borracharia/api";
import { toast } from "sonner";
import { EstornoParams } from "@portaria/types";

export function useCarregaSaida(onSuccess?: () => void, onError?: (error: Error) => void) {
  return useMutation({
    mutationFn: async (params: CarregaSaidaParams) => {
      const res = await carregaSaida(params);
      console.log(res)
      if (!res.sucess) throw new Error(res.mensagem);
      return res;
    },
    onSuccess,
    onError,
  });
}
export const useMovEstornoSaida = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: EstornoParams) => fetchMovEstornoSaida(params),
    onSuccess: () => {
      toast.success("Entrega rejeitada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["movPortaria"] });
    },
    onError: () => {
      toast.error("Erro ao rejeitar entrega"); 
    },
  });
};