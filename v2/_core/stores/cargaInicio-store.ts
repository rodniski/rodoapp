// app/(modules)/prenota/_lib/stores/cargaInicioStore.ts
import { create } from 'zustand';
import type { UnidadeMedida, Condicao, CentroCusto } from 'types';

interface CargaInicioState {
  unidadeMedida: UnidadeMedida[];
  condicoes: Condicao[];
  centroCusto: CentroCusto[];
  setCargaInicioData: (data: {
    unidadeMedida: UnidadeMedida[];
    condicoes: Condicao[];
    centroCusto: CentroCusto[];
  }) => void;
}

export const useCargaInicioStore = create<CargaInicioState>((set) => ({
  unidadeMedida: [],
  condicoes: [],
  centroCusto: [],
  setCargaInicioData: ({ unidadeMedida, condicoes, centroCusto }) => {
    set({ unidadeMedida, condicoes, centroCusto });
  },
}));