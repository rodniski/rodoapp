// _core/components/aceternity/GlowingEffect/GlowingEffect.config.ts

/**
 * @file Arquivo de configuração para o componente GlowingEffect.
 * Contém a definição das propriedades (props) e seus valores padrão.
 */

//* --- Tipos e Interfaces ---

/**
 * @interface GlowingEffectProps
 * @description Define as propriedades para o componente GlowingEffect.
 */
export interface GlowingEffectProps {
  /**
   * @property {number} [blur] - Intensidade do desfoque para o efeito de brilho.
   * @default defaultGlowingEffectProps.blur (0)
   */
  blur?: number;
  /**
   * @property {number} [inactiveZone] - Proporção da área central do contêiner onde o efeito
   * de brilho dinâmico não é ativado pelo mouse. Baseado no menor lado do contêiner.
   * @default defaultGlowingEffectProps.inactiveZone (0.7)
   */
  inactiveZone?: number;
  /**
   * @property {number} [proximity] - Distância adicional em pixels ao redor do contêiner
   * onde o movimento do mouse ainda pode ativar o efeito dinâmico.
   * @default defaultGlowingEffectProps.proximity (0)
   */
  proximity?: number;
  /**
   * @property {number} [spread] - Abertura do gradiente cônico (em graus) que forma o brilho dinâmico.
   * @default defaultGlowingEffectProps.spread (20)
   */
  spread?: number;
  /**
   * @property {'default' | 'white'} [variant] - Variante de cor para a borda estática do brilho.
   * 'white' aplica uma borda branca.
   * @default defaultGlowingEffectProps.variant ('default')
   */
  variant?: "default" | "white";
  /**
   * @property {boolean} [glow] - Controla a visibilidade de um brilho de borda mais estático.
   * @default defaultGlowingEffectProps.glow (false)
   */
  glow?: boolean;
  /**
   * @property {string} [className] - Classes CSS adicionais para o contêiner do efeito de brilho principal (dinâmico).
   */
  className?: string;
  /**
   * @property {boolean} [disabled] - Se `true`, o efeito de brilho dinâmico é desativado.
   * //! ATENÇÃO: O default é `true`, significando que o efeito dinâmico está DESABILITADO por padrão.
   * @default defaultGlowingEffectProps.disabled (true)
   */
  disabled?: boolean;
  /**
   * @property {number} [movementDuration] - Duração (em segundos) da animação de rotação do brilho dinâmico.
   * @default defaultGlowingEffectProps.movementDuration (2)
   */
  movementDuration?: number;
  /**
   * @property {number} [borderWidth] - Largura da borda (em pixels) onde o efeito de brilho é aplicado.
   * @default defaultGlowingEffectProps.borderWidth (1)
   */
  borderWidth?: number;
}

//* --- Valores Padrão para Props ---

/**
 * @const defaultGlowingEffectProps
 * @description Objeto contendo os valores padrão para as props do GlowingEffect.
 * Centraliza as configurações default, facilitando a manutenção e a clareza.
 */
export const defaultGlowingEffectProps: Required<
  Pick<
    // Garante que todos os campos com default no componente original tenham um default aqui.
    GlowingEffectProps,
    | "blur"
    | "inactiveZone"
    | "proximity"
    | "spread"
    | "variant"
    | "glow"
    | "disabled"
    | "movementDuration"
    | "borderWidth"
  >
> = {
  blur: 0,
  inactiveZone: 0.7,
  proximity: 0,
  spread: 20,
  variant: "default",
  glow: false,
  disabled: true,
  movementDuration: 2,
  borderWidth: 1,
};
