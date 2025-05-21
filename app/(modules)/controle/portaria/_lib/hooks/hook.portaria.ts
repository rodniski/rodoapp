// hooks/hooj.portaria.ts
"use client";

import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { PortariaParams, ConferenciaParams, EstornoParams } from "../types";
import { toast } from "sonner";
import { defaultQueryOptions } from "@prenota/config";
import { fetchMovPortaria, fetchMovConferenciaSaida, fetchMovEstornoSaida } from "../api";

export const useMovPortaria = (params: PortariaParams) => {
  console.log("🔴 Executando useMovPortaria com params:", params);
  return useQuery({
    queryKey: ["movPortaria", params.page, params.pageSize, params.filial, params.conferido, params.filters],
    queryFn: () =>
      fetchMovPortaria(params),
    ...defaultQueryOptions,
  });
};

export const useMovConferenciaSaida = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: ConferenciaParams) => fetchMovConferenciaSaida(params),
    onSuccess: () => {
      toast.success("Entrega confirmada com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["movPortaria"] });
    },
    onError: () => {
      toast.error("Erro ao confirmar entrega");
    },
  });
};

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
