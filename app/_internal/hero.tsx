"use client";

import { getCurrentUsername } from "utils";
import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "ui";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Componente Hero
 *
 * @description
 * Renderiza a seção principal da página com um título chamativo, descrição e botões de ação.
 * Inclui detecção de dispositivo móvel para ajustar o tamanho dos botões e uma animação indicativa
 * de rolagem. O texto é animado para criar impacto visual na chegada do usuário.
 *
 * @remarks
 * - Usa Framer Motion para animações suaves
 * - Ajusta dinamicamente para mobile com useEffect
 * - Mostra botões diferentes dependendo se o usuário está logado
 * - Inclui indicador animado de scroll
 *
 * @example
 * ```tsx
 * import { Hero } from '@/components/hero';
 *
 * export default function HomePage() {
 *   return <Hero />;
 * }
 * ```
 *
 * @returns {React.ReactElement} Seção inicial com título, descrição, botões e indicador de scroll
 */

export function Hero() {
  const [username, setUsername] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar dispositivo móvel
  useEffect(() => {
    const nome = getCurrentUsername();
    setUsername(nome || null); // trata string vazia ou null como não logado
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative w-full overflow-hidden ">
      <div className=" mx-auto flex min-h-[90vh] w-full max-w-none flex-col items-center justify-center space-y-8 px-4 py-16 text-center sm:px-6 md:px-8 lg:px-10">
        {/* Título com efeito de texto animado */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="z-50 relative bg-clip-text text-transparent pb-3 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent blur-xl opacity-30">
              Todas as Ferramentas
              <br className="hidden sm:block" />
              Em um só Lugar
            </span>
            <span className="relative bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              Todas as Ferramentas
              <br />
              Em um só Lugar
            </span>
          </h1>
          <motion.p
            className="mx-auto max-w-[45rem] leading-normal text-muted-foreground sm:text-lg sm:leading-8 md:text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            Simplifique seu dia a dia com a plataforma centralizada do Grupo
            Rodoparaná. Gerencie prenotas, controle operações e acesse
            documentação essencial — tudo com apenas alguns cliques.
          </motion.p>
        </motion.div>

        {/* Botões com layout responsivo */}
        <motion.div
          className="flex flex-col gap-4 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link href="/documentacao" passHref legacyBehavior>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto"
            >
              <Button
                size={isMobile ? "default" : "lg"}
                className="w-full sm:w-auto"
              >
                <span className="flex items-center">
                  Ler Documentação <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </motion.a>
          </Link>

          {username ? (
            <Link href="/dashboard" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size={isMobile ? "default" : "lg"}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <span className="flex items-center">
                    Acessar Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </motion.a>
            </Link>
          ) : (
            <Link href="/login" passHref legacyBehavior>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full sm:w-auto"
              >
                <Button
                  size={isMobile ? "default" : "lg"}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  <span className="flex items-center">
                    Fazer Login <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </Button>
              </motion.a>
            </Link>
          )}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{
            opacity: { delay: 1, duration: 1 },
            y: { delay: 1, duration: 1.5, repeat: Number.POSITIVE_INFINITY },
          }}
        >
          <div className="flex flex-col items-center">
            <span className="text-sm text-muted-foreground mb-2">
              Rolar para baixo
            </span>
            <div className="h-10 w-6 rounded-full border-2 border-muted-foreground flex justify-center">
              <motion.div
                className="h-2 w-2 rounded-full bg-muted-foreground mt-1"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
