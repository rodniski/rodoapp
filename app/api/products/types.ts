export interface BuscarProdutosParams {
  /** Termo para buscar no código (B1_COD) ou descrição (B1_DESC) do produto. */
  termoBusca?: string;
  /** Código da filial para filtrar os produtos (opcional). */
  filial?: string;
  /** Número máximo de resultados a serem retornados (padrão: 15). */
  limite?: number;
}

export interface ProdutoParaDialog {
  R_E_C_N_O_: number;
  B1_COD: string;
  B1_DESC: string;
  B1_UM: string | null;
}
