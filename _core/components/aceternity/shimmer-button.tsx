"use client"

import { motion } from "motion/react"
import type { ReactNode } from "react"

interface ShimmerButtonProps {
  children: ReactNode
  className?: string
  [key: string]: any
}

export const ShimmerButton = ({ children, className = "", ...props }: ShimmerButtonProps) => (
  <motion.div
    className={`relative inline-flex overflow-hidden rounded-lg p-[1px] ${className}`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    {...props}
  >
    <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2E8F0_0%,#38BDF8_50%,#E2E8F0_100%)]" />
    <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
      {children}
    </span>
  </motion.div>
)
