/**
 * @file breadcrumbsContext.tsx
 * @module BreadcrumbsContext
 * @description Provedor e hook para gerenciar breadcrumbs no projeto.
 */

'use client'
import { createContext, useContext, useState } from "react";

type BreadcrumbContextType = {
  breadcrumbs: { label: string; href?: string }[]; // Lista de breadcrumbs (com rótulo e link).
  setBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void; // Função para atualizar os breadcrumbs.
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);


/**
 * @function BreadcrumbProvider
 * @description Provedor para gerenciar breadcrumbs, permitindo que componentes atualizem as trilhas de navegação.
 * @param {React.ReactNode} children - Elementos filhos a serem renderizados.
 */
export const BreadcrumbProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href?: string }[]
  >([{ label: "Dashboard", href: "/" }]);

  return (
    <BreadcrumbContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error("useBreadcrumbs must be used within BreadcrumbProvider");
  }
  return context;
};
