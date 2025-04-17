"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui";
import type { PrenotaRow } from "@prenota/types";
import { CheckCircledIcon, TimerIcon, ExclamationTriangleIcon, InfoCircledIcon } from "@radix-ui/react-icons";

interface StatusBadgeProps {
  prenota: PrenotaRow;
}

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
    icon: <ExclamationTriangleIcon  className="w-5 h-5" />,
    tooltip: "Status: A Revisar",
  },
  Desconhecido: {
    color: "text-muted-foreground",
    icon: <InfoCircledIcon className="w-5 h-5" />,
    tooltip: "Status desconhecido",
  },
} as const;

type DerivedStatus = keyof typeof statusConfig;

export const StatusBadge: React.FC<StatusBadgeProps> = ({ prenota }) => {
  let derivedStatus: DerivedStatus;

  if (prenota.F1_STATUS && prenota.F1_STATUS.trim() !== "") {
    derivedStatus = "Classificada";
  } else if (prenota.F1_XREV && prenota.F1_XREV.trim() !== "") {
    derivedStatus = "Revisar";
  } else {
    derivedStatus = "Pendente";
  }

  const config = statusConfig[derivedStatus] || statusConfig["Desconhecido"];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className={`flex items-center justify-center h-full w-full ${config.color}`}>
          {config.icon}
        </div>
      </TooltipTrigger>
      <TooltipContent>{config.tooltip}</TooltipContent>
    </Tooltip>
  );
};