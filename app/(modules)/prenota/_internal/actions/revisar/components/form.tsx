/* prenota/revisar/FormularioRevisaoFields.tsx ------------------------- */
"use client";

import { FormFooter, type FormularioRevisaoFieldsProps } from "@/app/(modules)/prenota/_internal/actions";
import { InfoCircledIcon } from "@radix-ui/react-icons";
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

const FormField: React.FC<{
  label: string;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}> = ({ label, required, tooltip, children }) => (
  <div className="space-y-1.5">
    <Label className="flex gap-1 items-center">
      {label}
      {required && <span className="text-destructive">*</span>}
      {tooltip && (
        <Tooltip>
          <TooltipTrigger className="cursor-default ml-1">
            <InfoCircledIcon className="size-3.5 text-primary" />
          </TooltipTrigger>
          <TooltipContent>{tooltip}</TooltipContent>
        </Tooltip>
      )}
    </Label>
    {children}
  </div>
);

export const FormularioRevisaoFields: React.FC<
  FormularioRevisaoFieldsProps
> = ({
  revisarText,
  setRevisarText,
  emailTags,
  setEmailTags,
  isPending,
  rec,
  actionInProgress,
  username,
  handleFinalizarDiretamente,
}) => (
  <div className="space-y-6">
    <DialogHeader className="p-4 border-b">
      <DialogTitle>Adicionar Revisão • REC {rec}</DialogTitle>
    </DialogHeader>

    <FormField label="Descrição da Revisão" required>
      <Textarea
        name="revisarText"
        placeholder="Descreva o motivo da solicitação…"
        value={revisarText}
        onChange={(e) => setRevisarText(e.target.value)}
        disabled={isPending}
        required
        className="min-h-[110px] resize-none"
      />
    </FormField>

    <FormField
      label="E-mails em cópia"
      tooltip="Digite e pressione Enter ou vírgula para adicionar."
    >
      <InputTags
        value={emailTags}
        onChange={setEmailTags}
        placeholder="nome@empresa.com"
        disabled={isPending}
      />
    </FormField>

    <FormFooter
      isPending={isPending}
      actionInProgress={actionInProgress ?? "form"}
      username={username ?? ""}
      revisarText={revisarText}
      handleFinalizarDiretamente={handleFinalizarDiretamente ?? (() => {})}
    />
  </div>
);
