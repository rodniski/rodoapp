import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// Define os átomos para armazenar as filiais e o estado de carregamento
export const filiaisAtom = atomWithStorage("filiais", [] as Filial[]);
export const filiaisLoadingAtom = atom(false);

export interface Filial {
  numero: string;
  filial: string;
  cnpjFilial: string;
}
