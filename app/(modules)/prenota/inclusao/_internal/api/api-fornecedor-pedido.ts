// src/lib/api/fornecedorPedido/index.ts
// (Ajuste o caminho conforme sua estrutura)

import { config } from "logic"; // Ajuste o caminho para seu config.ts
import type { FornecedorPedidoResponse, FornecedorPedidoError } from './interfaces';
import axios from 'axios';

// URL da API, construída a partir da configuração. Usando API_PRODUCTION_URL conforme exemplo.
// Se precisar alternar entre DEV/PROD, ajuste a lógica aqui ou no config.ts.
const FORNECEDOR_PEDIDO_API_URL = `${config.API_PRODUCTION_URL}reidoapsdu/consultar/likefor`;

/**
 * Busca fornecedores e seus pedidos na API, filtrando pelo header 'busca'.
 * Segue o padrão de chamada direta com axios global.
 *
 * @param {string} busca - O critério de busca (ex: CNPJ, nome) a ser enviado no header 'busca'.
 * @returns {Promise<FornecedorPedidoResponse>} Uma Promise que resolve com a lista de fornecedores.
 * @throws {FornecedorPedidoError} Erro estruturado da API em caso de falha (4xx, 5xx com JSON).
 * @throws {Error} Erro genérico para outras falhas (rede, configuração, etc.).
 */
export async function searchFornecedoresPedidosSimples(
    busca: string
): Promise<FornecedorPedidoResponse> {
    // Validação simples do parâmetro de busca.
    if (!busca || typeof busca !== 'string') {
        console.log("searchFornecedoresPedidosSimples: parâmetro 'busca' inválido:", busca);
        throw new Error("Parâmetro 'busca' é obrigatório e deve ser uma string.");
    }

    // console.log(`[API FornecedorPedido] GET ${FORNECEDOR_PEDIDO_API_URL} - Busca: ${busca}`); // Log opcional

    try {
        // Realiza a requisição GET usando Axios.
        const response = await axios.get<FornecedorPedidoResponse>(FORNECEDOR_PEDIDO_API_URL, {
            headers: {
                // Header 'busca' usado para filtrar na API.
                'busca': busca,
                // 'Content-Type': 'application/json' // Geralmente não necessário para GET, mas incluído se a API exigir.
            },
            // Nota: Não incluímos 'body: {}' aqui. Axios GET não envia body por padrão.
            // A filtragem é feita pelo header 'busca'. Se a API *realmente* exigir
            // um corpo em GET, seria necessário usar axios.request() ou verificar a API.
            // timeout: 15000 // Timeout recomendado em produção (ex: 15s).
        });
        // Retorna os dados (array de fornecedores) em caso de sucesso.
        return response.data;

    } catch (error) {
        // Tratamento de erros.
        console.log(`[API FornecedorPedido] Falha ao buscar fornecedores (Busca: ${busca}):`, error);

        if (axios.isAxiosError(error) && error.response) {
            // Erro com resposta da API (status 4xx ou 5xx). Lança os dados do erro.
            console.log(`[API FornecedorPedido] Erro API - Status: ${error.response.status}`, error.response.data);
            throw error.response.data as FornecedorPedidoError;
        } else if (axios.isAxiosError(error) && error.request) {
            // Erro de requisição sem resposta (timeout, rede).
            console.log('[API FornecedorPedido] Erro Rede/Timeout:', error.request);
            throw new Error('Falha na comunicação com a API de Fornecedores.');
        } else {
            // Erro inesperado.
            console.log('[API FornecedorPedido] Erro Inesperado:', (error as Error).message);
            throw error; // Lança o erro original.
        }
    }
}