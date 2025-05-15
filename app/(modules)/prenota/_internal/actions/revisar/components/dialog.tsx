"use client";

import { Dialog, DialogContent } from "ui";
import { getCurrentUsername } from "utils";
import React, { useState } from "react";
import {
  RevisaoPreNotaPayload,
  RevisarDialogProps,
  useRevisaoPreNota,
  FormularioRevisaoFields,
  HistoricoChatView,
} from "@/app/(modules)/prenota/_internal/actions";

const username = getCurrentUsername();


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
      onSettled: () => setActionInProgress(null),
    });
  };

  const handleFinalizarDiretamente = () => {
    if (!username.trim()) {
      alert("Usuário não identificado. Não é possível finalizar a revisão.");
      return;
    }
    setActionInProgress("finalize");
    const payload: RevisaoPreNotaPayload = {
      RECSF1: prenotaSelecionada!.REC.toString(),
      REVISAR: "Finalização direta da revisão acionada pelo sistema.",
      USER: username,
      EMAILS: undefined,
      FINALIZADO: "True",
    };
    solicitarRevisao(payload, {
      onSuccess: () => {
        console.log(
          "Dialog: Solicitação de revisão (finalizar direto) enviada com sucesso."
        );
        resetFormFields();
      },
      onSettled: () => setActionInProgress(null),
    });
  };

  if (!isOpen || !prenotaSelecionada) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl md:max-w-6xl lg:max-w-6xl max-h-[85vh] min-h-[55vh] flex flex-col p-0">
        <div className="flex flex-1 gap-0 md:gap-2 overflow-hidden">
          <div className="w-full md:w-1/2">
            <HistoricoChatView
              recId={prenotaSelecionada.REC}
              currentLoggedInUsername={username}
            />
          </div>
          <div className="flex flex-col flex-1 w-full">
            <FormularioRevisaoFields
              revisarText={revisarText}
              setRevisarText={setRevisarText}
              emailTags={emailTags}
              setEmailTags={setEmailTags}
              isPending={isPending}
              rec={prenotaSelecionada.REC}
            />

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
