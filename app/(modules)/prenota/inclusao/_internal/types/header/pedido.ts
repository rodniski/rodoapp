export interface ProdutoPedido {
  numero: string; // Número do pedido (C7_NUM)
  itemSequencia: string; // Sequência do item no pedido (C7_ITEM)
  pagamento: string; // Condição de pagamento (C7_COND)
  preco: string; // Preço unitário (C7_PRECO)
  total: string; // Total do item (C7_TOTAL)
  quantidade: string; // Quantidade (C7_QUANT)
  descricao: string; // Descrição do produto (B1_DESC)
  ncm: string; // NCM (B1_POSIPI)
  fornecedor: string; // Código do fornecedor (A2_COD)
  produto: string; // Código do produto (C7_PRODUTO)
  B1_TIPO: string; // Tipo do item (B1_TIPO)
  B1_UM: string; // Unidade de medida (B1_UM)
  B1_SEGUM: string; // Segunda unidade de medida (B1_SEGUM)
  B1_LOCPAD: string; // Local padrão de estoque (B1_LOCPAD)
  B1_GRUPO: string; // Grupo do produto (B1_GRUPO)
  B1_GRTRIB: string; // Grupo tributário (B1_GRTRIB)
  origem: string; // Origem do produto (B1_ORIGEM)
}

export interface PedidoResumo {
  numero: string;
  total: number;
  qtdItens: number;
}
