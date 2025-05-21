import { config } from "logic";

/**
 * Exclui uma Pré-Nota pelo identificador REC.
 * @param rec - Identificador da Pré-Nota a ser excluída.
 */
export async function deletePrenota(rec: number): Promise<void> {
  const url = `${config.API_PRODUCTION_URL}PreNota/DeletaPreNota?rec=${rec}`;

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }
}
