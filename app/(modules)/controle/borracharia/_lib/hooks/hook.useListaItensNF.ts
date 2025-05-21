// /hooks/useListaItensNF.ts

"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchItensNF } from "../api";
import { ItemNFParams, ItemNF } from "@borracharia/types";
import { defaultQueryOptions } from "@prenota/config";

export const useListaItensNF = (params: ItemNFParams, enabled = true) => {
  return useQuery<ItemNF[]>({
    queryKey: ["listaItensNF", params],
    queryFn: async () => {
      const data = await fetchItensNF(params);
      return data.map((item: any) => ({
        ...item,
        SaldoSelecionado: 0,
      }));
    },
    enabled: enabled && Object.values(params).every(Boolean),
    ...defaultQueryOptions,
  });
};
