"use client";

import * as React from "react";
import { addDays } from "date-fns";
import { cn } from "utils";
import { GanttChart, type Task } from "ui";
import { useTimeline } from "@prenota/actions";
import type { TimelineEvento } from "@prenota/actions";

interface PrenotaGanttProps {
  recsf1: string | number;
  className?: string;
}

export function PrenotaGantt({ recsf1, className }: PrenotaGanttProps) {
  const { data: rawTasks, isLoading, error } = useTimeline(recsf1);

  const tasks = React.useMemo(() => {
    if (!rawTasks?.length) return [];

    const today = new Date();
    const tasksList: Task[] = [];

    const parseProtheusDate = (dateStr: string | null): Date | null => {
      if (!dateStr || dateStr.trim().length !== 8) return null;
      const year = parseInt(dateStr.slice(0, 4));
      const month = parseInt(dateStr.slice(4, 6)) - 1;
      const day = parseInt(dateStr.slice(6, 8));
      return new Date(year, month, day);
    };

    const mapStatus = (status: TimelineEvento["status"]): Task["status"] => {
      switch (status) {
        case "concluido":
          return "completed";
        case "in-progress":
          return "in-progress";
        case "atrasado":
          return "delayed";
        case "pendente":
        default:
          return "not-started";
      }
    };

    // Mapeamento de TimelineStage para nomes legíveis
    const stageNames: Record<TimelineEvento["tipo"], string> = {
      pedido_nfEmitida: "Pedido Enviado → NF Emitida",
      nfEmitida_recebida: "NF Emitida → Recebida",
      recebida_classificada: "NF Recebida → Classificada",
      nfEmitida_pago: "NF Emitida → Pago/Vencido",
    };

    for (const event of rawTasks) {
      const startDate = parseProtheusDate(event.inicio);
      const endDate = parseProtheusDate(event.fim) ?? addDays(startDate || today, 1);

      if (!startDate) continue; // Pula eventos sem data de início válida

      // Tarefa principal para cada evento
      tasksList.push({
        id: `${event.tipo}-${event.codigo}`,
        name: `${stageNames[event.tipo]}`,
        startDate,
        endDate,
        progress:
          event.status === "concluido"
            ? 100
            : event.status === "in-progress"
            ? 50
            : event.status === "atrasado"
            ? 75
            : 0,
        status: mapStatus(event.status),
        assignee: event.nome ?? undefined,
        custom_class: `task-${event.tipo}`,
      });

      // Marcos (se houver)
      if (event.marcos?.length) {
        event.marcos.forEach((marco, index) => {
          const marcoDate = parseProtheusDate(marco.data);
          if (!marcoDate) return;

          tasksList.push({
            id: `marco-${event.codigo}-${index}`,
            name: marco.descricao || marco.campo || "Marco",
            startDate: marcoDate,
            endDate: marcoDate,
            progress: 100,
            status: "completed",
            assignee: marco.usuario ?? undefined,
            custom_class: "milestone-marco",
          });
        });
      }
    }

    return tasksList;
  }, [rawTasks]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">Carregando...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 p-6">Erro: {error.message}</div>;
  }

  if (!tasks.length) {
    return <div className="p-6">Nenhum dado disponível.</div>;
  }

  return (
    <div className={cn("", className)}>
      <GanttChart tasks={tasks} />
    </div>
  );
}