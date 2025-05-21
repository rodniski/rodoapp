/* --------------------------------------------------------------------
 * API helper – busca Naturezas e Tipos de Operação
 * ------------------------------------------------------------------*/
import { Natureza, TipoOper } from "@prenota/actions"; // (opcional) exporte/ou use os tipos abaixo

// —————————————————— Tipagens de retorno cru da API ——————————————————
export interface ClassificacaoMetadataResponse {
  naturezas: Natureza[];
  tiposOperacao: TipoOper[];
}

/** Faz a chamada à rota `/api/classificacao/metadata`. */
export async function fetchClassificacaoOptions(
  signal?: AbortSignal,
): Promise<ClassificacaoMetadataResponse> {
  const res = await fetch("/api/classificacao", {
    method: "GET",
    cache: "no-store",
    signal,
  });

  if (!res.ok) {
    // HTTP 4xx/5xx
    const { error } = await res.json().catch(() => ({}));
    throw new Error(error || "Falha ao buscar metadados de classificação.");
  }

  return res.json() as Promise<ClassificacaoMetadataResponse>;
}
