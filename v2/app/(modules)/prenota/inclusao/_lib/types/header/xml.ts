/* ==========================================================================
 * Tipos do serviço Conexão NFe
 * ==========================================================================*/
export interface CxnXmlItem {
  codProduto: string; // Código do produto
  descProduto: string; // Descrição do produto
  ncmsh: string; // Código NCM
  cst: string; // Código de Situação Tributária
  origem: string; // Origem da mercadoria (ex: "0")
  cfop: string; // Código Fiscal de Operações
  unidade: string; // Unidade de medida
  quantidade: string; // Quantidade (string para manter precisão)
  valorUnitario: string; // Valor unitário
  valorTotal: string; // Valor total do item
  bcIcms: string; // Base de cálculo ICMS
  valorIcms: string; // Valor do ICMS
  valorIpi: string; // Valor do IPI
  aliqIcms: string; // Alíquota ICMS
  aliqIpi: string; // Alíquota IPI
}

export interface CxnXmlDetails {
  cnpjDestinatario: any;
  numero: string;
  serie: string;
  dataEmissao: string; // "dd/mm/yyyy HH:MM:ss"
  valorTotalDaNota: string;
  nomeEmitente: string;
  cnpjEmitente: string;
  ufEmitente: string;
  informacoesAdicionais: string;
  itens: CxnXmlItem[];
}

/* Normalização para o domínio Pré‑Nota ----------------------------------*/
import type { XmlHeaderPatch, XmlItem } from "@inclusao/types";

export interface XmlNormalized {
  headerPatch: XmlHeaderPatch;
  itens: XmlItem[];
}
