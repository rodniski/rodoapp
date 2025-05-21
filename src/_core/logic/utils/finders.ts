/* ───────────────────────────  finders.ts  ───────────────────────────
 * Utilitários para busca e formatação de dados de autenticação e filiais.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Fornece funções para obter username, código de filial
 *  ├────────────┤  por CNPJ, estado de autenticação, e opções de combobox
 *  │  FUNCIONAL │  para filiais e grupos do usuário, usando stores de
 *  │            │  autenticação e auxiliares.
 *  └────────────┘
 *  Integra com useAuthStore e useLoginAuxStore para acesso a dados.
 * -----------------------------------------------------------------------*/

import { useAuthStore } from "@/app/login/_internal/stores/auth-store";
import { useAuxStore as useLoginAuxStore } from "@/app/login/_internal/stores/aux-store";
import type { FilialGeral } from "@/app/login/_internal";
import { ComboboxItem } from "comp";
import { useMemo } from "react";
import { toast } from "sonner";

const DEFAULT_USERNAME = "USUARIO_DESCONHECIDO";

/**
 * Obtém o username do usuário logado a partir do useAuthStore.
 * @returns Username ou "USUARIO_DESCONHECIDO" se não disponível.
 */
export function getCurrentUsername(): string {
  try {
    const username = useAuthStore.getState().user?.username;
    return username?.trim() || DEFAULT_USERNAME;
  } catch (error) {
    toast.error("[getCurrentUsername] Erro:", error || "");
    return DEFAULT_USERNAME;
  }
}

/**
 * Busca o CÓDIGO da filial correspondente a um CNPJ na lista do useLoginAuxStore.
 * @param cnpjDestinatario CNPJ a ser procurado.
 * @returns O código da filial (ex: "0101") ou uma string vazia se não encontrado.
 */
export function findFilialCodigo(
  cnpjDestinatario: string | null | undefined
): string {
  const cleanCnpj = cnpjDestinatario?.replace(/\D/g, "");
  if (!cleanCnpj) {
    return "";
  }

  try {
    const listaFiliais: FilialGeral[] | undefined =
      useLoginAuxStore.getState().filiais;

    if (!listaFiliais || listaFiliais.length === 0) {
      return "";
    }

    const filialEncontrada = listaFiliais.find(
      (f: FilialGeral) => f.cnpjFilial?.replace(/\D/g, "") === cleanCnpj
    );

    return filialEncontrada ? filialEncontrada.numero?.trim() || "" : "";
  } catch (error) {
    toast.error("[findFilialCodigo] Erro:", error || "");
    return "";
  }
}

/**
 * Retrieves authentication state from localStorage via useAuthStore.
 * @returns Object containing isAuthenticated, username, accessToken, filiais, and grupos.
 */
export function getAuthState(): {
  isAuthenticated: boolean;
  username: string;
  accessToken: string | null;
  filiais: Array<{ M0_CODFIL: string; M0_FILIAL: string; M0_CGC: string }>;
  grupos: Array<{ Grupo: string; Filial: Array<{ Loja: string }> }>;
} {
  try {
    const state = useAuthStore.getState();
    const { isAuthenticated, user } = state;
    return {
      isAuthenticated,
      username: user?.username || DEFAULT_USERNAME,
      accessToken: user?.accessToken || null,
      filiais: state.filiais || [],
      grupos: state.grupos || [],
    };
  } catch (error) {
    toast.error("[getAuthState] Erro:", error || "");
    return {
      isAuthenticated: false,
      username: DEFAULT_USERNAME,
      accessToken: null,
      filiais: [],
      grupos: [],
    };
  }
}

/**
 * Retorna uma lista de ComboboxItem para as filiais que o usuário tem acesso.
 * @returns Lista de ComboboxItem com value (M0_CODFIL) e label (código e nome da filial).
 */
export function useFilialOptions(): ComboboxItem[] {
  const filiais = useAuthStore((s) => s.filiais);
  return useMemo(
    () =>
      filiais.map((f) => ({
        value: f.M0_CODFIL ?? "",
        label: `${f.M0_CODFIL ?? "??"} - ${
          f.M0_FILIAL ?? "Filial desconhecida"
        }`,
      })),
    [filiais]
  );
}

/**
 * Verifica se o usuário pertence a um grupo específico, opcionalmente restrito a uma filial.
 * @param grupo Nome do grupo a verificar (ex: "000172").
 * @param filialCod Código da filial (ex: "0101"). Se não fornecido, verifica apenas o grupo.
 * @returns true se o usuário pertence ao grupo (e à filial, se especificada), false caso contrário.
 */
export function hasAccessToGrupo(grupo: string, filialCod?: string): boolean {
  try {
    const grupos = useAuthStore.getState().grupos;
    if (!grupo || !grupos?.length) {
      return false;
    }

    const cleanGrupo = grupo.trim();
    if (filialCod) {
      const cleanFilialCod = filialCod.trim();
      return grupos.some(
        (g) =>
          g.Grupo?.trim() === cleanGrupo &&
          g.Filial.some((f) => f.Loja?.trim() === cleanFilialCod)
      );
    }

    return grupos.some((g) => g.Grupo?.trim() === cleanGrupo);
  } catch (error) {
    toast.error("[hasAccessToGrupo] Erro:", error || "");
    return false;
  }
}
// Interfaces para itens e grupos hierárquicos
export const gruposNomes = {
  comprasRodoparana: "000013",
  comprasTimber: "000014",
  borracharia: "000190",
  portaria: "000191",
  admin: "000000",
  //CONTABILIDADE:
  fiscalI: "000115",
  fiscalII: "000077",
  tes: "000128",
  tesMaster: "000131",
  fiscalTimber: "000135",
  contabilidade: "000193",
} as const;