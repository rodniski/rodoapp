// src/services/classifica.api.ts
// --------------------------------
import type { ProdutoPrenota } from "@prenota/actions";

export async function fetchProdutosPrenota(
  rec: number,
  signal?: AbortSignal
): Promise<ProdutoPrenota[]> {
  if (!Number.isFinite(rec))
    throw new Error("REC inválido (não numérico).");

  const res = await fetch(`/api/prenotas/${rec}/produtos`, {
    method: "GET",
    signal,
    headers: {
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `Erro ${res.status} ao buscar produtos da pré-nota ${rec}: ${body}`
    );
  }

  // Assume JSON correto conforme rota; faça validação com zod se quiser.
  return (await res.json()) as ProdutoPrenota[];
}
