"use client";

import { ScrollArea } from "ui";
import { Hero, Features, CTA, Footer, LPBackground } from "./_internal";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

/**
 * Página principal do Hub Intranet
 *
 * @description
 * Renderiza a estrutura principal da landing page com fundo animado, seções de destaque
 * (Hero, Features, CTA) e rodapé. Utiliza efeitos visuais com `motion` e observação de
 * elementos em viewport via `useInView`.
 *
 * @remarks
 * - Inclui efeito visual de fundo com o componente LPBackground
 * - As seções Features e CTA são animadas com entrada baseada em visibilidade
 * - Usa ScrollArea para permitir rolagem suave ocupando a viewport inteira
 *
 * @returns {React.ReactElement} Página inicial com layout completo e animações de entrada
 */

export default function Home(): React.ReactElement {
  const featuresRef = useRef(null);
  const ctaRef = useRef(null);

  // O hook useInView retorna true quando o elemento referenciado está na viewport
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const isCtaInView = useInView(ctaRef, { once: true, amount: 0.2 });

  const animationVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const transitionSettings = { duration: 0.8, ease: "easeOut" };

  return (
    <ScrollArea className="relative h-screen w-screen overflow-hidden">
      {/* Background base */}
      <div className="absolute inset-0 z-0">
        <LPBackground />
      </div>

      {/* Efeitos de brilho que se estendem por toda a página */}

      <div className="relative z-10 flex w-full flex-col items-center justify-center">
        <Hero />
        <motion.div
          ref={featuresRef}
          className="w-full py-12"
          initial="hidden"
          animate={isFeaturesInView ? "visible" : "hidden"}
          variants={animationVariants}
          transition={transitionSettings}
        >
          <Features />
        </motion.div>
        <motion.div
          ref={ctaRef}
          className="w-full flex justify-center items-center"
          initial="hidden"
          animate={isCtaInView ? "visible" : "hidden"}
          variants={animationVariants}
          transition={transitionSettings}
        >
          <CTA />
        </motion.div>

        <Footer />
      </div>
    </ScrollArea>
  );
}
