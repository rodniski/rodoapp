// app/documentacao/_internal/types.ts
import type { LucideIcon } from "lucide-react";

export interface SubItemConfig {
  // Renomeado para evitar confusão se 'SubItem' for usado com 'url' gerada
  /**
   * @description O slug único do artigo, usado para navegação e nome do arquivo de conteúdo.
   * Ex: "agendamentoreuniao" (deve ser o mesmo usado no nome do arquivo .doc.ts)
   */
  id: string;
  /**
   * @description O título do artigo exibido na sidebar.
   */
  title: string;
  // A propriedade 'url' será gerada dinamicamente no componente da sidebar.
}

export interface DocumentationCategoryConfig {
  // Renomeado para evitar confusão
  /**
   * @description O ID da categoria, usado internamente e para derivar o slug da categoria na URL.
   * Ex: "doc-ti" (que resultaria no slug "ti")
   */
  id: string;
  /**
   * @description O título da categoria exibido na sidebar.
   */
  title: string;
  /**
   * @description O componente de ícone (LucideIcon) para a categoria.
   */
  icon: LucideIcon;
  /**
   * @description Uma lista de subitens (artigos) pertencentes a esta categoria.
   */
  subItems: SubItemConfig[];
}

/**
 * @interface ActionButtonConfig
 * @description Configuração para botões de ação (no cabeçalho/rodapé ou dentro do MDX).
 */
export interface ActionButtonConfig {
  text: string;
  onClickIdentifier?: string; // Para ações JavaScript client-side
  href?: string; // Para links diretos
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
}

/**
 * @interface ArticleFrontmatter
 * @description Define a estrutura esperada para o frontmatter dos arquivos MDX de documentação.
 */
export interface ArticleFrontmatter {
  title: string;
  group: string; // Categoria principal do artigo (ex: "Protheus", "TI")
  date?: string; // Data de publicação ou última atualização
  description?: string; // Curta descrição para metadados e preview
  headerButton?: ActionButtonConfig;
  footerButton?: ActionButtonConfig;
  // Você pode adicionar outros campos de metadados aqui, como:
  // keywords?: string[];
  // author?: string;
}

/**
 * @interface LoadedArticle
 * @description Estrutura do objeto retornado pelo loader, contendo frontmatter e o source MDX compilado.
 */
export interface LoadedArticle {
  frontmatter: ArticleFrontmatter;
  source: any; // O tipo exato dependerá do retorno de `serialize` do next-mdx-remote (MDXRemoteSerializeResult)
  // Se você não serializar no loader, seria: content: string; (o conteúdo MDX bruto)
}
