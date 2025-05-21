// _core/components/aceternity/GlowingEffect/GlowingEffect.logic.ts
"use client";

import { useCallback, useEffect, useRef } from "react";
import { animate } from "motion/react";
import type { GlowingEffectProps } from "./GlowingEffect.config";

/**
 * @interface UseGlowingEffectParams
 * @description Parâmetros para o hook `useGlowingEffect`.
 * Seleciona apenas as props necessárias para a lógica de comportamento.
 */
type UseGlowingEffectParams = Pick<
  Required<GlowingEffectProps>, // Usa Required para garantir que os defaults foram aplicados
  "inactiveZone" | "proximity" | "movementDuration" | "disabled"
>;

/**
 * @hook useGlowingEffect
 * @description Encapsula a lógica de comportamento para o efeito de brilho dinâmico,
 * incluindo manipulação de eventos do mouse, scroll e animações.
 *
 * @param {UseGlowingEffectParams} params - Parâmetros que controlam o comportamento do efeito.
 * @returns {{ containerRef: React.RefObject<HTMLDivElement> }} - Um objeto contendo o ref para o contêiner do efeito.
 */
export const useGlowingEffect = ({
  inactiveZone,
  proximity,
  movementDuration,
  disabled,
}: UseGlowingEffectParams) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPosition = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>(0);

  const handleMove = useCallback(
    (e?: MouseEvent | { x: number; y: number }) => {
      if (!containerRef.current) return;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const element = containerRef.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const mouseX = e?.x ?? lastPosition.current.x;
        const mouseY = e?.y ?? lastPosition.current.y;

        if (e && "x" in e && "y" in e) {
          lastPosition.current = { x: e.x, y: e.y };
        }

        const centerX = rect.left + rect.width * 0.5;
        const centerY = rect.top + rect.height * 0.5;
        const distanceFromCenter = Math.hypot(
          mouseX - centerX,
          mouseY - centerY
        );
        const inactiveRadius =
          Math.min(rect.width, rect.height) * 0.5 * inactiveZone;

        if (distanceFromCenter < inactiveRadius) {
          element.style.setProperty("--active", "0");
          return;
        }

        const isActive =
          mouseX > rect.left - proximity &&
          mouseX < rect.left + rect.width + proximity &&
          mouseY > rect.top - proximity &&
          mouseY < rect.top + rect.height + proximity;

        element.style.setProperty("--active", isActive ? "1" : "0");

        if (!isActive) return;

        const currentAngle =
          parseFloat(element.style.getPropertyValue("--start")) || 0;
        let targetAngle =
          (Math.atan2(mouseY - centerY, mouseX - centerX) * 180) / Math.PI + 90;
        const angleDiff = ((targetAngle - currentAngle + 180) % 360) - 180;
        const newAngle = currentAngle + angleDiff;

        animate(currentAngle, newAngle, {
          duration: movementDuration,
          ease: [0.16, 1, 0.3, 1],
          onUpdate: (value) => {
            element.style.setProperty("--start", String(value));
          },
        });
      });
    },
    [inactiveZone, proximity, movementDuration] // containerRef, lastPosition, animationFrameRef são refs, não precisam estar aqui.
  );

  useEffect(() => {
    // Se o efeito estiver desabilitado, garante que tudo seja parado e limpo.
    if (disabled) {
      if (containerRef.current) {
        containerRef.current.style.setProperty("--active", "0");
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      // Não registra listeners se desabilitado.
      return;
    }

    const handleScrollEvent = () => handleMove(); // Reavalia no scroll, usando a última posição do mouse.
    const handlePointerMoveEvent = (event: PointerEvent) => handleMove(event);

    window.addEventListener("scroll", handleScrollEvent, { passive: true });
    document.body.addEventListener("pointermove", handlePointerMoveEvent, {
      passive: true,
    });

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("scroll", handleScrollEvent);
      document.body.removeEventListener("pointermove", handlePointerMoveEvent);
      if (containerRef.current) {
        // Reseta o estado visual ao desmontar ou desabilitar.
        containerRef.current.style.setProperty("--active", "0");
      }
    };
  }, [handleMove, disabled]); // Re-executa o efeito se a função handleMove ou o estado 'disabled' mudar.

  return { containerRef };
};
