/* ------------------------------------------------------------------
 * Tipos compartilhados – Classificação (Natureza & Tipo Operação)
 * -----------------------------------------------------------------*/

/** Registro da tabela SED010 (Natur. Lançamento) que vai para o front */
export interface Natureza {
  /** Código (ED_CODIGO) – sempre `trim()` se for exibir */
  COD: string;
  /** Descrição (ED_DESCRIC) – texto completo */
  DESCR: string;
}

/** Registro da SX5 (tabela ‘DJ’) – Tipo de Operação */
export interface TipoOper {
  /** Chave (X5_CHAVE) */
  COD: string;
  /** Descrição (X5_DESCRI) */
  DESCR: string;
}
