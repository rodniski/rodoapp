import { CampoFiltro } from "./filters";

// constants/filtroCampos.ts

export const CAMPOS_FILTRO: CampoFiltro[] = [
  { label: "Documento", campo: "Doc", tipo: "texto" },
  { label: "Série", campo: "Serie", tipo: "texto" },
  { label: "Código Cliente", campo: "CodCliente", tipo: "texto" },
  { label: "Loja", campo: "Loja", tipo: "texto" },
  { label: "Nome Cliente", campo: "DescCliente", tipo: "texto" },
  { label: "Código Produto", campo: "ProdutoCod", tipo: "texto" },
  { label: "Descrição Produto", campo: "ProdutoDesc", tipo: "texto" },
  { label: "Data Emissão", campo: "DataEmissao", tipo: "data-range" },
];
