//* "@login/types/aux-types.ts" *\\

import { FilialAcesso } from "./auth-types";


// Interface para a busca GERAL de filiais
export interface FilialGeral {
    numero: string;
    filial: string;
    cnpjFilial: string;
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
    Filiais: FilialAcesso[];
    UnidadeMedida: UnidadeMedida[];
    Condicoes: Condicao[];
    CentoCusto: CentroCusto[];
  }
 
  // --- Estado e Ações do Aux Store ---
  export interface AuxState {
    // listas de seleção
    filiais: FilialGeral[];
    unidadeMedida: UnidadeMedida[];
    condicoes: Condicao[];
    centroCusto: CentroCusto[];
  
    // setters
    setFiliais: (items: FilialGeral[]) => void;
    setUnidadeMedida: (items: UnidadeMedida[]) => void;
    setCondicoes: (items: Condicao[]) => void;
    setCentroCusto: (items: CentroCusto[]) => void;
  
    // carga inicial única
    loadInitialData: (data: {
      filiais?: FilialGeral[];
      unidadeMedida?: UnidadeMedida[];
      condicoes?: Condicao[];
      centroCusto?: CentroCusto[];
    }) => void;
  }