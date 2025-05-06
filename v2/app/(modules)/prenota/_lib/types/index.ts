export interface PrenotaRow {
  REC: number; // SF1.R_E_C_N_O_
  F4_TRANFIL: string; // TRIM(ISNULL(SF4.F4_TRANFIL, ''))
  F1_FILIAL: string; // TRIM(SF1.F1_FILIAL)
  F1_DOC: string; // TRIM(SF1.F1_DOC)
  F1_SERIE: string; // TRIM(SF1.F1_SERIE)
  F1_STATUS: string; // TRIM(SF1.F1_STATUS)
  A2_COD: string; // TRIM(SA2.A2_COD)
  A2_LOJA: string; // TRIM(SA2.A2_LOJA)
  A2_NOME: string; // TRIM(SA2.A2_NOME)
  F1_EMISSAO: string; // SF1.F1_EMISSAO
  F1_DTDIGIT: string; // SF1.F1_DTDIGIT
  F1_VALBRUT: number; // SUM(SD1.D1_TOTAL)
  F1_XTIPO: string; // TRIM(SF1.F1_XTIPO)
  F1_XPRIOR: string; // TRIM(SF1.F1_XPRIOR)
  F1_XORI: string; // TRIM(SF1.F1_XORI)
  F1_XUSRRA: string; // TRIM(SF1.F1_XUSRRA)
  F1_XOBS: string; // TRIM(SF1.F1_XOBS)
  F1_ZOBSREV: string; // TRIM(SF1.F1_ZOBSREV)
  F1_XREV: string; // TRIM(SF1.F1_XREV)
  USUARIO: string; // SUBSTRING do F1_USERLGI
  VENCIMENTO: string; // ISNULL(Z10.Z10_VENCTO, '')
  Z07_DESC: string; // TRIM(ISNULL(Z07.Z07_DESC, ''))
  Z07_CHAVE: string; // TRIM(ISNULL(Z07.Z07_CHAVE, ''))
  Status: string; // Status
}
export type TipoFiltro =
  | "texto"
  | "numero"
  | "numero-range"
  | "data-range"
  | "select"
  | "select-multiple"
  | "filial-select";

export interface CampoFiltro {
  label: string;
  campo: keyof PrenotaRow;
  tipo: TipoFiltro;
  opcoes?:
    | { label: string; value: string }[]
    | (() => Promise<{ label: string; value: string }[]>);
  observacao?: string;
}

/**
 * Payload para a solicitação de revisão da Pré-Nota.
 */
export interface RevisaoPreNotaPayload {
  RECSF1: string | number; // RECNO da SF1 (Pré-Nota)
  REVISAR: string; // Motivo/descrição da solicitação de revisão
  USER: string; // Usuário que está solicitando
  EMAILS?: string; // E-mails para cópia, concatenados por ';' (opcional)
  FINALIZADO: "True" | "False"; // Indica se a revisão finaliza algo (API espera string)
}

/**
 * Resposta de SUCESSO da API de Revisão de Pré-Nota.
 * (Adaptar conforme a resposta real da sua API)
 */
export interface RevisaoPreNotaSuccessResponse {
  Sucesso: true;
  Mensagem?: string;
  Documento?: string; // Exemplo de outros campos que podem vir
  REC?: string; // Exemplo de outros campos que podem vir
  [k: string]: unknown;
}

/**
 * Resposta de ERRO LÓGICO da API de Revisão de Pré-Nota.
 */
export interface RevisaoPreNotaErrorResponse {
  Sucesso: false;
  Mensagem: string;
  [k: string]: unknown;
}

/**
 * Tipo unificado para a resposta da API de Revisão.
 */
export type RevisaoPreNotaApiResponse =
  | RevisaoPreNotaSuccessResponse
  | RevisaoPreNotaErrorResponse;

export interface HistoricoEntry {
  usuario: string;
  data: string; // Formato "dd/MM/yyyy"
  hora: string; // Formato "HH:mm:ss"
  campo: string; // Código ou descrição do campo/ação
  anterior: string; // Valor anterior ou informação relacionada
  chave: string; // Chave da entidade (provavelmente o RECSF1)
  atual: string; // Valor atual ou descrição da ação/log
  // Adicionar um campo opcional para a data parseada para ordenação
  timestamp?: Date;
}

/**
 * O tipo de resposta esperado da API getHistorico (um array de entradas).
 */
export type HistoricoApiResponse = HistoricoEntry[];
