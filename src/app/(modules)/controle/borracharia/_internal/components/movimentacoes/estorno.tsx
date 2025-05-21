"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "ui";
import { CircleX } from "lucide-react";
import { AnimatedButton } from "@borracharia/components";
import { useMovEstornoSaida } from "@borracharia/hooks";
import { toast } from "sonner";
import { getCurrentUsername } from "utils";

export const BorHistEstorno = ({ item }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: estornar } = useMovEstornoSaida();

  if (!item) {
    return null;
  }

  const handleEstorno = () => {
    estornar(
      {
        Sequencia: item.Sequencia,
        RespEstor: getCurrentUsername(),
        OrigemEst: "b",
      },
      {
        onSuccess: () => {
          setIsOpen(false);
        },
        onError: () => {
          toast.error("Erro ao estornar.");
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <AnimatedButton
          text="Estornar"
          icon={<CircleX />}
          variant="destructive"
        />
      </DialogTrigger>
      <DialogContent className="!max-w-[800px] max-h-[80vh] overflow-y-auto overflow-x-hidden dark:bg-muted/30 bg-white/90 backdrop-blur">
        <DialogHeader>
          <DialogTitle>Confirmar Estorno</DialogTitle>
        </DialogHeader>
        {item && (
          <div className="space-y-1">
            <p>NF: {item.NFLabel}</p>
            <p>Produto: {item.ProdutoLabel}</p>
            <p>Quantidade: {item.QtdEntregue}</p>
            <p>Sequência: {item.Sequencia}</p>
          </div>
        )}
        <DialogFooter>
          <Button variant="destructive" onClick={handleEstorno}>
            Estornar
          </Button>
          <Button variant="ghost" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
