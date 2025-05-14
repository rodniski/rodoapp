// @login/hooks/useAuth.ts (Com trim no username e nos dados das APIs e tratamento de erro aprimorado)
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
import { toast } from "sonner";
import { trimStringProperties } from "utils";
import { useUserGruposHandler } from "./grupo";

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
        toast.error("Nome de usuário não pode ser vazio.");
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

        // 2. Busca e Armazena Grupos do Usuário usando o hook dedicado
        // O hook useUserGruposHandler já lida com o loading, erro e salvamento na useAuthStore.
        console.log(
          "[Auth] Solicitando busca de grupos via useUserGruposHandler..."
        );
        const gruposCarregadosComSucesso = await fetchAndStoreUserGrupos(
          trimmedUsername
        );
        // Não precisamos pegar os grupos aqui, pois eles já estão na useAuthStore.
        // A notificação de erro/sucesso da busca de grupos é feita dentro do useUserGruposHandler.

        if (!gruposCarregadosComSucesso) {
          // Opcional: Adicionar lógica aqui se a falha na busca de grupos deve impedir o login.
          // Por padrão, o login continua e a store terá grupos vazios ou o erro registrado.
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
          console.error("[Auth] Erro ao buscar carga inicial de dados:", err);
          toast.error(
            `Erro ao buscar dados iniciais: ${
              err.message || "Erro desconhecido."
            }`
          );
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
          console.error("[Auth] Erro ao buscar filiais gerais:", err);
          toast.error(
            `Erro ao buscar lista de filiais: ${
              err.message || "Erro desconhecido."
            }`
          );
        }

        // 5. Monta o UserSession
        // Os grupos são lidos do estado atual da store, que foi atualizado pelo useUserGruposHandler
        const gruposDaStore = useAuthStore.getState().grupos;

        const userSessionData: UserSession = {
          username: trimmedUsername,
          accessToken: authResponse.access_token,
          refreshToken: authResponse.refresh_token,
          expiresAt: Date.now() + (authResponse.expires_in || 0) * 1000,
          grupos: gruposDaStore, // Usa os grupos da store, atualizados pelo hook
          filiais: filiaisAcessoLimpo,
        };
        console.log("[Auth] Sessão do usuário montada:", userSessionData);

        // 6. Popula auth-store com a sessão completa
        setUser(userSessionData); // Esta ação na sua store também atualiza state.grupos e state.filiais
        console.log("[Auth] AuthStore atualizado com a sessão completa.");

        // 7. Popula aux-store com dados auxiliares
        loadInitialData({
          filiais: filiaisGeraisLimpo,
          unidadeMedida: unidadesMedidaLimpo,
          condicoes: condicoesLimpo,
          centroCusto: centrosCustoLimpo,
        });
        console.log("[Auth] AuxStore atualizado.");

        toast.success("Login realizado com sucesso!");
        console.log("[Auth] Processo de login concluído com sucesso.");
        console.groupEnd();
        return true;
      } catch (err: any) {
        // Captura erros primários, como falha na autenticação
        console.error("[Auth] Falha crítica no processo de login:", err);
        const errorMessage =
          err.response?.data?.error_description ||
          err.response?.data?.message ||
          err.message ||
          "Erro desconhecido durante o login.";
        toast.error(`Falha no login: ${errorMessage}`);
        useAuthStore.setState({ error: errorMessage }); // Salva o erro principal na store
        console.groupEnd();
        return false;
      } finally {
        // O isLoading para a busca de grupos é gerenciado pelo useUserGruposHandler
        // Este finally deve garantir que o isLoading geral do login seja resetado.
        // Se fetchAndStoreUserGrupos definir isLoading:false, este pode ser redundante ou causar um set a mais.
        // Idealmente, o isLoading da useAuthStore refletiria o processo de login como um todo.
        // O useUserGruposHandler já seta isLoading:false na store ao concluir sua tarefa.
        useAuthStore.setState({ isLoading: false });
        console.log(
          "[Auth] isLoading (geral do login) definido como false (bloco finally)."
        );
      }
    },
    [setUser, loadInitialData, fetchAndStoreUserGrupos] // Adiciona fetchAndStoreUserGrupos às dependências
  );

  const logout = useCallback(() => {
    logoutFromStore();
    // Opcional: Limpar grupos também do useUserGruposHandler se ele tivesse estado local,
    // mas como ele opera na useAuthStore, o logout da useAuthStore já deve cobrir.
    toast.info("Você foi desconectado.");
  }, [logoutFromStore]);

  // Seletores de estado para o retorno do hook
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading); // Reflete o isLoading geral da store
  const error = useAuthStore((state) => state.error); // Reflete o erro geral da store
  const gruposFromStore = useAuthStore((state) => state.grupos); // Grupos diretamente da store

  return {
    user,
    grupos: gruposFromStore || EMPTY_GRUPOS_ARRAY, // Usa os grupos da store
    filiaisAcesso: user?.filiais || EMPTY_FILIAIS_ACESSO_ARRAY, // Filiais de acesso ainda vêm do user object
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
  };
}
