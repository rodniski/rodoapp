"use client";

import React, { useState } from "react";
import type {
  PrenotaRow,
  RevisaoPreNotaPayload,
  RevisarDialogProps,
  ActionButtonProps,
} from "@/app/(modules)/prenota/_lib/lib/types";
import { useRevisaoPreNota } from "@/app/(modules)/prenota/_lib/lib/hooks";
import { UpdateIcon } from "@radix-ui/react-icons";
import { getCurrentUsername } from "utils";
import {
  HistoricoChatView,
  FormularioRevisaoFields,
} from "@/app/(modules)/prenota/_lib/lib/components";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "ui";

const username = getCurrentUsername();

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  loadingLabel,
  isLoading,
  disabled,
  onClick,
  type = "button",
  variant = "default",
  form,
}) => (
  <Button
    type={type}
    variant={variant}
    onClick={onClick}
    disabled={disabled}
    form={form}
    className="w-full sm:w-auto min-w-[160px]"
  >
    {isLoading ? (
      <>
        <UpdateIcon className="size-4 animate-spin mr-2" />
        {loadingLabel}
      </>
    ) : (
      label
    )}
  </Button>
);

const FormSection: React.FC<{
  prenota: PrenotaRow;
  revisarText: string;
  setRevisarText: React.Dispatch<React.SetStateAction<string>>;
  emailTags: string[];
  setEmailTags: React.Dispatch<React.SetStateAction<string[]>>;
  isPending: boolean;
  onSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
}> = ({
  prenota,
  revisarText,
  setRevisarText,
  emailTags,
  setEmailTags,
  isPending,
  onSubmit,
}) => (
  <form
    id="revisaoFormDialog"
    onSubmit={onSubmit}
    className="flex flex-col flex-1 w-full px-2 overflow-hidden"
  >
    <FormularioRevisaoFields
      revisarText={revisarText}
      setRevisarText={setRevisarText}
      emailTags={emailTags}
      setEmailTags={setEmailTags}
      isPending={isPending}
      rec={prenota.REC}
    />
  </form>
);

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
            <FormSection
              prenota={prenotaSelecionada}
              revisarText={revisarText}
              setRevisarText={setRevisarText}
              emailTags={emailTags}
              setEmailTags={setEmailTags}
              isPending={isPending}
              onSubmit={handleFormSubmit}
            />
            <DialogFooter className="shrink-0 p-4 mt-auto border-t border-border">
              <div className="flex justify-between w-full gap-2">
                <ActionButton
                  label="Finalizar Revisão"
                  loadingLabel="Finalizando..."
                  isLoading={isPending && actionInProgress === "finalize"}
                  disabled={isPending || !username.trim()}
                  onClick={handleFinalizarDiretamente}
                  variant="destructive"
                />
                <ActionButton
                  label="Enviar Observação"
                  loadingLabel="Enviando..."
                  isLoading={isPending && actionInProgress === "form"}
                  disabled={
                    isPending || !revisarText.trim() || !username.trim()
                  }
                  type="submit"
                  form="revisaoFormDialog"
                />
              </div>
            </DialogFooter>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
