import { useMutation, UseMutationResult, MutateOptions } from "@tanstack/react-query";
import {
  postPedidoCompra,
  PedidoCompraRequest,
  PedidoCompraResponse,
} from "..";

/**
 * Hook para criar um novo Pedido de Compra via React Query
 */
export function usePostPedidoCompra() {
  const mutation = useMutation<PedidoCompraResponse, Error, PedidoCompraRequest>({
    mutationFn: (payload) => postPedidoCompra(payload),
  });

  return {
    createPedido: mutation.mutate,
    isLoading: mutation.isPending,
    data: mutation.data,
    error: mutation.error,
  };
}
