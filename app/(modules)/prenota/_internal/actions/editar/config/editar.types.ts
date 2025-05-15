// src/app/(modules)/prenota/_internal/editar/config/editar.types.ts

export interface EditarItem {
  D1_COD: string;
  D1_ITEM: string;
  B1_DESC: string;
  B1_POSIPI: string;
  B1_ORIGEM: string;
  B1_UM: string;
  D1_VUNIT: number;
  D1_QUANT: number;
  C7_NUM: string;
  C7_ITEM: string;
  A5_NOMPROD: string;
  A5_CODPRF: string;
  D1_TOTAL: number;
}

export interface EditarPagamento {
  Z10_ITEM: string;
  Parcela: string;
  Vencimento: string;
  Valor: number;
  REC: number;
}

export interface EditarRateio {
  Z10_ITEM: string;
  Z10_CC: string;
  Z10_FILRAT: string;
  Z10_VALOR: number;
  Z10_PERC: number;
  REC: number;
}

export interface EditarPrenotaResponse {
  altera: string; // "true"
  F1_CHVNFE: string;
  F1_FILIAL: string;
  F1_XPRIOR: "Alta" | "Media" | "Baixa" | undefined;
  F1_XTIPO: string;
  F1_EMISSAO: string;
  F1_DOC: string;
  RECA2: string;
  F1_SERIE: string;
  F1_XOBS: string;
  F1_FORNECE: string;
  F1_STATUS: string;
  F1_LOJA: string;
  A2_NOME: string;
  F1_COND: string;
  E4_DESCRI: string;

  PAGAMENTOS?: EditarPagamento[];
  RATEIO?: EditarRateio[];
  ITENS?: EditarItem[];
}

// Interface de erro padrão do backend
export interface ProtheusErrorResponse {
  code?: number;
  detailedMessage?: string;
  message?: string;
}

export interface UsePrenotaDetailsProps {
  usr: string;
  rec: number;
}
