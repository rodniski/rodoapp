"use client";

import * as React from "react";
import { addDays, isAfter } from "date-fns";
import { cn } from "utils";
import { GanttChart, type Task } from "ui";
import { useTimeline } from "../config/hook.timeline";

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

    const nullToUndefined = (value: string | null): string | undefined =>
      value ?? undefined;

    for (const row of rawTasks) {
      const emissao = parseProtheusDate(row.EMISSAO_NF);
      const lancamento = parseProtheusDate(row.DATA_LANCAMENTO_REAL);
      const classificacao = parseProtheusDate(row.DATA_CLASSIFICACAO);
      const vencimento = parseProtheusDate(row.VENCIMENTO);
      const pagamento = parseProtheusDate(row.DATA_BAIXA);

      // Fase 1: Pedido → Emissão
      if (row.PEDIDO && lancamento && emissao) {
        tasksList.push({
          id: `pedido-emissao-${row.REC_F1}`,
          name: `Pedido ${row.PEDIDO}`,
          startDate: lancamento,
          endDate: emissao,
          progress: 100,
          status: "completed",
          assignee: nullToUndefined(row.USUARIO_PEDIDO),
          custom_class: "task-pedido",
        });
      }

      // Fase 2: Emissão → Pré-nota
      if (emissao && lancamento) {
        tasksList.push({
          id: `emissao-prenota-${row.REC_F1}`,
          name: `Pré-Nota: ${row.NOTA}/${row.SERIE}`,
          startDate: emissao,
          endDate: lancamento,
          progress: 100,
          status: "completed",
          custom_class: "task-prenota",
        });
      }

      // Fase 3: Pré-nota → Classificação
      if (lancamento) {
        tasksList.push({
          id: `prenota-class-${row.REC_F1}`,
          name: `Classificação`,
          startDate: lancamento,
          endDate: classificacao ?? addDays(lancamento, 1),
          progress: classificacao ? 100 : 50,
          status: classificacao ? "completed" : "in-progress",
          custom_class: "task-classificacao",
        });
      }

      // Marco: Histórico
      const logDate = parseProtheusDate(row.DATA_HISTORICO);
      if (logDate && row.OBSERVACAO_HISTORICO) {
        tasksList.push({
          id: `log-${row.REC_F1}-${tasksList.length}`,
          name: `Log: ${row.OBSERVACAO_HISTORICO}`,
          startDate: logDate,
          endDate: logDate,
          progress: 100,
          status: "completed",
          assignee: nullToUndefined(row.USUARIO_HISTORICO),
          custom_class: "milestone-log",
        });
      }

      // Fase 4: Emissão → Vencimento final
      if (emissao && vencimento) {
        tasksList.push({
          id: `emissao-venc-${row.REC_F1}`,
          name: `Aguardando Pagamento`,
          startDate: emissao,
          endDate: vencimento,
          progress: pagamento ? 100 : 50,
          status: pagamento ? "completed" : "in-progress",
          custom_class: "task-vencimento",
        });
      }

      // Marco: Vencimento
      if (vencimento) {
        const isDelayed = isAfter(today, vencimento) && !pagamento;
        tasksList.push({
          id: `vencimento-${row.REC_F1}`,
          name: `Vencimento`,
          startDate: vencimento,
          endDate: vencimento,
          progress: 100,
          status: isDelayed ? "delayed" : "completed",
          custom_class: "milestone-vencimento",
        });
      }

      // Marco: Pagamento
      if (pagamento) {
        tasksList.push({
          id: `pagamento-${row.REC_F1}`,
          name: `Pagamento`,
          startDate: pagamento,
          endDate: pagamento,
          progress: 100,
          status: "completed",
          custom_class: "milestone-pago",
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
