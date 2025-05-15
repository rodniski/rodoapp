// _core/components/theme/Background/Background.tsx
"use client"; //* Mantendo "use client" por precaução, caso haja planos de interatividade ou hooks futuros,
              //* mas este componente específico poderia ser um Server Component se não usar nada client-side.
              //* Para um background global aplicado no layout, "use client" pode não ser necessário
              //* se o layout raiz for um Server Component. Avalie o contexto de uso.
              //* Se for usado em um Client Component pai, ele será renderizado no cliente de qualquer forma.

import React, { memo } from "react";
import { cn } from "utils"; // Presume-se que 'utils' é um alias para _core/utils

import type { BackgroundProps } from "./Background.config";
import { defaultBackgroundProps } from "./Background.config";

/**
 * @component BackgroundComponent
 * @description Renderiza os elementos visuais de fundo da aplicação, incluindo gradientes e
 * efeitos de luz difusa. É um componente puramente presentacional.
 * @param {BackgroundProps} props - As propriedades do componente.
 */
const BackgroundComponent = (props: BackgroundProps) => {
  const { className } = { ...defaultBackgroundProps, ...props };

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-0 -z-50", // -z-50 para garantir que fique atrás de todo conteúdo
        className // Permite classes customizadas no contêiner raiz
      )}
      aria-hidden="true" // É um elemento puramente decorativo
    >
      {/* Camada de gradiente base para o fundo */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      {/* Efeito de luz difusa 1 (azul) */}
      {/* Posicionado fora da tela para criar um brilho suave nas bordas */}
      {/* qhd: prefixo para telas Quad HD ou breakpoint customizado */}
      <div
        className={cn(
          "absolute -right-70 -top-70 size-[700px]",
          "qhd:-right-50 qhd:-top-50 qhd:size-[900px]",
          "rounded-full blur-[500px] opacity-50",
          "bg-blue-400/20 dark:bg-blue-400/20" // A cor parece ser a mesma para light/dark aqui, ajuste se necessário
        )}
      />

      {/* Efeito de luz difusa 2 (violeta) */}
      <div
        className={cn(
          "absolute -bottom-70 -left-70 size-[700px]",
          "qhd:-bottom-50 qhd:-left-50 qhd:size-[900px]",
          "rounded-full blur-[500px] opacity-50",
          "bg-violet-400/20 dark:bg-violet-400/20" // A cor parece ser a mesma para light/dark aqui, ajuste se necessário
        )}
      />
    </div>
  );
};

/**
 * @component Background
 * @description Componente memoizado que fornece um fundo visual estilizado e fixo para a aplicação.
 * Inclui um gradiente suave e efeitos de luz difusa nas bordas da tela.
 *
 * @example
 * // Em um componente de Layout global:
 * export default function RootLayout({ children }: { children: React.ReactNode }) {
 * return (
 * <html lang="pt-BR">
 * <body>
 * <Background />
 * <main>{children}</main>
 * </body>
 * </html>
 * );
 * }
 */
export const Background = memo(BackgroundComponent);
Background.displayName = "Background";