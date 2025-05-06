// Actions.tsx
"use client";

import React, { useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "ui";
import {
  Download,
  MessageSquareQuote, // Usando este ícone
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useDeletePrenota, useAnexoDownload } from "@prenota/hooks";
import type { PrenotaRow } from "@prenota/types";
import { toast } from "sonner";
import { RevisarDialog } from "."; // Seu componente de Dialog

interface ActionsProps {
  preNota: PrenotaRow;
  onDeleteSuccess?: () => void;
}

export const Actions: React.FC<ActionsProps> = ({
  preNota,
  onDeleteSuccess,
}) => {
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
  // ... (resto do seu código do Actions: useDeletePrenota, useAnexoDownload, handleDelete) ...
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
  const {
    attachments,
    isLoading: isLoadingAnexos,
    handleDownload,
  } = useAnexoDownload({
    AnexoPath: preNota.Z07_CHAVE,
  });

  const hasAttachments = attachments && attachments.length > 0;

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
              <div className="animate-spin h-4 w-4 border-2 rounded-full border-primary border-t-transparent" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          {/* ... (seus DropdownMenuGroups existentes) ... */}
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground text-xs flex items-center">
              {isLoadingAnexos ? (
                <span className="text-muted-foreground">
                  Anexos (Carregando...)
                </span>
              ) : hasAttachments ? (
                <span>Anexos</span>
              ) : (
                <span>Sem Anexos</span>
              )}
            </DropdownMenuLabel>
            {hasAttachments &&
              attachments.map((attachment, index) => (
                <DropdownMenuItem
                  key={attachment.Z07_PATH || `att-${index}`} // Melhor usar Z07_PATH se for único
                  onClick={() => handleDownload(attachment.Z07_PATH)}
                  aria-label={`Baixar ${attachment.Z07_DESC}`}
                  className="w-full flex justify-between cursor-pointer"
                >
                  <span className="truncate">{attachment.Z07_DESC}</span>
                  <Download className="h-4 w-4 text-muted-foreground" />
                </DropdownMenuItem>
              ))}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              Sobre a Nota
            </DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setIsHistoricoOpen(true)}
              className="cursor-pointer justify-between"
            >
              <span>Solicitar Revisão</span>
              <MessageSquareQuote className="mr-2 h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem disabled>Histórico da NF</DropdownMenuItem>
            <DropdownMenuItem disabled>Editar Nota</DropdownMenuItem>
            {/* Removido Separator extra antes de Excluir, já tem um acima */}
            {/* <DropdownMenuSeparator className="bg-destructive" /> */}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            disabled={isDeleting} // Desabilita se estiver deletando
            className="text-destructive focus:text-destructive focus:bg-destructive/10 p-0 cursor-pointer"
          >
            <div className="group flex w-full justify-between items-center p-2 rounded-sm">
              <span>Excluir</span>
              <Trash2 className="h-4 w-4" />
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <RevisarDialog
        prenotaSelecionada={preNota}
        isOpen={isHistoricoOpen}
        onOpenChange={setIsHistoricoOpen}
      />
    </>
  );
};
