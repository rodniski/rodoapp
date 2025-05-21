// src/lib/api/conexaoNFE/types.ts
// (Ou o caminho que preferir, como @conexaoNFE/types, ajuste a importação no próximo arquivo)

// Representa um item dentro da nota fiscal
export interface ConexaoNfeItem {
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
    valorIpi?: string | null; // Marcado como opcional/nulo
    aliqIcms: string;
    aliqIpi?: string | null; // Marcado como opcional/nulo
}

// Representa a resposta completa da API de detalhes do DFe
export interface ConexaoNfeDetalhesResponse {
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
    informacoesAdicionais?: string | null; // Marcado como opcional/nulo
    itens: ConexaoNfeItem[];
}

// Representa a estrutura de erro esperada da API ConexaoNFE (adapte se necessário)
export interface ConexaoNfeError {
    // Exemplo: pode ser um objeto com 'message', 'code', etc.
    // Adapte conforme a documentação ou erros observados.
    message?: string;
    error?: string;
    [key: string]: any; // Permite outras propriedades
}


// FORNECEDOR X PEDIDO

// Representa um pedido associado a um fornecedor
export interface Pedido {
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
    OBS: string;
}

// Representa um fornecedor na resposta da API
export interface Fornecedor {
    A2_COD: string;
    APELIDO: string;
    A2_LOJA: string;
    A2_NOME: string;
    A2_NREDUZ: string;
    A2_MUN: string;
    A2_MSBLQL: string; // Pode ser number ou boolean dependendo do uso
    A2_EST: string;
    A2_CGC: string; // CNPJ
    REC: string; // Pode ser number
    PEDIDOS: Pedido[]; // Array de pedidos associados
}

// A resposta principal da API é um array de Fornecedores
export type FornecedorPedidoResponse = Fornecedor[];

// Estrutura de erro esperada desta API (adapte se necessário)
export interface FornecedorPedidoError {
    message?: string;
    error?: string;
    [key: string]: any;
}

// CONDIÇÃO

// src/lib/api/condicaoPagamento/types.ts
// (Ajuste o caminho conforme sua estrutura)

// Interface para o objeto 'dados' na resposta.
export interface DadosCondicao {
    chave_pix: string;
    cpf_cnpj_destinatario: string;
}

// Interface para cada objeto de pagamento (parcela) na resposta.
export interface Pagamento {
    Parcela: string;    // Ex: "001", "002"
    Vencimento: string; // Ex: "20/02/2025"
    Valor: number;      // Ex: 250 (vem como número no JSON exemplo)
}

// Interface para a resposta completa da API.
export interface CondicaoPagamentoResponse {
    dados: DadosCondicao;
    Pagamentos: Pagamento[]; // Array de parcelas
}

// Interface para os parâmetros de entrada da função da API.
// Agrupa todos os headers necessários para clareza.
export interface CondicaoPagamentoParams {
    valor: string | number; // Aceita número ou string, mas será enviado como string no header.
    condpag: string;        // Código da condição de pagamento.
    dtemissao: string;      // Data de emissão no formato "dd/MM/yyyy".
    codForn: string;        // Código do fornecedor.
    lojaForn: string;       // Loja do fornecedor.
}


// Estrutura de erro esperada desta API (adapte se necessário).
export interface CondicaoPagamentoError {
    message?: string;
    error?: string;
    [key: string]: any;
}