import { create } from "zustand";
import { signOut, getSession } from "next-auth/react"; // Import Session type if needed

// Tipo User para a store Zustand - alinhado com sua Session + campos custom
type User = {
  id?: string;           // Vem da authorize -> session
  name?: string | null;    // Vem da authorize -> session
  email?: string | null;   // Vem da DefaultSession (pode ser null)
  // image?: string | null; // Vem da DefaultSession (provavelmente null aqui)
  username?: string;     // Adicionado via callbacks -> session
  grupo?: string;        // Gerenciado apenas pela store
  filial?: string;       // Gerenciado apenas pela store
};

type AuthStore = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void; // Mantido por flexibilidade
  fetchAndUpdateSession: () => Promise<void>;
  logout: () => Promise<void>;
  setGrupoFilial: (grupo: string, filial: string) => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Inicia carregando

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },

  fetchAndUpdateSession: async () => {
    if (!get().isLoading) set({ isLoading: true });
    try {
      const session = await getSession(); // Pega sessão NextAuth
      if (session?.user) {
        const currentUserInStore = get().user; // Pega usuário atual da store
        // Mapeia dados da session para o tipo User da store
        const userData: User = {
          // Campos da Session NextAuth
          id: (session.user as any).id ?? undefined, // Pegar id (ajuste se seu tipo for diferente)
          name: session.user.name,
          email: session.user.email,
          username: session.user.username, // Deve existir baseado na sua config!

          // Campos gerenciados pela store - manter valor atual se existir
          grupo: currentUserInStore?.grupo,
          filial: currentUserInStore?.filial,
        };
        set({ user: userData, isAuthenticated: true, isLoading: false });
      } else {
        // Sem sessão, limpa o estado
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error("Erro ao buscar sessão:", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    set({ user: null, isAuthenticated: false, isLoading: false }); // Limpa estado local
    await signOut({ redirect: false }); // Chama signOut do NextAuth
    // Limpeza opcional de localStorage/sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    // Considerar redirecionamento para /login aqui ou no componente
  },

  setGrupoFilial: (grupo, filial) => {
    set((state) => {
      if (state.user) { // Só atualiza se user não for null
        return { user: { ...state.user, grupo, filial } };
      }
      return {}; // Não faz nada se não houver usuário
    });
  },
}));