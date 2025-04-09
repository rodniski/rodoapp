"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { Button } from "ui"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function NotFound() {
  const router = useRouter()
  const [isSpinning, setIsSpinning] = useState(false)

  const handleNumberClick = () => {
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 500)
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-950 flex items-center justify-center">
      <div className="max-w-[90vw] w-full max-h-[90vh] text-center flex flex-col items-center justify-center gap-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-[100pt] select-none relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-400 via-slate-100 to-slate-400 dark:from-slate-600 dark:via-slate-300 dark:to-slate-600 opacity-20 blur-xl" />
            <motion.span
              initial={{ scale: 1 }}
              animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNumberClick}
              className="inline-block cursor-pointer bg-gradient-to-r from-slate-400 via-slate-200 to-slate-300 dark:from-slate-600 dark:via-slate-400 dark:to-slate-500 bg-clip-text text-transparent"
              transition={{ duration: 0.5 }}
            >
              4
            </motion.span>
            <motion.span
              initial={{ scale: 1 }}
              animate={isSpinning ? { rotate: 360, scale: [1, 1.2, 1] } : { rotate: 0 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNumberClick}
              className="inline-block cursor-pointer bg-gradient-to-r from-slate-300 via-slate-100 to-slate-300 dark:from-slate-500 dark:via-slate-300 dark:to-slate-500 bg-clip-text text-transparent"
              transition={{ duration: 0.5 }}
            >
              0
            </motion.span>
            <motion.span
              initial={{ scale: 1 }}
              animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNumberClick}
              className="inline-block cursor-pointer bg-gradient-to-r from-slate-300 via-slate-200 to-slate-400 dark:from-slate-500 dark:via-slate-400 dark:to-slate-600 bg-clip-text text-transparent"
              transition={{ duration: 0.5 }}
            >
              4
            </motion.span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="relative size-64"
        >
          <motion.div
            className="w-full h-full"
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <Image src="/logo/logo.svg" alt="Logo" width={200} height={200} className="w-full h-full object-contain dark:invert select-none"/>
          </motion.div>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-muted-foreground text-sm max-w-md mx-auto"
          >
            A página que você está procurando não existe ou foi movida.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 justify-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button onClick={() => router.back()} variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button asChild size="sm">
              <Link href="/" className="gap-2">
                <Home className="h-4 w-4" />
                Página Inicial
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </motion.div>
    </div>
  )
}
