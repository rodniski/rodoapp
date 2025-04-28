/**
 * @/utils/populateUtils.ts (ou @inclusao/utils/...)
 */

import { usePreNotaStore, usePreNotaAuxStore } from "@inclusao/stores";
import type { PreNotaHeader, PreNotaItem } from "@inclusao/types";
import type { ConexaoNfeDetalhesResponse, Fornecedor } from "@inclusao/api";
import { parseFloatOrZero, normalizeDateString } from "utils";

const UTILS_NAME = "populateStoresFromXml";

interface PopulateParams {
  xmlData: ConexaoNfeDetalhesResponse;
  fornecedor: Fornecedor | undefined | null;
  filialCodigo: string;
  username: string;
  chaveDFe: string;
}

export function populateStoresFromXml({
  xmlData,
  fornecedor,
  filialCodigo,
  username,
  chaveDFe,
}: PopulateParams): void {
  console.log(`[${UTILS_NAME}] Iniciando população dos stores...`);
  try {
    const { setHeader, setItens, setModoXml } = usePreNotaStore.getState();
    const { setSelectedFornecedor } = usePreNotaAuxStore.getState().selection;
    const { setXmlDataLoadedSuccess } =
      usePreNotaAuxStore.getState().loadStatus;

    const fornecedorLoja = fornecedor?.A2_LOJA || "01";
    const nomeFornecedor = fornecedor?.A2_NOME || fornecedor?.A2_NREDUZ || "";

    // 1. Atualiza o fornecedor no store auxiliar (sem PEDIDOS)
    if (fornecedor) {
      const { PEDIDOS, ...fornecedorSemPedidos } = fornecedor;
      setSelectedFornecedor(fornecedorSemPedidos);
    } else {
      setSelectedFornecedor(null);
    }

    // 2. Popula o header da pré-nota com o código correto do fornecedor
    const dataEmissaoApenasData = normalizeDateString(xmlData.dataEmissao);

    const mappedHeader: Partial<PreNotaHeader> = {
      FILIAL: filialCodigo?.trim() || "",
      OPCAO: 3,
      TIPO: "N",
      FORNECEDOR: fornecedor?.A2_COD || "", // usa o código real do fornecedor
      LOJA: fornecedorLoja,
      DOC: xmlData.numero?.trim() || "",
      SERIE: xmlData.serie?.trim() || "",
      ESPECIE: "NF",
      CHVNF: chaveDFe,
      USERAPP: username,
      DTINC: dataEmissaoApenasData,
    };

    console.log(`[${UTILS_NAME}] Mapeando ${xmlData.itens.length} itens.`);
    const mappedItens: PreNotaItem[] = xmlData.itens.map((itemXml, index): PreNotaItem => {
        return {
          ITEM: String(index + 1).padStart(4, '0'),
          PRODUTO: "",
          PRODFOR: itemXml.codProduto?.trim() || "",
          DESCFOR: itemXml.descProduto?.trim() || "",
          ORIGEMXML: itemXml.origem?.trim() || "",
          QUANTIDADE: parseFloatOrZero(itemXml.quantidade),
          VALUNIT: parseFloatOrZero(itemXml.valorUnitario),
          TOTAL: parseFloatOrZero(itemXml.valorTotal),
          B1_UM: itemXml.unidade?.trim() || "",
          ORIGEM: "", // preenchido posteriormente
          PC: "",
          ITEMPC: "",
          SEGUN: "",
          TPFATO: "",
          CONV: 1,
        };
      });
      

    setHeader(mappedHeader);
    setItens(mappedItens);
    setModoXml();
    setXmlDataLoadedSuccess();

    console.log(`[${UTILS_NAME}] População dos stores concluída.`);
  } catch (error) {
    console.error(`[${UTILS_NAME}] Erro ao popular stores:`, error);
    throw error;
  }
}
