//? ====================
//? TIPOS BASE E GENÉRICOS
//? ====================
export interface Filial {
    numero: string;
    filial: string;
    cnpjFilial: string;
}

export interface Comboboxes {
    label: string;
    value: string;
}

//? ====================
//? TIPOS RELACIONADOS A CONDIÇÕES DE PAGAMENTO
//? ====================
export interface Parcela {
    Parcela: string;
    Vencimento: string;
    Valor: number;
}

//? ====================
//? TIPOS RELACIONADOS À SELEÇÃO DE NF
//? ====================
export interface AnexoHub {
    seq: string;
    arq: string; // Nome do arquivo
    desc: string;
}

//Interface para o anexo a ser enviado.
export interface AnexoUpload {
    seq: string;
    file: File;
    doc: string;
}

export interface AnexosCompleto {
    seq: string;
    file: File;
    doc: string;
    arq: string;
    desc: string;
}