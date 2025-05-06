import { CampoFiltro } from "../types";

/**
 * Lista de tipos de Nota Fiscal (F1_XTIPO)
 */
export const TIPOS_NF_OPTIONS = [
  { value: "Revenda", label: "Revenda" },
  { value: "Despesa/Imobilizado", label: "Despesa/Imobilizado" },
  { value: "Materia Prima", label: "Matéria Prima" },
  { value: "Collection", label: "Collection" },
  { value: "Garantia Concebida", label: "Garantia Concebida" },
];

/**
 * Status derivados com base na combinação de campos F1_STATUS e F1_XREV
 * Usado tanto para exibição quanto para filtragem
 */
export const STATUS_NF_OPTIONS = [
  { value: "Pendente", label: "Pendente" },
  { value: "Classificada", label: "Classificada" },
  { value: "Revisar", label: "Revisar" },
];

/**
 * Prioridades (F1_XPRIOR)
 */
export const PRIORIDADE_OPTIONS = [
  { value: "Alta", label: "Alta" },
  { value: "Media", label: "Média" },
  { value: "Baixa", label: "Baixa" },
];

// constants/filtroCampos.ts

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
  { label: "Emissão", campo: "F1_EMISSAO", tipo: "data-range" },
  { label: "Digitado em", campo: "F1_DTDIGIT", tipo: "data-range" },
  { label: "Valor Bruto", campo: "F1_VALBRUT", tipo: "numero-range" },
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
  { label: "Usuário", campo: "F1_XUSRRA", tipo: "texto" }, // opções podem vir de um endpoint
  { label: "Observação", campo: "F1_XOBS", tipo: "texto" },
  { label: "Obs. Reversão", campo: "F1_ZOBSREV", tipo: "texto" },
  { label: "Vencimento", campo: "VENCIMENTO", tipo: "data-range" },
];
