import { create } from "zustand";
import { ItemNF } from "../types";

type BorrachariaState = {
  filial: string;
  origem: string;
  doc: string;
  serie: string;
  codCliente: string;
  loja: string;
  produtoCod: string;
  item: string;
  retirado: string;
  respRet: string;
  placa: string;
  obs: string;
  respCarreg: string;
  quantidade: number;
  selectedItems: ItemNF[];

  setField: <K extends keyof BorrachariaState>(key: K, value: BorrachariaState[K]) => void;
  setSelectedItems: (items: ItemNF[]) => void;
};

export const useBorrachariaStore = create<BorrachariaState>((set) => ({
  filial: "",
  origem: "S",
  doc: "",
  serie: "",
  codCliente: "",
  loja: "",
  produtoCod: "",
  item: "",
  retirado: "C",
  respRet: "",
  placa: "",
  obs: "",
  respCarreg: "",
  quantidade: 0,
  selectedItems: [],

  setField: (key, value) => set((state) => ({ ...state, [key]: value })),
  setSelectedItems: (items) => set({ selectedItems: items }),
}));
