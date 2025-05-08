"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui";
import type { PrenotaRow } from "@prenota/tabela";
import { StatusConfig } from "./configs";

// Tipo para garantir que usamos apenas as chaves válidas de statusConfig
type DerivedStatus = keyof typeof StatusConfig;

export const StatusBadge: React.FC<{ prenota: PrenotaRow }> = ({ prenota }) => {
  // Removemos a lógica if/else if/else.
  // Usamos diretamente o campo 'Status' vindo da API.
  // Usamos 'as DerivedStatus' para garantir a tipagem correta ao acessar statusConfig.
  // O fallback || statusConfig["Desconhecido"] lida com casos inesperados.
  const config =
    StatusConfig[prenota.Status as DerivedStatus] ||
    StatusConfig["Desconhecido"];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center justify-center h-full w-full ${config.color}`}
        >
          {config.icon}
        </div>
      </TooltipTrigger>
      <TooltipContent className="text-white font-semibold">
        {config.tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
