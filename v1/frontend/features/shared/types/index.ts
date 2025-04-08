//! GENERAL INTERFACES
export interface UnidadeMedida {
  UM: string;
  DESCRICAO: string;
  DESC: string;
}

export interface CondicaoPagamento {
  Desc: string;
  E4_CODIGO: string;
  E4_DESCRI: string;
}

export interface CentroCusto {
  CTT_CUSTO: string;
  CTT_DESC01: string;
  DESC: string;
}

export interface AccessFilial {
  M0_CODFIL: string;
  M0_FILIAL: string;
  M0_CGC: string;
}

export interface CargaInicioData {
  UnidadeMedida: UnidadeMedida[];
  Condicoes: CondicaoPagamento[];
  CentroCusto: CentroCusto[];
  Filiais: AccessFilial[];
}

