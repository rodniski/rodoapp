// _core/components/aceternity/ShimmerButton/ShimmerButton.tsx
"use client";

import { memo } from "react";
import { motion } from "motion/react";
import { cn } from "utils"; // Presume-se que 'utils' é um alias para _core/utils

import type { ShimmerButtonProps } from "./ShimmerButton.config";
import { defaultShimmerButtonProps } from "./ShimmerButton.config";

/**
 * @component ShimmerButtonComponent
 * @description Lógica interna e renderização do ShimmerButton.
 * Este é o componente não memoizado. A exportação principal é memoizada.
 * @param {ShimmerButtonProps} props - As propriedades do componente.
 */
const ShimmerButtonComponent = (props: ShimmerButtonProps) => {
  // Combina as props recebidas com os valores padrão.
  // `children` é obrigatório e vem de `props`.
  // As demais props (`...rest`) são para o `motion.div`.
  const { children, className, ...restMotionProps } = {
    ...defaultShimmerButtonProps, // Aplica o default para className
    ...props, // Props do usuário (incluindo children e possivelmente className)
  };

  return (
    <motion.div
      className={cn(
        "relative inline-flex overflow-hidden rounded-lg p-[1px]", // Estilos base do contêiner
        className // Classes customizadas do usuário
      )}
      whileHover={{ scale: 1.05 }} // Efeito de hover do Framer Motion
      whileTap={{ scale: 0.95 }} // Efeito de tap do Framer Motion
      {...restMotionProps} // Espalha outras props (onClick, aria-*, etc.)
    >
      {/* //! Span para o efeito de brilho animado (shimmer) */}
      <span
        className={cn(
          "absolute inset-[-1000%]", // Faz o gradiente ser muito maior que o botão para o efeito de varredura
          "animate-[spin_2s_linear_infinite]", // Animação de giro do Tailwind
          "bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#38BDF8_50%,#E2E8F0_100%)]" // Gradiente cônico
        )}
        aria-hidden="true" // Esconde de leitores de tela, pois é decorativo
      />
      {/* Span para o conteúdo visível do botão */}
      <span
        className={cn(
          "inline-flex h-full w-full items-center justify-center rounded-lg", // Layout interno
          "cursor-pointer", // Feedback visual de clicável
          "bg-slate-950", // Cor de fundo
          "px-3 py-1 text-sm font-medium text-white", // Estilos de texto e padding
          "backdrop-blur-3xl" // Efeito de desfoque no fundo (se houver transparência)
        )}
      >
        {children}
      </span>
    </motion.div>
  );
};

/**
 * @component ShimmerButton
 * @description Um botão com um efeito de brilho animado (shimmer) na borda,
 * ideal para call-to-actions ou links destacados.
 * Utiliza Framer Motion para animações de interação.
 *
 * @example
 * <ShimmerButton onClick={() => console.log('Clicado!')} className="mt-4">
 * Clique Aqui
 * </ShimmerButton>
 */
export const ShimmerButton = memo(ShimmerButtonComponent);
ShimmerButton.displayName = "ShimmerButton";
