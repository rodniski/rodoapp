// src/utils/cn.ts (ou _core/utils/cn.ts)
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina classes CSS com TailwindCSS Merge */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}