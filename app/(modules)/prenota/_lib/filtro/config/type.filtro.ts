/* ───────────────────────────  filters.types.ts  ──────────────────────────
 * Tipos **únicos** usados pela feature de filtros da listagem de Pré-notas.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Passamos a ter **apenas 3** controles (input puros):
 *  ├────────────┤    • texto     →  <input text|number>
 *  │  CONTROLES │    • range     →  <input type="number|date"> duplo
 *  │            │    • select    →  <select> (single ou multi)
 *  └────────────┘
 *  Todos os demais detalhes (labels, grid, tooltips…) ficam no componente
 *  pai (`FilterRow`). Este arquivo contém só o “contrato” de dados.
 * -----------------------------------------------------------------------*/

import { ComboboxItem } from "@/_core/components";
import type { PrenotaRow } from "@prenota/tabela";
import { PRIORIDADE_OPTIONS, TIPOS_NF_OPTIONS } from "../../config";

/* ╭──────────────────────────────────────────╮
   │ 1 ▸ ENUM DOS TIPOS DE CONTROLE           │
   ╰──────────────────────────────────────────╯ */
export type TipoFiltro =
  | "texto" // <input type="text" | "number">
  | "numero-range" // intervalo numérico (mín-máx)
  | "data-range" // intervalo de datas (date-picker)
  | "select" // <select> simples
  | "select-multiple" // multi-select / checklist
  | "filial-select"; // seletor customizado de filiais

/* ╭──────────────────────────────────────────╮
   │ 2 ▸ DESCRIÇÃO DO FILTRO POR COLUNA       │
   ╰──────────────────────────────────────────╯ */
export interface CampoFiltro {
  label: string; // rótulo para o usuário
  campo: keyof PrenotaRow; // key da coluna a ser filtrada
  tipo: TipoFiltro; // tipo de controle
  numeric?: boolean; // texto → força <input type="number">
  rangeMode?: "number" | "date"; // range → decide type do input
  multiple?: boolean; // select → multi-select?
  opcoes?: ComboboxItem[] | (() => Promise<ComboboxItem[]>); // select → opções estáticas ou dinâmicas
  observacao?: string; // hint / tooltip opcional
}

/* ╭──────────────────────────────────────────╮
   │ 3 ▸ MODELOS AUXILIARES                   │
   ╰──────────────────────────────────────────╯ */

/*— intervalo ----------------------------------------------------------------*/
export interface RangeValue {
  from: string | number | null;
  to: string | number | null;
}

/*— props dos 3 inputs “puros” (sem <Label>) ----------------------------------*/
export interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
  placeholder?: string;
}

export interface RangeInputProps {
  value: RangeValue;
  onChange: (v: RangeValue) => void;
  mode: "number" | "date"; // required for type safety
  className?: string;
}

export interface SelectInputProps {
  value: string | string[];
  onChange: (v: string | string[]) => void;
  options: ComboboxItem[];
  multiple?: boolean;
  allowClear?: boolean;
  placeholder?: string;
}

/* ╭──────────────────────────────────────────╮
   │ 4 ▸ FILTRO “INSTANCIADO” NO CLIENT        │
   ╰──────────────────────────────────────────╯ */
export type FilterValue = string | number | RangeValue | string[];
export interface LocalFilter {
  id: string; // uuid gerado no client
  field: keyof PrenotaRow; // coluna afetada
  value: FilterValue; // specific union type instead of unknown
}

/*— props que o <FilterRow> recebe -------------------------------------------*/
export interface FilterRowProps {
  filter: LocalFilter;
  onChange: (id: string, field: keyof PrenotaRow, value: FilterValue) => void;
  onRemove: (id: string) => void;
}

/* ╭──────────────────────────────────────────╮
   │ 5 ▸ CONFIGURAÇÃO DOS CAMPOS DE FILTRO     │
   ╰──────────────────────────────────────────╯ */
export const CAMPOS_FILTRO: CampoFiltro[] = [
  { label: "Filial", campo: "F1_FILIAL", tipo: "filial-select" },
  { label: "Documento", campo: "F1_DOC", tipo: "texto" },
  { label: "Série", campo: "F1_SERIE", tipo: "texto" },
  {
    label: "Status",
    campo: "Status",
    tipo: "select-multiple",
    opcoes: [
      { value: "Revisar", label: "Revisar" },
      { value: "Classificado", label: "Classificado" },
      { value: "Pendente", label: "Pendente" },
    ],
  },
  { label: "Fornecedor", campo: "A2_NOME", tipo: "texto" },
  {
    label: "Emissão",
    campo: "F1_EMISSAO",
    tipo: "data-range",
    rangeMode: "date",
  },
  {
    label: "Digitado em",
    campo: "F1_DTDIGIT",
    tipo: "data-range",
    rangeMode: "date",
  },
  {
    label: "Valor Bruto",
    campo: "F1_VALBRUT",
    tipo: "numero-range",
    rangeMode: "number",
  },
  {
    label: "Tipo de NF",
    campo: "F1_XTIPO",
    tipo: "select-multiple",
    opcoes: TIPOS_NF_OPTIONS,
  },
  {
    label: "Prioridade",
    campo: "F1_XPRIOR",
    tipo: "select-multiple",
    opcoes: PRIORIDADE_OPTIONS,
  },
  { label: "Usuário", campo: "F1_XUSRRA", tipo: "texto" },
  { label: "Observação", campo: "F1_XOBS", tipo: "texto" },
  { label: "Obs. Reversão", campo: "F1_ZOBSREV", tipo: "texto" },
  {
    label: "Vencimento",
    campo: "VENCIMENTO",
    tipo: "data-range",
    rangeMode: "date",
  },
];
