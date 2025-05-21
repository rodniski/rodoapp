// _core/components/theme/Background/Background.config.ts

/**
 * @file Arquivo de configuração para o componente Background.
 * Contém a definição das propriedades (props) e seus valores padrão.
 */

//* --- Tipos e Interfaces ---

/**
 * @interface BackgroundProps
 * @description Define as propriedades para o componente Background.
 */
export interface BackgroundProps {
    /**
     * @property {string} [className] - Classes CSS adicionais para aplicar ao contêiner raiz do background.
     * @default defaultBackgroundProps.className ("")
     */
    className?: string;
    //? No futuro, poderíamos adicionar props para controlar as cores do gradiente,
    //? a intensidade do blur, ou a posição das "luzes" se necessário.
  }
  
  //* --- Valores Padrão para Props ---
  
  /**
   * @const defaultBackgroundProps
   * @description Objeto contendo os valores padrão para as props do Background.
   */
  export const defaultBackgroundProps: Required<Pick<BackgroundProps, "className">> = {
    className: "",
  };