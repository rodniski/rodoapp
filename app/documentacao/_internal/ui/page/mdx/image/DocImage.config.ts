// app/documentacao/_internal/components/mdx/DocImage/DocImage.config.ts
import type { ImageProps as NextImageProps } from "next/image";

/**
 * @file Arquivo de configuração para o componente DocImage.
 * Contém a definição das propriedades (props) e seus valores padrão.
 */

//* --- Tipos e Interfaces ---

// Omitimos 'alt' das NextImageProps para torná-lo opcional com um fallback em nosso componente.
// Adicionamos 'caption' e garantimos que 'src' seja sempre string.
export interface DocImageProps extends Omit<NextImageProps, 'alt' | 'src'> {
  /**
   * @property {string} src - O caminho para a imagem (deve ser acessível a partir de /public ou ser uma URL externa).
   */
  src: string;
  /**
   * @property {string} [alt] - Texto alternativo para a imagem. Se não fornecido, um padrão será usado.
   * @default "Imagem da documentação"
   */
  alt?: string;
  /**
   * @property {string} [caption] - Legenda opcional a ser exibida abaixo da imagem.
   */
  caption?: string;
  /**
   * @property {number} [width] - Largura da imagem.
   * @default 700
   */
  width?: number;
  /**
   * @property {number} [height] - Altura da imagem.
   * @default 400
   */
  height?: number;
  /**
   * @property {string} [className] - Classes CSS adicionais para o componente <Image> do Next.js.
   */
  className?: string;
  /**
   * @property {string} [containerClassName] - Classes CSS adicionais para o contêiner <figure> da imagem.
   */
  containerClassName?: string;
}

//* --- Valores Padrão para Props ---
export const defaultDocImageProps: Pick<DocImageProps, "alt" | "width" | "height"> = {
  alt: "Imagem da documentação",
  width: 700,
  height: 400,
};