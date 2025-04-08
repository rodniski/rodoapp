/**
 * @file utils.ts
 * @module Utils
 * @description Funções utilitárias compartilhadas no projeto.
 */

import {type ClassValue, clsx} from "clsx"
import {twMerge} from "tailwind-merge"

/**
 * @function cn
 * @description Combina classes CSS de forma eficiente, utilizando clsx e tailwind-merge.
 * @param {...ClassValue[]} inputs - Lista de classes CSS.
 * @returns {string} Classes CSS combinadas.
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Formata um valor numérico para moeda brasileira (BRL)
 */
export const formatCurrency = (value: number): string =>
    new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(value)

/**
 * @function formatUsername
 * @description Transforma um username no formato "nome.sobrenome" para "Nome Sobrenome".
 * @param {string} username - O username no formato "nome.sobrenome".
 * @returns {string} O username formatado como "Nome Sobrenome".
 */
export const formatUsername = (username: string): string =>
    username
        .split('.')
        .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
        .join(' ')

export const getInitials = (username: string): string =>
    username
        .split('.')
        .map(part => part.charAt(0).toUpperCase())
        .join('');
