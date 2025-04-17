"use client";

import React, { useState } from "react";
import { Input, Textarea, Button } from "ui";
import { Badge } from "ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import { toast } from "sonner";

interface SolicitacaoRevisaoProps {
  onSubmit: (data: {
    motivo: string;
    observacao: string;
    emails: string[];
  }) => void;
}

export const SolicitacaoRevisao: React.FC<SolicitacaoRevisaoProps> = ({
  onSubmit,
}) => {
  const [motivo, setMotivo] = useState("");
  const [observacao, setObservacao] = useState("");
  const [emails, setEmails] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação simples
    if (!motivo.trim()) {
      toast.error("O motivo da solicitação é obrigatório.");
      return;
    }

    // Envia os dados
    onSubmit({ motivo, observacao, emails });

    // Reseta o formulário
    setMotivo("");
    setObservacao("");
    setEmails([]);
    setEmailInput("");

    toast.success("Solicitação enviada!");
  };

  const addEmail = () => {
    const emailTrimmed = emailInput.trim();
    if (emailTrimmed && !emails.includes(emailTrimmed)) {
      setEmails([...emails, emailTrimmed]);
      setEmailInput("");
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter((email) => email !== emailToRemove));
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Solicitação de Revisão</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Motivo */}
        <div>
          <label htmlFor="motivo" className="block text-sm font-medium mb-1">
            Motivo da Solicitação *
          </label>
          <Textarea
            id="motivo"
            placeholder="Informe o motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            required
          />
        </div>

        {/* Emails */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Emails para cópia (opcional)
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="email"
              placeholder="Adicione um email e pressione Enter"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEmail()}
            />
            <Button
              type="button"
              onClick={addEmail}
              className="bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              Adicionar
            </Button>
          </div>
          {/* Lista de Emails como Badges */}
          <div className="flex flex-wrap gap-2 mt-2">
            {emails.map((email, idx) => (
              <Badge
                key={idx}
                variant="default"
                className="flex items-center gap-1"
              >
                {email}
                <Cross2Icon
                  className="cursor-pointer h-4 w-4 ml-1"
                  onClick={() => removeEmail(email)}
                />
              </Badge>
            ))}
          </div>
        </div>

        {/* Botão de Envio */}
        <div className="flex items-center justify-between pt-10">
          <Button type="submit" variant={"default"}>
            Enviar Solicitação
          </Button>
        </div>
      </form>
    </div>
  );
};