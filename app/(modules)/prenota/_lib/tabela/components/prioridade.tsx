/* ─────────────────────────── PriorityBadge.tsx ─────────────────────────── */

"use client";

import React from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "ui"; // ajuste o alias se necessário
import { GetPriorityConfig } from "./configs";

interface PriorityBadgeProps {
  /** Texto cru vindo da API: “Alta”, “Media”, “Baixa”… */
  priority?: string | null;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const { color, icon, tooltip } = GetPriorityConfig(priority);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`inline-flex items-center p-1 ${color}`}>{icon}</span>
      </TooltipTrigger>

      <TooltipContent className="text-xs font-medium">{tooltip}</TooltipContent>
    </Tooltip>
  );
};
