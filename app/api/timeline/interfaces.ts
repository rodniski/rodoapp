/**
 * Linha retornada por getFullTimelineQuery
 */
export interface FullTimelineSqlRow {
  /* Chaves */
  FILIAL: string;
  REC_F1: number | string;

  /* Pedido (SC7) */
  PEDIDO: string | null;
  EMISSAO_PEDIDO: string | null;
  OBS_PEDIDO: string | null;
  USUARIO_PEDIDO: string | null;

  /* Nota fiscal (SF1) */
  NOTA: string | null;
  SERIE: string | null;
  EMISSAO_NF: string | null;
  OBS_COMPLEMENTAR: string | null;
  DATA_CLASSIFICACAO: string | null;
  STATUS_NF: string | null;
  USUARIO_LANCAMENTO: string | null; // ← NEW
  DATA_LANCAMENTO_REAL: string | null;
  DATA_ORDENACAO: string | null;

  /* Fornecedor (SA2) */
  COD_FORNECEDOR: string | null;
  FORNECEDOR: string | null;
  LOJA: string | null;

  /* Título (SE2) */
  NUMERO_PARCELA: string | null;
  VENCIMENTO: string | null;
  DATA_BAIXA: string | null;
  VALOR_PARCELA: number | null;
  HISTORICO_PARCELA: string | null;

  /* Histórico (Z05) */
  CAMPO: string | null;
  OBSERVACAO_HISTORICO: string | null;
  USUARIO_HISTORICO: string | null;
  DATA_HISTORICO: string | null;
  HORA_HISTORICO: string | null;
}

/**
 * Evento presente na timeline de uma pré-nota.
 * Cada “tipo” representa o *intervalo medido* – é sempre nomeado a partir do
 * ponto de chegada da fase (ex.: pedido → NF emitida).
 */
export interface TimelineEvento {
  /** Identifica a fase do fluxo P2P a que o evento pertence */
  tipo:
    | "pedido_nfEmitida" // Pedido aprovado    → NF emitida pelo fornecedor
    | "nfEmitida_recebida" // NF emitida         → NF recebida/lançada no sistema
    | "recebida_classificada" // NF recebida        → NF classificada
    | "nfEmitida_pago"; // NF emitida         → Título pago (ou vencido)

  /** Chave de exibição (ex.: nº do pedido ou DOC-SÉRIE) */
  codigo: string;

  /** Pessoa/entidade mais relevante para a etapa (fornecedor, usuário, etc.) */
  nome: string | null;

  /** Observação livre (OC, NF ou título) */
  obs?: string | null;

  /** Data de início do intervalo (YYYYMMDD ou ISO) */
  inicio: string;

  /** Data de término do intervalo (YYYYMMDD ou ISO) */
  fim: string;

  /** Estado de conclusão da fase */
  status?: "pendente" | "in-progress" | "concluido" | "atrasado";

  /** Marcos internos (logs, parcelas, checkpoints) */
  marcos?: TimelineMarco[];

  /** Valor monetário associado, quando aplicável (p.ex. parcela) */
  valor?: number;
}

/**
 * Ponto específico dentro de um evento (log de campo, parcela, etc.).
 */
export interface TimelineMarco {
  campo?: string; // nome do campo/descrição curta
  valor?: string | number | null; // valor antigo/novo ou valor monetário
  data: string; // YYYYMMDD ou ISO
  usuario?: string | null; // quem realizou a ação
  descricao?: string; // texto extra para exibição
}
