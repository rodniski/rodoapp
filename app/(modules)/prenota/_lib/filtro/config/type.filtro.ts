/* ───────────────────────────  filters.types.ts  ──────────────────────────
 * Tipos **únicos** usados pela feature de filtros da listagem de Pré-notas.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Passamos a ter **apenas 3** controles      (input puros):
 *  ├────────────┤    • texto     →  <input text|number>
 *  │  CONTROLES │    • range     →  <input type="number|date"> duplo
 *  │            │    • select    →  <select>  (single ou multi)
 *  └────────────┘
 *  Todos os demais detalhes (labels, grid, tooltips…) ficam no componente
 *  pai (`FilterRow`).  Este arquivo contém só o “contrato” de dados.
 * -----------------------------------------------------------------------*/

import { ComboboxItem } from "@/_core/components";
import type { PrenotaRow } from "@prenota/tabela";

/* ╭──────────────────────────────────────────╮
   │ 1 ▸ ENUM DOS 3 TIPOS DE CONTROLE         │
   ╰──────────────────────────────────────────╯ */
export type TipoFiltro =
  | "texto" // <input type="text">
  | "numero" // valor numérico exato
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
  tipo: TipoFiltro; // “texto” | “range” | “select”

  /*— opções extras por tipo —*/
  numeric?: boolean; // texto → <input type="number">
  rangeMode?: "number" | "date"; // range → decide type do input
  multiple?: boolean; // select → multi-select?
  opcoes?: ComboboxItem[] | (() => Promise<ComboboxItem[]>); // select dinâmico
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

/* props dos 3 inputs “puros” (sem <Label>) ----------------------------------*/
export interface TextInputProps {
  value: string;
  onChange: (v: string) => void;
  numeric?: boolean;
  placeholder?: string;
}

export interface RangeInputProps {
  value: RangeValue;
  onChange: (v: RangeValue) => void;
  mode?: "number" | "date";
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
export interface LocalFilter {
  id: string; // uuid gerado no client
  field: keyof PrenotaRow; // coluna afetada
  value: unknown; // string | number | RangeValue | string[]
}

/* props que o <FilterRow> recebe -------------------------------------------*/
export interface FilterRowProps {
  filter: LocalFilter;
  onChange: (id: string, field: keyof PrenotaRow, value: unknown) => void;
  onRemove: (id: string) => void;
}
