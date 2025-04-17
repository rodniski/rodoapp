//? ====================
//? TIPOS RELACIONADOS A PRODUTOS
//? ====================
export interface Produto {
    numero: string;
    status: string;
    codigo: string;
    descricao: string;
    quantidade: number;
    precoUnitario: number;
    valorTotal: number;
    condicaoPagamento?: string;
    ncm: string;
    origem: string;
    unidade: string;
    localPadrao?: string;
    tipo?: string;
    grupoTributario?: string;
    grupoProduto?: string;
    itemPedido?: string;
    pedidoNumero?: string;
}

//? ====================
//? TIPOS RELACIONADOS A PEDIDOS
//? ====================

export interface ProdutoPOST {
    ITEM: string;
    PRODUTO: string;
    QUANTIDADE: number;
    VALUNIT: number;
    PRODFOR: string;
    DESCFOR: string;
    ORIGEMXML: string;
    TOTAL: number;
    PC: string;
    ITEMPC: string;
    B1_UM: string;
    SEGUN: string;
    TPFATO: string;
    CONV: number;
    ORIGEM: string;
    RATEIOS?: Rateio[];
}


//? ====================
//? TIPOS RELACIONADOS A FORNECEDORES
//? ====================
export interface Fornecedor {
    codigo: string;
    loja: string;
    nome: string;
    cnpj: string;
    municipio?: string;
    estado?: string;
    bloqueio?: string;
    rec?: string;
    pedidos: Produto[];
}

//? ====================
// LIKEFOR RESPONSE
//? ====================
export interface FornecedorAPI { // Interface para Fornecedor (direto da API)
    A2_COD: string;
    APELIDO: string;
    A2_LOJA: string;
    A2_NOME: string;
    A2_NREDUZ: string;
    A2_MUN: string;
    A2_MSBLQL: string;
    A2_EST: string;
    A2_CGC: string;
    REC: string;
    PEDIDOS?: PedidoAPI[]; // Array de PedidoAPI (opcional, pois pode não ter pedidos)
}

export interface PedidoAPI { // Interface para Pedido (direto da API)
    C7_NUM: string;
    STATUS: string;
    C7_ITEM: string;
    C7_PRODUTO: string;
    B1_DESC: string;
    C7_QUANT: number;
    C7_PRECO: number;
    C7_TOTAL: number;
    C7_COND: string;
    B1_POSIPI: string;
    B1_UM: string;
    B1_LOCPAD: string;
    B1_TIPO: string;
    B1_GRTRIB: string;
    B1_GRUPO: string;
    B1_ORIGEM: string;
}

//? ====================
//? TIPOS RELACIONADOS A NOTAS FISCAIS
//? ====================

export interface XmlItem {
    codProduto: string;
    descProduto: string;
    ncmsh: string;
    cst: string;
    origem: string;
    cfop: string;
    unidade: string;
    quantidade: string;
    valorUnitario: string;
    valorTotal: string;
    bcIcms: string;
    valorIcms: string;
    valorIpi: string;
    aliqIcms: string;
    aliqIpi: string;
}

export interface Conexao {
    numero: string;
    serie: string;
    dataEmissao: string;
    valorTotalDaNota: string;
    nomeEmitente: string;
    cnpjEmitente: string;
    ufEmitente: string;
    nomeDestinatario: string;
    cnpjDestinatario: string;
    ufDestinatario: string;
    informacoesAdicionais: string;
    itens: XmlItem[];

    // Métodos úteis
    getTotalItens: () => number;
    getValorTotal: () => number;
    getItemByCodigo: (codigo: string) => XmlItem | undefined;
}


//? ====================
//? TIPOS RELACIONADOS A RATEIOS
//? ====================

// Definição da interface do rateio
export interface Rateio {
    id: string;
    seq: string;
    FIL: string;
    filial: string;
    cc: string;
    percent: number;
    valor: number;
    REC: number;
}


/**
 * Tipo final que mapeia os campos do pedido (PC, ITEMPC, B1_UM, ORIGEM)
 * e os campos da XML (codProduto, descProduto, quantidade, valorUnit, etc.)
 */
export type MappedProduto = {
    ITEM: string;         // Sequencial de 5 dígitos (ex: "00001")
    PRODUTO: string;      // Descrição do produto do pedido (B1_DESC)
    QUANTIDADE: number;   // Vindo da XML
    VALUNIT: number;      // Valor unitário da XML
    PRODFOR: string;      // Código do produto da XML
    DESCFOR: string;      // Descrição do produto da XML
    ORIGEMXML: string;    // "origem" do produto na XML
    TOTAL: number;        // valorTotal da XML
    PC: string;           // C7_NUM do pedido
    ITEMPC: string;       // C7_ITEM do pedido
    B1_UM: string;        // Unidade de medida do pedido (B1_UM)
    SEGUN: string;
    TPFATO: string;
    CONV: number;
    ORIGEM: string;       // B1_ORIGEM do pedido
    selectedProduto?: string; // Se estiver usando combobox para escolher outro produtoProtheus
};