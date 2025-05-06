// Remova "use client" para usar Server Component por padrão
import { Button } from "ui";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="container flex min-h-[calc(100vh-3.5rem)] max-w-screen-2xl flex-col items-center justify-center space-y-8 py-24 text-center md:py-32">
      <div className="space-y-4">
        <h1 className="bg-gradient-to-br from-foreground from-30% via-foreground/90 to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent pb-3 sm:text-5xl md:text-6xl lg:text-7xl">
          Todas as Ferramentas
          <br />
          Em um só Lugar
        </h1>
        <p className="mx-auto max-w-[45rem] leading-normal text-muted-foreground qhd:text-2xl sm:leading-8">
          Simplifique seu dia a dia com a plataforma centralizada do Grupo
          Rodoparaná. Gerencie prenotas, controle operações e acesse
          documentação essencial — tudo com apenas alguns cliques.
        </p>
      </div>
      <motion.div
        className="flex gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link href="/login" target="_blank" rel="noopener noreferrer">
            <Button size="lg">
              Começar Agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </motion.div>
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut", delay: 1 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
          animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
      </motion.div>
    </section>
  );
}
