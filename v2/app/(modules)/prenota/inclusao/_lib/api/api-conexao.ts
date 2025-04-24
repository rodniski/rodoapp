// src/lib/api/conexaoNFE/index.ts

import { config } from 'config'; // Ajuste o caminho para seu config.ts
import type { ConexaoNfeDetalhesResponse, ConexaoNfeError } from './interfaces';
import axios from 'axios';

// URL Base e Token da API, vindos do arquivo de configuração central.
// ATENÇÃO: Proteja seu token em 'config.ts' ou variáveis de ambiente.
const CONEXAO_NFE_API_BASE_URL = config.CONEXAO_NFE_BASE_URL;
const CONEXAO_NFE_API_TOKEN = config.CONEXAO_NFE_TOKEN;

/**
 * Busca os detalhes de um DFe na API da ConexaoNFE via GET.
 *
 * @param {string} chaveDFe - A chave de 44 dígitos do DFe (NFe, CTe, etc.).
 * @returns {Promise<ConexaoNfeDetalhesResponse>} Detalhes do DFe em caso de sucesso.
 * @throws {ConexaoNfeError} Erro estruturado da API em caso de falha (4xx, 5xx com JSON).
 * @throws {Error} Erro genérico para outras falhas (rede, configuração, etc.).
 */
export async function getDfeDetalhesXmlSimples(
    chaveDFe: string
): Promise<ConexaoNfeDetalhesResponse> {
    // Validação básica da chave DFe para evitar chamadas inválidas.
    if (!chaveDFe || typeof chaveDFe !== 'string' || chaveDFe.length !== 44 || !/^\d+$/.test(chaveDFe)) {
        console.error("getDfeDetalhesXmlSimples: chaveDFe inválida:", chaveDFe);
        throw new Error("Chave do DFe inválida.");
    }

    // Monta a URL completa do endpoint.
    const apiUrl = `${CONEXAO_NFE_API_BASE_URL}/dfes/${chaveDFe}/detalhes/xml`;
    // console.log(`[API ConexaoNFE] GET ${apiUrl}`); // Log opcional para debug

    try {
        // Realiza a requisição GET com Axios.
        const response = await axios.get<ConexaoNfeDetalhesResponse>(apiUrl, {
            headers: {
                // Header de autorização Bearer Token é obrigatório.
                'Authorization': `Bearer ${CONEXAO_NFE_API_TOKEN}`,
            },
            // timeout: 10000 // Timeout recomendado em produção (ex: 10s).
        });
        // Retorna os dados da resposta em caso de sucesso.
        return response.data;

    } catch (error) {
        // Tratamento de erros.
        console.error(`[API ConexaoNFE] Falha ao buscar DFe ${chaveDFe}:`, error);

        if (axios.isAxiosError(error) && error.response) {
            // Erro com resposta da API (status 4xx ou 5xx). Lança os dados do erro da API.
            console.error(`[API ConexaoNFE] Erro API - Status: ${error.response.status}`, error.response.data);
            throw error.response.data as ConexaoNfeError;
        } else if (axios.isAxiosError(error) && error.request) {
            // Erro de requisição sem resposta (timeout, rede).
            console.error('[API ConexaoNFE] Erro Rede/Timeout:', error.request);
            throw new Error('Falha na comunicação com a API ConexaoNFE.');
        } else {
            // Erro inesperado na configuração ou outro.
            console.error('[API ConexaoNFE] Erro Inesperado:', (error as Error).message);
            throw error; // Lança o erro original.
        }
    }
}