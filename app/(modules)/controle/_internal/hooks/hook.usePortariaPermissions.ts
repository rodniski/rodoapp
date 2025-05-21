/* ───────────────────────────  usePortariaPermissions.ts  ───────────────────────────
 * Hook para gerenciar permissões de acesso à portaria no RodoApp.
 *
 *  ┌────────────┐
 *  │  RESUMO    │  Verifica permissões para borracharia, portaria e histórico
 *  ├────────────┤  com base nos grupos do usuário, usando hasAccessToGrupo
 *  │  FUNCIONAL │  do finders.ts. Suporta verificação de admin e filial
 *  │            │  específica (M0_CODFIL: "0101").
 *  └────────────┘
 *  Integra com useAuthStore para acesso aos grupos.
 * -----------------------------------------------------------------------*/

import { useAuthStore } from "@/app/login/_internal/stores/auth-store";
import { hasAccessToGrupo } from "utils";

type PortariaAccess = {
  canAccessBorracharia: boolean;
  canAccessPortaria: boolean;
  canAccessHistorico: boolean;
};

export const usePortariaPermissions = () => {
  const { grupos, isLoading } = useAuthStore((s) => ({
    grupos: s.grupos,
    isLoading: s.isLoading,
  }));

  const isAdmin = hasAccessToGrupo("000000");

  const permissions: PortariaAccess = {
    canAccessBorracharia: isAdmin || hasAccessToGrupo("000172", "0101"),
    canAccessPortaria: isAdmin || hasAccessToGrupo("000171", "0101"),
    canAccessHistorico: true,
  };

  return {
    permissions,
    isLoading,
    isAdmin,
  };
};
