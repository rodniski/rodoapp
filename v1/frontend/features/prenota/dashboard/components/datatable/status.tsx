// Ex: components/status-badge.tsx (ou seu path)
"use client";
import React from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "ui"; // Seus componentes UI
import {FileCheck2, FileClock, FilePen, Info} from "lucide-react";

// Importa o tipo de dados (ajuste o path!)
import type {PrenotaTableData} from "!/app/actions/prenotaActions";

// Props agora recebem o objeto prenota completo
interface StatusBadgeProps {
    prenota: PrenotaTableData;
}

// Configuração visual para cada status derivado
const statusConfig = {
    "Pendente": {
        color: "text-sky-500", // Azul para Pendente
        icon: <FileClock className="w-5 h-5"/>, // Ajustado tamanho ícone
        tooltip: "Status: Pendente",
    },
    "Classificada": {
        color: "text-lime-500", // Verde para Classificada
        icon: <FileCheck2 className="w-5 h-5"/>,
        tooltip: "Status: Classificada",
    },
    "Revisar": {
        color: "text-amber-500", // Âmbar/Laranja para Revisar
        icon: <FilePen className="w-5 h-5"/>,
        tooltip: "Status: A Revisar",
    },
    "Desconhecido": { // Fallback
        color: "text-muted-foreground",
        icon: <Info className="w-5 h-5"/>,
        tooltip: "Status desconhecido",
    }
} as const;

// Define os tipos de status possíveis que o config cobre
type DerivedStatus = keyof typeof statusConfig;

export const StatusBadge: React.FC<StatusBadgeProps> = ({prenota}) => {

    // Determina o status com base na nova lógica
    let derivedStatus: DerivedStatus;
    // Verifica se f1_status não é null, undefined ou string vazia
    if (prenota.f1_status && prenota.f1_status.trim() !== '') {
        derivedStatus = "Classificada";
        // Verifica se f1_xrev não é null, undefined ou string vazia
    } else if (prenota.f1_xrev && prenota.f1_xrev.trim() !== '') {
        derivedStatus = "Revisar";
    } else {
        derivedStatus = "Pendente";
    }

    // Obtém a configuração visual baseada no status derivado
    const config = statusConfig[derivedStatus] || statusConfig["Desconhecido"];

    return (
        <Tooltip>
            <TooltipTrigger asChild> {/* Use asChild para melhor acessibilidade/layout */}
                {/* Centraliza o ícone na célula */}
                <div className={`flex items-center justify-center h-full w-full ${config.color}`}>
                    {config.icon}
                </div>
            </TooltipTrigger>
            <TooltipContent>{config.tooltip}</TooltipContent>
        </Tooltip>
    );
};