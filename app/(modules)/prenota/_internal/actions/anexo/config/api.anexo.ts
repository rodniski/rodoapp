import type { Attachment } from "@prenota/actions";
import { config } from "logic";

/**
 * Busca anexos relacionados a um documento específico.
 * @param anexoPath - Caminho identificador do documento.
 */
export async function fetchAnexos(anexoPath: string): Promise<Attachment[]> {
  if (!anexoPath.trim()) return [];

  const anexoUrl = `${config.API_PRODUCTION_URL}reidoapsdu/consultar/pegarq/`;

  try {
    const res = await fetch(anexoUrl, {
      method: "GET",
      headers: { documento: anexoPath },
    });

    if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

    const data: Attachment[] = await res.json();
    return data;
  } catch (error) {
    console.log("[fetchAnexos] Erro ao buscar anexos:", error);
    return [];
  }
}
