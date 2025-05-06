"use client";

import React from "react";
import { Badge, Tooltip, TooltipContent, TooltipTrigger } from "ui"; // Ajuste o caminho
// Importa as funções utilitárias necessárias
import {
  parseDateYYYYMMDD,
  parseDateBR,
  formatDateBR,
  differenceInCalendarDays, // Função para calcular diferença em dias
} from "utils";

interface VencimentoBadgeProps {
  /** Data de vencimento como string (pode ser yyyyMMdd ou dd/MM/yyyy) */
  vencimento: string | null | undefined;
}

/**
 * Componente Badge para exibir a data de vencimento e indicar
 * visualmente se está vencido, próximo do vencimento ou ok.
 * Tenta parsear os formatos yyyyMMdd e dd/MM/yyyy.
 */
export const VencimentoBadge: React.FC<VencimentoBadgeProps> = ({
  vencimento,
}) => {
  // 1. Tratamento inicial: Sem data?
  if (!vencimento) {
    return (
      <Badge
        variant="secondary"
        className="font-medium text-xs whitespace-nowrap"
      >
        Sem Venc.
      </Badge>
    );
  }

  // 2. Tenta parsear a data usando as funções utilitárias
  // Tenta formato yyyyMMdd primeiro, depois dd/MM/yyyy
  let dataVencimentoObj: Date | undefined =
    parseDateYYYYMMDD(vencimento) ?? parseDateBR(vencimento);

  // 3. Verifica se o parse falhou completamente
  if (!dataVencimentoObj) {
    console.warn(
      `[VencimentoBadge] Data recebida em formato inválido: ${vencimento}`
    );
    return (
      <Badge
        variant="destructive"
        className="font-medium text-xs whitespace-nowrap"
      >
        Data Inválida
      </Badge>
    );
  }

  // 4. Formata a data válida para exibição consistente (dd/MM/yyyy)
  const formattedDate = formatDateBR(dataVencimentoObj);

  // 5. Calcula a diferença de dias usando a função utilitária
  // Passa a data de vencimento (a função compara com 'hoje' por padrão)
  const diasRestantes = differenceInCalendarDays(dataVencimentoObj);

  // 6. Determina a cor do badge com base nos dias restantes
  let badgeColorClass = "text-foreground border-border"; // Cor padrão
  let titleText = `Vence em ${diasRestantes} dia(s)`; // Tooltip padrão

  switch (true) {
    // --- Vencido ---
    case diasRestantes < 0:
      badgeColorClass = "text-red-700 border-red-500/50 bg-red-500/10"; // Vermelho mais forte
      titleText = `Vencido há ${Math.abs(diasRestantes)} dia(s)`;
      break;

    // --- Vence Hoje ou Muito Próximo (0-2 dias) ---
    case diasRestantes <= 2: // Inclui dia 0 (Hoje), 1 e 2
      badgeColorClass = "text-orange-600 border-orange-400/50 bg-orange-500/10"; // Laranja
      titleText =
        diasRestantes === 0 ? "Vence Hoje" : `Vence em ${diasRestantes} dia(s)`;
      break;

    // --- Vence em Breve (3-7 dias) ---
    case diasRestantes <= 7:
      badgeColorClass = "text-yellow-600 border-yellow-400/50 bg-yellow-500/10"; // Amarelo
      titleText = `Vence em ${diasRestantes} dia(s)`;
      break;

    // --- Próximo (8-14 dias) ---
    case diasRestantes >= 14:
      badgeColorClass = "text-green-600 border-green-400/50 bg-green-500/10"; // Verde Limão
      titleText = `Vence em ${diasRestantes} dia(s)`;
      break;

    // --- Tranquilo (30+ dias) ---
    default: // diasRestantes >= 30
      badgeColorClass = "text-teal-600 border-teal-400/50 bg-teal-500/10"; // Verde Água/Azulado
      titleText = `Vence em ${diasRestantes} dia(s)`;
      break;
  }

  // 7. Renderiza o Badge final
  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge
          variant="outline"
          className={`font-medium text-xs whitespace-nowrap ${badgeColorClass}`}
        >
          {formattedDate}
        </Badge>
      </TooltipTrigger>
      <TooltipContent className="text-white font-semibold">
        {titleText}
      </TooltipContent>
    </Tooltip>
  );
};
