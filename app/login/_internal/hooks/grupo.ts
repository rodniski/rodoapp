// @/app/login/_internal/hooks/useUserGruposHandler.ts
// (Ajuste o caminho conforme sua estrutura)

import { useCallback } from "react";
import { toast } from "sonner";
import { useAuthStore } from "@login/stores"; // Ajuste o caminho
import { getUserGrupoFilial } from "@login/api"; // Ajuste o caminho
import type { GrupoFilial } from "@login/types"; // Ajuste o caminho
import { trimStringProperties } from "utils"; // Ajuste o caminho

interface UseUserGruposHandlerReturn {
  /**
   * Busca os grupos do usuário e atualiza a useAuthStore.
   * @param username O nome do usuário.
   * @returns Promise<boolean> indicando sucesso (true) ou falha (false) da operação.
   */
  fetchAndStoreUserGrupos: (username: string) => Promise<boolean>;
  /**
   * Grupos do usuário, lidos diretamente da useAuthStore.
   */
  grupos: GrupoFilial[];
  /**
   * Estado de carregamento da useAuthStore (reflete o carregamento do login ou desta busca).
   */
  isLoading: boolean;
  /**
   * Erro registrado na useAuthStore.
   */
  error: string | null;
}

export function useUserGruposHandler(): UseUserGruposHandlerReturn {
  const setAuthGrupos = useAuthStore((state) => state.setGrupos);

  // Seletores de estado
  const grupos = useAuthStore((state) => state.grupos);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const fetchAndStoreUserGrupos = useCallback(
    async (username: string): Promise<boolean> => {
      if (!username || !username.trim()) {
        const msg = "Nome de usuário é obrigatório para buscar grupos.";
        console.warn(`[useUserGruposHandler] ${msg}`);
        // Opcionalmente, atualizar o erro na store se este hook for a única fonte de erro para grupos
        // setAuthError(msg);
        return false;
      }

      const trimmedUsername = username.trim();
      console.log(
        `[useUserGruposHandler] Iniciando busca de grupos para: ${trimmedUsername}`
      );

      // Atualiza o estado de loading e limpa erros anteriores na AuthStore
      // É importante que sua store tenha ações separadas para setLoading e setError
      // ou que você use useAuthStore.setState diretamente se preferir.
      useAuthStore.setState({ isLoading: true, error: null });

      try {
        const rawGrupos = await getUserGrupoFilial(trimmedUsername);
        const gruposData = Array.isArray(rawGrupos) ? rawGrupos : [];
        const cleanedGrupos = trimStringProperties(gruposData);

        setAuthGrupos(cleanedGrupos); // Usa a ação setGrupos da AuthStore
        useAuthStore.setState({ isLoading: false }); // Finaliza o loading na AuthStore

        console.log(
          "[useUserGruposHandler] Grupos buscados e salvos na AuthStore:",
          cleanedGrupos.length
        );
        if (cleanedGrupos.length === 0) {
          // toast.info("Nenhum grupo encontrado para este usuário."); // Opcional
        }
        return true;
      } catch (err: any) {
        console.error(
          "[useUserGruposHandler] Erro detalhado ao buscar e salvar grupos:",
          err
        );
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Erro desconhecido ao buscar grupos.";

        toast.error(`Falha ao carregar grupos: ${errorMessage}`);
        useAuthStore.setState({
          error: errorMessage,
          isLoading: false,
          grupos: [],
        }); // Atualiza erro e limpa grupos na AuthStore

        return false;
      }
    },
    [setAuthGrupos]
  ); // setAuthGrupos é estável se definido corretamente na store

  return {
    fetchAndStoreUserGrupos,
    grupos,
    isLoading,
    error,
  };
}
