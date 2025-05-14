//* Parâmetros para a API de Borracharia
export interface ItemNFParams {
    Filial: string;
    Doc: string;
    Serie: string;
    CodCliente: string;
    Loja: string;
}

//* Tipos para listagem dos itens da NF
export interface ItemNF {
    Item: string;
    ProdutoCod: string;
    ProdutoDesc: string;
    ProdutoLabel: string;
    Saldo: number;
    SaldoSelecionado: number;
}