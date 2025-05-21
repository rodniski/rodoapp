// src/lib/api/condicaoPagamento/index.ts
// (Ajuste o caminho conforme sua estrutura)

import { config } from 'config'; // Ajuste o caminho para seu config.ts
import type {
    CondicaoPagamentoResponse,
    CondicaoPagamentoError,
    CondicaoPagamentoParams // Importa a interface de parâmetros
} from './interfaces';
import axios from 'axios';

// URL da API de Condição de Pagamento, vinda da configuração.
const CONDICAO_PAGAMENTO_API_URL = `${config.API_PRODUCTION_URL}reidoapsdu/condicaov2`;

/**
 * Busca os detalhes da condição de pagamento (parcelas e vencimentos) na API.
 * Os parâmetros são enviados via headers HTTP.
 *
 * @param {CondicaoPagamentoParams} params - Objeto contendo os parâmetros necessários para a consulta.
 * @returns {Promise<CondicaoPagamentoResponse>} Uma Promise que resolve com os detalhes da condição de pagamento.
 * @throws {CondicaoPagamentoError} Erro estruturado da API em caso de falha (4xx, 5xx com JSON).
 * @throws {Error} Erro genérico para outras falhas (rede, configuração, etc.).
 */
export async function getCondicaoPagamentoSimples(
    params: CondicaoPagamentoParams
): Promise<CondicaoPagamentoResponse> {

    // Validação básica dos parâmetros (pode ser mais robusta se necessário).
    if (!params || typeof params !== 'object' || !params.valor || !params.condpag || !params.dtemissao || !params.codForn || !params.lojaForn) {
        console.log("getCondicaoPagamentoSimples: Parâmetros inválidos:", params);
        throw new Error("Parâmetros inválidos para buscar condição de pagamento.");
    }

    // console.log(`[API CondicaoPagamento] GET ${CONDICAO_PAGAMENTO_API_URL} - Params:`, params); // Log opcional

    try {
        // Realiza a requisição GET usando Axios.
        const response = await axios.get<CondicaoPagamentoResponse>(CONDICAO_PAGAMENTO_API_URL, {
            headers: {
                // Mapeia os parâmetros do objeto 'params' para os headers da requisição.
                // Garante que o valor seja enviado como string.
                'valor': String(params.valor),
                'condpag': params.condpag,
                'dtemissao': params.dtemissao,
                'codForn': params.codForn,
                'lojaForn': params.lojaForn,
            },
            // timeout: 10000 // Timeout recomendado em produção (ex: 10s).
        });
        // Retorna os dados da resposta em caso de sucesso.
        return response.data;

    } catch (error) {
        // Tratamento de erros.
        console.log(`[API CondicaoPagamento] Falha ao buscar condição (Params: ${JSON.stringify(params)}):`, error);

        if (axios.isAxiosError(error) && error.response) {
            // Erro com resposta da API (status 4xx ou 5xx). Lança os dados do erro.
            console.log(`[API CondicaoPagamento] Erro API - Status: ${error.response.status}`, error.response.data);
            throw error.response.data as CondicaoPagamentoError;
        } else if (axios.isAxiosError(error) && error.request) {
            // Erro de requisição sem resposta (timeout, rede).
            console.log('[API CondicaoPagamento] Erro Rede/Timeout:', error.request);
            throw new Error('Falha na comunicação com a API de Condição de Pagamento.');
        } else {
            // Erro inesperado.
            console.log('[API CondicaoPagamento] Erro Inesperado:', (error as Error).message);
            throw error; // Lança o erro original.
        }
    }
}