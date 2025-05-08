/* ───────────── VencimentoBadge.tsx ───────────── */
"use client";

import React from "react";
import { Badge, Tooltip, TooltipTrigger, TooltipContent } from "ui";
import { getVencimentoPreset } from "./configs";

export const VencimentoBadge: React.FC<{ vencimento?: string | null }> = ({
  vencimento,
}) => {
  const { label, colorClass, tooltip } = getVencimentoPreset(vencimento);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Badge
          variant="secondary"
          className={`font-medium text-xs whitespace-nowrap ${colorClass}`}
        >
          {label}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="text-xs">{tooltip}</TooltipContent>
    </Tooltip>
  );
};
