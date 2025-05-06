"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui";
// Certifique-se que PrenotaRow em @prenota/types inclui o campo 'Status: string'
import type { PrenotaRow } from "@prenota/types";
import {
  CheckCircledIcon,
  TimerIcon,
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";

interface StatusBadgeProps {
  // A propriedade prenota agora contém o campo 'Status' calculado pelo backend
  prenota: PrenotaRow;
}

// A configuração de status permanece a mesma
const statusConfig = {
  Pendente: {
    color: "text-sky-500",
    icon: <TimerIcon className="w-5 h-5" />,
    tooltip: "Status: Pendente",
  },
  Classificada: {
    color: "text-lime-500",
    icon: <CheckCircledIcon className="w-5 h-5" />,
    tooltip: "Status: Classificada",
  },
  Revisar: {
    color: "text-amber-500",
    icon: <ExclamationTriangleIcon className="w-5 h-5" />,
    tooltip: "Status: A Revisar",
  },
  // Mantemos um fallback para caso o valor de Status seja inesperado
  Desconhecido: {
    color: "text-muted-foreground",
    icon: <InfoCircledIcon className="w-5 h-5" />,
    tooltip: "Status desconhecido",
  },
} as const;

// Tipo para garantir que usamos apenas as chaves válidas de statusConfig
type DerivedStatus = keyof typeof statusConfig;

export const StatusBadge: React.FC<StatusBadgeProps> = ({ prenota }) => {
  // Removemos a lógica if/else if/else.
  // Usamos diretamente o campo 'Status' vindo da API.
  // Usamos 'as DerivedStatus' para garantir a tipagem correta ao acessar statusConfig.
  // O fallback || statusConfig["Desconhecido"] lida com casos inesperados.
  const config =
    statusConfig[prenota.Status as DerivedStatus] ||
    statusConfig["Desconhecido"];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={`flex items-center justify-center h-full w-full ${config.color}`}
        >
          {config.icon}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {config.tooltip}
      </TooltipContent>
    </Tooltip>
  );
};
