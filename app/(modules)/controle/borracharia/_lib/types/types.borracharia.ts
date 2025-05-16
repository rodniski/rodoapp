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

//* Parâmetros para a API de Borracharia
export interface BorrachariaParams {
    Page: number;
    PageSize: number;
    Filial: string;
    Filters?: Record<string, any>;
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

// Interface para os parâmetros da requisição
export interface useMovBorrachariaOptions {
    type: "borracharia";
    filial?: string;
    conferido?: "S" | "N";
    enabled?: boolean;
    page?: number;
    pageSize?: number;
    filters?: Record<string, any>;
}
