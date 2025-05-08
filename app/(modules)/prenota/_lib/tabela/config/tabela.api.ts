import type { FetchParams } from "@/app/(modules)/prenota/_lib/lib/types";

/**
 * Busca pré-notas com paginação, ordenação e filtros via API Prisma.
 */
export const fetchPrenotas = async ({
  page = 1,
  pageSize = 10,
  filials,
  searchTerm = "",
  sorting = [],
  filters = {},
}: FetchParams) => {
  const body = {
    pagination: { page, pageSize },
    filters,
    sorting,
    filials,
    searchTerm,
  };

  const response = await fetch("/api/prenotas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Erro ao buscar pré-notas: ${errorText}`);
  }

  return response.json();
};
