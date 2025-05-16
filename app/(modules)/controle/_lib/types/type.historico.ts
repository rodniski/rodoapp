// types/historico.ts

//* Tipos para Histórico
export interface HistoricoItem {
  Filial: string;
  NFLabel: string;
  CodCliente: string;
  Loja: string;
  DescCliente: string;
  ClienteLabel: string;
  QtdNF: number;
  Origem: string;
  Doc: string;
  Serie: string;
  DataFatu: string;
  HoraFatu: string;
  CodVendedor: string;
  DescVendedor: string;
  VendedorLabel: string;
  Produtos: HistoricoProduto[];
}

export interface HistoricoProduto {
  ProdutoLabel: string;
  ProdutoCod: string;
  ProdutoItem: string;
  ProdutoDesc: string;
  Movimentacoes: HistoricoMovimentacao[];
}

export interface HistoricoMovimentacao {
  Sequencia: string;
  Carregamento: {
    TipoMovi: string;
    DataCarreg: string;
    HoraCarreg: string;
    RespCarreg: string;
    QtdEntregue: number;
    Saldo: number;
  };
  Conferencia: {
    RespConf: string;
    Conferido: "S" | "N";
    DataConf: string;
    HoraConf: string;
  };
  Estorno: {
    RespEstor: string;
    OriEstorno: string;
    DataEstor: string;
    HoraEstor: string;
  };
  Motorista: {
    Retirado: "C" | "R";
    RespRet: string;
    Placa: string;
    Obs: string;
  };
}

//* Parâmetros para a API do Histórico
export interface HistoricoParams {
  page: number;
  pageSize: number;
  filial: string;
  filters?: Record<string, any>;
  enabled?: boolean;
}

export interface useMovHistoricoOptions {
  type: "historico";
  filial: string;
  conferido?: "S" | "N";
  enabled?: boolean;
  page: number;
  pageSize: number;
  filters?: Record<string, any>;
}