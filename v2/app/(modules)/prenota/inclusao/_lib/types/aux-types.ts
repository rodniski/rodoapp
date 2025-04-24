export interface ConexaoNfeItem {
    codProduto: string;
    descProduto: string;
    ncmsh: string;
    cst: string;
    origem: string;
    cfop: string;
    unidade: string;
    quantidade: string; // Pode ser number se a API garantir
    valorUnitario: string; // Pode ser number
    valorTotal: string; // Pode ser number
    bcIcms: string; // Pode ser number
    valorIcms: string; // Pode ser number
    valorIpi: string | null | undefined; // Pode ser number ou ausente/nulo
    aliqIcms: string; // Pode ser number
    aliqIpi: string | null | undefined; // Pode ser number ou ausente/nulo
  }
  
  export interface ConexaoNfeDetalhesResponse {
    numero: string;
    serie: string;
    dataEmissao: string; // Considerar usar Date se for fazer manipulação
    valorTotalDaNota: string; // Pode ser number
    nomeEmitente: string;
    cnpjEmitente: string;
    ufEmitente: string;
    nomeDestinatario: string;
    cnpjDestinatario: string;
    ufDestinatario: string;
    informacoesAdicionais: string | null;
    itens: ConexaoNfeItem[];
  }
  
  // Tipo para erros específicos da API ConexaoNFE, se houver um padrão conhecido
  export interface ConexaoNfeError {
      // Exemplo: code: string; message: string;
      // Adapte conforme a documentação ou observação de erros reais
      [key: string]: any; // Genérico por enquanto
  }


  