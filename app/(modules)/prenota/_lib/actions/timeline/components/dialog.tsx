import React from "react";
import { MenuItem } from "@prenota/actions";
import { PrenotaGantt } from "./gantt";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenuItem,
} from "ui";
import { LapTimerIcon } from "@radix-ui/react-icons";

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
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger>
        <DropdownMenuItem className="flex justify-between cursor-pointer">
          <span>Timeline da Pré-Nota</span>
          <LapTimerIcon className="h-4 w-4 text-muted-foreground" />
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogContent className="w-full max-w-[90vw] sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            Linha do Tempo da Pré-Nota
          </DialogTitle>
          <DialogDescription>
            Acompanhe os principais eventos da pré-nota{" "}
            <strong>{recsf1}</strong>: criação, classificação, vencimento,
            pagamento e logs de histórico.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <PrenotaGantt recsf1={recsf1} />
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
