"use client";

import { useQuery } from "@tanstack/react-query";
import { HistoricoParams } from "../types";
import { defaultQueryOptions } from "@prenota/config";
import { fetchMovHistorico } from "../api";

export const useMovHistorico = (params: HistoricoParams) => {
  console.log("🔴 Executando useMovHistorico com params:", params);
  return useQuery({
    queryKey: ["movHistorico", params.page, params.pageSize, params.filial, params.filters],
    queryFn: () =>
      fetchMovHistorico(params),
    ...defaultQueryOptions,
  });
};
