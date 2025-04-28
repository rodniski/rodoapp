export const requiredHeader = [
    "header.FILIAL",
    "header.FORNECEDOR",
    "header.LOJA",
    "header.DOC",
    "header.SERIE",
    "header.CONDFIN",
    "header.DTINC",
    "header.tiporodo",
    "header.prioridade",
  ] as const
  
  export const requiredParcelas = [
    // basta exigir ao menos 1 parcela
    "parcelas[0]"
  ] as const
  
  export const requiredItens = [
    // idem: pelo menos 1 item
    "itens[0]"
  ] as const
  
  /* Se crescer (rateios, anexos, …) só acrescentar aqui */
  export const requiredAll = [
    ...requiredHeader,
    ...requiredParcelas,
    ...requiredItens,
  ] as const
  