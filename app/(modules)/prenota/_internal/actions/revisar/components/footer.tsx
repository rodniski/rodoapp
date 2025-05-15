/* prenota/revisar/FormFooter.tsx --------------------------------------*/
"use client";

import { DialogFooter, Button } from "ui";
import { UpdateIcon } from "@radix-ui/react-icons";
import { FormFooterProps } from "@/app/(modules)/prenota/_internal/actions";

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
    <DialogFooter className="mt-auto shrink-0 border-t border-border p-4">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
        {/* —— Finalizar revisão —— */}
        <Button
          variant="destructive"
          disabled={!canFinish}
          onClick={handleFinalizarDiretamente}
          aria-busy={isFinishing}
          className="w-full min-w-[160px] sm:w-auto"
        >
          {renderLabel("Finalizar Revisão", "Finalizando…", isFinishing)}
        </Button>

        {/* —— Enviar observação —— */}
        <Button
          type="submit"
          form="revisaoFormDialog"
          disabled={!canSend}
          aria-busy={isSending}
          className="w-full min-w-[160px] sm:w-auto"
        >
          {renderLabel("Enviar Observação", "Enviando…", isSending)}
        </Button>
      </div>
    </DialogFooter>
  );
};
