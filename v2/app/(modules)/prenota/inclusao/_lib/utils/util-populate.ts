// @/utils/populateUtils.ts (ou @inclusao/utils/...)

import { usePreNotaStore, usePreNotaAuxStore } from "@inclusao/stores";
// Ajuste os imports de tipos
import type { PreNotaHeader, PreNotaItem } from "@inclusao/types";
import type { ConexaoNfeDetalhesResponse, Fornecedor } from "@inclusao/api";
// Importa helpers do novo local
import { parseFloatOrZero, normalizeDateString } from "utils";

const UTILS_NAME = "populateStoresFromXml";

interface PopulateParams {
    xmlData: ConexaoNfeDetalhesResponse;
    fornecedor: Fornecedor | undefined | null; // Primeiro fornecedor encontrado no lookup
    filialCodigo: string;                     // Código da filial já resolvido
    username: string;                         // Username já resolvido
    chaveDFe: string;                         // Chave original
}

/**
 * Popula os stores PreNotaStore (draft) e PreNotaAuxStore (selection)
 * com os dados processados a partir do XML e dos lookups realizados.
 * Esta função é síncrona e espera receber todos os dados necessários.
 */
export function populateStoresFromXml({
    xmlData,
    fornecedor,
    filialCodigo,
    username,
    chaveDFe
}: PopulateParams): void {
    console.log(`[${UTILS_NAME}] Iniciando população dos stores...`);
    try {
        // Pega ações necessárias dos stores via getState
        const { setHeader, setItens, setModoXml } = usePreNotaStore.getState();
        const { setSelectedFornecedor } = usePreNotaAuxStore.getState().selection;
        const { setXmlDataLoadedSuccess } = usePreNotaAuxStore.getState().loadStatus;

        // Prepara dados do fornecedor (com defaults)
        const fornecedorLoja = fornecedor?.A2_LOJA || "01";
        const nomeFornecedor = fornecedor?.A2_NOME || fornecedor?.A2_NREDUZ || "";

        // 1. Atualizar Store Auxiliar (Seleção de Fornecedor)
         console.log(`[${UTILS_NAME}] Atualizando seleção de fornecedor no Aux Store.`);
        setSelectedFornecedor({
            cod: xmlData.cnpjEmitente, // Usa CNPJ como código aqui
            loja: fornecedorLoja,
            nome: nomeFornecedor,
        });

        // 2. Mapear Header para Store Principal
         console.log(`[${UTILS_NAME}] Mapeando Header para PreNota Store.`);
         // Usa helper para garantir apenas data em DTINC
        const dataEmissaoApenasData = normalizeDateString(xmlData.dataEmissao);

        const mappedHeader: Partial<PreNotaHeader> = {
            FILIAL: filialCodigo?.trim() || "", // Garante trim e default
            OPCAO: 3, TIPO: "N", FORNECEDOR: xmlData.cnpjEmitente,
            LOJA: fornecedorLoja, DOC: xmlData.numero?.trim() || "", // Trim em campos do XML
            SERIE: xmlData.serie?.trim() || "", // Trim em campos do XML
            ESPECIE: "NF", CHVNF: chaveDFe, USERAPP: username,
            DTINC: dataEmissaoApenasData, // Data Normalizada
             // Adicione aqui outros campos do header que você queira pré-popular
             // que existam em PreNotaHeader e venham do xmlData (ex: valorTotalDaNota se adicionado)
             // valorTotalDaNota: parseFloatOrZero(xmlData.valorTotalDaNota),
        };

        // 3. Mapear Itens do XML (usando PreNotaItem)
         console.log(`[${UTILS_NAME}] Mapeando ${xmlData.itens.length} itens.`);
        const mappedItens: PreNotaItem[] = xmlData.itens.map(
          (itemXml, index): PreNotaItem => {
            // Mapeia campos que existem em PreNotaItem a partir do XML
            const baseItem: PreNotaItem = {
                ITEM: String(index + 1).padStart(4, '0'),
                PRODUTO: "", // Popular depois
                QUANTIDADE: parseFloatOrZero(itemXml.quantidade),
                VALUNIT: parseFloatOrZero(itemXml.valorUnitario),
                PRODFOR: itemXml.codProduto?.trim() || "", // Trim
                DESCFOR: itemXml.descProduto?.trim() || "", // Trim
                ORIGEMXML: itemXml.origem?.trim() || "",  // Trim
                TOTAL: parseFloatOrZero(itemXml.valorTotal),
                PC: "", // Popular depois
                ITEMPC: "", // Popular depois
                B1_UM: itemXml.unidade?.trim() || "", // Trim
                ORIGEM: "", // Popular depois
                 // Adicione NCM, CST, CFOP, Impostos aqui se existirem em PreNotaItem e no xmlData.itens[x]
                 // ncmsh: itemXml.ncmsh?.trim(), // Exemplo com Trim
            };
            // Remove chaves undefined (limpeza opcional)
            Object.keys(baseItem).forEach(k => baseItem[k as keyof PreNotaItem] === undefined && delete baseItem[k as keyof PreNotaItem]);
            return baseItem;
          }
        );

        // 4. Atualizar Store Principal (Header, Itens, Modo)
         console.log(`[${UTILS_NAME}] Atualizando PreNota Store.`);
        setHeader(mappedHeader);
        setItens(mappedItens);
        setModoXml();

        // 5. Sinalizar Sucesso no Store Auxiliar
        setXmlDataLoadedSuccess();

        console.log(`[${UTILS_NAME}] População dos stores concluída.`);

    } catch (error) {
        console.error(`[${UTILS_NAME}] Erro ao popular stores:`, error);
        // Lança para o hook orquestrador tratar
        throw error;
    }
}