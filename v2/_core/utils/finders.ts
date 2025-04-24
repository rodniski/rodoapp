// src/utils/finders.ts (ou _core/utils/finders.ts)
import { useAuthStore } from "@login/stores/auth-store"; // Ajuste path
import { useAuxStore as useLoginAuxStore } from "@login/stores/aux-store"; // Ajuste path
import type { FilialGeral } from "@/app/(modules)/login/_lib"; // Ajuste path

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
export function findFilialCodigo(cnpjDestinatario: string | null | undefined): string {
  const cleanCnpj = cnpjDestinatario?.replace(/\D/g, ""); // Limpa CNPJ antes de comparar
  if (!cleanCnpj) {
    // console.warn("[findFilialCodigo] CNPJ do destinatário inválido ou não fornecido.");
    return "";
  }

  try {
    // AJUSTE: Confirme nomes 'filiais', 'cnpjFilial', 'numero'
    const listaFiliais: FilialGeral[] | undefined = useLoginAuxStore.getState().filiais;

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

// Você poderia adicionar aqui findCentroCustoNome, findCondicaoPagamentoDesc, etc.
// Exemplo:
// import type { CentroCusto } from "@login/types";
// export function findCentroCustoNome(codigo: string | null | undefined): string {
//   if (!codigo) return "";
//   try {
//      // AJUSTE: Confirme nome 'centroCusto', 'CTT_CUSTO', 'CTT_DESC01'
//     const listaCC: CentroCusto[] | undefined = useLoginAuxStore.getState().centroCusto;
//     const ccEncontrado = listaCC?.find(cc => cc.CTT_CUSTO?.trim() === codigo.trim());
//     return ccEncontrado?.CTT_DESC01?.trim() || ""; // Retorna descrição
//   } catch(e) { console.error("[findCentroCustoNome] Erro:", e); return "";}
// }