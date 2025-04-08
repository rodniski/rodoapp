import {ProdutoXML} from "#/incluir/interfaces";


/**
 * Interface para definir as colunas da tabela.
 */
export interface Column<T> {
  id: string; // Identificador único da coluna
  header: string; // Texto do cabeçalho da coluna
  accessorKey?: keyof T | "index"; // Acesso direto à propriedade de T ou "index" para índices
  formatter?: (value: any) => string | React.ReactNode; // Função para formatar o valor
  className?: string; // Classe CSS para estilização
}

/**
 * Formata um valor monetário em R$.
 */
const formatCurrency = (value: number | string): string =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(typeof value === "string" ? parseFloat(value) : value);

/**
 * Colunas da tabela ajustadas para o tipo ProdutoXML.
 */
export const columns: Column<ProdutoXML>[] = [
  {
    id: "codProduto",
    accessorKey: "codProduto",
    header: "Código do Produto",
  },
  {
    id: "descProduto",
    accessorKey: "descProduto",
    header: "Descrição do Produto",
  },
  {
    id: "ncmsh",
    accessorKey: "ncmsh",
    header: "NCM/SH",
  },
  {
    id: "origem",
    accessorKey: "origem",
    header: "Origem",
  },
  {
    id: "unidade",
    accessorKey: "unidade",
    header: "Unidade",
  },
  {
    id: "quantidade",
    accessorKey: "quantidade",
    header: "Quantidade",
  },
  {
    id: "valorUnitario",
    accessorKey: "valorUnitario",
    header: "Valor Unitário",
    formatter: (value) => formatCurrency(value), // Aplica a formatação monetária
  },
  {
    id: "valorTotal",
    accessorKey: "valorTotal",
    header: "Valor Total",
    formatter: (value) => formatCurrency(value), // Aplica a formatação monetária
  },
];
