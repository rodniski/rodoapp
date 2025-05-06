// src/utils/finders.ts (ou _core/utils/finders.ts)
import { useAuthStore } from "@/app/login/_lib/stores/auth-store"; // Ajuste path
import { useAuxStore as useLoginAuxStore } from "@/app/login/_lib/stores/aux-store"; // Ajuste path
import type { FilialGeral } from "@/app/login/_lib"; // Ajuste path
import { ComboboxItem } from "comp";
import { useMemo } from "react";

const DEFAULT_USERNAME = "USUARIO_DESCONHECIDO";

/**
 * Obtém o username do usuário logado a partir do useAuthStore.
 */
export function getCurrentUsername(): string {
  try {
    // AJUSTE: Confirme state.user.username
    const username = useAuthStore.getState().user?.username;
    return username?.trim() || DEFAULT_USERNAME; // Já faz trim aqui
  } catch (error) {
    console.error("[getCurrentUsername] Erro:", error);
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
  const cleanCnpj = cnpjDestinatario?.replace(/\D/g, ""); // Limpa CNPJ antes de comparar
  if (!cleanCnpj) {
    // console.warn("[findFilialCodigo] CNPJ do destinatário inválido ou não fornecido.");
    return "";
  }

  try {
    // AJUSTE: Confirme nomes 'filiais', 'cnpjFilial', 'numero'
    const listaFiliais: FilialGeral[] | undefined =
      useLoginAuxStore.getState().filiais;

    if (!listaFiliais || listaFiliais.length === 0) {
      // console.warn("[findFilialCodigo] Lista de filiais vazia ou indisponível.");
      return "";
    }

    const filialEncontrada = listaFiliais.find(
      (f: FilialGeral) => f.cnpjFilial?.replace(/\D/g, "") === cleanCnpj // Compara CNPJs limpos
    );

    if (filialEncontrada) {
      // AJUSTE 'numero' se necessário
      return filialEncontrada.numero?.trim() || ""; // Retorna o código limpo
    } else {
      // console.warn(`[findFilialCodigo] Nenhuma filial corresponde ao CNPJ ${cleanCnpj}.`);
      return "";
    }
  } catch (error) {
    console.error("[findFilialCodigo] Erro:", error);
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
    console.error("[getAuthState] Erro:", error);
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
 * Retorna uma lista de ComboboxItem para as filiais que o usuário
 * tem acesso, extraídas do auth-store.
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
