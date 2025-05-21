"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { Button } from "ui";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft } from "lucide-react";
import Image from "next/image";
import {Logo} from "ui";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-[calc(100vh-50px)] overflow-hidden flex-col items-center justify-center bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-950">
      {/* Barra animada no rodapé */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-500"></div>
      </motion.div>

      {/* Conteúdo centralizado */}
      <div className="z-50 flex w-full max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="relative select-none text-4xl font-extrabold tracking-tight lg:text-[200pt]">
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="inline-block cursor-pointer bg-sky-500 bg-clip-text text-transparent"
            >
              4
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="inline-block cursor-pointer bg-sky-500 bg-clip-text text-transparent"
            >
              0
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.2 }}
              className="inline-block cursor-pointer bg-sky-500 bg-clip-text text-transparent"
            >
              4
            </motion.span>
          </h1>
        </motion.div>

        <div className="space-y-2">
          <motion.h2
            className="text-xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Página não encontrada
          </motion.h2>
          <motion.p
            className="mx-auto max-w-md text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            A página que você está procurando não existe ou foi movida.
          </motion.p>
        </div>

        <motion.div
          className="flex justify-center gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="gap-2 shadow-md"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button asChild size="sm" className="shadow-md">
              <Link href="/" className="gap-2">
                <Home className="h-4 w-4" />
                Página Inicial
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <Logo
        className="z-0 absolute size-350 -top-60 -right-65 opacity-5"
        color="var(--foreground)"
      />
    </div>
  );
}
