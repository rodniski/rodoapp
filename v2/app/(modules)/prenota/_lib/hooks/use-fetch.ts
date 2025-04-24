import { useQuery } from "@tanstack/react-query";

interface FilterBase {
  campo: string;
  tipo: "texto" | "intervalo" | "select";
}

interface FiltroTexto extends FilterBase {
  tipo: "texto";
  comparador: "contains" | "equals" | "startsWith" | "endsWith";
  valor: string;
}

interface FiltroIntervalo extends FilterBase {
  tipo: "intervalo";
  min?: string | number | Date;
  max?: string | number | Date;
}

interface FiltroSelect extends FilterBase {
  tipo: "select";
  valores: string[];
}

export type FiltroAvancado = FiltroTexto | FiltroIntervalo | FiltroSelect;

interface FetchParams {
  page?: number;
  pageSize?: number;
  filials: string[];
  filters?: FiltroAvancado[];
  sorting?: { id: string; desc: boolean }[];
}

export const fetchPrenotas = async ({
  page = 1,
  pageSize = 10,
  filials,
  filters = [],
  sorting = [],
}: FetchParams) => {
  console.groupCollapsed(
    `%c🔍 Buscando pré-notas`,
    "color: #3b82f6; font-weight: bold"
  );
  console.log("📄 Página:", page);
  console.log("📦 Page Size:", pageSize);
  console.log("🏢 Filiais:", filials);
  console.log("🔍 Filtros Avançados:", filters);
  console.log("↕️ Ordenação:", sorting);
  console.groupEnd();

  const body = {
    pagination: { page, pageSize },
    filters,
    sorting,
    filials,
  };

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
  const {
    page = 1,
    pageSize = 10,
    filials,
    sorting = [],
  } = params;

  return useQuery({
    queryKey: ["prenotas", page, pageSize, filials, sorting],
    queryFn: () =>
      fetchPrenotas({ page, pageSize, filials, sorting }),
  });
};
