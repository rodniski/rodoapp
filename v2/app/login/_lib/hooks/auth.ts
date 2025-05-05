// @login/hooks/useAuth.ts (Com trim no username e nos dados das APIs)
import { useCallback } from "react";
import {
  authenticateUser,
  getUserGrupoFilial,
  fetchCargaInicio,
  fetchFiliais,
} from "@/app/login/_lib/api"; // Ajuste path API
import { useAuthStore } from "@/app/login/_lib/stores/auth-store"; // Ajuste path Store
import { useAuxStore }  from "@/app/login/_lib/stores/aux-store";  // Ajuste path Store
// Ajuste path Types e importe todos os tipos necessários
import type {
  AuthResponse,
  GrupoFilial,
  FilialGeral, // Tipo para fetchFiliais
  CargaInicio,
  UserSession,
  FilialAcesso, // Assumindo que CargaInicio.Filiais usa este tipo ou similar
  UnidadeMedida, // Tipo para CargaInicio.UnidadeMedida
  Condicao, // Tipo para CargaInicio.Condicoes (exemplo de nome)
  CentroCusto // Tipo para CargaInicio.CentoCusto (exemplo de nome)
} from "@/app/login/_lib/types";

export function useAuth() {
  const { setUser, logout } = useAuthStore();
  const { loadInitialData } = useAuxStore();

  // Função auxiliar para limpar strings em um objeto (evita erros com null/undefined)
  const trimStringProperties = <T extends object>(obj: T): T => {
    if (!obj) return obj;
    const newObj = { ...obj };
    for (const key in newObj) {
      if (typeof newObj[key] === 'string') {
        (newObj as any)[key] = (newObj[key] as string).trim();
      }
    }
    return newObj;
  };

  const login = useCallback(
    async (username: string, password: string): Promise<boolean> => {
      // 1. Limpa Username e Valida
      const trimmedUsername = username.trim();
      const originalPassword = password; // Não fazer trim na senha
      if (!trimmedUsername) {
          console.error("[Auth] Username não pode ser vazio.");
          useAuthStore.setState({ isLoading: false, error: "Usuário inválido." }); // Seta erro
          return false;
      }

      console.group(`[Auth] Iniciando login para: ${trimmedUsername}`);
      useAuthStore.setState({ isLoading: true, error: null }); // Limpa erro anterior

      try {
        // 2. Autentica
        console.log("[Auth] Autenticando...");
        const auth: AuthResponse = await authenticateUser(trimmedUsername, originalPassword);
        console.log("[Auth] Autenticado.");

        // 3. Busca Grupos
        let grupos: GrupoFilial[] = [];
        try {
          console.log("[Auth] Buscando grupos...");
          const rawGrupos = await getUserGrupoFilial(trimmedUsername, auth.access_token);
          // ✅ Limpa strings dentro dos objetos GrupoFilial (AJUSTE AS PROPRIEDADES!)
          grupos = rawGrupos.map(g => trimStringProperties(g));
          // Exemplo se precisasse limpar campos específicos:
          // grupos = rawGrupos.map(g => ({ ...g, nomeGrupo: g.nomeGrupo?.trim(), codGrupo: g.codGrupo?.trim() }));
          console.log("[Auth] Grupos buscados e limpos:", grupos.length);
        } catch (err: any) { /* ... warning ... */ }

        // 4. Busca Carga Inicial
        let carga: CargaInicio = { Filiais: [], UnidadeMedida: [], Condicoes: [], CentoCusto: [] };
        let cargaFiliaisLimpa: FilialAcesso[] = [];
        let cargaUMLimpa: UnidadeMedida[] = [];
        let cargaCondLimpa: Condicao[] = [];
        let cargaCCLimpa: CentroCusto[] = [];
        try {
          console.log("[Auth] Buscando carga inicial...");
          carga = await fetchCargaInicio(trimmedUsername);
          console.log("[Auth] Carga inicial recebida.");

          // ✅ Limpa Filiais da carga (AJUSTE AS PROPRIEDADES!)
          cargaFiliaisLimpa = carga.Filiais.map(f => trimStringProperties(f));
          // Exemplo específico:
          // cargaFiliaisLimpa = carga.Filiais.map(f => ({ ...f, M0_CODFIL: f.M0_CODFIL?.trim(), M0_FILIAL: f.M0_FILIAL?.trim() }));

          // ✅ Limpa UnidadeMedida da carga (AJUSTE AS PROPRIEDADES!)
          cargaUMLimpa = carga.UnidadeMedida.map(um => trimStringProperties(um));
          // Exemplo: cargaUMLimpa = carga.UnidadeMedida.map(um => ({ ...um, codigo: um.codigo?.trim(), descricao: um.descricao?.trim() }));

          // ✅ Limpa Condicoes da carga (AJUSTE AS PROPRIEDADES!)
          cargaCondLimpa = carga.Condicoes.map(c => trimStringProperties(c));
           // Exemplo: cargaCondLimpa = carga.Condicoes.map(c => ({ ...c, E4_CODIGO: c.E4_CODIGO?.trim(), E4_DESCRI: c.E4_DESCRI?.trim() }));

          // ✅ Limpa CentroCusto da carga (AJUSTE AS PROPRIEDADES!)
          cargaCCLimpa = carga.CentoCusto.map(cc => trimStringProperties(cc));
          // Exemplo: cargaCCLimpa = carga.CentoCusto.map(cc => ({ ...cc, CTT_CUSTO: cc.CTT_CUSTO?.trim(), CTT_DESC01: cc.CTT_DESC01?.trim() }));

          console.log("[Auth] Dados da carga inicial limpos.");

        } catch (err: any) { /* ... warning ... */ }

        // 5. Busca Filiais Gerais
        let filiaisGeral: FilialGeral[] = [];
        let filiaisGeralLimpa: FilialGeral[] = [];
        try {
          console.log("[Auth] Buscando filiais gerais...");
          filiaisGeral = await fetchFiliais();
          console.log("[Auth] Filiais gerais recebidas.");

          // ✅ Limpa Filiais gerais (AJUSTE AS PROPRIEDADES 'numero' e 'filial' ou 'nomeFilial')
          filiaisGeralLimpa = filiaisGeral.map(f => trimStringProperties(f));
          // Exemplo específico:
          // filiaisGeralLimpa = filiaisGeral.map(f => ({ ...f, numero: f.numero?.trim(), filial: f.filial?.trim() }));
          console.log("[Auth] Filiais gerais limpas.");

        } catch (err: any) { /* ... warning ... */ }

        // 6. Monta o UserSession (com dados limpos)
        const session: UserSession = {
          username: trimmedUsername, // Username limpo
          accessToken:  auth.access_token,
          refreshToken: auth.refresh_token,
          expiresAt:    Date.now() + auth.expires_in * 1000,
          grupos: grupos, // Grupos limpos
          filiais: cargaFiliaisLimpa, // Filiais da carga limpas
        };
        console.log("[Auth] Sessão montada com dados limpos:", session);

        // 7. Popula auth-store (com dados limpos)
        setUser(session);
        console.log("[Auth] Auth Store populado."); // Log do estado completo pode ser muito grande

        // 8. Popula aux-store (com dados limpos)
        loadInitialData({
          filiais:       filiaisGeralLimpa, // Filiais gerais limpas
          unidadeMedida: cargaUMLimpa,      // UMs limpas
          condicoes:     cargaCondLimpa,    // Condições limpas
          centroCusto:   cargaCCLimpa,      // CCs limpos
        });
        console.log("[Auth] Aux Store populado."); // Log do estado completo pode ser muito grande

        // 9. Finaliza e retorna sucesso
        useAuthStore.setState({ isAuthenticated: true });
        console.log("[Auth] Autenticado com sucesso.");
        console.groupEnd();
        return true; // Sucesso no login

      } catch (err: any) { // Erro principal (geralmente na autenticação)
        console.error("[Auth] Falha no processo de login:", err);
        console.groupEnd();
        return false; // Falha no login
      } finally {
        useAuthStore.setState({ isLoading: false });
        console.log("[Auth] isLoading = false");
      }
    },
    [setUser, loadInitialData] // Dependências do useCallback
  );

  // Retorno do Hook (mantido)
  return {
    user:            useAuthStore((s) => s.user),
    grupos:          useAuthStore((s) => s.grupos),
    filiaisAcesso:   useAuthStore((s) => s.filiais), // Filiais que o usuário TEM acesso (da carga)
    isAuthenticated: useAuthStore((s) => s.isAuthenticated),
    isLoading:       useAuthStore((s) => s.isLoading),

    login,
    logout,
  };
}