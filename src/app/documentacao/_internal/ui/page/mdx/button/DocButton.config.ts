// app/documentacao/_internal/components/mdx/DocButton/DocButton.config.ts
import type { ReactNode } from 'react';
// Supondo que seu Button de 'ui' tenha um tipo para suas variantes
// import type { ButtonProps as UiButtonVariant } from 'ui'; // Ajuste conforme o tipo do seu botão

/**
 * @file Arquivo de configuração para o componente DocButton.
 */

//* --- Tipos e Interfaces ---
export interface DocButtonProps {
  /**
   * @property {ReactNode} children - O texto ou conteúdo do botão.
   */
  children: ReactNode; // Alterado de 'text' para 'children' para mais flexibilidade (ex: ícone + texto)
  /**
   * @property {string} [onClickIdentifier] - Identificador para uma ação JavaScript client-side pré-definida.
   */
  onClickIdentifier?: string;
  /**
   * @property {string} [href] - URL para navegação. Se fornecido, o botão se comportará como um link.
   */
  href?: string;
  /**
   * @property {'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'} [variant]
   * @description Variante visual do botão, baseada nas variantes do seu componente Button de `ui`.
   * @default 'outline'
   */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /**
   * @property {string} [className] - Classes CSS adicionais para o botão.
   */
  className?: string;
  /**
   * @property {'sm'  | 'lg' | 'icon'} [size] - Tamanho do botão (se seu Button de `ui` suportar).
   */
  size?: 'sm'  | 'lg' | 'icon';
  // Outras props que seu componente Button de `ui` possa aceitar
  [key: string]: any; // Permite outras props serem passadas para o Button base
  asChild?: boolean;
}

//* --- Valores Padrão para Props ---
export const defaultDocButtonProps: Pick<DocButtonProps, "variant"> = {
  variant: "outline",
};