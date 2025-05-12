//* Tipos para listagem de Portaria
export interface PortariaItem {
  Filial: string;
  Origem: string;
  Doc: string;
  Serie: string;
  NFLabel: string;
  CodCliente: string;
  Loja: string;
  DescCliente: string;
  ClienteLabel: string;
  ProdutoCod: string;
  ProdutoItem: string;
  ProdutoDesc: string;
  ProdutoLabel: string;
  TipoMovi: string;
  Data: string;
  Hora: string;
  Retirado: string;
  RespRet: string;
  Placa: string;
  Obs: string;
  RespCarreg: string;
  Sequencia: string;
  QtdEntregue: number;
  Saldo: number;
}

//* Parâmetros para a API de Portaria
export interface PortariaParams {
  PageSize: string;
  Page: string;
  Filial: number;
  Conferido: string;
}

//! POST FORMS:
//* Parâmetros para a API de Conferencia e de recusa

export interface ConferenciaParams {
  Sequencia: string;
  RespConf: string;
}
export interface EstornoParams {
  Sequencia: string;
  RespEstor: string;
  OriEstorno: string;
}
