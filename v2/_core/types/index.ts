// Interface para a busca GERAL de filiais
export interface Filial {
  numero: string;
  filial: string;
  cnpjFilial: string;
}

//CARGA INICIO
export interface Filial {
  M0_CODFIL: string;
  M0_FILIAL: string;
  M0_CGC: string;
}

export interface UnidadeMedida {
  UM: string;
  DESCRICAO: string;
  DESC: string;
}

export interface Condicao {
  Desc: string;
  E4_CODIGO: string;
  E4_DESCRI: string;
}

export interface CentroCusto {
  CTT_CUSTO: string;
  CTT_DESC01: string;
  DESC: string;
}

export interface CargaInicio {
  Filiais: Filial[];
  UnidadeMedida: UnidadeMedida[];
  Condicoes: Condicao[];
  CentoCusto: CentroCusto[];
}
