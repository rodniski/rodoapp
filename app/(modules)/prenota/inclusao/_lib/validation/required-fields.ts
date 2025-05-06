/**
 * Campos obrigatórios para formulários RHF (React Hook Form)
 * Listas de chaves usadas em form methods 'trigger' ou 'formState.errors'
 */
export const requiredHeaderFields = [
  "header.FILIAL",
  "header.FORNECEDOR",
  "header.LOJA",
  "header.DOC",
  "header.SERIE",
  "header.CONDFIN",
  "header.DTINC",
  "header.tiporodo",
  "header.prioridade",
] as const;

export const requiredInstallmentsFields = [
  "PAGAMENTOS",
  "ARQUIVOS",
] as const;

export const requiredItemsFields = [
  "itens",
] as const;

/**
 * Agrupa todas as chaves obrigatórias para trigger validations de todo o fluxo
 */
export const requiredAllFields = [
  ...requiredHeaderFields,
  ...requiredInstallmentsFields,
  ...requiredItemsFields,
] as const;
