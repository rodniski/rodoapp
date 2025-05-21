"use client";

import * as React from "react";
import {
  addDays,
  differenceInDays,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfDay,
  isToday,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "utils";
import {
  Button,
  Card,
  ScrollArea,
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "ui";

export interface Task {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  progress: number;
  status: "not-started" | "in-progress" | "completed" | "delayed";
  dependencies?: string[];
  assignee?: string;
  custom_class?: string;
}

interface GanttChartProps {
  tasks: Task[];
  startDate?: Date;
  endDate?: Date;
  onTaskClick?: (task: Task) => void;
  className?: string;
}

export function GanttChart({
  tasks,
  startDate: propStartDate,
  endDate: propEndDate,
  onTaskClick,
  className,
}: GanttChartProps) {
  const earliestDate = React.useMemo(() => {
    if (propStartDate) return startOfDay(propStartDate);
    return tasks.reduce((earliest, task) => {
      return isBefore(task.startDate, earliest)
        ? startOfDay(task.startDate)
        : earliest;
    }, startOfDay(tasks[0]?.startDate || new Date()));
  }, [tasks, propStartDate]);

  const latestDate = React.useMemo(() => {
    if (propEndDate) return startOfDay(propEndDate);
    return tasks.reduce((latest, task) => {
      return isAfter(task.endDate, latest) ? startOfDay(task.endDate) : latest;
    }, startOfDay(tasks[0]?.endDate || addDays(new Date(), 30)));
  }, [tasks, propEndDate]);

  const totalDays = differenceInDays(latestDate, earliestDate) + 1;

  const [visibleStartDate, setVisibleStartDate] = React.useState(earliestDate);
  const [visibleDays, setVisibleDays] = React.useState(() => {
    if (totalDays <= 7) return totalDays;
    if (totalDays <= 15) return 14;
    return Math.min(totalDays, 30);
  });

  const visibleEndDate = addDays(visibleStartDate, visibleDays - 1);

  const handlePrevious = () => {
    setVisibleStartDate(addDays(visibleStartDate, -Math.min(7, visibleDays)));
  };

  const handleNext = () => {
    const newStart = addDays(visibleStartDate, Math.min(7, visibleDays));
    if (!isAfter(newStart, addDays(latestDate, -visibleDays + 1))) {
      setVisibleStartDate(newStart);
    }
  };

  const headerDates = React.useMemo(() => {
    return Array.from({ length: visibleDays }, (_, i) =>
      addDays(visibleStartDate, i)
    );
  }, [visibleStartDate, visibleDays]);

  const getTaskStyle = (task: Task) => {
    const taskStart = isBefore(task.startDate, visibleStartDate)
      ? visibleStartDate
      : task.startDate;
    const taskEnd = isAfter(task.endDate, visibleEndDate)
      ? visibleEndDate
      : task.endDate;

    const startOffset = differenceInDays(taskStart, visibleStartDate);
    const width = differenceInDays(taskEnd, taskStart) + 1;

    return {
      left: `${(startOffset / visibleDays) * 100}%`,
      width: `${(width / visibleDays) * 100}%`,
    };
  };

  const isTaskVisible = (task: Task) => {
    return (
      (isAfter(task.startDate, visibleStartDate) ||
        isSameDay(task.startDate, visibleStartDate) ||
        isAfter(task.endDate, visibleStartDate)) &&
      (isBefore(task.endDate, visibleEndDate) ||
        isSameDay(task.endDate, visibleEndDate) ||
        isBefore(task.startDate, visibleEndDate))
    );
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "delayed":
        return "bg-red-500";
      case "not-started":
        return "bg-yellow-400";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <Card className={cn("p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Cronograma do Projeto</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            {format(visibleStartDate, "dd/MM", { locale: ptBR })} -{" "}
            {format(visibleEndDate, "dd/MM/yyyy", { locale: ptBR })}
          </span>
          <Button variant="outline" size="icon" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex">
        <div className="w-1/4 min-w-[200px] border-r pr-2">
          <div className="h-10 font-medium flex items-center">Tarefas</div>
          {tasks.map((task) => (
            <div key={task.id} className="h-12 flex items-center font-medium">
              {task.name}
            </div>
          ))}
        </div>

        <div className="w-3/4 overflow-hidden">
          <ScrollArea>
            <div className="min-w-[800px]">
              <div className="flex border-b relative">
                {headerDates.map((date, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-1 h-10 text-center text-xs flex items-center justify-center border-r",
                      [0, 6].includes(date.getDay()) ? "bg-muted/50" : "",
                      isToday(date) && "bg-primary/10 font-bold"
                    )}
                  >
                    <span>{format(date, "dd/MM", { locale: ptBR })}</span>
                  </div>
                ))}
                {/* Linha vertical indicando hoje */}
                {headerDates.some((date) => isToday(date)) && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-primary"
                    style={{
                      left: `${
                        headerDates.findIndex((date) => isToday(date)) * (100 / visibleDays)
                      }%`,
                    }}
                  />
                )}
              </div>

              {tasks.map((task) => (
                <div key={task.id} className="h-12 relative">
                  <div className="absolute inset-0 flex">
                    {headerDates.map((date, index) => (
                      <div
                        key={index}
                        className={cn(
                          "flex-1 border-r",
                          [0, 6].includes(date.getDay()) ? "bg-muted/50" : ""
                        )}
                      />
                    ))}
                  </div>

                  {isTaskVisible(task) && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div
                          className={cn(
                            "absolute top-2 h-8 rounded-md cursor-pointer transition-all duration-200",
                            getStatusColor(task.status),
                            getStatusColor(task.status).includes("primary") &&
                              "text-white",
                            task.custom_class
                          )}
                          style={getTaskStyle(task)}
                          onClick={() => onTaskClick?.(task)}
                        >
                          <div
                            className="h-full bg-black/10 rounded-l-md"
                            style={{ width: `${task.progress}%` }}
                          />
                          {differenceInDays(task.endDate, task.startDate) >
                            3 && (
                            <span className="absolute inset-0 flex items-center justify-center text-xs text-white font-medium px-2 truncate">
                              {task.name}
                            </span>
                          )}
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="text-sm w-64 p-4">
                        <p className="font-semibold">{task.name}</p>
                        <p className="text-xs">
                          {format(task.startDate, "dd/MM", { locale: ptBR })} -{" "}
                          {format(task.endDate, "dd/MM", { locale: ptBR })}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-secondary text-secondary-foreground">
                            {differenceInDays(task.endDate, task.startDate) + 1}{" "}
                            dias
                          </span>
                          <span className="text-xs">
                            Progresso: {task.progress}%
                          </span>
                        </div>
                        {task.assignee && (
                          <p className="text-xs mt-1">
                            Responsável: {task.assignee}
                          </p>
                        )}
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Card>
  );
}
