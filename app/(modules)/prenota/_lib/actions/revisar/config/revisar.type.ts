/* ─────────────────────────  prenota/revisar/revisar.types.ts  ─────────────────────
 * Tipos centrales do **fluxo “Revisar Pré-nota”**.
 * Organização:
 *   1.  Contratos de API  (request & response)
 *   2.  Modelos de domínio (histórico Z05)
 *   3.  Props de componentes / hooks
 * ------------------------------------------------------------------------------- */

import type { PrenotaRow } from "@prenota/tabela";
import type { Dispatch, SetStateAction, ReactNode, FormEvent } from "react";

/* ╭──────────────────────╮
   │ 1. CONTRATOS DE API  │
   ╰──────────────────────╯ */

export interface RevisaoPreNotaPayload {
  RECSF1: string | number;
  REVISAR: string;
  USER: string;
  EMAILS?: string; // separados por ‘;’
  FINALIZADO: "True" | "False";
}

export interface RevisaoPreNotaSuccessResponse {
  Sucesso: true;
  Mensagem?: string;
  Documento?: string;
  REC?: string;
  [k: string]: unknown;
}

export interface RevisaoPreNotaErrorResponse {
  Sucesso: false;
  Mensagem: string;
  [k: string]: unknown;
}

export type RevisaoPreNotaApiResponse =
  | RevisaoPreNotaSuccessResponse
  | RevisaoPreNotaErrorResponse;

/* ╭────────────────────────╮
   │ 2. MODELOS DE DOMÍNIO  │
   ╰────────────────────────╯ */

export interface RawHistoricoEntry {
  usuario: string;
  data: string; // dd/MM/yyyy
  hora: string; // HH:mm:ss
  campo: string;
  anterior: string;
  chave: string;
  atual: string;
}

export interface HistoricoEntry extends RawHistoricoEntry {
  /** `data`+`hora` convertido para `Date` no client (facilita ordenação) */
  timestamp?: Date;
}

/* ╭──────────────────────────────────────────────╮
   │ 3. PROPS (COMPONENTES - HOOKS - CONTEXTOS)  │
   ╰──────────────────────────────────────────────╯ */

/* —— chat / histórico —— */
export interface HistoricoChatViewProps {
  recId: string | number | null | undefined;
  currentLoggedInUsername: string;
}

/* —— dialog principal —— */
export interface RevisarDialogProps {
  prenotaSelecionada: PrenotaRow | null;
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
}

/* —— utilitário de campo genérico —— */
export interface FormFieldProps {
  label: string;
  required?: boolean;
  optional?: boolean;
  tooltip?: string;
  children: ReactNode;
}

/* —— blocos de formulário —— */
interface RevisaoFormCore {
  revisarText: string;
  setRevisarText: Dispatch<SetStateAction<string>>;
  emailTags: string[];
  setEmailTags: Dispatch<SetStateAction<string[]>>;
  isPending: boolean;
}

/** miolo (somente campos) */
export interface FormularioRevisaoFieldsProps extends RevisaoFormCore {
  rec: string | number | undefined;
}

/** `<form>` completo (inclui a prenota e o submit) */
export interface RevisaoFormProps extends RevisaoFormCore {
  prenota: PrenotaRow;
  onSubmit: (e?: FormEvent<HTMLFormElement>) => void;
}

/* —— rodapé do diálogo —— */
export interface FormFooterProps {
  isPending: boolean;
  /** `"form"` enviando observação | `"finalize"` encerrando revisão */
  actionInProgress: "form" | "finalize" | null;
  username: string;
  revisarText: string;
  handleFinalizarDiretamente: () => void;
}

/* —— mensagem do chat —— */
export interface MessageProps {
  entry: HistoricoEntry;
  isCurrentUser: boolean;
  index: number;
}

export interface TimestampProps {
  timestamp: string;
  isCurrentUser: boolean;
}

/* —— react-query key —— */
export type HistoricoPreNotaQueryKey = readonly [
  "historicoPreNota",
  string | null | undefined
];
