// _core/components/aceternity/GlowingEffect/GlowingEffect.tsx
"use client";

import { memo } from "react";
import { cn } from "utils";
import type { GlowingEffectProps } from "./GlowingEffect.config";
import { defaultGlowingEffectProps } from "./GlowingEffect.config";
import { useGlowingEffect } from "./GlowingEffect.logic";

/**
 * @component GlowingEffectComponent
 * @description Componente de apresentação (View) para o efeito de brilho.
 * Utiliza o hook `useGlowingEffect` para a lógica de comportamento.
 * @param {GlowingEffectProps} props - As propriedades do componente.
 */
const GlowingEffectComponent = (props: GlowingEffectProps) => {
  // Combina as props recebidas com os valores padrão.
  const mergedProps = { ...defaultGlowingEffectProps, ...props };
  const {
    blur,
    spread,
    variant,
    glow,
    className,
    disabled,
    movementDuration,
    borderWidth,
    inactiveZone, // Passado para o hook
    proximity, // Passado para o hook
  } = mergedProps;

  // Obtém o ref do contêiner e a lógica de manipulação do hook.
  const { containerRef } = useGlowingEffect({
    disabled,
    inactiveZone,
    proximity,
    movementDuration,
  });

  //! Estrutura de Divs para o Efeito Visual:
  //  Div 1: Borda estática/glow fixo (controlado por `glow` e `variant`).
  //  Div 2: Efeito dinâmico principal (gradiente cônico animado).
  return (
    <>
      {/* Div para a borda/glow mais estático */}
      <div
        className={cn(
          "pointer-events-none absolute -inset-px hidden rounded-[inherit] border opacity-0 transition-opacity duration-300",
          glow && "opacity-100",
          variant === "white" && "border-white",
          disabled && "!block" // Se desabilitado, esta div se torna 'block'.
        )}
        style={{
          // Garante que a largura da borda CSS var seja aplicada.
          // Usando CSS var aqui permite que o CSS interno do componente use esta variável.
          // Se não houver CSS interno usando esta var, poderia ser aplicado diretamente.
          ["--glowingeffect-actual-border-width" as any]: `${borderWidth}px`,
          borderWidth: `var(--glowingeffect-actual-border-width)`,
        }}
      />
      {/* Div para o efeito de brilho dinâmico principal */}
      <div
        ref={containerRef}
        style={
          {
            "--blur": `${blur}px`,
            "--spread": String(spread),
            "--start": "0", // Ângulo inicial, controlado pelo JS
            "--active": "0", // Ativação do brilho, controlado pelo JS
            "--glowingeffect-border-width": `${borderWidth}px`, // Usado pelo CSS interno do efeito
            "--repeating-conic-gradient-times": "5",
            // --- Gradiente para o efeito de brilho ---
            // Este gradiente é auto-contido aqui para portabilidade.
            // Poderia ser movido para CSS se houver temas complexos.
            "--gradient": `
              radial-gradient(circle, oklch(0.58 0.12 260) 10%, oklch(0.58 0.12 260 / 0) 20%),
              radial-gradient(circle at 40% 40%, oklch(0.65 0.14 275) 5%, oklch(0.65 0.14 275 / 0) 15%),
              radial-gradient(circle at 60% 60%, oklch(0.50 0.12 260) 10%, oklch(0.50 0.12 260 / 0) 20%),
              radial-gradient(circle at 40% 60%, oklch(0.62 0.14 275) 10%, oklch(0.62 0.14 275 / 0) 20%),
              repeating-conic-gradient(
                from 236.84deg at 50% 50%,
                oklch(0.58 0.12 260) 0%,
                oklch(0.65 0.14 275) calc(25% / var(--repeating-conic-gradient-times)),
                oklch(0.50 0.12 260) calc(50% / var(--repeating-conic-gradient-times)),
                oklch(0.62 0.14 275) calc(75% / var(--repeating-conic-gradient-times)),
                oklch(0.58 0.12 260) calc(100% / var(--repeating-conic-gradient-times))
              )
            `,
          } as React.CSSProperties
        }
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-opacity duration-300",
          glow && "opacity-100", // Mantém opacidade se 'glow'
          blur > 0 && `blur-[var(--blur)]`,
          className, // Classes customizadas
          disabled && "!hidden" // Esconde o efeito dinâmico se desabilitado
        )}
      >
        {/* Elemento interno que renderiza o brilho usando máscaras e o gradiente */}
        <div
          className={cn(
            "glow",
            "rounded-[inherit]",
            'after:content-[""] after:rounded-[inherit] after:absolute after:inset-[calc(-1*var(--glowingeffect-border-width))]',
            "after:[border:var(--glowingeffect-border-width)_solid_transparent]",
            "after:[background:var(--gradient)] after:[background-attachment:fixed]",
            "after:opacity-[var(--active)] after:transition-opacity after:duration-300",
            "after:[mask-clip:padding-box,border-box]",
            "after:[mask-composite:intersect]",
            "after:[mask-image:linear-gradient(#0000,#0000),conic-gradient(from_calc((var(--start)-var(--spread))*1deg),#00000000_0deg,#fff,#00000000_calc(var(--spread)*2deg))]"
          )}
        />
      </div>
    </>
  );
};

/**
 * @component GlowingEffect
 * @description Componente memoizado que aplica um efeito de brilho dinâmico e interativo
 * em resposta ao movimento do mouse, ideal para destacar elementos da interface.
 *
 * @example
 * <div className="relative w-64 h-32 rounded-xl bg-slate-800 p-px">
 * <GlowingEffect className="rounded-xl" disabled={false} glow={true} />
 * <div className="relative z-10 flex items-center justify-center h-full text-white">
 * Conteúdo Interno
 * </div>
 * </div>
 */
export const GlowingEffect = memo(GlowingEffectComponent);
GlowingEffect.displayName = "GlowingEffect"; // Facilita a depuração no React DevTools
