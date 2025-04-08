"use client";

import React from "react";
import {Badge} from "ui";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

interface VencimentoBadgeProps {
    vencimento: string | null | undefined;
}

export const VencimentoBadge: React.FC<VencimentoBadgeProps> = ({vencimento}) => {
    if (!vencimento) {
        return (
            <Badge variant="outline" className="font-medium text-sm bg-muted/50 text-cyan-600">
                Sem Título Anexo
            </Badge>
        );
    }

    let dataVencimento = dayjs(vencimento, "YYYYMMDD", true);
    if (!dataVencimento.isValid()) {
        dataVencimento = dayjs(vencimento, ["DD/MM/YYYY", "YYYY-MM-DD"], true);
    }
    if (!dataVencimento.isValid()) {
        return (
            <Badge variant="outline" className="font-medium text-sm bg-muted/50 text-red-600">
                Data inválida
            </Badge>
        );
    }

    const hoje = dayjs();
    const diasRestantes = dataVencimento.startOf("day").diff(hoje.startOf("day"), "day");
    const formattedDate = dataVencimento.format("DD/MM/YYYY");

    // Definindo a cor do badge com base na diferença em dias
    const badgeColor =
        diasRestantes < 0
            ? "text-red-600"
            : diasRestantes < 5
                ? "text-yellow-600"
                : "text-green-600";
    return (
        <span className={`text-xs uw:text-base ${badgeColor}`}>
            {formattedDate}
        </span>
    );
};
