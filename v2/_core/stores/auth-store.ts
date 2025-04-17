// app/(modules)/prenota/_lib/stores/authStore.ts
import { create } from 'zustand';
import { signOut, getSession } from 'next-auth/react';
import type { Filial } from 'types';

type User = {
  id?: string;
  name?: string | null;
  email?: string | null;
  username?: string;
  grupo?: string;
};

type AuthStore = {
  user: User | null;
  filiais: Filial[];
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  fetchAndUpdateSession: () => Promise<void>;
  logout: () => Promise<void>;
  setGrupo: (grupo: string) => void;
  setFiliais: (filiais: Filial[]) => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  filiais: [],
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => {
    set({ user, isAuthenticated: !!user, isLoading: false });
  },

  fetchAndUpdateSession: async () => {
    if (!get().isLoading) set({ isLoading: true });
    try {
      const session = await getSession();
      if (session?.user) {
        const currentUserInStore = get().user;
        const userData: User = {
          id: (session.user as any).id ?? undefined,
          name: session.user.name,
          email: session.user.email,
          username: session.user.username,
          grupo: currentUserInStore?.grupo,
        };
        set({ user: userData, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error('Erro ao buscar sessão:', error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    set({ user: null, filiais: [], isAuthenticated: false, isLoading: false });
    await signOut({ redirect: false });
    localStorage.clear();
    sessionStorage.clear();
  },

  setGrupo: (grupo) => {
    set((state) => {
      if (state.user) {
        return { user: { ...state.user, grupo } };
      }
      return {};
    });
  },

  setFiliais: (filiais) => {
    set({ filiais });
  },
}));