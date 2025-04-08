"use client";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui";
import { Info, ChevronsUp, ChevronsDown, Minus } from "lucide-react";

interface PriorityBadgeProps {
  priority: string;
}

// Definir priorityConfig com chaves fixas e propriedades imutáveis
const priorityConfig = {
  Alta: {
    color: " text-red-600",
    icon: <ChevronsUp className="size-8" />,
    tooltip: "Prioridade Alta - Requer atenção imediata.",
  },
  Media: {
    color: "text-yellow-500",
    icon: <Minus className="size-8" />,
    tooltip: "Prioridade Média - Atenção necessária.",
  },
  Baixa: {
    color: " text-green-600",
    icon: <ChevronsDown className="size-8" />,
    tooltip: "Prioridade Baixa - Nenhuma ação imediata necessária.",
  },
} as const;

// Extrair as chaves de priorityConfig como um tipo
type PriorityLevels = keyof typeof priorityConfig;

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  // Normaliza a prioridade e restringe ao tipo PriorityLevels
  const normalizedPriority = priority.trim().toLowerCase();
  const formattedPriority =
    normalizedPriority.charAt(0).toUpperCase() + normalizedPriority.slice(1);

  const isValidPriority = (
    formattedPriority: string
  ): formattedPriority is PriorityLevels => {
    return formattedPriority in priorityConfig;
  };

  const config = isValidPriority(formattedPriority)
    ? priorityConfig[formattedPriority]
    : {
        color: "text-muted-foreground",
        icon: <Info className="size-6" />,
        tooltip: "Prioridade desconhecida.",
      };

  return (
    <Tooltip>
      <TooltipTrigger>
        <div className={`flex items-center gap-2 text-md p-2 ${config.color}`}>
          {config.icon}
        </div>
      </TooltipTrigger>
      <TooltipContent>{config.tooltip}</TooltipContent>
    </Tooltip>
  );
};
