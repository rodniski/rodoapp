// app/documentacao/_internal/components/mdx/mdxComponents.map.ts

/**
 * @file Define o mapeamento de componentes a serem usados pelo MDXRemote.
 * Inclui componentes de estilização para HTML padrão e componentes MDX customizados.
 */

// Importa os componentes de estilização para HTML padrão
import * as HtmlStyled from "./styling/HtmlStyling.components";

import { DocImage, DocButton, DataTableDocs, DocVideo } from ".";

export const mdxComponents = {
  // Componentes de estilização para tags HTML padrão
  h1: HtmlStyled.H1,
  h2: HtmlStyled.H2,
  h3: HtmlStyled.H3,
  // h4: HtmlStyled.H4, (adicione se definido)
  // h5: HtmlStyled.H5,
  // h6: HtmlStyled.H6,
  p: HtmlStyled.P,
  a: HtmlStyled.A,
  ul: HtmlStyled.UL,
  ol: HtmlStyled.OL,
  li: HtmlStyled.LI,
  code: HtmlStyled.CodeInline, // Para `code` (markdown inline)
  pre: HtmlStyled.Pre, // Para ```code block``` (markdown block)
  blockquote: HtmlStyled.Blockquote,
  hr: HtmlStyled.Hr,
  // table: HtmlStyled.Table, (se você criar componentes para tabelas markdown)
  // th: HtmlStyled.Th,
  // td: HtmlStyled.Td,
  // tr: HtmlStyled.Tr,

  // Seus componentes MDX customizados (com 'Doc' no nome ou como preferir)
  DocImage,
  DocButton,
  DataTableDocs,
  DocVideo,
  // DocIframe,

  // Exemplo de como expor um componente de UI global diretamente para o MDX
  // Se você quiser usar <UiButton> no MDX, por exemplo:
  // UiButton, // (renomeie para evitar conflito com a tag <button> se necessário)
};
