// src/utils/formatters.ts (ou _core/utils/formatters.ts) - Padronizado

import { format, isValid, parse } from "date-fns";
import { ptBR } from "date-fns/locale";

/** Tipo para string de data no formato brasileiro */
export type BRDateString = `${number}/${number}/${number}`;

/**
 * Formata um CNPJ (string de 14 dígitos) para o padrão 00.000.000/0000-00.
 * Retorna string original se a entrada for inválida em tamanho após limpeza.
 * @param cnpj String contendo o CNPJ (pode ter ou não máscara).
 */
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return "";
  const cleaned = cnpj.replace(/\D/g, "");
  if (cleaned.length !== 14) {
    // console.warn(`[formatCNPJ] CNPJ inválido para formatação completa: ${cnpj}`);
    return cnpj; // Retorna original se tamanho incorreto
  }
  return cleaned.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

/**
 * Formata um valor numérico para moeda brasileira (BRL - R$).
 * Trata null/undefined como 0.
 * @param value Valor numérico.
 * @param minimumFractionDigits Mínimo de casas decimais (padrão 2).
 */
export function formatCurrency(
  value: number | null | undefined,
  minimumFractionDigits = 2
): string {
  const numValue = value ?? 0;
  return numValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: minimumFractionDigits,
  });
}

/**
 * Formata um número como percentual com casas decimais e símbolo '%'.
 * Trata null/undefined como 0.
 * @param value Valor numérico (ex: 95.5 para 95.50%).
 * @param decimals Número de casas decimais (padrão 2).
 */
export function formatPercentage(
  value: number | null | undefined,
  decimals = 2
): string {
  const numValue = value ?? 0;
  return `${numValue.toFixed(decimals)}%`; // Adiciona o símbolo %
}

/**
 * Converte string "dd/MM/yyyy" ou "dd/MM/yyyy HH:mm:ss" para objeto `Date`.
 * Retorna undefined se inválido.
 */
export function parseDateBR(
  dateStr: string | null | undefined
): Date | undefined {
  if (!dateStr?.trim()) return undefined;
  const dateOnly = dateStr.split(" ")[0]; // Pega apenas a parte da data
  const parsed = parse(dateOnly, "dd/MM/yyyy", new Date());
  return isValid(parsed) ? parsed : undefined;
}

/**
 * Converte objeto `Date` para string "dd/MM/yyyy". Retorna string vazia se inválido.
 */
export function formatDateBR(date: Date | null | undefined): BRDateString | "" {
  if (!date || !isValid(date)) return "";
  return format(date, "dd/MM/yyyy", { locale: ptBR }) as BRDateString;
}

/**
 * Normaliza string de data/hora (ex: "dd/MM/yyyy HH:mm:ss") para apenas "dd/MM/yyyy".
 * Retorna string vazia se a entrada for inválida.
 */
export function normalizeDateString(
  datetime: string | null | undefined
): BRDateString | "" {
  const parsed = parseDateBR(datetime); // Reutiliza a função que já trata isso
  return formatDateBR(parsed);
}

/**
 * Obtém as iniciais (máx 2) de um nome de usuário (separado por pontos).
 * Ex: "primeiro.segundo" -> "PS". Retorna "?" se inválido.
 */
export function getInitials(username: string | null | undefined): string {
  if (!username) return "?";
  return username
    .trim() // Remove espaços extras antes de dividir
    .split(".")
    .map((part) => part.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

/**
 * Formata um nome de usuário (separado por pontos) para capitalizado.
 * Ex: "primeiro.segundo" -> "Primeiro Segundo". Retorna string vazia se inválido.
 */
export function formatUsername(username: string | null | undefined): string {
  if (!username) return "";
  return username
    .trim() // Remove espaços extras
    .split(".")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()) // Garante lowercase no resto
    .join(" ");
}

/**
 * Remove caracteres não numéricos de uma string. Retorna string vazia se inválido.
 */
export function numbersOnly(value: string | null | undefined): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

/**
 * Converte um valor formatado como moeda ("R$ 1.234,56") para número.
 * Retorna 0 se inválido.
 */
export function parseCurrencyToNumber(
  value: string | null | undefined
): number {
  if (!value) return 0;
  const cleanedValue = value.replace(/[R$\s.]/g, "").replace(",", ".");
  const num = parseFloat(cleanedValue);
  return isNaN(num) ? 0 : num;
}

/**
 * Converte um valor (string formatada ou número) para número float,
 * tratando separadores e erros. Retorna 0 se inválido.
 * @param value Valor a ser convertido.
 * @returns O número float correspondente ou 0.
 */
export function parseFloatOrZero(
  value: string | number | null | undefined
): number {
  // <-- Mudado para export function
  if (typeof value === "number") return isNaN(value) ? 0 : value;
  if (typeof value === "string") {
    const cleanedValue = value.replace(/[R$\s.]/g, "").replace(",", ".");
    const parsed = parseFloat(cleanedValue);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

/**
 * Converte um valor (string formatada ou número) para número float,
 * tratando separadores e erros. Retorna NULL se inválido ou vazio.
 * @param value Valor a ser convertido.
 * @returns O número float correspondente ou null.
 */
export function parseFloatOrNull(
  value: string | number | null | undefined
): number | null {
  // <-- Mudado para export function
  if (typeof value === "number") return isNaN(value) ? null : value;
  if (typeof value === "string" && value.trim() !== "") {
    const cleanedValue = value.replace(/[R$\s.]/g, "").replace(",", ".");
    const parsed = parseFloat(cleanedValue);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}
