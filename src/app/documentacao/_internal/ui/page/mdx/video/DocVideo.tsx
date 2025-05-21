// app/documentacao/_internal/components/mdx/DocVideo/DocVideo.tsx
// Este componente geralmente não precisa de "use client" se for apenas para display,
// mas se você adicionar manipuladores de evento JS customizados, ele precisaria.
// Por enquanto, vamos omitir "use client" e ele será um Server Component por padrão,
// funcionando bem com MDXRemote.

import React, { memo } from 'react';
import { cn } from 'utils'; // Seu utilitário de classes
import type { DocVideoProps } from './DocVideo.config';
import { defaultDocVideoProps } from './DocVideo.config';

/**
 * @component DocVideoComponent
 * @description Componente para renderizar vídeos de forma padronizada na documentação,
 * utilizando a tag <video> do HTML5 e permitindo legendas.
 * @param {DocVideoProps} props - As propriedades do componente.
 */
const DocVideoComponent = (props: DocVideoProps) => {
  const {
    src,
    alt,
    caption,
    className,
    containerClassName,
    width,
    height,
    controls,
    autoPlay,
    loop,
    muted,
    // Se houver 'children' nas props (via VideoHTMLAttributes), eles serão passados para <video>
    // o que é útil para <source> tags ou <track> tags.
    children,
    ...restVideoProps // Outras props válidas para <video>
  } = { ...defaultDocVideoProps, ...props };

  // Garante que o vídeo seja mutado se o autoplay estiver ativo, para conformidade com navegadores
  const effectiveMuted = autoPlay ? true : muted;

  return (
    <figure className={cn("my-5 flex flex-col items-center", containerClassName)}>
      <div className="w-full rounded-md overflow-hidden border bg-black shadow-sm"> {/* Fundo preto para vídeos e borda */}
        <video
          src={src}
          width={width}
          height={height}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={effectiveMuted}
          className={cn("object-contain aspect-video", className)} // aspect-video para proporção 16:9 por padrão, ajuste se necessário
          title={alt} // Usa alt como title para o elemento video (tooltip)
          {...restVideoProps}
        >
          {children} {/* Para <source> ou <track> tags */}
          Seu navegador não suporta a tag de vídeo. Considere <a href={src} download className="underline">baixar o vídeo</a>.
        </video>
      </div>
      {caption && (
        <figcaption className="mt-2 text-sm text-center text-muted-foreground italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

export const DocVideo = memo(DocVideoComponent);
DocVideo.displayName = "DocVideo";