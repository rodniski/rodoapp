//  api/movPortaria.ts
import { config } from "config";
import { PortariaParams } from "../types";

export const fetchMovPortaria = async ({
  page,
  pageSize,
  filial,
  conferido = "N",
  filters = {},
}: PortariaParams ) => {
  const queryParams = new URLSearchParams({
    Filial: filial,
    Page: page.toString(),
    PageSize: pageSize.toString(),
    Conferido: conferido,
    ...filters,
  });

  const url = `${config.API_BORRACHARIA_URL}MovPortaria/Portaria?${queryParams}`;

  const response = await fetch(url, 
  {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("❌ fetchMovPortaria erro:", errorText);
    throw new Error(`Erro ao buscar portaria: ${errorText}`);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    console.warn("⚠️ fetchMovPortaria JSON parse error, tentando corrigir...", { url });
    return JSON.parse(text.replace(/}(\s*){/g, "},\n{"));
  }
};
