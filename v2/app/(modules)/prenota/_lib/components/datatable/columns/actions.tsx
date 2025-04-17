"use client";

import React, { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from 'ui'; // Ajuste o caminho conforme seu projeto
import { MoreHorizontal, Trash2 } from "lucide-react";
import { useDeletePrenota } from '@prenota/hooks'; // Ajuste o caminho
import type { PrenotaRow } from "@prenota/types";
// import { Editar, HistoricoRevisaoSheet } from ".";
import { toast } from "sonner";

interface ActionsProps {
  preNota: PrenotaRow;
  onDeleteSuccess?: () => void; // Callback para atualização da lista
}

export const Actions: React.FC<ActionsProps> = ({ preNota, onDeleteSuccess }) => {
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
  const { mutate: deletePrenota, isPending: isDeleting } = useDeletePrenota({
    onSuccess: () => {
      toast.success("Pré-nota excluída com sucesso!");
      onDeleteSuccess?.();
    },
    onError: (error) => {
      toast.error(`Falha na exclusão: ${error.message}`);
      console.error("Erro ao excluir pré-nota:", error);
    },
  });

  const handleDelete = () => {
    if (!confirm("Tem certeza que deseja excluir esta pré-nota?")) return;
    deletePrenota(preNota.REC);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isDeleting}>
            <span className="sr-only">Ações</span>
            {isDeleting ? (
              <div className="animate-spin h-4 w-4 border-2 rounded-full border-primary" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsHistoricoOpen(true)}>
            Histórico | Revisão
          </DropdownMenuItem>
          {/* <Editar rec={preNota.REC} /> */}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="text-red-600 focus:bg-red-700"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* <HistoricoRevisaoSheet
        isOpen={isHistoricoOpen}
        onOpenChange={setIsHistoricoOpen}
        preNota={preNota}
      /> */}
    </>
  );
};