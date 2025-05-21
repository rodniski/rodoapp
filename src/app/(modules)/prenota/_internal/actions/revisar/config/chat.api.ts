import type { HistoricoEntry, RawHistoricoEntry } from "@prenota/actions";
import { isValidDate } from "utils";
import { parse } from "date-fns";
import { config } from "config";
import axios from "axios";

const GET_HISTORICO_URL = `${config.API_PRODUCTION_URL}reidoapsdu/getHistorico`;

/**
 * Busca e processa o histórico de uma Pré-Nota pelo RECSF1 usando Axios.
 * @param recsf1 - Identificador da Pré-Nota.
 */
export async function fetchHistoricoPreNota(
  recsf1: string
): Promise<HistoricoEntry[]> {
  if (!recsf1) return [];

  try {
    const { data } = await axios.get<RawHistoricoEntry[]>(GET_HISTORICO_URL, {
      headers: { recsf1 },
    });

    // Processa as datas e ordena os registros cronologicamente
    return data
      .map((entry) => {
        const dateString = `${entry.data} ${entry.hora}`;
        const timestamp = parse(dateString, "dd/MM/yyyy HH:mm:ss", new Date());

        return {
          ...entry,
          timestamp: isValidDate(timestamp) ? timestamp : undefined,
        };
      })
      .sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          return a.timestamp.getTime() - b.timestamp.getTime();
        }
        return a.timestamp ? -1 : b.timestamp ? 1 : 0;
      });
  } catch (error) {
    const message = axios.isAxiosError(error)
      ? error.response?.data?.Mensagem ||
        error.response?.data ||
        error.message ||
        "Erro ao buscar histórico."
      : "Erro desconhecido ao buscar histórico.";

    throw new Error(message);
  }
}
