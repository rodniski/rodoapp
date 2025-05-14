/* ───────────────────────────  filter-options.ts  ──────────────────────────
 * Opções de filtro para a feature de filtros da listagem de Pré-notas.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Define as opções disponíveis para os controles de tipo
 *  ├────────────┤  `select` e `select-multiple` usados nos filtros de
 *  │  OPÇÕES    │  Pré-notas, como Tipo de NF, Status e Prioridade.
 *  └────────────┘
 *  Cada opção é um item do tipo `ComboboxItem` com `value` e `label`.
 *  Esses valores são usados diretamente nos filtros e devem corresponder
 *  aos dados esperados pelo backend.
 * -----------------------------------------------------------------------*/

import { ComboboxItem } from "@/_core/components";

/* ╭──────────────────────────────────────────╮
   │ 1 ▸ OPÇÕES PARA TIPO DE NOTA FISCAL      │
   ╰──────────────────────────────────────────╯ */
export const TIPOS_NF_OPTIONS: ComboboxItem[] = [
  { value: "Revenda", label: "Revenda" },
  { value: "Despesa/Imobilizado", label: "Despesa/Imobilizado" },
  { value: "Materia Prima", label: "Matéria Prima" },
  { value: "Collection", label: "Collection" },
  { value: "Garantia Concebida", label: "Garantia Concebida" },
];

/* ╭──────────────────────────────────────────╮
   │ 2 ▸ OPÇÕES PARA STATUS DA NOTA FISCAL    │
   ╰──────────────────────────────────────────╯ */
export const STATUS_NF_OPTIONS: ComboboxItem[] = [
  { value: "Pendente", label: "Pendente" },
  { value: "Classificada", label: "Classificada" },
  { value: "Revisar", label: "Revisar" },
];

/* ╭──────────────────────────────────────────╮
   │ 3 ▸ OPÇÕES PARA PRIORIDADE               │
   ╰──────────────────────────────────────────╯ */
export const PRIORIDADE_OPTIONS: ComboboxItem[] = [
  { value: "Alta", label: "Alta" },
  { value: "Média", label: "Média" },
  { value: "Baixa", label: "Baixa" },
];
