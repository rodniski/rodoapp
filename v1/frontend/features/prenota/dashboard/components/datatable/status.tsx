"use client";
import React from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "ui";
import {FileCheck2, FileClock, FilePen, Info} from "lucide-react";

interface StatusBadgeProps {
    status: string;
}

const statusConfig = {
    "Pendente": {
        color: "text-sky-500",
        icon: <FileClock className="w-6 h-6"/>,
        tooltip: "Status: Pendente",
    },
    "Classificada": {
        color: "text-lime-500",
        icon: <FileCheck2 className="w-6 h-6"/>,
        tooltip: "Status: Classificada",
    },
    "Revisar": {
        color: "text-amber-500",
        icon: <FilePen className="w-6 h-6"/>,
        tooltip: "Status: Revisar",
    },
} as const;

type StatusLevels = keyof typeof statusConfig;

export const StatusBadge: React.FC<StatusBadgeProps> = ({status}) => {
    const normalizedStatus = status.trim();
    const isValidStatus = (value: string): value is StatusLevels => {
        return value in statusConfig;
    };

    const config = isValidStatus(normalizedStatus)
        ? statusConfig[normalizedStatus]
        : {
            color: "text-muted-foreground",
            icon: <Info className="w-6 h-6"/>,
            tooltip: "Status desconhecido",
        };

    return (
        <Tooltip>
            <TooltipTrigger>
                <div className={`flex items-center gap-2 p-2 ${config.color}`}>
                    {config.icon}
                </div>
            </TooltipTrigger>
            <TooltipContent>{config.tooltip}</TooltipContent>
        </Tooltip>
    );
};
