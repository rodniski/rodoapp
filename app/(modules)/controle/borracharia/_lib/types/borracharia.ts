//* Tipos para listagem de Borracharia
export interface BorrachariaItem {
    Filial: string;
    Doc: string;
    Serie: string;
    NFLabel: string; // Ex: "000026208-3"
    CodCliente: string; // Ex: "051822"
    Loja: string; // Ex: "01"
    DescCliente: string; // Ex: "NILSON PEREIRA"
    ClienteLabel: string; // Ex: "051822-01-NILSON PEREIRA"
    Emissao: string; // Ex: "06/01/25"
    CodVendedor: string; // Ex: "000034"
    DescVendedor: string; // Ex: "NILSON PEREIRA"
    VendLabel: string; // Ex: "000034-NILSON PEREIRA"
    QtdItens: number; // Ex: 1
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

//* Parâmetros para a API de Borracharia
export interface BorrachariaParams {
    Page: string;
    PageSize: string;
}

//* Parâmetros para a API de Borracharia
export interface ItemNFParams {
    Filial: string;
    Doc: string;
    Serie: string;
    CodCliente: string;
    Loja: string;
}

// Interface para os parâmetros da requisição
export interface BorrachariaRequestParams {
    Filial: string;
    Origem: string;
    Doc: string;
    Serie: string;
    CodCliente: string;
    Loja: string;
    ProdutoCod: string;
    Item: string;
    Retirado: 'C' | 'R';
    RespRet: string;
    Placa: string;
    Obs: string;
    RespCarreg: string;
    Quantidade: string;
}
