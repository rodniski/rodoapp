"use client";

import React from "react";
import {
  Timeline,
  TimelineItem,
  TimelineConnector,
  TimelineHeader,
  TimelineTitle,
  TimelineIcon,
  TimelineDescription,
  TimelineContent,
} from "ui";

interface ProcessedItem {
  date: string; // Data formatada
  time?: string; // Hora (opcional)
  title: string; // Categoria
  details: { key: string; value: string }[]; // Lista de detalhes
}

interface TimelineLayoutProps {
  items: ProcessedItem[]; // Novo tipo
}
export const TimelineLayout = ({ items }: TimelineLayoutProps) => {
  return (
    <Timeline>
      {items.map((item, index) => (
        <TimelineItem key={index} className="flex items-start gap-6">
          {/* Linha Conector */}
          {index !== items.length - 1 && <TimelineConnector />}

          {/* Conteúdo Principal */}
          <div className="flex-1">
            <TimelineHeader>
              <TimelineIcon />
              <TimelineTitle className="uppercase">
                {item.title} -
              </TimelineTitle>
              <span>{formatDateTime(item.date, item.time)}</span>
            </TimelineHeader>
            <TimelineContent>
              <TimelineDescription>
                {item.details.map((detail, idx) => (
                  <p key={idx} className="mb-1 pt-2 pl-1">
                    <span className="font-semibold">{detail.key}:</span>{" "}
                    {detail.value}
                  </p>
                ))}
              </TimelineDescription>
            </TimelineContent>
          </div>
        </TimelineItem>
      ))}
    </Timeline>
  );
};

const formatDateTime = (date: string, time?: string) => {
  // Verificação de data no formato esperado (YYYYMMDD)
  const isValidDate = /^\d{8}$/.test(date);

  if (!isValidDate) return "Sem movimentações";

  const year = date.slice(0, 4);
  const month = date.slice(4, 6);
  const day = date.slice(6, 8);

  let formattedDate = `${day}/${month}/${year}`;

  // Se o tempo for fornecido, validamos também
  if (time) {
    const isValidTime = /^\d{2}:\d{2}(:\d{2})?$/.test(time); // Formatos HH:MM ou HH:MM:SS
    if (isValidTime) {
      const [hours, minutes] = time.split(":");
      formattedDate += `, ${hours}:${minutes}`;
    } else {
      formattedDate += ", Hora não disponível";
    }
  }

  return formattedDate;
};
