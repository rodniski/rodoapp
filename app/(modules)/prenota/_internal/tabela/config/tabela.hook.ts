// app/(modules)/prenota/_lib/tabela/config/tabela.hook.ts


"use client";

import { useQuery } from "@tanstack/react-query";
import { useDataTableStore } from "ui";
import { defaultQueryOptions } from "@/app/(modules)/prenota/_internal/config";
import { fetchPrenotas, FetchParams } from ".";

/**
 * Hook para buscar pré-notas utilizando paginação, ordenação e filtros.
 */
export const usePrenotas = (params: FetchParams) => {
  const {
    page = 1,
    pageSize = 10,
    filials,
    searchTerm = "",
    sorting = [],
  } = params;
  const { filters } = useDataTableStore();

  return useQuery({
    queryKey: [
      "prenotas",
      page,
      pageSize,
      filials,
      searchTerm,
      sorting,
      filters,
    ],
    queryFn: () =>
      fetchPrenotas({ page, pageSize, filials, searchTerm, sorting, filters }),
    ...defaultQueryOptions, // Configurações padrão do projeto
  });
};
