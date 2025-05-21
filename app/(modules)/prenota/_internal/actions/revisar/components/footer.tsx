/* prenota/revisar/FormFooter.tsx --------------------------------------*/
"use client";

import {
  DialogFooter,
  Button,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "ui";
import { UpdateIcon } from "@radix-ui/react-icons";
import { FormFooterProps } from "@prenota/actions";

export const FormFooter: React.FC<FormFooterProps> = ({
  isPending,
  actionInProgress,
  username,
  revisarText,
  handleFinalizarDiretamente,
}) => {
  /* estados derivados -------------------------------------------------- */
  const isFinishing = actionInProgress === "finalize" && isPending;
  const isSending = actionInProgress === "form" && isPending;

  const canFinish = !isPending && !!username.trim();
  const canSend = !isPending && !!username.trim() && !!revisarText.trim();
  const finishReason = !username.trim()
    ? "Usuário não identificado."
    : undefined;

  const sendReason = !username.trim()
    ? "Usuário não identificado."
    : !revisarText.trim()
    ? "Descreva o motivo da revisão."
    : undefined;
  /* helpers para conteúdo do botão ------------------------------------- */
  const renderLabel = (label: string, loading: string, spinning: boolean) =>
    spinning ? (
      <>
        <UpdateIcon className="mr-2 size-4 animate-spin" />
        {loading}
      </>
    ) : (
      label
    );

  /* render -------------------------------------------------------------- */
  return (
    <DialogFooter className="mt-auto shrink-0 border-t border-border py-4">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
        {/* —— Finalizar revisão —— */}
        <Tooltip disableHoverableContent={!!canFinish}>
          <TooltipTrigger asChild>
            <span className="w-full sm:w-auto">
              <Button
                variant="destructive"
                disabled={!canFinish}
                onClick={handleFinalizarDiretamente}
                aria-busy={isFinishing}
                className="w-full min-w-[160px]"
              >
                {renderLabel("Finalizar Revisão", "Finalizando…", isFinishing)}
              </Button>
            </span>
          </TooltipTrigger>
          {finishReason && <TooltipContent>{finishReason}</TooltipContent>}
        </Tooltip>

        {/* —— Enviar observação —— */}
        <Tooltip disableHoverableContent={!!canSend}>
          <TooltipTrigger asChild>
            <span className="w-full sm:w-auto">
              <Button
                type="submit"
                form="revisaoFormDialog"
                disabled={!canSend}
                aria-busy={isSending}
                className="w-full min-w-[160px]"
              >
                {renderLabel("Enviar Observação", "Enviando…", isSending)}
              </Button>
            </span>
          </TooltipTrigger>
          {sendReason && <TooltipContent>{sendReason}</TooltipContent>}
        </Tooltip>
      </div>
    </DialogFooter>
  );
};
