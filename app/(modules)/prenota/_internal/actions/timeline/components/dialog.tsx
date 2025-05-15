import React from "react";
import { MenuItem } from "@/app/(modules)/prenota/_internal/actions";
import { PrenotaGantt } from "./gantt";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
} from "ui";
import { LapTimerIcon } from "@radix-ui/react-icons";
import { useTimeline } from "../config/hook.timeline";

interface GanttDialogProps {
  recsf1: number;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function GanttDialog({
  recsf1,
  isOpen,
  onOpenChange,
}: GanttDialogProps) {
  const { data: timelineData, isLoading: isTimelineLoading } = useTimeline(recsf1);

  // Pega o código da nota (ex.: "000253762-21") do primeiro evento, se disponível
  const notaCodigo = timelineData?.[0]?.codigo || "Carregando...";

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger className="w-full">
        <DropdownMenuItem
          onSelect={(e) => e.preventDefault()}
          className="flex justify-between w-full cursor-pointer"
        >
          <span>Timeline da Pré-Nota</span>
          <LapTimerIcon className="size-4 text-muted-foreground" />
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Linha do Tempo da Pré-Nota {notaCodigo}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          {isTimelineLoading ? (
            <div className="flex items-center justify-center p-6">
              Carregando timeline...
            </div>
          ) : (
            <PrenotaGantt recsf1={recsf1} />
          )}
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button variant="default">Confirmar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}