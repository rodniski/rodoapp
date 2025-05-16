import { config } from "config";
import { HistoricoParams } from "../types";

export const fetchMovHistorico = async ({
  page,
  pageSize,
  filial,
  filters = {},
}: HistoricoParams) => {
  const queryParams = new URLSearchParams({
    Filial: filial,
    Page: page.toString(),
    PageSize: pageSize.toString(),
    ...filters,
  });

  const url = `${config.API_BORRACHARIA_URL}MovPortaria/Historico?${queryParams}`;

  const response = await fetch(url,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ fetchMovHistorico erro: ",errorText);
    throw new Error(`Erro ao buscar histórico: ${errorText}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    // corrigir JSON quebrado, se necessário
    console.warn("⚠️ fetchMovHistorico JSON parse error, tentando corrigir...", { url });
    return JSON.parse(text.replace(/}(\s*){/g, "},\n{"));
  }
};
