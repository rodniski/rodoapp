import type { FullTimelineSqlRow } from "@/app/(modules)/prenota/_lib/lib/types";

/**
 * Busca a timeline completa de uma pré-nota via API.
 * @param recsf1 - ID da pré-nota (R_E_C_N_O_)
 * @returns Dados brutos da timeline
 * @throws Error se a requisição falhar
 */
export async function fetchTimeline(
  recsf1: string
): Promise<FullTimelineSqlRow[]> {
  const recsf1Trimmed = recsf1.trim();
  if (!recsf1Trimmed) {
    console.warn("[fetchTimeline] RECSF1 inválido.");
    return [];
  }

  const logPrefix = "[API Timeline]";
  const apiUrl = `/api/timeline?rec=${recsf1Trimmed}`;
  console.log(`${logPrefix} Buscando em: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok)
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    const data = await response.json();
    console.log(`${logPrefix} ${data.length || 0} linhas recebidas.`);
    return data.map((row: any) => ({ ...row, REC_F1: Number(row.REC_F1) }));
  } catch (error) {
    console.error(`${logPrefix} Erro:`, error);
    throw error;
  }
}
