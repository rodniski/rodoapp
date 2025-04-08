"use client"

import { useState } from "react"
import { motion } from "motion/react"
import Link from "next/link"
import { Button } from "ui"
import { useRouter } from "next/navigation"
import { Home, ArrowLeft, RefreshCw } from "lucide-react"

export default function NotFound() {
  const router = useRouter()
  const [isHovering, setIsHovering] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)

  const handleNumberClick = () => {
    setClickCount((prev) => prev + 1)
    setIsSpinning(true)
    setTimeout(() => setIsSpinning(false), 500)
  }

  const getReaction = () => {
    if (clickCount === 0) return null
    if (clickCount < 3) return "Ops, página não encontrada!"
    if (clickCount < 6) return "Continua procurando... mas não aqui!"
    if (clickCount < 10) return "Talvez você deveria tentar outro lugar?"
    return "Ok, você realmente gosta de clicar nesses números, né?"
  }

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-950 flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full text-center space-y-4 px-4">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-7xl">
            <motion.span
              initial={{ scale: 1 }}
              animate={isSpinning ? { rotate: 360 } : { rotate: 0 }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleNumberClick}
              className="inline-block cursor-pointer"
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
              className="inline-block cursor-pointer"
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
              className="inline-block cursor-pointer"
              transition={{ duration: 0.5 }}
            >
              4
            </motion.span>
          </h1>

          {getReaction() && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-muted-foreground italic"
            >
              {getReaction()}
            </motion.p>
          )}

          <motion.h2
            className="text-2xl font-bold mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Página não encontrada
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="relative"
        >
          <motion.div
            className="w-64 h-64 mx-auto relative"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 3,
              ease: "easeInOut",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <motion.circle
                cx="100"
                cy="100"
                r="70"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path
                d="M70,80 Q100,120 130,80 M70,120 Q85,140 100,120 Q115,140 130,120"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{
                  pathLength: 1,
                  d: isHovering
                    ? "M70,70 Q100,110 130,70 M70,130 Q85,100 100,130 Q115,100 130,130"
                    : "M70,80 Q100,120 130,80 M70,120 Q85,140 100,120 Q115,140 130,120",
                }}
                transition={{ duration: 1, ease: "easeInOut" }}
              />
            </svg>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-muted-foreground max-w-md mx-auto text-sm"
        >
          A página que você está procurando não existe ou foi movida para outro endereço.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex flex-wrap gap-3 justify-center"
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
        className="absolute bottom-0 left-0 right-0 h-1"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
      >
        <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
      </motion.div>
    </div>
  )
}
