

export interface PreResposta {
    filiaisSalvas: string[];
    groupID: string;
    message: string;
    prenotasFiltradas: PreNota[];
}

export interface PreNota {
    id: string;
    Rec: number;           // SF1.R_E_C_N_O_
    F4Tranfil: string;     // F4_TRANFIL
    F1Filial: string;      // F1_FILIAL
    F1Doc: string;         // F1_DOC
    F1Serie: string;       // F1_SERIE
    F1Status: string;      // F1_STATUS
    A2Cod: string;         // A2_COD
    A2Loja: string;        // A2_LOJA
    A2Nome: string;        // A2_NOME
    Fornece: string;       // A2_COD + ' ' + A2_LOJA + ' - ' + A2_NOME
    F1Emissao: string;     // F1_EMISSAO
    F1DtDigit: string;     // F1_DTDIGIT
    F1ValBrut: number;     // SUM(D1_TOTAL)
    F1XTipo: string;       // F1_XTIPO
    F1XPrior: string;      // F1_XPRIOR
    F1XOri: string;        // F1_XORI
    F1XUsrra: string;      // F1_XUSRRA
    F1XObs: string;        // F1_XOBS
    F1ZObsRev: string;     // F1_ZOBSREV
    F1XRev: string;        // F1_XREV
    Usuario: string;       // Processamento/substring do F1_USERLGI
    Vencimento: string;    // Z10.Z10_VENCTO
    Anexo: string;         // Z07.Z07_DESC
    AnexoPath: string;     // Z07.Z07_CHAVE
}


export type TimelineParams = {
    rec_f1?: number;
};

export interface TimelineItem {
    categoria: string;
    pedido?: string;
    usuario_do_pedido?: string;
    emissao_pedido?: string;
    cod_fornecedor?: string;
    fornecedor?: string;
    loja?: string;
    nota?: string;
    serie?: string;
    emissao_nf?: string;
    data_classificacao?: string;
    numero_parcela?: string;
    vencimento?: string;
    data_baixa?: string;
    observacao_historico?: string;
    usuario_historico?: string;
    data_historico?: string;
    hora_historico?: string;
    rec_f1?: number; // 🆕 Campo de referência REC_F1
}

//USE EDIT PRENOTA

// Interface para os PAGAMENTOS (já tínhamos, pequenas adaptações)
export interface Pagamento {
    Z10_ITEM: string; // Parece um ID, então string
    Parcela: string;
    Vencimento: string; // Formato "dd/MM/yyyy" vindo da API
    Valor: number;     // Número
    REC: number;       // Número
}

// Interface para os RATEIOS (já tínhamos, pequenas adaptações)
export interface Rateio {
    Z10_ITEM: string;
    Z10_CC: string;
    Z10_FILRAT: string;
    Z10_VALOR: number;
    Z10_PERC: number;
    REC: number;
}

// Interface para os ITENS da pré-nota (adaptado)
export interface Item {
    D1_COD: string;
    D1_ITEM: string;
    B1_DESC: string;
    B1_POSIPI: string; // Pode ser string, já que tem zeros à esquerda
    B1_ORIGEM: string;
    B1_UM: string;
    D1_VUNIT: number;
    D1_QUANT: number;
    C7_NUM: string;    // Pode ser string, já que tem espaços
    C7_ITEM: string;   // Pode ser string
    A5_NOMPROD: string;
    A5_CODPRF: string;
    D1_TOTAL: number;
}

// Interface PRINCIPAL para a resposta da API da PRENOTA
export interface Prenota {
    altera: string;  // "true" ou "false" -> string
    F1_CHVNFE: string;
    F1_FILIAL: string;
    F1_XPRIOR: string;
    F1_XTIPO: string;
    F1_EMISSAO: string;
    F1_DOC: string;
    RECA2: string;  // Parece um ID, então string
    F1_SERIE: string;
    F1_XOBS: string;
    F1_FORNECE: string;
    F1_STATUS: string;
    F1_LOJA: string;
    A2_NOME: string;
    F1_COND: string;
    E4_DESCRI: string;
    PAGAMENTOS: Pagamento[]; // Array de Pagamento
    RATEIO: Rateio[];       // Array de Rateio
    ITENS: Item[];         // Array de Item
}

// Interface para tratamento de erros da API
export interface ProtheusErrorResponse {
    message?: string;
    error?: string;
    // ... outros campos de erro, se houver ...
}
