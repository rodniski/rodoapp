import { useQuery } from "@tanstack/react-query";
import { useDataTableStore } from "ui/data-table";

interface FetchParams {
  page?: number;
  pageSize?: number;
  filials: string[];
  searchTerm?: string;
  sorting?: { id: string; desc: boolean }[];
  filters?: Record<string, any>;
}

export const fetchPrenotas = async ({
  page = 1,
  pageSize = 10,
  filials,
  searchTerm = "",
  sorting = [],
  filters = {},
}: FetchParams) => {
  console.groupCollapsed(
    `%c🔍 Buscando pré-notas`,
    "color: #3b82f6; font-weight: bold"
  );
  console.log("📄 Página:", page);
  console.log("📦 Page Size:", pageSize);
  console.log("🏢 Filiais:", filials);
  console.log("🔍 Termo de Busca:", searchTerm);
  console.log("↕️ Ordenação:", sorting);
  console.log("🔧 Filtros:", filters);
  console.groupEnd();

  const body = {
    pagination: { page, pageSize },
    filters,
    sorting,
    filials,
    searchTerm,
  };

  console.log("📋 Corpo da requisição para /api/prenotas:", JSON.stringify(body, null, 2));

  try {
    const response = await fetch("/api/prenotas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Erro na resposta da API:", errorText);
      throw new Error("Erro ao buscar pré-notas");
    }

    const json = await response.json();
    console.log("✅ Resposta da API:", json);
    return json;
  } catch (err) {
    console.error("🚨 Erro no fetchPrenotas:", err);
    throw err;
  }
};

export const usePrenotas = (params: FetchParams) => {
  const { page = 1, pageSize = 10, filials, searchTerm = "", sorting = [] } = params;
  const { filters } = useDataTableStore();

  return useQuery({
    queryKey: ["prenotas", page, pageSize, filials, searchTerm, sorting, filters],
    queryFn: () =>
      fetchPrenotas({ page, pageSize, filials, searchTerm, sorting, filters }),
  });
};