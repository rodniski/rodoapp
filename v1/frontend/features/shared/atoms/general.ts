// src/atoms/general.ts
import { atom } from "jotai";
import {
  UnidadeMedida,
  CondicaoPagamento,
  CentroCusto,
  AccessFilial,
} from "types";
import {atomWithStorage} from "jotai/utils";

export const unidadeMedidaAtom = atom<UnidadeMedida[]>([]);
export const condicoesPagamentoAtom = atom<CondicaoPagamento[]>([]);
export const centrosCustoAtom = atom<CentroCusto[]>([]);
export const accessFiliaisAtom = atom<AccessFilial[]>([]);
export const prenotaGroup = atomWithStorage<string | null>("grupoId", null);
