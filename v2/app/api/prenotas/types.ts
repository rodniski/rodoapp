// /api/prenotas/types.ts

export interface PrenotaRow {
  REC: number;
  F4_TRANFIL: string;
  F1_FILIAL: string;
  F1_DOC: string;
  F1_SERIE: string;
  F1_STATUS: string;
  A2_COD: string;
  A2_LOJA: string;
  A2_NOME: string;
  FORNECE: string;
  F1_EMISSAO: string; // pode ajustar para Date se o formato for ISO
  F1_DTDIGIT: string;
  F1_VALBRUT: number;
  F1_XTIPO: string;
  F1_XPRIOR: string;
  F1_XORI: string;
  F1_XUSRRA: string;
  F1_XOBS: string;
  F1_ZOBSREV: string;
  F1_XREV: string;
  USUARIO: string;
  VENCIMENTO: string;
  Z07_DESC: string;
  Z07_CHAVE: string;
}

export interface Pagination {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export interface PrenotaResponse {
  data: PrenotaRow[];
  pagination: Pagination;
}

export interface Params {
  page: number;
  pageSize: number;
  filials: string[];
  filters?: Record<string, any>;
  sorting?: { id: string; desc: boolean }[];
}
