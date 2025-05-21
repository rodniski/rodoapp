/**
 * _core/hooks/useSearchXml.ts (Orquestrador Refatorado V2)
 *
 * Hook para orquestrar a busca de NFe via XML, chamando microhooks/funções
 * para buscar detalhes, realizar lookups e popular os stores.
 */
import { useState, useCallback } from "react";

// Microhooks e Funções Utilitárias
import {
  useFetchXmlDetails,
  useSearchFornecedorPedidos,
} from "@inclusao/hooks";
import { findFilialCodigo, getCurrentUsername } from "utils";
import { populateStoresFromXml } from ".";
import { usePreNotaAuxStore } from "@inclusao/stores";

const HOOK_NAME = "useSearchXmlOrchestrator";

interface UseSearchXmlReturn {
  searchAndPopulate: (chaveDFe: string) => Promise<void>;
  isLoading: boolean; // Loading GERAL da orquestração
  error: string | null; // Erro GERAL da orquestração
}

export function useSearchXml(): UseSearchXmlReturn {
  // Estado geral de orquestração
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Instancia os hooks que gerenciam seus próprios estados de fetch
  // Usamos apenas as funções trigger deles aqui
  const {
    fetchDetails,
    error: errorXml,
  } = useFetchXmlDetails();
  const {
    searchFornecedor: lookupSupplierData,
  } = useSearchFornecedorPedidos();

  // Função principal orquestradora
  const searchAndPopulate = useCallback(
    async (chaveDFe: string): Promise<void> => {
      console.log(`[${HOOK_NAME}] Iniciando orquestração para: ${chaveDFe}`);
      setIsLoading(true); // Loading geral ON
      setError(null);
      // Limpa flags relevantes do Aux Store (outras limpezas ocorrem nos hooks/utils)
      try {
        usePreNotaAuxStore.getState().loadStatus.clearXmlDataLoadedFlag();
        usePreNotaAuxStore.getState().selection.clearSelectedFornecedor();
      } catch (e) {
        console.log("Erro limpeza inicial", e);
      }

      let xmlData = null; // Guarda dados do XML

      try {
        // Etapa 1: Buscar XML
        xmlData = await fetchDetails(chaveDFe);
        // Se fetchDetails retornou null, ele já setou seu erro interno. Propagamos.
        if (!xmlData) {
          throw new Error(errorXml || "Falha ao obter detalhes do XML.");
        }

        // Etapa 2: Buscar Fornecedor (hook aninhado gerencia seu loading/error/stores)
        // Não precisamos necessariamente esperar aqui se não precisarmos do resultado IMEDIATAMENTE
        // para as próximas etapas síncronas, mas vamos esperar para garantir que
        // o aux store (searchResult) seja populado antes da próxima etapa.
        const fornecedorResult = await lookupSupplierData({
          busca: xmlData.cnpjEmitente,
        });
        // Não tratamos erro aqui diretamente, populateStoresFromXml lidará com fornecedor nulo/vazio

        // Etapa 3: Buscar Filial (síncrono)
        const filialCodigo = findFilialCodigo(xmlData.cnpjDestinatario);
        // Não tratamos erro aqui diretamente, populateStoresFromXml lidará com código vazio

        // Etapa 4: Buscar Usuário (síncrono)
        const username = getCurrentUsername();

        // Etapa 5: Popular Stores (síncrono)
        // Passa todos os dados coletados para a função de população
        populateStoresFromXml({
          xmlData,
          fornecedor: fornecedorResult?.[0], // Passa apenas o primeiro encontrado ou undefined
          filialCodigo,
          username,
          chaveDFe,
        });

        console.log(`[${HOOK_NAME}] Orquestração concluída com sucesso.`);
      } catch (err) {
        // Captura erros lançados pelas etapas anteriores
        console.log(`[${HOOK_NAME}] Erro durante orquestração:`, err);
        const finalError =
          err instanceof Error
            ? err.message
            : "Erro desconhecido na orquestração.";
        setError(finalError);
        // Resetar stores principais aqui? Cuidado com loops.
        // Limpar estados auxiliares específicos que não foram limpos?
        try {
          usePreNotaAuxStore.getState().loadStatus.clearXmlDataLoadedFlag();
          usePreNotaAuxStore.getState().selection.clearSelectedFornecedor();
          // O totalNF já foi limpo no catch do useFetchXmlDetails ou no início
        } catch (e) {}
      } finally {
        setIsLoading(false); // Loading geral OFF
      }
    },
    // Depende apenas das funções trigger dos hooks aninhados
    [fetchDetails, lookupSupplierData, errorXml]
  );

  // Retorna o estado GERAL de loading/error e a função trigger
  return {
    searchAndPopulate,
    isLoading, //isLoadingXml || isLoadingSupplier || isLoading, // Poderia combinar? Fica complexo.
    error, // errorXml || errorSupplier || error, // Poderia combinar? Fica complexo.
  };
}
