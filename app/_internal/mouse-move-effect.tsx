"use client";

import { useEffect, useState } from "react";
/**
 * Componente MouseMoveEffect
 *
 * @description
 * Cria um efeito visual de foco dinâmico que segue o cursor do mouse na tela,
 * utilizando um gradiente radial suave. Este efeito é puramente visual e não-interativo.
 *
 * @remarks
 * - Usa `window.addEventListener` para escutar o movimento do mouse
 * - Atualiza o estado com a posição atual do cursor
 * - O efeito é posicionado fixamente e não interfere em interações
 *
 * @example
 * ```tsx
 * import { MouseMoveEffect } from '@/components/MouseMoveEffect';
 *
 * export default function Page() {
 *   return (
 *     <div>
 *       <MouseMoveEffect />
 *       <main>Conteúdo principal</main>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {React.ReactElement} Um elemento visual fixo com efeito de luz baseado na posição do mouse
 */

export function MouseMoveEffect() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{
        background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
      }}
    />
  );
}
