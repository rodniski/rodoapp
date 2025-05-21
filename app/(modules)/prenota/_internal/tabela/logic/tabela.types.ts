// app/(modules)/prenota/_components/tabela/logic/tabela.types.ts

/* ─────────────────────────────  tabela.types.ts  ───────────────────────────
 * Tipos-base usados na lógica da feature Tabela de Pré-notas.
 * Define os contratos de dados para interações com a API,
 * parâmetros de hooks e a estrutura das entidades de dados.
 * ───────────────────────────────────────────────────────────────────────────*/

/* ╔══════════════════════════════════════════════╗
    ║ 1 ▸ ENTIDADE PRINCIPAL (LINHA DA TABELA)     ║
    ╚══════════════════════════════════════════════╝ */

/**
 * @description Representa uma pré-nota individual, conforme retornado pela API e usado na tabela.
 */ /* Detalha os campos de uma pré-nota, incluindo metadados e informações do fornecedor.
 * As referências como SF1.R_E_C_N_O_ indicam a origem dos campos no sistema Protheus.
 */
export interface PrenotaRow {
  // --- Identificação principal ---
  REC: number; // SF1.R_E_C_N_O_
  F1_FILIAL: string; // SF1.F1_FILIAL
  F1_DOC: string; // SF1.F1_DOC
  F1_SERIE: string; // SF1.F1_SERIE

  // --- Metadados / status ---
  F1_STATUS: string; // SF1.F1_STATUS (cru)
  Status: string; // Status consolidado calculado no backend

  // --- Datas --- (formato yyyymmdd)
  F1_EMISSAO: string; // SF1.F1_EMISSAO
  F1_DTDIGIT: string; // SF1.F1_DTDIGIT
  VENCIMENTO: string; // Z10.Z10_VENCTO

  // --- Valores ---
  F1_VALBRUT: number; // SUM(SD1.D1_TOTAL)

  // --- Fornecedor ---
  A2_COD: string; // SA2.A2_COD
  A2_LOJA: string; // SA2.A2_LOJA
  A2_NOME: string; // SA2.A2_NOME

  // --- Campos auxiliares ---
  F4_TRANFIL: string; // SF4.F4_TRANFIL  (transferência)
  F1_XTIPO: string; // Tipo da NF
  F1_XPRIOR: string; // Prioridade
  F1_XORI: string; // Origem
  F1_XUSRRA: string; // Responsável revisão
  F1_XOBS: string; // Observação geral
  F1_ZOBSREV: string; // Observ. de revisão
  F1_XREV: string; // Flag de revisão
  USUARIO: string; // Usuário logado (criador)

  // --- Anexo principal ---
  Z07_DESC: string; // Descrição do anexo
  Z07_CHAVE: string; // Chave p/ download
}

/* ╔══════════════════════════════════════════════╗
      ║ 2 ▸ PARÂMETROS E RESPOSTAS DE API            ║
      ╚══════════════════════════════════════════════╝ */

/**
 * @description Parâmetros para a função `WorkspacePrenotas` que busca dados da API.
 */ /* Define os critérios de paginação, busca, ordenação e filtros para a API.
 */
export interface FetchPrenotasApiParams {
  page?: number;
  pageSize?: number;
  filials?: string[];
  searchTerm?: string;
  sorting?: Array<{ id: string; desc: boolean }>;
  filters?: Record<string, any>; // Filtros específicos da tabela
}

/**
 * @description Estrutura da resposta da API para a listagem de pré-notas.
 */
export interface FetchPrenotasResponse {
  data: PrenotaRow[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

/* ╔══════════════════════════════════════════════╗
      ║ 3 ▸ OPÇÕES PARA HOOKS                        ║
      ╚══════════════════════════════════════════════╝ */

/**
 * @description Opções para o hook `usePrenotas`.
 */ /* Exclui 'filters', pois estes são obtidos dinamicamente do `useDataTableStore` dentro do hook.
 */
export interface UsePrenotasOptions {
  page?: number;
  pageSize?: number;
  filials?: string[];
  searchTerm?: string;
  sorting?: Array<{ id: string; desc: boolean }>;
  filters?: Record<string, any>;
}
export interface FilialMeta {
  nome: string;
  cor: string;
  avatarSrc: string;
}
export interface BadgePreset {
  color: string;
  icon: React.ReactNode;
  tooltip: string;
}
