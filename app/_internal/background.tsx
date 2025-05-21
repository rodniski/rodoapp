"use client";

import { type FC, ReactElement } from "react";
import { motion, useScroll, useTransform } from "motion/react";

/**
 * Configuration interface for parallax elements
 * @interface ParallaxConfig
 * @property {number} scrollRange - The maximum scroll range to consider for the transformation
 * @property {number} startValue - The initial value of the transformation
 * @property {number} endValue - The final value of the transformation
 */
interface ParallaxConfig {
  scrollRange: number;
  startValue: number;
  endValue: number;
}

/**
 * Configuration for a blob element
 * @interface BlobConfig
 * @extends {ParallaxConfig}
 * @property {string} position - CSS positioning classes
 * @property {string} size - Size classes for the blob
 * @property {string} color - Color and opacity classes
 */
interface BlobConfig extends ParallaxConfig {
  position: string;
  size: string;
  color: string;
}

/**
 * Configuration for a glow element
 * @interface GlowConfig
 * @extends {ParallaxConfig}
 * @property {string} position - CSS positioning classes
 * @property {string} size - Size classes for the glow
 * @property {string} colors - Gradient color classes
 * @property {string} clipPath - SVG clip path for the shape
 * @property {ParallaxConfig} [rotate] - Optional rotation configuration
 */
interface GlowConfig extends ParallaxConfig {
  position: string;
  size: string;
  colors: string;
  clipPath: string;
  rotate?: ParallaxConfig;
}

/**
 * Componente LPBackground
 *
 * @description
 * Um componente de fundo animado e responsivo que cria um efeito de paralaxe dinâmico
 * com blobs e brilhos coloridos que se movem em velocidades diferentes ao rolar a página.
 * Este componente é fixado à viewport e serve como fundo decorativo.
 *
 * @remarks
 * - Utiliza Framer Motion para animações suaves e efeitos de paralaxe
 * - Otimizado para performance com transformações via GPU (transform-gpu)
 * - Totalmente responsivo com classes do TailwindCSS
 * - Cria profundidade através de diferentes velocidades de paralaxe
 * - Todos os elementos são não-interativos (pointer-events-none)
 *
 * @example
 * ```tsx
 * import { LPBackground } from '@/components/lp-background';
 *
 * export default function HomePage() {
 *   return (
 *     <div className="relative min-h-screen">
 *       <LPBackground />
 *       <main className="relative z-10">
 *       </main>
 *     </div>
 *   );
 * }
 * ```
 *
 * @returns {React.ReactElement} Um fundo com posição fixa e elementos animados
 */

export const LPBackground: FC = (): ReactElement => {
  /**
   * Hook to track vertical scroll position
   * @type {Object} scrollData - Object containing scroll information
   * @property {MotionValue<number>} scrollY - Motion value tracking vertical scroll position
   */
  const { scrollY } = useScroll();

  // Blob configurations
  const blobConfigs: BlobConfig[] = [
    {
      position: "absolute -right-70 -top-70 qhd:-right-50 qhd:-top-50",
      size: "size-[700px] qhd:size-[900px]",
      color:
        "dark:bg-blue-400/20 bg-blue-400/20 rounded-full blur-[500px] opacity-50",
      scrollRange: 1000,
      startValue: 0,
      endValue: -150,
    },
    {
      position: "absolute -bottom-70 -left-70 qhd:-bottom-50 qhd:-left-50",
      size: "size-[700px] qhd:size-[900px]",
      color:
        "dark:bg-violet-400/20 bg-violet-400/20 rounded-full blur-[500px] opacity-50",
      scrollRange: 1000,
      startValue: 0,
      endValue: 100,
    },
  ];

  // Glow configurations
  const glowConfigs: GlowConfig[] = [
    {
      position: "absolute -top-40 sm:-top-80",
      size: "relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]",
      colors: "bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30",
      clipPath:
        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
      scrollRange: 1000,
      startValue: 0,
      endValue: -200,
    },
    {
      position: "absolute bottom-0",
      size: "relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]",
      colors: "bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30",
      clipPath:
        "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
      scrollRange: 1000,
      startValue: 0,
      endValue: 150,
    },
    {
      position: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
      size: "aspect-[1155/678] w-[30rem] sm:w-[50rem]",
      colors: "bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] opacity-20",
      clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
      scrollRange: 1000,
      startValue: 0,
      endValue: 50,
      rotate: {
        scrollRange: 1000,
        startValue: 10,
        endValue: 30,
      },
    },
  ];

  // Create motion values for each blob and glow
  const blobMotionValues = blobConfigs.map((config) =>
    useTransform(
      scrollY,
      [0, config.scrollRange],
      [config.startValue, config.endValue]
    )
  );

  const glowMotionValues = glowConfigs.map((config) => ({
    y: useTransform(
      scrollY,
      [0, config.scrollRange],
      [config.startValue, config.endValue]
    ),
    rotate: config.rotate,
  }));

  const glowRotations = glowConfigs.map((config) =>
    config.rotate
      ? useTransform(
          scrollY,
          [0, config.rotate.scrollRange],
          [config.rotate.startValue, config.rotate.endValue]
        )
      : undefined
  );

  return (
    <div className="pointer-events-none fixed inset-0">
      {/* Render blobs with parallax effect */}
      {blobConfigs.map((config, index) => (
        <motion.div
          key={`blob-${index}`}
          className={`${config.position} ${config.size} ${config.color}`}
          style={{ y: blobMotionValues[index] }}
          aria-hidden="true"
        />
      ))}

      {/* Container for glow effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Render glows with parallax effect */}
        {glowConfigs.map((config, index) => (
          <motion.div
            key={`glow-${index}`}
            className={`${config.position} transform-gpu overflow-hidden blur-3xl`}
            style={{
              y: glowMotionValues[index].y,
              rotate: glowRotations[index],
            }}
            aria-hidden="true"
          >
            <div
              className={`${config.size} ${config.colors}`}
              style={{
                clipPath: config.clipPath,
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
