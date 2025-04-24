// @inclusao/hooks/conexao/useFetchXmlDetails.ts (Atualizado para usar useXmlHistoryStore)
import { useState, useCallback } from "react";
// Importa os stores necessários
import { usePreNotaAuxStore,useXmlHistoryStore } from "@inclusao/stores";
// Importa API e Tipos
import { getDfeDetalhesXmlSimples } from "@inclusao/api";
import type { ConexaoNfeDetalhesResponse } from "@inclusao/api";
// Importa Utils
import { parseFloatOrZero } from "utils"; // Ajuste path se necessário

const HOOK_NAME = "useFetchXmlDetails";

interface UseFetchXmlDetailsReturn {
  fetchDetails: (chaveDFe: string) => Promise<ConexaoNfeDetalhesResponse | null>;
  isLoading: boolean;
  error: string | null;
}

export function useFetchXmlDetails(): UseFetchXmlDetailsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // O useCallback não depende mais das ações diretamente
  const fetchDetails = useCallback(
    async (chaveDFe: string): Promise<ConexaoNfeDetalhesResponse | null> => {
      console.log(`[${HOOK_NAME}] Iniciando busca XML: ${chaveDFe}`);
      setIsLoading(true);
      setError(null);

      // Limpa total anterior via getState do PreNotaAuxStore
      try { usePreNotaAuxStore.getState().totalNf.clearValorTotalXml(); }
      catch(e) { console.error(`[${HOOK_NAME}] Erro ao limpar totalNf:`, e); }

      try {
        // 1. Chama a API
        const xmlData = await getDfeDetalhesXmlSimples(chaveDFe);
        console.log(`[${HOOK_NAME}] XML recebido com sucesso.`);

        // 2. Atualiza stores auxiliares via getState()
        try {
            // ✅ Chama ação do NOVO useXmlHistoryStore
            useXmlHistoryStore.getState().addToXmlHistory(chaveDFe);

            // Chama ação do usePreNotaAuxStore (para totalNF)
            const totalFromXml = parseFloatOrZero(xmlData.valorTotalDaNota);
            usePreNotaAuxStore.getState().totalNf.setValorTotalXml(totalFromXml);

            console.log(`[${HOOK_NAME}] Stores Auxiliares atualizados: Histórico e Total NF (${totalFromXml}).`);
        } catch(storeError) {
            console.error(`[${HOOK_NAME}] Erro ao atualizar Stores Auxiliares pós-fetch:`, storeError);
            // Considerar se este erro deve impedir o retorno do xmlData
             throw storeError; // Re-lança para o catch principal
        }

        // 3. Retorna os dados do XML para o orquestrador (useSearchXml)
        return xmlData;

      } catch (err) { // Erro da API ou do store
        console.error(`[${HOOK_NAME}] Erro no fetchDetails para ${chaveDFe}:`, err);
        const errorMsg = err instanceof Error ? err.message : "Erro desconhecido ao buscar detalhes do XML.";
        setError(errorMsg);
         // Garante limpeza do total no erro
        try { usePreNotaAuxStore.getState().totalNf.clearValorTotalXml(); }
        catch(e) { console.error(`[${HOOK_NAME}] Erro ao limpar totalNf no catch:`, e); }
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [] // Array de dependências do useCallback vazio, pois ações são via getState
  );

  return { fetchDetails, isLoading, error };
}