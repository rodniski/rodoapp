"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserGrupoFilial, GrupoFilial } from "@login/_lib";

// Código do grupo de administrador
export const ADMIN_GROUP = "000000";

export function useGroupPermissions() {
  const { data: session, status } = useSession();
  const [gruposFiliais, setGruposFiliais] = useState<GrupoFilial[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    async function loadGruposFiliais() {
      if (status === "authenticated" && session?.user?.username) {
        try {
          // Supondo que o token seja armazenado na sessão
          // Você pode precisar ajustar isso dependendo de como você armazena o token
          const token = (session as any).accessToken || "";
          const grupos = await getUserGrupoFilial(session.user.username, token);
          setGruposFiliais(grupos);

          // Verifica se o usuário é admin (pertence ao grupo 000000)
          const admin = grupos.some((grupo) => grupo.Grupo === ADMIN_GROUP);
          setIsAdmin(admin);
        } catch (err) {
          console.error("Erro ao carregar grupos e filiais:", err);
          setError(err instanceof Error ? err : new Error(String(err)));
        } finally {
          setIsLoading(false);
        }
      } else if (status === "unauthenticated") {
        setIsLoading(false);
      }
    }

    loadGruposFiliais();
  }, [session, status]);

  const hasAccessToGroup = (groupCode: string): boolean => {
    // Se for admin, tem acesso a tudo
    if (isAdmin) return true;

    // Se não tiver grupos, não tem acesso
    if (!gruposFiliais || gruposFiliais.length === 0) return false;

    // Verifica se o usuário tem acesso ao grupo específico
    return gruposFiliais.some((grupo) => grupo.Grupo === groupCode);
  };

  const hasAnyGroup = (groupCodes: string[]): boolean => {
    // Se for admin, tem acesso a tudo
    if (isAdmin) return true;

    // Se não tiver grupos ou não tiver lista de grupos para verificar, não tem acesso
    if (
      !gruposFiliais ||
      gruposFiliais.length === 0 ||
      !groupCodes ||
      groupCodes.length === 0
    ) {
      return false;
    }

    // Verifica se o usuário tem acesso a pelo menos um dos grupos
    return groupCodes.some((code) => hasAccessToGroup(code));
  };

  return {
    gruposFiliais,
    isLoading,
    error,
    isAdmin,
    hasAccessToGroup,
    hasAnyGroup,
  };
}
