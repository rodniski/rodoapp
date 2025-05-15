"use client";
import { EditPrenotaButton } from "@prenota/editar";
import { getCurrentUsername } from "utils";
import React, { useState } from "react";
import {
  MenuItem,
  ActionsProps,
  useAnexoDownload,
  GanttDialog,
  RevisarDialog,
  DeletePrenotaButton,
  AttachmentItem,
} from "@prenota/actions";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "ui";
import {
  ExclamationTriangleIcon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";

export const Actions: React.FC<ActionsProps> = ({
  preNota,
  onDeleteSuccess,
}) => {
  const [isHistoricoOpen, setIsHistoricoOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  console.log(preNota.REC);
  const {
    attachments,
    isLoading: isLoadingAnexos,
    handleDownload,
  } = useAnexoDownload({ AnexoPath: preNota.Z07_CHAVE });

  const hasAttachments = attachments.length > 0;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-9 p-0 hover:text-primary">
            <span className="sr-only">Ações</span>
            <PlusCircledIcon className="size-6" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-56">
          {/* Anexos ----------------------------------------------------------- */}
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            {isLoadingAnexos
              ? "Anexos (Carregando…)"
              : hasAttachments
              ? "Anexos"
              : "Sem Anexos"}
          </DropdownMenuLabel>

          {hasAttachments &&
            attachments.map((attachment, index) => (
              <AttachmentItem
                key={attachment.Z07_PATH}
                attachment={attachment}
                onDownload={handleDownload}
                index={index}
              />
            ))}

          <DropdownMenuSeparator />

          {/* Sobre a Nota ----------------------------------------------------- */}
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Sobre a Nota
          </DropdownMenuLabel>

          <MenuItem
            label="Solicitar Revisão"
            icon={<ExclamationTriangleIcon className="size-4" />}
            onClick={() => setIsHistoricoOpen(true)}
          />
          <GanttDialog
            recsf1={preNota.REC}
            isOpen={isTimelineOpen}
            onOpenChange={setIsTimelineOpen}
          />
          <EditPrenotaButton rec={preNota.REC} usr={getCurrentUsername()} />

          <DropdownMenuSeparator />

          {/* Exclusão (componente isolado) ----------------------------------- */}
          <DeletePrenotaButton rec={preNota.REC} onDeleted={onDeleteSuccess} />
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogos ----------------------------------------------------------- */}
      <RevisarDialog
        prenotaSelecionada={preNota}
        isOpen={isHistoricoOpen}
        onOpenChange={setIsHistoricoOpen}
      />
    </>
  );
};
