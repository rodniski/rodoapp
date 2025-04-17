"use client";

import React from 'react';
import { Badge } from 'ui'; // Ajuste o caminho conforme seu projeto

interface VencimentoBadgeProps {
  vencimento: string | null | undefined;
}

export const VencimentoBadge: React.FC<VencimentoBadgeProps> = ({ vencimento }) => {
  if (!vencimento) {
    return (
      <Badge variant="outline" className="font-medium text-sm bg-muted/50 text-cyan-600">
        Sem Título Anexo
      </Badge>
    );
  }

  const parseDate = (dateStr: string): Date | null => {
    if (!/^\d{8}$/.test(dateStr)) {
      return null;
    }
    const year = parseInt(dateStr.substring(0, 4), 10);
    const month = parseInt(dateStr.substring(4, 6), 10) - 1;
    const day = parseInt(dateStr.substring(6, 8), 10);
    const date = new Date(year, month, day);
    if (
      isNaN(date.getTime()) ||
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }
    return date;
  };

  let dataVencimento = parseDate(vencimento);

  if (!dataVencimento) {
    const dateStr = vencimento.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$2-$1');
    dataVencimento = new Date(dateStr);
    if (isNaN(dataVencimento.getTime())) {
      return (
        <Badge variant="outline" className="font-medium text-sm bg-muted/50 text-red-600">
          Data inválida
        </Badge>
      );
    }
  }

  const formattedDate = dataVencimento.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  dataVencimento.setHours(0, 0, 0, 0);
  const diffTime = dataVencimento.getTime() - hoje.getTime();
  const diasRestantes = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  const badgeColor =
    diasRestantes < 0
      ? 'text-red-600'
      : diasRestantes < 5
        ? 'text-yellow-600'
        : 'text-green-600';

  return (
    <Badge variant="outline" className={`font-medium text-sm ${badgeColor}`}>
      {formattedDate}
    </Badge>
  );
};