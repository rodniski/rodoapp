"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "ui";
import { CheckCircle, AlertCircle, Clock } from "lucide-react"; // Importe LucideProps
import clsx from "clsx";

// Define as cores para os status
const statusColors = {
  Classificada: "text-lime-500 bg-muted",
  Revisar: "text-red-500 bg-muted",
  Pendente: "text-amber-500 bg-muted",
};

// Define os ícones para os status
const statusIcons = {
  Classificada: CheckCircle,
  Revisar: AlertCircle,
  Pendente: Clock,
};

// Define um tipo para os status válidos
type Status = "Classificada" | "Revisar" | "Pendente";

interface StatusTooltipProps {
  status: Status; // Usa o tipo Status
  observation?: string;
}

const fallbackColor = "text-gray-500 bg-muted";
const fallbackIcon = AlertCircle;


export const StatusTooltip: React.FC<StatusTooltipProps> = ({
                                                              status,
                                                              observation,
                                                            }) => {

  // Agora o TypeScript *sabe* que status é uma chave válida.
  const Icon = statusIcons[status] || fallbackIcon;

  return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div
              className={clsx(
                  "flex items-center justify-center size-6 rounded-full",
                  statusColors[status] || fallbackColor
              )}
              aria-label={status || "Indefinido"} // Mantém a acessibilidade
          >
            <Icon className="w-6 h-6" />
          </div>
        </TooltipTrigger>
        <TooltipContent
            sideOffset={5}
            side="bottom"
            align="center"
            className="w-fit"
        >
          <div className="flex flex-col gap-1">
            <div className="text-base font-medium capitalize">
              {status || "Indefinido"}
            </div>
            {observation && (
                <div className="text-sm pt-2">
                  <strong>Obs:</strong> {observation}
                </div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
  );
};