import { useMutation } from "@tanstack/react-query";
import { carregaSaida } from "@borracharia/api";
import type { CarregaSaidaParams } from "@borracharia/api";

export function useCarregaSaida(onSuccess?: () => void, onError?: (error: Error) => void) {
  return useMutation({
    mutationFn: (params: CarregaSaidaParams) => carregaSaida(params),
    onSuccess,
    onError,
  });
}