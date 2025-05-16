// api/api.borracharia.ts
import { config } from "config";
import { BorrachariaParams} from "../types";

export const fetchMovBorracharia = async ({
  Page,
  PageSize,
  Filial,
  Filters = {},
}: BorrachariaParams ) => {
  const queryParams = new URLSearchParams({
    Page: Page.toString(),
    PageSize: PageSize.toString(),
    Filial: Filial,
    ...Filters,
  });

  const url = `${config.API_BORRACHARIA_URL}MovPortaria/Borracharia?${queryParams}`;

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