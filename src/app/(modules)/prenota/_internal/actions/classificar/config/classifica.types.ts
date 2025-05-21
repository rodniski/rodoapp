export interface ProdutoPrenota {
  ITEM: number;
  COD: string;
  DESCRICAO: string; // alias novo
  UM: string;
  QTDE: number;
  TOTAL: number;
  GRUPO: string;
  ORIGEM: string;
}
export type ProdutoClassificacao = ProdutoPrenota & {
  NATUREZA?: string;
  TIPO_OP?: string;
  _locked?: boolean; // ← campo só no front
};
