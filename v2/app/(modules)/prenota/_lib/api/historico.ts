// src/api/historico.ts
import axios, { AxiosError } from 'axios';
// Ajuste o caminho para seus tipos e config
import type { HistoricoEntry } from '@prenota/types'; // Ou onde estiver o tipo HistoricoEntry
import { config } from 'config';
import { parse } from 'date-fns';

const GET_HISTORICO_URL = `${config.API_PRODUCTION_URL}reidoapsdu/getHistorico`;

type RawHistoricoEntry = Omit<HistoricoEntry, 'timestamp'>;

function isValidDate(d: any): d is Date {
  return d instanceof Date && !isNaN(d.getTime());
}

/**
 * Busca o histórico de uma Pré-Nota usando Axios.
 * @param recsf1 - O RECSF1 da Pré-Nota.
 * @returns Promise com o array de entradas do histórico, processadas e ordenadas.
 * @throws Lança um erro em caso de falha na rede ou se a API retornar um erro HTTP.
 */
export async function fetchHistoricoPreNota(
  recsf1: string
): Promise<HistoricoEntry[]> {
  if (!recsf1) {
    console.warn('[API.fetchHistoricoPreNota] RECSF1 é obrigatório.');
    return [];
  }
  const logPrefix = '[API.fetchHistoricoPreNota]';
  console.log(`${logPrefix} Buscando histórico para RECSF1: ${recsf1} URL: ${GET_HISTORICO_URL}`);

  try {
    const response = await axios.get<RawHistoricoEntry[]>(GET_HISTORICO_URL, {
      headers: {
        'recsf1': recsf1,
      },
    });

    console.log(`${logPrefix} Histórico recebido (raw): ${response.data.length} entradas.`);

    // Processa para adicionar timestamp e ordenar
    const processedResult = response.data.map(entry => {
      const dateString = `${entry.data} ${entry.hora}`;
      const dateObject = parse(dateString, 'dd/MM/yyyy HH:mm:ss', new Date());
      return {
        ...entry,
        timestamp: isValidDate(dateObject) ? dateObject : undefined,
      };
    }).sort((a, b) => {
      if (a.timestamp && b.timestamp) {
        return a.timestamp.getTime() - b.timestamp.getTime(); // Mais antigo primeiro
      }
      if (a.timestamp) return -1;
      if (b.timestamp) return 1;
      return 0;
    });
    
    console.log(`${logPrefix} Histórico processado e ordenado.`);
    return processedResult;

  } catch (error) {
    console.error(`${logPrefix} Erro na chamada API:`, error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError; // Não esperamos corpo de erro estruturado em GET de sucesso
      // Para GET, um erro geralmente é um status não-2xx.
      // A mensagem de erro do servidor pode estar em axiosError.response.data
      let errorMessage = axiosError.message || "Erro de rede ao buscar histórico.";
      if (typeof axiosError.response?.data === 'string' && axiosError.response.data.length < 200) { // Evita logar HTML de erro
        errorMessage = `${errorMessage} Detalhes: ${axiosError.response.data}`;
      } else if (axiosError.response?.data && (axiosError.response.data as any).Mensagem) {
        errorMessage = (axiosError.response.data as any).Mensagem;
      }
      throw new Error(errorMessage);
    }
    throw new Error(
      error instanceof Error ? error.message : "Erro desconhecido ao buscar histórico."
    );
  }
}