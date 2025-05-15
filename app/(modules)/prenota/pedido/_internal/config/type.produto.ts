// Este tipo deve corresponder ao ProductSearchResult definido na sua API route
// e aos campos selecionados em sb1.config.ts
export interface ClientProductSearchResult {
  R_E_C_N_O_: number;
  B1_FILIAL: string;
  B1_COD: string;
  B1_DESC: string;
  B1_TIPO: string | null;
  B1_UM: string | null;
  B1_GRUPO: string | null;
  B1_PRV1: number | null;
  B1_LOCPAD: string | null;
  B1_MSBLQL: string | null;
}

export interface FetchProductsParams {
  searchTerm: string;
  limit?: number;
  // Adicionar filial aqui se você reintroduzir o filtro de filial na API no futuro
}
