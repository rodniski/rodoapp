// app/documentacao/_internal/components/GenericDocumentationPage/GenericDocumentationPage.config.ts
import type { ReactNode } from "react";

/**
 * @file Arquivo de configuração para o componente GenericDocumentationPage.
 * Define os tipos para a estrutura de conteúdo de uma página de documentação genérica.
 */

//* --- Tipos e Interfaces ---

/**
 * @interface ContentItem
 * @description Define um item de conteúdo adicional dentro de uma seção, como imagem, vídeo, botão, etc.
 */
export interface ContentItem {
  type: "text" | "image" | "video" | "button" | "iframe" | "datatable"; // Adicionado 'datatable'
  content: string | ReactNode | any; // 'any' para data do datatable, string para src, ReactNode para texto/botão
  props?: Record<string, any>; // Props adicionais para o elemento (ex: alt, width, height para imagem; onClick para botão)
}

/**
 * @interface Section
 * @description Define uma seção de conteúdo dentro da página de documentação.
 */
export interface Section {
  id: string;
  title: string;
  content?: string | ReactNode; // Conteúdo principal da seção (texto, markdown, etc.)
  additionalContent?: ContentItem[]; // Conteúdo adicional como imagens, vídeos, etc.
}

/**
 * @interface ActionButtonProps
 * @description Propriedades para os botões de ação no cabeçalho ou rodapé.
 * //? Os handlers onClick são passados como props, o que torna GenericDocumentationPage um Client Component.
 * //? Para SSG puro com conteúdo serializável, esses onClicks precisariam ser mapeados a partir de identificadores.
 * //? Mantendo onClick direto conforme o código original fornecido.
 */
export interface ActionButtonProps {
  text: string;
  onClick: () => void; // Mantendo onClick como função
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"; // Exemplo de variantes do seu <Button />
  className?: string;
}

/**
 * @interface GenericDocumentationPageProps
 * @description Define as propriedades para o componente GenericDocumentationPage.
 */
export interface GenericDocumentationPageProps {
  title: string;
  group: string;
  date: string;
  description: ReactNode;
  headerButton?: ActionButtonProps;
  sections: Section[];
  footerButton?: ActionButtonProps;
}
