// app/(modules)/prenota/_internal/tabela/config/tabela.type.ts

/* ─────────────────────────────  tabela.types.ts  ───────────────────────────
 * Tipos-base usados em toda a feature **Pré-notas** (listagem, filtros,
 * actions, hooks, etc.).  Mantém o contrato de dados que chega da rota
 *  GET `/api/prenotas`  e o *shape* esperado pelos componentes de tabela.
 * ───────────────────────────────────────────────────────────────────────────*/

/* ╔══════════════════════════════════════════════╗
   ║ 1 ▸ LINHA DA TABELA / CARD DE PRÉ-NOTA       ║
   ╚══════════════════════════════════════════════╝ */

/** Representa **uma** pré-nota na listagem principal. */
export interface PrenotaRow {
  /* ——— Identificação principal ——— */
  REC: number; // SF1.R_E_C_N_O_
  F1_FILIAL: string; // SF1.F1_FILIAL
  F1_DOC: string; // SF1.F1_DOC
  F1_SERIE: string; // SF1.F1_SERIE

  /* ——— Metadados / status ——— */
  F1_STATUS: string; // SF1.F1_STATUS (cru)
  Status: string; // Status consolidado calculado no backend

  /* ——— Datas ——— (formato yyyymmdd) */
  F1_EMISSAO: string; // SF1.F1_EMISSAO
  F1_DTDIGIT: string; // SF1.F1_DTDIGIT
  VENCIMENTO: string; // Z10.Z10_VENCTO

  /* ——— Valores ——— */
  F1_VALBRUT: number; // SUM(SD1.D1_TOTAL)

  /* ——— Fornecedor ——— */
  A2_COD: string; // SA2.A2_COD
  A2_LOJA: string; // SA2.A2_LOJA
  A2_NOME: string; // SA2.A2_NOME

  /* ——— Campos auxiliares ——— */
  F4_TRANFIL: string; // SF4.F4_TRANFIL  (transferência)
  F1_XTIPO: string; // Tipo da NF
  F1_XPRIOR: string; // Prioridade
  F1_XORI: string; // Origem
  F1_XUSRRA: string; // Responsável revisão
  F1_XOBS: string; // Observação geral
  F1_ZOBSREV: string; // Observ. de revisão
  F1_XREV: string; // Flag de revisão
  USUARIO: string; // Usuário logado (criador)

  /* ——— Anexo principal ——— */
  Z07_DESC: string; // Descrição do anexo
  Z07_CHAVE: string; // Chave p/ download
}

/* ╔══════════════════════════════════════════════╗
   ║ 2 ▸ PARÂMETROS DE BUSCA (hook / endpoint)    ║
   ╚══════════════════════════════════════════════╝ */

/** Parâmetros aceitos por `usePrenotas` e pelo endpoint da listagem */
export interface FetchParams {
  page?: number; // página (1-based)
  pageSize?: number; // itens por página
  filials: string[]; // filiais visíveis ao usuário
  searchTerm?: string; // busca global (texto livre)

  /** Ordem das colunas (id = nome da coluna) */
  sorting?: { id: string; desc: boolean }[];

  /** Filtros avançados  (campo → valor) */
  filters?: Record<string, any>;
}


/* ╔══════════════════════════════════════════════╗
   ║ 3 ▸ Visuais                                  ║
   ╚══════════════════════════════════════════════╝ */

/**
 * Essas estruturas são _visuais_ (cores, ícones, tooltips) e
 * moram no módulo de configurações de UI.  Re-exportamos aqui
 * só para facilitar o import único quando preciso.
 */
export interface FilialMeta {
  nome: string;
  cor: string; // classe Tailwind ex.: "bg-blue-500 text-white"
  avatarSrc: string; // URL do avatar ou ""
}
export interface VencimentoPreset {
  label: string;
  colorClass: string;
  tooltip: string;
  diffDays: number | null;
  state: "sem-venc" | "invalido" | "ok";
}
export interface BadgePreset {
  color: string; // classes tailwind (text-… ou bg-…) - usado apenas no icon
  icon: React.ReactNode; // qualquer nó: ícone, badge, texto…
  tooltip: string; // texto do tooltip
}