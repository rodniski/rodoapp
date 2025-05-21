// app/documentacao/_internal/components/DataTableDocs/DataTableDocs.config.ts

/**
 * @file Arquivo de configuração para o componente DataTableDocs.
 * Contém as definições de tipos para os dados da tabela e as props do componente.
 */

//* --- Tipos e Interfaces ---

/**
 * @interface TableDataRow
 * @description Define a estrutura de uma linha de dados para a DataTableDocs.
 * Os campos são genéricos, ajuste conforme a necessidade mais comum.
 */
export interface TableDataRow {
    aplicativo: string;
    relatorio: string;
    conteudo: string;
    // Adicione mais campos aqui se suas tabelas de documentação precisarem.
    [key: string]: any; // Permite colunas adicionais flexíveis
  }
  
  /**
   * @interface DataTableDocsProps
   * @description Define as propriedades para o componente DataTableDocs.
   */
  export interface DataTableDocsProps {
    /**
     * @property {TableDataRow[]} data - Um array de objetos, onde cada objeto representa uma linha na tabela.
     */
    data: TableDataRow[];
    /**
     * @property {string[]} [headers] - Opcional: Array de strings para os cabeçalhos da tabela.
     * Se não fornecido, tentará usar as chaves do primeiro objeto de dados (excluindo 'key' ou 'id' se houver).
     * Ou podemos definir colunas fixas como no seu exemplo original.
     */
    headers?: string[]; // Ex: ["Aplicativo", "Relatório", "Conteúdo"]
     /**
     * @property {string} [caption] - Legenda opcional para a tabela, importante para acessibilidade e contexto.
     */
    caption?: string;
    /**
     * @property {string} [className] - Classes CSS adicionais para o contêiner da tabela.
     */
    className?: string;
  }
  
  //? Não há props com valores padrão complexos aqui, `data` é obrigatório.
  //? `headers` e `caption` são opcionais.