// app/documentacao/_internal/components/mdx/DocImage/DocImage.tsx
// Este componente pode ser um Server Component se não tiver interatividade própria.
// No entanto, se usado em MDX renderizado por next-mdx-remote em uma página client, ele será client.

import React from 'react';
import Image from "next/image";
import { cn } from "utils"; // Seu utilitário de classes
import type { DocImageProps } from "./DocImage.config";
import { defaultDocImageProps } from "./DocImage.config";

/**
 * @component DocImageComponent
 * @description Componente para renderizar imagens de forma padronizada na documentação,
 * utilizando next/image e permitindo legendas.
 * @param {DocImageProps} props - As propriedades do componente.
 */
const DocImageComponent = (props: DocImageProps) => {
  const {
    src,
    alt,
    caption,
    className,
    containerClassName,
    width,
    height,
    ...restImageProps // Outras props válidas para next/image
  } = { ...defaultDocImageProps, ...props };

  return (
    <figure className={cn("my-5 flex flex-col items-center", containerClassName)}>
      <div className="rounded-md overflow-hidden border shadow-sm"> {/* Borda e sombra sutis */}
        <Image
          src={src}
          alt={alt || "Imagem da documentação"}// Default já aplicado
          width={width} // Default já aplicado
          height={height} // Default já aplicado
          className={cn("object-contain bg-muted/20", className)} // object-contain e um fundo sutil
          {...restImageProps}
        />
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export const DocImage = React.memo(DocImageComponent);
DocImage.displayName = "DocImage";