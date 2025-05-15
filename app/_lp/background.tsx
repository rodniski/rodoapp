"use client";
import { motion, useScroll, useTransform } from "framer-motion";

export function Background() {
  // Usando useScroll para rastrear a posição de rolagem
  const { scrollY } = useScroll();

  // Transformando a posição de rolagem em valores para as transformações
  // Cada elemento terá uma velocidade diferente para criar profundidade
  const topBlobY = useTransform(scrollY, [0, 1000], [0, -150]);
  const bottomBlobY = useTransform(scrollY, [0, 1000], [0, 100]);
  const topGlowY = useTransform(scrollY, [0, 1000], [0, -200]);
  const bottomGlowY = useTransform(scrollY, [0, 1000], [0, 150]);
  const centerGlowY = useTransform(scrollY, [0, 1000], [0, 50]);
  const centerGlowRotate = useTransform(scrollY, [0, 1000], [10, 30]);

  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/90 to-background" />

      {/* Blob superior com efeito de paralaxe */}
      <motion.div
        className="absolute -right-70 -top-70 size-[700px] qhd:-right-50 qhd:-top-50 qhd:size-[900px] dark:bg-blue-400/20 bg-blue-400/20 rounded-full blur-[500px] opacity-50"
        style={{ y: topBlobY }}
      />

      {/* Blob inferior com efeito de paralaxe */}
      <motion.div
        className="absolute -bottom-70 -left-70 size-[700px] qhd:-bottom-50 qhd:-left-50 qhd:size-[900px] dark:bg-violet-400/20 bg-violet-400/20 rounded-full blur-[500px] opacity-50"
        style={{ y: bottomBlobY }}
      />

      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Efeito de brilho superior com paralaxe */}
        <motion.div
          className="absolute -top-40 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          aria-hidden="true"
          style={{ y: topGlowY }}
        >
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </motion.div>

        {/* Efeito de brilho inferior com paralaxe */}
        <motion.div
          className="absolute bottom-0 transform-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
          style={{ y: bottomGlowY }}
        >
          <div
            className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
          />
        </motion.div>

        {/* Efeito de brilho central com paralaxe e rotação */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform-gpu overflow-hidden blur-3xl"
          aria-hidden="true"
          style={{
            y: centerGlowY,
            rotate: centerGlowRotate,
          }}
        >
          <div
            className="aspect-[1155/678] w-[30rem] rotate-[10deg] bg-gradient-to-tr from-[#8b5cf6] to-[#3b82f6] opacity-20 sm:w-[50rem]"
            style={{
              clipPath:
                "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
