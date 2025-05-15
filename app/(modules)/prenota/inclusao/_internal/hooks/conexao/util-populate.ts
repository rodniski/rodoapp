/**
 * @/utils/populateUtils.ts (ou @inclusao/utils/...)
 */

import { usePreNotaStore, usePreNotaAuxStore } from "@inclusao/stores";
import type { PreNotaHeader, PreNotaItem } from "@inclusao/types";
import type { ConexaoNfeDetalhesResponse, Fornecedor } from "@inclusao/api";
import { parseFloatOrZero, normalizeDateString } from "utils"; // Supondo que parseFloatOrZero e normalizeDateString estejam em utils

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
    // Pega as actions/setters dos stores usando getState (como no código original)
    const { setHeader, setItens, setModoXml } = usePreNotaStore.getState();
    const { setSelectedFornecedor } = usePreNotaAuxStore.getState().selection;
    const { setXmlDataLoadedSuccess } =
      usePreNotaAuxStore.getState().loadStatus;
    // --- ADICIONADO: Pega a action para setar o total do XML ---
    const { setValorTotalXml } = usePreNotaAuxStore.getState().totalNf;
    // --- FIM ADIÇÃO ---

    const fornecedorLoja = fornecedor?.A2_LOJA || "01";
    // const nomeFornecedor = fornecedor?.A2_NOME || fornecedor?.A2_NREDUZ || ""; // Não está sendo usado

    // 1. Atualiza o fornecedor selecionado no store auxiliar
    if (fornecedor) {
      const { PEDIDOS, ...fornecedorSemPedidos } = fornecedor; // Remove PEDIDOS se existir
      setSelectedFornecedor(fornecedorSemPedidos);
    } else {
      setSelectedFornecedor(null);
    }

    // 2. Popula o header da pré-nota
    const dataEmissaoApenasData = normalizeDateString(xmlData.dataEmissao);

    const mappedHeader: Partial<PreNotaHeader> = {
      FILIAL: filialCodigo?.trim() || "",
      OPCAO: 3,
      TIPO: "N",
      FORNECEDOR: fornecedor?.A2_COD || "", // Código real do fornecedor
      LOJA: fornecedorLoja,
      DOC: xmlData.numero?.trim() || "",
      SERIE: xmlData.serie?.trim() || "",
      ESPECIE: "NF", // Fixo NF ou pode vir do XML?
      CHVNF: chaveDFe,
      USERAPP: username,
      DTINC: dataEmissaoApenasData, // Data de emissão como data de inclusão
      // Outros campos do header podem precisar de valores default ou vir do XML
      // Ex: CONDFIN, OBS, etc. - verificar se precisam ser populados aqui
    };

    console.log(`[${UTILS_NAME}] Mapeando ${xmlData.itens.length} itens.`);
    // 3. Mapeia os itens do XML para o formato PreNotaItem
    const mappedItens: PreNotaItem[] = xmlData.itens.map(
      (itemXml, index): PreNotaItem => {
        return {
          ITEM: String(index + 1).padStart(5, "0"), // Gera sequencial
          PRODUTO: "", // Precisa ser preenchido depois (match com cadastro)
          PRODFOR: itemXml.codProduto?.trim() || "",
          DESCFOR: itemXml.descProduto?.trim() || "",
          ORIGEMXML: itemXml.origem?.trim() || "",
          QUANTIDADE: parseFloatOrZero(itemXml.quantidade), // Converte para número
          VALUNIT: parseFloatOrZero(itemXml.valorUnitario), // Converte para número
          TOTAL: parseFloatOrZero(itemXml.valorTotal), // Converte para número
          B1_UM: itemXml.unidade?.trim() || "",
          // Campos que precisam ser preenchidos/definidos posteriormente
          ORIGEM: "",
          PC: "",
          ITEMPC: "",
          SEGUN: "",
          TPFATO: "",
          CONV: 1, // Valor padrão ou precisa vir de algum lugar?
        };
      }
    );

    // --- ADICIONADO: Cálculo e armazenamento do valor total do XML ---
    // 4. Calcula a soma dos totais de todos os itens mapeados
    const totalCalculadoXml = mappedItens.reduce(
      (sum, currentItem) => sum + (currentItem.TOTAL || 0), // Soma item.TOTAL, tratando null/undefined como 0
      0 // Valor inicial da soma
    );
    console.log(
      `[${UTILS_NAME}] Valor total calculado dos itens: ${totalCalculadoXml}`
    );
    // Armazena o total calculado na store auxiliar
    setValorTotalXml(totalCalculadoXml);
    // --- FIM ADIÇÃO ---

    // 5. Atualiza os stores principais da PreNota
    setHeader(mappedHeader); // Atualiza o header (parcialmente)
    setItens(mappedItens); // Define os itens mapeados
    setModoXml(); // Define o modo como XML
    setXmlDataLoadedSuccess(); // Marca que o XML foi carregado com sucesso

    console.log(`[${UTILS_NAME}] População dos stores concluída.`);
  } catch (error) {
    console.error(`[${UTILS_NAME}] Erro ao popular stores:`, error);
    // Re-throw para que o chamador possa tratar o erro se necessário
    throw new Error(
      `Falha ao processar dados do XML: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
