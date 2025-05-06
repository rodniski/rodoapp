/* Resposta bruta que a API Protheus devolve ----------------------------*/
export interface FornecedorAPI {
    loja: string;
    numero: string;
    fornecedor: string;
    estado: string;
    cidade: string;
    cgc: string;
  }
  
  /* Opção para Combobox --------------------------------------------------*/
export interface FornecedorOption {
  cod: string; // A2_COD
  loja: string; // A2_LOJA
  desc: string; // A2_NOME
  cnpj: string; // A2_CGC
  uniqueId: string; // Identificador único
}