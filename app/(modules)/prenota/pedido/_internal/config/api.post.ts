// Exemplo de localização: src/lib/api/pedidoCompra.ts
// Ou onde você definiria a função postPedidoCompra referenciada em @pedido/config

import axios, { AxiosError } from 'axios';
import { PedidoCompraRequest, PedidoCompraResponse } from './type.post';


const API_URL = 'http://172.16.0.251:6002/rest/PedidoDeCompra/PedidoCompra';
const logPrefix = "[API Client postPedidoCompra]";

/**
 * Envia um pedido de compra para a API Protheus.
 * @param payload - Os dados do pedido de compra a serem enviados.
 * @returns Uma promessa que resolve para a resposta da API.
 * @throws Lança um erro se a requisição falhar.
 */
export async function postPedidoCompra(payload: PedidoCompraRequest): Promise<PedidoCompraResponse> {
  console.log(`${logPrefix} Enviando payload:`, payload);

  // O exemplo da API Protheus espera um JSON stringificado como 'text/plain'
  const dataAsString = JSON.stringify(payload);

  const config = {
    method: 'post',
    url: API_URL,
    headers: {
      // A API Protheus neste exemplo espera 'text/plain' para um corpo JSON stringificado.
      // Se a API aceitasse 'application/json', o axios faria a stringificação automaticamente.
      'Content-Type': 'text/plain',
      // Adicione outros headers necessários, como Authorization, se houver.
      // 'Authorization': 'Bearer SEU_TOKEN_AQUI',
    },
    data: dataAsString,
  };

  try {
    console.log(`${logPrefix} Configuração da requisição:`, { url: config.url, method: config.method, headers: config.headers });
    const response = await axios(config);
    console.log(`${logPrefix} Resposta da API recebida (status ${response.status}):`, response.data);

    // A API Protheus pode retornar 200 OK mesmo com erros lógicos no corpo.
    // É importante verificar o conteúdo de response.data para determinar o sucesso real.
    // A estrutura de PedidoCompraResponse deve refletir como sua API indica sucesso/erro.
    // Exemplo: if (response.data && response.data.Sucesso === false) { throw new Error(response.data.Mensagem || 'Erro retornado pela API'); }

    return response.data as PedidoCompraResponse; // Faz o cast para o tipo esperado

  } catch (error) {
    console.log(`${logPrefix} Erro na chamada da API:`, error);
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      if (axiosError.response) {
        // A requisição foi feita e o servidor respondeu com um status code
        // que cai fora do range de 2xx
        console.log(`${logPrefix} Dados do erro da API:`, axiosError.response.data);
        console.log(`${logPrefix} Status do erro da API:`, axiosError.response.status);
        // Tenta extrair uma mensagem de erro mais útil do corpo da resposta
        const apiErrorMessage = (axiosError.response.data as any)?.message ||
                                (axiosError.response.data as any)?.Mensagem ||
                                axiosError.message;
        throw new Error(apiErrorMessage);
      } else if (axiosError.request) {
        // A requisição foi feita mas nenhuma resposta foi recebida
        console.log(`${logPrefix} Nenhuma resposta recebida da API:`, axiosError.request);
        throw new Error('Nenhuma resposta recebida do servidor. Verifique a conexão ou o URL da API.');
      } else {
        // Algo aconteceu ao configurar a requisição que acionou um erro
        console.log(`${logPrefix} Erro ao configurar a requisição:`, axiosError.message);
        throw new Error(`Erro ao configurar a requisição: ${axiosError.message}`);
      }
    }
    // Se não for um erro do Axios, re-lança o erro original
    throw error;
  }
}
