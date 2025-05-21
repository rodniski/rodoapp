/* ───────────────────────────  useAuth.ts  ───────────────────────────
 * Hook para autenticação de usuários no RodoApp.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Gerencia login, logout, e carga de dados iniciais
 *  ├────────────┤  (filiais, grupos, unidades de medida, condições,
 *  │  FUNCIONAL │  centros de custo). Usa APIs do Protheus e Zustand
 *  │            │  stores para autenticação e estado.
 *  └────────────┘
 *  Integra com useUserGruposHandler para grupos e trimStringProperties
 *  para limpeza de dados.
 * -----------------------------------------------------------------------*/

import { useCallback } from "react";
import {
  authenticateUser,
  getUserGrupoFilial,
  fetchCargaInicio,
  fetchFiliais,
} from "@login/api";
import { useAuxStore, useAuthStore } from "@login/stores";
import type {
  AuthResponse,
  GrupoFilial,
  FilialGeral,
  CargaInicio,
  UserSession,
  FilialAcesso,
  UnidadeMedida,
  Condicao,
  CentroCusto,
} from "@login/types";
import { trimStringProperties } from "utils";
import { useUserGruposHandler } from "./grupo";
import { toast } from "sonner";

// Constantes para referências estáveis de arrays vazios
const EMPTY_GRUPOS_ARRAY: GrupoFilial[] = [];
const EMPTY_FILIAIS_ACESSO_ARRAY: FilialAcesso[] = [];

export function useAuth() {
  const setUser = useAuthStore((state) => state.setUser);
  const logoutFromStore = useAuthStore((state) => state.logout);
  const loadInitialData = useAuxStore((state) => state.loadInitialData);

  // Instancia o hook para manipulação de grupos
  const { fetchAndStoreUserGrupos } = useUserGruposHandler();

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      const trimmedUsername = username.trim();
      const originalPassword = password;

      if (!trimmedUsername) {
        return false;
      }

      console.group(`[Auth] Iniciando login para: ${trimmedUsername}`);
      useAuthStore.setState({ isLoading: true, error: null });

      try {
        // 1. Autentica Usuário
        console.log("[Auth] Autenticando...");
        const rawAuthResponse = await authenticateUser(
          trimmedUsername,
          originalPassword
        );
        const authResponse = trimStringProperties(rawAuthResponse);
        console.log("[Auth] Usuário autenticado.");

        // 2. Busca e Armazena Grupos do Usuário
        console.log(
          "[Auth] Solicitando busca de grupos via useUserGruposHandler..."
        );
        const gruposCarregadosComSucesso = await fetchAndStoreUserGrupos(
          trimmedUsername
        );

        if (!gruposCarregadosComSucesso) {
          console.warn(
            "[Auth] A busca de grupos falhou, mas o login prosseguirá se a autenticação foi bem-sucedida."
          );
        }

        // 3. Busca Carga Inicial (Filiais de Acesso, UMs, Condições, CCs)
        let cargaInicial: CargaInicio = {
          Filiais: [],
          UnidadeMedida: [],
          Condicoes: [],
          CentoCusto: [],
        };
        let filiaisAcessoLimpo: FilialAcesso[] = EMPTY_FILIAIS_ACESSO_ARRAY;
        let unidadesMedidaLimpo: UnidadeMedida[] = [];
        let condicoesLimpo: Condicao[] = [];
        let centrosCustoLimpo: CentroCusto[] = [];

        try {
          console.log("[Auth] Buscando carga inicial de dados...");
          const rawCargaInicial = await fetchCargaInicio(trimmedUsername);
          cargaInicial = trimStringProperties(rawCargaInicial);
          filiaisAcessoLimpo = cargaInicial.Filiais || [];
          unidadesMedidaLimpo = cargaInicial.UnidadeMedida || [];
          condicoesLimpo = cargaInicial.Condicoes || [];
          centrosCustoLimpo = cargaInicial.CentoCusto || [];
          console.log("[Auth] Carga inicial de dados buscada e limpa.");
        } catch (err: any) {
          console.log("[Auth] Erro ao buscar carga inicial de dados:", err);
        }

        // 4. Busca Filiais Gerais (para lookups)
        let filiaisGeraisLimpo: FilialGeral[] = [];
        try {
          console.log("[Auth] Buscando filiais gerais...");
          const rawFiliaisGerais = await fetchFiliais();
          filiaisGeraisLimpo = trimStringProperties(rawFiliaisGerais);
          console.log(
            "[Auth] Filiais gerais buscadas e limpas:",
            filiaisGeraisLimpo.length
          );
        } catch (err: any) {
          console.log("[Auth] Erro ao buscar filiais gerais:", err);
        }

        // 5. Monta o UserSession
        const gruposDaStore = useAuthStore.getState().grupos;

        const userSessionData: UserSession = {
          username: trimmedUsername,
          accessToken: authResponse.access_token,
          refreshToken: authResponse.refresh_token,
          expiresAt: Date.now() + (authResponse.expires_in || 0) * 1000,
          grupos: gruposDaStore,
          filiais: filiaisAcessoLimpo,
        };
        console.log("[Auth] Sessão do usuário montada:", userSessionData);

        // 6. Popula auth-store com a sessão completa
        setUser(userSessionData);
        console.log("[Auth] AuthStore atualizado com a sessão completa.");

        // 7. Popula aux-store com dados auxiliares
        loadInitialData({
          filiais: filiaisGeraisLimpo,
          unidadeMedida: unidadesMedidaLimpo,
          condicoes: condicoesLimpo,
          centroCusto: centrosCustoLimpo,
        });
        console.log("[Auth] AuxStore atualizado.");

        console.log("[Auth] Processo de login concluído com sucesso.");
        console.groupEnd();
        return true;
      } catch (err: any) {
        console.log("[Auth] Falha crítica no processo de login:", err);
        const errorMessage =
          err.response?.data?.error_description ||
          err.response?.data?.message ||
          err.message ||
          "Erro desconhecido durante o login.";
        useAuthStore.setState({ error: errorMessage });
        console.groupEnd();
        return false;
      } finally {
        useAuthStore.setState({ isLoading: false });
        console.log(
          "[Auth] isLoading (geral do login) definido como false (bloco finally)."
        );
      }
    },
    [setUser, loadInitialData, fetchAndStoreUserGrupos]
  );

  const logout = useCallback(() => {
    logoutFromStore();
    toast.info("Você foi desconectado.");
  }, [logoutFromStore]);

  // Seletores de estado para o retorno do hook
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const gruposFromStore = useAuthStore((state) => state.grupos);

  return {
    user,
    grupos: gruposFromStore || EMPTY_GRUPOS_ARRAY,
    filiaisAcesso: user?.filiais || EMPTY_FILIAIS_ACESSO_ARRAY,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}