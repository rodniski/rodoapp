/* ─────────────────────────  revisar.types.ts  ──────────────────────────
 * Todas as _types_ referentes ao **fluxo “Revisar Pré-nota”** ficam aqui.
 * Blocos:
 *   1. Contratos de API  (payload / response)
 *   2. Modelos de domínio (histórico, etc.)
 *   3. Props de componentes React (UI)
 * ----------------------------------------------------------------------*/

import type { PrenotaRow } from "@prenota/tabela"; // ajuste o caminho, se necessário
import type React from "react";

/* ╔═══════════════════════╗
   ║ 1 ▸ CONTRATOS DE API  ║
   ╚═══════════════════════╝ */

/** Payload do `POST /api/revisar-pre-nota` */
export interface RevisaoPreNotaPayload {
  /** `SF1.R_E_C_N_O_` da pré-nota */
  RECSF1: string | number;
  /** Motivo / descrição enviada ao financeiro */
  REVISAR: string;
  /** Usuário (login) que solicitou */
  USER: string;
  /** E-mails em cópia (separados por ‘;’) */
  EMAILS?: string;
  /** flag “True” / “False” exigida pela API */
  FINALIZADO: "True" | "False";
}

/** Resposta de sucesso lógico */
export interface RevisaoPreNotaSuccessResponse {
  Sucesso: true;
  Mensagem?: string;
  Documento?: string;
  REC?: string;
  [k: string]: unknown; // campos extras da API
}

/** Resposta de erro lógico (`Sucesso: false`) */
export interface RevisaoPreNotaErrorResponse {
  Sucesso: false;
  Mensagem: string;
  [k: string]: unknown; // campos extras da API
}

/** União final retornada pelo serviço */
export type RevisaoPreNotaApiResponse =
  | RevisaoPreNotaSuccessResponse
  | RevisaoPreNotaErrorResponse;

/* ╔════════════════════════════╗
   ║ 2 ▸ MODELOS DE DOMÍNIO     ║
   ╚════════════════════════════╝ */

/** Entrada crua do log (Z05) – saída exata da API */
export interface RawHistoricoEntry {
  usuario: string;
  data: string; // “dd/MM/yyyy”
  hora: string; // “HH:mm:ss”
  campo: string;
  anterior: string;
  chave: string;
  atual: string;
}

/** Entrada com `Date` parseado (útil para sort) */
export interface HistoricoEntry extends RawHistoricoEntry {
  /** `data` + `hora` convertido em `Date` no client */
  timestamp?: Date;
}

/* ╔════════════════════════════════════════╗
   ║ 3 ▸ PROPS DOS COMPONENTES (React)      ║
   ╚════════════════════════════════════════╝ */

/* ———  Chat de histórico ——— */
export interface HistoricoChatViewProps {
  recId: string | number | null | undefined;
  currentLoggedInUsername: string;
}

/* ———  Dialog “Revisar” ——— */
export interface RevisarDialogProps {
  prenotaSelecionada: PrenotaRow | null;
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
}

/* ———  Campo de formulário genérico ——— */
export interface FormFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}

/* ———  Conjunto de campos do formulário de revisão ——— */
export interface FormularioRevisaoFieldsProps {
  revisarText: string;
  setRevisarText: React.Dispatch<React.SetStateAction<string>>;
  emailTags: string[];
  setEmailTags: React.Dispatch<React.SetStateAction<string[]>>;
  isPending: boolean;
  rec: string | number | undefined;
}

/* ———  Botão reutilizável de ação ——— */
export interface ActionButtonProps {
  label: string;
  loadingLabel: string;
  isLoading: boolean;
  disabled: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "default" | "destructive";
  form?: string;
}

/* ———  Mensagens do “chat” de revisão ——— */
export interface MessageProps {
  entry: HistoricoEntry;
  isCurrentUser: boolean;
  index: number;
}

export interface TimestampProps {
  timestamp: string;
  isCurrentUser: boolean;
}

/* ———  Query-key do hook de histórico ——— */
export type HistoricoPreNotaQueryKey = readonly [
  "historicoPreNota",
  string | null | undefined
];
