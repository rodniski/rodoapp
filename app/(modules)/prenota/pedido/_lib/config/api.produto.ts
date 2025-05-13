// ou src/services/api/products.ts

import { FetchProductsParams, ClientProductSearchResult } from "./type.produto";

/**
 * Busca produtos na API.
 * @param params - Objeto contendo searchTerm e limit (opcional).
 * @returns Uma promessa que resolve para um array de ClientProductSearchResult.
 * @throws Lança um erro se a requisição falhar ou a resposta não for OK.
 */
export async function fetchProductsAPI(params: FetchProductsParams): Promise<ClientProductSearchResult[]> {
  const { searchTerm, limit = 50 } = params; // Define um limite padrão se não fornecido

  if (!searchTerm || searchTerm.trim() === "") {
    // Pode retornar array vazio ou lançar erro, dependendo da preferência
    // console.warn("fetchProductsAPI: searchTerm está vazio, retornando array vazio.");
    return [];
  }

  const queryParams = new URLSearchParams();
  queryParams.append('search', searchTerm.trim());
  queryParams.append('limit', String(limit));

  // Construa a URL base da sua API
  // Se estiver usando variáveis de ambiente para a URL da API, use-as aqui.
  const apiUrl = `/api/products?${queryParams.toString()}`;
  const logPrefix = "[Client API FetchProducts]";

  console.log(`${logPrefix} Chamando API: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl);

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        // Se o corpo do erro não for JSON
        errorData = { message: response.statusText };
      }
      console.error(`${logPrefix} Erro na resposta da API (${response.status}):`, errorData);
      throw new Error(errorData.error || `Falha ao buscar produtos: ${response.statusText}`);
    }

    const data: ClientProductSearchResult[] = await response.json();
    console.log(`${logPrefix} Dados recebidos da API:`, data);
    return data;

  } catch (error) {
    console.error(`${logPrefix} Erro ao chamar fetchProductsAPI:`, error);
    // Re-lança o erro para que o React Query possa tratá-lo
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Ocorreu um erro desconhecido ao buscar produtos.");
  }
}
