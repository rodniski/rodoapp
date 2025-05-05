import axios from "axios";
import { config } from "config";

// Define interface do produto conforme retorno da API
export interface Produto {
  B1_COD: string;
  B1_DESC: string;
  DESC: string;
  B1_ORIGEM: string;
  B1_UM: string;
  B1_LOCPAD: string;
  B1_GRUPO: string;
  B1_TIPO: string;
  B1_GRTRIB: string;
  B1_POSIPI: string;
}

// Seleciona baseURL conforme ambiente
const BASE_REST_URL = config.API_PRODUCTION_URL;

// Cria instância axios para produto
export const productApi = axios.create({
  baseURL: `${BASE_REST_URL}reidoapsdu`,
  headers: { "Content-Type": "application/json" },
});

/**
 * Consulta produtos via likeprod
 * @param termo - texto para busca
 * @returns Lista de produtos
 */
export function fetchLikeProduto(termo: string): Promise<Produto[]> {
  return productApi
    .get<Produto[]>("/consultar/likeprod", {
      headers: { busca: termo },
    })
    .then((res) => res.data);
}
