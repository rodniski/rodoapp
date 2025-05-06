// src/components/FormularioRevisaoPreNota/FormularioRevisaoFields.tsx
// (Ou o nome/caminho que você estiver usando, ex: FormularioRevisaoPreNota.tsx se você não o renomeou para Fields)
"use client";

import React from "react"; // Import React para React.Dispatch e React.SetStateAction
import {
  Label,
  Textarea,
  InputTags,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "ui";
import { InfoCircledIcon } from "@radix-ui/react-icons";

interface FormularioRevisaoFieldsProps {
  revisarText: string;
  // Correção: Usar o tipo Dispatch completo para consistência e precisão
  setRevisarText: React.Dispatch<React.SetStateAction<string>>;
  emailTags: string[];
  // Correção: Esta é a principal correção para o erro que você reportou
  setEmailTags: React.Dispatch<React.SetStateAction<string[]>>;
  isPending: boolean;
}

const FormularioRevisaoFields: React.FC<FormularioRevisaoFieldsProps> = ({
  revisarText,
  setRevisarText,
  emailTags,
  setEmailTags,
  isPending,
}) => {
  return (
    <div className="space-y-6">
      {/* Campo REVISAR (Motivo/Descrição) */}
      <div className="space-y-1.5 flex flex-col flex-grow">
        <Label htmlFor="revisarTextDialog">
          Descrição da Revisão
          <span className="text-destructive">*</span>
        </Label>
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
      </div>

      {/* Campo EMAILS com InputTags */}
      <div className="space-y-1.5">
        <Label htmlFor="emailsDialog">
          <Tooltip>
            <TooltipTrigger className="flex gap-1 items-center cursor-default">
              <span>E-mails de Cópia</span>
              <InfoCircledIcon className="text-primary size-4" />
              <span className="text-xs text-muted-foreground">(Opcional)</span>
            </TooltipTrigger>
            <TooltipContent
              side="right"
              className="text-accent-foreground bg-accent"
            >
              Adicione e-mails com Enter, Tab ou Vírgula
            </TooltipContent>
          </Tooltip>
        </Label>
        <InputTags
          id="emailsDialog"
          value={emailTags}
          onChange={setEmailTags} // Agora setEmailTags tem o tipo correto
          placeholder="Digite um e-mail e pressione Enter/vírgula..."
          disabled={isPending}
        />
      </div>
    </div>
  );
};

export { FormularioRevisaoFields };
