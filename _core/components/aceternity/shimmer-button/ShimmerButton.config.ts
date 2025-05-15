
// _core/components/aceternity/ShimmerButton/ShimmerButton.config.ts

import type { ReactNode } from "react";
import type { HTMLMotionProps } from "motion/react"; // Para tipar ...props corretamente

/**
 * @file Arquivo de configuração para o componente ShimmerButton.
 * Contém a definição das propriedades (props) e seus valores padrão.
 */

//* --- Tipos e Interfaces ---

/**
 * @interface ShimmerButtonProps
 * @description Define as propriedades para o componente ShimmerButton.
 * Estende as props de um `motion.div` para permitir todas as suas funcionalidades.
 */
export interface ShimmerButtonProps extends HTMLMotionProps<"div"> {
  /**
   * @property {ReactNode} children - O conteúdo a ser renderizado dentro do botão.
   */
  children: ReactNode;
  /**
   * @property {string} [className] - Classes CSS adicionais para o contêiner principal do botão.
   * @default defaultShimmerButtonProps.className ("")
   */
  className?: string;
  // As demais props (ex: onClick, aria-label, etc.) são cobertas por HTMLMotionProps<"div">
}

//* --- Valores Padrão para Props ---

/**
 * @const defaultShimmerButtonProps
 * @description Objeto contendo os valores padrão para as props do ShimmerButton.
 */
export const defaultShimmerButtonProps: Pick<ShimmerButtonProps, "className"> = {
  className: "",
};