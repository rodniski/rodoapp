// app/documentacao/_internal/components/mdx/DocVideo/DocVideo.config.ts
import type { VideoHTMLAttributes } from 'react'; // Importa tipos para props de <video>

/**
 * @file Arquivo de configuração para o componente DocVideo.
 * Contém a definição das propriedades (props) e seus valores padrão.
 */

//* --- Tipos e Interfaces ---

// Estende VideoHTMLAttributes para aceitar todas as props padrão de um elemento <video>
export interface DocVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  /**
   * @property {string} src - Caminho para o arquivo de vídeo (relativo à pasta /public ou URL completa).
   */
  src: string;
  /**
   * @property {string} [alt] - Texto descritivo do vídeo, usado como 'title' no elemento <video> para tooltip
   * ou para contexto se o vídeo não carregar. Para acessibilidade completa, considere legendas e transcrições.
   */
  alt?: string;
  /**
   * @property {string} [caption] - Legenda opcional a ser exibida abaixo do vídeo.
   */
  caption?: string;
  /**
   * @property {number | string} [width] - Largura do vídeo.
   * @default defaultDocVideoProps.width ("100%")
   */
  width?: number | string;
  /**
   * @property {number | string} [height] - Altura do vídeo.
   * @default defaultDocVideoProps.height ("auto")
   */
  height?: number | string;
  /**
   * @property {boolean} [controls] - Exibir controles padrão do player de vídeo.
   * @default defaultDocVideoProps.controls (true)
   */
  controls?: boolean;
  /**
   * @property {boolean} [autoPlay] - Iniciar o vídeo automaticamente.
   * Requer que a prop `muted` também seja `true` na maioria dos navegadores modernos.
   * @default defaultDocVideoProps.autoPlay (false)
   */
  autoPlay?: boolean;
  /**
   * @property {boolean} [loop] - Repetir o vídeo continuamente.
   * @default defaultDocVideoProps.loop (false)
   */
  loop?: boolean;
  /**
   * @property {boolean} [muted] - Define se o vídeo deve começar sem som.
   * Necessário para `autoPlay` na maioria dos navegadores.
   * @default defaultDocVideoProps.muted (false, mas se autoPlay=true, o componente forçará muted)
   */
  muted?: boolean;
  /**
   * @property {string} [containerClassName] - Classes CSS adicionais para o contêiner <figure> do vídeo.
   */
  containerClassName?: string;
  /**
   * @property {string} [className] - Classes CSS adicionais para o elemento <video> em si.
   */
  className?: string;
  // As props 'src', 'width', 'height', 'controls', 'autoPlay', 'loop', 'muted'
  // são explicitamente definidas, mas VideoHTMLAttributes cobre outras como 'poster', 'preload', etc.
}

//* --- Valores Padrão para Props ---
export const defaultDocVideoProps: Partial<DocVideoProps> = {
  // Nota: 'src' é obrigatório e não tem default aqui.
  alt: "Vídeo da documentação",
  width: "100%", // O vídeo tentará preencher a largura do contêiner
  height: "auto",
  controls: true,
  autoPlay: false,
  loop: false,
  muted: false, // Será forçado para true se autoPlay for true
};