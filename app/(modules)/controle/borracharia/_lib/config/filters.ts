import { ComboboxItem } from "@/_core/components";
import { FilterInputs } from "../types/types.filterInputs";
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
  campo: keyof FilterInputs; // key da coluna a ser filtrada
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
  field: keyof FilterInputs; // coluna afetada
  value: unknown; // string | number | RangeValue | string[]
}

/* props que o <FilterRow> recebe -------------------------------------------*/
export interface FilterRowProps {
  filter: LocalFilter;
  onChange: (id: string, field: keyof FilterInputs, value: unknown) => void;
  onRemove: (id: string) => void;
}