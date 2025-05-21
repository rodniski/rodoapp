/* ─────────────────────────────  timeline.types.ts  ──────────────────────────
 * Este arquivo concentra **todo** o contrato de tipos relacionado à timeline:
 *
 *   1. Dados vindos da API  (`TimelineEvento[]`)
 *   2. Modelos auxiliares   (marcos, enums, helpers)
 *   3. Shape pós-processado usado na UI vertical (cards)
 * --------------------------------------------------------------------------*/

/* ╔══════════════════════════════════════╗
   ║ 1 ▸ CONTRATO ENTREGUE PELA API       ║
   ╚══════════════════════════════════════╝ */

/** Fases que compõem o SLA da pré-nota */
export type TimelineStage =
  | "pedido_nfEmitida" // SC7 ➜ NF emitida
  | "nfEmitida_recebida" // NF emitida ➜ NF recebida (F1_RECBMTO)
  | "recebida_classificada" // NF recebida ➜ NF classificada (F1_DTLANC)
  | "nfEmitida_pago"; // NF emitida ➜ baixa do título

/** Situação atual de cada fase */
export type TimelineStatus =
  | "pendente"
  | "in-progress"
  | "concluido"
  | "atrasado";

/** Marcos internos (logs Z05, parcelas, …) */
export interface TimelineMarco {
  campo?: string; // “Parc. 03”, “F1_STATUS”, …
  valor?: string | number | null; // texto ou número
  data: string; // YYYYMMDD ou ISO
  usuario?: string | null; // autor (se houver)
  descricao?: string; // texto adicional
}

/** Evento bruto devolvido pela rota `/api/prenota/:rec/full-timeline` */
export interface TimelineEvento {
  tipo: TimelineStage; // estágio
  codigo: string; // chave humana (NF ou nº pedido)
  nome?: string | null; // responsável / fornecedor / usuário
  obs?: string | null; // observação livre
  inicio: string; // YYYYMMDD
  fim: string | null; // YYYYMMDD ou null
  status: TimelineStatus; // estado da fase
  marcos?: TimelineMarco[]; // marcos auxiliares
  valor?: number; // valores financeiros (futuro)
}

/** Payload completo da API */
export type TimelineResponse = TimelineEvento[];

/* ╔══════════════════════════════════════╗
   ║ 2 ▸ HELPERS / DERIVADOS (opcionais)  ║
   ╚══════════════════════════════════════╝ */

/** Mesmo evento, mas com strings → `Date` já convertidas */
export type TimelineEventoParsed = Omit<TimelineEvento, "inicio" | "fim"> & {
  inicio: Date;
  fim: Date | null;
};

/** Formato de tarefa para o gráfico de Gantt (Frappe Gantt) */
export interface GanttTask {
  id: string; // Identificador único
  name: string; // Nome exibido (ex.: "000253762-21 - nfEmitida_recebida")
  start: string; // Data de início (YYYY-MM-DD)
  end: string; // Data de fim (YYYY-MM-DD)
  progress: number; // Progresso (0-100)
  dependencies: string; // Dependências (vazio por enquanto)
  custom_class?: string; // Classe CSS para estilização
  details: {
    // Detalhes para popup/tooltip
    nome: string | null;
    obs: string | null;
    valor: number | null;
    marcos: TimelineMarco[] | null;
  };
}

/* ╔══════════════════════════════════════════════╗
   ║ 3 ▸ ITEM DA TIMELINE VERTICAL (UI React)     ║
   ╚══════════════════════════════════════════════╝ */

/** Card/linha mostrado na coluna vertical da timeline */
export interface ProcessedTimelineItem {
  id: string; // hash único no React
  timestamp: Date; // para ordenação precisa
  date: string; // “YYYYMMDD”
  time?: string; // “HH:mm” (opcional)
  title: string; // título exibido
  details: { key: string; value: string }[]; // pares chave/valor
  eventType: TimelineStage; // para ícones/cores
}