"use client";

import { InfoCircledIcon } from "@radix-ui/react-icons";
import React from "react";
import {
  Label,
  Textarea,
  InputTags,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  DialogHeader,
  DialogTitle,
} from "ui";
import { FormularioRevisaoFieldsProps } from "@/app/(modules)/prenota/_lib/lib/types";

const FormField: React.FC<{
  label: string;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}> = ({ label, required, tooltip, children }) => (
  <div className="space-y-1.5">
    <Label>
      <div className="flex gap-1 items-center">
        <span>{label}</span>
        {required && <span className="text-destructive">*</span>}
        {tooltip && (
          <Tooltip>
            <TooltipTrigger className="flex gap-1 items-center cursor-default">
              <InfoCircledIcon className="text-primary size-4" />
              {!required && (
                <span className="text-xs text-muted-foreground">
                  (Opcional)
                </span>
              )}
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="text-accent-foreground bg-accent"
            >
              {tooltip}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </Label>
    {children}
  </div>
);

const FormularioRevisaoFields: React.FC<FormularioRevisaoFieldsProps> = ({
  revisarText,
  setRevisarText,
  emailTags,
  setEmailTags,
  isPending,
  rec,
}) => (
  <div className="space-y-6">
    <DialogHeader className="p-4 shrink-0 border-b border-border">
      <DialogTitle>Adicionar Revisão para Pré-Nota REC: {rec}</DialogTitle>
    </DialogHeader>

    <FormField label="Descrição da Revisão" required>
      <Textarea
        id="revisarTextDialog"
        name="revisarText"
        value={revisarText}
        onChange={(e) => setRevisarText(e.target.value)}
        placeholder="Descreva detalhadamente o motivo da solicitação de revisão..."
        disabled={isPending}
        required
        className="flex-grow resize-none min-h-[100px] flex-1 h-full"
      />
    </FormField>
    <FormField
      label="E-mails de Cópia"
      tooltip="Adicione e-mails com Enter, Tab ou Vírgula"
    >
      <InputTags
        id="emailsDialog"
        value={emailTags}
        onChange={setEmailTags}
        placeholder="Digite um e-mail e pressione Enter/vírgula..."
        disabled={isPending}
      />
    </FormField>
  </div>
);

export { FormularioRevisaoFields };
