import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para obter as iniciais do nome de usuário
export function getInitials(username: string): string {
  if (!username) return "";
  return username
    .split(".")
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

// Função para formatar o nome de usuário
export function formatUsername(username: string): string {
  if (!username) return "";
  return username
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 */
export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
  }).format(value)

