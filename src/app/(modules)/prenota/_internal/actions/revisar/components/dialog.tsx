"use client";

import { Dialog, DialogContent } from "ui";
import { getCurrentUsername } from "utils"; // Assume que esta função existe
import React, { useState } from "react";
import { toast } from "sonner";

// Assumindo que @prenota/actions é um barrel file que exporta:
// - useRevisaoPreNota (o hook que usa os tipos de revisar.types.ts)
// - RevisaoPreNotaPayload (o tipo definido em revisar.types.ts)
// - HistoricoChatView (o componente)
// - FormularioRevisaoFields (o componente)
import {
  useRevisaoPreNota,
  RevisaoPreNotaPayload, // Este deve ser o tipo de revisar.types.ts
  HistoricoChatView, // Seu componente
  FormularioRevisaoFields, // Seu componente
} from "@prenota/actions";

// Tipos locais simples para o contexto deste arquivo, se não vierem de @prenota/actions
interface Prenota {
  REC: number | string; // O payload espera number, então prenotaSelecionada.REC será convertido
}
interface RevisarDialogProps {
  prenotaSelecionada: Prenota | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

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

  const resetFormFieldsAndCloseDialog = () => {
    setRevisarText("");
    setEmailTags([]);
    onOpenChange(false); // Fecha o diálogo
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      // Resetar estados ao fechar o diálogo se não estiver pendente uma ação
      if (!isPending) {
        setRevisarText("");
        setEmailTags([]);
        setActionInProgress(null);
      }
    }
    onOpenChange(open);
  };

  const handleFormSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!prenotaSelecionada) return;

    if (!revisarText.trim()) {
      toast.error("Por favor, descreva o motivo da revisão.");
      return;
    }
    setActionInProgress("form");
    const toastId = toast.loading(
      `Enviando observação para REC ${prenotaSelecionada.REC}...`
    );

    // Constrói o payload conforme RevisaoPreNotaPayload de revisar.types.ts
    const payload: RevisaoPreNotaPayload & { toastId: string | number } = {
      RECSF1: Number(prenotaSelecionada.REC), // Correto: number
      REVISAR: revisarText, // Correto: string
      USER: username, // Correto: string
      EMAILS: emailTags.length > 0 ? emailTags.join(";") : undefined, // Correto: string ou undefined
      FINALIZADO: false, // Correto: boolean false para enviar observação
      toastId,
    };
    solicitarRevisao(payload, {
      onSuccess: (data) => {
        if (data.Sucesso) {
          resetFormFieldsAndCloseDialog();
        }
        // O toast de sucesso/erro já é tratado pelo hook useRevisaoPreNota
      },
      onSettled: () => {
        setActionInProgress(null);
      },
    });
  };

  const handleFinalizarDiretamente = () => {
    if (!prenotaSelecionada) return;

    if (!username || !username.trim()) {
      toast.error(
        "Usuário não identificado. Não é possível finalizar a revisão."
      );
      return;
    }
    setActionInProgress("finalize");
    const toastId = toast.loading(
      `Finalizando revisão para REC ${prenotaSelecionada.REC}...`
    );

    const payload: RevisaoPreNotaPayload & { toastId: string | number } = {
      RECSF1: Number(prenotaSelecionada.REC), // Correto: number
      REVISAR: "Finalização direta da revisão acionada pelo sistema.", // Correto: string
      USER: username, // Correto: string
      EMAILS: emailTags.length > 0 ? emailTags.join(";") : undefined, // Mantido, caso queira notificar ao finalizar
      FINALIZADO: true, // <<< CORREÇÃO: boolean true para finalizar
      toastId,
    };
    solicitarRevisao(payload, {
      onSuccess: (data) => {
        if (data.Sucesso) {
          resetFormFieldsAndCloseDialog();
        }
      },
      onSettled: () => {
        setActionInProgress(null);
      },
    });
  };

  if (!isOpen || !prenotaSelecionada) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="max-w-2xl md:max-w-6xl lg:max-w-6xl max-h-[85vh] min-h-[55vh] flex flex-col p-0">
        {" "}
        {/* Removido p-0 duplicado */}
        <div className="flex flex-1 gap-0 md:gap-2 overflow-hidden">
          <div className="w-full md:w-1/2 h-full">
            {" "}
            {/* Adicionado h-full para consistência */}
            <HistoricoChatView
              recId={prenotaSelecionada.REC}
              currentLoggedInUsername={username}
            />
          </div>
          <form
            id="revisaoFormDialog" // Necessário para o botão type="submit" no FormFooter
            onSubmit={handleFormSubmit}
            className="flex flex-col flex-1 w-full"
          >
            {/* Div para permitir scroll apenas no conteúdo do formulário, se necessário */}
            <div className="flex-grow overflow-y-auto">
              <FormularioRevisaoFields
                revisarText={revisarText}
                setRevisarText={setRevisarText}
                emailTags={emailTags}
                setEmailTags={setEmailTags}
                isPending={isPending}
                rec={prenotaSelecionada.REC}
                actionInProgress={actionInProgress}
                username={username}
                handleFinalizarDiretamente={handleFinalizarDiretamente}
              />
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
