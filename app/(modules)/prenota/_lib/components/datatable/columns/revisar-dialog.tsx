"use client";

import React, { useState } from "react";
import { HistoricoChatView, FormularioRevisaoFields } from ".";
import type { PrenotaRow, RevisaoPreNotaPayload } from "@prenota/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "ui";
import { useRevisaoPreNota } from "@prenota/hooks";
import { UpdateIcon } from "@radix-ui/react-icons";
import { getCurrentUsername } from "utils";

interface RevisarDialogProps {
  prenotaSelecionada: PrenotaRow | null;
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
}
const username = getCurrentUsername(); // Mantido conforme sua preferência

export const RevisarDialog: React.FC<RevisarDialogProps> = ({
  prenotaSelecionada,
  isOpen,
  onOpenChange,
}) => {
  const [revisarText, setRevisarText] = useState("");
  const [emailTags, setEmailTags] = useState<string[]>([]);
  const [actionInProgress, setActionInProgress] = useState<
    "form" | "finalize" | null
  >(null);

  const { mutate: solicitarRevisao, isPending } = useRevisaoPreNota();

  const resetFormFields = () => {
    setRevisarText("");
    setEmailTags([]);
  };

  const handleFormSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!revisarText.trim()) {
      alert("Por favor, descreva o motivo da revisão.");
      return;
    }
    setActionInProgress("form");
    const payload: RevisaoPreNotaPayload = {
      RECSF1: prenotaSelecionada!.REC.toString(),
      REVISAR: revisarText,
      USER: username,
      EMAILS: emailTags.length > 0 ? emailTags.join(";") : undefined,
      FINALIZADO: "False",
    };
    solicitarRevisao(payload, {
      onSuccess: () => {
        resetFormFields();
        console.log(
          "Dialog: Solicitação de revisão (form) enviada com sucesso."
        );
      },
      onSettled: () => {
        setActionInProgress(null);
      },
    });
  };

  const handleFinalizarDiretamente = () => {
    // ... (lógica existente, sem alterações aqui)
    if (!username.trim()) {
      alert("Usuário não identificado. Não é possível finalizar a revisão.");
      return;
    }
    setActionInProgress("finalize");
    const payloadFinalizacao: RevisaoPreNotaPayload = {
      RECSF1: prenotaSelecionada!.REC.toString(),
      REVISAR: "Finalização direta da revisão acionada pelo sistema.",
      USER: username,
      EMAILS: undefined,
      FINALIZADO: "True",
    };
    solicitarRevisao(payloadFinalizacao, {
      onSuccess: () => {
        console.log(
          "Dialog: Solicitação de revisão (finalizar direto) enviada com sucesso."
        );
        resetFormFields();
      },
      onSettled: () => {
        setActionInProgress(null);
      },
    });
  };

  if (!isOpen || !prenotaSelecionada) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl md:max-w-6xl lg:max-w-7xl max-h-[85vh] min-h-[50vh] flex flex-col p-0">
        <div className="flex flex-1 gap-0 md:gap-2 overflow-hidden">
          {/* Coluna da Esquerda: Histórico do Chat */}
          <div className="flex flex-col w-full md:w-1/2 border-r border-border overflow-hidden">
            {" "}
            {/* Adicionado flex flex-col e overflow-hidden */}
            <div className="p-4 shrink-0 border-b border-border">
              {" "}
              {/* Header opcional para o chat */}
              <h4 className="font-semibold text-foreground">
                Histórico de Observações
              </h4>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar p-2 md:p-4">
              {" "}
              {/* Scroll apenas no conteúdo do chat */}
              <HistoricoChatView
                recId={prenotaSelecionada.REC}
                currentLoggedInUsername={username}
              />
            </div>
          </div>
          {/* Coluna da Direita: Formulário de Revisão */}
          <form
            id="revisaoFormDialog"
            onSubmit={handleFormSubmit}
            // flex-1 faz a coluna do formulário tentar ocupar o espaço restante.
            // flex flex-col permite que FormularioRevisaoFields cresça internamente.
            className="flex flex-col flex-1 w-full md:w-1/2 lg:w-7/12 xl:w-8/12 overflow-hidden"
          >
            <DialogHeader className="p-4 shrink-0 border-b border-border">
              <DialogTitle>
                Adicionar Revisão para Pré-Nota REC: {prenotaSelecionada.REC}
              </DialogTitle>
            </DialogHeader>

            {/* Wrapper para FormularioRevisaoFields que permite crescimento e scroll interno se necessário */}
            <div className="flex flex-col flex-grow p-4 overflow-y-auto custom-scrollbar">
              <FormularioRevisaoFields
                revisarText={revisarText}
                setRevisarText={setRevisarText}
                emailTags={emailTags}
                setEmailTags={setEmailTags}
                isPending={isPending}
              />
            </div>

            <DialogFooter className="shrink-0 p-4 mt-auto border-t border-border">
              <div className="flex flex-col sm:flex-row sm:justify-end md:justify-between w-full gap-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleFinalizarDiretamente}
                  disabled={isPending || !username.trim()}
                  className="w-full sm:w-auto min-w-[160px]"
                >
                  {isPending && actionInProgress === "finalize" ? (
                    <>
                      <UpdateIcon className="size-4 animate-spin mr-2" />
                      Finalizando...
                    </>
                  ) : (
                    "Finalizar Revisão"
                  )}
                </Button>
                <Button
                  type="submit"
                  form="revisaoFormDialog"
                  disabled={
                    isPending || !revisarText.trim() || !username.trim()
                  }
                  className="w-full sm:w-auto min-w-[180px]"
                >
                  {isPending && actionInProgress === "form" ? (
                    <>
                      <UpdateIcon className="size-4 animate-spin mr-2" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar Observação"
                  )}
                </Button>
              </div>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
