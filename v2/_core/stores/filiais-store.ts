// app/(modules)/prenota/_lib/stores/filiaisStore.ts
import { create } from 'zustand';
import type { Filial } from 'types';

interface FiliaisState {
  filiais: Filial[];
  filiaisLoading: boolean;
  fetchFiliais: () => Promise<void>;
}

export const useFiliaisStore = create<FiliaisState>((set) => ({
  filiais: [],
  filiaisLoading: false,
  fetchFiliais: async () => {
    set({ filiaisLoading: true });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_PRODUCTION_URL}reidoapsdu/consultar/filiais/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Erro ao buscar filiais: ${response.statusText}`);
      }

      const data = await response.json();

      const formattedData = data.map((filial: Filial) => ({
        numero: filial.numero.trim(),
        filial: filial.filial.trim(),
        cnpjFilial: filial.cnpjFilial.trim(),
      }));

      set({ filiais: formattedData });
    } catch (error) {
      console.error('Erro ao buscar filiais:', error);
    } finally {
      set({ filiaisLoading: false });
    }
  },
}));