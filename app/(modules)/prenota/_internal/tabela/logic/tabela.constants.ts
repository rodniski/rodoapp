// app/(modules)/prenota/_components/tabela/logic/tabela.constants.ts

/**
 * @file Contém constantes relacionadas à feature Tabela de Pré-notas.
 * Isso inclui endpoints de API e fábricas de chaves para TanStack Query.
 */

//* Endpoint da API para pré-notas
export const PRENOTAS_API_ENDPOINT = "/api/prenotas";

//* Fábrica de Chaves para TanStack Query (para consistência e facilidade de invalidação)
// Permite criar chaves de query de forma padronizada e tipada.
export const prenotaQueryKeys = {
  /** Chave base para todas as queries relacionadas a pré-notas. */
  all: ['prenotas'] as const,

  /**
   * Chaves para listagens paginadas/filtradas de pré-notas.
   * @param params Parâmetros da API (incluindo filtros) que afetam a listagem.
   */
  list: (params?: FetchPrenotasApiParams) => // Marcar params como opcional se pode ser chamado sem
    [...prenotaQueryKeys.all, 'list', params ?? {}] as const, // Usar objeto vazio se params for undefined
};

// Importar FetchPrenotasApiParams para uso na fábrica de chaves
import type { FetchPrenotasApiParams } from './tabela.types';